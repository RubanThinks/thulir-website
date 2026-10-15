import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin";
import { getGalleryItems, addGalleryItem } from "@/lib/services/gallery";
import { uploadImageBuffer } from "@/lib/cloudinary/server";

export async function GET(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const items = await getGalleryItems(category, false);
    return NextResponse.json({ items });
  } catch (error: unknown) {
    console.error("[Admin Gallery GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve gallery items." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";

    let title = "";
    let caption = "";
    let altText = "";
    let category = "campus";
    let imageUrl = "";
    let cloudinaryPublicId = "";
    let isPublished = true;
    let featuredOnHome = false;
    let order = 0;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      title = (formData.get("title") as string || "").trim();
      caption = (formData.get("caption") as string || "").trim();
      altText = (formData.get("altText") as string || "").trim();
      category = (formData.get("category") as string || "campus").trim();
      isPublished = formData.get("isPublished") === "true";
      featuredOnHome = formData.get("featuredOnHome") === "true";
      order = Number(formData.get("order") || 0);
      imageUrl = (formData.get("imageUrl") as string || "").trim();
      cloudinaryPublicId = (formData.get("cloudinaryPublicId") as string || "").trim();

      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await uploadImageBuffer(buffer, file.name);
        imageUrl = uploadResult.url;
        cloudinaryPublicId = uploadResult.publicId;
      }
    } else {
      const body = await request.json().catch(() => null);
      if (!body) {
        return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
      }
      title = (body.title || "").trim();
      caption = (body.caption || "").trim();
      altText = (body.altText || "").trim();
      category = (body.category || "campus").trim();
      imageUrl = (body.imageUrl || "").trim();
      cloudinaryPublicId = (body.cloudinaryPublicId || "").trim();
      isPublished = Boolean(body.isPublished ?? true);
      featuredOnHome = Boolean(body.featuredOnHome ?? false);
      order = Number(body.order || 0);
    }

    if (!title) {
      return NextResponse.json({ error: "Item title is required." }, { status: 400 });
    }

    if (!imageUrl) {
      return NextResponse.json({ error: "An image file is required." }, { status: 400 });
    }

    const newItem = await addGalleryItem({
      title,
      caption,
      altText: altText || title,
      imageUrl,
      thumbnailUrl: imageUrl,
      cloudinaryPublicId,
      category,
      isPublished,
      featuredOnHome,
      order,
      createdBy: session.user?.email || null,
    });

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error: unknown) {
    console.error("[Admin Gallery POST Error]:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to save gallery item." },
      { status: 500 }
    );
  }
}
