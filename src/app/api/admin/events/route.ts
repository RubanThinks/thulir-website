import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin";
import { getAdminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";



export async function GET() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const adminDb = getAdminDb();
  if (!adminDb) {
    return NextResponse.json({ events: [] });
  }

  try {
    const snapshot = await adminDb.collection("events").orderBy("eventDate", "desc").get();
    const events = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
      };
    });

    return NextResponse.json({ events });
  } catch (error: unknown) {
    console.error("[Admin Events GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve events." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const adminDb = getAdminDb();
  if (!adminDb) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.title || !body.eventDate) {
      return NextResponse.json(
        { error: "Event title and event date are required." },
        { status: 400 }
      );
    }

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const docRef = adminDb.collection("events").doc(slug || undefined);

    const newDoc = {
      id: docRef.id,
      title: body.title.trim(),
      slug: docRef.id,
      eventDate: body.eventDate,
      location: (body.location || "Coimbatore, Tamil Nadu").trim(),
      category: body.category || "celebration",
      summary: (body.summary || "").trim(),
      detailedReport: (body.detailedReport || "").trim(),
      coverImageUrl: body.coverImageUrl || "",
      photos: Array.isArray(body.photos) ? body.photos : [],
      participantCount: body.participantCount ? Number(body.participantCount) : undefined,
      isPublished: Boolean(body.isPublished ?? true),
      isArchived: Boolean(body.isArchived ?? false),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: session.user.email,
    };

    await docRef.set(newDoc);

    return NextResponse.json({ success: true, event: newDoc }, { status: 201 });
  } catch (error: unknown) {
    console.error("[Admin Events POST Error]:", error);
    return NextResponse.json({ error: "Failed to create event." }, { status: 500 });
  }
}
