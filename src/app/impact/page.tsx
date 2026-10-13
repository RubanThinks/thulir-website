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
  TrendingUp,
  GraduationCap,
  Heart,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Award,
  Bike,
  Smile,
  Bus,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Impact | Thulir Special School",
  description:
    "Discover how Thulir Special School nurtures student growth, community integration, inclusive education transitions, and genuine social contributions in Coimbatore.",
};

export default function ImpactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#151515]">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* ==================================================
            SECTION A: HERO / INTRODUCTION
        ================================================== */}
        <section className="bg-gradient-to-b from-[#101C3A] via-[#142348] to-[#101C3A] text-white pt-16 pb-20 lg:pt-20 lg:pb-28 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8F2638]/20 rounded-full blur-3xl pointer-events-none" />
          <Container>
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#F4C542] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 mb-4">
                Meaningful Growth & Experiences
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                Progress Looks Different{" "}
                <span className="text-[#F4C542] block sm:inline">for Every Child.</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-white/85 leading-relaxed font-normal">
                At Thulir, we do not measure success by standardized rankings or commercial metrics. We measure it in
                a child taking their first independent steps, communicating a need with joy, mastering an everyday
                routine, and feeling embraced as an active member of their community.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/gallery"
                  className="bg-[#F4C542] hover:bg-[#E5B430] text-[#151515] font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  Explore Event Gallery
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl text-sm border border-white/25 transition-all"
                >
                  Contact Our Team
                </Link>
              </div>
            </div>

            {/* Quick Metrics Bar grounded in documented profile */}
            <div className="mt-14 pt-10 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F4C542]">
                  {siteConfig.verifiedMetrics.yearsOfService}
                </div>
                <div className="mt-1 text-sm font-semibold text-white">Years of Service</div>
                <div className="mt-1 text-xs text-white/70">Continuous community care since 2017</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F4C542]">
                  {siteConfig.verifiedMetrics.studentsHandled}
                </div>
                <div className="mt-1 text-sm font-semibold text-white">Children Supported</div>
                <div className="mt-1 text-xs text-white/70">Across Rathinapuri & Kuniyamuthur</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F4C542]">
                  {siteConfig.verifiedMetrics.inclusiveTransitions}
                </div>
                <div className="mt-1 text-sm font-semibold text-white">Inclusive Transitions</div>
                <div className="mt-1 text-xs text-white/70">Children prepared for inclusive schooling</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F4C542]">
                  {siteConfig.verifiedMetrics.walkathonParticipants}
                </div>
                <div className="mt-1 text-sm font-semibold text-white">Walkathon Supporters</div>
                <div className="mt-1 text-xs text-white/70">Mobilized for special needs awareness</div>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION B: ORGANIZATIONAL MILESTONES
        ================================================== */}
        <section className="py-20 bg-white border-b border-gray-100">
          <Container>
            <div className="max-w-3xl mb-14">
              <SectionHeading
                badge="Our Journey"
                title="A Steady Journey of Service & Expansion"
                subtitle="Rooted in genuine community need, Thulir has evolved thoughtfully from an early intervention therapy space into an integrated special education institution."
              />
            </div>

            <div className="relative pl-6 sm:pl-10 border-l-2 border-[#101C3A]/20 space-y-12 max-w-3xl">
              {/* Milestone 1 */}
              <div className="relative">
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 rounded-full bg-[#101C3A] border-4 border-white shadow-sm flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#F4C542]" />
                </div>
                <div className="bg-[#FBFBFA] border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8F2638] bg-[#8F2638]/10 px-3 py-1 rounded-full">
                      2017 &bull; Founding Milestone
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Rathinapuri, Coimbatore</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#101C3A]">
                    Establishment of Thulir Therapy Centre
                  </h3>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    Founded by occupational therapist Dr. S. Venkatesan, Thulir began in Rathinapuri with a modest
                    clinical setup. The primary objective was to deliver evidence-based pediatric sensory integration
                    and developmental intervention accessible to working-class families who otherwise struggled with
                    high clinical expenses.
                  </p>
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="relative">
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 rounded-full bg-[#8F2638] border-4 border-white shadow-sm flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#F4C542]" />
                </div>
                <div className="bg-[#FBFBFA] border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#101C3A] bg-[#101C3A]/10 px-3 py-1 rounded-full">
                      2018 &ndash; 2021 &bull; Service Integration
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Therapeutic Expansion</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#101C3A]">
                    Multi-Disciplinary Team & Community Trust
                  </h3>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    Integrated speech and language therapy, pediatric physiotherapy, and behavioral support. The team
                    built close partnerships with local pediatricians, hospitals, and rural families, establishing a
                    dignified and collaborative approach to developmental delays.
                  </p>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className="relative">
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 rounded-full bg-[#F4C542] border-4 border-white shadow-sm flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#101C3A]" />
                </div>
                <div className="bg-[#FBFBFA] border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8F2638] bg-[#8F2638]/10 px-3 py-1 rounded-full">
                      2022 &bull; Educational Expansion
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Two Campuses</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#101C3A]">
                    Evolution into Thulir Special School & Kuniyamuthur Campus
                  </h3>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    Responding to the growing need for full-time specialized educational support, the organization
                    expanded from an outpatient therapy centre into Thulir Special School. A second branch was
                    inaugurated in Kuniyamuthur to serve families across South Coimbatore, establishing structured
                    Individualized Education Programs (IEP).
                  </p>
                </div>
              </div>

              {/* Milestone 4 */}
              <div className="relative">
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 rounded-full bg-[#101C3A] border-4 border-white shadow-sm flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#F4C542]" />
                </div>
                <div className="bg-[#FBFBFA] border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#101C3A] bg-[#101C3A]/10 px-3 py-1 rounded-full">
                      Present &bull; Ongoing Impact
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Holistic Development</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#101C3A]">
                    Over 30 Inclusive Transitions & Civic Leadership
                  </h3>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    With over 30 students successfully supported in stepping into mainstream inclusive schools, Thulir
                    combines classroom learning with city transit exposure, festive events, medical charity
                    sponsorships, and broad public awareness programs.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION C: STUDENT DEVELOPMENT & MEANINGFUL PROGRESS
        ================================================== */}
        <section className="py-20 bg-[#FBFBFA]">
          <Container>
            <div className="max-w-3xl mb-14">
              <SectionHeading
                badge="Student Development"
                title="Areas of Personal & Academic Progress"
                subtitle="Development is holistic and individualized. We partner with each family to identify clear, functional targets across essential developmental domains."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Area 1: Communication */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-7 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#101C3A]/10 text-[#101C3A] flex items-center justify-center mb-5">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#101C3A]">Communication & Expression</h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    Supporting non-verbal and verbal children through picture exchange, oral-motor exercises,
                    expressive vocabulary, and practical methods to communicate essential personal needs with confidence.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-semibold text-[#8F2638] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Functional communication methods
                </div>
              </div>

              {/* Area 2: Academic Learning */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-7 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#8F2638]/10 text-[#8F2638] flex items-center justify-center mb-5">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#101C3A]">Academic & Cognitive Concepts</h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    Customized learning schedules introducing basic literacy, numeracy, shape and color recognition,
                    and structured table-top activities designed around each child&apos;s attention span.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-semibold text-[#8F2638] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Individualized Education Plans (IEP)
                </div>
              </div>

              {/* Area 3: Physical Mobility */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-7 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#F4C542]/20 text-[#101C3A] flex items-center justify-center mb-5">
                    <TrendingUp className="w-6 h-6 text-[#101C3A]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#101C3A]">Mobility & Coordination</h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    Targeted balance, postural stability, bilateral movement, and gross motor training to increase
                    physical stamina, body awareness, and safe navigation of physical environments.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-semibold text-[#8F2638] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Gross & fine motor coordination
                </div>
              </div>

              {/* Area 4: Life Skills (ADL) */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-7 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
                    <Smile className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#101C3A]">Activities of Daily Living (ADL)</h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    Cultivating personal autonomy in handwashing, independent eating, managing footwear, dressing, and
                    following regular domestic routines to reduce dependence on caregivers.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-semibold text-[#8F2638] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Foundational daily self-reliance
                </div>
              </div>

              {/* Area 5: Vocational Skills */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-7 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-5">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#101C3A]">Pre-Vocational Readiness</h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    For adolescent students, structured activities emphasize fine hand-eye coordination, sorting, craft
                    making, packaging, following multi-step instructions, and workplace discipline.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-semibold text-[#8F2638] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Structured task persistence
                </div>
              </div>

              {/* Area 6: Inclusive Transitions */}
              <div className="bg-white border-2 border-[#F4C542]/60 rounded-2xl p-7 shadow-xs flex flex-col justify-between bg-gradient-to-b from-amber-50/30 to-white">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#101C3A] text-[#F4C542] flex items-center justify-center mb-5">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#101C3A]">Inclusive Schooling Support</h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    Over 30 children have been prepared and supported through transitions into mainstream inclusive
                    classrooms, working with partner institutions and class teachers for seamless integration.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-bold text-[#101C3A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  30+ transitions documented
                </div>
              </div>
            </div>

            {/* Dedicated Core Philosophy Subsection */}
            <div className="mt-14 bg-gradient-to-br from-[#101C3A] via-[#142348] to-[#101C3A] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#F4C542]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-4xl">
                <div className="inline-flex items-center gap-2 bg-[#F4C542]/20 border border-[#F4C542]/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#F4C542] mb-4">
                  <Heart className="w-3.5 h-3.5 text-[#F4C542]" />
                  <span>Our Guiding Educational Philosophy</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  Every Student Has Their Own Time, Their Own Pace, and Their Own Way.
                </h3>
                <p className="mt-4 text-sm sm:text-base text-white/85 leading-relaxed">
                  At Thulir, we do not follow any rigid or uniform syllabus that forces children onto a single standardized track. Every child possesses a distinct mindset, a unique way of understanding the world, and their own speed of learning.
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/15">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-[#F4C542]">No Forced Standardized Moulds</h4>
                    <p className="text-xs text-white/75 leading-relaxed">
                      We never train two children on the exact same rigid curriculum. Learning is custom-tailored around each child&apos;s distinct abilities, sensory needs, and inherent qualities.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-[#F4C542]">Deep One-on-One Involvement</h4>
                    <p className="text-xs text-white/75 leading-relaxed">
                      Our educators and pediatric therapists immerse themselves directly with each learner, understanding their individual emotional rhythms and guiding them through personalized milestones.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-[#F4C542]">Celebrating Authentic Growth</h4>
                    <p className="text-xs text-white/75 leading-relaxed">
                      Progress is measured by a child&apos;s confidence, comfort in daily routines, joyful self-expression, and real-world independence &mdash; allowing every child to flourish at their own natural speed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION D: COMMUNITY EXPERIENCES & REAL-WORLD ENGAGEMENT
        ================================================== */}
        <section className="py-20 bg-white border-y border-gray-100">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5">
                <SectionHeading
                  badge="Real-World Learning"
                  title="Learning Extends Beyond the Classroom Walls"
                  subtitle="Children develop resilience, social adaptability, and genuine confidence when they experience real-world environments under mindful, caring supervision."
                />

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#101C3A]/10 text-[#101C3A] flex items-center justify-center shrink-0">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#101C3A]">Supervised Public Transit Journeys</h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Guided city bus journeys and public transit exposure help students learn passenger etiquette,
                        waiting queues, and community navigation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#8F2638]/10 text-[#8F2638] flex items-center justify-center shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#101C3A]">Parks, Gardens & Sensory Outings</h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Trips to local botanical parks and playgrounds offer natural sensory stimuli, open running
                        spaces, and gentle interactions with the public.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#F4C542]/30 text-[#101C3A] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#101C3A]">Cultural Festivals & Community Gatherings</h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Pongal, Independence Day, and Deepavali celebrations bring staff, parents, and children
                        together in creative attire, dance, and collective joy.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Bike className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#101C3A]">Adaptive Sports & Talent Events</h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Participation in inclusive athletic games, running activities, and creative art exhibits where
                        every effort is cheered and acknowledged.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200">
                  <Image
                    src="/assets/images/community_outing_park.jpg"
                    alt="Illustrative representation of children and mentors engaged in outdoor community activities"
                    width={800}
                    height={550}
                    className="w-full h-[400px] sm:h-[480px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101C3A]/90 via-[#101C3A]/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F4C542] bg-black/40 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
                      Community Integration
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold mt-2 text-white">
                      Building Confidence Through Real-World Interaction
                    </h3>
                    <p className="text-xs text-white/80 mt-1 leading-relaxed">
                      Structured outdoor outings provide children with opportunities to build social comfort in a
                      safe, supportive setting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION E: COMMUNITY CONTRIBUTIONS & WELFARE
        ================================================== */}
        <section className="py-20 bg-[#FBFBFA]">
          <Container>
            <div className="max-w-3xl mb-14">
              <SectionHeading
                badge="Social Responsibility"
                title="Giving Back: Trust Welfare & Financial Sponsorships"
                subtitle="True inclusion requires financial solidarity. Through the Thulir Educational Trust for Special Needs, the organization has consistently extended direct assistance to underprivileged students and families."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Contribution 1: Emergency Medical Support */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-7 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-[#8F2638]/10 text-[#8F2638] flex items-center justify-center mb-5">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="text-2xl font-extrabold text-[#8F2638]">
                  {siteConfig.verifiedMetrics.communityMedicalAssistanceINR}
                </div>
                <h3 className="text-base font-bold text-[#101C3A] mt-2">Emergency Medical Care Assistance</h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  Provided urgent financial relief of ₹1.5 Lakhs to support critical medical treatments and surgery for
                  a student facing acute health complications, standing firmly with the family in their time of need.
                </p>
              </div>

              {/* Contribution 2: Higher Education Support */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-7 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-[#101C3A]/10 text-[#101C3A] flex items-center justify-center mb-5">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="text-2xl font-extrabold text-[#101C3A]">Degree Sponsorship</div>
                <h3 className="text-base font-bold text-[#101C3A] mt-2">Undergraduate Education Support</h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  Financial sponsorship for a bachelor&apos;s degree program for a deserving rural first-generation
                  student, continuing our founder&apos;s personal mission to foster social mobility through higher
                  education.
                </p>
              </div>

              {/* Contribution 3: Cochlear Implant & Sensory Support */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-7 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-[#F4C542]/20 text-[#101C3A] flex items-center justify-center mb-5">
                  <Sparkles className="w-6 h-6 text-[#101C3A]" />
                </div>
                <div className="text-2xl font-extrabold text-[#101C3A]">Surgical Aid</div>
                <h3 className="text-base font-bold text-[#101C3A] mt-2">Cochlear Implant Sponsorship</h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  Mobilized resources and direct financial assistance to sponsor life-transforming cochlear implant
                  surgical care, alongside follow-up auditory verbal rehabilitation support.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-[#101C3A]">Subsidized & Free Educational Enrolments</h4>
                <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                  In addition to medical relief, Thulir provides subsidized or completely free educational and therapy
                  services to children from economically disadvantaged families, ensuring no child is turned away due
                  to financial hardship.
                </p>
              </div>
              <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                Active Trust Mission
              </span>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION F: EVENTS & CIVIC AWARENESS
        ================================================== */}
        <section className="py-20 bg-white border-t border-gray-100">
          <Container>
            <div className="max-w-3xl mb-14">
              <SectionHeading
                badge="Community Engagement"
                title="Events, Awareness & Civic Collaboration"
                subtitle="Changing social perceptions requires visible community advocacy. Thulir actively participates in public awareness drives, sports meets, and civic events."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Event 1: Walkathon */}
              <div className="bg-[#FBFBFA] border border-gray-200 rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8F2638] bg-[#8F2638]/10 px-3 py-1 rounded-full">
                      Annual Public Awareness
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Race Course, Coimbatore</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#101C3A]">
                    Autism & Special Needs Awareness Walkathon
                  </h3>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    Organized by Thulir at Coimbatore&apos;s prominent Race Course promenade, bringing together over{" "}
                    <strong>1,000 participants</strong> &mdash; including medical professionals, collegiate youth,
                    social workers, parents, and citizens &mdash; to champion inclusion and early intervention.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-4 h-4 text-[#8F2638]" />
                  <span>Documented institutional event</span>
                </div>
              </div>

              {/* Event 2: Sports & Cultural Days */}
              <div className="bg-[#FBFBFA] border border-gray-200 rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#101C3A] bg-[#101C3A]/10 px-3 py-1 rounded-full">
                      Inclusive Athletics & Culture
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Regional Competitions</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#101C3A]">
                    Parasports Participation & Talent Festivals
                  </h3>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    Our students actively participate in regional adaptive athletic games, recreational sports meets,
                    and cultural dance festivals. These platforms empower children to experience stage presence, team
                    cheering, and genuine appreciation.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center gap-2 text-xs text-gray-500">
                  <Award className="w-4 h-4 text-[#F4C542]" />
                  <span>Documented student participation</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION G: CLOSING CALL TO ACTION
        ================================================== */}
        <section className="py-20 bg-gradient-to-br from-[#101C3A] via-[#142348] to-[#101C3A] text-white text-center">
          <Container>
            <div className="max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F4C542] bg-white/10 px-4 py-1.5 rounded-full border border-white/20 inline-block mb-5">
                Join Our Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Every Step Counts. See Our Community in Action.
              </h2>
              <p className="mt-4 text-base text-white/80 leading-relaxed font-normal">
                Browse our documented event archives, learning spaces, and community activities, or reach out to
                discuss how we can support your child.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/gallery"
                  className="bg-[#F4C542] hover:bg-[#E5B430] text-[#151515] font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  View Event Gallery
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-xl text-sm border border-white/25 transition-all"
                >
                  Contact Our Campus
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
