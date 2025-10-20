

import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FaClipboardList } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReportForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    dateLostFound: "",
    type: "lost",
    reporterEmail: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setForm({
      title: "",
      description: "",
      location: "",
      dateLostFound: "",
      type: "lost",
      reporterEmail: "",
    });
    setImage(null);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(form).forEach((k) => data.append(k, form[k]));
      if (image) data.append("image", image);
      const token = sessionStorage.getItem("token");

      await API.post("/api/items", data, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(async (err) => {
        if (err.response?.status === 404) {
          return API.post("/api/items/report", data, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        throw err;
      });

      toast.success("Report submitted successfully!");
      navigate("/listings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[90vh] backdrop-blur-md bg-white/70 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-white/30">
        {/* Left Side */}
        <div className="bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white flex flex-col justify-center items-center px-6 py-4">
          <FaClipboardList className="text-6xl mb-2 drop-shadow-lg" />
          <h2 className="text-3xl font-extrabold mb-2">Report Lost or Found</h2>
          <p className="text-center text-white/90 leading-relaxed text-sm max-w-xs">
            Submit lost or found items easily. Help others reconnect with their belongings.
          </p>
        </div>

        {/* Right Side Form */}
        <form onSubmit={submit} className="p-6 space-y-4 overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
            Fill in the Details
          </h3>

          {/* Compact Inputs */}
          {[
            { label: "Title", key: "title", type: "text" },
            { label: "Location", key: "location", type: "text" },
            { label: "Your Email", key: "reporterEmail", type: "email" },
          ].map((field) => (
            <div key={field.key} className="relative">
              <input
                type={field.type}
                id={field.key}
                value={form[field.key]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className="peer w-full border border-gray-200 rounded-xl px-3 pt-4 pb-1 bg-white/60 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none placeholder-transparent"
                placeholder={field.label}
                required
              />
              <label
                htmlFor={field.key}
                className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-green-600 peer-focus:text-sm"
              >
                {field.label}
              </label>
            </div>
          ))}

          {/* Description */}
          <div className="relative">
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="peer w-full border border-gray-200 rounded-xl px-3 pt-4 pb-1 h-20 resize-none bg-white/60 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none placeholder-transparent"
              placeholder="Description"
            />
            <label
              htmlFor="description"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-green-600 peer-focus:text-sm"
            >
              Description
            </label>
          </div>

          {/* Date + Type */}
          <div className="flex gap-3">
            <input
              type="date"
              value={form.dateLostFound}
              onChange={(e) => setForm({ ...form, dateLostFound: e.target.value })}
              className="w-1/2 border border-gray-200 rounded-xl px-3 py-2 bg-white/60 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-1/2 border border-gray-200 rounded-xl px-3 py-2 bg-white/60 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-green-300 rounded-xl p-3 text-center bg-white/60 hover:bg-green-50 transition text-sm">
            <input
              type="file"
              accept="image/*"
              className="block w-full text-gray-600 cursor-pointer"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <p className="text-xs text-gray-400 mt-1">Upload an image (optional)</p>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className={`w-full py-2.5 rounded-xl text-white font-semibold shadow-lg transition-all ${
              loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:opacity-90 hover:scale-[1.02]"
            }`}
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}

