import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  MapPin,
  Mail,
  Clock,
  Building2,
  Heart,
  ShieldCheck,
  Phone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Admissions | Thulir Special School",
  description:
    "Connect with Thulir Special School in Coimbatore. Explore campus locations across our Main Campus and Kuniyamuthur Campus, therapy admissions, and developmental consultations.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#151515]">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* ==================================================
            SECTION A: HERO
        ================================================== */}
        <section className="bg-gradient-to-b from-[#101C3A] via-[#142348] to-[#101C3A] text-white pt-16 pb-20 lg:pt-20 lg:pb-24 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8F2638]/20 rounded-full blur-3xl pointer-events-none" />
          <Container>
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#F4C542] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 mb-4">
                Admissions & Family Consultations
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                Let&apos;s Take the Next Step{" "}
                <span className="text-[#F4C542] block sm:inline">Together.</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-white/85 leading-relaxed font-normal">
                Whether you are exploring early intervention for your toddler, seeking specialized pediatric therapy,
                or planning admissions for full-time special schooling, we are here to listen with compassion and
                clarity.
              </p>
            </div>
          </Container>
        </section>

        {/* ==================================================
            MAIN CONTENT: CONTACT INFO + FORM
        ================================================== */}
        <section className="py-16 sm:py-20 bg-[#FBFBFA]">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Campus Information & Verified Details */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <SectionHeading
                    badge="Locations & Campus Info"
                    title="Our Campuses in Coimbatore"
                    subtitle="Operating two dedicated centres to serve families across Coimbatore with accessible therapy and special education."
                  />
                </div>

                {/* Campus 1: Main Center */}
                <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-white bg-[#101C3A] px-2.5 py-1 rounded-md">
                      Main Center
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Headquarters</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#101C3A]">
                    Main Campus
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Equipped with sensory integration facilities, speech cabins, and foundational life skills rooms.
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-start gap-3 text-xs sm:text-sm text-gray-700">
                    <MapPin className="w-5 h-5 text-[#8F2638] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#101C3A] font-semibold">Address:</strong>
                      <span>
                        64/S, Aruna Nagar, Near Ponmani Kalyana Mandapam, Nallampalayam, Ganapathy Post, Coimbatore, Tamil Nadu 641006
                      </span>
                    </div>
                  </div>
                </div>

                {/* Campus 2: Kuniyamuthur Branch */}
                <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8F2638] bg-[#8F2638]/10 px-2.5 py-1 rounded-md">
                      Branch Campus
                    </span>
                    <span className="text-xs text-gray-500 font-medium">South Coimbatore</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#101C3A]">
                    Kuniyamuthur Campus
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Specialized education and developmental therapy wing serving children and families in South
                    Coimbatore.
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-start gap-3 text-xs sm:text-sm text-gray-700">
                    <MapPin className="w-5 h-5 text-[#8F2638] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#101C3A] font-semibold">Address:</strong>
                      <span>
                        No. 54, Anamanaicker Street (6th Cross), Park Avenue, Kuniyamuthur, Coimbatore, Tamil Nadu 641008
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verified Contact Details Card */}
                <div className="bg-[#101C3A] text-white rounded-2xl p-6 sm:p-7 shadow-md space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#F4C542]" />
                    Official Institutional Details
                  </h3>

                  <div className="text-xs text-white/80 space-y-3">
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-[#F4C542] font-semibold">
                        Registered Identity
                      </span>
                      <span className="text-sm font-medium text-white">
                        {siteConfig.brand.parentOrganization}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 pt-2 border-t border-white/10">
                      <Phone className="w-4 h-4 text-[#F4C542] shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[11px] uppercase tracking-wider text-white/60">
                          Direct Campus Helplines
                        </span>
                        <div className="space-y-1 mt-0.5">
                          <p>
                            <span className="text-white/70">Main Desk: </span>
                            <a
                              href="tel:04222234210"
                              className="text-white hover:text-[#F4C542] font-semibold transition-colors"
                            >
                              0422 - 2234210
                            </a>
                          </p>
                          <p>
                            <span className="text-white/70">Mobile: </span>
                            <a
                              href="tel:+919659934210"
                              className="text-white hover:text-[#F4C542] font-semibold transition-colors"
                            >
                              +91 96599 34210
                            </a>
                            <span className="text-white/50 mx-1.5">&bull;</span>
                            <a
                              href="tel:+918925514210"
                              className="text-white hover:text-[#F4C542] font-semibold transition-colors"
                            >
                              +91 89255 14210
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-2 border-t border-white/10">
                      <Mail className="w-4 h-4 text-[#F4C542] shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[11px] uppercase tracking-wider text-white/60">
                          Official Email
                        </span>
                        <a
                          href={`mailto:${siteConfig.contact.email}`}
                          className="text-white hover:text-[#F4C542] font-semibold transition-colors underline"
                        >
                          {siteConfig.contact.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-2 border-t border-white/10">
                      <Clock className="w-4 h-4 text-[#F4C542] shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[11px] uppercase tracking-wider text-white/60">
                          Operating Hours
                        </span>
                        <span className="text-white font-medium">
                          {siteConfig.contact.timings}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                      <a
                        href={siteConfig.brand.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Thulir Special School on Instagram"
                        title="Follow @thulir_special_school on Instagram"
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-white flex items-center justify-center transition-all duration-300 border border-white/15 hover:scale-110 shadow-sm shrink-0"
                      >
                        <svg
                          className="w-5 h-5 fill-none stroke-white stroke-2"
                          viewBox="0 0 24 24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      </a>
                      <div>
                        <span className="block text-[11px] uppercase tracking-wider text-white/60">
                          Instagram Community
                        </span>
                        <a
                          href={siteConfig.brand.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-[#F4C542] font-semibold transition-colors text-xs"
                        >
                          Follow @thulir_special_school
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                      <a
                        href={siteConfig.brand.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Thulir Special School on YouTube"
                        title="Watch Thulir Special School on YouTube"
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF0000] text-white flex items-center justify-center transition-all duration-300 border border-white/15 hover:scale-110 shadow-sm shrink-0"
                      >
                        <svg
                          className="w-5 h-5 fill-white"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </a>
                      <div>
                        <span className="block text-[11px] uppercase tracking-wider text-white/60">
                          Official YouTube
                        </span>
                        <a
                          href={siteConfig.brand.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-[#F4C542] font-semibold transition-colors text-xs"
                        >
                          Watch on YouTube
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Form */}
              <div className="lg:col-span-7">
                <ContactForm />
              </div>
            </div>
          </Container>
        </section>

        {/* ==================================================
            INTERACTIVE GOOGLE MAP LOCATION
        ================================================== */}
        <section className="py-16 bg-[#FBFBFA] border-t border-gray-200">
          <Container>
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8F2638] bg-[#8F2638]/10 px-2.5 py-1 rounded-md">
                Find Our Campuses
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101C3A] mt-2">
                Locate Thulir Special School &amp; Therapy Centre
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Explore our campus locations across Coimbatore on Google Maps for simple visiting directions.
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-md bg-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125313.70496769146!2d76.81117454335937!3d11.0346295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85bbc9c175f23%3A0x29f7783bb34a50f0!2sThulir%20therapy%20centre%20and%20special%20school!5e0!3m2!1sen!2sin!4v1791743886919!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Thulir Special School Google Maps Location"
                className="w-full h-[400px] sm:h-[480px]"
              />
            </div>
          </Container>
        </section>

        {/* ==================================================
            SECTION F: REASSURANCE & VISITING POLICY
        ================================================== */}
        <section className="py-16 bg-white border-t border-gray-100">
          <Container>
            <div className="max-w-4xl mx-auto bg-[#FBFBFA] border border-gray-200/90 rounded-3xl p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-[#8F2638]/10 text-[#8F2638] flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#101C3A]">
                    Our Reassurance to Every Family
                  </h3>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    We understand that reaching out to a special school can feel overwhelming or emotional. At Thulir,
                    we maintain an environment of dignity, patience, and zero commercial pressure. Every child is
                    evaluated on their own developmental timeline, and our therapists will honestly discuss whether
                    our programs align with your child&apos;s best interests.
                  </p>
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Completely confidential developmental records</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Individualized evaluation before placement</span>
                    </div>
                  </div>
                </div>
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
