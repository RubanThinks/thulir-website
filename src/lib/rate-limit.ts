import "server-only";
import crypto from "crypto";
import { getAdminDb } from "./firebase/admin";

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

// In-memory fallback cache if Firestore is unreachable
const memoryFallbackCache = new Map<string, { count: number; resetAt: number }>();

/**
 * Anonymizes the client IP address using SHA-256 hash.
 */
function hashIdentifier(identifier: string): string {
  return crypto.createHash("sha256").update(identifier).digest("hex");
}

/**
 * Checks and increments rate limiting for a given identifier.
 * Uses Firestore `_rate_limits` collection for persistence across serverless executions.
 *
 * @param identifier Client IP address or request fingerprint
 * @param limit Max requests allowed within window (default: 5)
 * @param windowMs Time window in milliseconds (default: 10 minutes)
 */
export async function checkRateLimit(
  identifier: string,
  limit = 5,
  windowMs = 10 * 60 * 1000
): Promise<RateLimitResult> {
  const now = Date.now();
  const resetAt = now + windowMs;
  const key = hashIdentifier(identifier || "anonymous-client");

  const adminDb = getAdminDb();

  // Primary: Durable Cloud Firestore rate limiting
  if (adminDb) {
    try {
      const docRef = adminDb.collection("_rate_limits").doc(key);
      const snapshot = await docRef.get();

      if (!snapshot.exists) {
        await docRef.set({
          count: 1,
          resetAt: resetAt,
          updatedAt: now,
        });

        return {
          success: true,
          limit,
          remaining: limit - 1,
          resetAt,
        };
      }

      const data = snapshot.data();
      const existingResetAt = data?.resetAt || 0;
      const currentCount = data?.count || 0;

      // Window expired -> Reset
      if (now > existingResetAt) {
        await docRef.set({
          count: 1,
          resetAt: resetAt,
          updatedAt: now,
        });

        return {
          success: true,
          limit,
          remaining: limit - 1,
          resetAt,
        };
      }

      // Within window: check if exceeded
      if (currentCount >= limit) {
        return {
          success: false,
          limit,
          remaining: 0,
          resetAt: existingResetAt,
        };
      }

      // Increment count
      await docRef.update({
        count: currentCount + 1,
        updatedAt: now,
      });

      return {
        success: true,
        limit,
        remaining: limit - (currentCount + 1),
        resetAt: existingResetAt,
      };
    } catch {
      // If Firestore read fails, fall back to memory
    }
  }

  // Fallback: In-memory rate limiting
  const memEntry = memoryFallbackCache.get(key);
  if (!memEntry || now > memEntry.resetAt) {
    memoryFallbackCache.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetAt,
    };
  }

  if (memEntry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetAt: memEntry.resetAt,
    };
  }

  memEntry.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - memEntry.count,
    resetAt: memEntry.resetAt,
  };
}
