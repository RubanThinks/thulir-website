import { NextRequest, NextResponse } from "next/server";
import { generateUploadSignature } from "@/lib/cloudinary/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const folder = body.folder || "thulir/gallery";

  const signatureData = generateUploadSignature(folder);
  if (!signatureData) {
    return NextResponse.json(
      {
        error:
          "Cloudinary credentials not configured. Please ensure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json(signatureData);
}
