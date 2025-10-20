
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const handleLogout = () => {
    sessionStorage.clear();
     window.dispatchEvent(new Event("loginStateChange"));
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent"
          >
            Lost & Found
          </Link>

          {/* Right side links */}
          <div className="flex items-center gap-4">
            {/* <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Home
            </Link> */}

            {!token ? (
              <>
                <Link
                  to="/login"
                  className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
