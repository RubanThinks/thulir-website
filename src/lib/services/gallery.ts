import "server-only";
import fs from "fs";
import path from "path";
import { getAdminDb } from "../firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export interface GalleryItemRecord {
  id: string;
  title: string;
  caption?: string;
  altText?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  cloudinaryPublicId?: string;
  category: string;
  tags?: string[];
  dateCaptured?: string;
  isPublished: boolean;
  featuredOnHome: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
}

const DATA_DIR = path.join(process.cwd(), "src", "data");
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");

// Verified baseline gallery items with real campus photography
export const BASELINE_GALLERY: GalleryItemRecord[] = [
  {
    id: "gallery-sensory-room",
    title: "Sensory Integration Therapy Suite",
    caption:
      "Suspended therapeutic swings, bolster apparatus, and tactile exploration modules at our Rathinapuri center.",
    altText: "Sensory Integration Therapy Suite at Thulir Special School",
    imageUrl: "/assets/images/sensory_occupational_room.jpg",
    thumbnailUrl: "/assets/images/sensory_occupational_room.jpg",
    category: "campus",
    tags: ["Occupational Therapy", "Sensory Integration", "Rathinapuri"],
    dateCaptured: "2026-02-15",
    isPublished: true,
    featuredOnHome: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "gallery-speech-cabin",
    title: "Pediatric Speech & Communication Cabin",
    caption:
      "A quiet, distraction-free environment for articulation, oral-motor play, and augmentative communication training.",
    altText: "Speech & Communication Therapy room at Thulir Special School",
    imageUrl: "/assets/images/speech_language_therapy.jpg",
    thumbnailUrl: "/assets/images/speech_language_therapy.jpg",
    category: "therapy",
    tags: ["Speech Therapy", "Language Development"],
    dateCaptured: "2026-02-18",
    isPublished: true,
    featuredOnHome: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "gallery-physio-suite",
    title: "Pediatric Physiotherapy Wing",
    caption:
      "Postural stability, gross motor milestones, and gait facilitation equipment designed for children.",
    altText: "Pediatric Physiotherapy Wing at Thulir",
    imageUrl: "/assets/images/pediatric_physiotherapy.jpg",
    thumbnailUrl: "/assets/images/pediatric_physiotherapy.jpg",
    category: "therapy",
    tags: ["Physiotherapy", "Motor Skills"],
    dateCaptured: "2026-02-20",
    isPublished: true,
    featuredOnHome: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "gallery-special-education",
    title: "Specialized Education Classroom",
    caption:
      "Individualized student workstations, visual schedules, and foundational literacy corners.",
    altText: "Specialized Education Classroom with learning aids",
    imageUrl: "/assets/images/special_education_classroom.jpg",
    thumbnailUrl: "/assets/images/special_education_classroom.jpg",
    category: "campus",
    tags: ["Special Education", "IEP"],
    dateCaptured: "2026-02-22",
    isPublished: true,
    featuredOnHome: true,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "gallery-community-outing",
    title: "Community Exposure & Life Skills Outing",
    caption:
      "Students practicing social navigation, outdoor physical mobility, and recreational interaction in a natural setting.",
    altText: "Students on a community exposure trip in Coimbatore",
    imageUrl: "/assets/images/community_outing_park.jpg",
    thumbnailUrl: "/assets/images/community_outing_park.jpg",
    category: "field-trips",
    tags: ["Community Outing", "Life Skills"],
    dateCaptured: "2026-03-01",
    isPublished: true,
    featuredOnHome: true,
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "gallery-early-intervention",
    title: "Early Intervention & Developmental Support",
    caption:
      "Caring, play-based stimulation for infants and young children during foundational developmental windows.",
    altText: "Early intervention session with child and educator",
    imageUrl: "/assets/images/hero_learning_care.jpg",
    thumbnailUrl: "/assets/images/hero_learning_care.jpg",
    category: "achievements",
    tags: ["Early Intervention", "Milestones"],
    dateCaptured: "2026-03-05",
    isPublished: true,
    featuredOnHome: true,
    order: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Reads local persistent gallery storage. Seeds baseline items if empty.
 */
function readLocalGallery(): GalleryItemRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(GALLERY_FILE)) {
      fs.writeFileSync(GALLERY_FILE, JSON.stringify(BASELINE_GALLERY, null, 2), "utf8");
      return BASELINE_GALLERY;
    }
    const raw = fs.readFileSync(GALLERY_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      fs.writeFileSync(GALLERY_FILE, JSON.stringify(BASELINE_GALLERY, null, 2), "utf8");
      return BASELINE_GALLERY;
    }
    return parsed;
  } catch (err) {
    console.warn("[Gallery Store Read Error - using baseline]:", err);
    return BASELINE_GALLERY;
  }
}

/**
 * Saves gallery records to local persistent storage.
 */
function writeLocalGallery(items: GalleryItemRecord[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(items, null, 2), "utf8");
  } catch (err) {
    console.error("[Gallery Store Write Error]:", err);
  }
}

/**
 * Retrieves all gallery items (with optional category and publication filters).
 */
export async function getGalleryItems(
  category?: string,
  publishedOnly = false
): Promise<GalleryItemRecord[]> {
  const adminDb = getAdminDb();

  if (adminDb) {
    try {
      let query = adminDb.collection("gallery").orderBy("order", "asc");
      if (publishedOnly) {
        query = query.where("isPublished", "==", true);
      }
      if (category && category !== "all") {
        query = query.where("category", "==", category);
      }

      const snapshot = await query.get();
      if (!snapshot.empty) {
        return snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "",
            caption: data.caption || "",
            altText: data.altText || data.title || "",
            imageUrl: data.imageUrl || "",
            thumbnailUrl: data.thumbnailUrl || data.imageUrl || "",
            cloudinaryPublicId: data.cloudinaryPublicId || "",
            category: data.category || "campus",
            tags: data.tags || [],
            dateCaptured: data.dateCaptured || "",
            isPublished: Boolean(data.isPublished),
            featuredOnHome: Boolean(data.featuredOnHome),
            order: Number(data.order || 0),
            createdAt: data?.createdAt?.toDate
              ? data.createdAt.toDate().toISOString()
              : data.createdAt || new Date().toISOString(),
            updatedAt: data?.updatedAt?.toDate
              ? data.updatedAt.toDate().toISOString()
              : data.updatedAt || new Date().toISOString(),
            createdBy: data.createdBy || null,
          };
        });
      }
    } catch (err) {
      console.warn("[Firestore Gallery GET failed, falling back to local store]:", err);
    }
  }

  // Fallback to local persistent store
  let items = readLocalGallery();
  if (publishedOnly) {
    items = items.filter((item) => item.isPublished);
  }
  if (category && category !== "all") {
    items = items.filter((item) => item.category === category);
  }
  return items.sort((a, b) => a.order - b.order);
}

/**
 * Saves a new gallery record. Persists to both Firestore (if available) and local store.
 */
export async function addGalleryItem(
  data: Omit<GalleryItemRecord, "id" | "createdAt" | "updatedAt">
): Promise<GalleryItemRecord> {
  const now = new Date().toISOString();
  const id = `gallery-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const newRecord: GalleryItemRecord = {
    id,
    title: data.title.trim(),
    caption: (data.caption || "").trim(),
    altText: (data.altText || data.title).trim(),
    imageUrl: data.imageUrl,
    thumbnailUrl: data.thumbnailUrl || data.imageUrl,
    cloudinaryPublicId: data.cloudinaryPublicId || "",
    category: data.category || "campus",
    tags: data.tags || [],
    dateCaptured: data.dateCaptured || now.slice(0, 10),
    isPublished: Boolean(data.isPublished ?? true),
    featuredOnHome: Boolean(data.featuredOnHome ?? false),
    order: Number(data.order || 0),
    createdAt: now,
    updatedAt: now,
    createdBy: data.createdBy || null,
  };

  // 1. Save to local durable store
  const localItems = readLocalGallery();
  localItems.push(newRecord);
  writeLocalGallery(localItems);

  // 2. Also save to Firestore if configured
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.collection("gallery").doc(id).set({
        ...newRecord,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.warn("[Firestore Gallery Sync Warning]:", err);
    }
  }

  return newRecord;
}

/**
 * Updates an existing gallery record.
 */
export async function updateGalleryItem(
  id: string,
  updates: Partial<GalleryItemRecord>
): Promise<GalleryItemRecord | null> {
  const now = new Date().toISOString();

  // 1. Update in local store
  const localItems = readLocalGallery();
  const index = localItems.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const updatedRecord: GalleryItemRecord = {
    ...localItems[index],
    ...updates,
    updatedAt: now,
  };
  localItems[index] = updatedRecord;
  writeLocalGallery(localItems);

  // 2. Update in Firestore if configured
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const docRef = adminDb.collection("gallery").doc(id);
      await docRef.set(
        {
          ...updates,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn("[Firestore Gallery Update Warning]:", err);
    }
  }

  return updatedRecord;
}

/**
 * Deletes a gallery record.
 */
export async function deleteGalleryItem(id: string): Promise<boolean> {
  // 1. Delete from local store
  const localItems = readLocalGallery();
  const filtered = localItems.filter((item) => item.id !== id);
  const existed = filtered.length !== localItems.length;
  if (existed) {
    writeLocalGallery(filtered);
  }

  // 2. Delete from Firestore if configured
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.collection("gallery").doc(id).delete();
    } catch (err) {
      console.warn("[Firestore Gallery Delete Warning]:", err);
    }
  }

  return existed;
}
