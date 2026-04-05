
import React, { useEffect, useState } from "react";
import {
  Mail, Trash2, ClipboardList, CheckCircle, Clock,
  ChevronLeft, ChevronRight, Search
} from "lucide-react";
import API from "../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../components/ConfirmModal";
import EmailModal from "../components/EmailModal";

const PAGE_SIZE = 10;

function StatSkeleton() {
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 flex items-center gap-4 animate-pulse">
      <div className="w-10 h-10 bg-gray-300 rounded-full" />
      <div className="space-y-2">
        <div className="h-3 w-20 bg-gray-300 rounded" />
        <div className="h-6 w-10 bg-gray-300 rounded" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingListings, setLoadingListings] = useState(false);
  const [search, setSearch] = useState("");

  const [confirmState, setConfirmState] = useState({ open: false, itemId: null, itemTitle: "" });
  const [emailState, setEmailState]     = useState({ open: false, itemId: null, itemTitle: "" });

  const loadStats = async () => {
    try {
      const s = await API.get("/api/items/stats");
      setStats(s.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load stats");
    }
  };

  const loadListings = async (currentPage = 1) => {
    try {
      setLoadingListings(true);
      const res = await API.get(`/api/items?page=${currentPage}&limit=${PAGE_SIZE}`);
      setListings(res.data.items ?? res.data);
      setTotalPages(res.data.totalPages ?? 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load listings");
    } finally {
      setLoadingListings(false);
    }
  };

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { loadListings(page); }, [page]);

  // ── Mark item as Found ────────────────────────────────────────
  const markAsFound = async (id) => {
    try {
      await API.put(`/api/items/${id}/verify`, {});
      toast.success("Item marked as Found! Email sent to reporter.");
      loadStats();
      loadListings(page);
    } catch (err) {
      toast.error("Could not update item");
    }
  };

  // Client-side search filter
  const filtered = listings.filter((it) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      it.title?.toLowerCase().includes(q) ||
      it.reporterEmail?.toLowerCase().includes(q) ||
      it.location?.toLowerCase().includes(q)
    );
  });

  const openDeleteConfirm = (item) =>
    setConfirmState({ open: true, itemId: item._id, itemTitle: item.title });

  const handleDeleteConfirmed = async () => {
    try {
      await API.delete(`/api/items/${confirmState.itemId}`);
      toast.success("Item deleted!");
      setConfirmState({ open: false, itemId: null, itemTitle: "" });
      loadStats();
      loadListings(page);
    } catch {
      toast.error("Failed to delete");
      setConfirmState({ open: false, itemId: null, itemTitle: "" });
    }
  };

  const openEmailModal = (item) =>
    setEmailState({ open: true, itemId: item._id, itemTitle: item.title });

  const handleSendEmail = async ({ subject, message }) => {
    await API.post(`/api/admin/send-email/${emailState.itemId}`, { subject, message });
    toast.success("Email sent!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ConfirmModal
        isOpen={confirmState.open}
        title="Delete Item"
        message={`Delete "${confirmState.itemTitle}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmState({ open: false, itemId: null, itemTitle: "" })}
      />
      <EmailModal
        isOpen={emailState.open}
        itemTitle={emailState.itemTitle}
        onSend={handleSendEmail}
        onClose={() => setEmailState({ open: false, itemId: null, itemTitle: "" })}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">📊 Admin Dashboard</h2>
        <p className="text-gray-500 text-sm mt-2 sm:mt-0">Manage lost items and notify reporters</p>
      </div>

      {/* ✅ Stats with correct labels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats === null ? (
          <><StatSkeleton /><StatSkeleton /><StatSkeleton /></>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition">
              <ClipboardList className="text-blue-500 w-10 h-10" />
              <div>
                <p className="text-gray-600 text-sm">Total Reports</p>
                <h3 className="text-2xl font-semibold text-gray-800">{stats.total}</h3>
              </div>
            </div>

            {/* ✅ "Resolved" = items admin marked as Found */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition">
              <CheckCircle className="text-green-500 w-10 h-10" />
              <div>
                <p className="text-gray-600 text-sm">Found & Resolved</p>
                <h3 className="text-2xl font-semibold text-gray-800">{stats.received}</h3>
              </div>
            </div>

            {/* ✅ "Pending" = items still lost */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition">
              <Clock className="text-red-400 w-10 h-10" />
              <div>
                <p className="text-gray-600 text-sm">Still Lost</p>
                <h3 className="text-2xl font-semibold text-gray-800">{stats.pending}</h3>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Listings */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b pb-4 gap-3">
          <h3 className="text-lg font-semibold text-gray-700">All Reported Items</h3>
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, email, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>

        {loadingListings ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin border-4 border-indigo-500 border-t-transparent rounded-full w-8 h-8" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-500 italic">
            {search ? `No results for "${search}"` : "No reports found."}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filtered.map((it) => (
                <div key={it._id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-100 transition">
                  <div className="flex flex-col">
                    <h4 className="font-bold text-lg text-gray-800">
                      {it.title}{" "}
                      <span className="text-sm text-gray-500 font-normal">({it.type})</span>
                    </h4>
                    <p className="text-sm text-gray-600">{it.reporterEmail}</p>

                    {/* ✅ Clear status label */}
                    <p className="text-sm mt-1">
                      Status:{" "}
                      <span className={it.verified
                        ? "text-green-600 font-semibold"
                        : "text-red-500 font-semibold"
                      }>
                        {it.verified ? "✅ Found & Resolved" : "🔴 Still Lost"}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    {/* ✅ Only show Mark as Found if item is still lost */}
                    {!it.verified && (
                      <button
                        onClick={() => markAsFound(it._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 transition"
                      >
                        <CheckCircle size={16} /> Mark as Found
                      </button>
                    )}
                    <button
                      onClick={() => openEmailModal(it)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 transition"
                    >
                      <Mail size={16} /> Email
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(it)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 transition"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-gray-100">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                        p === page ? "bg-indigo-600 text-white shadow-sm" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}>
                      {p}
                    </button>
                  ))}
                </div>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}










