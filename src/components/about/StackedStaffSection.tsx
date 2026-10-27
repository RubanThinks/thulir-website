"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STAFF_MEMBERS, StaffMember } from "@/data/staff";
import { ShieldCheck, CalendarCheck, PhoneCall } from "lucide-react";

interface StaffCardProps {
  member: StaffMember;
}

function StaffCard({ member }: StaffCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="staff-motion-card h-full flex flex-col justify-between rounded-2xl overflow-hidden bg-white border border-[#E2E8F0] shadow-[0_4px_20px_rgba(16,28,58,0.06)] hover:border-[#101C3A]/40 hover:shadow-[0_14px_32px_rgba(16,28,58,0.12)] transition-all duration-300">
      {/* Photo Frame - Full Image Display With Clean Background */}
      <div className="relative aspect-[3/4] w-full bg-slate-50 overflow-hidden flex items-center justify-center">
        {member.image && !imageError ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover object-top"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gradient-to-b from-[#101C3A] via-[#142347] to-[#1A2E5A] p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-[#D4AF37]/50 flex items-center justify-center text-[#F4C542] font-black text-xl mb-2 shadow-inner">
              {member.name
                .replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Master)\s+/i, "")
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((n) => n[0])
                .join("") || "TS"}
            </div>
            <span className="text-[10px] font-bold text-[#F4C542] uppercase tracking-wider">
              {member.role}
            </span>
          </div>
        )}
      </div>

      {/* Card Information: Clean & Direct (Name & Role only) */}
      <div className="p-3.5 sm:p-4 bg-white text-left flex flex-col justify-center">
        <h3 className="text-sm sm:text-base font-extrabold text-[#101C3A] leading-snug line-clamp-1">
          {member.name}
        </h3>
        <p className="text-xs font-semibold text-[#8F2638] mt-1 line-clamp-1">
          {member.role}
        </p>
      </div>
    </div>
  );
}

export function StackedStaffSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const deckRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Split all 20 staff members into 5 sets of 4 cards each
  const staffSets: StaffMember[][] = [];
  for (let i = 0; i < STAFF_MEMBERS.length; i += 4) {
    staffSets.push(STAFF_MEMBERS.slice(i, i + 4));
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const decks = deckRefs.current.filter(Boolean) as HTMLDivElement[];
      if (decks.length <= 1) return;

      const numDecks = decks.length;
      // Provide ample comfortable scroll distance so each of the 5 decks transitions smoothly
      const scrollDistance = (numDecks - 1) * 700;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top+=75",
          end: `+=${scrollDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Chain each subsequent deck (1, 2, 3, 4) into the master timeline
      decks.forEach((deck, i) => {
        if (i === 0) return; // Deck 0 is the base card deck

        const cards = deck.querySelectorAll(".staff-motion-card");
        const prevDeck = decks[i - 1];

        // Animate incoming deck stacking over
        tl.fromTo(
          deck,
          {
            yPercent: 110,
            scale: 0.95,
            opacity: 0.4,
          },
          {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          }
        );

        // Motion graphics stagger on the 4 individual cards in this deck
        if (cards.length > 0) {
          tl.fromTo(
            cards,
            {
              y: 20,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.6,
              ease: "power2.out",
            },
            "<0.2"
          );
        }

        // Slightly recess the previous deck to create depth
        if (prevDeck) {
          tl.to(
            prevDeck,
            {
              scale: 0.96,
              opacity: 0.3,
              duration: 0.6,
              ease: "power1.out",
            },
            "<"
          );
        }
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-[#FBFBFA] border-b border-[#E2E8F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Clean, Professional, No Tutorial Language) */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#8F2638]/5 border border-[#8F2638]/15 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#8F2638] mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Multidisciplinary Clinical &amp; Teaching Faculty</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#101C3A] tracking-tight">
            Meet Our Dedicated Specialists &amp; Educators
          </h2>

          <p className="mt-3 text-base sm:text-lg text-[#64748B] leading-relaxed">
            Our certified paediatric therapists, autism specialists, and student care coordinators collaborate daily to guide every child toward independent progress.
          </p>
        </div>

        {/* Pinned Card Stack Stage (4 Cards Per Row on Desktop, 2x2 Grid on Mobile) */}
        <div
          ref={containerRef}
          className="relative max-w-7xl mx-auto h-[620px] sm:h-[580px] lg:h-[520px]"
        >
          {staffSets.map((set, setIdx) => {
            return (
              <div
                key={`staff-set-${setIdx}`}
                ref={(el) => {
                  deckRefs.current[setIdx] = el;
                }}
                className="absolute inset-0 w-full h-full rounded-3xl p-3 sm:p-5 lg:p-6 bg-[#F8FAFC] border border-[#CBD5E1] shadow-[0_8px_30px_rgba(16,28,58,0.06)] flex flex-col justify-center will-change-transform"
                style={{
                  zIndex: setIdx + 1,
                }}
              >
                {/* Cards in this Set */}
                <div
                  className={`grid gap-3 sm:gap-4 lg:gap-5 h-full ${
                    set.length === 1
                      ? "grid-cols-1 max-w-[280px] sm:max-w-xs mx-auto w-full"
                      : set.length === 2
                      ? "grid-cols-2 max-w-xl mx-auto w-full"
                      : set.length === 3
                      ? "grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto w-full"
                      : "grid-cols-2 lg:grid-cols-4"
                  }`}
                >
                  {set.map((member) => (
                    <StaffCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Clinical Consultation Callout Banner */}
        <div className="mt-8 max-w-4xl mx-auto bg-gradient-to-r from-[#101C3A] via-[#16274E] to-[#101C3A] border-2 border-[#D4AF37]/50 rounded-2xl p-5 sm:p-6 text-white shadow-[0_8px_30px_rgba(16,28,58,0.12)] flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-center sm:text-left">
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider bg-[#F4C542] text-[#101C3A] px-2.5 py-0.5 rounded mb-1.5 shadow-xs">
              Clinical Consultation &amp; Assessment
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Meet Our Specialists in Person
            </h3>
            <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
              Schedule an in-depth clinical screening or school readiness consultation with Dr. S. Venkatesan and our multidisciplinary team.
            </p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 flex-1 sm:flex-initial py-2.5 px-4 rounded-xl text-xs font-bold bg-[#F4C542] text-[#101C3A] hover:bg-[#E5B532] transition-colors shadow-sm active:scale-95"
            >
              <CalendarCheck className="w-4 h-4 text-[#101C3A]" />
              <span>Book an Evaluation</span>
            </Link>
            <a
              href="tel:+919659934210"
              className="inline-flex items-center justify-center gap-1.5 flex-1 sm:flex-initial py-2.5 px-4 rounded-xl text-xs font-semibold text-white/90 hover:text-white border border-white/20 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#F4C542]" />
              <span>+91 96599 34210</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
