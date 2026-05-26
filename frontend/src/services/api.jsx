import axios from "axios"

const api = axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL: "http://localhost:9090/api",
});

// automatically attaches JWT to every request

// handles outgoing requests
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

// handles incoming responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginPage = window.location.pathname === "/login";

    if (error.response?.status === 401 && !isLoginPage) {
      console.warn("Session expired. Redirecting...");
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;