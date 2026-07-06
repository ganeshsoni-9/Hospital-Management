import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach staff token (set after Login step) to every request
api.interceptors.request.use((config) => {
  const staff = JSON.parse(localStorage.getItem("staff"));
  if (staff?.token) {
    config.headers.Authorization = `Bearer ${staff.token}`;
  }
  return config;
});

export default api;
