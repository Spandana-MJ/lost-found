
import React, { useState } from "react";
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
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(form).forEach((k) => {
        if (form[k]) data.append(k, form[k]);
      });
      if (image) data.append("image", image);

      // ✅ No token needed — cookie is sent automatically by axios (withCredentials: true)
      // ✅ No Content-Type header — browser sets multipart boundary automatically
      await API.post("/api/items", data);

      toast.success("Report submitted successfully!");
      navigate("/listings");
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);

      if (err.response?.status === 422 && err.response.data?.errors) {
        const errs = {};
        err.response.data.errors.forEach(({ field, message }) => {
          errs[field] = message;
        });
        setFieldErrors(errs);
        toast.error("Please fix the errors below");
      } else if (err.response?.status === 401) {
        // Cookie expired — api.js interceptor handles redirect automatically
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(err.response?.data?.message || "Submit failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ name }) =>
    fieldErrors[name] ? (
      <p className="text-red-500 text-xs mt-1">{fieldErrors[name]}</p>
    ) : null;

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[90vh] backdrop-blur-md bg-white/70 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-white/30">

        {/* Left Side */}
        <div className="bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white flex flex-col justify-center items-center px-6 py-4">
          <FaClipboardList className="text-6xl mb-2 drop-shadow-lg" />
          <h2 className="text-3xl font-extrabold mb-2">Report Lost Item</h2>
          <p className="text-center text-white/90 leading-relaxed text-sm max-w-xs">
            Submit your lost item. Once admin finds it, you'll receive an email notification.
          </p>
        </div>

        {/* Right Side Form */}
        <form onSubmit={submit} className="p-6 space-y-4 overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
            Fill in the Details
          </h3>

          {/* Title */}
          <div className="relative">
            <input
              type="text"
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={`peer w-full border rounded-xl px-3 pt-4 pb-1 bg-white/60 shadow-sm focus:ring-2 outline-none placeholder-transparent ${
                fieldErrors.title
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:border-green-500 focus:ring-green-200"
              }`}
              placeholder="Title"
              required
            />
            <label
              htmlFor="title"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-green-600 peer-focus:text-sm"
            >
              Title *
            </label>
            <FieldError name="title" />
          </div>

          {/* Location */}
          <div className="relative">
            <input
              type="text"
              id="location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="peer w-full border border-gray-200 rounded-xl px-3 pt-4 pb-1 bg-white/60 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none placeholder-transparent"
              placeholder="Location"
            />
            <label
              htmlFor="location"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-green-600 peer-focus:text-sm"
            >
              Location
            </label>
          </div>

          {/* Reporter Email */}
          <div className="relative">
            <input
              type="email"
              id="reporterEmail"
              value={form.reporterEmail}
              onChange={(e) => setForm({ ...form, reporterEmail: e.target.value })}
              className={`peer w-full border rounded-xl px-3 pt-4 pb-1 bg-white/60 shadow-sm focus:ring-2 outline-none placeholder-transparent ${
                fieldErrors.reporterEmail
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:border-green-500 focus:ring-green-200"
              }`}
              placeholder="Your Email"
              required
            />
            <label
              htmlFor="reporterEmail"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-green-600 peer-focus:text-sm"
            >
              Your Email *
            </label>
            <FieldError name="reporterEmail" />
          </div>

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
            {/* Character counter */}
            <p className="text-xs text-gray-400 text-right mt-1">
              {form.description.length}/500
            </p>
          </div>

          {/* Date + Type */}
          <div className="flex gap-3">
            <div className="w-1/2">
              <input
                type="date"
                value={form.dateLostFound}
                onChange={(e) => setForm({ ...form, dateLostFound: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white/60 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
              />
            </div>
            <div className="w-1/2">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white/60 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-green-300 rounded-xl p-3 text-center bg-white/60 hover:bg-green-50 transition text-sm">
            <input
              type="file"
              accept="image/*"
              className="block w-full text-gray-600 cursor-pointer"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <p className="text-xs text-gray-400 mt-1">
              {image ? `✅ Selected: ${image.name}` : "Upload an image (optional)"}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
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
