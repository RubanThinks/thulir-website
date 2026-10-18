"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Building2,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Search,
  Tag,
  Filter,
  Sparkles,
  Layers,
} from "lucide-react";

export interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  altText?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
  tags?: string[];
  featuredOnHome?: boolean;
}

const CATEGORY_TABS = [
  { id: "all", label: "All Collections", icon: Layers },
  { id: "achievements", label: "Milestones & Awards", icon: Sparkles },
  { id: "therapy", label: "Clinical Therapies", icon: Building2 },
  { id: "celebrations", label: "Festivals & Celebrations", icon: Calendar },
  { id: "field-trips", label: "Community Field Trips", icon: Tag },
  { id: "life-skills", label: "Daily Life Skills", icon: ShieldCheck },
  { id: "campus", label: "Campus Spaces", icon: Building2 },
];

export function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Load all gallery items
  useEffect(() => {
    async function loadGallery() {
      setLoading(true);
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  // Filter items by category & search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        activeCategory === "all" ||
        item.category.toLowerCase() === activeCategory.toLowerCase();

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(q);
      const captionMatch = (item.caption || "").toLowerCase().includes(q);
      const tagMatch = (item.tags || []).some((t) => t.toLowerCase().includes(q));
      const categoryMatch = item.category.toLowerCase().includes(q);

      return titleMatch || captionMatch || tagMatch || categoryMatch;
    });
  }, [items, activeCategory, searchQuery]);

  // Compute live category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    for (const item of items) {
      const cat = item.category?.toLowerCase() || "campus";
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [items]);

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev > 0 ? prev - 1 : filteredItems.length - 1) : null
        );
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev < filteredItems.length - 1 ? prev + 1 : 0) : null
        );
      }
    },
    [lightboxIndex, filteredItems.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const activeItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="space-y-8">
      {/* =========================================================
          FILTER, SEARCH & STATS CONTROL MATRIX
      ========================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8F2638]">
              <Filter className="w-3.5 h-3.5" />
              <span>Campus Visual Collection</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#101C3A] mt-1">
              Explore Our Visual Archives
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Showing {filteredItems.length} of {items.length} verified photographs across therapies,
              activities, and achievements.
            </p>
          </div>

          {/* Real-time Keyword Search Bar */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, activity, therapy..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#101C3A] focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
          {CATEGORY_TABS.map((cat) => {
            const Icon = cat.icon;
            const count = categoryCounts[cat.id] || 0;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-[#101C3A] text-white shadow-md scale-102"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200/80"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#F4C542]" : "text-gray-400"}`} />
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive ? "bg-white/20 text-[#F4C542]" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          GALLERY GRID VIEW (NO GLITCHES, CLEAN & FLUID)
      ========================================================= */}
      {loading ? (
        <div className="py-24 text-center text-gray-500">
          <div className="w-10 h-10 border-3 border-[#101C3A]/20 border-t-[#101C3A] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold uppercase tracking-wider text-[#101C3A]">
            Loading visual archives...
          </p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="group bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-60 w-full bg-gray-100 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized={Boolean(
                    item.imageUrl?.startsWith("data:") || item.imageUrl?.startsWith("/uploads/")
                  )}
                />

                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Hover Zoom HUD */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-11 h-11 rounded-full bg-white/95 text-[#101C3A] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <ZoomIn className="w-5 h-5 text-[#8F2638]" />
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 text-[#8F2638] shadow-sm backdrop-blur-md">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#101C3A] group-hover:text-[#8F2638] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  )}
                </div>

                {/* Tags strip */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="text-[9px] font-semibold text-[#8F2638] bg-[#8F2638]/10 px-1.5 py-0.5 rounded-md">
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="max-w-md mx-auto text-center py-16 px-4 bg-white rounded-3xl border border-gray-200">
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-[#101C3A]">No Photographs Found</h4>
          <p className="text-xs text-gray-500 mt-1">
            No images match your search for &ldquo;{searchQuery}&rdquo;. Try another term or reset your category filter.
          </p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-[#101C3A] text-white hover:bg-[#1a2d5a] transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* =========================================================
          CINEMATIC FULLSCREEN LIGHTBOX MODAL
      ========================================================= */}
      {activeItem && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          className="fixed inset-0 bg-black/92 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer z-20"
            aria-label="Close fullscreen lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : filteredItems.length - 1);
            }}
            className="absolute left-4 sm:left-8 p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition active:scale-95 cursor-pointer hidden sm:flex items-center justify-center z-20 backdrop-blur-md"
            aria-label="Previous photograph"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(lightboxIndex < filteredItems.length - 1 ? lightboxIndex + 1 : 0);
            }}
            className="absolute right-4 sm:right-8 p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition active:scale-95 cursor-pointer hidden sm:flex items-center justify-center z-20 backdrop-blur-md"
            aria-label="Next photograph"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Container */}
          <div
            className="max-w-5xl w-full max-h-[92vh] bg-transparent text-white flex flex-col items-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Stage Image */}
            <div className="relative w-full h-[55vh] sm:h-[65vh] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black/40">
              <Image
                src={activeItem.imageUrl}
                alt={activeItem.altText || activeItem.title}
                fill
                className="object-contain"
                priority
                sizes="100vw"
                unoptimized={Boolean(
                  activeItem.imageUrl?.startsWith("data:") ||
                    activeItem.imageUrl?.startsWith("/uploads/")
                )}
              />
            </div>

            {/* Modal Detail HUD */}
            <div className="w-full max-w-3xl text-center mt-5 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F4C542] bg-white/10 border border-white/15 px-3 py-1 rounded-full backdrop-blur-md">
                  {activeItem.category}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {activeItem.title}
              </h2>

              {activeItem.caption && (
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl mx-auto">
                  {activeItem.caption}
                </p>
              )}

              {activeItem.tags && activeItem.tags.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  {activeItem.tags.map((tg) => (
                    <span
                      key={tg}
                      className="text-[10px] font-medium text-white/70 bg-white/10 px-2 py-0.5 rounded-md"
                    >
                      #{tg}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
