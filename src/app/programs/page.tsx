import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { getPublishedPrograms } from "@/lib/services/programs";
import {
  ChevronRight,
  CheckCircle2,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Programs & Therapies | Thulir Special School",
  description:
    "Explore specialized pediatric occupational therapy, speech and communication, physiotherapy, and special education programs at Thulir in Coimbatore.",
};

const FAQ_ITEMS = [
  {
    question: "What programs and therapies does Thulir Special School offer?",
    answer:
      "Thulir offers specialized Occupational Therapy (focusing on sensory integration and everyday life skills), Speech & Communication Therapy, Pediatric Physiotherapy (mobility and posture), and Special Education with Individualized Education Programs (IEPs).",
  },
  {
    question: "Where are Thulir's campuses located?",
    answer:
      "We operate two campuses in Coimbatore: our main specialized centre in Rathinapuri (No. 42, Gandhiji Road, Thayirriteri Road) and our second branch in Kuniyamuthur.",
  },
  {
    question: "How can parents enquire about starting a program?",
    answer:
      "Parents can get in touch with our team through our online inquiry form or by visiting either campus. We will discuss your child's specific developmental history, observe their current strengths and needs, and outline a suitable pathway.",
  },
  {
    question: "Are parents involved during therapy and learning sessions?",
    answer:
      "Yes. Parent collaboration is a core element of our approach. We encourage parents to understand the therapeutic exercises and sensory activities so they can reinforce them comfortably at home.",
  },
];

export default async function ProgramsPage() {
  const programs = await getPublishedPrograms();

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#151515]">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* ==================================================
            HERO SECTION
        ================================================== */}
        <section className="bg-gradient-to-b from-[#101C3A] via-[#142348] to-[#101C3A] text-white pt-16 pb-20 lg:pt-20 lg:pb-28 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F4C542]/10 rounded-full blur-3xl pointer-events-none" />
          <Container>
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#F4C542] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 mb-4">
                Specialized Services Spectrum
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white font-[var(--font-heading)]">
                Personalized Care for Every Child&apos;s Development.
              </h1>
              <p className="mt-6 text-base sm:text-lg text-white/85 leading-relaxed font-normal">
                Every child has their own rhythm and sensory profile. Our programs combine pediatric clinical therapy,
                milestone-driven special education, and everyday life skills in a warm, encouraging environment.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="bg-[#F4C542] hover:bg-[#E5B430] text-[#151515] font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <span>Inquire for Your Child</span>
                  <ChevronRight className="w-4 h-4 text-[#151515]" />
                </Link>
                <a
                  href="#how-to-enquire"
                  className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3.5 rounded-xl text-sm border border-white/25 transition-all"
                >
                  <span>How to Enquire</span>
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            DETAILED PROGRAMS SECTION (LIVE FROM FIRESTORE)
        ================================================== */}
        <section className="py-20 lg:py-28 bg-white border-b border-[#E2E8F0]">
          <Container>
            <SectionHeading
              badge="Evidence-Based Interventions"
              title="Specialized Clinical Programs"
              subtitle="Designed to support sensory regulation, functional communication, physical movement, and foundational academic learning."
            />

            <div className="space-y-16">
              {programs.map((program, idx) => {
                const isEven = idx % 2 === 1;
                const isTherapy = program.category === "therapy";

                return (
                  <div
                    key={program.id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#FBFBFA] p-6 sm:p-10 rounded-3xl border border-[#E2E8F0]"
                  >
                    {/* Content Column */}
                    <div
                      className={`lg:col-span-6 space-y-4 ${
                        isEven ? "order-1 lg:order-2" : ""
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md border ${
                            isTherapy
                              ? "text-[#8F2638] bg-[#FDF4F5] border-[#8F2638]/20"
                              : "text-[#101C3A] bg-white border-[#E2E8F0]"
                          }`}
                        >
                          {program.category === "therapy"
                            ? "Clinical Therapy"
                            : program.category === "education"
                            ? "Special Education & IEP"
                            : "Life Skills & Support"}
                        </span>
                        {program.targetAgeRange && (
                          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md">
                            Age: {program.targetAgeRange}
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#101C3A] font-[var(--font-heading)]">
                        {program.title}
                      </h3>

                      <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed">
                        {program.fullDescription || program.shortDescription}
                      </p>

                      {program.clinicalApproaches && program.clinicalApproaches.length > 0 && (
                        <div className="space-y-2 pt-2 text-xs sm:text-sm text-[#2D3748]">
                          <p className="font-semibold text-[#101C3A]">Areas of Focus &amp; Support:</p>
                          <ul className="space-y-1.5 pl-1">
                            {program.clinicalApproaches.map((app, aIdx) => (
                              <li key={aIdx} className="flex items-start gap-2">
                                <CheckCircle2
                                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                                    isTherapy ? "text-[#8F2638]" : "text-[#101C3A]"
                                  }`}
                                />
                                <span>{app}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="pt-4">
                        <Link
                          href="/contact"
                          className={`inline-flex items-center gap-2 text-xs font-bold ${
                            isTherapy
                              ? "text-[#8F2638] hover:text-[#101C3A]"
                              : "text-[#101C3A] hover:text-[#8F2638]"
                          }`}
                        >
                          <span>Enquire About {program.title}</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Image Column */}
                    <div
                      className={`lg:col-span-6 relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-[#E2E8F0] ${
                        isEven ? "order-2 lg:order-1" : ""
                      }`}
                    >
                      <Image
                        src={program.heroImageUrl || "/assets/images/occupational_therapy.jpg"}
                        alt={program.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ==================================================
            WORKING WITH FAMILIES
        ================================================== */}
        <section className="py-20 lg:py-24 bg-[#FBFBFA] border-b border-[#E2E8F0]">
          <Container>
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-[#E2E8F0] shadow-xs">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8F2638] bg-[#FDF4F5] px-3.5 py-1.5 rounded-full border border-[#8F2638]/20 mb-4">
                <Users className="w-4 h-4" />
                <span>Family Partnership</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101C3A] tracking-tight font-[var(--font-heading)]">
                Walking Beside Families at Every Step
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#4A5568] leading-relaxed">
                We believe that a child&apos;s primary sanctuary is their family. Rather than keeping therapy behind closed
                doors, Thulir welcomes parents into sessions to observe techniques firsthand. By providing clear guidance on
                sensory management, communication routines, and daily activities, we help families feel empowered, supported,
                and confident in their child&apos;s daily progress.
              </p>
            </div>
          </Container>
        </section>

        {/* ==================================================
            HOW TO ENQUIRE / INTAKE PROCESS
        ================================================== */}
        <section id="how-to-enquire" className="py-20 lg:py-24 bg-white border-b border-[#E2E8F0]">
          <Container>
            <SectionHeading
              badge="Intake & Evaluation"
              title="Our Four-Step Admissions Pathway"
              subtitle="A clear, compassionate journey from initial parent conversation to tailored developmental support."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Initial Parent Enquiry",
                  desc: "Connect with our admissions desk online or by phone. We listen to your child's background and schedule a comprehensive initial meeting.",
                },
                {
                  step: "02",
                  title: "Observational Assessment",
                  desc: "Dr. S. Venkatesan and our pediatric therapists observe your child's sensory, communication, and motor profiles in our clinical rooms.",
                },
                {
                  step: "03",
                  title: "Collaborative Program Plan",
                  desc: "We co-create an Individualized Education Program (IEP) or therapy regimen with clear developmental milestones tailored to your child.",
                },
                {
                  step: "04",
                  title: "Continuous Progress Reviews",
                  desc: "Regular therapy sessions, home activity guidance, and quarterly milestone reviews ensure transparent, measurable developmental growth.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#FBFBFA] border border-[#E2E8F0] space-y-3 relative overflow-hidden"
                >
                  <span className="text-3xl font-extrabold text-[#101C3A]/15 font-[var(--font-heading)]">
                    {item.step}
                  </span>
                  <h3 className="text-base font-bold text-[#101C3A] font-[var(--font-heading)]">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#8F2638] hover:bg-[#A83246] text-white font-bold px-8 py-4 rounded-xl text-sm transition-all shadow-md active:scale-95"
              >
                <span>Start Your Child&apos;s Admissions Journey</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </Container>
        </section>

        {/* ==================================================
            FAQ SECTION
        ================================================== */}
        <section className="py-20 lg:py-24 bg-[#FBFBFA]">
          <Container>
            <div className="max-w-3xl mx-auto">
              <SectionHeading
                badge="Questions & Clarifications"
                title="Frequently Asked Questions"
                subtitle="Essential information regarding our pediatric therapies, campus admissions, and family collaboration."
              />
              <FaqAccordion items={FAQ_ITEMS} />
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
      <FloatingWhatsApp />
    </div>
  );
}
