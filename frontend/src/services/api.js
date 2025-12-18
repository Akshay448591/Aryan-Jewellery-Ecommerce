import axios from "axios";

const api = axios.create({
  baseURL: "https://aryan-jewellery-ecommerce-backend.onrender.com/api",
});

// Add token automatically to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user")); // ✅ matches AuthContext
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
