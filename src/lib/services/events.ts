import "server-only";
import fs from "fs";
import path from "path";
import { getAdminDb } from "../firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

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

const DATA_DIR = path.join(process.cwd(), "src", "data");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");

export const BASELINE_EVENTS: EventItemRecord[] = [
  {
    id: "annual-adaptive-sports-meet-2026",
    title: "Annual Adaptive Sports & Inclusion Meet",
    slug: "annual-adaptive-sports-meet-2026",
    eventDate: "2026-03-28",
    location: "Nehru Stadium Grounds, Coimbatore",
    category: "sports",
    summary: "Celebrating movement, joy, and individual triumphs with adaptive track races, sensory balance games, and parent-child relays.",
    detailedReport: "Over 85 students across our Rathinapuri and Kuniyamuthur branches participated in adaptive athletic games tailored to diverse motor capabilities.",
    coverImageUrl: "/assets/images/community_outing_park.jpg",
    photos: [],
    participantCount: 120,
    isPublished: true,
    isArchived: false,
    createdAt: "2026-03-28T10:00:00.000Z",
    updatedAt: "2026-03-28T16:00:00.000Z",
    createdBy: "admin@thulirschool.com",
  },
  {
    id: "world-autism-acceptance-walkathon-2026",
    title: "World Autism Awareness & Acceptance Walkathon",
    slug: "world-autism-acceptance-walkathon-2026",
    eventDate: "2026-04-02",
    location: "Race Course Promenade, Coimbatore",
    category: "awareness",
    summary: "Raising community awareness, dignity, and neurodiverse acceptance with children, parents, and healthcare professionals.",
    detailedReport: "A community solidarity walk joined by paediatric therapists, special educators, and Coimbatore citizens advocating for neuro-affirming public spaces.",
    coverImageUrl: "/assets/images/hero_learning_care.jpg",
    photos: [],
    participantCount: 160,
    isPublished: true,
    isArchived: false,
    createdAt: "2026-04-02T08:30:00.000Z",
    updatedAt: "2026-04-02T12:00:00.000Z",
    createdBy: "admin@thulirschool.com",
  },
  {
    id: "diwali-creative-arts-expo-2026",
    title: "Diwali Festivities & Sensory Crafts Exhibition",
    slug: "diwali-creative-arts-expo-2026",
    eventDate: "2026-10-31",
    location: "Thulir Rathinapuri Campus",
    category: "celebration",
    summary: "Handcrafted diyas, organic rangoli designs, and stage dance performances created by our students in art & music therapy.",
    detailedReport: "Students showcased tactile motor craft items, handmade greetings, and rhythm-based musical presentations before families.",
    coverImageUrl: "/assets/images/special_education_classroom.jpg",
    photos: [],
    participantCount: 95,
    isPublished: true,
    isArchived: false,
    createdAt: "2026-10-15T09:00:00.000Z",
    updatedAt: "2026-10-15T11:00:00.000Z",
    createdBy: "admin@thulirschool.com",
  },
];

/**
 * Reads local persistent events storage. Seeds baseline items if empty.
 */
export function readLocalEvents(): EventItemRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(EVENTS_FILE)) {
      fs.writeFileSync(EVENTS_FILE, JSON.stringify(BASELINE_EVENTS, null, 2), "utf8");
      return BASELINE_EVENTS;
    }
    const raw = fs.readFileSync(EVENTS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      fs.writeFileSync(EVENTS_FILE, JSON.stringify(BASELINE_EVENTS, null, 2), "utf8");
      return BASELINE_EVENTS;
    }
    return parsed;
  } catch (err) {
    console.warn("[Events Store Read Error - using baseline]:", err);
    return BASELINE_EVENTS;
  }
}

/**
 * Saves events records to local persistent storage.
 */
export function writeLocalEvents(items: EventItemRecord[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(items, null, 2), "utf8");
  } catch (err) {
    console.error("[Events Store Write Error]:", err);
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

  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      const snapshot = await adminDb.collection("events").orderBy("eventDate", "desc").get();
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
          createdAt: data?.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
          updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString()),
          createdBy: data.createdBy,
        };
        eventMap.set(doc.id, record);
      }
    }
  } catch (cloudErr) {
    console.warn("[getEventsList Cloud DB Warning]:", cloudErr);
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
 * Saves a new event to persistent storage and cloud database.
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

  // 1. Save locally
  try {
    const current = readLocalEvents();
    const existingIndex = current.findIndex((item) => item.id === record.id);
    if (existingIndex >= 0) {
      current[existingIndex] = record;
    } else {
      current.unshift(record);
    }
    writeLocalEvents(current);
  } catch (localErr) {
    console.error("[saveEvent Local Error]:", localErr);
  }

  // 2. Dual-write to cloud database if available
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      await adminDb.collection("events").doc(record.id).set({
        ...record,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  } catch (cloudErr) {
    console.warn("[saveEvent Cloud DB Warning]:", cloudErr);
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

  // 1. Update local storage
  try {
    const current = readLocalEvents();
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
  } catch (localErr) {
    console.error("[updateEventRecord Local Error]:", localErr);
  }

  // 2. Dual-update cloud database if available
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      await adminDb.collection("events").doc(id).set(
        {
          ...updates,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }
  } catch (cloudErr) {
    console.warn("[updateEventRecord Cloud DB Warning]:", cloudErr);
  }

  return updatedRecord;
}

/**
 * Deletes an event.
 */
export async function deleteEventRecord(id: string): Promise<boolean> {
  let deleted = false;

  // 1. Delete from local storage
  try {
    const current = readLocalEvents();
    const filtered = current.filter((item) => item.id !== id);
    if (filtered.length !== current.length) {
      writeLocalEvents(filtered);
      deleted = true;
    }
  } catch (localErr) {
    console.error("[deleteEventRecord Local Error]:", localErr);
  }

  // 2. Delete from cloud database if available
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      await adminDb.collection("events").doc(id).delete();
      deleted = true;
    }
  } catch (cloudErr) {
    console.warn("[deleteEventRecord Cloud DB Warning]:", cloudErr);
  }

  return deleted;
}
