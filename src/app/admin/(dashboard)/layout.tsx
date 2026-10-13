import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth/admin";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";
import { ShieldAlert, KeyRound } from "lucide-react";
import Link from "next/link";

export const instant = false;

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionResult = await verifyAdminSession();

  if (!sessionResult.authenticated) {
    if (sessionResult.reason === "UNAUTHORIZED") {
      return (
        <div className="min-h-screen bg-[#F1F4F9] flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-[#101C3A] font-[var(--font-heading)]">
              Access Denied
            </h1>
            <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
              You are signed in as <strong className="text-[#151515]">{sessionResult.email || "a Firebase user"}</strong>, but this account is not registered as an authorized administrator for Thulir Special School.
            </p>
            <div className="mt-6 p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-800 text-left">
              <strong className="block mb-1">To gain administrator access:</strong>
              1. Add this email address to <code className="bg-red-100 px-1 py-0.5 rounded">ADMIN_EMAILS</code> in your server environment variables, or<br />
              2. Assign the <code className="bg-red-100 px-1 py-0.5 rounded">admin: true</code> custom claim via Firebase Admin SDK.
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <AdminSignOutButton variant="header" />
              <Link
                href="/"
                className="text-xs font-semibold text-[#64748B] hover:text-[#101C3A] transition-colors py-2 px-3"
              >
                Return to Website
              </Link>
            </div>
          </div>
        </div>
      );
    }

    if (sessionResult.reason === "ADMIN_SDK_UNCONFIGURED") {
      return (
        <div className="min-h-screen bg-[#F1F4F9] flex flex-col items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-amber-200 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-[#101C3A] font-[var(--font-heading)]">
              Firebase Admin SDK Setup Required
            </h1>
            <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
              Protected administrative sessions require the server-side Firebase Admin SDK. The server is currently missing the Service Account credentials.
            </p>
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 text-left space-y-2">
              <strong className="block text-amber-900 font-semibold">How to configure:</strong>
              <p>1. Open Firebase Console &rarr; Project Settings &rarr; Service Accounts.</p>
              <p>2. Click <em>Generate new private key</em>.</p>
              <p>
                3. Add the values to <code className="bg-amber-100 px-1 py-0.5 rounded">.env.local</code>:
              </p>
              <pre className="bg-white/80 p-2 rounded text-[11px] overflow-x-auto border border-amber-200">
{`FIREBASE_ADMIN_PROJECT_ID=thulirschool-dee45
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."`}
              </pre>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link
                href="/admin/login"
                className="px-4 py-2 bg-[#101C3A] text-white text-xs font-semibold rounded-xl hover:bg-[#1A2E5A] transition-colors"
              >
                Go to Sign In
              </Link>
              <Link
                href="/"
                className="text-xs font-semibold text-[#64748B] hover:text-[#101C3A] transition-colors py-2 px-3"
              >
                Return to Website
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Default redirect for unauthenticated visitors
    redirect("/admin/login");
  }

  return (
    <AdminLayoutClient userEmail={sessionResult.user.email}>
      {children}
    </AdminLayoutClient>
  );
}
