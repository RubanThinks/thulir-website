import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin";
import { getAdminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export const instant = false;

export async function GET(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const adminDb = getAdminDb();
  if (!adminDb) {
    return NextResponse.json({ items: [] });
  }

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = adminDb.collection("gallery").orderBy("order", "asc");
    if (category && category !== "all") {
      query = adminDb.collection("gallery").where("category", "==", category).orderBy("order", "asc");
    }

    const snapshot = await query.get();
    const items = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
      };
    });

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

  const adminDb = getAdminDb();
  if (!adminDb) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.imageUrl || !body.title) {
      return NextResponse.json(
        { error: "Image URL and title are required." },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("gallery").doc();
    const newDoc = {
      id: docRef.id,
      title: body.title.trim(),
      caption: (body.caption || "").trim(),
      altText: (body.altText || body.title).trim(),
      cloudinaryPublicId: body.cloudinaryPublicId || "",
      imageUrl: body.imageUrl,
      thumbnailUrl: body.thumbnailUrl || body.imageUrl,
      category: body.category || "campus",
      tags: Array.isArray(body.tags) ? body.tags : [],
      dateCaptured: body.dateCaptured || new Date().toISOString().slice(0, 10),
      isPublished: Boolean(body.isPublished ?? true),
      featuredOnHome: Boolean(body.featuredOnHome ?? false),
      order: Number(body.order || 0),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: session.user.email,
    };

    await docRef.set(newDoc);

    return NextResponse.json({ success: true, item: newDoc }, { status: 201 });
  } catch (error: unknown) {
    console.error("[Admin Gallery POST Error]:", error);
    return NextResponse.json({ error: "Failed to create gallery item." }, { status: 500 });
  }
}
