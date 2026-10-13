"use client";

import React from "react";
import { siteConfig } from "@/config/site";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  const whatsappNumber = siteConfig.contact.whatsappNumber;

  // As per requirements: If the business number is not confirmed, keep the feature disabled through configuration
  if (!whatsappNumber || whatsappNumber.trim() === "") {
    return null;
  }

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    "Hello Thulir Special School, I would like to inquire about admissions and therapy programs."
  )}`;

  return (
    <aside
      aria-label="WhatsApp Contact"
      className="fixed bottom-6 right-6 z-40 print:hidden"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Thulir Special School on WhatsApp"
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="hidden sm:inline text-xs font-bold tracking-tight">WhatsApp Us</span>
      </a>
    </aside>
  );
}
