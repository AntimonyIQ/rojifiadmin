import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import env  from "./env";
import { session } from "@/session/session";

const apiInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  // withCredentials: true,
});

apiInstance.interceptors.request.use((config) => {
  // Try to get token from session first, then fall back to localStorage
  const sessionData = session.getUserData();
  let token: string | null = sessionData?.authorization || null;
  
  if (!token) {
    token = localStorage.getItem("rojifi_admin_token");
  }
  
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

      // Clear both localStorage token and session
      localStorage.removeItem("rojifi_admin_token");
      session.logout();
      useAuthStore.getState().clearAuth();

      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export { apiInstance };
