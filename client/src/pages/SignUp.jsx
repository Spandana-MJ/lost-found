
import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/api/auth/register", form).catch(async (err) => {
        if (err.response?.status === 404) return API.post("/api/auth/signup", form);
        throw err;
      });

      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user || {}));
        localStorage.setItem("role", (res.data.user && res.data.user.role) || "user");
        toast.success("Account created successfully!");
        navigate("/");
        setForm({ name: "", email: "", password: "" });
      } else {
        
         toast.info("Account created — please log in");
        navigate("/login");
        setForm({ name: "", email: "", password: "" });
      }
    } catch (err) {
        toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
     
        <form
  onSubmit={submit}
  className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100"
  autoComplete="off"
>
  <input
    className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
    placeholder="Full Name"
    value={form.name}
    onChange={(e) => setForm({ ...form, name: e.target.value })}
    autoComplete="new-name"
    required
  />
  <input
    type="email"
    className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
    placeholder="Email Address"
    value={form.email}
    onChange={(e) => setForm({ ...form, email: e.target.value })}
    autoComplete="new-email"
    required
  />
  <input
    type="password"
    className="w-full p-3 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
    placeholder="Password"
    value={form.password}
    onChange={(e) => setForm({ ...form, password: e.target.value })}
    autoComplete="new-password"
    required
  />


        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:opacity-90 text-white font-semibold p-3 rounded-lg shadow-lg transition disabled:opacity-60"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Log in
          </span>
        </p>
      </form>
    </div>
  );
}
