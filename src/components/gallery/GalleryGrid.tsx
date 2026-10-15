"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Building2,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
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

const DEFAULT_CATEGORIES = [
  { id: "all", label: "All Collections" },
  { id: "campus", label: "Campus & Therapy Rooms" },
  { id: "therapy", label: "Clinical Apparatus" },
  { id: "events", label: "Walkathon & Sports" },
  { id: "field-trips", label: "Community Outings" },
  { id: "achievements", label: "Milestones" },
];

export function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadGallery() {
      setLoading(true);
      try {
        const url =
          activeCategory === "all"
            ? "/api/gallery"
            : `/api/gallery?category=${activeCategory}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
        }
      } catch {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, [activeCategory]);

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev > 0 ? prev - 1 : items.length - 1) : null
        );
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev < items.length - 1 ? prev + 1 : 0) : null
        );
      }
    },
    [lightboxIndex, items.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const activeItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <div className="space-y-10">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {DEFAULT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === cat.id
                ? "bg-[#101C3A] text-white shadow-xs"
                : "bg-white text-gray-700 border border-gray-200/90 shadow-2xs hover:bg-gray-50"
            }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Gallery Content Area */}
      {loading ? (
        <div className="py-20 text-center text-gray-500">
          <div className="w-8 h-8 border-3 border-[#101C3A]/20 border-t-[#101C3A] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold">Loading campus visual archives...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#101C3A]/0 group-hover:bg-[#101C3A]/30 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-[#101C3A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>

                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-[#8F2638] shadow-xs backdrop-blur-xs">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-base font-bold text-[#101C3A] group-hover:text-[#8F2638] transition-colors line-clamp-1">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Baseline Holding Information when collection is fresh */
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200/90 shadow-lg overflow-hidden">
          <div className="bg-[#101C3A] text-white p-8 sm:p-10 text-center relative">
            <div className="max-w-2xl mx-auto">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#F4C542] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 mb-3">
                Campus Photo Gallery
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Archival Visual Gallery
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-white/85 leading-relaxed">
                Our documentary archives capture everyday breakthroughs, joyful smiles, and dedicated therapy sessions across our Rathinapuri and Kuniyamuthur campuses.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#FBFBFA]">
            <div className="p-5 rounded-2xl bg-white border border-gray-200 text-center">
              <Building2 className="w-8 h-8 text-[#101C3A] mx-auto mb-3" />
              <h3 className="text-sm font-bold text-[#101C3A]">Therapy &amp; Sensory Rooms</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Sensory integration swings, tactile pathways, and occupational therapy equipment.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-gray-200 text-center">
              <Calendar className="w-8 h-8 text-[#8F2638] mx-auto mb-3" />
              <h3 className="text-sm font-bold text-[#101C3A]">Sports &amp; Walkathons</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Kovai Vizha special sports, annual walkathons at Periyakulam, and parasports achievements.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-gray-200 text-center">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-[#101C3A]">Child Protection Safeguard</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Strict parental consent is verified before any child milestone photograph is published.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Accessible Fullscreen Lightbox */}
      {activeItem && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : items.length - 1);
            }}
            className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer hidden sm:block"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(lightboxIndex < items.length - 1 ? lightboxIndex + 1 : 0);
            }}
            className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer hidden sm:block"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="max-w-4xl max-h-[90vh] bg-transparent text-white flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-3xl h-[60vh] sm:h-[70vh] rounded-2xl overflow-hidden">
              <Image
                src={activeItem.imageUrl}
                alt={activeItem.altText || activeItem.title}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center mt-4 max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4C542] bg-white/10 px-3 py-1 rounded-full">
                {activeItem.category}
              </span>
              <h2 className="text-lg font-bold text-white mt-2">{activeItem.title}</h2>
              {activeItem.caption && (
                <p className="text-xs text-white/80 mt-1 leading-relaxed">
                  {activeItem.caption}
                </p>
              )}
              <p className="text-[11px] text-white/50 mt-2">
                Image {lightboxIndex + 1} of {items.length} &bull; Use Left/Right arrows to navigate
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
