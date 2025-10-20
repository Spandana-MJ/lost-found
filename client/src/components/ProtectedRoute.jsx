

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly }) {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  // Redirect to login if not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Redirect non-admins if adminOnly route
  if (adminOnly && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
