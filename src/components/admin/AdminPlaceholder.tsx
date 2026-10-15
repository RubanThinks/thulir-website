import Link from "next/link";
import { LucideIcon, ArrowLeft, Clock, ShieldCheck } from "lucide-react";

interface AdminPlaceholderProps {
  title: string;
  description: string;
  phaseBadge: string;
  phaseSummary: string;
  icon: LucideIcon;
  targetCollection: string;
  plannedFeatures: string[];
}

export function AdminPlaceholder({
  title,
  description,
  phaseBadge,
  phaseSummary,
  icon: Icon,
  targetCollection,
  plannedFeatures,
}: AdminPlaceholderProps) {
  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#101C3A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#101C3A]/5 text-[#101C3A]">
          <Clock className="w-3.5 h-3.5 text-[#8F2638]" />
          {phaseBadge}
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#101C3A]/5 text-[#101C3A] flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[#101C3A] font-[var(--font-heading)]">
              {title}
            </h1>
            <p className="text-sm text-[#64748B] mt-1.5 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Status Callout */}
        <div className="mt-6 p-4 rounded-xl bg-[#FBFBFA] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#2D3748]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Module Key: <code className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0] font-mono">{targetCollection}</code></span>
          </div>
          <div className="text-xs font-medium text-[#64748B]">
            Status: Active &bull; {phaseBadge}
          </div>
        </div>

        {/* Planned Features */}
        <div className="mt-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
            Module Scope &bull; {phaseBadge}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plannedFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#F1F4F9]/60 border border-[#E2E8F0] text-xs text-[#2D3748] flex items-start gap-2.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <span>{phaseSummary}</span>
          <Link
            href="/admin"
            className="font-semibold text-[#101C3A] hover:underline"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
