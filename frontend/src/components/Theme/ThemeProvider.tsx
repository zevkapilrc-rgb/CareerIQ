"use client";

import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("hirevix-theme");
  return stored === "light" ? "light" : "dark";
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("hirevix-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    if (typeof document === "undefined") return;

    document.documentElement.classList.add("theme-transition");

    const overlay = document.createElement("div");
    overlay.id = "theme-wipe-overlay";
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 99999; pointer-events: none;
      background: ${theme === "dark" ? "rgba(250, 247, 245, 0.18)" : "rgba(13, 10, 12, 0.18)"};
      clip-path: circle(0% at 50% 0%);
      transition: clip-path 360ms cubic-bezier(0.25, 1, 0.5, 1);
    `;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.clipPath = "circle(150% at 50% 0%)";
    });

    setTheme((current) => (current === "dark" ? "light" : "dark"));

    setTimeout(() => {
      overlay.remove();
      document.documentElement.classList.remove("theme-transition");
    }, 400);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
