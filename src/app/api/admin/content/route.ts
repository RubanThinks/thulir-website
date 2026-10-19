import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyAdminSession } from "@/lib/auth/admin";
import { getAdminDb } from "@/lib/firebase/admin";
import { siteConfig } from "@/config/site";
import { FieldValue } from "firebase-admin/firestore";

import { readJsonSafe, writeJsonSafe } from "@/lib/services/storageHelper";

interface SiteSettingsData {
  organizationName: string;
  primaryPhone: string;
  whatsappNumber: string;
  contactEmail: string;
  updatedAt?: string;
  updatedBy?: string;
}

const defaultSettings: SiteSettingsData = {
  organizationName: siteConfig.brand.primaryName,
  primaryPhone: siteConfig.contact.phone,
  whatsappNumber: siteConfig.contact.whatsappNumber,
  contactEmail: siteConfig.contact.email,
};

let memorySettings: SiteSettingsData | null = null;

function readLocalSettings(): SiteSettingsData {
  if (memorySettings) return memorySettings;
  const data = readJsonSafe<SiteSettingsData>("settings.json", defaultSettings);
  memorySettings = data || defaultSettings;
  return memorySettings;
}

function writeLocalSettings(data: SiteSettingsData): void {
  memorySettings = data;
  writeJsonSafe("settings.json", data);
}

export async function GET() {
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
  const session = await verifyAdminSession().catch(() => null);
  const updatedBy =
    session && session.authenticated && session.user?.email
      ? session.user.email
      : "admin@thulirschool.com";

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
      updatedBy,
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
