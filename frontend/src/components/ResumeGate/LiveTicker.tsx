"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const messages = [
  "AI hiring demand up 18% in frontend roles",
  "React + TypeScript openings are accelerating",
  "Career-path unlocks now take ~12 seconds",
  "Skill-gap insights refreshed every 5 minutes",
];

export function LiveTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % messages.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_12px_rgba(122,23,48,0.75)]" />
        <div className="relative min-h-6 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={messages[index]}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="whitespace-nowrap text-xs font-medium tracking-wide text-slate-200"
            >
              {messages[index]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default LiveTicker;
