
import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FaClipboardList } from "react-icons/fa";

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

      alert("Report submitted");
      navigate("/listings");
    } catch (err) {
      console.error("Error submitting report:", err);
      alert(err.response?.data?.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-4xl grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side - Banner */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white flex flex-col justify-center items-center">
          <FaClipboardList className="text-6xl mb-4" />
          <h2 className="text-3xl font-bold mb-2">Report Lost / Found Item</h2>
          <p className="text-center opacity-90 text-sm">
            Help others by reporting lost or found items. Fill in the details and submit your report.
          </p>
        </div>

        {/* Right Side - Form */}
        <form onSubmit={submit} className="p-8 space-y-5">
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
                className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                placeholder=" "
                required
              />
              <label
                htmlFor={field.key}
                className="absolute left-3 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-green-600 peer-focus:text-sm"
              >
                {field.label}
              </label>
            </div>
          ))}

          <div className="relative">
            <textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 h-28 resize-none focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
              placeholder=" "
            />
            <label
              htmlFor="description"
              className="absolute left-3 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-green-600 peer-focus:text-sm"
            >
              Description
            </label>
          </div>

          <input
            type="date"
            value={form.dateLostFound}
            onChange={(e) =>
              setForm({ ...form, dateLostFound: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
          />

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          <input
            type="file"
            accept="image/*"
            className="w-full text-sm text-gray-500"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition ${
              loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
            }`}
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}





