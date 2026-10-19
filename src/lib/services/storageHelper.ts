import "server-only";
import fs from "fs";
import path from "path";
import os from "os";

/**
 * Helper to detect if we are running in a serverless platform (e.g. Vercel, AWS Lambda)
 * where the application deployment directory is strictly read-only (EROFS).
 */
export function isServerlessEnvironment(): boolean {
  return Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NETLIFY ||
    process.env.NODE_ENV === "production" && !process.env.ENABLE_LOCAL_STORAGE_WRITE
  );
}

/**
 * Returns the directory path safe for reading/writing in the current runtime.
 */
function getStoragePaths(filename: string): { localPath: string; tmpPath: string } {
  const localPath = path.join(process.cwd(), "src", "data", filename);
  const tmpDir = path.join(os.tmpdir(), "thulir-storage");
  const tmpPath = path.join(tmpDir, filename);
  return { localPath, tmpPath };
}

/**
 * Safely reads JSON from disk:
 * 1. Checks serverless /tmp cache if running on Vercel.
 * 2. Checks local src/data/<filename> if available.
 * 3. Falls back to statically-bundled JSON data if disk read is unavailable or fails.
 */
export function readJsonSafe<T>(filename: string, fallbackData: T): T {
  const { localPath, tmpPath } = getStoragePaths(filename);

  // 1. If running on Vercel/serverless, check if an updated copy exists in /tmp
  if (isServerlessEnvironment()) {
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ tmpPath)) {
        const raw = fs.readFileSync(/*turbopackIgnore: true*/ tmpPath, "utf8");
        const parsed = JSON.parse(raw);
        if (parsed !== undefined && parsed !== null) {
          return parsed as T;
        }
      }
    } catch {
      // Fall through to localPath or fallbackData
    }
  }

  // 2. Check local file if accessible
  try {
    if (fs.existsSync(/*turbopackIgnore: true*/ localPath)) {
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ localPath, "utf8");
      const parsed = JSON.parse(raw);
      if (parsed !== undefined && parsed !== null) {
        return parsed as T;
      }
    }
  } catch {
    // Expected on read-only environments when file wasn't standalone-traced
  }

  // 3. Fallback to bundled seed data
  return fallbackData;
}

/**
 * Safely writes JSON data to disk:
 * - If running locally: writes to src/data/<filename>.
 * - If running on Vercel or if write fails (EROFS): writes to /tmp/thulir-storage/<filename>.
 * Guaranteed NEVER to crash with EROFS: read-only file system.
 */
export function writeJsonSafe<T>(filename: string, data: T): void {
  const { localPath, tmpPath } = getStoragePaths(filename);

  // Try writing to local repo directory first (works in local dev)
  if (!isServerlessEnvironment()) {
    try {
      const localDir = path.dirname(localPath);
      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
      }
      fs.writeFileSync(localPath, JSON.stringify(data, null, 2), "utf8");
      return;
    } catch (localErr) {
      console.warn(`[storageHelper] Could not write to ${localPath}, falling back to tmp:`, localErr);
    }
  }

  // Fallback for Vercel / serverless: write to /tmp
  try {
    const tmpDir = path.dirname(tmpPath);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf8");
  } catch (tmpErr) {
    console.error(`[storageHelper] Failed to write to tmp file ${tmpPath}:`, tmpErr);
  }
}
