import "server-only";
import { getAdminDb } from "../firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import seedGalleryData from "@/data/gallery.json";
import { readJsonSafe, writeJsonSafe } from "./storageHelper";

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

// 100% statically-bundled seed gallery items (38 verified campus photos)
export const BASELINE_GALLERY: GalleryItemRecord[] = seedGalleryData as GalleryItemRecord[];

// In-memory cache to ensure warm serverless lambdas have instantaneous consistency
let memoryGalleryItems: GalleryItemRecord[] | null = null;

/**
 * Reads persistent gallery storage safely in any runtime (local dev or read-only Vercel).
 */
export function readLocalGallery(): GalleryItemRecord[] {
  if (memoryGalleryItems && memoryGalleryItems.length > 0) {
    return memoryGalleryItems;
  }
  const items = readJsonSafe<GalleryItemRecord[]>("gallery.json", BASELINE_GALLERY);
  memoryGalleryItems = Array.isArray(items) && items.length > 0 ? items : BASELINE_GALLERY;
  return memoryGalleryItems;
}

/**
 * Saves gallery records safely (writes to local src/data in dev, or /tmp in serverless).
 */
export function writeLocalGallery(items: GalleryItemRecord[]): void {
  memoryGalleryItems = items;
  writeJsonSafe("gallery.json", items);
}

/**
 * Helper to auto-seed Firestore if it is connected but empty.
 */
async function autoSeedFirestoreIfEmpty(items: GalleryItemRecord[]): Promise<void> {
  const adminDb = getAdminDb();
  if (!adminDb || items.length === 0) return;

  try {
    const existing = await adminDb.collection("gallery").limit(1).get();
    if (existing.empty) {
      console.log(`[Firestore Gallery Auto-Seed] Seeding ${items.length} records into Firestore...`);
      const batch = adminDb.batch();
      for (const item of items) {
        const docRef = adminDb.collection("gallery").doc(item.id);
        batch.set(docRef, {
          ...item,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
      await batch.commit();
      console.log("[Firestore Gallery Auto-Seed] Successfully seeded gallery records.");
    }
  } catch (seedErr) {
    console.warn("[Firestore Gallery Auto-Seed Warning]:", seedErr);
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

  if (adminDb && process.env.NEXT_PHASE !== "phase-production-build") {
    try {
      let query: FirebaseFirestore.Query = adminDb.collection("gallery");
      if (publishedOnly) {
        query = query.where("isPublished", "==", true);
      }
      if (category && category !== "all") {
        query = query.where("category", "==", category);
      }

      const snapshot = await query.get();
      if (!snapshot.empty) {
        const items = snapshot.docs.map((doc) => {
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
        items.sort((a, b) => a.order - b.order);
        return items;
      } else {
        // If Firestore is empty, auto-seed it with the baseline items in the background
        const baseline = readLocalGallery();
        autoSeedFirestoreIfEmpty(baseline).catch(() => {});
      }
    } catch (err) {
      console.warn("[Firestore Gallery GET failed, falling back to resilient local store]:", err);
    }
  }

  // Fallback to resilient local/tmp store
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
 * Saves a new gallery record. Persists to both Firestore (if available) and resilient local store.
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

  // 1. Save to local/tmp resilient store
  const localItems = [...readLocalGallery()];
  localItems.push(newRecord);
  writeLocalGallery(localItems);

  // 2. Dual-save to Firestore if configured
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
 * Updates an existing gallery record. Resiliently handles both Firestore and local store.
 */
export async function updateGalleryItem(
  id: string,
  updates: Partial<GalleryItemRecord>
): Promise<GalleryItemRecord | null> {
  const now = new Date().toISOString();

  // 1. Update in local/tmp store
  const localItems = [...readLocalGallery()];
  const index = localItems.findIndex((item) => item.id === id);

  let updatedRecord: GalleryItemRecord | null = null;

  if (index !== -1) {
    updatedRecord = {
      ...localItems[index],
      ...updates,
      updatedAt: now,
    };
    localItems[index] = updatedRecord;
    writeLocalGallery(localItems);
  }

  // 2. Update in Firestore if configured
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const docRef = adminDb.collection("gallery").doc(id);
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
            caption: updates.caption ?? firestoreData.caption ?? "",
            altText: updates.altText ?? firestoreData.altText ?? "",
            imageUrl: updates.imageUrl ?? firestoreData.imageUrl ?? "",
            thumbnailUrl: updates.thumbnailUrl ?? firestoreData.thumbnailUrl ?? "",
            cloudinaryPublicId: updates.cloudinaryPublicId ?? firestoreData.cloudinaryPublicId ?? "",
            category: updates.category ?? firestoreData.category ?? "campus",
            tags: updates.tags ?? firestoreData.tags ?? [],
            dateCaptured: updates.dateCaptured ?? firestoreData.dateCaptured ?? "",
            isPublished: updates.isPublished ?? firestoreData.isPublished ?? true,
            featuredOnHome: updates.featuredOnHome ?? firestoreData.featuredOnHome ?? false,
            order: updates.order ?? firestoreData.order ?? 0,
            createdAt: firestoreData.createdAt?.toDate ? firestoreData.createdAt.toDate().toISOString() : now,
            updatedAt: now,
            createdBy: firestoreData.createdBy ?? null,
          };
          localItems.push(updatedRecord);
          writeLocalGallery(localItems);
        }
      } else if (updatedRecord) {
        // Document didn't exist in Firestore yet, write it now
        await docRef.set({
          ...updatedRecord,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
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
  let existed = false;

  // 1. Delete from local/tmp store
  const localItems = readLocalGallery();
  const filtered = localItems.filter((item) => item.id !== id);
  if (filtered.length !== localItems.length) {
    writeLocalGallery(filtered);
    existed = true;
  }

  // 2. Delete from Firestore if configured
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const docRef = adminDb.collection("gallery").doc(id);
      const snap = await docRef.get();
      if (snap.exists) {
        await docRef.delete();
        existed = true;
      }
    } catch (err) {
      console.warn("[Firestore Gallery Delete Warning]:", err);
    }
  }

  return existed;
}
