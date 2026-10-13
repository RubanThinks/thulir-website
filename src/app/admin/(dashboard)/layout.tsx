import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth/admin";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";
import { ShieldAlert } from "lucide-react";
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

    // Default redirect for unauthenticated visitors
    redirect("/admin/login");
  }

  return (
    <AdminLayoutClient userEmail={sessionResult.user.email}>
      {children}
    </AdminLayoutClient>
  );
}
