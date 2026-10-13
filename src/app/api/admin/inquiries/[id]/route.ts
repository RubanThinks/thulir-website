import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin";
import { getAdminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";



interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
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
    const doc = await adminDb.collection("inquiries").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    const data = doc.data();
    return NextResponse.json({
      inquiry: {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("[Admin Inquiries GET ID Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve inquiry." }, { status: 500 });
  }
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

    const updates: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (body.status) {
      const validStatuses = ["new", "in_review", "contacted", "scheduled_assessment", "archived"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
      }
      updates.status = body.status;
    }

    if (body.newNote && typeof body.newNote === "string") {
      const noteText = body.newNote.trim();
      if (noteText.length > 0) {
        const timestampStr = new Date().toISOString();
        const noteWithMeta = `[${timestampStr} by ${session.user.email || "Admin"}]: ${noteText}`;
        updates.internalNotes = FieldValue.arrayUnion(noteWithMeta);
      }
    }

    const docRef = adminDb.collection("inquiries").doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    await docRef.update(updates);

    return NextResponse.json({ success: true, message: "Inquiry updated successfully." });
  } catch (error: unknown) {
    console.error("[Admin Inquiries PATCH Error]:", error);
    return NextResponse.json({ error: "Failed to update inquiry." }, { status: 500 });
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
    const docRef = adminDb.collection("inquiries").doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    await docRef.delete();
    return NextResponse.json({ success: true, message: "Inquiry deleted successfully." });
  } catch (error: unknown) {
    console.error("[Admin Inquiries DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete inquiry." }, { status: 500 });
  }
}
