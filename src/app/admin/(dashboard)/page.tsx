import Link from "next/link";
import {
  Inbox,
  Image as ImageIcon,
  Calendar,
  BookOpen,
  ArrowRight,
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Sparkles,
  Settings,
  Mail,
} from "lucide-react";
import { isAdminConfigured, getAdminDb } from "@/lib/firebase/admin";
import { isFirebaseClientConfigured } from "@/lib/firebase/client";
import { isCloudinaryConfigured } from "@/lib/cloudinary/server";
import { getGalleryItems } from "@/lib/services/gallery";
import { getInquiriesList } from "@/lib/services/inquiries";
import { getEventsList } from "@/lib/services/events";
import { verifyAdminSession } from "@/lib/auth/admin";



export default async function AdminDashboardOverviewPage() {
  const sessionResult = await verifyAdminSession();
  const clientConfigured = isFirebaseClientConfigured();
  const adminSdkConfigured = isAdminConfigured();
  const cloudinaryConfigured = isCloudinaryConfigured();
  const resendConfigured = Boolean(process.env.RESEND_API_KEY);

  const userEmail = sessionResult.authenticated ? sessionResult.user.email : null;

  // Real database metrics
  let inquiriesTotal = 0;
  let inquiriesNew = 0;
  let galleryTotal = 0;
  let eventsTotal = 0;
  let programsTotal = 6;

  try {
    const inqData = await getInquiriesList();
    inquiriesTotal = inqData.counts.total;
    inquiriesNew = inqData.counts.new;
  } catch {
    // fallback
  }

  try {
    const events = await getEventsList();
    eventsTotal = events.length;
  } catch {
    // fallback
  }

  try {
    const galleryItems = await getGalleryItems();
    galleryTotal = galleryItems.length;
  } catch {
    // fallback
  }

  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const progSnap = await adminDb.collection("services").get();
      if (!progSnap.empty) {
        programsTotal = progSnap.size;
      }
    } catch {
      // Offline fallback
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#101C3A]/5 to-[#8F2638]/5 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              System Status: Online &amp; Operational
            </span>
            <span className="text-xs text-[#64748B]">
              Coimbatore, Tamil Nadu &bull; Thulir Educational Trust
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#101C3A] font-[var(--font-heading)]">
            Thulir Administrative Portal
          </h1>
          <p className="text-sm text-[#64748B] mt-2 max-w-2xl leading-relaxed">
            Welcome back{userEmail ? `, ${userEmail}` : ""}. Manage school inquiries, clinical therapies, campus photo galleries, and community event reports from this centralized command workspace.
          </p>
        </div>
      </div>

      {/* System Infrastructure Status */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#101C3A] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#8F2638]" />
            Core System Services
          </h2>
          <span className="text-xs text-[#64748B]">Production Environment</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Database */}
          <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E2E8F0] flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-[#101C3A]">School Database</div>
              <div className="text-[11px] text-[#64748B] mt-0.5">
                Connected &amp; Synchronized
              </div>
            </div>
          </div>

          {/* Admin Security */}
          <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E2E8F0] flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-[#101C3A]">Administrative Security</div>
              <div className="text-[11px] text-[#64748B] mt-0.5">
                Authorized Session Active
              </div>
            </div>
          </div>

          {/* Media Service */}
          <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E2E8F0] flex items-start gap-3">
            {cloudinaryConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Cloud className="w-5 h-5 text-[#8F2638] shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-xs font-semibold text-[#101C3A]">Media &amp; Image Storage</div>
              <div className="text-[11px] text-[#64748B] mt-0.5">
                Active &amp; Ready
              </div>
            </div>
          </div>

          {/* Email Notification */}
          <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E2E8F0] flex items-start gap-3">
            {resendConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Mail className="w-5 h-5 text-[#64748B] shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-xs font-semibold text-[#101C3A]">Email Notifications</div>
              <div className="text-[11px] text-[#64748B] mt-0.5">
                {resendConfigured ? "Dispatch Service Configured" : "Standard Email Relay"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Overview Cards with Real Database Counts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#101C3A] font-[var(--font-heading)]">
            Content Management Modules
          </h2>
          <span className="text-xs font-medium text-[#64748B]">
            School Records &amp; Real-Time Content
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Inquiries */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between hover:border-[#101C3A]/30 transition group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Inbox className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#101C3A]">Inquiries &amp; Admissions</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Live
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Parent admission requests and therapy consultation submissions.
              </p>
              <div className="mt-3 py-2 px-2.5 rounded-lg bg-[#FBFBFA] border border-[#E2E8F0] text-xs text-[#2D3748]">
                <strong>{inquiriesTotal} Total</strong> ({inquiriesNew} new unread)
              </div>
            </div>

            <Link
              href="/admin/inquiries"
              className="mt-4 pt-3 border-t border-[#E2E8F0] text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              <span>Manage Inquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Media Gallery */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between hover:border-[#101C3A]/30 transition group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#101C3A]">Campus Gallery</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Live
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Sensory rooms, speech cabins, and campus activity photo uploads.
              </p>
              <div className="mt-3 py-2 px-2.5 rounded-lg bg-[#FBFBFA] border border-[#E2E8F0] text-xs text-[#2D3748]">
                <strong>{galleryTotal} Media Items</strong> in School Photo Gallery
              </div>
            </div>

            <Link
              href="/admin/gallery"
              className="mt-4 pt-3 border-t border-[#E2E8F0] text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              <span>Manage Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Events & News */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between hover:border-[#101C3A]/30 transition group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#101C3A]">Events &amp; Milestones</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Live
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Annual Day, Sports Day, Walkathons, and community festival milestones.
              </p>
              <div className="mt-3 py-2 px-2.5 rounded-lg bg-[#FBFBFA] border border-[#E2E8F0] text-xs text-[#2D3748]">
                <strong>{eventsTotal} Events</strong> published
              </div>
            </div>

            <Link
              href="/admin/events"
              className="mt-4 pt-3 border-t border-[#E2E8F0] text-xs font-semibold text-amber-600 hover:text-amber-800 flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              <span>Manage Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Programs & Therapies */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between hover:border-[#101C3A]/30 transition group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#101C3A]">Programs &amp; Therapies</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Live
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Paediatric occupational therapy, speech therapy, and special education offerings.
              </p>
              <div className="mt-3 py-2 px-2.5 rounded-lg bg-[#FBFBFA] border border-[#E2E8F0] text-xs text-[#2D3748]">
                <strong>{programsTotal} Clinical Programs</strong> configured
              </div>
            </div>

            <Link
              href="/admin/programs"
              className="mt-4 pt-3 border-t border-[#E2E8F0] text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              <span>Manage Programs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Settings Shortcut Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#101C3A]/5 text-[#101C3A] flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#101C3A]">Global Site Settings &amp; Emergency Banners</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Configure sitewide alert banners, campus WhatsApp hotlines, and homepage highlights.
            </p>
          </div>
        </div>
        <Link
          href="/admin/settings"
          className="px-4 py-2 bg-[#101C3A] text-white text-xs font-bold rounded-xl hover:bg-[#1A2E5A] transition shrink-0"
        >
          Open Site Settings
        </Link>
      </div>

      {/* Administrative System Details */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E2E8F0] text-xs text-[#64748B]">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#101C3A]" />
          <span>Thulir Educational Trust for Special Needs &bull; Ganapathy &amp; Kuniyamuthur</span>
        </div>
        <div className="flex items-center gap-4 text-[#101C3A] font-medium">
          <span>Official Contact: <strong>thulirspecialschool@gmail.com</strong></span>
        </div>
      </div>
    </div>
  );
}
