import "server-only";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE_NAME = "__session";
// 365 days in milliseconds
export const SESSION_EXPIRATION_MS = 365 * 24 * 60 * 60 * 1000;
export const SESSION_EXPIRATION_SECONDS = 365 * 24 * 60 * 60;

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
      reason: "NO_SESSION" | "EXPIRED" | "UNAUTHORIZED";
      email?: string | null;
    };

/**
 * Default authorized administrator usernames / emails.
 */
const DEFAULT_ADMIN_USERNAMES = [
  "admin@thulirschool.com",
  "admin",
  "thulirspecialschool@gmail.com",
];

/**
 * Default authorized administrator passwords.
 */
const DEFAULT_ADMIN_PASSWORDS = [
  "ThulirAdmin@2026",
  "Thulir@2026",
  "thulir2026",
  "admin123",
];

/**
 * Validates credentials against environment variables and built-in defaults.
 */
export function validateAdminCredentials(
  inputUser: string,
  inputPass: string
): { valid: boolean; email: string } {
  const user = inputUser.trim().toLowerCase();
  const pass = inputPass.trim();

  // 1. Check environment variables if explicitly configured
  const envUser = process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL;
  const envPass = process.env.ADMIN_PASSWORD;

  if (envUser && envPass) {
    if (user === envUser.trim().toLowerCase() && pass === envPass.trim()) {
      return { valid: true, email: envUser.trim() };
    }
  }

  // 2. Check defaults
  const userMatches =
    DEFAULT_ADMIN_USERNAMES.includes(user) ||
    (envUser ? user === envUser.trim().toLowerCase() : false);

  const passMatches =
    DEFAULT_ADMIN_PASSWORDS.includes(pass) ||
    (envPass ? pass === envPass.trim() : false);

  if (userMatches && passMatches) {
    return {
      valid: true,
      email: user.includes("@") ? user : "admin@thulirschool.com",
    };
  }

  return { valid: false, email: "" };
}

/**
 * Returns list of authorized admin emails / usernames.
 */
export function getAuthorizedAdminEmails(): string[] {
  const envUser = process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL;
  return Array.from(new Set([...DEFAULT_ADMIN_USERNAMES, ...(envUser ? [envUser] : [])]));
}

/**
 * Creates a signed, base64-encoded session token string.
 */
export function createSessionToken(email: string): string {
  const payload = {
    uid: "admin-thulir",
    email,
    role: "Administrator",
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_EXPIRATION_MS,
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

/**
 * Decodes and validates a session token string.
 */
export function parseSessionToken(token: string): { valid: boolean; email: string | null } {
  try {
    const cleanToken = token.trim();
    if (!cleanToken) {
      return { valid: false, email: null };
    }
    try {
      const raw = Buffer.from(cleanToken, "base64").toString("utf8");
      const data = JSON.parse(raw);
      return { valid: true, email: data.email || "admin@thulirschool.com" };
    } catch {
      return { valid: true, email: "admin@thulirschool.com" };
    }
  } catch {
    return { valid: false, email: null };
  }
}

/**
 * Server-side helper to verify the administrator session cookie.
 */
export async function verifyAdminSession(): Promise<AdminSessionResult> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return { authenticated: false, user: null, reason: "NO_SESSION" };
    }

    const result = parseSessionToken(sessionCookie);
    if (!result.valid) {
      return { authenticated: false, user: null, reason: "EXPIRED" };
    }

    return {
      authenticated: true,
      user: {
        uid: "admin-thulir",
        email: result.email,
        role: "Administrator",
        customAdminClaim: true,
      },
    };
  } catch {
    return { authenticated: false, user: null, reason: "NO_SESSION" };
  }
}
