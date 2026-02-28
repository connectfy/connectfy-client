import { create } from "zustand";

interface AuthState {
  access_token: string | null;
  authenticateToken: string | null;
  setToken: ({
    type,
    token,
  }: {
    type: "access_token" | "authenticateToken";
    token: string;
  }) => void;
  clear: (type: "access_token" | "authenticateToken" | "all") => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  access_token: localStorage.getItem("access_token"),
  authenticateToken: null,

  setToken: ({ type, token }) => {
    if (type === "access_token") {
      localStorage.setItem("access_token", token);
      set({ access_token: token });
    } else {
      set({ authenticateToken: token });
    }
  },

  clear: (type) => {
    if (type === "access_token" || type === "all") {
      localStorage.removeItem("access_token");
      set({ access_token: null });
    }
    if (type === "authenticateToken" || type === "all") {
      set({ authenticateToken: null });
    }
  },
}));
