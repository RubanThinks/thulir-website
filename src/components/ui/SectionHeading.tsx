import React from "react";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
  theme = "light",
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const isDark = theme === "dark";

  return (
    <div
      className={`max-w-3xl ${isCenter ? "mx-auto text-center" : "text-left"} mb-12 sm:mb-16 ${className}`}
    >
      {badge && (
        <span
          className={`inline-block text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-3.5 border ${
            isDark
              ? "bg-white/10 text-[#F4C542] border-white/20"
              : "bg-[#8F2638]/5 text-[#8F2638] border-[#8F2638]/15"
          }`}
        >
          {badge}
        </span>
      )}
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight ${
          isDark ? "text-white" : "text-[#101C3A]"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            isDark ? "text-white/80" : "text-[#64748B]"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
