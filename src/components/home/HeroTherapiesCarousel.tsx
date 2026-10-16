"use client";

// Continuous horizontal therapies reel (Tap to pause / resume)
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface CompactHeroTherapy {
  id: string;
  title: string;
  tag: string;
  image: string;
  serviceParam: string;
}

export const COMPACT_HERO_THERAPIES: CompactHeroTherapy[] = [
  {
    id: "speech-therapy",
    title: "Speech & Communication Therapy",
    tag: "Speech & Articulation",
    image: "/assets/images/therapies/speech_therapy.jpg",
    serviceParam: "Speech Therapy",
  },
  {
    id: "occupational-therapy",
    title: "Paediatric Occupational Therapy & Sensory",
    tag: "Sensory & Motor",
    image: "/assets/images/therapies/occupational_sensory.jpg",
    serviceParam: "Paediatric Occupational Therapy",
  },
  {
    id: "physiotherapy",
    title: "Pediatric Physiotherapy",
    tag: "Mobility & Posture",
    image: "/assets/images/therapies/pediatric_physiotherapy.jpg",
    serviceParam: "Physiotherapy",
  },
  {
    id: "special-education",
    title: "Special Education (IEP)",
    tag: "Academic Learning",
    image: "/assets/images/therapies/special_education_iep.jpg",
    serviceParam: "Special Education (IEP)",
  },
  {
    id: "behavior-therapy",
    title: "Behavior Therapy",
    tag: "Emotional Coping",
    image: "/assets/images/therapies/behavior_therapy.jpg",
    serviceParam: "Behavior Therapy",
  },
  {
    id: "neuro-developmental-therapy",
    title: "Neuro Developmental Therapy (NDT)",
    tag: "Neuromotor Care",
    image: "/assets/images/therapies/neuro_developmental_ndt.jpg",
    serviceParam: "Neuro Developmental Therapy",
  },
  {
    id: "psychological-services",
    title: "Psychological Services",
    tag: "Counseling & Assessment",
    image: "/assets/images/therapies/psychological_services.jpg",
    serviceParam: "Psychological Services",
  },
  {
    id: "expressive-arts",
    title: "Play, Art, Music & Dance Therapy",
    tag: "Creative Arts",
    image: "/assets/images/therapies/art_music_dance_therapy.jpg",
    serviceParam: "Play, Art, Music & Dance Therapy",
  },
  {
    id: "life-skills",
    title: "Activities of Daily Living (ADL)",
    tag: "Life Skills",
    image: "/assets/images/therapies/adl_life_skills.jpg",
    serviceParam: "ADL Training (Activities of Daily Living)",
  },
  {
    id: "early-intervention",
    title: "Early Intervention (0-4 Yrs)",
    tag: "Infant Milestones",
    image: "/assets/images/therapies/early_intervention.jpg",
    serviceParam: "Early Intervention (Infants & Toddlers)",
  },
];

// 2 sets of 10 items = 20 base cards, duplicated to 40 cards for infinite gap-free marquee on any desktop or 4K screen
const BASE_REEL_THERAPIES = [...COMPACT_HERO_THERAPIES, ...COMPACT_HERO_THERAPIES];
const LOOPED_THERAPIES = [...BASE_REEL_THERAPIES, ...BASE_REEL_THERAPIES];

export function HeroTherapiesCarousel() {
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="relative w-full overflow-hidden select-none" aria-label="Auto-moving therapies reel">
      <style>{`
        @keyframes continuousMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>

      {/* Header Bar: Centered above edge-to-edge carousel */}
      <div className="flex items-center justify-center gap-2 mb-4 px-4 text-center">
        <span className="w-2 h-2 rounded-full bg-[#F4C542] animate-pulse" />
        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/90">
          Major Therapies &amp; Programs &mdash; Full Spectrum of Pediatric Care
        </p>
      </div>

      {/* Continuous Auto-Moving Track (Running edge-to-edge across both corners of the screen) */}
      <div
        onClick={togglePlay}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            togglePlay();
          }
        }}
        aria-label="Therapies carousel (tap anywhere to pause or resume)"
        className="cursor-pointer relative w-full overflow-hidden py-2"
      >
        {/* Soft edge gradient fades at both screen corners for seamless entry & exit */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 md:w-32 bg-gradient-to-r from-[#101C3A] via-[#101C3A]/70 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 md:w-32 bg-gradient-to-l from-[#101C3A] via-[#101C3A]/70 to-transparent z-20 pointer-events-none" />

        <div
          className="flex gap-4 sm:gap-5 w-max"
          style={{
            animation: "continuousMarquee 60s linear infinite",
            animationPlayState: isPlaying ? "running" : "paused",
            willChange: "transform",
          }}
        >
          {LOOPED_THERAPIES.map((therapy, idx) => (
            <div
              key={`${therapy.id}-${idx}`}
              className="group relative w-56 sm:w-64 md:w-72 h-68 sm:h-76 md:h-80 shrink-0 rounded-2xl overflow-hidden border border-white/20 bg-[#101C3A] shadow-xl transition-all duration-300 hover:border-[#F4C542]/80 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Background Treatment Image */}
              <Image
                src={therapy.image}
                alt={therapy.title}
                fill
                sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, 288px"
                className="object-cover transition-transform duration-500 group-hover:scale-106 pointer-events-none"
              />

              {/* Dark Gradient Overlay for optimal contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1224] via-[#101C3A]/50 to-black/25 pointer-events-none" />

              {/* Top Category Badge */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
                <span className="bg-black/60 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold text-[#F4C542] tracking-wide uppercase">
                  {therapy.tag}
                </span>
                <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-85 group-hover:opacity-100 group-hover:bg-[#F4C542] group-hover:text-[#101C3A] transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              {/* Bottom: Therapy Name & Direct Inquire Action */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 bg-gradient-to-t from-[#0A1224] via-[#0A1224]/90 to-transparent z-10">
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#F4C542] transition-colors leading-snug line-clamp-2">
                  {therapy.title}
                </h4>

                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/contact?service=${encodeURIComponent(therapy.serviceParam)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F4C542] hover:text-white transition-colors"
                  >
                    <span>Inquire for this</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
