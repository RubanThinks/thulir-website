import { NextRequest, NextResponse } from "next/server";
import { updateGalleryItem, deleteGalleryItem } from "@/lib/services/gallery";

interface RouteContext {
  params: Promise<{ id: string }>;
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
    if (body.caption !== undefined) updates.caption = body.caption.trim();
    if (body.altText !== undefined) updates.altText = body.altText.trim();
    if (body.category !== undefined) updates.category = body.category;
    if (body.isPublished !== undefined) updates.isPublished = Boolean(body.isPublished);
    if (body.featuredOnHome !== undefined) updates.featuredOnHome = Boolean(body.featuredOnHome);
    if (body.order !== undefined) updates.order = Number(body.order);

    const updated = await updateGalleryItem(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Gallery item not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated, message: "Gallery item updated." });
  } catch (error: unknown) {
    console.error("[Admin Gallery PATCH Error]:", error);
    return NextResponse.json({ error: "Failed to update gallery item." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const deleted = await deleteGalleryItem(id);
    if (!deleted) {
      return NextResponse.json({ error: "Gallery item not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Gallery item deleted." });
  } catch (error: unknown) {
    console.error("[Admin Gallery DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete gallery item." }, { status: 500 });
  }
}
