import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyAdminSession } from "@/lib/auth/admin";
import { getAdminDb } from "@/lib/firebase/admin";
import { siteConfig } from "@/config/site";
import { FieldValue } from "firebase-admin/firestore";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

const DEFAULT_SETTINGS = {
  organizationName: siteConfig.brand.primaryName,
  primaryPhone: "0422 - 2234210",
  whatsappNumber: "+91 96599 34210",
  contactEmail: "thulirspecialschool@gmail.com",
  updatedAt: new Date().toISOString(),
};

function readLocalSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, "utf8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[Local Settings Read Error]:", err);
  }
  return DEFAULT_SETTINGS;
}

function writeLocalSettings(data: Record<string, unknown>) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("[Local Settings Write Error]:", err);
  }
}

export async function GET() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const local = readLocalSettings();
  const adminDb = getAdminDb();
  if (!adminDb) {
    return NextResponse.json({ settings: local });
  }

  try {
    const doc = await adminDb.collection("settings").doc("general").get();
    if (doc.exists) {
      const data = doc.data();
      return NextResponse.json({ settings: { ...local, ...data } });
    }
    return NextResponse.json({ settings: local });
  } catch (error: unknown) {
    console.warn("[Admin Settings GET Cloud Warning - using local]:", error);
    return NextResponse.json({ settings: local });
  }
}

export async function POST(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const currentLocal = readLocalSettings();
    const updatedSettings = {
      ...currentLocal,
      organizationName: body.organizationName || siteConfig.brand.primaryName,
      primaryPhone: body.primaryPhone !== undefined ? String(body.primaryPhone).trim() : currentLocal.primaryPhone,
      whatsappNumber: body.whatsappNumber !== undefined ? String(body.whatsappNumber).trim() : currentLocal.whatsappNumber,
      contactEmail: body.contactEmail !== undefined ? String(body.contactEmail).trim() : currentLocal.contactEmail,
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.email,
    };

    // 1. Persist locally
    writeLocalSettings(updatedSettings);

    // 2. Dual-write to cloud database if available
    try {
      const adminDb = getAdminDb();
      if (adminDb) {
        await adminDb.collection("settings").doc("general").set(
          {
            ...updatedSettings,
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (cloudErr) {
      console.warn("[Admin Settings Cloud Save Warning]:", cloudErr);
    }

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error: unknown) {
    console.error("[Admin Settings POST Error]:", error);
    return NextResponse.json({ error: "Failed to update settings." }, { status: 500 });
  }
}
