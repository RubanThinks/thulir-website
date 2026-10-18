"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  altText?: string;
  imageUrl: string;
  cloudinaryPublicId?: string;
  category: string;
  isPublished: boolean;
  featuredOnHome: boolean;
  order: number;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Upload Form fields
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formTitle, setFormTitle] = useState("");
  const [formCaption, setFormCaption] = useState("");
  const [formAltText, setFormAltText] = useState("");
  const [formCategory, setFormCategory] = useState("campus");
  const [formPublished, setFormPublished] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formOrder, setFormOrder] = useState(0);

  // Upload Status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.append("category", categoryFilter);

      const res = await fetch(`/api/admin/gallery?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load gallery items.");
      const data = await res.json();
      setItems(data.items || []);
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
        const params = new URLSearchParams();
        if (categoryFilter !== "all") params.append("category", categoryFilter);

        const res = await fetch(`/api/admin/gallery?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load gallery items.");
        const data = await res.json();
        if (active) setItems(data.items || []);
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
  }, [categoryFilter]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFileToUpload(null);
    setPreviewUrl("");
    setFormTitle("");
    setFormCaption("");
    setFormAltText("");
    setFormCategory("campus");
    setFormPublished(true);
    setFormFeatured(false);
    setFormOrder(items.length + 1);
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFileToUpload(null);
    setPreviewUrl(item.imageUrl);
    setFormTitle(item.title);
    setFormCaption(item.caption || "");
    setFormAltText(item.altText || item.title);
    setFormCategory(item.category || "campus");
    setFormPublished(item.isPublished);
    setFormFeatured(item.featuredOnHome);
    setFormOrder(item.order || 0);
    setFormError(null);
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
    setPreviewUrl(URL.createObjectURL(file));
    setFormError(null);
    if (!formTitle) {
      setFormTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle.trim()) {
      setFormError("Please enter an image title.");
      return;
    }

    if (!editingItem && !fileToUpload) {
      setFormError("Please select an image file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    try {
      if (editingItem && !fileToUpload) {
        // Update metadata only
        setUploadProgress(60);
        const patchRes = await fetch(`/api/admin/gallery/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            caption: formCaption,
            altText: formAltText,
            category: formCategory,
            isPublished: formPublished,
            featuredOnHome: formFeatured,
            order: formOrder,
          }),
        });

        if (!patchRes.ok) {
          const errData = await patchRes.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to update gallery record.");
        }
      } else {
        // Fast direct multipart upload and save
        setUploadProgress(40);
        const formData = new FormData();
        if (fileToUpload) {
          formData.append("file", fileToUpload);
        } else if (editingItem?.imageUrl) {
          formData.append("imageUrl", editingItem.imageUrl);
        }
        formData.append("title", formTitle);
        formData.append("caption", formCaption);
        formData.append("altText", formAltText);
        formData.append("category", formCategory);
        formData.append("isPublished", String(formPublished));
        formData.append("featuredOnHome", String(formFeatured));
        formData.append("order", String(formOrder));

        setUploadProgress(70);
        const postRes = await fetch("/api/admin/gallery", {
          method: "POST",
          body: formData,
        });

        if (!postRes.ok) {
          const errData = await postRes.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to save gallery item.");
        }
      }

      setUploadProgress(100);
      setModalOpen(false);
      await fetchGallery();
    } catch (err: unknown) {
      setFormError((err as Error).message || "Operation failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleTogglePublish = async (item: GalleryItem) => {
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });
      if (!res.ok) throw new Error("Failed to toggle publish status.");
      await fetchGallery();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete item.");
      await fetchGallery();
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
            <ImageIcon className="w-6 h-6 text-[#8F2638]" />
            Campus &amp; Therapy Media Gallery
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Upload and categorize high-resolution photos of therapy rooms, learning cabins, and sports outings.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => fetchGallery()}
            disabled={loading}
            className="p-2 rounded-xl text-xs font-semibold bg-white border border-[#E2E8F0] text-[#2D3748] hover:bg-[#F1F4F9] transition"
            title="Refresh gallery"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#8F2638] text-white hover:bg-[#A83246] transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Image</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: "all", label: "All Collections" },
          { id: "campus", label: "Campus & Sensory Rooms" },
          { id: "therapy", label: "Clinical Therapies" },
          { id: "events", label: "Events & Celebrations" },
          { id: "field-trips", label: "Community Field Trips" },
          { id: "achievements", label: "Student Milestones" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              categoryFilter === cat.id
                ? "bg-[#101C3A] text-white shadow-2xs"
                : "bg-white text-[#2D3748] border border-[#E2E8F0] hover:bg-[#F1F4F9]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid View */}
      {loading ? (
        <div className="p-16 text-center text-[#64748B] bg-white rounded-2xl border border-[#E2E8F0]">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-[#101C3A]" />
          <p className="text-xs font-medium">Loading media gallery...</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E2E8F0]">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[#101C3A]">Unable to load gallery</h3>
          <p className="text-xs text-[#64748B] mt-1">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-[#E2E8F0]">
          <div className="w-12 h-12 rounded-2xl bg-[#101C3A]/5 text-[#101C3A] flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#101C3A]">No gallery items found</h3>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            Upload your first photo to showcase Thulir&apos;s classrooms, therapy apparatus, or community walks.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 px-4 py-2 bg-[#101C3A] text-white text-xs font-semibold rounded-xl hover:bg-[#1A2E5A]"
          >
            Upload Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-2xs flex flex-col justify-between group hover:border-[#101C3A]/30 transition"
            >
              <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                  unoptimized={Boolean(item.imageUrl?.startsWith("data:") || item.imageUrl?.startsWith("/uploads/"))}
                />
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs ${
                      item.isPublished
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-800/80 text-white"
                    }`}
                  >
                    {item.isPublished ? "Published" : "Draft"}
                  </span>
                  {item.featuredOnHome && (
                    <span className="p-1 rounded-md bg-[#F4C542] text-[#101C3A] text-[10px] font-bold shadow-xs" title="Featured on Homepage">
                      <Sparkles className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8F2638] tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-xs font-bold text-[#101C3A] line-clamp-1 mt-0.5" title={item.title}>
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-[11px] text-[#64748B] line-clamp-2 mt-1 leading-relaxed">
                      {item.caption}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <button
                    onClick={() => handleTogglePublish(item)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#101C3A] hover:bg-[#F1F4F9] transition"
                    title={item.isPublished ? "Unpublish image" : "Publish image"}
                  >
                    {item.isPublished ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#101C3A] hover:bg-[#F1F4F9] transition"
                      title="Edit metadata"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                      title="Delete image"
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

      {/* Upload & Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#101C3A]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FBFBFA]">
              <h2 className="text-base font-bold text-[#101C3A] font-[var(--font-heading)]">
                {editingItem ? "Edit Gallery Item" : "Upload New Gallery Item"}
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

              {/* File Drop / Preview */}
              <div>
                <label className="block font-semibold text-[#101C3A] mb-1.5">
                  Select Photo <span className="text-[#8F2638]">*</span>
                </label>
                {previewUrl ? (
                  <div className="relative h-44 w-full rounded-xl overflow-hidden border border-[#E2E8F0] bg-gray-50 mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setFileToUpload(null);
                        setPreviewUrl("");
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-36 rounded-xl border-2 border-dashed border-[#E2E8F0] hover:border-[#101C3A] flex flex-col items-center justify-center text-center p-4 cursor-pointer bg-[#FBFBFA] transition"
                  >
                    <Upload className="w-6 h-6 text-[#64748B] mb-2" />
                    <span className="font-semibold text-[#101C3A]">Click to choose photo</span>
                    <span className="text-[10px] text-[#64748B] mt-0.5">JPEG, PNG, WebP up to 10MB</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#101C3A] mb-1">
                    Image Title <span className="text-[#8F2638]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Sensory Room Trampoline"
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
                    <option value="campus">Campus & Sensory Rooms</option>
                    <option value="therapy">Clinical Therapies</option>
                    <option value="events">Events & Celebrations</option>
                    <option value="field-trips">Community Field Trips</option>
                    <option value="achievements">Student Milestones</option>
                  </select>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block font-semibold text-[#101C3A] mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={formCaption}
                  onChange={(e) => setFormCaption(e.target.value)}
                  placeholder="Brief descriptive note about this photo..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                />
              </div>

              {/* Alt Text & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#101C3A] mb-1">
                    Accessibility Alt Text
                  </label>
                  <input
                    type="text"
                    value={formAltText}
                    onChange={(e) => setFormAltText(e.target.value)}
                    placeholder="Screen reader description"
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#101C3A] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                  />
                </div>
              </div>

              {/* Flags */}
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
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="rounded border-[#E2E8F0] text-[#F4C542]"
                  />
                  <span className="font-semibold text-[#2D3748]">Feature on Home Showcase</span>
                </label>
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-[11px] font-semibold text-[#64748B]">
                    <span>Uploading image...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#101C3A] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-[#2D3748] font-semibold hover:bg-[#F1F4F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-[#101C3A] text-white font-bold hover:bg-[#1A2E5A] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F4C542]" />
                      <span>{editingItem ? "Update Item" : "Upload & Save"}</span>
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
