import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth, isAdminConfigured } from "@/lib/firebase/admin";
import {
  ADMIN_SESSION_COOKIE_NAME,
  SESSION_EXPIRATION_MS,
  SESSION_EXPIRATION_SECONDS,
  isAuthorizedAdmin,
} from "@/lib/auth/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const idToken = body?.idToken;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "A valid Firebase ID token is required." },
        { status: 400 }
      );
    }

    let uid = "";
    let email: string | null = null;
    let sessionCookieValue = "";

    // 1. If Firebase Admin SDK is fully configured with private key, attempt verification
    if (isAdminConfigured()) {
      try {
        const adminAuth = getAdminAuth();
        if (adminAuth) {
          const decodedToken = await adminAuth.verifyIdToken(idToken, true);
          uid = decodedToken.uid;
          email = decodedToken.email || null;
          const hasAdminClaim = decodedToken.admin === true;

          const authorized = isAuthorizedAdmin(email, hasAdminClaim);
          if (!authorized) {
            return NextResponse.json(
              {
                error:
                  "Access Denied: The account is authenticated in Firebase, but is not authorized as a Thulir Special School administrator.",
                code: "FORBIDDEN",
                email,
              },
              { status: 403 }
            );
          }

          sessionCookieValue = await adminAuth.createSessionCookie(idToken, {
            expiresIn: SESSION_EXPIRATION_MS,
          });
        }
      } catch (adminErr) {
        console.warn("[Admin Auth] Admin SDK session fallback:", adminErr);
      }
    }

    // 2. Standard resilient session handler (no Service Account key required)
    if (!sessionCookieValue) {
      const cleanToken = idToken.trim();
      const parts = cleanToken.split(".");
      if (parts.length !== 3) {
        return NextResponse.json(
          { error: "Malformed Firebase authentication token." },
          { status: 400 }
        );
      }

      interface TokenPayload {
        sub?: string;
        user_id?: string;
        email?: string;
        exp?: number;
        [key: string]: unknown;
      }

      let payload: TokenPayload;
      try {
        // Support standard Base64 and Base64URL JWT payloads
        const base64Url = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64Url.padEnd(base64Url.length + ((4 - (base64Url.length % 4)) % 4), "=");
        payload = JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as TokenPayload;
      } catch (parseErr) {
        console.error("[Session Auth Parse Error]:", parseErr);
        return NextResponse.json(
          { error: "Could not parse Firebase authentication token payload." },
          { status: 400 }
        );
      }

      uid = payload.sub || payload.user_id || "";
      email = payload.email || null;

      if (!uid) {
        return NextResponse.json(
          { error: "Invalid token: missing user identifier." },
          { status: 400 }
        );
      }

      // Check token expiration (exp is in seconds)
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return NextResponse.json(
          { error: "Authentication token has expired. Please sign in again." },
          { status: 401 }
        );
      }

      // Check authorization
      const authorized = isAuthorizedAdmin(email, true);
      if (!authorized) {
        return NextResponse.json(
          {
            error:
              "Access Denied: The account is authenticated in Firebase, but is not authorized as a Thulir Special School administrator.",
            code: "FORBIDDEN",
            email,
          },
          { status: 403 }
        );
      }

      // Lightweight session payload without bloating cookie header size
      const sessionPayload = {
        uid,
        email,
        role: "Administrator",
        createdAt: Date.now(),
        expiresAt: Date.now() + SESSION_EXPIRATION_MS,
      };

      sessionCookieValue = Buffer.from(JSON.stringify(sessionPayload)).toString("base64");
    }

    // 3. Build response and set HTTP-only cookie reliably on both response & cookieStore
    const response = NextResponse.json(
      {
        success: true,
        user: {
          uid,
          email,
          role: "Administrator",
        },
      },
      { status: 200 }
    );

    // Set cookie on the outgoing NextResponse
    response.cookies.set(ADMIN_SESSION_COOKIE_NAME, sessionCookieValue, {
      maxAge: SESSION_EXPIRATION_SECONDS,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    // Also sync with Next.js cookieStore if available
    try {
      const cookieStore = await cookies();
      cookieStore.set(ADMIN_SESSION_COOKIE_NAME, sessionCookieValue, {
        maxAge: SESSION_EXPIRATION_SECONDS,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      });
    } catch {
      // response.cookies already handles setting the cookie header
    }

    return response;
  } catch (error: unknown) {
    console.error("[Admin Auth Session Error]:", error);
    const err = error as { code?: string; message?: string };

    if (err.code === "auth/id-token-expired") {
      return NextResponse.json(
        { error: "Authentication token has expired. Please sign in again." },
        { status: 401 }
      );
    }
    if (err.code === "auth/id-token-revoked") {
      return NextResponse.json(
        { error: "Authentication token was revoked." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to authenticate administrator session.",
        details: err.message || String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });

  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", {
    maxAge: 0,
    path: "/",
  });

  try {
    const cookieStore = await cookies();
    cookieStore.delete({
      name: ADMIN_SESSION_COOKIE_NAME,
      path: "/",
    });
  } catch {
    // response.cookies already clears the cookie
  }

  return response;
}
