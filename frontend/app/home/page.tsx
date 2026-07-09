"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/src/state/useAppStore";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { AnimatedCounter } from "@/src/components/animations/AnimatedCounter";
import { FloatingCard } from "@/src/components/animations/FloatingCard";
import { MagneticButton } from "@/src/components/animations/MagneticButton";
import { PinRevealSection } from "@/src/components/animations/PinRevealSection";
import { ScrollReveal } from "@/src/components/animations/ScrollReveal";
import { TiltCard } from "@/src/components/animations/TiltCard";

const ParticleHero = dynamic(() => import("@/src/components/animations/ParticleHero").then((mod) => mod.ParticleHero), {
  ssr: false,
  loading: () => null,
});
import {
  ArrowRight, Sparkles, FileText, Map, Mic2, BookOpen, Briefcase,
  TrendingUp, Globe2, Target, Zap, Shield, CheckCircle2,
  Star, ChevronRight, BarChart3, Dna, Brain, Users, Flame,
} from "lucide-react";

// ── Static Data ────────────────────────────────────────────────

const PILLARS = [
  {
    icon: FileText, label: "Resume Studio", color: "var(--accent)", href: "/resume",
    tagline: "ATS-Perfect in 8 Seconds",
    desc: "Gemini-powered 13-point structural analysis, ATS simulation, and guided rewrites.",
  },
  {
    icon: Map, label: "Career Intel", color: "var(--teal)", href: "/career-path",
    tagline: "Your 6-Month Growth Roadmap",
    desc: "ML-driven role mapping, market gap analysis, and salary trajectory forecasting.",
  },
  {
    icon: Mic2, label: "Interview Prep", color: "var(--accent)", href: "/interview",
    tagline: "Interview Like the Top 1%",
    desc: "Live AI mock interviews with real-time feedback, scoring, and gap tracking.",
  },
  {
    icon: BookOpen, label: "Growth Hub", color: "var(--teal)", href: "/learning",
    tagline: "97 Course Streams & XP Rewards",
    desc: "Curated learning paths aligned to your skill gaps and target role requirements.",
  },
  {
    icon: Briefcase, label: "Jobs", color: "var(--accent)", href: "/global-scanner",
    tagline: "85K+ Live Roles Matched",
    desc: "Real-time global job crawler matched against your profile across 15 markets.",
  },
];

const STATS = [
  { value: 85000, label: "Live Job Matches", suffix: "+", icon: Briefcase },
  { value: 98, label: "ATS Accuracy Rate", suffix: "%", icon: Target },
  { value: 13, label: "AI Analysis Points", icon: Brain },
  { value: 97, label: "Course Streams", icon: BookOpen },
];

const HERO_PREVIEWS = [
  { title: "Executive", accent: "#8c1233", rotation: -7, initialX: -40, initialY: 12, delay: 0.2, depth: 1.05 },
  { title: "Product", accent: "#d8a55c", rotation: 6, initialX: 45, initialY: -10, delay: 0.45, depth: 1.1 },
  { title: "Growth", accent: "#e6b45d", rotation: -4, initialX: -24, initialY: -50, delay: 0.65, depth: 0.95 },
  { title: "Launch", accent: "#a51d3b", rotation: 8, initialX: 38, initialY: 42, delay: 0.85, depth: 0.9 },
];

const TESTIMONIALS = [
  {
    name: "Priya Menon", title: "Senior Engineer → Staff SWE at Stripe",
    text: "HIREVIX gave me the ATS breakdown nobody else would. Went from 3 callbacks in 6 months to 3 in one week.",
    stars: 5, avatar: "PM",
  },
  {
    name: "Carlos Vega", title: "Data Analyst → ML Engineer at Anthropic",
    text: "The skill-gap analysis was surgical. I knew exactly what to build and HIREVIX's learning paths helped me close it fast.",
    stars: 5, avatar: "CV",
  },
  {
    name: "Aisha Okonkwo", title: "Product Manager at Google",
    text: "Interview Prep alone was worth everything. The AI coach gave me feedback that felt like coaching from someone who had done 1,000 interviews.",
    stars: 5, avatar: "AO",
  },
];

const PIPELINE = [
  { step: "01", title: "Upload & Scan", desc: "Gemini runs 13-point structural + keyword evaluation.", time: "~8s", icon: FileText },
  { step: "02", title: "Skill DNA Map", desc: "Competency node graph reveals your strength topology.", time: "~3s", icon: Dna },
  { step: "03", title: "Gap Detection", desc: "Your nodes vs. live industry benchmarks surface gaps.", time: "~2s", icon: BarChart3 },
  { step: "04", title: "Simulate & Close", desc: "Mock interviews and courses close your identified gaps.", time: "Ongoing", icon: Mic2 },
];

// ── Animated Orb ───────────────────────────────────────────────

function HeroOrb() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary orb */}
      <div
        className="absolute top-[-20%] left-[40%] w-[900px] h-[900px] rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(46,156,147,0.12) 0%, rgba(232,163,61,0.06) 35%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orbFloat 12s ease-in-out infinite alternate",
        }}
      />
      {/* Secondary orb */}
      <div
        className="absolute bottom-[-10%] right-[5%] w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(232,163,61,0.08) 0%, transparent 65%)",
          filter: "blur(80px)",
          animation: "orbFloat 15s ease-in-out infinite alternate-reverse",
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(247,244,236,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(247,244,236,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

// ── Stat Counter ───────────────────────────────────────────────

function StatBadge({ value, label, icon: Icon, prefix = "", suffix = "" }: { value: number; label: string; icon: any; prefix?: string; suffix?: string }) {
  return (
    <div
      className="flex flex-col items-center gap-1 px-5 py-4 rounded-xl"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <Icon size={16} style={{ color: "var(--accent)" }} />
      <AnimatedCounter value={value} prefix={prefix} suffix={suffix} className="text-2xl font-bold font-display" />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-center" style={{ color: "var(--text-muted)" }}>{label}</span>
    </div>
  );
}

function HeroPreviewCard({ title, accent, rotation, initialX, initialY, delay, depth }: { title: string; accent: string; rotation: number; initialX: number; initialY: number; delay: number; depth: number }) {
  return (
    <FloatingCard
      className="absolute hidden sm:block"
      style={{ width: 180, top: "50%", left: "50%" }}
      initialX={initialX}
      initialY={initialY}
      rotation={rotation}
      delay={delay}
      depth={depth}
    >
      <div className="rounded-[1.2rem] border border-white/10 bg-[#120a0e]/95 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.3)] backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--text-muted)" }}>{title}</div>
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
        </div>
        <div className="space-y-2 rounded-[0.95rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-2.5">
          <div className="h-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-3/4 rounded-full bg-white/10" />
          <div className="h-14 rounded-[0.85rem] border border-white/10 p-2" style={{ background: `linear-gradient(145deg, ${accent}30, transparent)` }}>
            <div className="h-full w-full rounded-[0.6rem] border border-white/10" style={{ background: `linear-gradient(135deg, ${accent}88, rgba(255,255,255,0.08))` }} />
          </div>
          <div className="h-2 w-2/3 rounded-full bg-white/10" />
        </div>
      </div>
    </FloatingCard>
  );
}

// ── Pillar Card ────────────────────────────────────────────────

function PillarCard({ pillar, index }: { pillar: typeof PILLARS[0]; index: number }) {
  const Icon = pillar.icon;
  return (
    <ScrollReveal direction="up" delay={index * 0.06}>
      <TiltCard glow className="h-full">
        <Link href={pillar.href} className="group block h-full">
          <div
            className="h-full p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300 group-hover:-translate-y-1"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${pillar.color}18`, border: `1px solid ${pillar.color}30` }}
            >
              <Icon size={18} style={{ color: pillar.color }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 font-display" style={{ color: pillar.color }}>
                {pillar.label}
              </p>
              <h3 className="text-base font-bold font-display mb-2" style={{ color: "var(--text)" }}>
                {pillar.tagline}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {pillar.desc}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-auto text-xs font-semibold font-display transition-all" style={{ color: pillar.color }}>
              <span>Explore</span>
              <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </Link>
      </TiltCard>
    </ScrollReveal>
  );
}

// ── Testimonial ────────────────────────────────────────────────

function TestimonialCard({ t, index }: { t: typeof TESTIMONIALS[0]; index: number }) {
  return (
    <TiltCard glow className="h-full">
      <div
        className="flex h-full flex-col gap-4 p-6 rounded-2xl"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex gap-0.5">
          {Array.from({ length: t.stars }).map((_, i) => (
            <Star key={i} size={12} fill="var(--accent)" style={{ color: "var(--accent)" }} />
          ))}
        </div>
        <p className="text-sm leading-relaxed italic" style={{ color: "var(--text-sub)" }}>
          &quot;{t.text}&quot;
        </p>
        <div className="flex items-center gap-3 mt-auto">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold font-display shrink-0"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--teal))", color: "var(--bg)" }}
          >
            {t.avatar}
          </div>
          <div>
            <p className="text-xs font-bold font-display" style={{ color: "var(--text)" }}>{t.name}</p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{t.title}</p>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

// ── Main Page ──────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const { role } = useAppStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (role !== "guest") router.replace("/dashboard");
  }, [role, router]);

  if (role !== "guest") return null;

  return (
    <div className="relative overflow-x-hidden" style={{ color: "var(--text)" }}>
      <style>{`
        @keyframes orbFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -40px) scale(1.05); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <HeroOrb />
        <ParticleHero />
        <div className="absolute inset-0 z-0">
          {HERO_PREVIEWS.map((preview) => (
            <HeroPreviewCard key={preview.title} {...preview} />
          ))}
        </div>
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 max-w-4xl">
          {/* Pre-badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest font-display"
            style={{
              background: "rgba(122, 23, 48, 0.12)",
              border: "1px solid rgba(122, 23, 48, 0.24)",
              color: "var(--color-primary-light)",
            }}
          >
            <Sparkles size={10} />
            <span>Powered by Gemini AI · Career Intelligence Platform</span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black font-display leading-[1.05] tracking-tight mb-6"
          >
            Your Resume
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, var(--accent) 0%, var(--teal) 60%, var(--accent) 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "gradientShift 4s ease infinite",
              }}
            >
              Doesn&apos;t Work.
            </span>
            <br />
            <span style={{ color: "var(--text)" }}>Let AI Fix It.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-lg sm:text-xl max-w-2xl leading-relaxed mb-10"
            style={{ color: "var(--text-sub)" }}
          >
            HIREVIX runs a deep 13-point analysis of your resume, maps your skill DNA, detects your gaps against
            live market benchmarks, and builds you a personal roadmap from upload to offer.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link href="/login">
              <MagneticButton
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold font-display transition-all duration-300 hover:shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--teal))",
                  color: "var(--bg)",
                  boxShadow: "0 8px 32px rgba(232,163,61,0.25)",
                }}
              >
                <Sparkles size={15} />
                Analyze My Resume Free
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </MagneticButton>
            </Link>
            <Link href="#how-it-works">
              <MagneticButton
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold font-display transition-all duration-200 hover:bg-white/[0.06]"
                style={{
                  background: "rgba(247, 244, 236, 0.04)",
                  border: "1px solid rgba(247, 244, 236, 0.1)",
                  color: "var(--text-sub)",
                }}
              >
                How It Works
              </MagneticButton>
            </Link>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center gap-5 mt-10 text-[11px] font-semibold"
            style={{ color: "var(--text-muted)" }}
          >
            {["No credit card required", "Results in under 15 seconds", "Trusted by 12,000+ job seekers"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={12} style={{ color: "var(--teal)" }} />
                <span>{t}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative z-10 mt-20 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl"
        >
          {STATS.map((s) => (
            <StatBadge key={s.label} {...s} />
          ))}
        </motion.div>
      </section>

      {/* ── 5-PILLAR FEATURE CARDS ─────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-bold uppercase tracking-widest mb-4 font-display"
            style={{ color: "var(--teal)" }}
          >
            The Platform
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black font-display tracking-tight mb-4"
            style={{ color: "var(--text)" }}
          >
            Five pillars.<br />One complete intelligence system.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base max-w-xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            Every module is AI-native and deeply connected, so your data improves every recommendation across the platform.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((p, i) => (
            <PillarCard key={p.label} pillar={p} index={i} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <div
          className="rounded-3xl p-10 sm:p-16 relative overflow-hidden"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Background decoration */}
          <div
            className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(122,23,48,0.12) 0%, transparent 70%)",
              filter: "blur(40px)",
              transform: "translate(20%, -20%)",
            }}
          />

          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4 font-display" style={{ color: "var(--accent)" }}>
              The Pipeline
            </p>
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight mb-14" style={{ color: "var(--text)" }}>
              From upload to offer,<br />in four steps.
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PIPELINE.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative flex flex-col gap-3"
                  >
                    {/* Connector line */}
                    {i < PIPELINE.length - 1 && (
                      <div
                        className="hidden lg:block absolute top-5 left-[calc(100%-12px)] w-full h-px z-0"
                        style={{ background: "linear-gradient(90deg, rgba(247,244,236,0.1), transparent)" }}
                      />
                    )}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(122, 23, 48, 0.12)", border: "1px solid rgba(122, 23, 48, 0.22)" }}
                    >
                      <Icon size={16} style={{ color: "var(--teal)" }} />
                    </div>
                    <div
                      className="text-4xl font-black font-display leading-none"
                      style={{ color: "rgba(122, 23, 48, 0.12)" }}
                    >
                      {step.step}
                    </div>
                    <h3 className="text-base font-bold font-display" style={{ color: "var(--text)" }}>{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{step.desc}</p>
                    <div
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded w-fit"
                      style={{ background: "rgba(232,163,61,0.1)", color: "var(--accent)", border: "1px solid rgba(232,163,61,0.2)" }}
                    >
                      {step.time}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <PinRevealSection
        title="Resume intelligence that moves with your momentum"
        description="Watch the platform shift through analysis, alignment, and recommendation states as you scroll through the experience."
        stages={[
          { label: "Upload", detail: "Your resume is parsed instantly and scored against ATS patterns with a polished, premium analysis surface." },
          { label: "Map", detail: "Skill DNA is generated into a living network so gaps are clear and actionable." },
          { label: "Launch", detail: "The system recommends the next best step to improve your story, prepare for interviews, and unlock opportunities." },
        ]}
      />

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-bold uppercase tracking-widest mb-4 font-display"
            style={{ color: "var(--teal)" }}
          >
            Social Proof
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-black font-display tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Real people. Real results.
          </motion.h2>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(247,244,236,0.03)] p-4">
          <motion.div
            className="flex w-max gap-4"
            animate={{ x: [0, -((TESTIMONIALS.length * 320) + (TESTIMONIALS.length - 1) * 16) / 2] }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={`${t.name}-${i}`} className="w-[300px]">
                <TestimonialCard t={t} index={i} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative text-center rounded-3xl py-20 px-8 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(46,156,147,0.1) 0%, rgba(232,163,61,0.06) 50%, rgba(46,156,147,0.06) 100%)",
            border: "1px solid rgba(247, 244, 236, 0.08)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(46,156,147,0.15) 0%, transparent 60%)",
            }}
          />
          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4 font-display" style={{ color: "var(--teal)" }}>
              Start Free Today
            </p>
            <h2 className="text-4xl sm:text-5xl font-black font-display tracking-tight mb-6" style={{ color: "var(--text)" }}>
              Your next role is<br />one analysis away.
            </h2>
            <p className="text-base mb-10" style={{ color: "var(--text-muted)" }}>
              Upload your resume in seconds. Get your ATS score, skill map, and personalized growth roadmap — completely free.
            </p>
            <Link href="/login">
              <MagneticButton
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold font-display transition-all duration-300 hover:shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--teal))",
                  color: "var(--bg)",
                  boxShadow: "0 12px 40px rgba(232,163,61,0.3)",
                }}
              >
                <Sparkles size={15} />
                Get Started — It&apos;s Free
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </MagneticButton>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
