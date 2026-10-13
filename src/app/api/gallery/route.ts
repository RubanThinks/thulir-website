import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

export const instant = false;

export async function GET(request: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    return NextResponse.json({ items: [] });
  }

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = adminDb
      .collection("gallery")
      .where("isPublished", "==", true)
      .orderBy("order", "asc");

    if (category && category !== "all") {
      query = adminDb
        .collection("gallery")
        .where("isPublished", "==", true)
        .where("category", "==", category)
        .orderBy("order", "asc");
    }

    const snapshot = await query.get();
    const items = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        caption: data.caption || "",
        altText: data.altText || data.title || "",
        imageUrl: data.imageUrl,
        thumbnailUrl: data.thumbnailUrl || data.imageUrl,
        category: data.category || "campus",
        tags: data.tags || [],
        featuredOnHome: Boolean(data.featuredOnHome),
        order: data.order || 0,
      };
    });

    return NextResponse.json({ items });
  } catch (error: unknown) {
    console.error("[Public Gallery GET Error]:", error);
    return NextResponse.json({ items: [] });
  }
}
