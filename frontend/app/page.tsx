"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const coreModules = [
  { icon: "📄", title: "Resume Intelligence", desc: "Multi-format upload (PDF/DOCX/PNG). 3-module AI pipeline: extract → validate → interview.", href: "/resume", color: "#a78bfa", badge: "3 Modules" },
  { icon: "🎤", title: "VR Interview Simulator", desc: "Immersive VR-style mock interviews with resume-based questions, anti-cheat & real scoring.", href: "/interview", color: "#60a5fa", badge: "Anti-Cheat" },
  { icon: "🗺️", title: "Career Path AI", desc: "ML-powered role alignment, salary projections & personalized 6-month career roadmap.", href: "/career-path", color: "#34d399", badge: "AI-Powered" },
  { icon: "🧩", title: "Skill Gap Analyzer", desc: "Deep comparison of your skills vs top job market requirements with smart recommendations.", href: "/skills", color: "#fbbf24", badge: "Market Data" },
  { icon: "📚", title: "Learning Path AI", desc: "6 full courses with lesson content, progress tracking & resume-from-where-you-left-off.", href: "/learning", color: "#f87171", badge: "6 Courses" },
  { icon: "📊", title: "Career Dashboard", desc: "Resume-gated analytics: skill radar, growth chart, career health score & activity feed.", href: "/dashboard", color: "#c084fc", badge: "Resume-Gated" },
  { icon: "🧬", title: "Skill DNA Graph", desc: "Interactive network visualization of how your skills interconnect and evolve together.", href: "/skill-dna", color: "#38bdf8", badge: "Visual" },
  { icon: "🌍", title: "Global Job Scanner", desc: "15 countries, 85,000+ roles, real 2025 salaries, visa guides & AI-matched opportunities.", href: "/global-scanner", color: "#4ade80", badge: "15 Countries" },
  { icon: "🏆", title: "Gamification", desc: "12 challenges + 6 coding activities. XP system, level progression, and badge collection.", href: "/gamification", color: "#fbbf24", badge: "XP System" },
  { icon: "🤖", title: "AI Career Chatbot", desc: "OpenAI-style mentor with 15+ specialized topic handlers. Resume-aware & context-rich.", href: "/chatbot", color: "#a78bfa", badge: "GPT-Style" },
  { icon: "🔮", title: "AI Career Forecast", desc: "Layoff risk analysis, industry growth projections & technology trend predictions.", href: "/forecast", color: "#fb923c", badge: "Predictive" },
  { icon: "📈", title: "Career Analytics", desc: "Deep insights into skill growth velocity, interview performance & career trajectory.", href: "/analytics", color: "#60a5fa", badge: "Insights" },
];

const upcoming = [
  "🎙️ Voice Interview Coach", "🤖 Auto-Apply Engine", "🃏 AI Flash Cards",
  "💰 Salary Negotiator AI", "🔗 LinkedIn Optimizer", "📱 Mobile App",
];

const steps = [
  { n: "01", title: "Sign In", desc: "Phone OTP login — secure and instant", icon: "🔐" },
  { n: "02", title: "Upload Resume", desc: "Activate AI pipeline in 3 modules", icon: "📄" },
  { n: "03", title: "Get AI Insights", desc: "Personalised dashboard unlocks", icon: "🧠" },
  { n: "04", title: "Interview & Grow", desc: "VR sim, learning path, gamification", icon: "🚀" },
];



export default function HomePage() {
  const router = useRouter();

  const handleUpload = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/resume");
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "60px 0 48px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: 20, padding: "5px 16px", fontSize: "0.75rem", color: "#a78bfa", marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
          AI Career Growth Engine · Powered by Advanced ML
        </div>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1.15, marginBottom: 16, background: "linear-gradient(135deg, #f1f5f9 30%, #a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Your Career,<br />Supercharged by AI
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: 580, margin: "0 auto 32px", lineHeight: 1.8 }}>
          CareerIQ v3 is the most advanced AI career co-pilot — resume intelligence, VR interview simulation, global job scanning, and gamified upskilling in one unified platform.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          <Link href="/login" style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "white", padding: "13px 30px", borderRadius: 10, fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}>
            🚀 Get Started Free
          </Link>
          <button onClick={handleUpload} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#e2e8f0", padding: "13px 30px", borderRadius: 10, fontWeight: 500, fontSize: "0.95rem", cursor: "pointer" }}>
            Upload Resume →
          </button>
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          {[["12", "AI Modules", "#a78bfa"], ["15", "Countries", "#34d399"], ["85K+", "Job Listings", "#60a5fa"], ["98%", "Success Rate", "#fbbf24"]].map(([v, l, c]) => (
            <div key={l} className="card" style={{ minWidth: 110, textAlign: "center", borderColor: `${c}22` }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: c }}>{v}</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 2 }}>{l}</div>
            </div>
          ))}
          {[["50K+", "Users"], ["120K+", "Resumes"]].map(([v, l]) => (
            <div key={l} className="card" style={{ minWidth: 110, textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>{v}</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Modules — interactive grid */}
      <div style={{ marginBottom: 64 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ marginBottom: 6 }}>12 Advanced AI Modules</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Click any module to explore — every feature is live and functional</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {coreModules.map((m) => (
            <Link key={m.title} href={m.href} style={{ textDecoration: "none" }}>
              <div className="card" style={{ cursor: "pointer", transition: "all 0.2s", height: "100%", borderColor: `${m.color}18` }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.borderColor = `${m.color}55`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${m.color}18`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = `${m.color}18`; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 10 }}>
                  <div style={{ fontSize: "1.6rem" }}>{m.icon}</div>
                  <span style={{ background: `${m.color}18`, color: m.color, border: `1px solid ${m.color}33`, borderRadius: 20, padding: "2px 9px", fontSize: "0.62rem", fontWeight: 600 }}>{m.badge}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text)", marginBottom: 6 }}>{m.title}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{m.desc}</div>
                <div style={{ marginTop: 12, fontSize: "0.72rem", color: m.color, fontWeight: 600 }}>Explore →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Coming soon */}
      <div className="card" style={{ marginBottom: 60, background: "rgba(167,139,250,0.05)", borderColor: "rgba(167,139,250,0.15)", textAlign: "center" }}>
        <h2 style={{ marginBottom: 6 }}>⚡ Next-Gen Features in Development</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: 20 }}>Stay tuned — these are launching soon</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {upcoming.map((f) => (
            <span key={f} style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 20, padding: "5px 14px", fontSize: "0.78rem", color: "#c4b5fd" }}>{f}</span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ marginBottom: 60 }}>
        <h2 style={{ textAlign: "center", marginBottom: 28 }}>How CareerIQ Works</h2>
        <div className="grid-4">
          {steps.map((s, i) => (
            <div key={s.n} className="card" style={{ textAlign: "center", position: "relative" }}>
              {i < steps.length - 1 && <div style={{ position: "absolute", top: "50%", right: -8, width: 16, height: 2, background: "rgba(167,139,250,0.2)", display: "none" }} />}
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent)", opacity: 0.4, marginBottom: 6 }}>{s.n}</div>
              <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6, fontSize: "0.88rem" }}>{s.title}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="card animate-glow" style={{ textAlign: "center", padding: "52px 24px", marginBottom: 40, background: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(167,139,250,0.08))", borderColor: "rgba(124,58,237,0.3)" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }} className="animate-float">🚀</div>
        <h1 style={{ marginBottom: 12 }}>Your Career OS. Start Today.</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 28, fontSize: "0.9rem", lineHeight: 1.7 }}>
          Join 50,000+ professionals using CareerIQ to accelerate their career with AI.<br />
          Build by students of <strong style={{ color: "#fbbf24" }}>AI & Data Science</strong>.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/login" style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "white", padding: "13px 32px", borderRadius: 10, fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}>
            Launch CareerIQ →
          </Link>
          <Link href="/contact" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0", padding: "13px 32px", borderRadius: 10, fontWeight: 500, fontSize: "0.95rem", textDecoration: "none" }}>
            Meet the Team
          </Link>
        </div>
      </div>
    </div>
  );
}
