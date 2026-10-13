"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Menu, X, ChevronRight, MapPin } from "lucide-react";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* 1. TOP TRUST & ANNOUNCEMENT BAR */}
      <div className="bg-[#101C3A] text-white/90 text-xs py-2 px-4 border-b border-white/10 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5 sm:gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-block w-2 h-2 rounded-full bg-[#F4C542] shrink-0" />
            <span className="font-medium tracking-tight">
              <strong>Thulir Educational Trust for Special Needs</strong> • Rathinapuri &amp; Kuniyamuthur, Coimbatore
            </span>
          </div>
          <div className="flex items-center gap-3 text-white/80 text-[11px] sm:text-xs">
            <span className="hidden md:inline font-normal">Individualized Therapy &amp; Inclusive Education</span>
            <span className="hidden md:inline text-white/30">•</span>
            <Link
              href="/contact"
              className="text-[#F4C542] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Schedule a Visit</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-3 py-1 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#101C3A] rounded-lg"
            aria-label="Thulir Special School Home"
          >
            <div className="relative w-44 sm:w-52 h-14 transition-transform group-hover:scale-[1.02]">
              <Image
                src="/assets/branding/logo.png"
                alt="Thulir Special School and Therapy Centre Logo"
                fill
                sizes="(max-width: 640px) 176px, 208px"
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#2D3748]"
            aria-label="Primary Navigation"
          >
            {siteConfig.navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors py-1.5 border-b-2 font-medium ${
                    isActive
                      ? "text-[#101C3A] border-[#8F2638] font-bold"
                      : "text-[#2D3748] border-transparent hover:text-[#8F2638] hover:border-[#8F2638]/40"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/contact"
              className="bg-[#F4C542] hover:bg-[#E5B430] text-[#151515] font-bold px-4 sm:px-5 py-2.5 rounded-xl text-sm transition-all shadow-xs hover:shadow-md active:scale-95 flex items-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#101C3A]"
            >
              <span>Admissions Inquiry</span>
              <ChevronRight className="w-4 h-4 text-[#151515]" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#101C3A] hover:bg-[#F1F4F9] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#101C3A] transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* 3. ACCESSIBLE MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-50 lg:hidden flex flex-col bg-white"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Mobile Header Bar */}
          <div className="h-20 px-4 sm:px-6 flex items-center justify-between border-b border-[#E2E8F0] bg-white">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="relative w-40 h-12"
              aria-label="Thulir Special School Home"
            >
              <Image
                src="/assets/branding/logo.png"
                alt="Thulir Special School"
                fill
                className="object-contain object-left"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl text-[#101C3A] hover:bg-[#F1F4F9] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#101C3A]"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Navigation Menu</p>
            <nav className="flex flex-col space-y-2" aria-label="Mobile Menu Links">
              {siteConfig.navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-semibold py-3 px-3 rounded-xl transition-colors flex items-center justify-between ${
                      isActive
                        ? "bg-[#101C3A] text-white"
                        : "text-[#101C3A] hover:bg-[#F1F4F9]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className={`w-5 h-5 ${isActive ? "text-[#F4C542]" : "text-[#64748B]"}`} />
                  </Link>
                );
              })}
            </nav>

            {/* Campuses Quick Note */}
            <div className="pt-6 border-t border-[#E2E8F0] space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Our Campuses</p>
              <div className="bg-[#FBFBFA] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#2D3748] space-y-1">
                <p className="font-bold text-[#101C3A] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8F2638]" />
                  <span>Rathinapuri (Main Center) &amp; Kuniyamuthur</span>
                </p>
                <p className="text-[#64748B]">Coimbatore, Tamil Nadu, India</p>
              </div>
            </div>
          </div>

          {/* Mobile Footer CTA */}
          <div className="p-6 border-t border-[#E2E8F0] bg-[#FBFBFA]">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-[#F4C542] hover:bg-[#E5B430] text-[#151515] font-bold py-3.5 px-6 rounded-xl text-center block text-sm transition-all shadow-sm"
            >
              Book an Assessment / Inquiry
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
