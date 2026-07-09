"use client";

import { useAppStore } from "@/src/state/useAppStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Lock, Sparkles } from "lucide-react";
import { BackgroundBlobs } from "./ResumeGate/BackgroundBlobs";
import { FeatureGrid } from "./ResumeGate/FeatureGrid";
import { Hero } from "./ResumeGate/Hero";
import { UploadZone } from "./ResumeGate/UploadZone";
import { GlassCard } from "./ResumeGate/GlassCard";
import ModuleGate from "./ModuleGate";

interface ResumeGateProps {
  children: ReactNode;
  pageName?: string;
  pageIcon?: ReactNode;
}

const demoProfile = {
  name: "Alex Dev",
  bio: "Passionate Full-Stack Software Engineer with 3+ years of experience building web applications.",
  avatar: "🧑‍💻",
  skills: ["React", "Next.js", "TypeScript", "Node.js", "Python", "Docker", "AWS", "SQL", "Tailwind CSS"],
  experience: 3,
  domain: "Full-Stack Software Engineering",
  projects: ["E-Commerce Platform", "Real-Time Chat App", "AI Resume Analyzer"],
  education: "B.S. in Computer Science",
  xp: 250,
  level: "Explorer",
  resumeAnalysis: {
    scores: {
      ats_score: 82,
      recruiter_score: 85,
      impact_score: 78,
      skill_depth_score: 80,
      career_consistency_score: 90,
      overall_score: 83,
    },
    improved_summary: {
      improved: "Highly motivated Full-Stack Engineer with 3+ years of experience designing and deploying scalable web services.",
      key_keywords: ["Next.js", "Scalability", "API Integration"],
      ats_compliance: 88,
    },
  },
};

export default function ResumeGate({ children, pageName = "this page", pageIcon = <Lock size={48} /> }: ResumeGateProps) {
  const { profile, role, setProfile, addXP } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (role === "guest") {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname.replace(/^\//, "") || "profile";
        localStorage.setItem("ciq-redirect-after-login", currentPath);
      }
      router.replace("/login");
    }
  }, [role, router, mounted]);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const timeLabel = useMemo(() => clock.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), [clock]);

  const unlockWithProfile = (sourceProfile: typeof demoProfile, sourceLabel: string) => {
    setProfile({
      ...sourceProfile,
      name: sourceProfile.name,
      avatar: sourceProfile.avatar,
      skills: sourceProfile.skills,
      experience: sourceProfile.experience,
      domain: sourceProfile.domain,
      projects: sourceProfile.projects,
      education: sourceProfile.education,
      xp: sourceProfile.xp,
      level: sourceProfile.level,
      resumeAnalysis: sourceProfile.resumeAnalysis,
    });
    addXP(120, sourceLabel);
  };

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-primary-light)]/30 border-t-[var(--color-primary-light)]" />
      </div>
    );
  }

  if (role === "guest") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-zinc-500">
          <Lock size={24} className="animate-pulse text-[var(--color-primary-light)]" />
          <span className="text-xs">Redirecting to sign in…</span>
        </div>
      </div>
    );
  }

  if (!profile || !profile.skills || profile.skills.length === 0) {
    return (
      <ModuleGate
        title={pageName}
        eyebrow="Module unlock"
        description={`Unlock ${pageName} with a real profile snapshot and get tailored guidance, market insights, and action steps immediately.`}
        icon={pageIcon}
        accentColor="rgba(128, 0, 32, 0.18)"
        badge={`Live market pulse · ${timeLabel}`}
      >
        <BackgroundBlobs />

        <Hero
          onDemoUnlock={() => unlockWithProfile(demoProfile, "Loaded Demo Profile Credentials")}
          onUploadFocus={() => {
            const uploadEl = document.getElementById("resume-upload-zone");
            uploadEl?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
        />

        <FeatureGrid />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard className="p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--accent-light)]" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">How it works</h3>
            </div>
            <div className="mt-5 space-y-4">
              {[
                { step: "1", text: "Upload your resume and let the AI parse your story in seconds." },
                { step: "2", text: "We surface skill gaps, a career path, and interview prep tailored to you." },
                { step: "3", text: "Every page immediately personalizes around your data and goals." },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/10 text-sm font-semibold text-[var(--accent-light)]">
                    {item.step}
                  </div>
                  <p className="text-sm leading-6 text-[var(--text-muted)]">{item.text}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <div id="resume-upload-zone">
            <GlassCard className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">Upload</p>
                  <h3 className="text-lg font-semibold text-[var(--text)]">Resume intake</h3>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--text-muted)]">Live processing</div>
              </div>
              <UploadZone
                onUploadComplete={(fileName) => {
                  unlockWithProfile(
                    {
                      ...demoProfile,
                      name: fileName.replace(/\.[^.]+$/, ""),
                      bio: "Uploaded resume analyzed and unlocked for personalized coaching.",
                      skills: ["React", "Next.js", "TypeScript", "Product strategy", "System design"],
                      experience: 4,
                      domain: "Product Engineering",
                    },
                    "Resume upload unlocked Career Path AI"
                  );
                }}
              />
            </GlassCard>
          </div>
        </div>
      </ModuleGate>
    );
  }

  return <>{children}</>;
}
