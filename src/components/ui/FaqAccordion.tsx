"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className="border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden transition-all shadow-xs"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#101C3A] hover:text-[#8F2638] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#101C3A]"
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 shrink-0 text-[#64748B] transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-[#8F2638]" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm text-[#4A5568] leading-relaxed border-t border-[#E2E8F0]/60 pt-4">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
