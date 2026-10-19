import { NextRequest, NextResponse } from "next/server";
import {
  getProgramByIdOrSlug,
  updateProgramRecord,
  deleteProgramRecord,
} from "@/lib/services/programs";
import { uploadImageBuffer } from "@/lib/cloudinary/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const program = await getProgramByIdOrSlug(id);
  if (!program) {
    return NextResponse.json({ error: "Program not found." }, { status: 404 });
  }
  return NextResponse.json({ program });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const contentType = request.headers.get("content-type") || "";
    const updates: Record<string, unknown> = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (formData.has("title")) updates.title = (formData.get("title") as string).trim();
      if (formData.has("category")) updates.category = (formData.get("category") as string).trim();
      if (formData.has("shortDescription")) updates.shortDescription = (formData.get("shortDescription") as string).trim();
      if (formData.has("fullDescription")) updates.fullDescription = (formData.get("fullDescription") as string).trim();
      if (formData.has("targetAgeRange")) updates.targetAgeRange = (formData.get("targetAgeRange") as string).trim();
      if (formData.has("order")) updates.order = Number(formData.get("order")) || 0;
      if (formData.has("isPublished")) updates.isPublished = formData.get("isPublished") === "true";
      if (formData.has("heroImageUrl")) updates.heroImageUrl = (formData.get("heroImageUrl") as string).trim();

      const rawApproaches = formData.get("clinicalApproaches");
      if (typeof rawApproaches === "string") {
        try {
          const parsed = JSON.parse(rawApproaches);
          if (Array.isArray(parsed)) updates.clinicalApproaches = parsed;
          else updates.clinicalApproaches = rawApproaches.split("\n").map((s) => s.trim()).filter(Boolean);
        } catch {
          updates.clinicalApproaches = rawApproaches.split("\n").map((s) => s.trim()).filter(Boolean);
        }
      }

      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await uploadImageBuffer(buffer, file.name, "programs");
        updates.heroImageUrl = uploadResult.url;
      }
    } else {
      const body = await request.json().catch(() => null);
      if (!body) {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
      }

      if (body.title !== undefined) updates.title = body.title.trim();
      if (body.category !== undefined) updates.category = body.category;
      if (body.shortDescription !== undefined) updates.shortDescription = body.shortDescription.trim();
      if (body.fullDescription !== undefined) updates.fullDescription = body.fullDescription.trim();
      if (body.clinicalApproaches !== undefined && Array.isArray(body.clinicalApproaches)) {
        updates.clinicalApproaches = body.clinicalApproaches;
      }
      if (body.targetAgeRange !== undefined) updates.targetAgeRange = body.targetAgeRange.trim();
      if (body.heroImageUrl !== undefined) updates.heroImageUrl = body.heroImageUrl;
      if (body.order !== undefined) updates.order = Number(body.order);
      if (body.isPublished !== undefined) updates.isPublished = Boolean(body.isPublished);
    }

    const updated = await updateProgramRecord(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Program not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Program updated successfully.",
      program: updated,
    });
  } catch (error: unknown) {
    console.error("[Admin Programs PATCH Error]:", error);
    return NextResponse.json({ error: "Failed to update program." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const deleted = await deleteProgramRecord(id);
    if (!deleted) {
      return NextResponse.json({ error: "Program not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Program deleted successfully." });
  } catch (error: unknown) {
    console.error("[Admin Programs DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete program." }, { status: 500 });
  }
}
