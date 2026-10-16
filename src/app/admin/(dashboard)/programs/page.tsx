"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

interface ProgramItem {
  id: string;
  title: string;
  slug: string;
  category: "therapy" | "education" | "support";
  shortDescription: string;
  fullDescription: string;
  clinicalApproaches: string[];
  targetAgeRange: string;
  heroImageUrl: string;
  order: number;
  isPublished: boolean;
}

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<"therapy" | "education" | "support">("therapy");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formFullDesc, setFormFullDesc] = useState("");
  const [formApproaches, setFormApproaches] = useState("");
  const [formAge, setFormAge] = useState("2 to 16 years");
  const [formImage, setFormImage] = useState("/assets/images/therapies/occupational_sensory.jpg");
  const [formOrder, setFormOrder] = useState(1);
  const [formPublished, setFormPublished] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/programs");
      if (!res.ok) throw new Error("Failed to load programs.");
      const data = await res.json();
      setPrograms(data.programs || []);
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
        const res = await fetch("/api/admin/programs");
        if (!res.ok) throw new Error("Failed to load programs.");
        const data = await res.json();
        if (active) setPrograms(data.programs || []);
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
    setEditingProgram(null);
    setFormTitle("");
    setFormCategory("therapy");
    setFormShortDesc("");
    setFormFullDesc("");
    setFormApproaches("");
    setFormAge("2 to 16 years");
    setFormImage("/assets/images/therapies/occupational_sensory.jpg");
    setFormOrder(programs.length + 1);
    setFormPublished(true);
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (prog: ProgramItem) => {
    setEditingProgram(prog);
    setFormTitle(prog.title);
    setFormCategory(prog.category);
    setFormShortDesc(prog.shortDescription || "");
    setFormFullDesc(prog.fullDescription || "");
    setFormApproaches(prog.clinicalApproaches ? prog.clinicalApproaches.join("\n") : "");
    setFormAge(prog.targetAgeRange || "");
    setFormImage(prog.heroImageUrl || "");
    setFormOrder(prog.order || 0);
    setFormPublished(prog.isPublished);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle.trim()) {
      setFormError("Program title is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const approachesArray = formApproaches
        .split("\n")
        .map((a) => a.trim())
        .filter(Boolean);

      const payload = {
        title: formTitle,
        category: formCategory,
        shortDescription: formShortDesc,
        fullDescription: formFullDesc,
        clinicalApproaches: approachesArray,
        targetAgeRange: formAge,
        heroImageUrl: formImage,
        order: formOrder,
        isPublished: formPublished,
      };

      if (editingProgram) {
        const res = await fetch(`/api/admin/programs/${editingProgram.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update program.");
      } else {
        const res = await fetch("/api/admin/programs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create program.");
      }

      setModalOpen(false);
      await fetchPrograms();
    } catch (err: unknown) {
      setFormError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (prog: ProgramItem) => {
    try {
      const res = await fetch(`/api/admin/programs/${prog.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !prog.isPublished }),
      });
      if (!res.ok) throw new Error("Failed to toggle publish status.");
      await fetchPrograms();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (prog: ProgramItem) => {
    if (!confirm(`Are you sure you want to delete "${prog.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/programs/${prog.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete program.");
      await fetchPrograms();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#101C3A] font-[var(--font-heading)] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#8F2638]" />
            Programs &amp; Clinical Curriculum
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Manage evidence-based Paediatric Occupational Therapy, Speech &amp; Communication, Physiotherapy, and Special Education programs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => fetchPrograms()}
            disabled={loading}
            className="p-2 rounded-xl text-xs font-semibold bg-white border border-[#E2E8F0] text-[#2D3748] hover:bg-[#F1F4F9] transition"
            title="Refresh programs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#8F2638] text-white hover:bg-[#A83246] transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Program</span>
          </button>
        </div>
      </div>

      {/* Program Cards */}
      {loading ? (
        <div className="p-16 text-center text-[#64748B] bg-white rounded-2xl border border-[#E2E8F0]">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-[#101C3A]" />
          <p className="text-xs font-medium">Loading clinical programs...</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E2E8F0]">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[#101C3A]">Unable to load programs</h3>
          <p className="text-xs text-[#64748B] mt-1">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-2xs flex flex-col justify-between hover:border-[#101C3A]/30 transition group"
            >
              <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                <Image
                  src={prog.heroImageUrl || "/assets/images/sensory_occupational_room.jpg"}
                  alt={prog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs ${
                      prog.isPublished
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-800/80 text-white"
                    }`}
                  >
                    {prog.isPublished ? "Published" : "Draft"}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#101C3A] text-white shadow-xs">
                    Order #{prog.order}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8F2638] tracking-wider">
                    {prog.category} &bull; {prog.targetAgeRange || "All pediatric ages"}
                  </span>
                  <h3 className="text-sm font-bold text-[#101C3A] mt-1 leading-snug">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1.5 line-clamp-3 leading-relaxed">
                    {prog.shortDescription}
                  </p>

                  {prog.clinicalApproaches && prog.clinicalApproaches.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#E2E8F0] space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                        Focus Approaches:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {prog.clinicalApproaches.slice(0, 3).map((app, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-[#F1F4F9] text-[#2D3748] px-2 py-0.5 rounded-md border border-[#E2E8F0]"
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <button
                    onClick={() => handleTogglePublish(prog)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#101C3A] hover:bg-[#F1F4F9] transition"
                    title={prog.isPublished ? "Unpublish program" : "Publish program"}
                  >
                    {prog.isPublished ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(prog)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#101C3A] hover:bg-[#F1F4F9] transition"
                      title="Edit program"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(prog)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                      title="Delete program"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#101C3A]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FBFBFA]">
              <h2 className="text-base font-bold text-[#101C3A] font-[var(--font-heading)]">
                {editingProgram ? "Edit Program & Curriculum" : "Add New Program"}
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
                  Program Title <span className="text-[#8F2638]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Paediatric Occupational Therapy & Sensory Integration"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#101C3A] mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProgramItem["category"])}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white focus:outline-none focus:border-[#101C3A]"
                  >
                    <option value="therapy">Therapy (Clinical)</option>
                    <option value="education">Education (Special Ed / IEP)</option>
                    <option value="support">Support &amp; Life Skills</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#101C3A] mb-1">
                    Target Age Range
                  </label>
                  <input
                    type="text"
                    value={formAge}
                    onChange={(e) => setFormAge(e.target.value)}
                    placeholder="e.g. 2 to 16 years"
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#101C3A] mb-1">
                  Short Description (Card Summary)
                </label>
                <textarea
                  rows={2}
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="One sentence overview..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#101C3A] mb-1">
                  Full Clinical Description
                </label>
                <textarea
                  rows={4}
                  value={formFullDesc}
                  onChange={(e) => setFormFullDesc(e.target.value)}
                  placeholder="Detailed description of clinical modalities and benefits..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#101C3A] mb-1">
                  Clinical Approaches &amp; Bullet Points (one per line)
                </label>
                <textarea
                  rows={3}
                  value={formApproaches}
                  onChange={(e) => setFormApproaches(e.target.value)}
                  placeholder="Sensory Integration (Ayres SI) swinging
Fine motor precision and pencil grasp
Motor planning (praxis) and spatial-body awareness"
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#101C3A] mb-1">
                    Hero Image URL
                  </label>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="/assets/images/sensory_occupational_room.jpg"
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#101C3A] mb-1">
                    Display Order (1 = Top)
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                    className="rounded border-[#E2E8F0] text-[#101C3A]"
                  />
                  <span className="font-semibold text-[#2D3748]">Publish to Public Website</span>
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
                      <span>{editingProgram ? "Update Program" : "Save Program"}</span>
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
