import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach staff token to every request properly
api.interceptors.request.use((config) => {
  // 1. Pehle check karein agar 'staff' object mein token hai
  const staffData = localStorage.getItem("staff");
  let token = null;

  if (staffData) {
    try {
      const parsedStaff = JSON.parse(staffData);
      token = parsedStaff?.token || parsedStaff?.tokenString;
    } catch (e) {
      console.error("Error parsing staff data", e);
    }
  }

  // 2. Agar wahan nahi mila, toh direct 'token' key check karein
  if (!token) {
    token = localStorage.getItem("token");
  }

  // 3. Agar token mil gaya, toh Authorization header attach karein
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;