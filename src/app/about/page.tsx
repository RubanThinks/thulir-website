import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  Target,
  Eye,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { StackedStaffSection } from "@/components/about/StackedStaffSection";

export const metadata: Metadata = {
  title: "About Thulir Special School | Our Story & Mission",
  description:
    "Learn about Thulir Special School in Coimbatore, our founding story by Dr. S. Venkatesan, our educational philosophy, and our dedicated team.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#151515]">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* ==================================================
            SECTION A: HERO
        ================================================== */}
        <section className="bg-gradient-to-b from-[#101C3A] via-[#142348] to-[#101C3A] text-white pt-16 pb-20 lg:pt-20 lg:pb-28 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8F2638]/20 rounded-full blur-3xl pointer-events-none" />
          <Container>
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#F4C542] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 mb-4">
                About Thulir Special School
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                Every Child Has a Story.{" "}
                <span className="text-[#F4C542] block sm:inline">Every Journey Deserves Support.</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-white/85 leading-relaxed font-normal">
                Thulir supports children with special needs through individualized education, therapy, and meaningful
                developmental experiences, working alongside families to help each child grow at their own pace.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/programs"
                  className="bg-[#F4C542] hover:bg-[#E5B430] text-[#151515] font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <span>Explore Programs &amp; Therapies</span>
                  <ChevronRight className="w-4 h-4 text-[#151515]" />
                </Link>
                <Link
                  href="/contact"
                  className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3.5 rounded-xl text-sm border border-white/25 transition-all"
                >
                  <span>Contact Our Team</span>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION B: OUR BEGINNINGS
        ================================================== */}
        <section className="py-20 lg:py-28 bg-white border-b border-[#E2E8F0]">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8F2638] bg-[#FDF4F5] px-3.5 py-1.5 rounded-full border border-[#8F2638]/20">
                  Our Beginnings
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#101C3A] tracking-tight leading-tight">
                  Founded on Compassion, Built for Inclusion
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-[#4A5568] leading-relaxed">
                  <p>
                    In 2017, Thulir began as <strong>Thulir Therapy Centre</strong> in Rathinapuri, Coimbatore. Established
                    by occupational therapist Dr. S. Venkatesan, it originated from a clear clinical need: providing
                    structured, affordable therapy to children who required focused early intervention.
                  </p>
                  <p>
                    Throughout his early clinical practice, Dr. Venkatesan observed the significant financial burdens and
                    limited awareness that made quality pediatric therapy and specialized guidance inaccessible to many
                    working families.
                  </p>
                  <p>
                    In 2022, after five years of clinical therapy and developmental support, the centre expanded into{" "}
                    <strong>Thulir Special School</strong>, opening branches in both Rathinapuri and Kuniyamuthur. This
                    expansion brought clinical therapy, individualized classroom learning, and community exposure under one
                    nurturing roof.
                  </p>
                </div>
              </div>

              {/* Milestones Card */}
              <div className="lg:col-span-6 bg-[#FBFBFA] p-8 sm:p-10 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-6">
                <h3 className="text-xl font-bold text-[#101C3A] border-b border-[#E2E8F0] pb-4">
                  Key Organizational Milestones
                </h3>
                <div className="space-y-5">
                  <div className="flex gap-4 items-start">
                    <span className="px-3 py-1 bg-[#101C3A] text-white text-xs font-bold rounded-lg shrink-0 mt-0.5">
                      2017
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#101C3A]">Inception of Thulir Therapy Centre</h4>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                        Started in Rathinapuri, providing dedicated paediatric occupational therapy and pediatric rehabilitation.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="px-3 py-1 bg-[#8F2638] text-white text-xs font-bold rounded-lg shrink-0 mt-0.5">
                      2022
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#101C3A]">Establishment of Thulir Special School</h4>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                        Expanded into a full special school with individualized education curricula across 2 campuses in
                        Coimbatore.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="px-3 py-1 bg-[#F4C542] text-[#151515] text-xs font-bold rounded-lg shrink-0 mt-0.5">
                      Present
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#101C3A]">Over 500+ Children &amp; 40+ Inclusive Transitions</h4>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                        Comprehensive therapy programs and documented student transitions toward mainstream schooling.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION C: FOUNDER PROFILE
        ================================================== */}
        <section className="py-20 lg:py-28 bg-[#FBFBFA] border-b border-[#E2E8F0]">
          <Container>
            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              {/* Founder Profile & Quick Bio */}
              <div className="lg:col-span-5 bg-gradient-to-b from-[#101C3A] via-[#142347] to-[#1A2E5A] p-8 sm:p-12 text-white flex flex-col justify-between items-center text-center">
                <div className="flex flex-col items-center w-full">
                  {/* Circular Formal Photo Frame (Matching Home Page Dignified Formal View) */}
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-[#D4AF37] ring-4 ring-white/10 shadow-2xl shrink-0 bg-white mb-6">
                    <Image
                      src="/assets/staffs/Dr%20S.Venkatesan.PNG"
                      alt={siteConfig.founder.name}
                      fill
                      className="object-contain p-2.5 transition-transform duration-300 hover:scale-105"
                      priority
                    />
                  </div>

                  <span className="inline-block text-[11px] font-extrabold tracking-widest uppercase bg-[#D4AF37] text-[#101C3A] px-3.5 py-1 rounded-full mb-3 shadow-sm">
                    Founder &amp; Managing Director
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white text-center">
                    {siteConfig.founder.name}
                  </h3>

                  <p className="text-xs font-semibold text-[#F4C542] mt-2 tracking-wider uppercase text-center">
                    {siteConfig.founder.credentials}
                  </p>
                </div>

                <div className="w-full mt-8 pt-6 border-t border-white/15 text-xs text-white/80 space-y-2.5 text-center">
                  <div className="flex items-start justify-center gap-2 text-left sm:text-center">
                    <GraduationCap className="w-4 h-4 text-[#F4C542] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">BOT:</strong> KMCH College of Occupational Therapy, The Tamil Nadu Dr. M.G.R. Medical University
                    </span>
                  </div>
                  <div className="flex items-start justify-center gap-2 text-left sm:text-center">
                    <GraduationCap className="w-4 h-4 text-[#F4C542] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">MOT (Paediatrics):</strong> Santosh Medical College, Ghaziabad (Atal Bihari Vajpayee Medical University)
                    </span>
                  </div>
                </div>
              </div>

              {/* Founder Narrative */}
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8F2638] bg-[#FDF4F5] px-3.5 py-1.5 rounded-full border border-[#8F2638]/20 w-fit mb-4">
                  Founder&apos;s Profile &amp; Motivation
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101C3A] tracking-tight leading-snug mb-6">
                  A Life Devoted to Pediatric Rehabilitation &amp; Accessible Care
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-[#4A5568] leading-relaxed">
                  <p>
                    Born in an economically disadvantaged village in Kallakurichi district, Dr. Venkatesan achieved a
                    remarkable personal milestone by becoming the first graduate in his family through perseverance and
                    commitment to service.
                  </p>
                  <p>
                    He pursued his Bachelor of Occupational Therapy (BOT) at KMCH College of Occupational Therapy, affiliated
                    with The Tamil Nadu Dr. M.G.R. Medical University. Following his undergraduate clinical grounding, he earned
                    his Master of Occupational Therapy (MOT) with Paediatric Specialization from Santosh Medical College, Ghaziabad,
                    affiliated with Atal Bihari Vajpayee Medical University.
                  </p>
                  <p>
                    Guided by a strong belief that early intervention can transform a child&apos;s developmental trajectory, he
                    dedicated his career to children with autism and developmental challenges. After gaining extensive clinical
                    experience across private organizations and government-aided institutions, he established Thulir Educational
                    Trust to ensure evidence-based therapy remains accessible, holistic, and grounded in family partnership.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION D: MISSION AND VISION
        ================================================== */}
        <section className="py-20 lg:py-24 bg-[#101C3A] text-white border-b border-white/10">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Vision Card */}
              <div className="bg-white/5 border border-white/15 rounded-3xl p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F4C542]/20 flex items-center justify-center mb-6">
                    <Eye className="w-6 h-6 text-[#F4C542]" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#F4C542]">Our Vision</span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4">
                    Empowering Independent Lives
                  </h3>
                  <p className="text-base sm:text-lg text-white/85 leading-relaxed font-normal">
                    &ldquo;{siteConfig.vision}&rdquo;
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/60">
                  Thulir Educational Trust for Special Needs
                </div>
              </div>

              {/* Mission Card */}
              <div className="bg-white/5 border border-white/15 rounded-3xl p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#8F2638]/30 flex items-center justify-center mb-6">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#F4C542]">Our Mission</span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4">
                    Nurturing Individual Potential
                  </h3>
                  <p className="text-base sm:text-lg text-white/85 leading-relaxed font-normal">
                    &ldquo;{siteConfig.mission}&rdquo;
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/60">
                  Thulir Special School • Coimbatore
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION E: OUR APPROACH
        ================================================== */}
        <section className="py-20 lg:py-28 bg-white border-b border-[#E2E8F0]">
          <Container>
            <SectionHeading
              badge="Child-Centered Educational Model"
              title="Our Therapeutic and Educational Approach"
              subtitle="We support children through patient, individualized steps, respecting each child's sensory and developmental reality."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#FBFBFA]">
                <h4 className="text-base font-bold text-[#101C3A] mb-2">1. Individualized Educational Support</h4>
                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                  Tailored Individualized Education Programs (IEP) that target specific learning goals, cognitive abilities,
                  and sensory preferences.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#FBFBFA]">
                <h4 className="text-base font-bold text-[#101C3A] mb-2">2. Clinical Therapy Services</h4>
                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                  Evidence-based paediatric occupational therapy, speech-language stimulation, and pediatric physiotherapy delivered by
                  trained professionals.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#FBFBFA]">
                <h4 className="text-base font-bold text-[#101C3A] mb-2">3. Functional Life Skills</h4>
                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                  Daily living activities (ADL) such as self-feeding, dressing, hygiene, and fine motor coordination for practical
                  independence.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#FBFBFA]">
                <h4 className="text-base font-bold text-[#101C3A] mb-2">4. Family Collaboration</h4>
                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                  Involving parents during sessions so therapeutic strategies and communication routines carry over naturally
                  into the home.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#FBFBFA]">
                <h4 className="text-base font-bold text-[#101C3A] mb-2">5. Supervised Community Exposure</h4>
                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                  Guided outings in public transport, parks, and community centers that build sensory resilience and social
                  ease.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#FBFBFA]">
                <h4 className="text-base font-bold text-[#101C3A] mb-2">6. Inclusive School Preparation</h4>
                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                  Structured readiness training for students prepared to transition into regular school settings, supporting
                  inclusive education.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION F: OUR DEDICATED FACULTY & SPECIALISTS
        ================================================== */}
        <StackedStaffSection />

        {/* ==================================================
            SECTION G: LEADERSHIP AND TRUSTEES
        ================================================== */}
        <section className="py-20 lg:py-28 bg-[#FBFBFA] border-b border-[#E2E8F0]">
          <Container>
            <SectionHeading
              badge="Trust Governance"
              title="Leadership &amp; Board of Trustees"
              subtitle="Managed with integrity and clinical direction under Thulir Educational Trust for Special Needs."
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
              {siteConfig.leadership.map((leader) => (
                <div
                  key={leader.name}
                  className="h-full flex flex-col justify-between rounded-2xl overflow-hidden bg-white border border-[#E2E8F0] shadow-[0_4px_20px_rgba(16,28,58,0.06)] hover:border-[#101C3A]/40 hover:shadow-[0_14px_32px_rgba(16,28,58,0.12)] transition-all duration-300"
                >
                  {/* Photo Frame - Full Image Display With Clean Background */}
                  <div className="relative aspect-[3/4] w-full bg-slate-50 overflow-hidden flex items-center justify-center">
                    {leader.image ? (
                      <Image
                        src={leader.image}
                        alt={leader.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white bg-[#101C3A] p-3 text-center">
                        <span className="text-xs font-bold text-[#F4C542] uppercase tracking-wider">
                          Thulir Trustee
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Information: Clean & Direct */}
                  <div className="p-3.5 sm:p-4 bg-white text-left flex flex-col justify-center">
                    <h3 className="text-sm sm:text-base font-extrabold text-[#101C3A] leading-snug line-clamp-1">
                      {leader.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#8F2638] mt-1 line-clamp-2 leading-relaxed">
                      {leader.role}
                    </p>
                    <p className="text-[11px] text-[#64748B] mt-3 pt-2.5 border-t border-[#E2E8F0]">
                      Thulir Educational Trust
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Team Photograph Record */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden p-6 sm:p-8">
              <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden mb-4">
                <Image
                  src="/assets/images/thulir_team_board.jpg"
                  alt="Thulir Special School dedicated educators, therapists, and staff team"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center max-w-xl mx-auto">
                <p className="text-sm font-bold text-[#101C3A]">Our Dedicated Team of Educators, Therapists &amp; Staff</p>
                <p className="text-xs text-[#64748B] mt-1">
                  Working together daily to create a supportive, positive learning environment for every child.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION G: CLOSING CTA
        ================================================== */}
        <section className="py-20 bg-gradient-to-br from-[#101C3A] via-[#142348] to-[#0A1224] text-white">
          <Container size="narrow">
            <div className="text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Partner With Us in Your Child&apos;s Development
              </h2>
              <p className="text-base text-white/85 leading-relaxed max-w-xl mx-auto">
                We welcome parents to visit our campuses in Rathinapuri and Kuniyamuthur, meet our team, and explore
                programs suited to your child.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                  href="/programs"
                  className="bg-[#F4C542] hover:bg-[#E5B430] text-[#151515] font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <span>Explore All Programs</span>
                  <ChevronRight className="w-4 h-4 text-[#151515]" />
                </Link>
                <Link
                  href="/contact"
                  className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3.5 rounded-xl text-sm border border-white/25 transition-all"
                >
                  <span>Connect With Us</span>
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
