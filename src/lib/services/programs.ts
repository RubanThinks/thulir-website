import "server-only";
import { getAdminDb } from "../firebase/admin";
import { BASELINE_PROGRAMS, seedProgramsIfEmpty, SeedProgram } from "../seed/programs";

/**
 * Server-side data fetcher for published programs.
 * Returns programs from Firestore `services` collection, or seamlessly falls back
 * to the verified baseline programs if the database is offline or unseeded.
 */
export async function getPublishedPrograms(): Promise<SeedProgram[]> {
  const adminDb = getAdminDb();
  if (!adminDb) {
    return BASELINE_PROGRAMS.filter((p) => p.isPublished);
  }

  try {
    // Attempt automatic seed if unpopulated
    await seedProgramsIfEmpty().catch(() => {});

    const snapshot = await adminDb
      .collection("services")
      .where("isPublished", "==", true)
      .orderBy("order", "asc")
      .get();

    if (snapshot.empty) {
      return BASELINE_PROGRAMS.filter((p) => p.isPublished);
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        slug: data.slug || doc.id,
        category: data.category || "therapy",
        shortDescription: data.shortDescription || "",
        fullDescription: data.fullDescription || "",
        clinicalApproaches: data.clinicalApproaches || [],
        targetAgeRange: data.targetAgeRange || "2 to 16 years",
        heroImageUrl: data.heroImageUrl || "/assets/images/therapies/occupational_sensory.jpg",
        order: data.order || 0,
        isPublished: true,
      };
    });
  } catch (error) {
    console.warn("[getPublishedPrograms Error - falling back to baseline]:", error);
    return BASELINE_PROGRAMS.filter((p) => p.isPublished);
  }
}
