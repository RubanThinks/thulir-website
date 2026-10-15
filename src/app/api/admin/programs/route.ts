import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin";
import { getAdminDb } from "@/lib/firebase/admin";
import { seedProgramsIfEmpty, BASELINE_PROGRAMS } from "@/lib/seed/programs";
import { FieldValue } from "firebase-admin/firestore";



export async function GET() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const adminDb = getAdminDb();
  if (!adminDb) {
    // Return baseline if database is unconfigured
    return NextResponse.json({ programs: BASELINE_PROGRAMS });
  }

  try {
    // Seed baseline if collection is empty
    await seedProgramsIfEmpty();

    const snapshot = await adminDb.collection("services").orderBy("order", "asc").get();
    const programs = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
      };
    });

    return NextResponse.json({ programs });
  } catch (error: unknown) {
    console.error("[Admin Programs GET Error]:", error);
    return NextResponse.json({ programs: BASELINE_PROGRAMS });
  }
}

export async function POST(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const adminDb = getAdminDb();
  if (!adminDb) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.title) {
      return NextResponse.json({ error: "Program title is required." }, { status: 400 });
    }

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const docRef = adminDb.collection("services").doc(slug || undefined);

    const newDoc = {
      id: docRef.id,
      title: body.title.trim(),
      slug: docRef.id,
      category: body.category || "therapy",
      shortDescription: (body.shortDescription || "").trim(),
      fullDescription: (body.fullDescription || "").trim(),
      clinicalApproaches: Array.isArray(body.clinicalApproaches) ? body.clinicalApproaches : [],
      targetAgeRange: (body.targetAgeRange || "2 to 16 years").trim(),
      heroImageUrl: body.heroImageUrl || "/assets/images/sensory_occupational_room.jpg",
      order: Number(body.order || 99),
      isPublished: Boolean(body.isPublished ?? true),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: session.user.email,
    };

    await docRef.set(newDoc);

    return NextResponse.json({ success: true, program: newDoc }, { status: 201 });
  } catch (error: unknown) {
    console.error("[Admin Programs POST Error]:", error);
    return NextResponse.json({ error: "Failed to create program." }, { status: 500 });
  }
}
