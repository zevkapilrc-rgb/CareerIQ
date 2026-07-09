"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ReactNode } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  radius?: number;
  onClick?: () => void;
}

export function MagneticButton({ children, className = "", style, radius = 40, onClick }: MagneticButtonProps) {
  const reducedMotion = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 20 });
  const springY = useSpring(y, { stiffness: 180, damping: 20 });

  const handleMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);
    const strength = Math.max(0, 1 - distance / radius);
    x.set(dx * 0.12 * strength);
    y.set(dy * 0.12 * strength);
  };

  return (
    <motion.button
      type="button"
      className={className}
      style={{ ...style, x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={onClick}
      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      whileHover={reducedMotion ? { scale: 1.01 } : { scale: 1.02 }}
    >
      {children}
    </motion.button>
  );
}
