"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Image as ImageIcon,
  Calendar,
  BookOpen,
  MessageSquareQuote,
  Settings,
  ExternalLink,
  School,
  X,
} from "lucide-react";
import { AdminSignOutButton } from "./AdminSignOutButton";

interface AdminSidebarProps {
  userEmail?: string | null;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Inquiries",
    href: "/admin/inquiries",
    icon: Inbox,
    badge: "Live",
  },
  {
    name: "Gallery",
    href: "/admin/gallery",
    icon: ImageIcon,
    badge: "Live",
  },
  {
    name: "Events",
    href: "/admin/events",
    icon: Calendar,
    badge: "Live",
  },
  {
    name: "Programs",
    href: "/admin/programs",
    icon: BookOpen,
    badge: "Live",
  },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
    badge: "Live",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    badge: "Live",
  },
];

export function AdminSidebar({ userEmail, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#101C3A]/40 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-[#E2E8F0] z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header / Brand */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#101C3A] text-[#F4C542] flex items-center justify-center font-bold shadow-sm group-hover:bg-[#8F2638] transition-colors">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#101C3A] leading-tight font-[var(--font-heading)]">
                Thulir School
              </div>
              <div className="text-[11px] font-semibold text-[#8F2638] tracking-wider uppercase">
                Admin Portal
              </div>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-[#64748B] hover:text-[#101C3A] hover:bg-[#F1F4F9]"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            Management Navigation
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#101C3A] text-white shadow-sm"
                    : "text-[#2D3748] hover:bg-[#F1F4F9] hover:text-[#101C3A]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-[#F4C542]" : "text-[#64748B]"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#F1F4F9] text-[#64748B] border border-[#E2E8F0]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Sign Out */}
        <div className="p-3.5 border-t border-[#E2E8F0] space-y-2">
          {userEmail && (
            <div className="px-3.5 py-2.5 rounded-xl bg-[#FBFBFA] border border-[#E2E8F0]">
              <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">
                Signed in as
              </div>
              <div
                className="text-xs font-semibold text-[#101C3A] truncate mt-0.5"
                title={userEmail}
              >
                {userEmail}
              </div>
            </div>
          )}

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#2D3748] hover:bg-[#F1F4F9] transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
              <span>View Public Site</span>
            </div>
            <span className="text-[10px] text-[#64748B]">New Tab</span>
          </Link>

          <AdminSignOutButton variant="sidebar" />
        </div>
      </aside>
    </>
  );
}
