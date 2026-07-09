"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CSSProperties, ReactNode } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  initialX?: number;
  initialY?: number;
  rotation?: number;
  delay?: number;
  depth?: number;
}

export function FloatingCard({
  children,
  className = "",
  style,
  initialX = 0,
  initialY = 0,
  rotation = 0,
  delay = 0,
  depth = 1,
}: FloatingCardProps) {
  const reducedMotion = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 120, damping: 18 });
  const springY = useSpring(y, { stiffness: 120, damping: 18 });
  const rotateX = useTransform(y, [-80, 80], [6, -6]);
  const rotateY = useTransform(x, [-80, 80], [-6, 6]);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(px * 16 * depth);
    y.set(py * 16 * depth);
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
        transformPerspective: 1400,
      }}
      initial={reducedMotion ? { opacity: 1, x: 0, y: 0, rotate: rotation } : { opacity: 0, x: initialX, y: initialY, rotate: rotation }}
      animate={reducedMotion ? { opacity: 1, x: 0, y: 0, rotate: rotation } : {
        opacity: 1,
        x: [initialX, initialX + 6, initialX],
        y: [initialY, initialY - 10, initialY],
        rotate: [rotation, rotation + 2, rotation],
        scale: [1, 1.015, 1],
      }}
      transition={reducedMotion ? { duration: 0.4, type: "spring", stiffness: 100 } : {
        duration: 5.2 + delay,
        delay,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        type: "spring",
        stiffness: 90,
      }}
      whileHover={reducedMotion ? { scale: 1.01 } : { scale: 1.03, y: -4, boxShadow: "0 24px 50px rgba(128,0,32,0.25)" }}
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
