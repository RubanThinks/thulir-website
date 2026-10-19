import "server-only";
import { getAdminDb } from "../firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import seedEventsData from "@/data/events.json";
import { readJsonSafe, writeJsonSafe } from "./storageHelper";

export interface EventItemRecord {
  id: string;
  title: string;
  slug: string;
  eventDate: string;
  location: string;
  category: string;
  summary: string;
  detailedReport?: string;
  coverImageUrl?: string;
  photos?: string[];
  participantCount?: number;
  isPublished: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// 100% statically-bundled seed events (all 16 verified events)
export const BASELINE_EVENTS: EventItemRecord[] = seedEventsData as EventItemRecord[];

// In-memory cache for fast, reliable serverless performance
let memoryEventsItems: EventItemRecord[] | null = null;

/**
 * Reads persistent events storage safely in any runtime (local dev or read-only Vercel).
 */
export function readLocalEvents(): EventItemRecord[] {
  if (memoryEventsItems && memoryEventsItems.length > 0) {
    return memoryEventsItems;
  }
  const items = readJsonSafe<EventItemRecord[]>("events.json", BASELINE_EVENTS);
  memoryEventsItems = Array.isArray(items) && items.length > 0 ? items : BASELINE_EVENTS;
  return memoryEventsItems;
}

/**
 * Saves events records safely (writes to local src/data in dev, or /tmp in serverless).
 */
export function writeLocalEvents(items: EventItemRecord[]): void {
  memoryEventsItems = items;
  writeJsonSafe("events.json", items);
}

/**
 * Helper to auto-seed Firestore if it is connected but empty.
 */
async function autoSeedFirestoreIfEmpty(items: EventItemRecord[]): Promise<void> {
  const adminDb = getAdminDb();
  if (!adminDb || items.length === 0) return;

  try {
    const existing = await adminDb.collection("events").limit(1).get();
    if (existing.empty) {
      console.log(`[Firestore Events Auto-Seed] Seeding ${items.length} records into Firestore...`);
      const batch = adminDb.batch();
      for (const item of items) {
        const docRef = adminDb.collection("events").doc(item.id);
        batch.set(docRef, {
          ...item,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
      await batch.commit();
      console.log("[Firestore Events Auto-Seed] Successfully seeded events records.");
    }
  } catch (seedErr) {
    console.warn("[Firestore Events Auto-Seed Warning]:", seedErr);
  }
}

/**
 * Retrieves all events (with cloud synchronization and local fallback).
 */
export async function getEventsList(): Promise<EventItemRecord[]> {
  const localItems = readLocalEvents();
  const eventMap = new Map<string, EventItemRecord>();

  for (const item of localItems) {
    eventMap.set(item.id, item);
  }

  const adminDb = getAdminDb();
  if (adminDb && process.env.NEXT_PHASE !== "phase-production-build") {
    try {
      const snapshot = await adminDb.collection("events").orderBy("eventDate", "desc").get();
      if (!snapshot.empty) {
        for (const doc of snapshot.docs) {
          const data = doc.data();
          const record: EventItemRecord = {
            id: doc.id,
            title: data.title || "",
            slug: data.slug || doc.id,
            eventDate: data.eventDate || "",
            location: data.location || "Coimbatore, Tamil Nadu",
            category: data.category || "celebration",
            summary: data.summary || "",
            detailedReport: data.detailedReport || "",
            coverImageUrl: data.coverImageUrl || "",
            photos: Array.isArray(data.photos) ? data.photos : [],
            participantCount: typeof data.participantCount === "number" ? data.participantCount : undefined,
            isPublished: data.isPublished !== false,
            isArchived: Boolean(data.isArchived),
            createdAt: data?.createdAt?.toDate
              ? data.createdAt.toDate().toISOString()
              : data.createdAt || new Date().toISOString(),
            updatedAt: data?.updatedAt?.toDate
              ? data.updatedAt.toDate().toISOString()
              : data.updatedAt || new Date().toISOString(),
            createdBy: data.createdBy,
          };
          eventMap.set(doc.id, record);
        }
      } else {
        // Auto-seed Firestore in background if empty
        autoSeedFirestoreIfEmpty(localItems).catch(() => {});
      }
    } catch (cloudErr) {
      console.warn("[getEventsList Cloud DB Warning]:", cloudErr);
    }
  }

  const allEvents = Array.from(eventMap.values());
  allEvents.sort((a, b) => (b.eventDate || "").localeCompare(a.eventDate || ""));
  return allEvents;
}

/**
 * Retrieves a single event by ID or slug.
 */
export async function getEventById(id: string): Promise<EventItemRecord | null> {
  const all = await getEventsList();
  return all.find((e) => e.id === id || e.slug === id) || null;
}

/**
 * Saves a new event to resilient storage and cloud database.
 */
export async function saveEvent(
  event: Omit<EventItemRecord, "createdAt" | "updatedAt"> & {
    createdAt?: string;
    updatedAt?: string;
  }
): Promise<EventItemRecord> {
  const nowIso = new Date().toISOString();
  const record: EventItemRecord = {
    ...event,
    photos: event.photos || [],
    isPublished: event.isPublished !== false,
    isArchived: Boolean(event.isArchived),
    createdAt: event.createdAt || nowIso,
    updatedAt: event.updatedAt || nowIso,
  };

  // 1. Save locally / tmp
  const current = [...readLocalEvents()];
  const existingIndex = current.findIndex((item) => item.id === record.id);
  if (existingIndex >= 0) {
    current[existingIndex] = record;
  } else {
    current.unshift(record);
  }
  writeLocalEvents(current);

  // 2. Dual-write to cloud database if available
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.collection("events").doc(record.id).set({
        ...record,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (cloudErr) {
      console.warn("[saveEvent Cloud DB Warning]:", cloudErr);
    }
  }

  return record;
}

/**
 * Updates an existing event.
 */
export async function updateEventRecord(
  id: string,
  updates: Partial<EventItemRecord>
): Promise<EventItemRecord | null> {
  const nowIso = new Date().toISOString();
  let updatedRecord: EventItemRecord | null = null;

  // 1. Update local / tmp storage
  const current = [...readLocalEvents()];
  const index = current.findIndex((item) => item.id === id);
  if (index >= 0) {
    current[index] = {
      ...current[index],
      ...updates,
      updatedAt: nowIso,
    };
    updatedRecord = current[index];
    writeLocalEvents(current);
  }

  // 2. Dual-update cloud database if available
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const docRef = adminDb.collection("events").doc(id);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const firestoreData = docSnap.data() || {};
        await docRef.set(
          {
            ...updates,
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
        if (!updatedRecord) {
          updatedRecord = {
            id,
            title: updates.title ?? firestoreData.title ?? "",
            slug: updates.slug ?? firestoreData.slug ?? id,
            eventDate: updates.eventDate ?? firestoreData.eventDate ?? "",
            location: updates.location ?? firestoreData.location ?? "Coimbatore",
            category: updates.category ?? firestoreData.category ?? "celebration",
            summary: updates.summary ?? firestoreData.summary ?? "",
            detailedReport: updates.detailedReport ?? firestoreData.detailedReport ?? "",
            coverImageUrl: updates.coverImageUrl ?? firestoreData.coverImageUrl ?? "",
            photos: updates.photos ?? firestoreData.photos ?? [],
            participantCount: updates.participantCount ?? firestoreData.participantCount,
            isPublished: updates.isPublished ?? firestoreData.isPublished ?? true,
            isArchived: updates.isArchived ?? firestoreData.isArchived ?? false,
            createdAt: firestoreData.createdAt?.toDate ? firestoreData.createdAt.toDate().toISOString() : nowIso,
            updatedAt: nowIso,
            createdBy: firestoreData.createdBy,
          };
          current.unshift(updatedRecord);
          writeLocalEvents(current);
        }
      } else if (updatedRecord) {
        // Document was not in Firestore yet, write it now
        await docRef.set({
          ...updatedRecord,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    } catch (cloudErr) {
      console.warn("[updateEventRecord Cloud DB Warning]:", cloudErr);
    }
  }

  return updatedRecord;
}

/**
 * Deletes an event.
 */
export async function deleteEventRecord(id: string): Promise<boolean> {
  let deleted = false;

  // 1. Delete from local / tmp storage
  const current = readLocalEvents();
  const filtered = current.filter((item) => item.id !== id);
  if (filtered.length !== current.length) {
    writeLocalEvents(filtered);
    deleted = true;
  }

  // 2. Delete from cloud database if available
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const docRef = adminDb.collection("events").doc(id);
      const snap = await docRef.get();
      if (snap.exists) {
        await docRef.delete();
        deleted = true;
      }
    } catch (cloudErr) {
      console.warn("[deleteEventRecord Cloud DB Warning]:", cloudErr);
    }
  }

  return deleted;
}
