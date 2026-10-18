"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  MapPin,
  Clock,
  Upload,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  slug: string;
  eventDate: string;
  location: string;
  category: string;
  summary: string;
  detailedReport?: string;
  coverImageUrl?: string;
  participantCount?: number;
  isPublished: boolean;
  isArchived: boolean;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabFilter, setTabFilter] = useState<"all" | "upcoming" | "past">("all");

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formCategory, setFormCategory] = useState("celebration");
  const [formSummary, setFormSummary] = useState("");
  const [formReport, setFormReport] = useState("");
  const [formCoverImage, setFormCoverImage] = useState("");
  const [formParticipants, setFormParticipants] = useState<number | undefined>();
  const [formPublished, setFormPublished] = useState(true);
  const [formArchived, setFormArchived] = useState(false);

  // File Upload State
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/events");
      if (!res.ok) throw new Error("Failed to load events.");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/events");
        if (!res.ok) throw new Error("Failed to load events.");
        const data = await res.json();
        if (active) setEvents(data.events || []);
      } catch (err: unknown) {
        if (active) setError((err as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFileToUpload(null);
    setPreviewUrl("");
    setFormTitle("");
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormLocation("Coimbatore, Tamil Nadu");
    setFormCategory("celebration");
    setFormSummary("");
    setFormReport("");
    setFormCoverImage("");
    setFormParticipants(undefined);
    setFormPublished(true);
    setFormArchived(false);
    setFormError(null);
    setShowManualUrl(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (evt: EventItem) => {
    setEditingEvent(evt);
    setFileToUpload(null);
    setPreviewUrl(evt.coverImageUrl || "");
    setFormCoverImage(evt.coverImageUrl || "");
    setFormTitle(evt.title);
    setFormDate(evt.eventDate);
    setFormLocation(evt.location || "");
    setFormCategory(evt.category || "celebration");
    setFormSummary(evt.summary || "");
    setFormReport(evt.detailedReport || "");
    setFormParticipants(evt.participantCount);
    setFormPublished(evt.isPublished);
    setFormArchived(evt.isArchived);
    setFormError(null);
    setShowManualUrl(false);
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Only image files (JPEG, PNG, WebP) are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFormError("Image file size must be less than 10MB.");
      return;
    }

    setFileToUpload(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setFormCoverImage(objectUrl);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle.trim() || !formDate) {
      setFormError("Event title and date are required.");
      return;
    }

    setIsSubmitting(true);
    setIsUploading(true);
    setUploadProgress(25);

    try {
      const formData = new FormData();
      if (fileToUpload) {
        formData.append("file", fileToUpload);
      } else if (formCoverImage) {
        formData.append("coverImageUrl", formCoverImage);
      }
      formData.append("title", formTitle);
      formData.append("eventDate", formDate);
      formData.append("location", formLocation);
      formData.append("category", formCategory);
      formData.append("summary", formSummary);
      formData.append("detailedReport", formReport);
      if (formParticipants !== undefined) {
        formData.append("participantCount", String(formParticipants));
      }
      formData.append("isPublished", String(formPublished));
      formData.append("isArchived", String(formArchived));

      setUploadProgress(65);

      if (editingEvent) {
        const res = await fetch(`/api/admin/events/${editingEvent.id}`, {
          method: "PATCH",
          body: formData,
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to update event.");
        }
      } else {
        const res = await fetch("/api/admin/events", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to create event.");
        }
      }

      setUploadProgress(100);
      setModalOpen(false);
      await fetchEvents();
    } catch (err: unknown) {
      setFormError((err as Error).message);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleTogglePublish = async (evt: EventItem) => {
    try {
      const res = await fetch(`/api/admin/events/${evt.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !evt.isPublished }),
      });
      if (!res.ok) throw new Error("Failed to toggle publish status.");
      await fetchEvents();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (evt: EventItem) => {
    if (!confirm(`Are you sure you want to delete "${evt.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/events/${evt.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete event.");
      await fetchEvents();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const filteredEvents = events.filter((e) => {
    if (tabFilter === "upcoming") return e.eventDate >= todayStr;
    if (tabFilter === "past") return e.eventDate < todayStr;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#101C3A] font-[var(--font-heading)] flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#8F2638]" />
            School Events &amp; Community Milestones
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Publish Annual Day celebrations, Sports Day, Walkathons, and medical camp summaries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => fetchEvents()}
            disabled={loading}
            className="p-2 rounded-xl text-xs font-semibold bg-white border border-[#E2E8F0] text-[#2D3748] hover:bg-[#F1F4F9] transition"
            title="Refresh events"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#8F2638] text-white hover:bg-[#A83246] transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTabFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            tabFilter === "all"
              ? "bg-[#101C3A] text-white"
              : "bg-white text-[#2D3748] border border-[#E2E8F0] hover:bg-[#F1F4F9]"
          }`}
        >
          All Events ({events.length})
        </button>
        <button
          onClick={() => setTabFilter("upcoming")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            tabFilter === "upcoming"
              ? "bg-[#101C3A] text-white"
              : "bg-white text-[#2D3748] border border-[#E2E8F0] hover:bg-[#F1F4F9]"
          }`}
        >
          Upcoming ({events.filter((e) => e.eventDate >= todayStr).length})
        </button>
        <button
          onClick={() => setTabFilter("past")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            tabFilter === "past"
              ? "bg-[#101C3A] text-white"
              : "bg-white text-[#2D3748] border border-[#E2E8F0] hover:bg-[#F1F4F9]"
          }`}
        >
          Past Milestones ({events.filter((e) => e.eventDate < todayStr).length})
        </button>
      </div>

      {/* Events List View */}
      {loading ? (
        <div className="p-16 text-center text-[#64748B] bg-white rounded-2xl border border-[#E2E8F0]">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-[#101C3A]" />
          <p className="text-xs font-medium">Loading events...</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E2E8F0]">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[#101C3A]">Unable to load events</h3>
          <p className="text-xs text-[#64748B] mt-1">{error}</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-[#E2E8F0]">
          <div className="w-12 h-12 rounded-2xl bg-[#101C3A]/5 text-[#101C3A] flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#101C3A]">No events found</h3>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            Create an event to announce upcoming celebrations or archive past achievements.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 px-4 py-2 bg-[#101C3A] text-white text-xs font-semibold rounded-xl hover:bg-[#1A2E5A]"
          >
            Create Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((evt) => {
            const isUpcoming = evt.eventDate >= todayStr;
            return (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-2xs flex flex-col justify-between hover:border-[#101C3A]/30 transition group"
              >
                {evt.coverImageUrl ? (
                  <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={evt.coverImageUrl}
                      alt={evt.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                      unoptimized={Boolean(evt.coverImageUrl?.startsWith("data:") || evt.coverImageUrl?.startsWith("/uploads/"))}
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs ${
                          evt.isPublished
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-800/80 text-white"
                        }`}
                      >
                        {evt.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-24 bg-[#101C3A]/5 p-4 flex items-center justify-between border-b border-[#E2E8F0]">
                    <span className="text-[10px] uppercase font-bold text-[#8F2638] tracking-wider">
                      {evt.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        evt.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {evt.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#8F2638]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(evt.eventDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}</span>
                      {isUpcoming ? (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-100 text-blue-800 font-bold uppercase">
                          Upcoming
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-gray-100 text-gray-600 font-medium">
                          Past
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-[#101C3A] mt-1.5 leading-snug">
                      {evt.title}
                    </h3>

                    {evt.location && (
                      <div className="flex items-center gap-1 text-[11px] text-[#64748B] mt-1">
                        <MapPin className="w-3 h-3 text-[#64748B] shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    )}

                    {evt.summary && (
                      <p className="text-xs text-[#2D3748] mt-2 line-clamp-2 leading-relaxed">
                        {evt.summary}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                    <button
                      onClick={() => handleTogglePublish(evt)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#101C3A] hover:bg-[#F1F4F9] transition"
                      title={evt.isPublished ? "Unpublish event" : "Publish event"}
                    >
                      {evt.isPublished ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(evt)}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#101C3A] hover:bg-[#F1F4F9] transition"
                        title="Edit event"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(evt)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#101C3A]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FBFBFA]">
              <h2 className="text-base font-bold text-[#101C3A] font-[var(--font-heading)]">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#101C3A] hover:bg-[#E2E8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-[#101C3A] mb-1">
                  Event Title <span className="text-[#8F2638]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Annual Sports Day & Para-Athletic Meet"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#101C3A] mb-1">
                    Event Date <span className="text-[#8F2638]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#101C3A] mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white focus:outline-none focus:border-[#101C3A]"
                  >
                    <option value="celebration">Celebration / Annual Day</option>
                    <option value="sports">Sports Day &amp; Walkathon</option>
                    <option value="field-trip">Community Outing</option>
                    <option value="community">Community Awareness</option>
                    <option value="medical-camp">Medical &amp; Assessment Camp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#101C3A] mb-1">
                  Location / Venue
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Periyakulam Lake Road, Ukkadam, Coimbatore"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#101C3A] mb-1">
                  Summary / Brief Overview
                </label>
                <textarea
                  rows={2}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Brief summary displayed on cards..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#101C3A] mb-1">
                  Detailed Report / Highlights
                </label>
                <textarea
                  rows={4}
                  value={formReport}
                  onChange={(e) => setFormReport(e.target.value)}
                  placeholder="Full write-up of the event, chief guests, medals won, and parent reflections..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                />
              </div>

              {/* Cover Photo File Upload */}
              <div className="space-y-2">
                <label className="block font-semibold text-[#101C3A]">
                  Cover Image
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] p-3 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-36 h-28 shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-xs">
                      <Image
                        src={previewUrl}
                        alt="Event cover preview"
                        fill
                        unoptimized={previewUrl.startsWith("blob:")}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5 text-center sm:text-left">
                      <p className="text-xs font-bold text-[#101C3A] truncate">
                        {fileToUpload ? fileToUpload.name : "Current Event Cover"}
                      </p>
                      {fileToUpload && (
                        <p className="text-[11px] text-[#64748B]">
                          {(fileToUpload.size / (1024 * 1024)).toFixed(2)} MB &bull; Ready to upload
                        </p>
                      )}
                      <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#101C3A] text-white hover:bg-[#1A2E5A] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Change Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFileToUpload(null);
                            setPreviewUrl("");
                            setFormCoverImage("");
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-red-200 text-red-600 hover:bg-red-50 transition cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith("image/")) {
                        setFileToUpload(file);
                        const objUrl = URL.createObjectURL(file);
                        setPreviewUrl(objUrl);
                        setFormCoverImage(objUrl);
                      }
                    }}
                    className="border-2 border-dashed border-[#CBD5E1] hover:border-[#101C3A] bg-[#F8FAFC] hover:bg-white rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center text-[#101C3A] group-hover:scale-110 group-hover:text-[#8F2638] transition-transform mb-2.5">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#101C3A]">
                      Click to choose event cover photo or drag and drop
                    </p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      JPG, PNG, or WebP up to 10MB &bull; Uploads directly to secure media storage
                    </p>
                  </div>
                )}

                {/* Upload progress */}
                {isUploading && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                      <span className="flex items-center gap-1.5 font-medium">
                        <RefreshCw className="w-3 h-3 animate-spin text-[#8F2638]" />
                        Uploading photo...
                      </span>
                      <span className="font-bold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#101C3A] to-[#8F2638] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Optional Manual URL Link */}
                <div className="pt-1 text-right">
                  <button
                    type="button"
                    onClick={() => setShowManualUrl(!showManualUrl)}
                    className="text-[11px] text-[#64748B] hover:text-[#101C3A] underline"
                  >
                    {showManualUrl ? "Hide manual URL option" : "Or enter image URL manually"}
                  </button>
                  {showManualUrl && (
                    <div className="mt-2 text-left">
                      <input
                        type="url"
                        value={formCoverImage}
                        onChange={(e) => {
                          setFormCoverImage(e.target.value);
                          setPreviewUrl(e.target.value);
                        }}
                        placeholder="https://... or /assets/images/..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#101C3A] mb-1">
                  Participant Count
                </label>
                <input
                  type="number"
                  value={formParticipants || ""}
                  onChange={(e) => setFormParticipants(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                  placeholder="e.g. 1000"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                    className="rounded border-[#E2E8F0] text-[#101C3A]"
                  />
                  <span className="font-semibold text-[#2D3748]">Publish to Public Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formArchived}
                    onChange={(e) => setFormArchived(e.target.checked)}
                    className="rounded border-[#E2E8F0] text-gray-500"
                  />
                  <span className="font-semibold text-[#2D3748]">Mark as Archived</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-[#2D3748] font-semibold hover:bg-[#F1F4F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#101C3A] text-white font-bold hover:bg-[#1A2E5A] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F4C542]" />
                      <span>{editingEvent ? "Update Event" : "Create Event"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
