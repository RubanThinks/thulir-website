import "server-only";
import type { App } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";

const ADMIN_APP_NAME = "thulir-admin-app";

export function isAdminConfigured(): boolean {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  return Boolean(projectId && clientEmail && privateKey);
}

/**
 * Normalizes private key formatting from env vars (e.g. escaped newlines).
 */
function getFormattedPrivateKey(rawKey?: string): string | undefined {
  if (!rawKey) return undefined;
  return rawKey.replace(/\\n/g, "\n");
}

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

export function getAdminApp(): App | null {
  if (!isAdminConfigured()) return null;
  if (adminApp) return adminApp;

  try {
    // Dynamically require only when credentials are provided
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { initializeApp, getApps, cert } = require("firebase-admin/app");
    const existingApps = getApps();
    const existingNamedApp = existingApps.find((app: { name: string }) => app.name === ADMIN_APP_NAME);
    if (existingNamedApp) {
      adminApp = existingNamedApp;
      return adminApp;
    }

    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const rawPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    const privateKey = getFormattedPrivateKey(rawPrivateKey);

    if (!projectId || !clientEmail || !privateKey) {
      return null;
    }

    adminApp = initializeApp(
      {
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        projectId,
      },
      ADMIN_APP_NAME
    );
    return adminApp;
  } catch (error) {
    console.warn("[Firebase Admin Optional SDK]:", error);
    return null;
  }
}

export function getAdminAuth(): Auth | null {
  if (!isAdminConfigured()) return null;
  if (adminAuth) return adminAuth;
  const app = getAdminApp();
  if (!app) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getAuth } = require("firebase-admin/auth");
    adminAuth = getAuth(app);
    return adminAuth;
  } catch {
    return null;
  }
}

export function getAdminDb(): Firestore | null {
  if (!isAdminConfigured()) return null;
  if (adminDb) return adminDb;
  const app = getAdminApp();
  if (!app) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getFirestore } = require("firebase-admin/firestore");
    adminDb = getFirestore(app);
    return adminDb;
  } catch {
    return null;
  }
}
