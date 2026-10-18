"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Users,
  Trophy,
  Sparkles,
  Camera,
  Layers,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface EventItem {
  id: string;
  title: string;
  slug: string;
  eventDate: string;
  location: string;
  category: string;
  summary: string;
  coverImageUrl?: string;
  photos?: string[];
  participantCount?: number;
}

const EVENT_CATEGORY_FILTERS = [
  { id: "all", label: "All Events" },
  { id: "sports", label: "Sports & Athletics" },
  { id: "awareness", label: "Awareness Drives" },
  { id: "celebration", label: "Celebrations" },
  { id: "field-trip", label: "Field Outings" },
  { id: "achievement", label: "Achievements" },
  { id: "workshop", label: "Workshops" },
];

export function EventsShowcase() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        }
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeCategory === "all") return events;
    return events.filter(
      (evt) => evt.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [events, activeCategory]);

  if (loading) {
    return (
      <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <div className="w-8 h-8 border-3 border-[#101C3A]/20 border-t-[#101C3A] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold uppercase tracking-wider text-[#101C3A]">
            Loading school events...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <SectionHeading
              badge="Community & Milestones"
              title="Official Events & Outings Archives"
              subtitle="Documenting our inclusive athletic meets, civic partnerships, festive cultural gatherings, and experiential learning excursions in Coimbatore."
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#101C3A] bg-gray-50 px-4 py-2 rounded-2xl border border-gray-200 self-start md:self-auto">
            <Trophy className="w-4 h-4 text-[#F4C542]" />
            <span>{events.length} Documented Events</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {EVENT_CATEGORY_FILTERS.map((cat) => {
            const count =
              cat.id === "all"
                ? events.length
                : events.filter((e) => e.category.toLowerCase() === cat.id.toLowerCase()).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#101C3A] text-white shadow-md scale-102"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200/80"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    activeCategory === cat.id
                      ? "bg-white/20 text-[#F4C542]"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-[#FBFBFA] rounded-3xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Event Cover Photo */}
                {evt.coverImageUrl ? (
                  <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={evt.coverImageUrl}
                      alt={evt.title}
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={Boolean(
                        evt.coverImageUrl?.startsWith("data:") ||
                          evt.coverImageUrl?.startsWith("/uploads/")
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Category Badge */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 text-[#8F2638] shadow-md backdrop-blur-md">
                        {evt.category}
                      </span>
                    </div>

                    {/* Participant Counter */}
                    {evt.participantCount && (
                      <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 border border-white/20">
                        <Users className="w-3 h-3 text-[#F4C542]" />
                        <span>{evt.participantCount}+ Participants</span>
                      </div>
                    )}

                    {/* Extra Photos Badge */}
                    {evt.photos && evt.photos.length > 0 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white/90 flex items-center gap-1">
                        <Camera className="w-3 h-3 text-[#F4C542]" />
                        <span>+{evt.photos.length} photos</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-br from-[#101C3A] to-[#1c2e56] text-white p-6 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F4C542]">
                      {evt.category}
                    </span>
                    <Calendar className="w-6 h-6 text-white/50" />
                  </div>
                )}

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Date Tag */}
                    <div className="flex items-center gap-2 text-xs font-bold text-[#8F2638]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {new Date(evt.eventDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-[#101C3A] mt-2 group-hover:text-[#8F2638] transition-colors leading-snug">
                      {evt.title}
                    </h3>

                    {evt.location && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[#8F2638]" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    )}

                    {evt.summary && (
                      <p className="text-xs text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                        {evt.summary}
                      </p>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 mt-5 border-t border-gray-200/70 flex items-center justify-between">
                    <Link
                      href="/contact"
                      className="text-xs font-bold text-[#101C3A] hover:text-[#8F2638] flex items-center gap-1.5 transition-colors group-hover:translate-x-1 duration-200"
                    >
                      <span>Inquire About Event &amp; Community Access</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F4C542]" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#FBFBFA] rounded-3xl border border-gray-200">
            <Layers className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-500">No events found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
