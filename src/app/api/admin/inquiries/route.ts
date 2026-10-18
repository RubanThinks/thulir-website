import { NextRequest, NextResponse } from "next/server";
import { getInquiriesList } from "@/lib/services/inquiries";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get("status") || undefined;
    const searchQuery = searchParams.get("search") || undefined;
    const branchFilter = searchParams.get("branch") || undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") || "15", 10)));

    const result = await getInquiriesList({
      status: statusFilter,
      branch: branchFilter,
      search: searchQuery,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    if ((error as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("[Admin Inquiries GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries from database." },
      { status: 500 }
    );
  }
}
