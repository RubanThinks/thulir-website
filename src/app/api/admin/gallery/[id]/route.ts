import { NextRequest, NextResponse } from "next/server";
import { updateGalleryItem, deleteGalleryItem } from "@/lib/services/gallery";
import { uploadImageBuffer } from "@/lib/cloudinary/server";


interface RouteContext {
  params: Promise<{ id: string }>;
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
      if (formData.has("caption")) updates.caption = (formData.get("caption") as string).trim();
      if (formData.has("altText")) updates.altText = (formData.get("altText") as string).trim();
      if (formData.has("category")) updates.category = (formData.get("category") as string).trim();
      if (formData.has("imageUrl")) updates.imageUrl = (formData.get("imageUrl") as string).trim();
      if (formData.has("isPublished")) updates.isPublished = formData.get("isPublished") === "true";
      if (formData.has("featuredOnHome")) updates.featuredOnHome = formData.get("featuredOnHome") === "true";
      if (formData.has("order")) updates.order = Number(formData.get("order")) || 0;

      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await uploadImageBuffer(buffer, file.name, "gallery");
        updates.imageUrl = uploadResult.url;
        updates.cloudinaryPublicId = uploadResult.publicId;
      }
    } else {
      const body = await request.json().catch(() => null);
      if (!body) {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
      }

      if (body.title !== undefined) updates.title = body.title.trim();
      if (body.caption !== undefined) updates.caption = body.caption.trim();
      if (body.altText !== undefined) updates.altText = body.altText.trim();
      if (body.category !== undefined) updates.category = body.category;
      if (body.imageUrl !== undefined) updates.imageUrl = body.imageUrl;
      if (body.isPublished !== undefined) updates.isPublished = Boolean(body.isPublished);
      if (body.featuredOnHome !== undefined) updates.featuredOnHome = Boolean(body.featuredOnHome);
      if (body.order !== undefined) updates.order = Number(body.order);
    }

    const updated = await updateGalleryItem(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Gallery item not found." }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, item: updated, message: "Gallery item updated." },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
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

    return NextResponse.json(
      { success: true, message: "Gallery item deleted." },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: unknown) {
    console.error("[Admin Gallery DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete gallery item." }, { status: 500 });
  }
}
