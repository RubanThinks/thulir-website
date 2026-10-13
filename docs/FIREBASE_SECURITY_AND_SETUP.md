# Thulir Special School — Firebase Setup & Security Architecture Guide

This document explains the security architecture implemented in **Phase 4A**, clarifies the difference between client-side and server-side Firebase execution, and outlines the required steps to complete in the Firebase Console.

---

## 1. Firebase Access Architecture: Client vs. Server

The application implements a strict two-tier architecture:

```
+-------------------------------------------------------------------+
|                        PUBLIC / BROWSER                           |
|   - Uses browser-safe Firebase Client SDK (src/lib/firebase/client.ts)   |
|   - Bound strictly by Cloud Firestore Security Rules (firestore.rules)   |
|   - Public visitors CANNOT read inquiries, cannot modify site data |
|   - Exposes only public API keys (safe for client inspection)     |
+---------------------------------+---------------------------------+
                                  |
               Authenticates via Email/Password
                                  |
                                  v
+-------------------------------------------------------------------+
|                     NEXT.JS ROUTE HANDLER                         |
|           /api/admin/auth/session (POST / DELETE)                 |
|   - Exchanges client ID token for encrypted session cookie        |
|   - Verifies admin authorization against ADMIN_EMAILS / claims    |
+---------------------------------+---------------------------------+
                                  |
                       Issues __session Cookie
                                  |
                                  v
+-------------------------------------------------------------------+
|                     TRUSTED SERVER ENVIRONMENT                    |
|   - Uses Firebase Admin SDK (src/lib/firebase/admin.ts)           |
|   - Protected by `server-only` (never bundled to browser)         |
|   - Bypasses Firestore client rules with service account privileges|
|   - Enforces business logic, authorization, and data auditing      |
|   - Performs server-side session cookie verification              |
+-------------------------------------------------------------------+
```

### Key Differences

| Feature | Browser-Safe Client (`src/lib/firebase/client.ts`) | Trusted Server Admin (`src/lib/firebase/admin.ts`) |
| :--- | :--- | :--- |
| **SDK** | `firebase` (v13+) | `firebase-admin` (v14+) |
| **Execution Environment** | User's browser / SSR client tree | Node.js Server Only (`import "server-only"`) |
| **Credentials** | `NEXT_PUBLIC_FIREBASE_API_KEY`, etc. | `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY` |
| **Rule Enforcement** | Enforces `firestore.rules` on every operation | Bypasses rules with Service Account permissions |
| **Use Case** | Sign-in form, reading public published items | Session verification, managing inquiries, secure writes |

---

## 2. Firestore Security Rules Summary (`firestore.rules`)

1. **Inquiries (`/inquiries/{inquiryId}`)**:
   - **Create**: Allowed publicly only with valid contact schema (must include `parentName`, `phone`, `email`, `message`, `createdAt`, status must be `'new'`).
   - **Read / List / Update / Delete**: **Strictly Denied** to public visitors. Only authenticated administrators can read or manage inquiries. This guarantees child and family privacy.

2. **Published Content (`/services`, `/gallery`, `/events`)**:
   - **Read**: Publicly accessible if `resource.data.isPublished == true`.
   - **Write**: Restricted exclusively to authenticated administrators (`isAdmin()`).

3. **Student Milestones (`/achievements`)**:
   - **Read**: Publicly accessible only if `isPublished == true` AND `parentConsentApproved == true`. Child protection and parental consent are enforced at the database level.
   - **Write**: Restricted exclusively to administrators.

4. **Catch-All Default Rule**:
   - Any collection or sub-collection not explicitly permitted is blocked by `allow read, write: if false;`.

---

## 3. Administrator Authentication & Authorization Flow

1. **Sign-In**:
   - Administrator navigates to `/admin/login`.
   - Client calls `signInWithEmailAndPassword(auth, email, password)`.
   - Client retrieves short-lived Firebase ID token via `user.getIdToken()`.
2. **Session Exchange**:
   - Client sends token to `/api/admin/auth/session` (POST).
   - Server decodes token using `adminAuth.verifyIdToken(idToken)`.
   - Server verifies authorization:
     - Checks if user has `admin: true` custom claim, OR
     - Checks if user email is present in `ADMIN_EMAILS` environment variable.
   - If unauthorized, returns `403 Forbidden` and invalidates client session.
3. **Session Cookie**:
   - Server creates a 5-day secure session cookie (`adminAuth.createSessionCookie(...)`).
   - Sets HTTP-Only, SameSite=Lax cookie named `__session`.
4. **Route Protection**:
   - In `/admin/(dashboard)/layout.tsx`, `verifyAdminSession()` checks the session on every request.
   - Unauthenticated visitors are redirected to `/admin/login`.
   - Unauthorized users see an explicit Access Denied screen with instructions.
5. **Sign-Out**:
   - Client calls `/api/admin/auth/session` (DELETE) to clear cookie and revoke session.

---

## 4. Manual Firebase Console Setup Checklist

To activate the live administrator login in your project:

### Step 1: Enable Email/Password Sign-In
1. Go to the [Firebase Console](https://console.firebase.google.com/project/thulirschool-dee45/authentication).
2. Navigate to **Build &rarr; Authentication**.
3. Under the **Sign-in method** tab, click **Email/Password**.
4. Enable **Email/Password** and click **Save**.

### Step 2: Create Administrator User
1. In the **Authentication &rarr; Users** tab, click **Add user**.
2. Enter an administrator email (e.g., `admin@thulirschool.com`) and a strong password.
3. Click **Add user**.

### Step 3: Configure Authorized Admin Emails
In your `.env.local` (and your production deployment environment):
```bash
ADMIN_EMAILS=admin@thulirschool.com
```

### Step 4: Generate Service Account Key (Firebase Admin SDK)
1. In Firebase Console, click the Gear icon &rarr; **Project settings**.
2. Open the **Service accounts** tab.
3. Click **Generate new private key** and confirm.
4. Open the downloaded JSON file and copy the values into `.env.local`:
   ```bash
   FIREBASE_ADMIN_PROJECT_ID=thulirschool-dee45
   FIREBASE_ADMIN_CLIENT_EMAIL="firebase-adminsdk-xxxxx@thulirschool-dee45.iam.gserviceaccount.com"
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgk...-----END PRIVATE KEY-----\n"
   ```

### Step 5: Deploy Firestore Security Rules
1. In Firebase Console, go to **Build &rarr; Firestore Database &rarr; Rules**.
2. Copy the contents of `firestore.rules` and click **Publish**, OR deploy via Firebase CLI:
   ```bash
   firebase deploy --only firestore:rules
   ```

---

## 5. Security Guarantees & Constraints Met

- [x] No public user registration forms.
- [x] No hardcoded passwords in client or server code.
- [x] Server-side session verification via HTTP-Only cookies.
- [x] Separation of client SDK from server Admin SDK using `server-only`.
- [x] Sensitive service account keys strictly stored in server environment variables.
- [x] Child data protection with consent checks and protected inquiries collection.
