
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaClipboardList, FaListAlt, FaUserShield, FaHome } from "react-icons/fa";

export default function Sidebar() {
  const role = sessionStorage.getItem("role");
  const location = useLocation();

  const links = [
    { to: "/report", label: "Report Item", icon: <FaClipboardList /> },
    { to: "/listings", label: "View Listings", icon: <FaListAlt /> },
  ];

  if (role === "admin") {
    links.push({ to: "/admin", label: "Admin Dashboard", icon: <FaUserShield /> });
  }

  return (
    <aside
      className="h-screen w-64 p-6 bg-gradient-to-br from-emerald-500/80 via-green-400/60 to-teal-400/80 
                 backdrop-blur-xl border-r border-white/30 shadow-xl rounded-r-3xl text-white flex flex-col justify-between"
    >
      <div>
        {/* Logo Section */}
        <div className="text-center mb-10">
          <Link to="/" className="flex items-center justify-center gap-2">
            <FaHome className="text-3xl drop-shadow-lg" />
            <h1 className="text-2xl font-extrabold tracking-wide drop-shadow-sm">
              Lost & Found
            </h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="space-y-3">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
                    active
                      ? "bg-white/30 backdrop-blur-md shadow-inner text-white border border-white/40"
                      : "hover:bg-white/20 hover:shadow-md"
                  }`}
                >
                  <span className="text-2xl">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-white/80 mt-8">
        <p>© 2025 Lost & Found</p>
      </div>
    </aside>
  );
}

