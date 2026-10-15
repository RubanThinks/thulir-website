import { NextRequest, NextResponse } from "next/server";
import { getGalleryItems } from "@/lib/services/gallery";

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category") || undefined;
    const items = await getGalleryItems(category, true);
    return NextResponse.json({ items });
  } catch (error: unknown) {
    if ((error as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("[Public Gallery GET Error]:", error);
    return NextResponse.json({ items: [] });
  }
}
