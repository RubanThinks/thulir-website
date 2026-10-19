import { NextRequest, NextResponse } from "next/server";
import { getProgramsList, saveProgram } from "@/lib/services/programs";
import { uploadImageBuffer } from "@/lib/cloudinary/server";

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
    const contentType = request.headers.get("content-type") || "";

    let title = "";
    let category = "therapy";
    let shortDescription = "";
    let fullDescription = "";
    let clinicalApproaches: string[] = [];
    let targetAgeRange = "2 to 16 years";
    let heroImageUrl = "/assets/images/sensory_occupational_room.jpg";
    let order = 99;
    let isPublished = true;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      title = (formData.get("title") as string || "").trim();
      category = (formData.get("category") as string || "therapy").trim();
      shortDescription = (formData.get("shortDescription") as string || "").trim();
      fullDescription = (formData.get("fullDescription") as string || "").trim();
      targetAgeRange = (formData.get("targetAgeRange") as string || "2 to 16 years").trim();
      if (formData.has("heroImageUrl")) {
        heroImageUrl = (formData.get("heroImageUrl") as string || heroImageUrl).trim();
      }
      order = Number(formData.get("order") || 99);
      isPublished = formData.get("isPublished") === "true";

      const rawApproaches = formData.get("clinicalApproaches");
      if (typeof rawApproaches === "string") {
        try {
          const parsed = JSON.parse(rawApproaches);
          if (Array.isArray(parsed)) clinicalApproaches = parsed;
          else clinicalApproaches = rawApproaches.split("\n").map((s) => s.trim()).filter(Boolean);
        } catch {
          clinicalApproaches = rawApproaches.split("\n").map((s) => s.trim()).filter(Boolean);
        }
      }

      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await uploadImageBuffer(buffer, file.name, "programs");
        heroImageUrl = uploadResult.url;
      }
    } else {
      const body = await request.json().catch(() => null);
      if (!body) {
        return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
      }
      title = (body.title || "").trim();
      category = body.category || "therapy";
      shortDescription = (body.shortDescription || "").trim();
      fullDescription = (body.fullDescription || "").trim();
      clinicalApproaches = Array.isArray(body.clinicalApproaches) ? body.clinicalApproaches : [];
      targetAgeRange = (body.targetAgeRange || "2 to 16 years").trim();
      if (body.heroImageUrl) heroImageUrl = body.heroImageUrl;
      order = Number(body.order || 99);
      isPublished = Boolean(body.isPublished ?? true);
    }

    if (!title) {
      return NextResponse.json({ error: "Program title is required." }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const programId = slug || `program-${Date.now()}`;

    const newDoc = await saveProgram({
      id: programId,
      title,
      slug: programId,
      category: category as "therapy" | "education" | "support",
      shortDescription,
      fullDescription,
      clinicalApproaches,
      targetAgeRange,
      heroImageUrl,
      order,
      isPublished,
    });

    return NextResponse.json({ success: true, program: newDoc }, { status: 201 });
  } catch (error: unknown) {
    console.error("[Admin Programs POST Error]:", error);
    return NextResponse.json({ error: "Failed to create program." }, { status: 500 });
  }
}
