"use client";

import React, { ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type FeatureScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Controls which side the image should slide in from. */
  imageSide?: "left" | "right";
  /** How far the image slides on reveal. */
  imageOffset?: number;
  /** How far the text lifts on reveal. */
  textOffset?: number;
};

/**
 * Reveal wrapper for feature sections using GSAP + ScrollTrigger.
 *
 * Markup expectation (flex or grid columns):
 * - First child with `data-feature-image` gets image reveal.
 * - First child with `data-feature-text` gets text reveal.
 *
 * Example:
 * <FeatureScrollReveal>
 *   <div data-feature-image>...</div>
 *   <div data-feature-text>...</div>
 * </FeatureScrollReveal>
 */
export function FeatureScrollReveal({
  children,
  className = "",
  imageSide = "left",
  imageOffset = 60,
  textOffset = 20,
}: FeatureScrollRevealProps) {
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const root = rootRef.current!;
      const imageEl = root.querySelector<HTMLElement>("[data-feature-image]");
      const textEl = root.querySelector<HTMLElement>("[data-feature-text]");

      if (!imageEl || !textEl) return;

      gsap.set(imageEl, {
        x: imageSide === "left" ? -imageOffset : imageOffset,
        opacity: 0,
      });

      gsap.set(textEl, {
        y: textOffset,
        opacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.to(imageEl, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      }).to(
        textEl,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.45" // ~0.15s image lead
      );
    }, rootRef);

    return () => ctx.revert();
  }, [imageOffset, imageSide, reducedMotion, textOffset]);

  return (
    <section ref={rootRef} className={className}>
      {children}
    </section>
  );
}

