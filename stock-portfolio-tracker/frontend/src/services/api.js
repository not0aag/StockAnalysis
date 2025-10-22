import axios from "axios";

// Use relative URL for production (Vercel), localhost for development
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5000/api");

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || "An error occurred";

      // Handle token expiration
      if (error.response.status === 401) {
        const errorMsg = error.response.data?.error || "";
        if (errorMsg.includes("expired") || errorMsg.includes("invalid")) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }

      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    } else {
      // Error in request setup
      return Promise.reject(new Error(error.message));
    }
  }
);

export default api;
