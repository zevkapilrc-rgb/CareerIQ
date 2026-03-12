"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-9 w-16 items-center rounded-full border border-white/10 bg-plum/80 px-1 text-xs shadow-sm"
    >
      <span className="flex-1 text-center text-[10px]">Dark</span>
      <span className="flex-1 text-center text-[10px]">Light</span>
      <motion.div
        layout
        className="absolute h-7 w-7 rounded-full bg-primary/80 shadow-md"
        initial={false}
        animate={{
          x: theme === "dark" ? 2 : 30,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </button>
  );
}



