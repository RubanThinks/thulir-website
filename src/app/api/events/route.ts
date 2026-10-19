import { NextResponse } from "next/server";
import { getEventsList } from "@/lib/services/events";


export async function GET() {
  try {
    const allEvents = await getEventsList();
    const published = allEvents.filter((e) => e.isPublished && !e.isArchived);
    const todayStr = new Date().toISOString().slice(0, 10);

    const upcoming = published.filter((e) => (e.eventDate || "") >= todayStr);
    const past = published.filter((e) => (e.eventDate || "") < todayStr);

    return NextResponse.json(
      {
        events: published,
        upcoming,
        past,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: unknown) {
    console.error("[Public Events GET Error]:", error);
    return NextResponse.json(
      { events: [], upcoming: [], past: [] },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }
}
