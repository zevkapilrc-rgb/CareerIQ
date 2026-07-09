"use client";

import React from "react";
import { motion } from "framer-motion";

interface SealBadgeProps {
  score: number;
  size?: number;
  label?: string;
  className?: string;
  showPercent?: boolean;
}

export const SealBadge: React.FC<SealBadgeProps> = ({
  score,
  size = 80,
  label,
  className = "",
  showPercent = true,
}) => {
  const boundedScore = Math.min(100, Math.max(0, score));

  // Determine color theme based on score threshold
  let color = "var(--color-primary)";
  let glowColor = "rgba(122, 23, 48, 0.4)";
  let bgGradient = "from-[var(--color-primary)]/10 to-[var(--color-primary)]/5";

  if (boundedScore < 50) {
    color = "var(--red)";
    glowColor = "rgba(225, 97, 74, 0.4)";
    bgGradient = "from-[var(--red)]/10 to-[var(--red)]/5";
  } else if (boundedScore < 75) {
    color = "var(--accent)";
    glowColor = "rgba(232, 163, 61, 0.4)";
    bgGradient = "from-[var(--accent)]/10 to-[var(--accent)]/5";
  }

  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (boundedScore / 100) * circumference;

  return (
    <div
      className={`relative flex flex-col items-center justify-center font-display ${className}`}
      style={{ width: size, height: size + (label ? 25 : 0) }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer glowing background ring */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr ${bgGradient} border border-white/[0.04]`}
          style={{
            boxShadow: `0 0 15px ${glowColor}, inset 0 0 10px rgba(255, 255, 255, 0.02)`,
          }}
        />

        {/* Circular SVG Gauge */}
        <svg width={size} height={size} className="transform -rotate-90 relative z-10">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth={4}
            fill="transparent"
          />

          {/* Foreground progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={4}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 4px ${color})`,
            }}
          />
        </svg>

        {/* Score text overlay in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl font-extrabold text-white tracking-tight"
            style={{ textShadow: `0 0 8px ${glowColor}` }}
          >
            {boundedScore}
          </motion.span>
          {showPercent && (
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest -mt-1">
              PTS
            </span>
          )}
        </div>
      </div>

      {label && (
        <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mt-2 text-center whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
};

export default SealBadge;
