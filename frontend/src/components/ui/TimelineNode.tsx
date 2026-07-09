"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TimelineNodeProps {
  label: string;
  title: string;
  subtitle?: string;
  isCompleted?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const TimelineNode: React.FC<TimelineNodeProps> = ({
  label,
  title,
  subtitle,
  isCompleted = false,
  isActive = false,
  onClick,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    if (children) {
      setIsOpen(!isOpen);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="relative pl-8 pb-8 last:pb-0 flex flex-col group">
      {/* Connector Line */}
      <div className="absolute left-[9px] top-4 bottom-0 w-[2px] bg-white/[0.04] group-last:hidden" />

      {/* Node Bullet */}
      <button
        onClick={toggleOpen}
        className={`absolute left-0 top-1 w-5 h-5 rounded-full flex items-center justify-center border z-10 transition-all duration-300 outline-none ${
          isCompleted
            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
            : isActive
            ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-accent)] shadow-[0_0_8px_rgba(122,23,48,0.3)] animate-pulse"
            : "bg-[#09090B] border-white/10 text-zinc-500 hover:border-zinc-500"
        }`}
      >
        {isCompleted ? (
          <Check className="w-3 h-3" />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
        )}
      </button>

      {/* Node Content */}
      <div
        onClick={toggleOpen}
        className={`flex flex-col gap-1 cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
          isActive
            ? "bg-white/[0.02] border-[var(--color-primary)]/20"
            : "bg-[#09090B]/45 border-transparent hover:bg-white/[0.01] hover:border-white/[0.04]"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
            {label}
          </span>
          {children && (
            <div className="text-zinc-500 hover:text-[var(--text)] transition-colors">
              {isOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          )}
        </div>
        <h4 className="text-sm font-bold text-[var(--text)] tracking-tight font-display mt-0.5">
          {title}
        </h4>
        {subtitle && (
          <p className="text-xs text-zinc-400 leading-relaxed">
            {subtitle}
          </p>
        )}

        <AnimatePresence>
          {isOpen && children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden mt-4 pt-4 border-t border-white/[0.05]"
              onClick={(e) => e.stopPropagation()} // Prevent parent collapse toggle
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimelineNode;

