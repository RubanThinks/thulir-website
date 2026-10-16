import { NextRequest, NextResponse } from "next/server";
import { inquirySubmissionSchema, sanitizeText } from "@/lib/validations/inquiry";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendInquiryEmails } from "@/lib/email/resend";
import { saveInquiry } from "@/lib/services/inquiries";



/**
 * Generates a human-friendly unique Inquiry ID.
 * Example: THU-261012-A8F2
 */
function generateInquiryId(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `THU-${dateStr}-${randomStr}`;
}

export async function POST(request: NextRequest) {
  try {
    // 1. IP extraction & Durable Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const rateLimit = await checkRateLimit(clientIp, 5, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Too many inquiry submissions from your network. Please wait a few minutes before trying again.",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    const rawBody = await request.json().catch(() => null);
    if (!rawBody) {
      return NextResponse.json(
        { error: "Invalid JSON submission payload." },
        { status: 400 }
      );
    }

    const validation = inquirySubmissionSchema.safeParse(rawBody);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation failed.";
      return NextResponse.json(
        { error: firstError, details: validation.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const input = validation.data;

    // 3. Honeypot Anti-Spam Check
    if (input.botCheck && input.botCheck.length > 0) {
      // Reject bot silently or with generic response
      return NextResponse.json(
        { success: true, message: "Inquiry received." },
        { status: 200 }
      );
    }

    // 4. Sanitize strings
    const sanitizedData = {
      parentName: sanitizeText(input.parentName),
      email: input.email.trim().toLowerCase(),
      phone: sanitizeText(input.phone),
      preferredBranch: input.preferredBranch,
      serviceCategory: sanitizeText(input.serviceCategory),
      childAge: sanitizeText(input.childAge || ""),
      message: sanitizeText(input.message),
    };

    const inquiryId = generateInquiryId();

    // 5. Dispatch Emails via Resend
    let emailResult = { adminNotificationSent: false, parentAcknowledgmentSent: false };
    try {
      emailResult = await sendInquiryEmails({
        inquiryId,
        parentName: sanitizedData.parentName,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        preferredBranch: sanitizedData.preferredBranch,
        serviceCategory: sanitizedData.serviceCategory,
        childAge: sanitizedData.childAge,
        message: sanitizedData.message,
      });
    } catch (emailErr) {
      console.warn("[Inquiry] Email dispatch failed:", emailErr);
    }

    // 6. Persist Inquiry in persistent multi-tier storage (local file + cloud database)
    await saveInquiry({
      id: inquiryId,
      parentName: sanitizedData.parentName,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      preferredBranch: sanitizedData.preferredBranch,
      serviceCategory: sanitizedData.serviceCategory,
      serviceOfInterest: sanitizedData.serviceCategory,
      childAge: sanitizedData.childAge,
      message: sanitizedData.message,
      status: "new",
      internalNotes: [],
      clientIpMasked: clientIp.replace(/\.\d+$/, ".xxx"),
      emailNotificationSentToAdmin: emailResult.adminNotificationSent,
      acknowledgementSentToVisitor: emailResult.parentAcknowledgmentSent,
    });

    // 8. Return Verified Success
    return NextResponse.json(
      {
        success: true,
        inquiryId,
        message: "Your inquiry has been successfully submitted to Thulir Special School.",
        emailDispatched: emailResult.adminNotificationSent,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[Inquiry API Error]", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while saving your inquiry. Please try again or contact us directly.",
      },
      { status: 500 }
    );
  }
}
