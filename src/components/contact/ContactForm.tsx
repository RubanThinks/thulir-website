"use client";

import React, { useState } from "react";
import {
  Send,
  AlertCircle,
  CheckCircle2,
  Phone,
  RefreshCw,
  School,
  Clock,
} from "lucide-react";

interface FormData {
  parentName: string;
  email: string;
  phone: string;
  campus: string;
  serviceCategory: string;
  childAge: string;
  message: string;
  botCheck?: string;
}

interface FormErrors {
  parentName?: string;
  email?: string;
  phone?: string;
  serviceCategory?: string;
  message?: string;
  general?: string;
}

interface SubmissionSuccess {
  inquiryId: string;
  parentName: string;
  email: string;
  phone: string;
  serviceCategory: string;
}

const ALL_PROGRAM_OPTIONS = [
  "Physiotherapy",
  "Paediatric Occupational Therapy",
  "Speech Therapy",
  "Special Education (IEP)",
  "Behavior Therapy",
  "Sensory Integration Therapy",
  "Neuro Developmental Therapy (NDT)",
  "Psychological Services",
  "Play, Art, Music & Dance Therapy",
  "Autism Support",
  "ADHD Care & Focus",
  "Down's Syndrome Support",
  "Cerebral Palsy Care",
  "Speech Delay Intervention",
  "Intellectual Disability Support",
  "Reading & Writing Difficulty",
  "Sensory Processing Disorder (SPD)",
  "Developmental Delay (Early Intervention)",
  "ADL Training (Activities of Daily Living)",
  "Pre-vocational & Vocational Training",
  "Early Intervention (Infants & Toddlers)",
  "Comprehensive Developmental Assessment",
  "General Admission Inquiry",
];

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    parentName: "",
    email: "",
    phone: "",
    campus: "rathinapuri",
    serviceCategory: "Physiotherapy",
    childAge: "",
    message: "",
    botCheck: "",
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("service") || params.get("program");
    if (requested) {
      const term = requested.toLowerCase().replace(/-/g, " ");
      const match = ALL_PROGRAM_OPTIONS.find((opt) =>
        opt.toLowerCase().includes(term) || term.includes(opt.toLowerCase())
      );
      if (match) {
        setFormData((prev) => ({ ...prev, serviceCategory: match }));
      }
    }
  }, []);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<SubmissionSuccess | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.parentName.trim()) {
      newErrors.parentName = "Please provide your name.";
    } else if (formData.parentName.trim().length < 2) {
      newErrors.parentName = "Name must be at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please provide your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please provide a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please provide a phone number.";
    } else if (formData.phone.trim().replace(/\D/g, "").length < 8) {
      newErrors.phone = "Please provide a valid phone number (at least 8 digits).";
    }

    if (!formData.serviceCategory.trim()) {
      newErrors.serviceCategory = "Please select a program or therapy of interest.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please share a brief message about your child's needs or your inquiry.";
    } else if (formData.message.trim().length < 15) {
      newErrors.message = "Please provide a little more detail (at least 15 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const preferredBranch =
        formData.campus === "kuniyamuthur"
          ? "kuniyamuthur"
          : formData.campus === "rathinapuri"
          ? "rathinapuri"
          : "undecided";

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: formData.parentName,
          email: formData.email,
          phone: formData.phone,
          preferredBranch,
          serviceCategory: formData.serviceCategory,
          childAge: formData.childAge,
          message: formData.message,
          botCheck: formData.botCheck,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrors({
          general:
            data.error ||
            "Unable to submit inquiry at this moment. Please check your details and try again.",
        });
        setIsSubmitting(false);
        return;
      }

      setSuccessData({
        inquiryId: data.inquiryId,
        parentName: formData.parentName,
        email: formData.email,
        phone: formData.phone,
        serviceCategory: formData.serviceCategory,
      });
      setIsSubmitting(false);
    } catch {
      setErrors({
        general:
          "Network connection failed. Please check your internet connection or call our campus directly.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/90 p-7 sm:p-10 shadow-lg">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8F2638] bg-[#8F2638]/10 px-3 py-1 rounded-full">
          Admissions &amp; Inquiries
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101C3A] mt-2 font-[var(--font-heading)]">
          Send Us an Inquiry
        </h2>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          Share your child&apos;s developmental journey with us. Every inquiry is saved securely to our admissions system and treated with strict confidentiality.
        </p>
      </div>

      {successData ? (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2.5 py-0.5 rounded-full">
                Inquiry Saved Successfully
              </span>
              <h3 className="text-xl font-bold text-[#101C3A] mt-1.5 font-[var(--font-heading)]">
                Thank You, {successData.parentName}
              </h3>
              <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                Your inquiry has been registered in our admissions system. A confirmation email has been dispatched to <strong>{successData.email}</strong>.
              </p>
            </div>
          </div>

          <div className="bg-white/95 border border-emerald-200/80 rounded-xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Official Reference ID:
              </span>
              <span className="font-mono text-sm font-bold text-[#101C3A] bg-gray-100 px-2.5 py-1 rounded-md">
                {successData.inquiryId}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700 pt-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8F2638]" />
                <span>Admissions Review: <strong>24–48 Business Hours</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-[#101C3A]" />
                <span>Program: <strong>{successData.serviceCategory}</strong></span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-100/50 rounded-xl p-4 text-xs text-emerald-950 flex items-start gap-3">
            <Phone className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Need immediate assistance? You may also reach out directly to our principal coordinator at{" "}
              <strong>+91 96599 34210</strong> or via our campus desks at <strong>0422 - 2234210</strong>.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setSuccessData(null);
                setFormData({
                  parentName: "",
                  email: "",
                  phone: "",
                  campus: "rathinapuri",
                  serviceCategory: "Physiotherapy",
                  childAge: "",
                  message: "",
                  botCheck: "",
                });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#101C3A] text-white hover:bg-[#1A2E5A] transition shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Submit Another Inquiry</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* General Error Banner */}
          {errors.general && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-3 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errors.general}</div>
            </div>
          )}

          {/* Anti-spam honeypot (invisible to humans) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="botCheck">Leave this empty</label>
            <input
              type="text"
              id="botCheck"
              name="botCheck"
              value={formData.botCheck}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Parent/Guardian Name */}
          <div>
            <label
              htmlFor="parentName"
              className="block text-xs sm:text-sm font-bold text-[#101C3A] mb-2"
            >
              Parent or Guardian Name <span className="text-[#8F2638]">*</span>
            </label>
            <input
              type="text"
              id="parentName"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              placeholder="e.g., S. Meenakshi"
              aria-invalid={!!errors.parentName}
              aria-describedby={errors.parentName ? "parentName-error" : undefined}
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-hidden ${
                errors.parentName
                  ? "border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400"
                  : "border-gray-300 focus:border-[#101C3A] focus:ring-2 focus:ring-[#101C3A]/20"
              }`}
            />
            {errors.parentName && (
              <p id="parentName-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.parentName}
              </p>
            )}
          </div>

          {/* Contact Details (Email & Phone) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-bold text-[#101C3A] mb-2"
              >
                Email Address <span className="text-[#8F2638]">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="parent@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-hidden ${
                  errors.email
                    ? "border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400"
                    : "border-gray-300 focus:border-[#101C3A] focus:ring-2 focus:ring-[#101C3A]/20"
                }`}
              />
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-xs sm:text-sm font-bold text-[#101C3A] mb-2"
              >
                Phone Number <span className="text-[#8F2638]">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g., 96599 34210"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-hidden ${
                  errors.phone
                    ? "border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400"
                    : "border-gray-300 focus:border-[#101C3A] focus:ring-2 focus:ring-[#101C3A]/20"
                }`}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Campus & Service Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="campus"
                className="block text-xs sm:text-sm font-bold text-[#101C3A] mb-2"
              >
                Preferred Campus
              </label>
              <select
                id="campus"
                name="campus"
                value={formData.campus}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm bg-white focus:border-[#101C3A] focus:ring-2 focus:ring-[#101C3A]/20 transition-all focus:outline-hidden"
              >
                <option value="rathinapuri">Rathinapuri Campus (Main Center)</option>
                <option value="kuniyamuthur">Kuniyamuthur Campus</option>
                <option value="either">Either Campus / Unsure</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="serviceCategory"
                className="block text-xs sm:text-sm font-bold text-[#101C3A] mb-2"
              >
                Program or Therapy of Interest <span className="text-[#8F2638]">*</span>
              </label>
              <select
                id="serviceCategory"
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-hidden transition-all ${
                  errors.serviceCategory
                    ? "border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400"
                    : "border-gray-300 focus:border-[#101C3A] focus:ring-2 focus:ring-[#101C3A]/20"
                }`}
              >
                <optgroup label="Core Clinical Services & Therapies">
                  <option value="Physiotherapy">Physiotherapy</option>
                  <option value="Paediatric Occupational Therapy">Paediatric Occupational Therapy</option>
                  <option value="Speech Therapy">Speech Therapy</option>
                  <option value="Special Education (IEP)">Special Education (IEP)</option>
                  <option value="Behavior Therapy">Behavior Therapy</option>
                  <option value="Sensory Integration Therapy">Sensory Integration Therapy</option>
                  <option value="Neuro Developmental Therapy">Neuro Developmental Therapy (NDT)</option>
                  <option value="Psychological Services">Psychological Services</option>
                  <option value="Play, Art, Music & Dance Therapy">Play, Art, Music &amp; Dance Therapy</option>
                </optgroup>
                <optgroup label="Specialized Care & Support Tracks">
                  <option value="Autism Support">Autism Spectrum Support</option>
                  <option value="ADHD Support">ADHD Care &amp; Focus</option>
                  <option value="Down's Syndrome Support">Down&apos;s Syndrome Support</option>
                  <option value="Cerebral Palsy Care">Cerebral Palsy Care</option>
                  <option value="Speech Delay Intervention">Speech Delay Intervention</option>
                  <option value="Intellectual Disability Support">Intellectual Disability Support</option>
                  <option value="Reading & Writing Difficulty">Reading &amp; Writing Difficulty</option>
                  <option value="Sensory Processing Disorder (SPD)">Sensory Processing Disorder (SPD)</option>
                  <option value="Developmental Delay Support">Developmental Delay Support</option>
                  <option value="ADL Training (Activities of Daily Living)">ADL Training (Activities of Daily Living)</option>
                  <option value="Pre-vocational & Vocational Training">Pre-vocational &amp; Vocational Training</option>
                </optgroup>
                <optgroup label="General Consultations & Early Years">
                  <option value="Early Intervention (Infants & Toddlers)">Early Intervention (Infants &amp; Toddlers)</option>
                  <option value="Comprehensive Developmental Assessment">Comprehensive Developmental Assessment</option>
                  <option value="General Admission Inquiry">General Admission Inquiry / Unsure</option>
                </optgroup>
              </select>
              {errors.serviceCategory && (
                <p id="serviceCategory-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.serviceCategory}
                </p>
              )}
            </div>
          </div>

          {/* Child Age */}
          <div>
            <label
              htmlFor="childAge"
              className="block text-xs sm:text-sm font-bold text-[#101C3A] mb-2"
            >
              Child&apos;s Age / Current Stage{" "}
              <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              id="childAge"
              name="childAge"
              value={formData.childAge}
              onChange={handleChange}
              placeholder="e.g., 4 years old / Early preschool"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:border-[#101C3A] focus:ring-2 focus:ring-[#101C3A]/20 transition-all focus:outline-hidden"
            />
          </div>

          {/* Message / Needs Description */}
          <div>
            <label
              htmlFor="message"
              className="block text-xs sm:text-sm font-bold text-[#101C3A] mb-2"
            >
              How Can We Help Your Child? <span className="text-[#8F2638]">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us briefly about your child's developmental background, current routines, or specific support you are seeking..."
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-hidden resize-none ${
                errors.message
                  ? "border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400"
                  : "border-gray-300 focus:border-[#101C3A] focus:ring-2 focus:ring-[#101C3A]/20"
              }`}
            />
            {errors.message && (
              <p id="message-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-w-[200px] bg-[#101C3A] hover:bg-[#1a2d5a] disabled:bg-gray-400 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <>
                  <span>Submit Inquiry</span>
                  <Send className="w-4 h-4 text-[#F4C542]" />
                </>
              )}
            </button>
            <p className="mt-3 text-xs text-gray-500">
              * Inquiries are stored securely in our private administrative system and treated with strict confidentiality.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
