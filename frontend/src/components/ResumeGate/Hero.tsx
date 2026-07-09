"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass, Sparkles, Zap, Upload } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/src/state/useAppStore";
import { LiveTicker } from "./LiveTicker";
import { Button } from "@/src/components/ui/Button";

interface HeroProps {
  onDemoUnlock: () => void;
  onUploadFocus: () => void;
}

export function Hero({ onDemoUnlock, onUploadFocus }: HeroProps) {
  const { profile } = useAppStore();

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/70 p-8 shadow-[0_30px_120px_rgba(2,6,23,0.45)] sm:p-10 lg:p-12">
      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-primary-light)]">
              <Sparkles className="mr-2 inline h-3.5 w-3.5" />
              Live AI Career Unlock
            </span>
            <LiveTicker />
          </div>

          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Unlock Career Path AI
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Turn your resume into a live growth engine with personalized pathways, skill-gap intelligence, and recruiter-ready insights.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onUploadFocus}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_40px_rgba(122,23,48,0.24)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <Upload size={16} />
              Upload Resume
            </button>
            <button
              type="button"
              onClick={onDemoUnlock}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 backdrop-blur-xl transition-all duration-300 hover:bg-white/10"
            >
              <Zap size={16} />
              Demo Profile (Instant Unlock)
            </button>
          </div>

          <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur-xl">
            <span className="font-semibold text-white">2,400+ resumes analyzed today</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary-light)]" />
            <span>Avg. unlock time: 12s</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative flex min-h-[280px] items-center justify-center lg:min-w-[320px]"
        >
          <div className="absolute inset-0 rounded-full bg-[var(--color-primary)]/20 blur-[90px]" />
          <div className="relative flex h-56 w-56 items-center justify-center rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_30px_80px_rgba(3,7,18,0.55)]">
            <div className="absolute inset-4 rounded-[24px] border border-white/10" />
            <Compass className="h-24 w-24 text-[var(--color-primary-light)]" />
            <motion.div
              className="absolute inset-0 rounded-[28px]"
              animate={{ opacity: [0.25, 0.58, 0.25] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ boxShadow: "inset 0 0 70px rgba(45,212,191,0.25)" }}
            />
          </div>
        </motion.div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-400">
        <span>{profile?.name ? `Ready for ${profile.name}` : "Sign in to unlock personalized analysis"}</span>
        <Link href="/profile" className="inline-flex items-center gap-2 font-semibold text-slate-100 transition-colors hover:text-[var(--color-primary-light)]">
          Profile <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

export default Hero;
