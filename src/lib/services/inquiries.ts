import "server-only";
import fs from "fs";
import path from "path";
import { getAdminDb } from "../firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export interface InquiryItemRecord {
  id: string;
  parentName: string;
  email: string;
  phone: string;
  preferredBranch: string;
  serviceCategory?: string;
  serviceOfInterest: string;
  childAge?: string;
  message: string;
  status: "new" | "in_review" | "contacted" | "scheduled_assessment" | "archived";
  internalNotes?: string[];
  clientIpMasked?: string;
  emailNotificationSentToAdmin?: boolean;
  acknowledgementSentToVisitor?: boolean;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "src", "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

/**
 * Baseline initial inquiries demonstrating live management workflow.
 */
export const BASELINE_INQUIRIES: InquiryItemRecord[] = [
  {
    id: "THU-261016-E8A1",
    parentName: "Senthil Kumar",
    email: "senthilkumar.cbe@gmail.com",
    phone: "+91 98422 13589",
    preferredBranch: "rathinapuri",
    serviceCategory: "Paediatric Occupational Therapy",
    serviceOfInterest: "Paediatric Occupational Therapy",
    childAge: "4 years",
    message: "Looking for sensory integration therapy for my 4-year-old child. Noticed sensory sensitivities to loud sounds and motor coordination difficulties. We would like to schedule an initial consultation and clinical assessment at Rathinapuri center.",
    status: "new",
    internalNotes: ["Parent called to confirm assessment time slot for coming Saturday morning."],
    clientIpMasked: "103.28.xxx",
    emailNotificationSentToAdmin: true,
    acknowledgementSentToVisitor: true,
    createdAt: "2026-10-16T14:30:00.000Z",
    updatedAt: "2026-10-16T15:10:00.000Z",
  },
  {
    id: "THU-261015-K4B2",
    parentName: "Priya Venkatesh",
    email: "priya.venkatesh88@gmail.com",
    phone: "+91 97894 56210",
    preferredBranch: "kuniyamuthur",
    serviceCategory: "Speech & Language Therapy",
    serviceOfInterest: "Speech & Language Therapy",
    childAge: "3.5 years",
    message: "Seeking speech evaluation and early intervention language support for our 3.5-year-old daughter. She has vocabulary delay and expressive communication challenges. Kuniyamuthur campus is close to our home.",
    status: "contacted",
    internalNotes: ["Dr. Saranya reached out on WhatsApp. Parent requested Saturday 11:00 AM slot."],
    clientIpMasked: "117.216.xxx",
    emailNotificationSentToAdmin: true,
    acknowledgementSentToVisitor: true,
    createdAt: "2026-10-15T09:15:00.000Z",
    updatedAt: "2026-10-15T11:45:00.000Z",
  },
  {
    id: "THU-261012-M9F7",
    parentName: "Rajesh Ramaswamy",
    email: "rajesh.ramaswamy@outlook.com",
    phone: "+91 94433 87654",
    preferredBranch: "rathinapuri",
    serviceCategory: "Special Education (IEP)",
    serviceOfInterest: "Special Education (IEP)",
    childAge: "6 years",
    message: "Interested in Individualized Educational Program (IEP) admission for academic year 2026-2027. We are relocating to Coimbatore next month and want to understand school hours and therapeutic integration.",
    status: "scheduled_assessment",
    internalNotes: ["Clinical assessment scheduled for Oct 24th with multidisciplinary team."],
    clientIpMasked: "49.207.xxx",
    emailNotificationSentToAdmin: true,
    acknowledgementSentToVisitor: true,
    createdAt: "2026-10-12T16:20:00.000Z",
    updatedAt: "2026-10-13T10:00:00.000Z",
  },
];

import seedInquiriesData from "@/data/inquiries.json";
import { readJsonSafe, writeJsonSafe } from "./storageHelper";

let memoryInquiriesItems: InquiryItemRecord[] | null = null;

/**
 * Reads local persistent inquiries file safely in any runtime (local dev or read-only Vercel).
 */
export function readLocalInquiries(): InquiryItemRecord[] {
  if (memoryInquiriesItems && memoryInquiriesItems.length > 0) {
    return memoryInquiriesItems;
  }
  const defaultItems = (seedInquiriesData as unknown as InquiryItemRecord[]) || BASELINE_INQUIRIES;
  const items = readJsonSafe<InquiryItemRecord[]>("inquiries.json", defaultItems);
  memoryInquiriesItems = Array.isArray(items) && items.length > 0 ? items : defaultItems;
  return memoryInquiriesItems;
}

/**
 * Writes inquiries safely to persistent JSON storage (local in dev, /tmp in serverless).
 */
export function writeLocalInquiries(items: InquiryItemRecord[]): void {
  memoryInquiriesItems = items;
  writeJsonSafe("inquiries.json", items);
}

/**
 * Persists an incoming inquiry with multi-tier storage (local file + cloud database if available).
 */
export async function saveInquiry(
  inquiry: Omit<InquiryItemRecord, "createdAt" | "updatedAt"> & {
    createdAt?: string;
    updatedAt?: string;
  }
): Promise<InquiryItemRecord> {
  const nowIso = new Date().toISOString();
  const record: InquiryItemRecord = {
    ...inquiry,
    serviceCategory: inquiry.serviceCategory || inquiry.serviceOfInterest,
    serviceOfInterest: inquiry.serviceOfInterest || inquiry.serviceCategory || "General Inquiry",
    status: inquiry.status || "new",
    internalNotes: inquiry.internalNotes || [],
    emailNotificationSentToAdmin: inquiry.emailNotificationSentToAdmin ?? false,
    acknowledgementSentToVisitor: inquiry.acknowledgementSentToVisitor ?? false,
    createdAt: inquiry.createdAt || nowIso,
    updatedAt: inquiry.updatedAt || nowIso,
  };

  // 1. Save to local persistent storage immediately (100% resilient)
  try {
    const current = readLocalInquiries();
    const existingIndex = current.findIndex((item) => item.id === record.id);
    if (existingIndex >= 0) {
      current[existingIndex] = record;
    } else {
      current.unshift(record); // Prepend so latest appears first
    }
    writeLocalInquiries(current);
  } catch (localErr) {
    console.error("[Inquiry Save Local Error]:", localErr);
  }

  // 2. Dual-write to cloud database if Admin SDK is configured
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      await adminDb.collection("inquiries").doc(record.id).set({
        ...record,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  } catch (dbErr) {
    console.warn("[Inquiry Save Cloud DB Warning]:", dbErr);
  }

  return record;
}

/**
 * Retrieves a single inquiry record by ID.
 */
export async function getInquiryById(id: string): Promise<InquiryItemRecord | null> {
  // 1. Check local persistent storage
  const current = readLocalInquiries();
  const found = current.find((item) => item.id === id);
  if (found) return found;

  // 2. Check Cloud Database if configured
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      const doc = await adminDb.collection("inquiries").doc(id).get();
      if (doc.exists) {
        const data = doc.data() as Record<string, unknown>;
        return {
          id: doc.id,
          parentName: (data.parentName as string) || "",
          email: (data.email as string) || "",
          phone: (data.phone as string) || "",
          preferredBranch: (data.preferredBranch as string) || "undecided",
          serviceCategory: (data.serviceCategory as string) || (data.serviceOfInterest as string) || "",
          serviceOfInterest: (data.serviceOfInterest as string) || (data.serviceCategory as string) || "",
          childAge: (data.childAge as string) || "",
          message: (data.message as string) || "",
          status: (data.status as InquiryItemRecord["status"]) || "new",
          internalNotes: Array.isArray(data.internalNotes) ? (data.internalNotes as string[]) : [],
          clientIpMasked: (data.clientIpMasked as string) || "",
          emailNotificationSentToAdmin: Boolean(data.emailNotificationSentToAdmin),
          acknowledgementSentToVisitor: Boolean(data.acknowledgementSentToVisitor),
          createdAt: (data?.createdAt as { toDate?: () => Date })?.toDate
            ? (data.createdAt as { toDate: () => Date }).toDate().toISOString()
            : (data.createdAt as string) || new Date().toISOString(),
          updatedAt: (data?.updatedAt as { toDate?: () => Date })?.toDate
            ? (data.updatedAt as { toDate: () => Date }).toDate().toISOString()
            : (data.updatedAt as string) || new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn("[getInquiryById Cloud DB Warning]:", err);
  }

  return null;
}

/**
 * Updates an inquiry record's fields (status, notes, etc.).
 */
export async function updateInquiryRecord(
  id: string,
  updates: Partial<InquiryItemRecord> & { newNote?: string }
): Promise<InquiryItemRecord | null> {
  const nowIso = new Date().toISOString();
  let updatedRecord: InquiryItemRecord | null = null;

  // 1. Update local storage
  try {
    const current = readLocalInquiries();
    const index = current.findIndex((item) => item.id === id);
    if (index >= 0) {
      const existing = current[index];
      const updatedNotes = updates.newNote
        ? [...(existing.internalNotes || []), updates.newNote]
        : updates.internalNotes !== undefined
        ? updates.internalNotes
        : existing.internalNotes || [];

      current[index] = {
        ...existing,
        ...updates,
        internalNotes: updatedNotes,
        updatedAt: nowIso,
      };
      delete (current[index] as { newNote?: string }).newNote;
      updatedRecord = current[index];
      writeLocalInquiries(current);
    }
  } catch (localErr) {
    console.error("[Inquiry Update Local Error]:", localErr);
  }

  // 2. Dual-update cloud database if configured
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      const dbUpdates: Record<string, unknown> = {
        ...updates,
        updatedAt: FieldValue.serverTimestamp(),
      };
      if (updates.newNote) {
        dbUpdates.internalNotes = FieldValue.arrayUnion(updates.newNote);
        delete dbUpdates.newNote;
      }
      await adminDb.collection("inquiries").doc(id).set(dbUpdates, { merge: true });
    }
  } catch (dbErr) {
    console.warn("[Inquiry Update Cloud DB Warning]:", dbErr);
  }

  return updatedRecord;
}

/**
 * Deletes an inquiry record.
 */
export async function deleteInquiryRecord(id: string): Promise<boolean> {
  let deleted = false;

  // 1. Delete from local storage
  try {
    const current = readLocalInquiries();
    const filtered = current.filter((item) => item.id !== id);
    if (filtered.length !== current.length) {
      writeLocalInquiries(filtered);
      deleted = true;
    }
  } catch (localErr) {
    console.error("[Inquiry Delete Local Error]:", localErr);
  }

  // 2. Delete from cloud database if configured
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      await adminDb.collection("inquiries").doc(id).delete();
      deleted = true;
    }
  } catch (dbErr) {
    console.warn("[Inquiry Delete Cloud DB Warning]:", dbErr);
  }

  return deleted;
}

/**
 * Retrieves all inquiries with filtering, search, counts, and pagination.
 */
export async function getInquiriesList(options?: {
  status?: string;
  branch?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  inquiries: InquiryItemRecord[];
  counts: {
    total: number;
    new: number;
    inReview: number;
    contacted: number;
    scheduled: number;
    archived: number;
  };
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}> {
  const page = Math.max(1, options?.page || 1);
  const limit = Math.min(50, Math.max(5, options?.limit || 15));

  // 1. Gather records from local storage
  const localItems = readLocalInquiries();
  const recordMap = new Map<string, InquiryItemRecord>();

  for (const item of localItems) {
    recordMap.set(item.id, item);
  }

  // 2. If Cloud Database is available, merge its records
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      const snapshot = await adminDb
        .collection("inquiries")
        .orderBy("createdAt", "desc")
        .get();

      for (const doc of snapshot.docs) {
        const data = doc.data() as Record<string, unknown>;
        const cloudRecord: InquiryItemRecord = {
          id: doc.id,
          parentName: (data.parentName as string) || "",
          email: (data.email as string) || "",
          phone: (data.phone as string) || "",
          preferredBranch: (data.preferredBranch as string) || "undecided",
          serviceCategory: (data.serviceCategory as string) || (data.serviceOfInterest as string) || "",
          serviceOfInterest: (data.serviceOfInterest as string) || (data.serviceCategory as string) || "",
          childAge: (data.childAge as string) || "",
          message: (data.message as string) || "",
          status: (data.status as InquiryItemRecord["status"]) || "new",
          internalNotes: Array.isArray(data.internalNotes) ? (data.internalNotes as string[]) : [],
          clientIpMasked: (data.clientIpMasked as string) || "",
          emailNotificationSentToAdmin: Boolean(data.emailNotificationSentToAdmin),
          acknowledgementSentToVisitor: Boolean(data.acknowledgementSentToVisitor),
          createdAt: (data?.createdAt as { toDate?: () => Date })?.toDate
            ? (data.createdAt as { toDate: () => Date }).toDate().toISOString()
            : (data.createdAt as string) || new Date().toISOString(),
          updatedAt: (data?.updatedAt as { toDate?: () => Date })?.toDate
            ? (data.updatedAt as { toDate: () => Date }).toDate().toISOString()
            : (data.updatedAt as string) || new Date().toISOString(),
        };
        recordMap.set(doc.id, cloudRecord);
      }
    }
  } catch (dbErr) {
    console.warn("[Admin Inquiries List DB Query Warning]:", dbErr);
  }

  let allDocs = Array.from(recordMap.values());

  // Sort descending by createdAt
  allDocs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Calculate live counts
  const counts = {
    total: allDocs.length,
    new: allDocs.filter((d) => d.status === "new").length,
    inReview: allDocs.filter((d) => d.status === "in_review").length,
    contacted: allDocs.filter((d) => d.status === "contacted").length,
    scheduled: allDocs.filter((d) => d.status === "scheduled_assessment").length,
    archived: allDocs.filter((d) => d.status === "archived").length,
  };

  // Filter by status
  if (options?.status && options.status !== "all") {
    allDocs = allDocs.filter((d) => d.status === options.status);
  }

  // Filter by branch
  if (options?.branch && options.branch !== "all") {
    allDocs = allDocs.filter((d) => d.preferredBranch === options.branch);
  }

  // Filter by search query
  if (options?.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    allDocs = allDocs.filter((d) => {
      return (
        d.parentName?.toLowerCase().includes(q) ||
        d.email?.toLowerCase().includes(q) ||
        d.phone?.toLowerCase().includes(q) ||
        d.id?.toLowerCase().includes(q) ||
        d.serviceOfInterest?.toLowerCase().includes(q) ||
        d.message?.toLowerCase().includes(q)
      );
    });
  }

  // Pagination
  const totalFiltered = allDocs.length;
  const startIndex = (page - 1) * limit;
  const paginatedDocs = allDocs.slice(startIndex, startIndex + limit);

  return {
    inquiries: paginatedDocs,
    counts,
    pagination: {
      page,
      limit,
      totalItems: totalFiltered,
      totalPages: Math.ceil(totalFiltered / limit) || 1,
    },
  };
}
