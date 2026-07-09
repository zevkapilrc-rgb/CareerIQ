"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean;
  glow?: boolean;
  gradientBorder?: boolean;
  animate?: boolean;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  hoverLift = true,
  glow = false,
  gradientBorder = true,
  animate = true,
  children,
  className = "",
  style = {},
  ...props
}) => {
  const baseClasses = `
    relative
    overflow-hidden
    rounded-xl
    p-6
    bg-white/[0.015]
    backdrop-blur-xl
    border
    border-white/[0.06]
    shadow-lg
    transition-all
    duration-300
    ${glow ? "shadow-[0_0_30px_rgba(109,0,26,0.12)] border-[var(--color-primary)]/30" : ""}
    ${gradientBorder ? "before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-br before:from-white/10 before:to-transparent before:rounded-xl before:-z-10" : ""}
  `;

  const motionProps = animate && hoverLift
    ? {
        whileHover: { y: -4, backgroundColor: "rgba(255, 255, 255, 0.035)", borderColor: "rgba(109, 0, 26, 0.25)" },
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
      }
    : {};

  if (animate) {
    return (
      <motion.div
        className={`${baseClasses} ${className}`}
        style={style}
        {...motionProps}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;

