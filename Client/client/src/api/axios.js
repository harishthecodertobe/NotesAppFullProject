import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
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