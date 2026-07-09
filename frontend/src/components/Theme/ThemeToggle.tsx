"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-8 w-16 items-center rounded-full border border-[var(--border)] bg-[var(--surface)]/80 p-[3px] backdrop-blur-xl shadow-[0_0_0_1px_rgba(122,23,48,0.08)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 transition-all cursor-pointer"
      aria-label="Toggle Theme"
    >
      <motion.div
        className="relative flex h-[24px] w-[24px] items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white shadow-md"
        layout
        initial={false}
        animate={{ x: isDark ? 0 : 28 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        <motion.div
          className="absolute"
          initial={false}
          animate={{ opacity: isDark ? 0 : 1, rotate: isDark ? -90 : 0, scale: isDark ? 0.6 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Sun size={12} className="text-[var(--color-accent)] stroke-[2.5]" />
        </motion.div>
        <motion.div
          className="absolute"
          initial={false}
          animate={{ opacity: isDark ? 1 : 0, rotate: isDark ? 0 : 90, scale: isDark ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
        >
          <Moon size={12} className="text-[var(--color-accent)] stroke-[2.5]" />
        </motion.div>
      </motion.div>
    </button>
  );
}
