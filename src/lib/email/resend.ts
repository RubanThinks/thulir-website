import "server-only";
import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

export interface SendInquiryEmailParams {
  inquiryId: string;
  parentName: string;
  email: string;
  phone: string;
  preferredBranch: string;
  serviceCategory: string;
  childAge?: string;
  message: string;
}

export interface EmailDispatchResult {
  adminNotificationSent: boolean;
  parentAcknowledgmentSent: boolean;
  error?: string;
}

/**
 * HTML template for the School Administration notification email.
 */
function buildAdminNotificationHtml(params: SendInquiryEmailParams): string {
  const branchLabel =
    params.preferredBranch === "kuniyamuthur"
      ? "Kuniyamuthur Campus"
      : params.preferredBranch === "rathinapuri"
      ? "Main Campus"
      : "Undecided / Open to Both Branches";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Parent Inquiry - Thulir Special School</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F1F4F9; margin: 0; padding: 24px; color: #151515; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; }
    .header { background-color: #101C3A; padding: 28px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; }
    .badge { display: inline-block; background-color: rgba(244, 197, 66, 0.2); color: #F4C542; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; margin-bottom: 8px; }
    .content { padding: 28px 24px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .table td { padding: 10px 12px; border-bottom: 1px solid #F1F4F9; font-size: 14px; }
    .table td.label { font-weight: 600; color: #64748B; width: 35%; }
    .table td.value { color: #101C3A; font-weight: 500; }
    .message-box { margin-top: 20px; padding: 16px; background-color: #FBFBFA; border-radius: 12px; border-left: 4px solid #8F2638; font-size: 14px; line-height: 1.6; color: #2D3748; white-space: pre-wrap; }
    .footer { padding: 20px 24px; background-color: #FBFBFA; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; }
    .btn { display: inline-block; background-color: #8F2638; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 13px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">Inquiry Dispatch</span>
      <h1>New Website Inquiry Received</h1>
      <p style="margin: 6px 0 0; font-size: 12px; color: #F4C542;">Inquiry ID: ${params.inquiryId}</p>
    </div>
    <div class="content">
      <p style="font-size: 14px; line-height: 1.5; color: #2D3748; margin-top: 0;">
        A parent has submitted an admission / therapy inquiry through the Thulir Special School website:
      </p>
      <table class="table">
        <tr>
          <td class="label">Parent / Guardian:</td>
          <td class="value">${params.parentName}</td>
        </tr>
        <tr>
          <td class="label">Email Address:</td>
          <td class="value"><a href="mailto:${params.email}" style="color: #8F2638; text-decoration: none;">${params.email}</a></td>
        </tr>
        <tr>
          <td class="label">Phone Number:</td>
          <td class="value"><a href="tel:${params.phone}" style="color: #101C3A; font-weight: 600;">${params.phone}</a></td>
        </tr>
        <tr>
          <td class="label">Preferred Campus:</td>
          <td class="value">${branchLabel}</td>
        </tr>
        <tr>
          <td class="label">Service / Program:</td>
          <td class="value">${params.serviceCategory}</td>
        </tr>
        ${params.childAge ? `<tr><td class="label">Child Age / Details:</td><td class="value">${params.childAge}</td></tr>` : ""}
      </table>

      <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; margin: 24px 0 6px;">Message / Developmental Notes</h3>
      <div class="message-box">${params.message}</div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="mailto:${params.email}?subject=Re: Inquiry with Thulir Special School (${params.inquiryId})" class="btn">Reply to Parent</a>
      </div>
    </div>
    <div class="footer">
      Thulir Special School &bull; Administrative Control Center &bull; Coimbatore, Tamil Nadu
    </div>
  </div>
</body>
</html>`;
}

/**
 * HTML template for the Parent Acknowledgment email.
 */
function buildParentAcknowledgmentHtml(params: SendInquiryEmailParams): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Thank You for Contacting Thulir Special School</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F1F4F9; margin: 0; padding: 24px; color: #151515; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; }
    .header { background-color: #101C3A; padding: 32px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0 0 6px; font-size: 22px; font-weight: 700; color: #ffffff; }
    .tagline { margin: 0; font-size: 13px; color: #F4C542; }
    .content { padding: 32px 24px; font-size: 14px; line-height: 1.7; color: #2D3748; }
    .highlight-card { background-color: #FDF4F5; border: 1px solid rgba(143, 38, 56, 0.2); border-radius: 12px; padding: 18px; margin: 20px 0; }
    .highlight-title { font-weight: 700; color: #8F2638; font-size: 13px; text-transform: uppercase; margin-bottom: 6px; }
    .branch-card { background-color: #FBFBFA; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px; margin-top: 12px; }
    .footer { padding: 24px; background-color: #FBFBFA; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thulir Special School</h1>
      <p class="tagline">A Place of Training, Therapy and Specialized Education</p>
    </div>
    <div class="content">
      <p style="margin-top: 0;">Dear <strong>${params.parentName}</strong>,</p>
      <p>
        Thank you for reaching out to Thulir Special School. We have received your inquiry regarding <strong>${params.serviceCategory}</strong>.
      </p>

      <div class="highlight-card">
        <div class="highlight-title">What Happens Next?</div>
        <p style="margin: 0; font-size: 13px; color: #151515;">
          Our clinical coordinator and pediatric therapy team will carefully review your child's requirements. We will contact you at <strong>${params.phone}</strong> or by email within <strong>24–48 business hours</strong> to guide you through next steps, answer questions, or schedule an initial assessment.
        </p>
      </div>

      <p style="margin-bottom: 8px;"><strong>Our Coimbatore Campuses:</strong></p>
      <div class="branch-card">
        <strong style="color: #101C3A;">Main Campus</strong><br />
        <span style="font-size: 13px; color: #64748B;">64/S, Aruna Nagar, Near Ponmani Kalyana Mandapam, Nallampalayam, Ganapathy Post, Coimbatore - 641006</span>
      </div>
      <div class="branch-card">
        <strong style="color: #101C3A;">Kuniyamuthur Campus</strong><br />
        <span style="font-size: 13px; color: #64748B;">No. 54, Anamanaicker Street (6th Cross), Park Avenue, Kuniyamuthur, Coimbatore - 641008</span>
      </div>

      <p style="margin-top: 24px; font-size: 13px; color: #64748B;">
        For urgent inquiries, you can reach our helpline directly via WhatsApp or call at <strong>+91 96599 34210</strong> or <strong>0422 - 2234210</strong>.
      </p>
      <p style="margin-bottom: 0;">
        Warm regards,<br />
        <strong>Dr. S. Venkatesan &amp; The Thulir Team</strong><br />
        <span style="font-size: 12px; color: #64748B;">Thulir Educational Trust for Special Needs</span>
      </p>
    </div>
    <div class="footer">
      Thulir Special School &bull; Coimbatore, Tamil Nadu<br />
      Reference ID: <code>${params.inquiryId}</code>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Dispatches both the school administrative notification and the parent acknowledgment email.
 * Gracefully handles email delivery failures without aborting the inquiry transaction.
 */
export async function sendInquiryEmails(
  params: SendInquiryEmailParams
): Promise<EmailDispatchResult> {
  const resend = getResendClient();

  if (!resend) {
    return {
      adminNotificationSent: false,
      parentAcknowledgmentSent: false,
      error: "RESEND_API_KEY is not configured.",
    };
  }

  const senderAddress = process.env.SENDER_EMAIL_ADDRESS || "onboarding@resend.dev";
  const schoolRecipient =
    process.env.CONTACT_NOTIFICATION_EMAIL || "thulirspecialschool@gmail.com";

  let adminNotificationSent = false;
  let parentAcknowledgmentSent = false;
  let lastError: string | undefined;

  // 1. Send Notification to School Administration
  try {
    const adminRes = await resend.emails.send({
      from: `Thulir Special School <${senderAddress}>`,
      to: [schoolRecipient],
      subject: `[New Inquiry] ${params.parentName} - ${params.serviceCategory}`,
      html: buildAdminNotificationHtml(params),
      replyTo: params.email,
    });

    if (adminRes.data?.id) {
      adminNotificationSent = true;
    } else if (adminRes.error) {
      lastError = adminRes.error.message;
      console.warn("[Resend] Admin notification error:", adminRes.error);
    }
  } catch (err: unknown) {
    const message = (err as Error)?.message || "Failed to dispatch admin notification.";
    lastError = message;
    console.warn("[Resend] Admin dispatch failed:", message);
  }

  // 2. Send Acknowledgment to Parent (if parent provided a valid email)
  if (params.email) {
    try {
      const parentRes = await resend.emails.send({
        from: `Thulir Special School <${senderAddress}>`,
        to: [params.email],
        subject: `Thank you for contacting Thulir Special School (${params.inquiryId})`,
        html: buildParentAcknowledgmentHtml(params),
      });

      if (parentRes.data?.id) {
        parentAcknowledgmentSent = true;
      } else if (parentRes.error) {
        console.warn("[Resend] Parent acknowledgment error:", parentRes.error);
      }
    } catch (err: unknown) {
      console.warn("[Resend] Parent dispatch failed:", (err as Error)?.message);
    }
  }

  return {
    adminNotificationSent,
    parentAcknowledgmentSent,
    error: lastError,
  };
}
