import "server-only";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Server-only Firebase Admin SDK initialization.
 * This file MUST NOT be imported into client components.
 */

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
  // If the key has escaped newlines like \n, convert them to actual newlines
  return rawKey.replace(/\\n/g, "\n");
}

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

export function getAdminApp(): App | null {
  if (adminApp) return adminApp;

  const existingApps = getApps();
  const existingNamedApp = existingApps.find((app) => app.name === ADMIN_APP_NAME);
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

  try {
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
    console.error("[Firebase Admin] Initialization failed:", error);
    return null;
  }
}

export function getAdminAuth(): Auth | null {
  if (adminAuth) return adminAuth;
  const app = getAdminApp();
  if (!app) return null;
  adminAuth = getAuth(app);
  return adminAuth;
}

export function getAdminDb(): Firestore | null {
  if (adminDb) return adminDb;
  const app = getAdminApp();
  if (!app) return null;
  adminDb = getFirestore(app);
  return adminDb;
}
