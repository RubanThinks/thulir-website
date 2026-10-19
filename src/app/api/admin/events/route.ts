import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin";
import { getEventsList, saveEvent } from "@/lib/services/events";
import { uploadImageBuffer } from "@/lib/cloudinary/server";


export async function GET() {
  try {
    const events = await getEventsList();
    return NextResponse.json(
      { events },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: unknown) {
    console.error("[Admin Events GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to retrieve events." },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await verifyAdminSession().catch(() => null);
  const createdBy =
    session && session.authenticated && session.user?.email
      ? session.user.email
      : "admin@thulirschool.com";

  try {
    const contentType = request.headers.get("content-type") || "";

    let title = "";
    let eventDate = "";
    let location = "Coimbatore, Tamil Nadu";
    let category = "celebration";
    let summary = "";
    let detailedReport = "";
    let coverImageUrl = "";
    let participantCount: number | undefined = undefined;
    let isPublished = true;
    let isArchived = false;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      title = (formData.get("title") as string || "").trim();
      eventDate = (formData.get("eventDate") as string || "").trim();
      location = (formData.get("location") as string || "Coimbatore, Tamil Nadu").trim();
      category = (formData.get("category") as string || "celebration").trim();
      summary = (formData.get("summary") as string || "").trim();
      detailedReport = (formData.get("detailedReport") as string || "").trim();
      coverImageUrl = (formData.get("coverImageUrl") as string || "").trim();
      isPublished = formData.get("isPublished") !== "false";
      isArchived = formData.get("isArchived") === "true";
      const pCount = formData.get("participantCount");
      if (pCount) participantCount = Number(pCount) || undefined;

      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await uploadImageBuffer(buffer, file.name, "events");
        coverImageUrl = uploadResult.url;
      }
    } else {
      const body = await request.json().catch(() => null);
      if (!body) {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
      }
      title = (body.title || "").trim();
      eventDate = (body.eventDate || "").trim();
      location = (body.location || "Coimbatore, Tamil Nadu").trim();
      category = (body.category || "celebration").trim();
      summary = (body.summary || "").trim();
      detailedReport = (body.detailedReport || "").trim();
      coverImageUrl = (body.coverImageUrl || "").trim();
      participantCount = body.participantCount ? Number(body.participantCount) : undefined;
      isPublished = Boolean(body.isPublished ?? true);
      isArchived = Boolean(body.isArchived ?? false);
    }

    if (!title || !eventDate) {
      return NextResponse.json(
        { error: "Event title and event date are required." },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const eventId = slug || `event-${Date.now()}`;

    const newDoc = await saveEvent({
      id: eventId,
      title,
      slug: eventId,
      eventDate,
      location,
      category,
      summary,
      detailedReport,
      coverImageUrl,
      photos: [],
      participantCount,
      isPublished,
      isArchived,
      createdBy,
    });

    return NextResponse.json({ success: true, event: newDoc }, { status: 201 });
  } catch (error: unknown) {
    console.error("[Admin Events POST Error]:", error);
    return NextResponse.json({ error: "Failed to create event." }, { status: 500 });
  }
}
