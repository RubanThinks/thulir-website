import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

export const instant = false;

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    return NextResponse.json({ events: [], upcoming: [], past: [] });
  }

  try {
    const snapshot = await adminDb
      .collection("events")
      .where("isPublished", "==", true)
      .where("isArchived", "==", false)
      .orderBy("eventDate", "desc")
      .get();

    const todayStr = new Date().toISOString().slice(0, 10);

    const allEvents = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        slug: data.slug || doc.id,
        eventDate: data.eventDate || "",
        location: data.location || "Coimbatore, Tamil Nadu",
        category: data.category || "celebration",
        summary: data.summary || "",
        detailedReport: data.detailedReport || "",
        coverImageUrl: data.coverImageUrl || "",
        photos: data.photos || [],
        participantCount: data.participantCount,
      };
    });

    const upcoming = allEvents.filter((e) => e.eventDate >= todayStr);
    const past = allEvents.filter((e) => e.eventDate < todayStr);

    return NextResponse.json({
      events: allEvents,
      upcoming,
      past,
    });
  } catch (error: unknown) {
    console.error("[Public Events GET Error]:", error);
    return NextResponse.json({ events: [], upcoming: [], past: [] });
  }
}
