import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin";
import {
  getEventById,
  updateEventRecord,
  deleteEventRecord,
} from "@/lib/services/events";
import { uploadImageBuffer } from "@/lib/cloudinary/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await context.params;
  const event = await getEventById(id);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  return NextResponse.json({ event });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const existing = await getEventById(id);
    if (!existing) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (formData.has("title")) updates.title = (formData.get("title") as string).trim();
      if (formData.has("eventDate")) updates.eventDate = (formData.get("eventDate") as string).trim();
      if (formData.has("location")) updates.location = (formData.get("location") as string).trim();
      if (formData.has("category")) updates.category = (formData.get("category") as string).trim();
      if (formData.has("summary")) updates.summary = (formData.get("summary") as string).trim();
      if (formData.has("detailedReport")) updates.detailedReport = (formData.get("detailedReport") as string).trim();
      if (formData.has("coverImageUrl")) updates.coverImageUrl = (formData.get("coverImageUrl") as string).trim();
      if (formData.has("isPublished")) updates.isPublished = formData.get("isPublished") === "true";
      if (formData.has("isArchived")) updates.isArchived = formData.get("isArchived") === "true";
      if (formData.has("participantCount")) {
        const p = formData.get("participantCount");
        updates.participantCount = p ? Number(p) || 0 : undefined;
      }

      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await uploadImageBuffer(buffer, file.name, "events");
        updates.coverImageUrl = uploadResult.url;
      }
    } else {
      const body = await request.json().catch(() => null);
      if (!body) {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
      }

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
    }

    const updated = await updateEventRecord(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Event updated successfully.", event: updated });
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

  try {
    const success = await deleteEventRecord(id);
    if (!success) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Event deleted successfully." });
  } catch (error: unknown) {
    console.error("[Admin Events DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete event." }, { status: 500 });
  }
}
