import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin";
import { getAdminDb } from "@/lib/firebase/admin";

export const instant = false;

interface AdminInquiryRecord {
  id: string;
  parentName?: string;
  email?: string;
  phone?: string;
  preferredBranch?: string;
  serviceCategory?: string;
  serviceOfInterest?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const searchQuery = searchParams.get("search")?.toLowerCase().trim();
    const branchFilter = searchParams.get("branch");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") || "15", 10)));

    let allDocs: AdminInquiryRecord[] = [];

    const adminDb = getAdminDb();
    if (adminDb) {
      const snapshot = await adminDb
        .collection("inquiries")
        .orderBy("createdAt", "desc")
        .get();

      allDocs = snapshot.docs.map((doc) => {
        const data = doc.data() as Record<string, any>;
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
        };
      });
    } else {
      // Fallback via Firestore REST API
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "thulirschool-dee45";
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      try {
        const restRes = await fetch(
          `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/inquiries?key=${apiKey}`,
          { cache: "no-store" }
        );
        if (restRes.ok) {
          const restJson = await restRes.json();
          const rawDocs = restJson.documents || [];
          allDocs = rawDocs.map((d: any) => {
            const fields = d.fields || {};
            const parseField = (val: any) => {
              if (!val) return "";
              return val.stringValue || val.integerValue || val.timestampValue || "";
            };
            const docId = d.name ? d.name.split("/").pop() : "";
            return {
              id: parseField(fields.id) || docId,
              parentName: parseField(fields.parentName),
              email: parseField(fields.email),
              phone: parseField(fields.phone),
              preferredBranch: parseField(fields.preferredBranch),
              serviceOfInterest: parseField(fields.serviceOfInterest),
              childAge: parseField(fields.childAge),
              message: parseField(fields.message),
              status: parseField(fields.status) || "new",
              createdAt: parseField(fields.createdAt) || new Date().toISOString(),
              updatedAt: parseField(fields.updatedAt) || new Date().toISOString(),
            };
          });
        }
      } catch (restErr) {
        console.warn("[Admin Inquiries] Firestore REST query fallback:", restErr);
      }
    }

    // Counts across all records
    const counts = {
      total: allDocs.length,
      new: allDocs.filter((d) => d.status === "new").length,
      inReview: allDocs.filter((d) => d.status === "in_review").length,
      contacted: allDocs.filter((d) => d.status === "contacted").length,
      scheduled: allDocs.filter((d) => d.status === "scheduled_assessment").length,
      archived: allDocs.filter((d) => d.status === "archived").length,
    };

    // Filter by status
    if (statusFilter && statusFilter !== "all") {
      allDocs = allDocs.filter((d) => d.status === statusFilter);
    }

    // Filter by branch
    if (branchFilter && branchFilter !== "all") {
      allDocs = allDocs.filter((d) => d.preferredBranch === branchFilter);
    }

    // Filter by search term
    if (searchQuery) {
      allDocs = allDocs.filter((d) => {
        return (
          d.parentName?.toLowerCase().includes(searchQuery) ||
          d.email?.toLowerCase().includes(searchQuery) ||
          d.phone?.toLowerCase().includes(searchQuery) ||
          d.id?.toLowerCase().includes(searchQuery) ||
          d.serviceOfInterest?.toLowerCase().includes(searchQuery)
        );
      });
    }

    // Pagination
    const totalFiltered = allDocs.length;
    const startIndex = (page - 1) * limit;
    const paginatedDocs = allDocs.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      inquiries: paginatedDocs,
      counts,
      pagination: {
        page,
        limit,
        totalItems: totalFiltered,
        totalPages: Math.ceil(totalFiltered / limit) || 1,
      },
    });
  } catch (error: unknown) {
    console.error("[Admin Inquiries GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries from database." },
      { status: 500 }
    );
  }
}
