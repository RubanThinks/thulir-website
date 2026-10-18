import { NextRequest, NextResponse } from "next/server";
import { getProgramsList, saveProgram } from "@/lib/services/programs";

export async function GET() {
  try {
    const programs = await getProgramsList();
    return NextResponse.json({ programs });
  } catch (error: unknown) {
    console.error("[Admin Programs GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve programs." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.title) {
      return NextResponse.json({ error: "Program title is required." }, { status: 400 });
    }

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const programId = slug || `program-${Date.now()}`;

    const newDoc = await saveProgram({
      id: programId,
      title: body.title.trim(),
      slug: programId,
      category: body.category || "therapy",
      shortDescription: (body.shortDescription || "").trim(),
      fullDescription: (body.fullDescription || "").trim(),
      clinicalApproaches: Array.isArray(body.clinicalApproaches) ? body.clinicalApproaches : [],
      targetAgeRange: (body.targetAgeRange || "2 to 16 years").trim(),
      heroImageUrl: body.heroImageUrl || "/assets/images/sensory_occupational_room.jpg",
      order: Number(body.order || 99),
      isPublished: Boolean(body.isPublished ?? true),
    });

    return NextResponse.json({ success: true, program: newDoc }, { status: 201 });
  } catch (error: unknown) {
    console.error("[Admin Programs POST Error]:", error);
    return NextResponse.json({ error: "Failed to create program." }, { status: 500 });
  }
}
