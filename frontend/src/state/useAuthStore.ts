"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  email: string | null;
  setAuth: (token: string, email: string) => void;
  reset: () => void;
};

export const useAuthStore = create<
  AuthState,
  [["zustand/persist", AuthState]]
>(
  persist(
    (set) => ({
      token: null,
      email: null,
      setAuth: (token, email) => set({ token, email }),
      reset: () => set({ token: null, email: null }),
    }),
    {
      name: "careeriq-auth",
    }
  )
);
