"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, HeartHandshake, Compass, Users2, ShieldCheck } from "lucide-react";

interface StoryPanel {
  id: number;
  badge: string;
  title: string;
  description: string;
  icon: React.ElementType;
  accentBg: string;
  tagColor: string;
}

const STORY_PANELS: StoryPanel[] = [
  {
    id: 1,
    badge: "Principle 01",
    title: "Every Child Has Individual Strengths",
    description:
      "We begin by understanding who the child is—their unique sensory landscape, interests, and natural strengths—rather than focusing on limitations. Each child enters Thulir with an individual dignity that guides our daily care.",
    icon: Sparkles,
    accentBg: "bg-[#101C3A] text-white",
    tagColor: "text-[#F4C542]",
  },
  {
    id: 2,
    badge: "Principle 02",
    title: "Development Thrives on Patient, Tailored Support",
    description:
      "Milestones cannot be rushed. Whether regulating sensory input in our therapy room or developing early communication, our clinicians craft evidence-based steps that give each child the space and encouragement to flourish.",
    icon: Compass,
    accentBg: "bg-[#8F2638] text-white",
    tagColor: "text-white/90",
  },
  {
    id: 3,
    badge: "Principle 03",
    title: "Parents and Educators Work Hand in Hand",
    description:
      "A child's world is holistic. By welcoming parents into sessions and providing guidance for home environments, we ensure that therapeutic progress extends seamlessly from the therapy cabin to everyday family life.",
    icon: Users2,
    accentBg: "bg-[#1A2E5A] text-white",
    tagColor: "text-[#F4C542]",
  },
  {
    id: 4,
    badge: "Principle 04",
    title: "Real-World Experiences Spark True Independence",
    description:
      "Learning doesn't stop inside classrooms. Supervised outings—from public buses and trains to traffic parks and gardens—equip children with the vital social and sensory confidence needed for the wider world.",
    icon: HeartHandshake,
    accentBg: "bg-[#2D3748] text-white",
    tagColor: "text-white/90",
  },
  {
    id: 5,
    badge: "Principle 05",
    title: "Every Journey Deserves Deep Dignity and Respect",
    description:
      "Whether preparing for mainstream school integration or celebrating a newly acquired life skill, our school community honors every milestone with genuine pride, inclusion, and lasting commitment.",
    icon: ShieldCheck,
    accentBg: "bg-[#101C3A] text-white",
    tagColor: "text-[#F4C542]",
  },
];

export function StackedCardStorytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Only register and run ScrollTrigger in browser
    if (typeof window === "undefined") return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Don't pin on mobile devices or if user prefers reduced motion
    const isMobile = window.innerWidth < 1024;
    if (prefersReducedMotion || isMobile) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      cards.forEach((card, index) => {
        if (index === 0) return; // Keep first card static as base

        gsap.fromTo(
          card,
          {
            yPercent: 120,
            opacity: 0.7,
            scale: 0.95,
          },
          {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: () => `top+=${index * 240} top`,
              end: () => `top+=${(index + 1) * 240} top`,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // Pin the cards wrapper smoothly
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top+=100",
        end: () => `+=${cards.length * 240}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
      });
    }, containerRef);

    return () => {
      ctx.revert(); // Clean up all GSAP timelines and ScrollTriggers
    };
  }, []);

  return (
    <section className="py-24 bg-[#F1F4F9]/60 border-t border-[#E2E8F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#8F2638] bg-[#8F2638]/5 px-3.5 py-1.5 rounded-full border border-[#8F2638]/15 mb-3">
            Our Core Educational Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101C3A] tracking-tight">
            How We Guide Each Child&apos;s Journey
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#64748B] leading-relaxed">
            Our therapeutic and educational model is built upon five foundational principles of respect, clinical
            precision, and inclusive growth.
          </p>
        </div>

        {/* Stacked Cards Area */}
        <div
          ref={containerRef}
          className="relative max-w-4xl mx-auto min-h-[460px] lg:h-[460px]"
        >
          {STORY_PANELS.map((panel, idx) => {
            const Icon = panel.icon;
            return (
              <div
                key={panel.id}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                className={`w-full rounded-3xl p-8 sm:p-12 shadow-xl border border-white/10 ${panel.accentBg} ${
                  // On desktop with GSAP, absolute overlay; on mobile/reduced motion, natural stack with margin
                  "lg:absolute lg:inset-0 mb-6 lg:mb-0"
                } flex flex-col justify-between transition-shadow`}
                style={{
                  zIndex: idx + 1,
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 border border-white/20 ${panel.tagColor}`}
                    >
                      {panel.badge}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#F4C542]" />
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-4">
                    {panel.title}
                  </h3>

                  <p className="text-base sm:text-lg text-white/85 leading-relaxed font-normal">
                    {panel.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-white/70">
                  <span>Thulir Special School • Guiding Principles</span>
                  <span className="font-semibold text-white/90">Step {idx + 1} of 5</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
