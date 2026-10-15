import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

export interface CloudinarySignatureResult {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}

/**
 * Generates an authorized upload signature on the server.
 * The secret is NEVER exposed to browser code.
 */
export function generateUploadSignature(
  folder = "thulir/gallery"
): CloudinarySignatureResult | null {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    apiSecret
  );

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
  };
}

/**
 * Uploads an image buffer directly via server SDK.
 * Falls back to local public upload storage if external media service is unavailable.
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  originalFilename = "image.jpg"
): Promise<{ url: string; publicId: string }> {
  // 1. Try Cloudinary upload if configured
  if (isCloudinaryConfigured()) {
    try {
      const base64 = buffer.toString("base64");
      const mime = originalFilename.endsWith(".png")
        ? "image/png"
        : originalFilename.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg";
      const dataUri = `data:${mime};base64,${base64}`;

      const res = await cloudinary.uploader.upload(dataUri, {
        folder: "thulir/gallery",
        resource_type: "image",
      });

      if (res && res.secure_url) {
        return {
          url: res.secure_url,
          publicId: res.public_id || "",
        };
      }
    } catch (err) {
      console.warn("[Media Cloud Upload Error - falling back to local storage]:", err);
    }
  }

  // 2. Reliable Local Storage Fallback
  const fs = await import("fs");
  const path = await import("path");
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "gallery");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const safeName = `${Date.now()}-${originalFilename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = path.join(uploadsDir, safeName);
  fs.writeFileSync(filePath, buffer);

  return {
    url: `/uploads/gallery/${safeName}`,
    publicId: "",
  };
}

/**
 * Deletes an asset from Cloudinary by its public ID.
 */
export async function deleteCloudinaryAsset(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured() || !publicId) return false;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (err) {
    console.warn("[Media Asset Delete Error]:", err);
    return false;
  }
}
