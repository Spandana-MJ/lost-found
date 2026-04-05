
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

const PUBLIC_PATHS = ["/", "/login", "/signup", "/browse"];

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const is401 = error.response?.status === 401;
    const currentPath = window.location.pathname;
    const onPublicPage = PUBLIC_PATHS.includes(currentPath);

    // Prevent redirect during auth-check API call
    const isAuthCheck = error.config?.url?.includes("/api/auth/me");

    if (is401 && !onPublicPage && !isAuthCheck) {
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("email");

      window.dispatchEvent(new Event("loginStateChange"));

      // Redirect only for protected pages
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;
