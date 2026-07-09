"use client";

import { motion } from "framer-motion";
import { BarChart3, Mic, Map, Puzzle, BookOpen, Network } from "lucide-react";
import { GlassCard } from "./GlassCard";

const features = [
  { icon: BarChart3, title: "Career Dashboard", desc: "Skill radar, health score & analytics", accent: "from-[var(--color-primary)]/20 to-[var(--color-primary-light)]/10" },
  { icon: Mic, title: "Interview Sim", desc: "Resume-based questions + aptitude", accent: "from-[var(--color-accent)]/20 to-[var(--color-primary)]/10" },
  { icon: Map, title: "Career Path AI", desc: "Personalized 6-month roadmap", accent: "from-[var(--color-primary-light)]/20 to-[var(--color-primary)]/10" },
  { icon: Puzzle, title: "Skill Gap Analysis", desc: "Compare your skills vs market", accent: "from-[var(--color-primary)]/20 to-[var(--color-accent)]/10" },
  { icon: BookOpen, title: "Learning Path", desc: "Recommended courses for your gaps", accent: "from-[var(--color-accent)]/20 to-slate-400/10" },
  { icon: Network, title: "Skill DNA Graph", desc: "Visual skill connection map", accent: "from-[var(--color-primary-light)]/20 to-[var(--color-accent)]/10" },
];

export function FeatureGrid() {
  return (
    <section className="mt-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">What you unlock</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">A sharper path, powered by your profile</h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 * index, ease: "easeOut" }}
            >
              <GlassCard className="group h-full p-5 hover:-translate-y-1 hover:border-[var(--color-primary)]/40">
                <div className={`mb-4 inline-flex rounded-2xl border border-white/10 bg-gradient-to-br ${feature.accent} p-3 text-[var(--color-primary-light)]`}>
                  <Icon size={18} />
                </div>
                <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.desc}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default FeatureGrid;
