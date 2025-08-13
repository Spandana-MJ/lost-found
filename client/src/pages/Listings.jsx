
import React, { useEffect, useState } from "react";
import { Trash2, CheckCircle } from "lucide-react";
import API from "../utils/api";

export default function Listings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchItems();
    fetchUserRole();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error("❌ Error fetching items:", err);
      alert(err.response?.data?.message || "Error loading items");
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
      console.error("❌ Error fetching user role:", err);
    }
  };

  const verifyItem = async (id) => {
    try {
      await API.put(`/api/items/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch (err) {
      console.error("❌ Error verifying item:", err);
      alert("Could not verify item");
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await API.delete(`/api/items/${id}`);
      fetchItems();
    } catch (err) {
      console.error("❌ Error deleting item:", err);
      alert("Could not delete item");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">📋 Reported Items</h2>
      {items.length === 0 ? (
        <p>No items to display</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                {role === "admin" && <th className="px-4 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={item._id}
                  className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} border-b`}
                >
                  <td className="px-4 py-3">
                    {item.imageUrl ? (
                      <img
                        src={`http://localhost:5000${item.imageUrl}`}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold">{item.title}</td>
                  <td className="px-4 py-3 text-gray-600">{item.description}</td>
                  <td className="px-4 py-3">{item.location}</td>
                  <td className="px-4 py-3">
                    {item.dateLostFound
                      ? new Date(item.dateLostFound).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 font-bold">
                    <span className={item.verified ? "text-green-600" : "text-yellow-600"}>
                      {item.verified ? "verified" : "pending"}
                    </span>
                  </td>
                  {role === "admin" && (
                    <td className="px-4 py-3 flex gap-2">
                      {!item.verified && (
                        <button
                          onClick={() => verifyItem(item._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                        >
                          <CheckCircle size={16} /> Verify
                        </button>
                      )}
                      <button
                        onClick={() => deleteItem(item._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



