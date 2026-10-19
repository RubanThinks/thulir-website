import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { EventsShowcase } from "@/components/gallery/EventsShowcase";
import { ArrowRight, Heart } from "lucide-react";


export const metadata: Metadata = {
  title: "Gallery & Events | Thulir Special School",
  description:
    "Explore the visual archives of Thulir Special School, featuring verified documentary milestones, specialized therapy environments, and community events in Coimbatore.",
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#151515]">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* ==================================================
            HERO SECTION
        ================================================== */}
        <section className="bg-gradient-to-b from-[#101C3A] via-[#142348] to-[#101C3A] text-white pt-16 pb-20 lg:pt-20 lg:pb-24 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8F2638]/20 rounded-full blur-3xl pointer-events-none" />
          <Container>
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#F4C542] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 mb-4">
                Visual Archives & Learning Spaces
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                Moments of Growth,{" "}
                <span className="text-[#F4C542] block sm:inline">Care & Community.</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-white/85 leading-relaxed font-normal">
                A transparent collection showcasing our multidisciplinary team, clinical therapy apparatus,
                purpose-built learning spaces, and community engagement in Coimbatore.
              </p>
            </div>
          </Container>
        </section>

        {/* ==================================================
            GALLERY SECTION
        ================================================== */}
        <section className="py-16 sm:py-20 bg-[#FBFBFA]">
          <Container>
            <div className="max-w-3xl mb-12">
              <SectionHeading
                badge="Visual Archives & Albums"
                title="Explore Our Campus & Activities"
                subtitle="Visual documentation of our classrooms, therapy wings, and student community life across our Coimbatore campuses."
              />
            </div>

            <GalleryGrid />
          </Container>
        </section>

        {/* ==================================================
            EVENTS SECTION (Live School Events Showcase)
        ================================================== */}
        <EventsShowcase />

        {/* ==================================================
            CLOSING CALL TO ACTION
        ================================================== */}
        <section className="py-20 bg-white border-t border-gray-100">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#101C3A]/10 text-[#101C3A] flex items-center justify-center mx-auto mb-5">
                <Heart className="w-6 h-6 text-[#8F2638]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101C3A]">
                Would You Like to Tour Our Campus?
              </h2>
              <p className="mt-4 text-base text-gray-600 leading-relaxed max-w-xl mx-auto">
                We welcome parents and caregivers to visit our Rathinapuri or Kuniyamuthur campuses to observe our
                sensory rooms, speak with our therapists, and understand how we can support your child.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-[#101C3A] hover:bg-[#1a2d5a] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  Schedule an In-Person Visit
                  <ArrowRight className="w-4 h-4 text-[#F4C542]" />
                </Link>
                <Link
                  href="/programs"
                  className="bg-[#FBFBFA] hover:bg-gray-100 text-[#151515] font-semibold px-7 py-3.5 rounded-xl text-sm border border-gray-300 transition-all"
                >
                  View Programs & Therapies
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
      <FloatingWhatsApp />
    </div>
  );
}
