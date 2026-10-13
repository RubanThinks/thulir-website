import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Public, browser-safe Firebase Client Configuration.
 * Note: Never store service account keys or private credentials here.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Check if the required Firebase client environment variables are provided.
 */
export function isFirebaseClientConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (typeof window !== "undefined" || isFirebaseClientConfigured()) {
  try {
    if (getApps().length > 0) {
      app = getApp();
    } else if (isFirebaseClientConfigured()) {
      app = initializeApp(firebaseConfig);
    }

    if (app) {
      auth = getAuth(app);
      db = getFirestore(app);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Firebase Client] Initialization deferred or failed:", error);
    }
  }
}

export { app, auth, db };
export default app;
