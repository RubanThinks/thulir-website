"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Bell,
  Phone,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [bannerActive, setBannerActive] = useState(false);
  const [bannerText, setBannerText] = useState("");
  const [bannerLink, setBannerLink] = useState("");

  const [primaryPhone, setPrimaryPhone] = useState("+91 97901 81890");
  const [whatsappNumber, setWhatsappNumber] = useState("+91 97901 81890");
  const [contactEmail, setContactEmail] = useState("thulirspecialschool@gmail.com");

  const [heroHeading, setHeroHeading] = useState("Personalized Care for Every Child's Development.");
  const [heroSubheading, setHeroSubheading] = useState(
    "A Place of Training, Therapy and Specialized Education in Coimbatore."
  );

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/content");
        if (res.ok) {
          const data = await res.json();
          const s = data.settings;
          if (s) {
            setBannerActive(Boolean(s.announcementBanner?.isActive));
            setBannerText(s.announcementBanner?.text || "");
            setBannerLink(s.announcementBanner?.linkUrl || "");
            if (s.primaryPhone) setPrimaryPhone(s.primaryPhone);
            if (s.whatsappNumber) setWhatsappNumber(s.whatsappNumber);
            if (s.contactEmail) setContactEmail(s.contactEmail);
            if (s.heroHeading) setHeroHeading(s.heroHeading);
            if (s.heroSubheading) setHeroSubheading(s.heroSubheading);
          }
        }
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryPhone,
          whatsappNumber,
          contactEmail,
          announcementBanner: {
            isActive: bannerActive,
            text: bannerText,
            linkUrl: bannerLink,
          },
          heroHeading,
          heroSubheading,
        }),
      });

      if (!res.ok) throw new Error("Failed to save settings.");

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#101C3A] font-[var(--font-heading)] flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#8F2638]" />
          Site Settings &amp; Content Management
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Configure emergency banners, campus helpline numbers, and homepage content highlights.
        </p>
      </div>

      {loading ? (
        <div className="p-16 text-center text-[#64748B] bg-white rounded-2xl border border-[#E2E8F0]">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-[#101C3A]" />
          <p className="text-xs font-medium">Loading settings...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Settings updated successfully!</span>
            </div>
          )}

          {/* 1. Emergency / Announcement Banner */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#8F2638]" />
                <h2 className="text-sm font-bold text-[#101C3A]">Sitewide Announcement Banner</h2>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerActive}
                  onChange={(e) => setBannerActive(e.target.checked)}
                  className="rounded text-[#8F2638] focus:ring-[#8F2638]"
                />
                <span className="font-semibold text-xs text-[#2D3748]">
                  {bannerActive ? "Banner Active" : "Banner Hidden"}
                </span>
              </label>
            </div>

            <div>
              <label className="block font-semibold text-[#101C3A] mb-1">Banner Announcement Text</label>
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="e.g., Admissions Open for Academic Year 2026-2027. Early assessment appointments available."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#101C3A] mb-1">Optional Destination Link</label>
              <input
                type="text"
                value={bannerLink}
                onChange={(e) => setBannerLink(e.target.value)}
                placeholder="e.g., /contact or https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
              />
            </div>
          </div>

          {/* 2. Official Coordinates */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-4">
              <Phone className="w-4 h-4 text-[#101C3A]" />
              <h2 className="text-sm font-bold text-[#101C3A]">School Contact Coordinates</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#101C3A] mb-1">Primary Campus Phone</label>
                <input
                  type="text"
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  placeholder="+91 97901 81890"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#101C3A] mb-1">WhatsApp Helpline</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+91 97901 81890"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#101C3A] mb-1">Administrative Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="thulirspecialschool@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                />
              </div>
            </div>
          </div>

          {/* 3. Homepage Headline Highlights */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-4">
              <Sparkles className="w-4 h-4 text-[#F4C542]" />
              <h2 className="text-sm font-bold text-[#101C3A]">Homepage Key Highlights</h2>
            </div>

            <div>
              <label className="block font-semibold text-[#101C3A] mb-1">Focus Headline</label>
              <input
                type="text"
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                placeholder="Key heading displayed to visitors"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#101C3A] mb-1">Focus Subheading</label>
              <textarea
                rows={2}
                value={heroSubheading}
                onChange={(e) => setHeroSubheading(e.target.value)}
                placeholder="Supporting description..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#101C3A] hover:bg-[#1A2E5A] disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Settings...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-[#F4C542]" />
                  <span>Save Site Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
