"use client";
import { useAppStore } from "@/src/state/useAppStore";
import Link from "next/link";

const DEFAULT_SKILLS = [
    { name: "React.js", yours: 88, required: 90, color: "#61dafb" },
    { name: "TypeScript", yours: 80, required: 85, color: "#3178c6" },
    { name: "Node.js", yours: 72, required: 80, color: "#68a063" },
    { name: "Python", yours: 45, required: 75, color: "#ffd43b" },
    { name: "Machine Learning", yours: 25, required: 70, color: "#a78bfa" },
    { name: "SQL", yours: 70, required: 75, color: "#60a5fa" },
    { name: "Docker", yours: 40, required: 65, color: "#2496ed" },
    { name: "AWS", yours: 30, required: 60, color: "#ff9900" },
    { name: "System Design", yours: 55, required: 70, color: "#34d399" },
    { name: "DSA", yours: 60, required: 80, color: "#f87171" },
];

const recs = [
    { course: "Fast.ai + Andrew Ng's ML Course", time: "2 months", tag: "Critical" },
    { course: "AWS Certified Developer Associate", time: "6 weeks", tag: "High" },
    { course: "Docker + Kubernetes on Udemy", time: "3 weeks", tag: "High" },
    { course: "Grokking Systems Design", time: "4 weeks", tag: "Medium" },
    { course: "Python for Data Science (Kaggle)", time: "2 weeks", tag: "Medium" },
];

const SKILL_COLORS = ["#a78bfa", "#60a5fa", "#34d399", "#fbbf24", "#f87171", "#f472b6", "#56e3a0", "#7eb8f7", "#9b59b6", "#61dafb"];

export default function SkillsPage() {
    const { profile } = useAppStore();

    // Resume guard
    if (!profile || !profile.skills || profile.skills.length === 0) {
        return (
            <div className="page-enter">
                <div style={{ marginBottom: 24 }}>
                    <h1>Skill Gap Analyzer</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Compare your skills against job role requirements and market trends.</p>
                </div>
                <div className="card card-glow" style={{ textAlign: "center", padding: "56px 32px", background: "linear-gradient(135deg,rgba(124,58,237,0.12),rgba(167,139,250,0.06))" }}>
                    <div style={{ fontSize: "3rem", marginBottom: 16 }} className="animate-float">🎯</div>
                    <h2 style={{ marginBottom: 8 }}>Resume Required</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: 420, margin: "0 auto 24px", lineHeight: 1.7 }}>
                        Upload your resume to unlock your personalized skill gap analysis — see exactly where you stand vs industry requirements and get a priority learning plan.
                    </p>
                    <Link href="/resume" className="btn-primary" style={{ textDecoration: "none", padding: "13px 32px", fontSize: "0.95rem" }}>
                        🚀 Upload Resume — Unlock Skill Gap
                    </Link>
                </div>
                <div style={{ opacity: 0.3, filter: "blur(3px)", pointerEvents: "none", userSelect: "none", marginTop: 24 }}>
                    <div className="card" style={{ marginBottom: 20 }}>
                        <h3>Skill Gap Analysis</h3>
                        {DEFAULT_SKILLS.slice(0, 4).map(s => (
                            <div key={s.name} style={{ marginBottom: 10 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 4 }}>
                                    <span style={{ color: "var(--text)" }}>{s.name}</span>
                                </div>
                                <div className="progress-track"><div className="progress-fill" style={{ width: `${s.yours}%` }} /></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ textAlign: "center", marginTop: 8, fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    🔒 Upload a resume to unlock personalized skill gap analysis
                </div>
            </div>
        );
    }

    // Build skill gap from actual resume
    const resumeSkills = profile.skills.slice(0, 12).map((name, i) => ({
        name,
        yours: Math.min(95, 50 + (profile.experience || 0) * 8 + i * 3),
        required: Math.min(100, 70 + i * 2),
        color: SKILL_COLORS[i % SKILL_COLORS.length],
    }));

    const resumeRecs = resumeSkills
        .filter(s => s.required - s.yours > 5)
        .slice(0, 5)
        .map((s, i) => ({
            course: `${s.name} — Advanced Skills & Projects`,
            time: `${2 + i} weeks`,
            tag: s.required - s.yours > 20 ? "Critical" : s.required - s.yours > 10 ? "High" : "Medium",
        }));

    const displayRecs = resumeRecs.length > 0 ? resumeRecs : recs;

    return (
        <div className="page-enter">
            <h1 style={{ marginBottom: 4 }}>Skill Gap Analyzer</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24 }}>
                Based on your <strong style={{ color: "var(--accent)" }}>{profile.domain}</strong> profile.{" "}
                <strong style={{ color: "var(--green)" }}>{resumeSkills.filter(s => s.yours >= s.required).length} skills met</strong>,{" "}
                <strong style={{ color: "var(--red)" }}>{resumeSkills.filter(s => s.yours < s.required).length} gaps identified</strong>.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {resumeSkills.map(s => <span key={s.name} className="skill-tag">{s.name}</span>)}
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
                <h3>Skill Gap Analysis</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {resumeSkills.map((s) => {
                        const gap = s.required - s.yours;
                        return (
                            <div key={s.name}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 6 }}>
                                    <span style={{ color: "var(--text)", fontWeight: 500 }}>{s.name}</span>
                                    <span style={{ color: gap > 20 ? "var(--red)" : gap > 0 ? "var(--yellow)" : "var(--green)", fontWeight: 600 }}>
                                        {gap > 0 ? `Gap: ${gap}%` : "✓ Met"}
                                    </span>
                                </div>
                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 2 }}>Yours: {s.yours}%</div>
                                        <div className="progress-track"><div className="progress-fill" style={{ width: `${s.yours}%`, background: s.color }} /></div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 2 }}>Required: {s.required}%</div>
                                        <div className="progress-track"><div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.15)", width: `${s.required}%` }} /></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="card">
                <h3>Learning Recommendations (Priority Order)</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {displayRecs.map((r, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "white", flexShrink: 0 }}>{i + 1}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, fontSize: "0.83rem", color: "var(--text)" }}>{r.course}</div>
                                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{r.time}</div>
                            </div>
                            <span className={r.tag === "Critical" ? "badge-purple" : r.tag === "High" ? "badge-blue" : "badge-yellow"}>{r.tag}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
