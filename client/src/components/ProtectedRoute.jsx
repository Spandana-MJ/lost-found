// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children, adminOnly }) {
//   const token = sessionStorage.getItem("token");
//   const fetchItems = async () => {
//   try {
//     setLoading(true);
//     const res = await API.get("/api/items", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setItems(res.data);
//   } catch (err) {
//     if (err.response?.status === 401) {
//       alert("Session expired. Please log in again.");
//       sessionStorage.clear();
//       navigate("/login");
//     } else {
//       alert(err.response?.data?.message || "Error loading items");
//     }
//   } finally {
//     setLoading(false);
//   }
// };
//   const role = sessionStorage.getItem("role");

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   if (adminOnly && role !== "admin") {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }




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
