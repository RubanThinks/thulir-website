import "server-only";
import fs from "fs";
import path from "path";
import { getAdminDb } from "../firebase/admin";
import { BASELINE_PROGRAMS, seedProgramsIfEmpty, SeedProgram } from "../seed/programs";
import { FieldValue } from "firebase-admin/firestore";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const PROGRAMS_FILE = path.join(DATA_DIR, "programs.json");

/**
 * Reads local persistent programs storage. Seeds baseline items if empty.
 */
export function readLocalPrograms(): SeedProgram[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PROGRAMS_FILE)) {
      fs.writeFileSync(PROGRAMS_FILE, JSON.stringify(BASELINE_PROGRAMS, null, 2), "utf8");
      return BASELINE_PROGRAMS;
    }
    const raw = fs.readFileSync(PROGRAMS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      fs.writeFileSync(PROGRAMS_FILE, JSON.stringify(BASELINE_PROGRAMS, null, 2), "utf8");
      return BASELINE_PROGRAMS;
    }
    return parsed;
  } catch (err) {
    console.warn("[Programs Store Read Error - using baseline]:", err);
    return BASELINE_PROGRAMS;
  }
}

/**
 * Saves programs records to local persistent storage.
 */
export function writeLocalPrograms(items: SeedProgram[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PROGRAMS_FILE, JSON.stringify(items, null, 2), "utf8");
  } catch (err) {
    console.error("[Programs Store Write Error]:", err);
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

  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      const snapshot = await adminDb.collection("services").orderBy("order", "asc").get();
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
    }
  } catch (cloudErr) {
    console.warn("[getProgramsList Cloud DB Warning]:", cloudErr);
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
 * Saves a new program to local storage and dual-writes to cloud database if available.
 */
export async function saveProgram(program: SeedProgram): Promise<SeedProgram> {
  // 1. Local write
  try {
    const current = readLocalPrograms();
    const existingIndex = current.findIndex((item) => item.id === program.id);
    if (existingIndex >= 0) {
      current[existingIndex] = program;
    } else {
      current.push(program);
    }
    writeLocalPrograms(current);
  } catch (localErr) {
    console.error("[saveProgram Local Error]:", localErr);
  }

  // 2. Cloud DB dual-write if available
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      await adminDb.collection("services").doc(program.id).set({
        ...program,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  } catch (cloudErr) {
    console.warn("[saveProgram Cloud DB Warning]:", cloudErr);
  }

  return program;
}

/**
 * Updates an existing program record in local storage and cloud database.
 */
export async function updateProgramRecord(
  id: string,
  updates: Partial<SeedProgram>
): Promise<SeedProgram | null> {
  let updatedRecord: SeedProgram | null = null;

  // 1. Local update
  try {
    const current = readLocalPrograms();
    const index = current.findIndex((item) => item.id === id);
    if (index >= 0) {
      current[index] = {
        ...current[index],
        ...updates,
      };
      updatedRecord = current[index];
      writeLocalPrograms(current);
    }
  } catch (localErr) {
    console.error("[updateProgramRecord Local Error]:", localErr);
  }

  // 2. Cloud DB dual-write if available
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      await adminDb.collection("services").doc(id).set(
        {
          ...updates,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }
  } catch (cloudErr) {
    console.warn("[updateProgramRecord Cloud DB Warning]:", cloudErr);
  }

  return updatedRecord;
}

/**
 * Deletes a program record from local storage and cloud database.
 */
export async function deleteProgramRecord(id: string): Promise<boolean> {
  let deleted = false;

  // 1. Local delete
  try {
    const current = readLocalPrograms();
    const filtered = current.filter((item) => item.id !== id);
    if (filtered.length !== current.length) {
      writeLocalPrograms(filtered);
      deleted = true;
    }
  } catch (localErr) {
    console.error("[deleteProgramRecord Local Error]:", localErr);
  }

  // 2. Cloud DB delete if available
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      await adminDb.collection("services").doc(id).delete();
      deleted = true;
    }
  } catch (cloudErr) {
    console.warn("[deleteProgramRecord Cloud DB Warning]:", cloudErr);
  }

  return deleted;
}
