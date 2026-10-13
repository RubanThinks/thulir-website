"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
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
  participantCount?: number;
}

export function EventsShowcase() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        }
      } catch {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <SectionHeading
            badge="Community & Celebrations"
            title="School Events & Field Outings"
            subtitle="Inclusive athletic meets, festival celebrations, and sensory community exposures organized by Thulir Educational Trust."
          />
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-[#FBFBFA] rounded-3xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                {evt.coverImageUrl ? (
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={evt.coverImageUrl}
                      alt={evt.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#8F2638] shadow-xs backdrop-blur-xs">
                        {evt.category}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-28 bg-[#101C3A] text-white p-5 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F4C542]">
                      {evt.category}
                    </span>
                    <Calendar className="w-6 h-6 text-white/50" />
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#8F2638]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {new Date(evt.eventDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#101C3A] mt-2 group-hover:text-[#8F2638] transition-colors leading-snug">
                      {evt.title}
                    </h3>

                    {evt.location && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[#64748B]" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    )}

                    {evt.summary && (
                      <p className="text-xs text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                        {evt.summary}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200/60 flex items-center justify-between">
                    <Link
                      href="/contact"
                      className="text-xs font-bold text-[#101C3A] hover:text-[#8F2638] flex items-center gap-1.5 transition-colors"
                    >
                      <span>Inquire About Event Participation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Baseline Events info */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FBFBFA] border border-gray-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F2638] bg-[#8F2638]/10 px-2.5 py-1 rounded-full">
                Annual Milestone
              </span>
              <h3 className="text-lg font-bold text-[#101C3A] mt-2.5">
                Kovai Vizha Special Sports &amp; Walkathon
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Over 1,000 children and caregivers unite along Periyakulam Lake Road, Ukkadam and Race Course to promote special needs inclusion and celebrate athletic accomplishments.
              </p>
            </div>
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FBFBFA] border border-gray-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#101C3A] bg-[#101C3A]/10 px-2.5 py-1 rounded-full">
                Cultural Exposure
              </span>
              <h3 className="text-lg font-bold text-[#101C3A] mt-2.5">
                Sensory Festivities &amp; Life Skills Field Trips
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Supermarket visits, sensory park tours, Pongal and Annual Day celebrations designed to foster social confidence, peer friendships, and everyday independence.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
