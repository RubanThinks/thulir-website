import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE_NAME,
  SESSION_EXPIRATION_SECONDS,
  validateAdminCredentials,
  createSessionToken,
} from "@/lib/auth/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const username = (body?.username || body?.email || "").toString().trim();
    const password = (body?.password || "").toString().trim();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const validation = validateAdminCredentials(username, password);

    if (!validation.valid) {
      return NextResponse.json(
        { error: "Invalid username or password. Please verify your credentials." },
        { status: 401 }
      );
    }

    const sessionCookieValue = createSessionToken(validation.email);

    const response = NextResponse.json(
      {
        success: true,
        user: {
          uid: "admin-thulir",
          email: validation.email,
          role: "Administrator",
        },
      },
      { status: 200 }
    );

    // Set cookie on response
    response.cookies.set(ADMIN_SESSION_COOKIE_NAME, sessionCookieValue, {
      maxAge: SESSION_EXPIRATION_SECONDS,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    // Also set on cookieStore if available in request context
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
      // response.cookies already sets the Set-Cookie header
    }

    return response;
  } catch (error: unknown) {
    console.error("[Admin Auth Session Error]:", error);
    return NextResponse.json(
      {
        error: "Failed to authenticate administrator session.",
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
