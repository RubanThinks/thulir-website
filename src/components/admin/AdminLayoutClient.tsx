"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ShieldCheck } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminSignOutButton } from "./AdminSignOutButton";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userEmail: string | null;
}

export function AdminLayoutClient({ children, userEmail }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F1F4F9] flex">
      {/* Sidebar Navigation */}
      <AdminSidebar
        userEmail={userEmail}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#2D3748] hover:bg-[#F1F4F9] focus:outline-none"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Official Logo in Circular Placeholder */}
            <Link href="/admin" className="lg:hidden flex items-center shrink-0">
              <div className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center p-0.5 overflow-hidden relative">
                <Image
                  src="/assets/branding/logo.png"
                  alt="Thulir Special School Official Logo"
                  fill
                  sizes="32px"
                  className="object-contain p-0.5"
                  priority
                />
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#101C3A]/5 text-[#101C3A]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8F2638]" />
                <span className="hidden sm:inline">Protected Admin Workspace</span>
                <span className="sm:hidden">Admin</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {userEmail && (
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-[#101C3A] leading-tight">
                  {userEmail}
                </span>
                <span className="text-[10px] text-[#64748B] font-medium">
                  Authorized Administrator
                </span>
              </div>
            )}
            <AdminSignOutButton variant="header" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
