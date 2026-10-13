"use client";

import React, { useState } from "react";
import {
  MessageSquareQuote,
  Star,
  Search,
  CheckCircle2,
  ExternalLink,
  Quote,
} from "lucide-react";
import { GOOGLE_REVIEWS, GOOGLE_REVIEWS_METADATA } from "@/data/reviews";

export default function AdminTestimonialsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState<(typeof GOOGLE_REVIEWS)[0] | null>(null);

  const filteredReviews = GOOGLE_REVIEWS.filter((r) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      r.reviewerName.toLowerCase().includes(q) ||
      (r.reviewText && r.reviewText.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#101C3A] font-[var(--font-heading)] flex items-center gap-2">
            <MessageSquareQuote className="w-6 h-6 text-[#8F2638]" />
            Parent Testimonials &amp; Verified Reviews
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Curated parent reflections and 5-star Google reviews celebrating student growth and clinical dedication.
          </p>
        </div>

        <a
          href={GOOGLE_REVIEWS_METADATA.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E2E8F0] text-[#101C3A] hover:bg-[#F1F4F9] transition self-start sm:self-auto"
        >
          <span>View on Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Verified Stats Banner */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F4C542]/20 text-[#101C3A] flex items-center justify-center font-bold text-lg">
            5.0
          </div>
          <div>
            <div className="flex items-center gap-1 text-[#F4C542]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <div className="text-xs font-semibold text-[#101C3A] mt-0.5">
              {GOOGLE_REVIEWS_METADATA.reportedTotalReviews} Verified Parent Reviews
            </div>
          </div>
        </div>

        <div className="text-xs text-[#64748B] max-w-md">
          {GOOGLE_REVIEWS_METADATA.disclaimer}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reviews by parent name or keyword (e.g. sensory, speech, Dr. Venkatesan)..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-[#FBFBFA] border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
          />
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReviews.slice(0, 30).map((review) => (
          <div
            key={review.id}
            onClick={() => setSelectedReview(review)}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-2xs flex flex-col justify-between hover:border-[#101C3A]/30 transition cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-[#F4C542]">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-[#64748B] font-medium">
                  {review.relativeDate}
                </span>
              </div>

              <Quote className="w-5 h-5 text-[#8F2638]/20 mb-2" />
              <p className="text-xs text-[#2D3748] leading-relaxed line-clamp-4 italic">
                &ldquo;{review.reviewText || "No text provided (Rating only)"}&rdquo;
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <div>
                <strong className="block text-xs text-[#101C3A] capitalize">
                  {review.reviewerName}
                </strong>
                <span className="text-[10px] text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Google Verified
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-[#101C3A]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <strong className="text-sm text-[#101C3A] capitalize">
                  {selectedReview.reviewerName}
                </strong>
                <div className="flex items-center gap-1 text-[#F4C542] mt-0.5">
                  {[...Array(selectedReview.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                  <span className="text-[11px] text-[#64748B] ml-1">
                    &bull; {selectedReview.relativeDate}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="px-2.5 py-1 text-xs font-semibold text-[#64748B] hover:text-[#101C3A]"
              >
                Close
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E2E8F0] text-xs text-[#2D3748] leading-relaxed italic">
              &ldquo;{selectedReview.reviewText}&rdquo;
            </div>

            {selectedReview.ownerResponse && (
              <div className="p-3.5 rounded-xl bg-[#FDF4F5] border border-[#8F2638]/20 text-xs text-[#8F2638]">
                <strong className="block font-bold mb-1">Response from Management:</strong>
                <p className="leading-relaxed">{selectedReview.ownerResponse.text}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 bg-[#101C3A] text-white rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
