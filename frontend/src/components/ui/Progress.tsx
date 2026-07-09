"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0 to 100
  height?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  height = 6,
  className = "",
}) => {
  const boundedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`w-full bg-white/[0.03] border border-white/[0.04] rounded-full overflow-hidden ${className}`}
      style={{ height }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${boundedValue}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
};

interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 60,
  strokeWidth = 5,
  color = "var(--color-primary)",
  className = "",
}) => {
  const boundedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (boundedValue / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className={`transform -rotate-90 ${className}`}
    >
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255, 255, 255, 0.04)"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      {/* Foreground circle */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        strokeLinecap="round"
        style={{
          filter: `drop-shadow(0 0 3px ${color})`,
        }}
      />
    </svg>
  );
};

