import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin";
import { getAdminDb } from "@/lib/firebase/admin";
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

    const docRef = adminDb.collection("services").doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Program not found." }, { status: 404 });
    }

    const updates: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

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

    await docRef.update(updates);

    return NextResponse.json({ success: true, message: "Program updated successfully." });
  } catch (error: unknown) {
    console.error("[Admin Programs PATCH Error]:", error);
    return NextResponse.json({ error: "Failed to update program." }, { status: 500 });
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
    const docRef = adminDb.collection("services").doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Program not found." }, { status: 404 });
    }

    await docRef.delete();
    return NextResponse.json({ success: true, message: "Program deleted successfully." });
  } catch (error: unknown) {
    console.error("[Admin Programs DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete program." }, { status: 500 });
  }
}
