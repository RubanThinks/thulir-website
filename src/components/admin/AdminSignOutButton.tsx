"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { LogOut, Loader2 } from "lucide-react";

interface AdminSignOutButtonProps {
  variant?: "header" | "sidebar";
}

export function AdminSignOutButton({ variant = "header" }: AdminSignOutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // 1. Invalidate server session cookie
      await fetch("/api/admin/auth/session", {
        method: "DELETE",
      }).catch(() => {});

      // 2. Sign out client instance if available
      if (auth) {
        await auth.signOut().catch(() => {});
      }
    } finally {
      // 3. Redirect back to login screen
      router.push("/admin/login");
      router.refresh();
      setLoading(false);
    }
  };

  if (variant === "sidebar") {
    return (
      <button
        onClick={handleSignOut}
        disabled={loading}
        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer text-left"
        title="End administrative session"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          <LogOut className="w-4 h-4 shrink-0" />
        )}
        <span>{loading ? "Signing out..." : "Sign Out"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B] hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
      title="Sign Out"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      <span className="hidden sm:inline">{loading ? "Signing out..." : "Sign Out"}</span>
    </button>
  );
}
