

import React, { useEffect, useState } from "react";
import { Trash2, CheckCircle, Clock, MapPin, ImageOff } from "lucide-react";
import { motion } from "framer-motion";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Listings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("You must be logged in to view this page");
      navigate("/login");
      return;
    }
    fetchUserRole();
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
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

  const fetchUserRole = async () => {
    try {
      const res = await API.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(res.data.role);
    } catch (err) {
      if (err.response?.status === 401) {
        sessionStorage.clear();
        navigate("/login");
      }
    }
  };

  const verifyItem = async (id) => {
    try {
      await API.put(
        `/api/items/${id}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Item verified successfully!");
      fetchItems();
    } catch {
      toast.error("Could not verify item");
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await API.delete(`/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item deleted successfully!");
      fetchItems();
    } catch {
      toast.error("Could not delete item");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <div className="animate-spin border-4 border-indigo-500 border-t-transparent rounded-full w-10 h-10 mb-4"></div>
        <p>Loading items...</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">
        📋 Reported Items
      </h2>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-md">
          <ImageOff size={60} className="text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No items to display</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-100">
          <table className="min-w-full text-sm text-left table-fixed">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left w-24">Image</th>
                <th className="px-6 py-4 text-left w-40">Title</th>
                <th className="px-6 py-4 text-left w-72">Description</th>
                <th className="px-6 py-4 text-left w-40">Location</th>
                <th className="px-6 py-4 text-left w-32">Date</th>
                <th className="px-6 py-4 text-left w-28">Status</th>
                {role === "admin" && (
                  <th className="px-6 py-4 text-left w-36">Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {items.map((item, idx) => (
                <motion.tr
                  key={item._id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border-b hover:bg-indigo-50 transition`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 align-middle">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        No image
                      </span>
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
                      <Clock size={14} />{" "}
                      {item.dateLostFound
                        ? new Date(item.dateLostFound).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </td>

                  <td className="px-6 py-4 align-middle font-semibold">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        item.verified
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.verified ? "Verified" : "Pending"}
                    </span>
                  </td>

                  {role === "admin" && (
                    <td className="px-6 py-4 align-middle flex gap-2">
                      {!item.verified && (
                        <button
                          onClick={() => verifyItem(item._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 transition"
                        >
                          <CheckCircle size={16} /> Verify
                        </button>
                      )}
                      <button
                        onClick={() => deleteItem(item._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 transition"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



