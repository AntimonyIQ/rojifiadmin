import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: any;
  token: string | null;
  setAuth: (user: any, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem("rojifi_admin_token", token);
        set({ user, token });
      },
      clearAuth: () => {
        localStorage.removeItem("rojifi_admin_token");
        set({ user: null, token: null });
      },
    }),
    { name: "auth-storage" }
  )
);
