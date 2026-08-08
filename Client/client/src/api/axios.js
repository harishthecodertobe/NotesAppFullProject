import axios from "axios";

// Single source of truth for talking to the backend.
// Every request in the app goes through this instance so baseURL,
// credentials, and error handling are never repeated elsewhere.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send/receive the httpOnly auth cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// Normalizes every error into a single shape { message, status } so
// components never have to dig through error.response.data themselves.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Request never reached the server (server down, no internet, CORS block)
      return Promise.reject({
        message: "Unable to reach the server. Check your connection and try again.",
        status: null,
        isNetworkError: true,
      });
    }

    const { status, data } = error.response;

    return Promise.reject({
      message: data?.message || "Something went wrong. Please try again.",
      status,
      isNetworkError: false,
    });
  }
);

export default api;
