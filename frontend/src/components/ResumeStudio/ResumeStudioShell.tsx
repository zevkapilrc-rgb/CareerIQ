"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BarChart, Hammer, UploadCloud, ArrowLeft } from "lucide-react";
import { useAppStore } from "@/src/state/useAppStore";
import CreateTab from "./CreateTab";
import AnalyzeTab from "./AnalyzeTab";
import SealBadge from "./SealBadge";
import { ResumeProfile } from "@/src/types";

const TiltCard: React.FC<{
  onClick: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  cta: string;
}> = ({ onClick, title, description, icon, cta }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Calculate tilt
    const tiltX = -(y / (rect.height / 2)) * 8; // tilt max 8 deg
    const tiltY = (x / (rect.width / 2)) * 8;
    setRotateX(tiltX);
    setRotateY(tiltY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className="group cursor-pointer p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--color-primary)]/40 hover:shadow-[0_0_32px_rgba(122,23,48,0.15)] flex flex-col justify-between min-h-[300px] transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full filter blur-2xl pointer-events-none group-hover:bg-[var(--color-primary)]/10 transition-all duration-300" />
      <div style={{ transform: "translateZ(30px)" }}>
        <div className="p-4 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h2 className="text-2xl font-extrabold text-[var(--text)] font-display uppercase tracking-wide">
          {title}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-3 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-2 mt-8 text-xs font-bold text-[var(--color-accent)] uppercase tracking-widest" style={{ transform: "translateZ(20px)" }}>
        <span>{cta}</span>
        <span className="group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
      </div>
    </motion.div>
  );
};

export const ResumeStudioShell: React.FC = () => {
  const [viewState, setViewState] = useState<"landing" | "create" | "analyze">("landing");
  const [draftProfile, setDraftProfile] = useState<ResumeProfile | null>(null);
  const { profile } = useAppStore();

  // Load draft profile from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("ciq-studio-profile");
      if (cached) {
        try {
          setDraftProfile(JSON.parse(cached));
        } catch (e) {
          console.error("Failed to parse cached studio profile", e);
        }
      }
    }
  }, []);

  const handleProfileChange = (newProfile: ResumeProfile | null) => {
    setDraftProfile(newProfile);
    if (newProfile) {
      localStorage.setItem("ciq-studio-profile", JSON.stringify(newProfile));
    } else {
      localStorage.removeItem("ciq-studio-profile");
    }
  };

  const currentScore = draftProfile
    ? draftProfile.atsScore
    : profile?.resumeAnalysis?.scores?.overallResumeScore?.score ||
      profile?.resumeAnalysis?.scores?.atsScore?.score ||
      0;

  return (
    <div className="relative min-h-[calc(100vh-120px)] w-full py-8 px-4 max-w-[1400px] mx-auto">
      {/* Background glow elements */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)]/5 rounded-full filter blur-[150px] pointer-events-none animate-pulse"
        style={{ animationDuration: "6s" }}
      />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-[var(--color-accent)]/3 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-[var(--border)] relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {viewState !== "landing" && (
              <button
                onClick={() => setViewState("landing")}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-sub)] transition-colors mr-2 cursor-pointer"
              >
                <ArrowLeft size={12} />
                <span>Back</span>
              </button>
            )}
            <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[9px] font-extrabold text-[var(--color-accent)] uppercase tracking-widest font-display">
              <Sparkles size={11} className="text-[var(--color-accent)]" />
              HIREVIX AI v4
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-bold text-emerald-500">ENGINE ACTIVE</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text)] font-display tracking-tight leading-none">
            Resume <span className="text-[var(--color-primary)]">Forge</span>
          </h1>
          <p className="text-sm text-[var(--text-muted)] font-medium max-w-xl mt-3">
            Elevate your professional narratives. Choose to write and target specific roles with AI, or simulate recruiter scanning patterns to verify your metrics.
          </p>
        </div>

        {/* Live ATS Score Badge */}
        {currentScore > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 pr-6 backdrop-blur-md"
          >
            <SealBadge score={currentScore} size={70} />
            <div>
              <span className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-widest block font-mono">
                Live ATS Score
              </span>
              <span className="text-sm font-extrabold text-[var(--text)] block mt-0.5 font-display">
                {currentScore >= 75 ? "Highly Compatible" : currentScore >= 50 ? "Needs Calibration" : "Critical Action Required"}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
                Debounced calculation running in background
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Viewport content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {viewState === "landing" ? (
            <motion.div
              key="landing-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto py-12"
            >
              <TiltCard
                onClick={() => setViewState("create")}
                title="Build Your Resume"
                description="Create from scratch or import existing. Personalize using live AI feedback and export instantly."
                icon={<Hammer size={32} />}
                cta="Start Building"
              />
              <TiltCard
                onClick={() => setViewState("analyze")}
                title="Analyze Your Resume"
                description="Upload and get instant ATS + quality scoring. Trace recruiter eye-tracking matrix scanning patterns."
                icon={<BarChart size={32} />}
                cta="Run Scan Analysis"
              />
            </motion.div>
          ) : viewState === "create" ? (
            <motion.div
              key="create-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <CreateTab
                draftProfile={draftProfile}
                onProfileChange={handleProfileChange}
              />
            </motion.div>
          ) : (
            <motion.div
              key="analyze-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <AnalyzeTab
                draftProfile={draftProfile}
                onProfileChange={handleProfileChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResumeStudioShell;
