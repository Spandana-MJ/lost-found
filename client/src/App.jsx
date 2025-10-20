
import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import ReportForm from "./pages/ReportForm";
import Listings from "./pages/Listings";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem("token")
  );

  useEffect(() => {
    const updateAuth = () => setIsLoggedIn(!!sessionStorage.getItem("token"));

    // ✅ Listen for login/logout changes
    window.addEventListener("loginStateChange", updateAuth);
    return () => window.removeEventListener("loginStateChange", updateAuth);
  }, []);

  // Hide sidebar when not logged in or on public pages
  const hideSidebar =
    !isLoggedIn ||
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar always visible */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar only visible after login */}
        {!hideSidebar && (
          <div className="w-64">
            <Sidebar />
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <ReportForm />
                </ProtectedRoute>
              }
            />
            <Route path="/listings" element={<Listings />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
