import { NextRequest, NextResponse } from "next/server";
import {
  getProgramByIdOrSlug,
  updateProgramRecord,
  deleteProgramRecord,
} from "@/lib/services/programs";

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
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};

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
