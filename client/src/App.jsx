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
import API from "./utils/api";
import NotFound from "./pages/NotFound";
import PublicList from "./pages/PublicList";

// Pages where sidebar is never shown
const NO_SIDEBAR_PATHS = ["/", "/login", "/signup", "/browse"];

// Known valid routes — anything outside this list is a 404
const KNOWN_PATHS = ["/", "/login", "/signup", "/report", "/listings", "/admin", "/browse"];

export default function App() {
  const location = useLocation();

  const [authState, setAuthState] = useState({
    status: "checking",
    role: null,
  });

  const checkAuth = async () => {
    try {
      const res = await API.get("/api/auth/me");
      const { role, name, email } = res.data;
      sessionStorage.setItem("role",  role  || "user");
      sessionStorage.setItem("name",  name  || "");
      sessionStorage.setItem("email", email || "");
      setAuthState({ status: "loggedIn", role });
    } catch {
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("email");
      setAuthState({ status: "loggedOut", role: null });
    }
  };

  useEffect(() => { checkAuth(); }, []);

  useEffect(() => {
    const syncAuth = () => checkAuth();
    window.addEventListener("loginStateChange", syncAuth);
    return () => window.removeEventListener("loginStateChange", syncAuth);
  }, []);

  const isLoggedIn  = authState.status === "loggedIn";

  // ✅ Detect if current path is a 404
  const is404 = !KNOWN_PATHS.includes(location.pathname);

  // Hide navbar and sidebar entirely on 404 page
  const showNavbar  = !is404;
  const showSidebar = !is404 && isLoggedIn && !NO_SIDEBAR_PATHS.includes(location.pathname);

  if (authState.status === "checking") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin border-4 border-indigo-500 border-t-transparent rounded-full w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* ✅ Navbar hidden on 404 */}
      {showNavbar && <Navbar isLoggedIn={isLoggedIn} />}

      <div className="flex flex-1">
        {showSidebar && (
          <div className="w-64 flex-shrink-0">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/"        element={<Home />} />
            <Route path="/signup"  element={<Signup />} />
            <Route path="/login"   element={<Login />} />
            <Route path="/browse"  element={<PublicList />} />
            <Route path="/listings" element={<Listings />} />
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <ReportForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
