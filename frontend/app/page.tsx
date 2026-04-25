"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/src/state/useAppStore";
import {
  FileText, Mic2, Map, Puzzle, BookOpen, BarChart2,
  Dna, Globe2, Trophy, Bot, TrendingUp, LineChart,
  Rocket, ArrowRight, Users, Star, Shield, Zap,
  MicVocal, Car, Layers, Smartphone
} from "lucide-react";

const coreModules = [
  { icon: FileText, title: "Resume Intelligence", desc: "Multi-format upload (PDF/DOCX/PNG). 3-module AI pipeline: extract → validate → interview.", href: "/resume", color: "#a78bfa", badge: "3 Modules" },
  { icon: Mic2, title: "VR Interview Simulator", desc: "Immersive VR-style mock interviews with resume-based questions, aptitude rounds & anti-cheat scoring.", href: "/interview", color: "#60a5fa", badge: "Anti-Cheat" },
  { icon: Map, title: "Career Path AI", desc: "ML-powered role alignment, salary projections & personalized 6-month career roadmap.", href: "/career-path", color: "#34d399", badge: "AI-Powered" },
  { icon: Puzzle, title: "Skill Gap Analyzer", desc: "Deep comparison of your skills vs top job market requirements with smart recommendations.", href: "/skills", color: "#fbbf24", badge: "Market Data" },
  { icon: BookOpen, title: "Learning Path AI", desc: "Recommended courses based on your resume skill gaps + 100+ streams across all domains.", href: "/learning", color: "#f87171", badge: "100+ Courses" },
  { icon: BarChart2, title: "Career Dashboard", desc: "Resume-gated analytics: skill radar, growth chart, career health score & activity feed.", href: "/dashboard", color: "#c084fc", badge: "Resume-Gated" },
  { icon: Dna, title: "Skill DNA Graph", desc: "Interactive network visualization of how your skills interconnect and evolve together.", href: "/skill-dna", color: "#38bdf8", badge: "Visual" },
  { icon: Globe2, title: "Global Job Scanner", desc: "15 countries, 85,000+ roles, real 2025 salaries, visa guides & AI-matched opportunities.", href: "/global-scanner", color: "#4ade80", badge: "15 Countries" },
  { icon: Trophy, title: "Gamification", desc: "12 challenges + 6 coding activities. XP system, level progression, and badge collection.", href: "/gamification", color: "#fbbf24", badge: "XP System" },
  { icon: Bot, title: "AI Career Chatbot", desc: "OpenAI-style mentor with 15+ specialized topic handlers. Resume-aware & context-rich.", href: "/chatbot", color: "#a78bfa", badge: "GPT-Style" },
  { icon: TrendingUp, title: "AI Career Forecast", desc: "Layoff risk analysis, industry growth projections & technology trend predictions.", href: "/forecast", color: "#fb923c", badge: "Predictive" },
  { icon: LineChart, title: "Career Analytics", desc: "Deep insights into skill growth velocity, interview performance & career trajectory.", href: "/analytics", color: "#60a5fa", badge: "Insights" },
];

const upcoming = [
  { icon: MicVocal, label: "Voice Interview Coach" },
  { icon: Car, label: "Auto-Apply Engine" },
  { icon: Layers, label: "AI Flash Cards" },
  { icon: Star, label: "Salary Negotiator AI" },
  { icon: Shield, label: "LinkedIn Optimizer" },
  { icon: Smartphone, label: "Mobile App" },
];

const steps = [
  { n: "01", title: "Sign In", desc: "Phone OTP login — secure and instant", icon: Shield },
  { n: "02", title: "Upload Resume", desc: "Activate AI pipeline in 3 modules", icon: FileText },
  { n: "03", title: "Get AI Insights", desc: "Personalised dashboard unlocks", icon: Bot },
  { n: "04", title: "Interview & Grow", desc: "VR sim, learning path, gamification", icon: Rocket },
];

const BASE_USERS = 12847;
const BASE_RESUMES = 38621;

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M+`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`;
  return n.toString();
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function HomePage() {
  const router = useRouter();
  const { role } = useAppStore();
  const [userCount, setUserCount] = useState(BASE_USERS);
  const [resumeCount, setResumeCount] = useState(BASE_RESUMES);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (role === "guest") {
      router.replace("/login");
    }
  }, [role, router]);

  useEffect(() => {
    const storedUsers = parseInt(localStorage.getItem("ciq-user-count") || String(BASE_USERS));
    const storedResumes = parseInt(localStorage.getItem("ciq-resume-count") || String(BASE_RESUMES));
    const newUsers = storedUsers + Math.floor(Math.random() * 7 + 3);
    const newResumes = storedResumes + Math.floor(Math.random() * 13 + 8);
    localStorage.setItem("ciq-user-count", String(newUsers));
    localStorage.setItem("ciq-resume-count", String(newResumes));
    setUserCount(newUsers);
    setResumeCount(newResumes);
    setMounted(true);
  }, []);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }} className="page-enter">
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "60px 0 48px" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: 20, padding: "5px 16px", fontSize: "0.75rem", color: "#a78bfa", marginBottom: 24 }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 6px #34d399", animation: "pulse 1.5s infinite" }} />
          Live AI Data Streams Connected · ML Engine Active
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1.15, marginBottom: 16, background: "linear-gradient(135deg, #f1f5f9 30%, #a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          Your Career,<br />Supercharged by AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: 580, margin: "0 auto 32px", lineHeight: 1.8 }}
        >
          CareerIQ v3 is the most advanced AI career co-pilot — resume intelligence, VR interview simulation, global job scanning, and gamified upskilling in one unified platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}
        >
          <Link href="/login" style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "white", padding: "13px 30px", borderRadius: 10, fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", boxShadow: "0 8px 24px rgba(124,58,237,0.35)", display: "flex", alignItems: "center", gap: 8 }}>
            <Rocket size={16} /> Get Started Free
          </Link>
          <button onClick={() => router.push("/resume")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#e2e8f0", padding: "13px 30px", borderRadius: 10, fontWeight: 500, fontSize: "0.95rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            Upload Resume <ArrowRight size={16} />
          </button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
        >
          {([["12", "AI Modules", "#a78bfa"], ["15", "Countries", "#34d399"], ["85K+", "Job Listings", "#60a5fa"], ["98%", "ATS Accuracy", "#fbbf24"]] as [string, string, string][]).map(([v, l, c]) => (
            <div key={l} className="card" style={{ minWidth: 110, textAlign: "center", borderColor: `${c}22` }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: c }}>{v}</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 2 }}>{l}</div>
            </div>
          ))}
          <div className="card" style={{ minWidth: 110, textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <Users size={16} style={{ opacity: 0.5 }} />
              {mounted ? formatCount(userCount) : `${(BASE_USERS / 1000).toFixed(1)}K+`}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 2 }}>Active Users</div>
          </div>
          <div className="card" style={{ minWidth: 110, textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <FileText size={16} style={{ opacity: 0.5 }} />
              {mounted ? formatCount(resumeCount) : `${(BASE_RESUMES / 1000).toFixed(1)}K+`}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 2 }}>Resumes Analyzed</div>
          </div>
        </motion.div>
      </div>

      {/* Core Modules */}
      <div style={{ marginBottom: 64 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ marginBottom: 6 }}>12 Advanced AI Modules</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Upload your resume first — every feature personalizes to your profile</p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}
        >
          {coreModules.map((m) => {
            const Icon = m.icon;
            return (
              <motion.div key={m.title} variants={itemVariants}>
                <Link href={m.href} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                  <div className="card module-card" style={{ cursor: "pointer", height: "100%", borderColor: `${m.color}18` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={18} color={m.color} />
                      </div>
                      <span style={{ background: `${m.color}18`, color: m.color, border: `1px solid ${m.color}33`, borderRadius: 20, padding: "2px 9px", fontSize: "0.62rem", fontWeight: 600 }}>{m.badge}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text)", marginBottom: 6 }}>{m.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{m.desc}</div>
                    <div style={{ marginTop: 12, fontSize: "0.72rem", color: m.color, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                      Explore <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Coming soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="card"
        style={{ marginBottom: 60, background: "rgba(167,139,250,0.05)", borderColor: "rgba(167,139,250,0.15)", textAlign: "center" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
          <Zap size={18} color="#a78bfa" />
          <h2 style={{ margin: 0 }}>Next-Gen Features in Development</h2>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: 20 }}>Stay tuned — these are launching soon</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {upcoming.map((f) => {
            const Icon = f.icon;
            return (
              <span key={f.label} style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 20, padding: "5px 14px", fontSize: "0.78rem", color: "#c4b5fd", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon size={13} /> {f.label}
              </span>
            );
          })}
        </div>
      </motion.div>

      {/* How it works */}
      <div style={{ marginBottom: 60 }}>
        <h2 style={{ textAlign: "center", marginBottom: 28 }}>How CareerIQ Works</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid-4"
        >
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.n} variants={itemVariants} className="card" style={{ textAlign: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <Icon size={20} color="#a78bfa" />
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent)", opacity: 0.25, marginBottom: 4 }}>{s.n}</div>
                <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6, fontSize: "0.88rem" }}>{s.title}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{s.desc}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="card animate-glow"
        style={{ textAlign: "center", padding: "52px 24px", marginBottom: 40, background: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(167,139,250,0.08))", borderColor: "rgba(124,58,237,0.3)" }}
      >
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
          <Rocket size={40} color="#a78bfa" />
        </motion.div>
        <h1 style={{ marginBottom: 12 }}>Your Career OS. Start Today.</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 28, fontSize: "0.9rem", lineHeight: 1.7 }}>
          Join {mounted ? formatCount(userCount) : "12K+"} professionals using CareerIQ to accelerate their career with AI.<br />
          Built by students of <strong style={{ color: "#fbbf24" }}>AI &amp; Data Science</strong>.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/login" style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "white", padding: "13px 32px", borderRadius: 10, fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            Launch CareerIQ <ArrowRight size={16} />
          </Link>
          <Link href="/contact" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0", padding: "13px 32px", borderRadius: 10, fontWeight: 500, fontSize: "0.95rem", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            Meet the Team <Users size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
