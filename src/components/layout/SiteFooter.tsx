import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { MapPin, Clock, ShieldCheck, Heart, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[#101C3A] text-white border-t border-white/10 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group" aria-label="Thulir Special School Home">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center p-3 shadow-xl border-2 border-white/20 group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300">
                <div className="relative w-full h-full">
                  <Image
                    src="/assets/branding/logo.png"
                    alt="Thulir Special School and Therapy Centre"
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                </div>
              </div>
            </Link>
            <p className="text-xs font-normal text-white/75 max-w-sm leading-relaxed">
              Managed by <strong>{siteConfig.brand.parentOrganization}</strong>. Providing specialized pediatric
              occupational therapy, speech development, special education, and family support across Coimbatore since 2017.
            </p>
            <div className="pt-1 text-xs text-white/80">
              <p className="flex items-center gap-1.5 text-[#F4C542] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#F4C542]" />
                <span>Dedicated to Developmental Dignity &amp; Inclusion</span>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#F4C542] mb-4">Navigation</p>
            <ul className="space-y-2.5 text-xs text-white/80 font-medium">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs & Services */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#F4C542] mb-4">Therapies &amp; Care</p>
            <ul className="space-y-2.5 text-xs text-white/80 font-medium">
              {siteConfig.programsAndTherapies.map((prog) => (
                <li key={prog.id}>
                  <Link href="/programs" className="hover:text-white transition-colors">
                    {prog.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/programs" className="hover:text-white transition-colors">
                  Community Exposure Outings
                </Link>
              </li>
            </ul>
          </div>

          {/* Campuses & Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#F4C542] mb-4">Campuses &amp; Social</p>
            <div className="space-y-3.5 text-xs text-white/80">
              <div className="space-y-1">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F4C542]" />
                  <span>Rathinapuri Campus (Main Center)</span>
                </p>
                <p className="text-white/70 text-[11px] pl-5">No. 42, Gandhiji Road, Rathinapuri, Coimbatore 641027</p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F4C542]" />
                  <span>Kuniyamuthur Campus</span>
                </p>
                <p className="text-white/70 text-[11px] pl-5">No. 54, Anamanaicker St, 6th Cross, Kuniyamuthur 641008</p>
              </div>

              <div className="pt-1">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-flex items-center gap-1.5 text-white/90 hover:text-[#F4C542] text-xs font-medium transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#F4C542] shrink-0" />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-2.5">
                  <a
                    href={siteConfig.brand.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Thulir Special School on Instagram"
                    title="Follow @thulir_special_school on Instagram"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-white flex items-center justify-center transition-all duration-300 border border-white/15 hover:scale-110 shadow-sm"
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

                  <a
                    href={siteConfig.brand.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Subscribe to Thulir Special School on YouTube"
                    title="Watch Thulir Special School on YouTube"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF0000] text-white flex items-center justify-center transition-all duration-300 border border-white/15 hover:scale-110 shadow-sm"
                  >
                    <svg
                      className="w-5 h-5 fill-white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>

                  <span className="text-xs text-white/80 font-medium ml-1">Follow Our Channels</span>
                </div>

                <div className="flex items-center gap-2 text-white/70">
                  <Clock className="w-4 h-4 text-white/50 shrink-0" />
                  <span className="text-[11px]">{siteConfig.contact.timings}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Ethics Note */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-white/60 gap-4">
          <p>© 2026 {siteConfig.brand.parentOrganization}. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-white/70">
            <span>Nurturing Potential with Respect &amp; Compassion</span>
            <Heart className="w-3.5 h-3.5 text-[#8F2638] fill-[#8F2638]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
