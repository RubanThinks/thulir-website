import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin";
import { getAdminDb } from "@/lib/firebase/admin";
import { siteConfig } from "@/config/site";
import { FieldValue } from "firebase-admin/firestore";



export async function GET() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const adminDb = getAdminDb();
  if (!adminDb) {
    return NextResponse.json({
      settings: {
        organizationName: siteConfig.brand.primaryName,
        primaryPhone: "+91 97901 81890",
        whatsappNumber: "+91 97901 81890",
        contactEmail: "thulirspecialschool@gmail.com",
        announcementBanner: {
          isActive: false,
          text: "",
          linkUrl: "",
        },
        heroHeading: "Specialized Pediatric Care & Education",
        heroSubheading: "Empowering children with autism, developmental delays, and sensory processing needs.",
      },
    });
  }

  try {
    const doc = await adminDb.collection("settings").doc("general").get();
    if (!doc.exists) {
      const defaultSettings = {
        organizationName: siteConfig.brand.primaryName,
        primaryPhone: "+91 97901 81890",
        whatsappNumber: "+91 97901 81890",
        contactEmail: "thulirspecialschool@gmail.com",
        announcementBanner: {
          isActive: false,
          text: "",
          linkUrl: "",
        },
        heroHeading: "Specialized Pediatric Care & Education",
        heroSubheading: "Empowering children with autism, developmental delays, and sensory processing needs.",
        updatedAt: new Date().toISOString(),
      };
      return NextResponse.json({ settings: defaultSettings });
    }

    const data = doc.data();
    return NextResponse.json({ settings: data });
  } catch (error: unknown) {
    console.error("[Admin Settings GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve settings." }, { status: 500 });
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
    if (!body) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const docRef = adminDb.collection("settings").doc("general");

    const settingsDoc = {
      organizationName: body.organizationName || siteConfig.brand.primaryName,
      primaryPhone: (body.primaryPhone || "").trim(),
      whatsappNumber: (body.whatsappNumber || "").trim(),
      contactEmail: (body.contactEmail || "").trim(),
      announcementBanner: {
        isActive: Boolean(body.announcementBanner?.isActive),
        text: (body.announcementBanner?.text || "").trim(),
        linkUrl: (body.announcementBanner?.linkUrl || "").trim(),
      },
      heroHeading: (body.heroHeading || "").trim(),
      heroSubheading: (body.heroSubheading || "").trim(),
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: session.user.email,
    };

    await docRef.set(settingsDoc, { merge: true });

    return NextResponse.json({ success: true, settings: settingsDoc });
  } catch (error: unknown) {
    console.error("[Admin Settings POST Error]:", error);
    return NextResponse.json({ error: "Failed to update settings." }, { status: 500 });
  }
}
