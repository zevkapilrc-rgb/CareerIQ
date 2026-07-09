"use client";

import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right" | "up";
  delay?: number;
  once?: boolean;
}

export function ScrollReveal({ children, className = "", direction = "up", delay = 0, once = true }: ScrollRevealProps) {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  const variants = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? -60 : direction === "right" ? 60 : 0,
      y: direction === "up" ? 24 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reducedMotion ? "visible" : "hidden"}
      animate={isInView || reducedMotion ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: reducedMotion ? 0.2 : 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
