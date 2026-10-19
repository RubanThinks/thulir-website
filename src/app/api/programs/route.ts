import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { BASELINE_PROGRAMS, seedProgramsIfEmpty } from "@/lib/seed/programs";



export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    return NextResponse.json({
      programs: BASELINE_PROGRAMS.filter((p) => p.isPublished),
    });
  }

  try {
    // Seed on first fetch if collection is unpopulated
    await seedProgramsIfEmpty();

    const snapshot = await adminDb
      .collection("services")
      .where("isPublished", "==", true)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({
        programs: BASELINE_PROGRAMS.filter((p) => p.isPublished),
      });
    }

    const programs = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        slug: data.slug || doc.id,
        category: data.category,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        clinicalApproaches: data.clinicalApproaches || [],
        targetAgeRange: data.targetAgeRange,
        heroImageUrl: data.heroImageUrl,
        order: Number(data.order || 0),
      };
    });
    programs.sort((a, b) => a.order - b.order);

    return NextResponse.json({ programs });
  } catch (error: unknown) {
    console.error("[Public Programs GET Error]:", error);
    return NextResponse.json({
      programs: BASELINE_PROGRAMS.filter((p) => p.isPublished),
    });
  }
}
