
import React, { useEffect, useState } from "react";
import { Mail, Trash2, ClipboardList, CheckCircle, Clock } from "lucide-react";
import API from "../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, received: 0, pending: 0 });
  const [listings, setListings] = useState([]);

  const load = async () => {
    try {
      const s = await API.get("/api/items/stats").catch(async (err) => {
        if (err.response?.status === 404) return API.get("/api/admin/dashboard");
        throw err;
      });
      setStats(s.data);

      const l = await API.get("/api/items").catch(async (err) => {
        if (err.response?.status === 404) return API.get("/api/admin/listings");
        throw err;
      });
      setListings(l.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admin data");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sendEmail = async (id) => {
    const message = prompt("Enter message to reporter (short)");
    if (!message) return;
    try {
      await API.post(`/api/admin/send-email/${id}`, {
        subject: "Regarding your item",
        message,
      });
      toast.success("Email sent");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send email");
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await API.delete(`/api/items/${id}`);
      load();
      toast.success("Item deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">📊 Admin Dashboard</h2>
        <p className="text-gray-500 text-sm mt-2 sm:mt-0">
          Manage all reported items and user communications
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition">
          <ClipboardList className="text-blue-500 w-10 h-10" />
          <div>
            <p className="text-gray-600 text-sm">Total Reports</p>
            <h3 className="text-2xl font-semibold text-gray-800">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition">
          <CheckCircle className="text-green-500 w-10 h-10" />
          <div>
            <p className="text-gray-600 text-sm">Resolved</p>
            <h3 className="text-2xl font-semibold text-gray-800">{stats.received}</h3>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition">
          <Clock className="text-yellow-500 w-10 h-10" />
          <div>
            <p className="text-gray-600 text-sm">Pending</p>
            <h3 className="text-2xl font-semibold text-gray-800">{stats.pending}</h3>
          </div>
        </div>
      </div>

      {/* Reported Items Section */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
          All Reported Items
        </h3>

        {listings.length === 0 ? (
          <div className="text-center py-10 text-gray-500 italic">
            No reports found. All clear!
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((it) => (
              <div
                key={it._id}
                className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-100 transition"
              >
                <div className="flex flex-col">
                  <h4 className="font-bold text-lg text-gray-800">
                    {it.title}{" "}
                    <span className="text-sm text-gray-500">({it.type})</span>
                  </h4>
                  <p className="text-sm text-gray-600">
                    {it.reporterName} — {it.reporterEmail}
                  </p>
                  <p className="text-sm mt-1">
                    Status:{" "}
                    <span
                      className={it.verified ? "text-green-600" : "text-yellow-600"}
                    >
                      {it.verified ? "verified" : "pending"}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                  <button
                    onClick={() => sendEmail(it._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 transition"
                  >
                    <Mail size={16} /> Email
                  </button>

                  <button
                    onClick={() => deleteItem(it._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}












