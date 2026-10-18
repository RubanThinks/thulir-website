import "server-only";
import { v2 as cloudinary } from "cloudinary";

const DEFAULT_CLOUD_NAME = "nwcmxpt4";
const DEFAULT_API_KEY = "631151963588963";
const DEFAULT_API_SECRET = "IUlSwY56-iviLvW5Nzewf5Pc4rU";

export function getCloudinaryConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY || DEFAULT_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET || DEFAULT_API_SECRET;
  return { cloudName, apiKey, apiSecret };
}

function initCloudinary() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

// Initialize on module load
initCloudinary();

export function isCloudinaryConfigured(): boolean {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  return Boolean(cloudName && apiKey && apiSecret);
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
 */
export function generateUploadSignature(
  folder = "thulir/gallery"
): CloudinarySignatureResult | null {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

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
 * Uploads to Cloudinary, with resilient base64 Data URI fallback.
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  originalFilename = "image.jpg",
  subfolder = "gallery"
): Promise<{ url: string; publicId: string }> {
  initCloudinary();

  const lowerName = originalFilename.toLowerCase();
  let mime = "image/jpeg";
  if (lowerName.endsWith(".png")) mime = "image/png";
  else if (lowerName.endsWith(".webp")) mime = "image/webp";
  else if (lowerName.endsWith(".gif")) mime = "image/gif";
  else if (lowerName.endsWith(".svg")) mime = "image/svg+xml";

  const base64 = buffer.toString("base64");
  const dataUri = `data:${mime};base64,${base64}`;

  // 1. Try Cloudinary upload
  try {
    const res = await cloudinary.uploader.upload(dataUri, {
      folder: `thulir/${subfolder}`,
      resource_type: "image",
    });

    if (res && res.secure_url) {
      return {
        url: res.secure_url,
        publicId: res.public_id || "",
      };
    }
  } catch (err) {
    console.warn("[Cloudinary Media Upload Warning - falling back to resilient storage]:", err);
  }

  // 2. Local storage write if filesystem is writable
  try {
    const fs = await import("fs");
    const path = await import("path");
    const uploadsDir = path.join(process.cwd(), "public", "uploads", subfolder);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeName = `${Date.now()}-${originalFilename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, buffer);

    return {
      url: `/uploads/${subfolder}/${safeName}`,
      publicId: "",
    };
  } catch {
    // 3. 100% resilient fallback for read-only environments (e.g. Vercel)
    return {
      url: dataUri,
      publicId: "",
    };
  }
}

/**
 * Deletes an asset from Cloudinary by its public ID.
 */
export async function deleteCloudinaryAsset(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured() || !publicId) return false;

  initCloudinary();
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (err) {
    console.warn("[Media Asset Delete Error]:", err);
    return false;
  }
}
