
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../utils/api";

export default function ProtectedRoute({ children, adminOnly }) {
  const [status, setStatus] = useState("checking");
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    API.get("/api/auth/me")
      .then(() => setStatus("ok"))
      .catch(() => {
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("email");
        window.dispatchEvent(new Event("loginStateChange"));
        setStatus("unauthorized");
      });
  }, []);

  if (status === "checking") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin border-4 border-indigo-500 border-t-transparent rounded-full w-8 h-8" />
      </div>
    );
  }

  if (status === "unauthorized") return <Navigate to="/login" replace />;
  if (adminOnly && role !== "admin") return <Navigate to="/" replace />;

  return children;
}

