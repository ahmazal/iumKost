import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// attach accessToken automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  // Jangan kirim Authorization untuk login & refresh
  const noAuth = ["/auth/login", "/auth/refresh"];

  if (!noAuth.includes(config.url) && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
