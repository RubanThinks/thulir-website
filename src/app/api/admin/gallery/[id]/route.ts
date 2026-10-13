import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin";
import { getAdminDb } from "@/lib/firebase/admin";
import { deleteCloudinaryAsset } from "@/lib/cloudinary/server";
import { FieldValue } from "firebase-admin/firestore";



interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await context.params;
  const adminDb = getAdminDb();
  if (!adminDb) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const docRef = adminDb.collection("gallery").doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Gallery item not found." }, { status: 404 });
    }

    const updates: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.caption !== undefined) updates.caption = body.caption.trim();
    if (body.altText !== undefined) updates.altText = body.altText.trim();
    if (body.category !== undefined) updates.category = body.category;
    if (body.isPublished !== undefined) updates.isPublished = Boolean(body.isPublished);
    if (body.featuredOnHome !== undefined) updates.featuredOnHome = Boolean(body.featuredOnHome);
    if (body.order !== undefined) updates.order = Number(body.order);

    await docRef.update(updates);

    return NextResponse.json({ success: true, message: "Gallery item updated." });
  } catch (error: unknown) {
    console.error("[Admin Gallery PATCH Error]:", error);
    return NextResponse.json({ error: "Failed to update gallery item." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await context.params;
  const adminDb = getAdminDb();
  if (!adminDb) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const docRef = adminDb.collection("gallery").doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Gallery item not found." }, { status: 404 });
    }

    const data = existing.data();
    const cloudinaryPublicId = data?.cloudinaryPublicId;

    // Delete Firestore document
    await docRef.delete();

    // Clean up Cloudinary asset if public ID is recorded
    if (cloudinaryPublicId) {
      await deleteCloudinaryAsset(cloudinaryPublicId).catch((err) => {
        console.warn("[Cloudinary Asset Delete Warning]:", err);
      });
    }

    return NextResponse.json({ success: true, message: "Gallery item deleted." });
  } catch (error: unknown) {
    console.error("[Admin Gallery DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete gallery item." }, { status: 500 });
  }
}
