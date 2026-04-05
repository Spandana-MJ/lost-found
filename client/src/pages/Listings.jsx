

import React, { useEffect, useState } from "react";
import {
  Trash2, CheckCircle, Clock, MapPin, ImageOff,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../components/ConfirmModal";

const PAGE_SIZE = 10;

export default function Listings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate();

  const [confirmState, setConfirmState] = useState({
    open: false, itemId: null, itemTitle: "",
  });

  // ── Step 1: verify cookie, get role ──────────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get("/api/auth/me");
        setRole(res.data.role);
        sessionStorage.setItem("role",  res.data.role  || "");
        sessionStorage.setItem("name",  res.data.name  || "");
        sessionStorage.setItem("email", res.data.email || "");
        setAuthReady(true);
      } catch {
        toast.error("Please log in first");
        navigate("/login");
      }
    };
    checkAuth();
  }, []);

  // ── Step 2: fetch items after auth confirmed ──────────────────
  useEffect(() => {
    if (!authReady) return;
    fetchItems(page);
  }, [authReady, page]);

  const fetchItems = async (currentPage = 1) => {
    try {
      setLoading(true);
      const res = await API.get(`/api/items?page=${currentPage}&limit=${PAGE_SIZE}`);
      if (Array.isArray(res.data)) {
        setItems(res.data);
        setTotalPages(1);
      } else {
        setItems(res.data.items ?? []);
        setTotalPages(res.data.totalPages ?? 1);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        sessionStorage.clear();
        navigate("/login");
      } else {
        toast.error(err.response?.data?.message || "Error loading items");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Mark item as Found (admin only) ──────────────────────────
  const markAsFound = async (id) => {
    try {
      await API.put(`/api/items/${id}/verify`, {});
      toast.success("Item marked as Found! Email sent to reporter.");
      fetchItems(page);
    } catch (err) {
      console.error("Mark as found error:", err.response?.data);
      toast.error("Could not update item");
    }
  };

  const openDeleteConfirm = (item) =>
    setConfirmState({ open: true, itemId: item._id, itemTitle: item.title });

  const handleDeleteConfirmed = async () => {
    try {
      await API.delete(`/api/items/${confirmState.itemId}`);
      toast.success("Item deleted successfully!");
      setConfirmState({ open: false, itemId: null, itemTitle: "" });
      fetchItems(page);
    } catch {
      toast.error("Could not delete item");
      setConfirmState({ open: false, itemId: null, itemTitle: "" });
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <div className="animate-spin border-4 border-indigo-500 border-t-transparent rounded-full w-10 h-10 mb-4" />
        <p>Loading items...</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <ConfirmModal
        isOpen={confirmState.open}
        title="Delete Item"
        message={`Are you sure you want to delete "${confirmState.itemTitle}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmState({ open: false, itemId: null, itemTitle: "" })}
      />

      <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">
        📋 Reported Items
      </h2>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-md">
          <ImageOff size={60} className="text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No items to display</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-100">
            <table className="min-w-full text-sm text-left table-fixed">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <tr>
                  <th className="px-6 py-4 w-24">Image</th>
                  <th className="px-6 py-4 w-40">Title</th>
                  <th className="px-6 py-4 w-64">Description</th>
                  <th className="px-6 py-4 w-40">Location</th>
                  <th className="px-6 py-4 w-32">Date</th>
                  <th className="px-6 py-4 w-36">Status</th>
                  {role === "admin" && (
                    <th className="px-6 py-4 w-40">Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {items.map((item, idx) => (
                  <motion.tr
                    key={item._id}
                    className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} border-b hover:bg-indigo-50 transition`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                  >
                    <td className="px-6 py-4 align-middle">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title}
                          className="w-14 h-14 object-cover rounded-lg border border-gray-200" />
                      ) : (
                        <span className="text-gray-400 italic text-sm">No image</span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-800 align-middle">
                      {item.title}
                    </td>

                    <td className="px-6 py-4 text-gray-600 align-middle">
                      {item.description}
                    </td>

                    <td className="px-6 py-4 align-middle text-gray-700">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={14} /> {item.location}
                      </span>
                    </td>

                    <td className="px-6 py-4 align-middle text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} />
                        {item.dateLostFound
                          ? new Date(item.dateLostFound).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </td>

                    {/* ✅ Status column — clear language */}
                    <td className="px-6 py-4 align-middle font-semibold">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        item.verified
                          ? "bg-green-100 text-green-700"   // found by admin
                          : "bg-red-100 text-red-600"       // still lost
                      }`}>
                        {item.verified ? "✅ Found" : "🔴 Still Lost"}
                      </span>
                    </td>

                    {/* ✅ Admin actions — button says "Mark as Found" */}
                    {role === "admin" && (
                      <td className="px-6 py-4 align-middle">
                        <div className="flex gap-2">
                          {!item.verified && (
                            <button
                              onClick={() => markAsFound(item._id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 transition text-xs"
                            >
                              <CheckCircle size={14} /> Mark as Found
                            </button>
                          )}
                          <button
                            onClick={() => openDeleteConfirm(item)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 transition text-xs"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
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
          <p className="text-center text-xs text-gray-400 mt-2">Page {page} of {totalPages}</p>
        </>
      )}
    </div>
  );
}
