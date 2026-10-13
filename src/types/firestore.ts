/**
 * Firestore Schema & Data Architecture Definitions
 * Designed for strict server validation, type-safety, and CRUD operations.
 */

export type Timestamp = {
  seconds: number;
  nanoseconds: number;
};

// 1. SERVICES & THERAPIES COLLECTION: `services`
export interface ServiceDocument {
  id: string; // Document ID (slug, e.g., 'occupational-therapy')
  title: string;
  slug: string;
  category: "therapy" | "education" | "support";
  shortDescription: string;
  fullDescription: string;
  clinicalApproaches: string[]; // e.g. ["Sensory Integration", "Motor Planning", "ADL Training"]
  targetAgeRange?: string; // e.g. "2-16 years"
  heroImageUrl: string;
  galleryImageUrls?: string[];
  order: number;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 2. GALLERY COLLECTION: `gallery`
export interface GalleryItemDocument {
  id: string;
  title: string;
  caption: string;
  cloudinaryPublicId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: "campus" | "therapy" | "events" | "field-trips" | "achievements";
  tags: string[];
  dateCaptured?: string;
  isPublished: boolean;
  featuredOnHome: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 3. EVENTS & ACTIVITIES COLLECTION: `events`
export interface EventDocument {
  id: string;
  title: string;
  slug: string;
  eventDate: string; // ISO date string or formatted date
  location: string; // e.g., "Race Course, Coimbatore" or "Periyakulam Lake, Ukkadam"
  category: "celebration" | "sports" | "field-trip" | "community" | "medical-camp";
  summary: string;
  detailedReport?: string;
  coverImageUrl: string;
  photos: string[];
  participantCount?: number; // e.g. 1000 for Walkathon
  isPublished: boolean;
  isArchived: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 4. STUDENT ACHIEVEMENTS & MILESTONES: `achievements`
export interface StudentAchievementDocument {
  id: string;
  studentFirstName: string; // Protected child privacy: first name only or alias
  achievementType: "mainstream_transition" | "competition_award" | "life_skill_milestone";
  title: string;
  storyDescription: string;
  competitionName?: string; // e.g., "Kovai Vizha Special Sports", "INQ-FEST TALENTIA"
  awardDetails?: string; // e.g., "Gold Medal - Running", "First Prize - Drawing"
  imageUrl?: string;
  parentConsentApproved: boolean; // Consent flag for child protection
  isPublished: boolean;
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 5. INQUIRIES & ADMISSIONS: `inquiries`
export interface InquiryDocument {
  id: string;
  parentName: string;
  childAge?: number;
  phone: string;
  email: string;
  preferredBranch: "rathinapuri" | "kuniyamuthur" | "undecided";
  serviceOfInterest: string; // e.g., "Occupational Therapy", "Admissions", "General"
  message: string;
  status: "new" | "in_review" | "contacted" | "scheduled_assessment" | "archived";
  internalNotes?: string[];
  emailNotificationSentToAdmin: boolean;
  acknowledgementSentToVisitor: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 6. PARENT TESTIMONIALS & REVIEWS: `testimonials`
export interface TestimonialDocument {
  id: string;
  parentName: string;
  reviewSource: "google_verified" | "direct_submission";
  rating: number; // 5
  timeframeText: string; // e.g. "1 year ago"
  quote: string;
  childProgressNote?: string;
  isApproved: boolean;
  featuredOnHome: boolean;
  order: number;
  createdAt: Timestamp;
}

// 7. SITE SETTINGS & CONTENT: `settings` (Doc ID: 'general')
export interface SiteSettingsDocument {
  organizationName: string;
  primaryPhone: string;
  whatsappNumber: string;
  contactEmail: string;
  googleReviewsUrl: string;
  instagramUrl: string;
  youtubeUrl?: string;
  upiDonationQrUrl?: string;
  announcementBanner?: {
    isActive: boolean;
    text: string;
    linkUrl?: string;
  };
  updatedAt: Timestamp;
  updatedBy: string; // Admin UID
}
