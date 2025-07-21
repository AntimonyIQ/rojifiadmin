import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import env  from "./env";



const apiInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  // withCredentials: true,
});

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("rojifi_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("token expired:", error.response.status);

      localStorage.removeItem("rojifi_admin_token");
      useAuthStore.getState().clearAuth();

      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export { apiInstance };
