import "server-only";
import { getAdminDb } from "../firebase/admin";
import { BASELINE_PROGRAMS, SeedProgram } from "../seed/programs";
import seedProgramsData from "@/data/programs.json";
import { FieldValue } from "firebase-admin/firestore";
import { readJsonSafe, writeJsonSafe } from "./storageHelper";

// 100% statically-bundled seed programs
export const BUNDLED_PROGRAMS: SeedProgram[] = (seedProgramsData as unknown as SeedProgram[]) || BASELINE_PROGRAMS;

let memoryProgramsItems: SeedProgram[] | null = null;

/**
 * Reads local persistent programs storage safely in any runtime (local dev or read-only Vercel).
 */
export function readLocalPrograms(): SeedProgram[] {
  if (memoryProgramsItems && memoryProgramsItems.length > 0) {
    return memoryProgramsItems;
  }
  const items = readJsonSafe<SeedProgram[]>("programs.json", BUNDLED_PROGRAMS);
  memoryProgramsItems = Array.isArray(items) && items.length > 0 ? items : BUNDLED_PROGRAMS;
  return memoryProgramsItems;
}

/**
 * Saves programs records safely (writes to local src/data in dev, or /tmp in serverless).
 */
export function writeLocalPrograms(items: SeedProgram[]): void {
  memoryProgramsItems = items;
  writeJsonSafe("programs.json", items);
}

/**
 * Helper to auto-seed Firestore if services collection is empty.
 */
async function autoSeedFirestoreIfEmpty(items: SeedProgram[]): Promise<void> {
  const adminDb = getAdminDb();
  if (!adminDb || items.length === 0) return;

  try {
    const existing = await adminDb.collection("services").limit(1).get();
    if (existing.empty) {
      console.log(`[Firestore Programs Auto-Seed] Seeding ${items.length} records into Firestore...`);
      const batch = adminDb.batch();
      for (const item of items) {
        const docRef = adminDb.collection("services").doc(item.id);
        batch.set(docRef, {
          ...item,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
      await batch.commit();
      console.log("[Firestore Programs Auto-Seed] Successfully seeded programs records.");
    }
  } catch (seedErr) {
    console.warn("[Firestore Programs Auto-Seed Warning]:", seedErr);
  }
}

/**
 * Retrieves all programs (combines local storage with cloud database if available).
 */
export async function getProgramsList(): Promise<SeedProgram[]> {
  const localItems = readLocalPrograms();
  const programMap = new Map<string, SeedProgram>();

  for (const item of localItems) {
    programMap.set(item.id, item);
  }

  const adminDb = getAdminDb();
  // During static build prerender, use local bundled programs to avoid gRPC crypto randomBytes prerender block
  if (adminDb && process.env.NEXT_PHASE !== "phase-production-build") {
    try {
      const snapshot = await adminDb.collection("services").orderBy("order", "asc").get();
      if (!snapshot.empty) {
        for (const doc of snapshot.docs) {
          const data = doc.data();
          const record: SeedProgram = {
            id: doc.id,
            title: data.title || "",
            slug: data.slug || doc.id,
            category: data.category || "therapy",
            shortDescription: data.shortDescription || "",
            fullDescription: data.fullDescription || "",
            clinicalApproaches: Array.isArray(data.clinicalApproaches) ? data.clinicalApproaches : [],
            targetAgeRange: data.targetAgeRange || "2 to 16 years",
            heroImageUrl: data.heroImageUrl || "/assets/images/therapies/occupational_sensory.jpg",
            order: typeof data.order === "number" ? data.order : 0,
            isPublished: data.isPublished !== false,
          };
          programMap.set(doc.id, record);
        }
      } else {
        autoSeedFirestoreIfEmpty(localItems).catch(() => {});
      }
    } catch (cloudErr) {
      console.warn("[getProgramsList Cloud DB Warning]:", cloudErr);
    }
  }

  const all = Array.from(programMap.values());
  all.sort((a, b) => (a.order || 0) - (b.order || 0));
  return all;
}

/**
 * Server-side data fetcher for published programs.
 */
export async function getPublishedPrograms(): Promise<SeedProgram[]> {
  const all = await getProgramsList();
  return all.filter((p) => p.isPublished);
}

/**
 * Retrieves a single program by ID or slug.
 */
export async function getProgramByIdOrSlug(idOrSlug: string): Promise<SeedProgram | null> {
  const all = await getProgramsList();
  return all.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
}

/**
 * Saves a new program to resilient storage and dual-writes to cloud database if available.
 */
export async function saveProgram(program: SeedProgram): Promise<SeedProgram> {
  // 1. Local / tmp write
  const current = [...readLocalPrograms()];
  const existingIndex = current.findIndex((item) => item.id === program.id);
  if (existingIndex >= 0) {
    current[existingIndex] = program;
  } else {
    current.push(program);
  }
  writeLocalPrograms(current);

  // 2. Cloud DB dual-write if available
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.collection("services").doc(program.id).set({
        ...program,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (cloudErr) {
      console.warn("[saveProgram Cloud DB Warning]:", cloudErr);
    }
  }

  return program;
}

/**
 * Updates an existing program record in resilient storage and cloud database.
 */
export async function updateProgramRecord(
  id: string,
  updates: Partial<SeedProgram>
): Promise<SeedProgram | null> {
  let updatedRecord: SeedProgram | null = null;

  // 1. Local update
  const current = [...readLocalPrograms()];
  const index = current.findIndex((item) => item.id === id);
  if (index >= 0) {
    current[index] = {
      ...current[index],
      ...updates,
    };
    updatedRecord = current[index];
    writeLocalPrograms(current);
  }

  // 2. Cloud DB dual-write if available
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const docRef = adminDb.collection("services").doc(id);
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
            category: updates.category ?? firestoreData.category ?? "therapy",
            shortDescription: updates.shortDescription ?? firestoreData.shortDescription ?? "",
            fullDescription: updates.fullDescription ?? firestoreData.fullDescription ?? "",
            clinicalApproaches: updates.clinicalApproaches ?? firestoreData.clinicalApproaches ?? [],
            targetAgeRange: updates.targetAgeRange ?? firestoreData.targetAgeRange ?? "2 to 16 years",
            heroImageUrl: updates.heroImageUrl ?? firestoreData.heroImageUrl ?? "",
            order: updates.order ?? firestoreData.order ?? 0,
            isPublished: updates.isPublished ?? firestoreData.isPublished ?? true,
          };
          current.push(updatedRecord);
          writeLocalPrograms(current);
        }
      } else if (updatedRecord) {
        await docRef.set({
          ...updatedRecord,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    } catch (cloudErr) {
      console.warn("[updateProgramRecord Cloud DB Warning]:", cloudErr);
    }
  }

  return updatedRecord;
}

/**
 * Deletes a program record from resilient storage and cloud database.
 */
export async function deleteProgramRecord(id: string): Promise<boolean> {
  let deleted = false;

  // 1. Local delete
  const current = readLocalPrograms();
  const filtered = current.filter((item) => item.id !== id);
  if (filtered.length !== current.length) {
    writeLocalPrograms(filtered);
    deleted = true;
  }

  // 2. Cloud DB delete if available
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const docRef = adminDb.collection("services").doc(id);
      const snap = await docRef.get();
      if (snap.exists) {
        await docRef.delete();
        deleted = true;
      }
    } catch (cloudErr) {
      console.warn("[deleteProgramRecord Cloud DB Warning]:", cloudErr);
    }
  }

  return deleted;
}
