import "server-only";
import { cookies } from "next/headers";
import { getAdminAuth, isAdminConfigured } from "../firebase/admin";

export const ADMIN_SESSION_COOKIE_NAME = "__session";
// 5 days in milliseconds
export const SESSION_EXPIRATION_MS = 5 * 24 * 60 * 60 * 1000;
export const SESSION_EXPIRATION_SECONDS = 5 * 24 * 60 * 60;

export interface AdminUser {
  uid: string;
  email: string | null;
  role: "Administrator";
  customAdminClaim: boolean;
}

export type AdminSessionResult =
  | {
      authenticated: true;
      user: AdminUser;
    }
  | {
      authenticated: false;
      user: null;
      reason: "NO_SESSION" | "EXPIRED" | "REVOKED" | "UNAUTHORIZED" | "ADMIN_SDK_UNCONFIGURED";
      email?: string | null;
    };

/**
 * Returns the list of authorized administrator emails from environment configuration.
 */
export function getAuthorizedAdminEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS || "";
  return envEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Determines whether a given email or custom claim is an authorized administrator.
 */
export function isAuthorizedAdmin(email?: string | null, customAdminClaim?: boolean): boolean {
  if (customAdminClaim) return true;
  if (!email) return false;

  const authorizedList = getAuthorizedAdminEmails();
  // If list is specified, check against it
  if (authorizedList.length > 0) {
    return authorizedList.includes(email.toLowerCase());
  }

  // If no email list is provided in environment, fallback to custom claim requirement
  return false;
}

/**
 * Server-side helper to verify the administrator session.
 * Used in server components, layouts, and route handlers.
 */
export async function verifyAdminSession(): Promise<AdminSessionResult> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return { authenticated: false, user: null, reason: "NO_SESSION" };
  }

  if (!isAdminConfigured()) {
    return {
      authenticated: false,
      user: null,
      reason: "ADMIN_SDK_UNCONFIGURED",
    };
  }

  const adminAuth = getAdminAuth();
  if (!adminAuth) {
    return {
      authenticated: false,
      user: null,
      reason: "ADMIN_SDK_UNCONFIGURED",
    };
  }

  try {
    // Verify session cookie with checkRevoked = true
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const email = decodedClaims.email || null;
    const hasAdminClaim = decodedClaims.admin === true;

    // Check authorization
    const authorized = isAuthorizedAdmin(email, hasAdminClaim);

    if (!authorized) {
      return {
        authenticated: false,
        user: null,
        reason: "UNAUTHORIZED",
        email,
      };
    }

    return {
      authenticated: true,
      user: {
        uid: decodedClaims.uid,
        email,
        role: "Administrator",
        customAdminClaim: hasAdminClaim,
      },
    };
  } catch (error: unknown) {
    const errorCode = (error as { code?: string })?.code;
    if (errorCode === "auth/session-cookie-expired") {
      return { authenticated: false, user: null, reason: "EXPIRED" };
    }
    if (errorCode === "auth/session-cookie-revoked") {
      return { authenticated: false, user: null, reason: "REVOKED" };
    }
    return { authenticated: false, user: null, reason: "NO_SESSION" };
  }
}
