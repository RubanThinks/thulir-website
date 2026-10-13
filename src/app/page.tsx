import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StackedCardStorytelling } from "@/components/home/StackedCardStorytelling";
import { GoogleReviewsSection } from "@/components/home/GoogleReviewsSection";
import {
  Users,
  ChevronRight,
  Sparkles,
  Calendar,
  Activity,
  ArrowRight,
  Eye,
  Target,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#151515]">
      {/* GLOBAL REUSABLE SITE HEADER */}
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* ==================================================
            SECTION A: CINEMATIC FULL-SCREEN HERO SECTION
        ================================================== */}
        <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden text-white pt-16 pb-20 lg:pt-20 lg:pb-24">
          {/* 1. Full-Bleed Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/images/hero_cinematic_bg.jpg"
              alt="Thulir Special School and Therapy Centre modern educational sanctuary"
              fill
              priority
              quality={90}
              className="object-cover object-center transform scale-105"
            />

            {/* 2. Balanced Contrast Overlays - background learning environment clearly visible */}
            <div className="absolute inset-0 bg-[#101C3A]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101C3A]/85 via-[#101C3A]/30 to-[#101C3A]/25" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#101C3A]/40 via-transparent to-[#8F2638]/30" />

            {/* Ambient luxury light accents */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#8F2638]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#F4C542]/15 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* 3. Hero Content Container */}
          <div className="relative z-10 w-full">
            <Container>
              <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                {/* A. Prominent Official Logo Badge with Crisp White Placeholder */}
                <div className="relative mb-6 sm:mb-8 group">
                  <div className="bg-white px-7 sm:px-10 py-3.5 sm:py-4.5 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-[#F4C542]/80 ring-8 ring-white/15 flex items-center justify-center transition-all duration-300 group-hover:scale-103 group-hover:shadow-3xl">
                    <div className="relative w-56 sm:w-72 md:w-80 h-16 sm:h-20 md:h-22">
                      <Image
                        src="/assets/branding/logo.png"
                        alt="Thulir Special School Official Logo"
                        fill
                        priority
                        sizes="(max-width: 640px) 224px, (max-width: 768px) 288px, 320px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  {/* Subtle golden ambient glow around the logo */}
                  <div className="absolute inset-0 rounded-3xl bg-[#F4C542]/20 blur-2xl pointer-events-none -z-10" />
                </div>

                {/* B. Eyebrow Badge & Tamil Tagline */}
                <div className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-white/95 mb-5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#F4C542] animate-pulse" />
                  <span>பயிற்சியும், பயிற்றுவித்தல் சார்ந்த இடமும் &bull; Coimbatore</span>
                </div>

                {/* C. Headline with Luxury Typography */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12] drop-shadow-md">
                  Every Child Deserves the Chance to{" "}
                  <span className="font-serif-luxury italic font-normal text-[#F4C542] block sm:inline drop-shadow-lg">
                    Flourish.
                  </span>
                </h1>

                {/* D. Reassuring Emotional Copy */}
                <p className="mt-6 text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl font-normal drop-shadow-xs">
                  At Thulir Special School, we support children with special needs through individualized education,
                  pediatric occupational &amp; speech therapy, and life skills &mdash; walking alongside families so every
                  child grows with dignity and independence.
                </p>

                {/* E. Action CTA Buttons */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/contact"
                    className="bg-[#F4C542] hover:bg-[#E5B430] text-[#151515] font-bold px-7 sm:px-9 py-4 rounded-xl text-sm sm:text-base transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center gap-2.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span>Connect With Our Team</span>
                    <ChevronRight className="w-4 h-4 text-[#151515]" />
                  </Link>
                  <Link
                    href="/programs"
                    className="bg-white/15 hover:bg-white/25 text-white font-semibold px-7 sm:px-9 py-4 rounded-xl text-sm sm:text-base border border-white/30 transition-all backdrop-blur-md flex items-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span>Explore Our Programs</span>
                  </Link>
                </div>

                {/* F. Essential Campus & Care Pills (No icon clutter) */}
                <div className="mt-10 pt-8 border-t border-white/15 w-full max-w-3xl flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-white/80 font-medium">
                  <span className="bg-black/25 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/10">
                    &bull; 8+ Years of Service
                  </span>
                  <span className="bg-black/25 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/10">
                    &bull; Rathinapuri &amp; Kuniyamuthur Campuses
                  </span>
                  <span className="bg-black/25 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/10">
                    &bull; Sensory Integration &bull; Speech &bull; Special Education
                  </span>
                </div>
              </div>
            </Container>
          </div>
        </section>

        {/* ==================================================
            SECTION B: TRUST AND IMPACT STRIP
        ================================================== */}
        <section className="bg-white border-b border-[#E2E8F0] py-8">
          <Container>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="p-4 border-r last:border-r-0 border-[#E2E8F0]">
                <p className="text-3xl sm:text-4xl font-extrabold text-[#101C3A]">2017</p>
                <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">Established in Coimbatore</p>
              </div>
              <div className="p-4 border-r last:border-r-0 border-[#E2E8F0]">
                <p className="text-3xl sm:text-4xl font-extrabold text-[#8F2638]">{siteConfig.verifiedMetrics.studentsHandled}</p>
                <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">Children Supported</p>
              </div>
              <div className="p-4 border-r last:border-r-0 border-[#E2E8F0]">
                <p className="text-3xl sm:text-4xl font-extrabold text-[#101C3A]">
                  {siteConfig.verifiedMetrics.inclusiveTransitions}
                </p>
                <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">Inclusive School Transitions</p>
              </div>
              <div className="p-4">
                <p className="text-3xl sm:text-4xl font-extrabold text-[#8F2638]">{siteConfig.verifiedMetrics.branches}</p>
                <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">Campuses in Coimbatore</p>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION C: OUR STORY
        ================================================== */}
        <section className="py-20 lg:py-28 bg-[#FBFBFA]">
          <Container>
            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              {/* Founder Context Column */}
              <div className="lg:col-span-5 bg-gradient-to-b from-[#101C3A] to-[#1A2E5A] p-8 sm:p-12 text-white flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#F4C542]">Our Roots &amp; Founder</span>
                  <h3 className="text-2xl font-bold text-white mt-2">{siteConfig.founder.name}</h3>
                  <p className="text-xs font-semibold text-[#F4C542] mt-1 tracking-wider uppercase">
                    {siteConfig.founder.credentials}
                  </p>
                  <p className="text-xs text-white/70 mt-0.5">{siteConfig.founder.role}</p>

                  <div className="mt-6 pt-6 border-t border-white/15 space-y-3 text-xs text-white/80 leading-relaxed font-normal">
                    <p>
                      Dr. Venkatesan is an occupational therapist who completed his BOT at KMCH Coimbatore and Master of
                      Occupational Therapy in Pediatrics from Santosh College, Ghaziabad.
                    </p>
                    <p>
                      His early professional journey highlighted the significant challenges families face in accessing
                      affordable, high-quality therapy and specialized developmental care.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/60">
                  <p>Parent Organization: {siteConfig.brand.parentOrganization}</p>
                </div>
              </div>

              {/* Story Narrative Column */}
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8F2638] bg-[#FDF4F5] px-3.5 py-1.5 rounded-full border border-[#8F2638]/20 w-fit mb-4">
                  The Journey of Thulir
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101C3A] tracking-tight leading-snug mb-6">
                  From a Focused Therapy Centre in Rathinapuri to a Dedicated Special School
                </h2>
                <div className="space-y-4 text-[#2D3748] text-sm sm:text-base leading-relaxed">
                  <p>
                    Thulir began in 2017 as <strong>Thulir Therapy Centre</strong> in Rathinapuri, Coimbatore. Driven by
                    compassion and evidence-based clinical practices, it started by providing individualized therapy for
                    children experiencing developmental delays and autism spectrum disorders.
                  </p>
                  <p>
                    Recognizing that children thrive best when clinical therapy is harmonized with structured daily learning,
                    social interaction, and family involvement, the organization developed into <strong>Thulir Special School</strong> in
                    2022, establishing campuses in Rathinapuri and Kuniyamuthur.
                  </p>
                  <p>
                    Today, our mission remains steady: to ensure that specialized education is not a luxury, but an accessible,
                    empowering foundation for every child.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-[#64748B]">
                    <span>Founded 2017 • Two Campuses in Coimbatore</span>
                  </div>
                  <Link
                    href="/about"
                    className="text-sm font-bold text-[#8F2638] hover:text-[#101C3A] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Discover Our Story</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION D: PROGRAMS AND THERAPIES
        ================================================== */}
        <section className="py-20 lg:py-28 bg-white border-t border-[#E2E8F0]">
          <Container>
            <SectionHeading
              badge="Programs &amp; Therapies"
              title="Tailored Support for Every Developmental Need"
              subtitle="Guided by certified clinicians and compassionate educators, our evidence-based programs are customized to each child's unique sensory, physical, and cognitive profile."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {siteConfig.programsAndTherapies.map((program) => (
                <div
                  key={program.id}
                  className="bg-[#FBFBFA] border border-[#E2E8F0] hover:border-[#101C3A]/40 rounded-2xl overflow-hidden transition-all hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#101C3A]/5">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/95 text-[#101C3A] shadow-xs">
                        {program.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#101C3A] group-hover:text-[#8F2638] transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-sm text-[#4A5568] mt-3 leading-relaxed">
                        {program.shortDesc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                      <span className="text-xs text-[#64748B]">Personalized Sessions</span>
                      <Link
                        href="/programs"
                        className="text-xs font-bold text-[#8F2638] group-hover:text-[#101C3A] inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Learn More</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 bg-[#101C3A] hover:bg-[#1A2E5A] text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-xs"
              >
                <span>Explore All Programs &amp; Therapies</span>
                <ArrowRight className="w-4 h-4 text-[#F4C542]" />
              </Link>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION E: INDIVIDUALIZED CARE PHILOSOPHY (NO RIGID SYLLABUS)
        ================================================== */}
        <section className="py-20 lg:py-28 bg-[#FBFBFA] border-t border-[#E2E8F0]">
          <Container>
            <SectionHeading
              badge="Our Guiding Educational Philosophy"
              title="Every Student Has Their Own Pace, Time, and Way of Learning"
              subtitle="We do not impose any rigid or uniform syllabus that forces children onto a single standardized track. Because each learner has a distinct mindset, unique qualities, and their own speed of learning, our educators and therapists work deeply with individual students to nurture their authentic growth."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#8F2638]/10 text-[#8F2638] flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#101C3A] mb-3">No Rigid Syllabus Pressure</h3>
                  <p className="text-sm text-[#4A5568] leading-relaxed">
                    We never force two children into the exact same standardized mould. Each student receives a bespoke
                    developmental path aligned with their sensory patterns, cognitive strengths, and natural developmental rhythm.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-xs font-semibold text-[#8F2638]">
                  Custom Learning Pathways
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#101C3A]/10 text-[#101C3A] flex items-center justify-center mb-6">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#101C3A] mb-3">Deep One-on-One Engagement</h3>
                  <p className="text-sm text-[#4A5568] leading-relaxed">
                    Our therapists and educators immerse themselves directly with each learner, honoring their emotional cues
                    and personal communication speed to foster confidence in everyday life activities.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-xs font-semibold text-[#101C3A]">
                  Individual Focus &amp; Mentorship
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#F4C542]/20 text-[#101C3A] flex items-center justify-center mb-6">
                    <Users className="w-6 h-6 text-[#101C3A]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#101C3A] mb-3">Celebrating Authentic Milestones</h3>
                  <p className="text-sm text-[#4A5568] leading-relaxed">
                    Progress is never measured by rigid comparisons with others. We celebrate every personal step forward &mdash;
                    from self-care autonomy and joyful social interaction to seamless transitions into inclusive schooling.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-xs font-semibold text-[#8F2638]">
                  Dignity, Autonomy &amp; Inclusion
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION 4: GSAP SCROLL STORYTELLING STACK
        ================================================== */}
        <StackedCardStorytelling />

        {/* ==================================================
            SECTION F: LIFE AT THULIR (GALLERY PREVIEW)
        ================================================== */}
        <section className="py-20 lg:py-28 bg-white border-t border-[#E2E8F0]">
          <Container>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8F2638] bg-[#FDF4F5] px-3 py-1 rounded-md border border-[#8F2638]/20">
                  Experiences &amp; Community
                </span>
                <h2 className="text-3xl font-extrabold text-[#101C3A] mt-3 tracking-tight">
                  Life &amp; Learning at Thulir
                </h2>
                <p className="text-[#64748B] text-sm sm:text-base mt-2 max-w-xl">
                  A glimpse into our classrooms, sensory therapy environments, and outdoor community outings.
                </p>
              </div>
              <Link
                href="/gallery"
                className="text-sm font-semibold text-[#8F2638] hover:text-[#101C3A] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>View Gallery &amp; Events</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#FBFBFA] group">
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src="/assets/images/sensory_occupational_room.jpg"
                    alt="Sensory integration therapy room at Thulir"
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-[#8F2638] uppercase">Therapy Environments</p>
                  <h4 className="text-base font-bold text-[#101C3A] mt-1">Sensory Integration &amp; Motor Planning</h4>
                  <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                    Custom-designed spaces that support vestibular, proprioceptive, and tactile regulation.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#FBFBFA] group">
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src="/assets/images/special_education_classroom.jpg"
                    alt="Inclusive classroom learning activities"
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-[#101C3A] uppercase">Classroom Learning</p>
                  <h4 className="text-base font-bold text-[#101C3A] mt-1">Foundational Academics &amp; Social Interaction</h4>
                  <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                    Interactive small-group sessions encouraging peer communication and cognitive skills.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#FBFBFA] group">
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src="/assets/images/community_outing_park.jpg"
                    alt="Outdoor nature exploration outing in Coimbatore"
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-[#F4C542] text-[#151515] uppercase">Community Exposure</p>
                  <h4 className="text-base font-bold text-[#101C3A] mt-1">Supervised Real-World Outings</h4>
                  <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                    Outings to botanical gardens, parks, and public transport that build practical self-assurance.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION G: OUR MISSION AND VISION
        ================================================== */}
        <section className="py-20 lg:py-24 bg-[#101C3A] text-white border-t border-white/10">
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
            SECTION H: FAMILY AND COMMUNITY
        ================================================== */}
        <section className="py-20 lg:py-28 bg-[#FBFBFA] border-t border-[#E2E8F0]">
          <Container>
            <div className="max-w-4xl mx-auto">
              <SectionHeading
                badge="Involving Families"
                title="Walking Beside Parents &amp; the Wider Community"
                subtitle="Therapeutic progress is deepened when parents are active partners in their child's developmental path."
              />

              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-12 h-12 rounded-xl bg-[#8F2638]/10 text-[#8F2638] flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#101C3A]">Parent Participation in Sessions</h4>
                    <p className="text-sm text-[#4A5568] mt-2 leading-relaxed">
                      At Thulir, parents are encouraged to understand the therapeutic activities occurring in each session,
                      equipping them with practical tools and techniques to practice comfortably at home.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-12 h-12 rounded-xl bg-[#101C3A]/10 text-[#101C3A] flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#101C3A]">Community Awareness &amp; Camps</h4>
                    <p className="text-sm text-[#4A5568] mt-2 leading-relaxed">
                      Through initiatives such as our 1,000-person Walkathon at Race Course and community medical camps, we
                      work to foster greater public awareness, understanding, and acceptance for children with special needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION I: GOOGLE REVIEWS (VERIFIED PARENT EXPERIENCES)
        ================================================== */}
        <GoogleReviewsSection />

        {/* ==================================================
            SECTION J: FINAL CONTACT CTA
        ================================================== */}
        <section className="py-20 lg:py-24 bg-gradient-to-br from-[#101C3A] via-[#142348] to-[#0A1224] text-white">
          <Container size="narrow">
            <div className="text-center space-y-6">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#F4C542] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
                Begin With a Conversation
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Let&apos;s Explore What Growth Can Look Like for Your Child.
              </h2>
              <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto">
                Every child has their own timeline and potential. We welcome you to speak with our clinical and special
                education team to discuss your child&apos;s needs and explore available programs.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link
                  href="/contact"
                  className="bg-[#F4C542] hover:bg-[#E5B430] text-[#151515] font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
                >
                  <span>Connect With Our Team</span>
                  <ChevronRight className="w-5 h-5 text-[#151515]" />
                </Link>
                <Link
                  href="/programs"
                  className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-4 rounded-xl text-base border border-white/25 transition-all"
                >
                  <span>Explore All Programs</span>
                </Link>
              </div>

              <div className="pt-6 border-t border-white/10 text-xs text-white/60">
                <span>Rathinapuri &amp; Kuniyamuthur Campuses • Coimbatore, Tamil Nadu</span>
              </div>
            </div>
          </Container>
        </section>
      </main>

      {/* GLOBAL REUSABLE SITE FOOTER */}
      <SiteFooter />

      {/* FLOATING WHATSAPP CTA (CONFIG-CONTROLLED) */}
      <FloatingWhatsApp />
    </div>
  );
}
