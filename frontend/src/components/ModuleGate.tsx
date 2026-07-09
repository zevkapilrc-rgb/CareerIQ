"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ModuleGateProps {
  title: string;
  eyebrow: string;
  description: string;
  icon: ReactNode;
  accentColor?: string;
  badge?: string;
  children: ReactNode;
}

export function ModuleGate({
  title,
  eyebrow,
  description,
  icon,
  accentColor = "rgba(128, 0, 32, 0.18)",
  badge,
  children,
}: ModuleGateProps) {
  return (
    <div className="relative min-h-[80vh] overflow-hidden rounded-[32px] border border-white/10 bg-[var(--surface)] px-4 py-6 shadow-[var(--shadow-lg)] sm:px-6 lg:px-8 xl:px-10">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at top left, ${accentColor}, transparent 30%)`,
        }}
      />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-[var(--accent)]">
              {icon}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">{eyebrow}</p>
              <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {badge ? (
              <div className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-[var(--text-muted)]">
                {badge}
              </div>
            ) : null}
            <div className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-[var(--text-muted)]">
              Personalized experience ready
            </div>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="rounded-[28px] border border-white/10 bg-black/20 p-4 backdrop-blur-xl sm:p-6"
        >
          <div className="mb-5 max-w-2xl">
            <p className="text-sm leading-7 text-[var(--text-muted)]">{description}</p>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export default ModuleGate;
