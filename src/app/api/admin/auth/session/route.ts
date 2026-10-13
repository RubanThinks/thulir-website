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

    if (!isAdminConfigured()) {
      return NextResponse.json(
        {
          error:
            "Firebase Admin SDK is not configured on the server. Please configure FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY in .env.local to issue secure session cookies.",
          code: "ADMIN_SDK_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    const adminAuth = getAdminAuth();
    if (!adminAuth) {
      return NextResponse.json(
        {
          error: "Failed to initialize server-side Firebase Admin authentication.",
          code: "ADMIN_AUTH_INIT_FAILED",
        },
        { status: 500 }
      );
    }

    // Verify the client's ID token on the server
    const decodedToken = await adminAuth.verifyIdToken(idToken, true);
    const email = decodedToken.email || null;
    const hasAdminClaim = decodedToken.admin === true;

    // Check authorization: must have custom claim or be in ADMIN_EMAILS list
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

    // Create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRATION_MS,
    });

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE_NAME, sessionCookie, {
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
          uid: decodedToken.uid,
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
