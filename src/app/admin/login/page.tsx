"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseClientConfigured } from "@/lib/firebase/client";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Loader2,
  School,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clientConfigured = isFirebaseClientConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email address and password.");
      return;
    }

    if (!auth) {
      setErrorMessage(
        "Firebase Client authentication is not initialized. Please ensure NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID are configured in .env.local."
      );
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate with Firebase Client SDK
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await userCredential.user.getIdToken();

      // 2. Exchange ID token for secure, server-side HTTP-only session cookie
      const response = await fetch("/api/admin/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Sign out client instance if server session creation failed
        await auth.signOut().catch(() => {});

        if (response.status === 403) {
          setErrorMessage(
            "Access Denied: Your account is verified in Firebase, but it is not on the list of authorized administrators for Thulir Special School."
          );
        } else if (response.status === 503) {
          setErrorMessage(
            data.error ||
              "Server-side Firebase Admin credentials are not yet configured. Please add the Firebase Service Account key to .env.local."
          );
        } else {
          setErrorMessage(data.error || "Authentication failed. Please check your credentials.");
        }
        setLoading(false);
        return;
      }

      // 3. Successful authentication: navigate to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      const authErr = err as { code?: string; message?: string };
      let message = "An unexpected error occurred during sign-in. Please try again.";

      if (authErr.code === "auth/invalid-credential" || authErr.code === "auth/wrong-password" || authErr.code === "auth/user-not-found") {
        message = "Invalid email or password. Please verify your credentials.";
      } else if (authErr.code === "auth/too-many-requests") {
        message = "Too many failed attempts. Access temporarily locked for security. Please try again later.";
      } else if (authErr.code === "auth/network-request-failed") {
        message = "Network error. Please check your internet connection.";
      } else if (authErr.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (authErr.message) {
        message = authErr.message;
      }

      setErrorMessage(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-[#101C3A]/5 via-[#FBFBFA] to-[#F1F4F9]">
      {/* Top Brand Bar */}
      <div className="w-full max-w-md mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#101C3A] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Return to Public Website</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#101C3A]/5 text-[#101C3A]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8F2638]" />
          Admin Portal
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-[#101C3A]/5 border border-[#E2E8F0] overflow-hidden">
        {/* Card Header */}
        <div className="bg-[#101C3A] text-white p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F4C542_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 text-[#F4C542]">
              <School className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-[var(--font-heading)]">
              Thulir Special School
            </h1>
            <p className="text-sm text-white/80 mt-1">
              Administrative & Content Management Portal
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-8">
          {!clientConfigured && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-950">Firebase Config Pending</p>
                <p className="mt-0.5">
                  Client environment variables are not detected. Verify that{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px]">.env.local</code>{" "}
                  is populated with your project keys.
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs leading-relaxed flex items-start gap-3 animate-in fade-in duration-200"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#2D3748] mb-1.5"
              >
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@thulirschool.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FBFBFA] border border-[#E2E8F0] rounded-xl text-sm text-[#151515] placeholder:text-[#64748B]/60 focus:outline-none focus:ring-2 focus:ring-[#101C3A]/20 focus:border-[#101C3A] transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#2D3748] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-[#FBFBFA] border border-[#E2E8F0] rounded-xl text-sm text-[#151515] placeholder:text-[#64748B]/60 focus:outline-none focus:ring-2 focus:ring-[#101C3A]/20 focus:border-[#101C3A] transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#101C3A] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#8F2638] hover:bg-[#A83246] active:bg-[#6B1C2A] text-white font-medium text-sm rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-center">
            <p className="text-xs text-[#64748B] leading-relaxed">
              <strong className="text-[#2D3748]">Restricted Access:</strong> Public visitor
              registration is disabled. Administrative accounts are provisioned exclusively by Thulir
              Trust administration.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <p className="mt-8 text-xs text-[#64748B] text-center">
        Thulir Educational Trust for Special Needs &bull; Secure Administrator Session
      </p>
    </div>
  );
}
