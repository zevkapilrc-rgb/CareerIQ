"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface PinRevealSectionProps {
  title: string;
  description: string;
  stages: Array<{ label: string; detail: string }>;
}

export function PinRevealSection({ title, description, stages }: PinRevealSectionProps) {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState(0);

  const safeStages = useMemo(() => stages.slice(0, 3), [stages]);

  useEffect(() => {
    if (!sectionRef.current || !cardRef.current || !stageRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "+=1200",
          scrub: 0.8,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const nextProgress = self.progress;
            setProgress(nextProgress);
            const index = Math.min(safeStages.length - 1, Math.floor(nextProgress * safeStages.length));
            setActiveStage(index);
          },
        },
      });

      tl.fromTo(
        cardRef.current,
        { y: 28, opacity: 0.7, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6 }
      );

      tl.to(stageRef.current, { y: -8, scale: 1.01, duration: 0.3 }, ">-0.2");
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, safeStages.length]);

  return (
    <section ref={sectionRef} className="py-24 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
      <div className="rounded-[2rem] border border-white/10 bg-[rgba(247,244,236,0.03)] p-6 sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: "var(--accent)" }}>
              Pin-and-Reveal Demo
            </p>
            <h3 className="text-3xl sm:text-4xl font-black font-display tracking-tight mb-4" style={{ color: "var(--text)" }}>
              {title}
            </h3>
            <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {description}
            </p>
            <div className="mt-6 h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.round(progress * 100)}%`, background: "linear-gradient(90deg, var(--accent), var(--teal))" }} />
            </div>
          </div>

          <div ref={cardRef} className="rounded-[1.5rem] border border-white/10 bg-[#0d0a0e] p-5 shadow-[0_20px_55px_rgba(0,0,0,0.25)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--text-muted)" }}>
                  Live ATS Simulator
                </p>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  Stage {activeStage + 1} of {safeStages.length}
                </p>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold" style={{ color: "var(--teal)" }}>
                {Math.round(progress * 100)}%
              </div>
            </div>

            <div ref={stageRef} className="rounded-[1.25rem] border border-white/10 bg-[rgba(247,244,236,0.04)] p-4">
              <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: "var(--accent)" }}>
                {safeStages[activeStage]?.label}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-sub)" }}>
                {safeStages[activeStage]?.detail}
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {safeStages.map((stage, index) => (
                <div key={stage.label} className="rounded-xl border border-white/10 p-3 text-left" style={{ background: index === activeStage ? "rgba(128,0,32,0.14)" : "rgba(255,255,255,0.02)" }}>
                  <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: index === activeStage ? "var(--accent)" : "var(--text-muted)" }}>
                    {stage.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
