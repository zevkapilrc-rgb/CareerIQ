// ═══════════════════════════════════════════════════════════════
// Hirevix Design System — RouteLine Component
// Renders thin, animated paths linking related modules / cards
// ═══════════════════════════════════════════════════════════════

import React from "react";
import { motion } from "framer-motion";

interface RouteLineProps {
  direction?: "horizontal" | "vertical" | "curved";
  variant?: "amber" | "primary" | "slate";
  animated?: boolean;
  className?: string;
  height?: number | string;
  width?: number | string;
}

export default function RouteLine({
  direction = "horizontal",
  variant = "amber",
  animated = true,
  className = "",
  height = "100%",
  width = "100%"
}: RouteLineProps) {
  const strokeColor =
    variant === "amber"
      ? "var(--color-accent)"
      : variant === "primary"
      ? "var(--color-primary)"
      : "var(--text-muted)";

  const dotColor = variant === "amber" ? "#c9975a" : variant === "primary" ? "#7a1730" : "#5B6B85";

  if (direction === "horizontal") {
    return (
      <div className={`relative h-[1px] w-full min-w-[20px] ${className}`} style={{ height: 1 }}>
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${strokeColor} 20%, ${strokeColor} 80%, transparent 100%)`,
            opacity: 0.25
          }}
        />
        {animated && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full blur-[1px]"
            style={{ backgroundColor: dotColor }}
            animate={{
              left: ["0%", "100%"],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
    );
  }

  if (direction === "vertical") {
    return (
      <div className={`relative w-[1px] h-full min-h-[20px] ${className}`} style={{ width: 1 }}>
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${strokeColor} 20%, ${strokeColor} 80%, transparent 100%)`,
            opacity: 0.25
          }}
        />
        {animated && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full blur-[1px]"
            style={{ backgroundColor: dotColor }}
            animate={{
              top: ["0%", "100%"],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
    );
  }

  // Curved Bezier curve
  return (
    <svg
      className={`overflow-visible pointer-events-none ${className}`}
      width={width}
      height={height}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        d="M 0 50 C 30 50, 70 50, 100 50" // simple curve, can be dynamic
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.3"
      />
    </svg>
  );
}
export { RouteLine };
