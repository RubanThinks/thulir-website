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

    const docRef = adminDb.collection("events").doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    const updates: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.eventDate !== undefined) updates.eventDate = body.eventDate;
    if (body.location !== undefined) updates.location = body.location.trim();
    if (body.category !== undefined) updates.category = body.category;
    if (body.summary !== undefined) updates.summary = body.summary.trim();
    if (body.detailedReport !== undefined) updates.detailedReport = body.detailedReport.trim();
    if (body.coverImageUrl !== undefined) updates.coverImageUrl = body.coverImageUrl;
    if (body.isPublished !== undefined) updates.isPublished = Boolean(body.isPublished);
    if (body.isArchived !== undefined) updates.isArchived = Boolean(body.isArchived);
    if (body.participantCount !== undefined) updates.participantCount = Number(body.participantCount) || 0;

    await docRef.update(updates);

    return NextResponse.json({ success: true, message: "Event updated successfully." });
  } catch (error: unknown) {
    console.error("[Admin Events PATCH Error]:", error);
    return NextResponse.json({ error: "Failed to update event." }, { status: 500 });
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
    const docRef = adminDb.collection("events").doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    await docRef.delete();
    return NextResponse.json({ success: true, message: "Event deleted successfully." });
  } catch (error: unknown) {
    console.error("[Admin Events DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete event." }, { status: 500 });
  }
}
