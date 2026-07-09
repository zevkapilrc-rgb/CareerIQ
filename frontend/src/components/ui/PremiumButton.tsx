"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface PremiumButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag" | "style"> {
  variant?: "primary" | "secondary" | "ghost" | "glow";
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  variant = "primary",
  size = "md",
  magnetic = true,
  children,
  className = "",
  style = {},
  disabled,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || disabled) return;
    const { clientX, clientY } = e;
    const target = buttonRef.current;
    if (!target) return;
    const { left, top, width, height } = target.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    // limit coordinate displacement to max 8px
    const force = 0.2;
    setPosition({ x: x * force, y: y * force });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  let baseClass = "relative inline-flex items-center justify-center font-semibold font-sans tracking-wide transition-all select-none overflow-hidden duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  let variantClass = "";
  if (variant === "primary") {
    variantClass = "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-[var(--text-dark)] shadow-[0_4px_20px_rgba(122,23,48,0.25)] hover:shadow-[0_8px_30px_rgba(122,23,48,0.4)] border border-transparent hover:border-white/10";
  } else if (variant === "secondary") {
    variantClass = "bg-white/[0.03] text-[var(--text)] border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.15] shadow-sm";
  } else if (variant === "ghost") {
    variantClass = "bg-transparent text-zinc-400 hover:text-[var(--text)] hover:bg-white/[0.03]";
  } else if (variant === "glow") {
    variantClass = "bg-transparent text-[var(--text)] border border-[var(--color-primary)] shadow-[0_0_15px_rgba(122,23,48,0.2)] hover:shadow-[0_0_25px_rgba(122,23,48,0.4)] hover:bg-[var(--color-primary)]/10"
  }

  let sizeClass = "";
  if (size === "sm") {
    sizeClass = "h-8 px-4 text-xs rounded-lg gap-1.5";
  } else if (size === "md") {
    sizeClass = "h-11 px-6 text-sm rounded-xl gap-2";
  } else if (size === "lg") {
    sizeClass = "h-13 px-8 text-base rounded-2xl gap-2.5";
  }

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled}
      style={style}
      {...props}
    >
      {/* Ripple/Glow background effect */}
      {variant === "primary" && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default PremiumButton;

