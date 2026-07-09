"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CSSProperties, ReactNode } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  glow?: boolean;
}

export function TiltCard({ children, className = "", style, glow = false }: TiltCardProps) {
  const reducedMotion = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 140, damping: 16 });
  const springY = useSpring(y, { stiffness: 140, damping: 16 });
  const rotateX = useTransform(y, [-80, 80], [6, -6]);
  const rotateY = useTransform(x, [-80, 80], [-6, 6]);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(px * 70);
    y.set(py * 70);
  };

  return (
    <motion.div
      className={className}
      style={{
        ...style,
        x: springX,
        y: springY,
        rotateX,
        rotateY,
        transformPerspective: 1100,
        boxShadow: reducedMotion ? undefined : glow ? "0 16px 40px rgba(128,0,32,0.18)" : undefined,
      }}
      whileHover={reducedMotion ? { scale: 1.01 } : { scale: 1.02, y: -6, boxShadow: glow ? "0 24px 55px rgba(128,0,32,0.24)" : "0 20px 44px rgba(15,15,15,0.25)" }}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
