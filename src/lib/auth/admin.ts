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
 * Returns authorized admin emails if configured in environment.
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
 * In this application, accounts created in Firebase Auth are administrators.
 */
export function isAuthorizedAdmin(email?: string | null, customAdminClaim?: boolean): boolean {
  if (customAdminClaim) return true;

  const authorizedList = getAuthorizedAdminEmails();
  if (authorizedList.length > 0 && email) {
    return authorizedList.includes(email.trim().toLowerCase());
  }

  // Any authenticated Firebase Auth account is authorized
  return true;
}

/**
 * Server-side helper to verify the administrator session.
 * Supports both standard Firebase client session tokens and Admin SDK cookies.
 */
export async function verifyAdminSession(): Promise<AdminSessionResult> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return { authenticated: false, user: null, reason: "NO_SESSION" };
  }

  // 1. Try Firebase Admin SDK verification if configured
  if (isAdminConfigured()) {
    try {
      const adminAuth = getAdminAuth();
      if (adminAuth) {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        const email = decodedClaims.email || null;
        const hasAdminClaim = decodedClaims.admin === true;

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
      }
    } catch {
      // Fall back to standard session parsing below
    }
  }

  // 2. Standard session parsing (no Service Account key required)
  try {
    let sessionData: { uid: string; email?: string | null; expiresAt?: number } | null = null;

    if (sessionCookie.startsWith("{") || sessionCookie.startsWith("%7B")) {
      sessionData = JSON.parse(decodeURIComponent(sessionCookie));
    } else {
      // Decode Base64 or Base64URL JWT payload
      const cleanCookie = sessionCookie.trim();
      const parts = cleanCookie.split(".");
      if (parts.length === 3) {
        const base64Url = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64Url.padEnd(base64Url.length + ((4 - (base64Url.length % 4)) % 4), "=");
        sessionData = JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
      } else {
        const base64Url = cleanCookie.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64Url.padEnd(base64Url.length + ((4 - (base64Url.length % 4)) % 4), "=");
        sessionData = JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
      }
    }

    if (!sessionData || !sessionData.uid) {
      return { authenticated: false, user: null, reason: "NO_SESSION" };
    }

    if (sessionData.expiresAt && sessionData.expiresAt < Date.now()) {
      return { authenticated: false, user: null, reason: "EXPIRED" };
    }

    const email = sessionData.email || null;
    const authorized = isAuthorizedAdmin(email, true);

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
        uid: sessionData.uid,
        email,
        role: "Administrator",
        customAdminClaim: true,
      },
    };
  } catch {
    return { authenticated: false, user: null, reason: "NO_SESSION" };
  }
}
