"use client";

import React, { useState, useMemo } from "react";
import {
  GOOGLE_REVIEWS,
  GOOGLE_REVIEWS_METADATA,
} from "@/data/reviews";
import { Container } from "@/components/ui/Container";
import {
  Star,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

export function GoogleReviewsSection() {
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [filterType, setFilterType] = useState<"detailed" | "all">("detailed");

  // Reviews with text vs all reviews
  const displayedReviews = useMemo(() => {
    const list =
      filterType === "detailed"
        ? GOOGLE_REVIEWS.filter((r) => r.reviewText !== null && r.reviewText.trim().length > 0)
        : GOOGLE_REVIEWS;
    return list;
  }, [filterType]);

  const visibleList = displayedReviews.slice(0, visibleCount);
  const hasMore = visibleCount < displayedReviews.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, displayedReviews.length));
  };

  // Helper to extract initials safely
  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <section
      id="google-reviews"
      className="py-20 lg:py-28 bg-[#FBFBFA] border-t border-b border-[#E2E8F0] relative overflow-hidden"
    >
      <Container>
        {/* ==================================================
            HEADER & SOURCE-REPORTED METRICS
        ================================================== */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#101C3A] bg-white px-3.5 py-1.5 rounded-full border border-[#E2E8F0] shadow-2xs mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8F2638]" />
              <span>Authentic Family Feedback</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#101C3A] tracking-tight leading-tight">
              What Parents Say About Thulir
            </h2>

            <p className="text-sm sm:text-base text-[#4A5568] mt-3 leading-relaxed">
              Curated from verified public Google reviews submitted by parents, grandparents, and caregivers whose
              children have grown through our therapy and educational programs.
            </p>

            {/* Google Verified Aggregate Badge */}
            <div className="mt-4 flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-gray-200/80 shadow-2xs">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#101C3A] ml-1">
                  5.0 Rating
                </span>
              </div>

              <div className="text-xs text-[#64748B] flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span>
                  Based on <strong>{GOOGLE_REVIEWS_METADATA.reportedTotalReviews} Google Reviews</strong> reported by
                  the school
                </span>
              </div>
            </div>
          </div>

          {/* External Google Maps Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href={GOOGLE_REVIEWS_METADATA.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-50 text-[#101C3A] font-bold px-5 py-3 rounded-xl text-xs sm:text-sm border border-gray-300 shadow-xs hover:shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <span>Read All Reviews on Google</span>
              <ExternalLink className="w-4 h-4 text-[#8F2638]" />
            </a>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-4 text-xs font-semibold">
          <span className="text-gray-500 mr-2">Filter view:</span>
          <button
            type="button"
            onClick={() => {
              setFilterType("detailed");
              setVisibleCount(6);
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              filterType === "detailed"
                ? "bg-[#101C3A] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Detailed Parent Reviews
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterType("all");
              setVisibleCount(6);
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              filterType === "all"
                ? "bg-[#101C3A] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            All Reviews
          </button>
        </div>

        {/* ==================================================
            REVIEWS GRID
        ================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleList.map((review) => (
            <article
              key={review.id}
              className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Reviewer Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {/* Clean Initials Avatar (No fabricated photos) */}
                    <div className="w-10 h-10 rounded-full bg-[#101C3A]/10 text-[#101C3A] font-bold text-xs flex items-center justify-center shrink-0 border border-[#101C3A]/15 group-hover:bg-[#8F2638] group-hover:text-white transition-colors">
                      {getInitials(review.reviewerName)}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-[#101C3A] leading-snug line-clamp-1">
                        {review.reviewerName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px] text-[#64748B]">
                        <span>{review.relativeDate}</span>
                        {review.badges && review.badges.length > 0 && (
                          <>
                            <span>&bull;</span>
                            <span className="text-[#8F2638] font-medium">
                              {review.badges[0]}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 5-Star Visual Rating */}
                  <div
                    className="flex items-center gap-0.5 text-amber-400 shrink-0"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Review Body */}
                {review.reviewText ? (
                  <div>
                    <p className="text-xs sm:text-sm text-[#2D3748] leading-relaxed">
                      &ldquo;{review.reviewText}&rdquo;
                    </p>

                    {review.isTextTruncated && (
                      <p className="text-[11px] text-[#8F2638] font-medium mt-2">
                        &bull; Review continues on Google Maps
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="py-4 text-center border border-dashed border-gray-200 rounded-xl bg-[#FBFBFA]">
                    <span className="text-xs text-gray-500 italic">
                      5-Star Rating submitted on Google
                    </span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* ==================================================
            INTERACTIVE PAGINATION / EXPANSION
        ================================================== */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center">
          {hasMore ? (
            <button
              type="button"
              onClick={handleShowMore}
              className="bg-[#101C3A] hover:bg-[#1a2d5a] text-white font-bold px-8 py-3.5 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Show More Reviews</span>
              <ChevronDown className="w-4 h-4 text-[#F4C542]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setVisibleCount(6)}
              className="bg-gray-100 hover:bg-gray-200 text-[#101C3A] font-semibold px-6 py-2.5 rounded-xl text-xs transition-colors"
            >
              Show Less
            </button>
          )}
        </div>
      </Container>
    </section>
  );
}
