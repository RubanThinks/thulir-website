import { NextResponse } from "next/server";
import { verifyAdminSession, getAuthorizedAdminEmails } from "@/lib/auth/admin";

export async function GET() {
  const session = await verifyAdminSession();

  return NextResponse.json({
    status: "ok",
    authorizedUsersCount: getAuthorizedAdminEmails().length,
    session: session.authenticated
      ? {
          authenticated: true,
          email: session.user.email,
          role: session.user.role,
        }
      : {
          authenticated: false,
          reason: session.reason,
        },
  });
}
