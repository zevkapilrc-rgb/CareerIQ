"use client";

import { motion } from "framer-motion";

export function BackgroundBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[var(--color-primary)]/25 blur-3xl"
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 20, 0], scale: [1, 1.05, 0.98, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-5%] top-1/3 h-80 w-80 rounded-full bg-[var(--color-accent)]/20 blur-3xl"
        animate={{ x: [0, -40, 20, 0], y: [0, 25, -15, 0], scale: [1, 0.95, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-1/3 h-64 w-64 rounded-full bg-slate-900/40 blur-3xl"
        animate={{ x: [0, 20, -15, 0], y: [0, -10, 25, 0], scale: [1, 1.02, 0.96, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:72px_72px]" />
    </div>
  );
}

export default BackgroundBlobs;
