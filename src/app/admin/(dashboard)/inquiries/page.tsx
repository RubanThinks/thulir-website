"use client";

import React, { useState, useEffect } from "react";
import {
  Inbox,
  Search,
  RefreshCw,
  Phone,
  Mail,
  AlertCircle,
  Trash2,
  X,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

interface InquiryItem {
  id: string;
  parentName: string;
  email: string;
  phone: string;
  preferredBranch: string;
  serviceOfInterest: string;
  childAge?: string;
  message: string;
  status: "new" | "in_review" | "contacted" | "scheduled_assessment" | "archived";
  internalNotes?: string[];
  createdAt: string;
  emailNotificationSentToAdmin?: boolean;
  acknowledgementSentToVisitor?: boolean;
}

interface Counts {
  total: number;
  new: number;
  inReview: number;
  contacted: number;
  scheduled: number;
  archived: number;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [counts, setCounts] = useState<Counts>({
    total: 0,
    new: 0,
    inReview: 0,
    contacted: 0,
    scheduled: 0,
    archived: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Detail Modal / Drawer
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (branchFilter !== "all") params.append("branch", branchFilter);
      if (searchTerm.trim()) params.append("search", searchTerm.trim());
      params.append("page", page.toString());
      params.append("limit", "15");

      const res = await fetch(`/api/admin/inquiries?${params.toString()}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to load inquiries.");
      }
      const data = await res.json();
      setInquiries(data.inquiries || []);
      setCounts(
        data.counts || { total: 0, new: 0, inReview: 0, contacted: 0, scheduled: 0, archived: 0 }
      );
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.totalItems || 0);
    } catch (err: unknown) {
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.append("status", statusFilter);
        if (branchFilter !== "all") params.append("branch", branchFilter);
        if (searchTerm.trim()) params.append("search", searchTerm.trim());
        params.append("page", page.toString());
        params.append("limit", "15");

        const res = await fetch(`/api/admin/inquiries?${params.toString()}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load inquiries.");
        }
        const data = await res.json();
        if (active) {
          setInquiries(data.inquiries || []);
          setCounts(
            data.counts || { total: 0, new: 0, inReview: 0, contacted: 0, scheduled: 0, archived: 0 }
          );
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalItems(data.pagination?.totalItems || 0);
        }
      } catch (err: unknown) {
        if (active) setError((err as Error).message || "An unexpected error occurred.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [statusFilter, branchFilter, searchTerm, page]);

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status.");

      // Refresh list and selected inquiry
      await fetchInquiries();
      if (selectedInquiry && selectedInquiry.id === inquiryId) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus as InquiryItem["status"] } : null));
      }
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNote = async (inquiryId: string) => {
    if (!noteInput.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newNote: noteInput.trim() }),
      });
      if (!res.ok) throw new Error("Failed to add note.");

      setNoteInput("");
      await fetchInquiries();
      // Fetch fresh detail
      const detailRes = await fetch(`/api/admin/inquiries/${inquiryId}`);
      if (detailRes.ok) {
        const detailData = await detailRes.json();
        setSelectedInquiry(detailData.inquiry);
      }
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (inquiryId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete inquiry.");

      setDeleteConfirmId(null);
      if (selectedInquiry?.id === inquiryId) setSelectedInquiry(null);
      await fetchInquiries();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">New</span>;
      case "in_review":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">In Review</span>;
      case "contacted":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">Contacted</span>;
      case "scheduled_assessment":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Assessment Scheduled</span>;
      case "archived":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">Archived</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#101C3A] font-[var(--font-heading)] flex items-center gap-2">
            <Inbox className="w-6 h-6 text-[#8F2638]" />
            Inquiries &amp; Admissions
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Review parent submissions, schedule assessments, and maintain confidential child intake records.
          </p>
        </div>

        <button
          onClick={() => fetchInquiries()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E2E8F0] text-[#2D3748] hover:bg-[#F1F4F9] transition shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Total</div>
          <div className="text-2xl font-bold text-[#101C3A] mt-1">{counts.total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-100 bg-blue-50/20 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800">New</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{counts.new}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-100 bg-amber-50/20 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">In Review</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{counts.inReview}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-purple-100 bg-purple-50/20 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-800">Contacted</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">{counts.contacted}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 shadow-2xs col-span-2 sm:col-span-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Scheduled</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{counts.scheduled}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by parent, email, phone, ID..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-[#FBFBFA] border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A] text-[#151515]"
          />
        </div>

        {/* Filter Tabs & Branch Selector */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={branchFilter}
            onChange={(e) => {
              setBranchFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by Campus Branch"
            className="px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] border border-[#E2E8F0] text-[#2D3748] focus:outline-none"
          >
            <option value="all">All Branches</option>
            <option value="rathinapuri">Rathinapuri Campus</option>
            <option value="kuniyamuthur">Kuniyamuthur Campus</option>
            <option value="undecided">Undecided</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by Inquiry Status"
            className="px-3 py-2 rounded-xl text-xs bg-[#FBFBFA] border border-[#E2E8F0] text-[#2D3748] focus:outline-none"
          >
            <option value="all">All Statuses ({counts.total})</option>
            <option value="new">New ({counts.new})</option>
            <option value="in_review">In Review ({counts.inReview})</option>
            <option value="contacted">Contacted ({counts.contacted})</option>
            <option value="scheduled_assessment">Scheduled ({counts.scheduled})</option>
            <option value="archived">Archived ({counts.archived})</option>
          </select>
        </div>
      </div>

      {/* Main Table / List */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-[#64748B]">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-[#101C3A]" />
            <p className="text-xs font-medium">Retrieving inquiries from database...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#101C3A]">Unable to load inquiries</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => fetchInquiries()}
              className="mt-4 px-4 py-2 bg-[#101C3A] text-white text-xs font-semibold rounded-xl hover:bg-[#1A2E5A]"
            >
              Retry
            </button>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#101C3A]/5 text-[#101C3A] flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#101C3A]">No inquiries found</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== "all" || branchFilter !== "all"
                ? "No inquiries matched your current filter criteria."
                : "Inquiries submitted by parents through the public website will appear here in real time."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FBFBFA] border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  <th className="py-3 px-4">Inquiry ID</th>
                  <th className="py-3 px-4">Parent Name</th>
                  <th className="py-3 px-4">Program</th>
                  <th className="py-3 px-4">Campus</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-xs text-[#2D3748]">
                {inquiries.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F1F4F9]/60 transition cursor-pointer"
                    onClick={() => setSelectedInquiry(item)}
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#101C3A]">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#101C3A]">{item.parentName}</div>
                      <div className="text-[11px] text-[#64748B] flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{item.phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#101C3A]">
                      {item.serviceOfInterest}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-[#64748B]">
                      {item.preferredBranch}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B]">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4">{statusBadge(item.status)}</td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedInquiry(item)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#101C3A] bg-[#F1F4F9] hover:bg-[#E2E8F0] rounded-lg transition"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#FBFBFA] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
            <div>
              Showing {inquiries.length} of {totalItems} total inquiries
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-[#101C3A]">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-[#101C3A]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FBFBFA]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#101C3A] text-white flex items-center justify-center font-bold">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#101C3A] font-[var(--font-heading)]">
                    Inquiry Details: {selectedInquiry.id}
                  </h2>
                  <div className="text-xs text-[#64748B]">
                    Received: {new Date(selectedInquiry.createdAt).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#101C3A] hover:bg-[#E2E8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Status Selector */}
              <div className="p-4 rounded-xl bg-[#F1F4F9]/60 border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#101C3A]">Current Status:</span>
                  {statusBadge(selectedInquiry.status)}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[#64748B] text-[11px]">Update:</span>
                  {(["new", "in_review", "contacted", "scheduled_assessment", "archived"] as const).map(
                    (st) => (
                      <button
                        key={st}
                        disabled={actionLoading || selectedInquiry.status === st}
                        onClick={() => handleStatusChange(selectedInquiry.id, st)}
                        className={`px-2 py-1 rounded-md text-[11px] font-semibold transition capitalize ${
                          selectedInquiry.status === st
                            ? "bg-[#101C3A] text-white"
                            : "bg-white border border-[#E2E8F0] text-[#2D3748] hover:bg-[#E2E8F0]"
                        }`}
                      >
                        {st.replace("_", " ")}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Parent Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E2E8F0] space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Contact Information
                  </div>
                  <div>
                    <span className="text-gray-500">Parent / Guardian:</span>
                    <strong className="block text-sm text-[#101C3A]">{selectedInquiry.parentName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone Number:</span>
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="block font-semibold text-[#8F2638] hover:underline"
                    >
                      {selectedInquiry.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-gray-500">Email Address:</span>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="block font-semibold text-blue-700 hover:underline"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E2E8F0] space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Program &amp; Campus
                  </div>
                  <div>
                    <span className="text-gray-500">Program of Interest:</span>
                    <strong className="block text-sm text-[#101C3A]">{selectedInquiry.serviceOfInterest}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Preferred Campus:</span>
                    <strong className="block capitalize text-[#101C3A]">{selectedInquiry.preferredBranch}</strong>
                  </div>
                  {selectedInquiry.childAge && (
                    <div>
                      <span className="text-gray-500">Child Details / Age:</span>
                      <div className="font-semibold text-[#101C3A]">{selectedInquiry.childAge}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                  Parent Message / Clinical Notes
                </div>
                <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E2E8F0] text-sm text-[#2D3748] leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Internal Counselor Notes */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#8F2638]" />
                  <span>Internal Administrative Notes ({selectedInquiry.internalNotes?.length || 0})</span>
                </div>

                {selectedInquiry.internalNotes && selectedInquiry.internalNotes.length > 0 ? (
                  <div className="space-y-2 mb-3">
                    {selectedInquiry.internalNotes.map((note, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-950 text-xs">
                        {note}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#64748B] text-xs mb-3 italic">No internal notes added yet.</p>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Add an internal note (e.g. called mother, scheduled assessment for Friday 10 AM)..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#101C3A]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddNote(selectedInquiry.id);
                    }}
                  />
                  <button
                    onClick={() => handleAddNote(selectedInquiry.id)}
                    disabled={actionLoading || !noteInput.trim()}
                    className="px-3.5 py-2 bg-[#101C3A] text-white font-semibold rounded-xl text-xs hover:bg-[#1A2E5A] disabled:opacity-50 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Note</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E2E8F0] bg-[#FBFBFA] flex items-center justify-between">
              <div>
                {deleteConfirmId === selectedInquiry.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-red-700 font-bold text-xs">Confirm delete?</span>
                    <button
                      onClick={() => handleDelete(selectedInquiry.id)}
                      disabled={actionLoading}
                      className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(selectedInquiry.id)}
                    className="text-red-600 hover:text-red-800 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Inquiry</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Regarding Your Inquiry with Thulir Special School (${selectedInquiry.id})`}
                  className="px-3.5 py-2 bg-[#8F2638] text-white rounded-xl text-xs font-semibold hover:bg-[#A83246] transition flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Parent</span>
                </a>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-3.5 py-2 bg-white border border-[#E2E8F0] text-[#2D3748] rounded-xl text-xs font-semibold hover:bg-[#F1F4F9]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
