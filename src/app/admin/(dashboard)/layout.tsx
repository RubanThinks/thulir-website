import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth/admin";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
export const instant = false;

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionResult = await verifyAdminSession();

  if (!sessionResult.authenticated) {
    redirect("/admin/login");
  }

  return (
    <AdminLayoutClient userEmail={sessionResult.user.email}>
      {children}
    </AdminLayoutClient>
  );
}
