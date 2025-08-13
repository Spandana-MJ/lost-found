


import React, { useEffect, useState } from "react";
import { Mail, Trash2, ClipboardList, CheckCircle, Clock } from "lucide-react";
import API from "../utils/api";

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
      alert("Failed to load admin data");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sendEmail = async (id) => {
    const message = prompt("Enter message to reporter (short)");
    if (!message) return;
    try {
      await API.post(`/api/admin/send-email/${id}`, { subject: "Regarding your item", message });
      alert("Email sent");
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await API.delete(`/api/items/${id}`);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <ClipboardList className="text-blue-500 w-10 h-10" />
          <div>
            <p className="text-gray-500 text-sm">Total Reports</p>
            <h3 className="text-xl font-bold">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <CheckCircle className="text-green-500 w-10 h-10" />
          <div>
            <p className="text-gray-500 text-sm">Resolved</p>
            <h3 className="text-xl font-bold">{stats.received}</h3>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <Clock className="text-yellow-500 w-10 h-10" />
          <div>
            <p className="text-gray-500 text-sm">Pending</p>
            <h3 className="text-xl font-bold">{stats.pending}</h3>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">All Reported Items</h3>
        {listings.length === 0 ? (
          <p className="text-gray-500">No reports found</p>
        ) : (
          <div className="space-y-4">
            {listings.map((it) => (
              <div
                key={it._id}
                className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between hover:shadow"
              >
                <div>
                  <h4 className="font-bold text-lg">
                    {it.title} <span className="text-sm text-gray-500">({it.type})</span>
                  </h4>
                  <p className="text-sm text-gray-600">{it.reporterName} — {it.reporterEmail}</p>
                  <p className="text-sm mt-1">
                    Status: <span className={it.verified ? "text-green-600" : "text-yellow-600"}>
                      {it.verified ? "verified" : "pending"}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                  <button
                    onClick={() => sendEmail(it._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Mail size={16} /> Email
                  </button>
                  <button
                    onClick={() => deleteItem(it._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
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














