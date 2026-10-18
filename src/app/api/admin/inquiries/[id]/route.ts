import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin";
import {
  getInquiryById,
  updateInquiryRecord,
  deleteInquiryRecord,
} from "@/lib/services/inquiries";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const inquiry = await getInquiryById(id);
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    return NextResponse.json({ inquiry });
  } catch (error: unknown) {
    console.error("[Admin Inquiries GET ID Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve inquiry." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await verifyAdminSession().catch(() => null);
  const { id } = await context.params;

  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const updates: {
      status?: "new" | "in_review" | "contacted" | "scheduled_assessment" | "archived";
      newNote?: string;
    } = {};

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
        const timestampStr = new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        });
        const author =
          session && session.authenticated && session.user?.email
            ? session.user.email
            : "Admin";
        updates.newNote = `[${timestampStr} by ${author}]: ${noteText}`;
      }
    }

    const updated = await updateInquiryRecord(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry updated successfully.",
      inquiry: updated,
    });
  } catch (error: unknown) {
    console.error("[Admin Inquiries PATCH Error]:", error);
    return NextResponse.json({ error: "Failed to update inquiry." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const success = await deleteInquiryRecord(id);
    if (!success) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Inquiry deleted successfully." });
  } catch (error: unknown) {
    console.error("[Admin Inquiries DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete inquiry." }, { status: 500 });
  }
}
