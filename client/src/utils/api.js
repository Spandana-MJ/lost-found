import axios from "axios";

  // baseURL: import.meta.env.VITE_API_URL,
 

const API = axios.create({
//  baseURL: "http://localhost:5000",
baseURL:"https://lost-found-5.onrender.com",
});


API.interceptors.request.use((req) => {
  const token = sessionStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;




