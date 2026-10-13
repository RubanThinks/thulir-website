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

    // 1. If Firebase Admin SDK is fully configured with private key, use it
    if (isAdminConfigured()) {
      const adminAuth = getAdminAuth();
      if (adminAuth) {
        try {
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
        } catch (adminErr) {
          console.warn("[Admin Auth] Admin SDK token verify fallback:", adminErr);
        }
      }
    }

    // 2. Standard Firebase Client session handler (no Service Account key needed)
    if (!sessionCookieValue) {
      const parts = idToken.split(".");
      if (parts.length !== 3) {
        return NextResponse.json(
          { error: "Malformed Firebase authentication token." },
          { status: 400 }
        );
      }

      let payload: Record<string, any>;
      try {
        payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf8"));
      } catch {
        return NextResponse.json(
          { error: "Could not parse Firebase authentication token payload." },
          { status: 400 }
        );
      }

      uid = payload.sub || payload.user_id;
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

      const sessionPayload = {
        uid,
        email,
        role: "Administrator",
        idToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + SESSION_EXPIRATION_MS,
      };

      sessionCookieValue = Buffer.from(JSON.stringify(sessionPayload)).toString("base64");
    }

    // Set secure HTTP-only session cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE_NAME, sessionCookieValue, {
      maxAge: SESSION_EXPIRATION_SECONDS,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json(
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
  } catch (error: unknown) {
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
        message: process.env.NODE_ENV !== "production" ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

    if (sessionCookie) {
      const adminAuth = getAdminAuth();
      if (adminAuth) {
        try {
          const decoded = await adminAuth.verifySessionCookie(sessionCookie);
          await adminAuth.revokeRefreshTokens(decoded.sub);
        } catch {
          // Cookie might already be expired; continue clearing cookie
        }
      }
    }

    cookieStore.delete({
      name: ADMIN_SESSION_COOKIE_NAME,
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch {
    // Ensure cookie is still deleted
    const cookieStore = await cookies();
    cookieStore.delete({
      name: ADMIN_SESSION_COOKIE_NAME,
      path: "/",
    });
    return NextResponse.json({ success: true });
  }
}
