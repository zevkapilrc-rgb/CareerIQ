"use client";
import { useAppStore } from "@/src/state/useAppStore";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";

const roles = [
    { title: "Full-Stack Developer", align: 82, salary: "₹14–22 LPA", demand: "High", color: "#a78bfa", desc: "You are strongly aligned as a Full-Stack Developer. Strengthen TypeScript and system design to reach senior level." },
    { title: "AI Engineer", align: 64, salary: "₹18–28 LPA", demand: "Very High", color: "#34d399", desc: "Close to AI Engineer! Master Python ML, LangChain, and vector databases to bridge the gap." },
];
const probData = [
    { role: "Full-Stack", prob: 82 }, { role: "AI Eng", prob: 64 }, { role: "Backend", prob: 70 },
    { role: "DevOps", prob: 45 }, { role: "Data Sci", prob: 38 },
];
const salaryData = [
    { year: "Now", fsd: 14, ai: 18 }, { year: "1yr", fsd: 18, ai: 22 },
    { year: "2yr", fsd: 22, ai: 28 }, { year: "3yr", fsd: 26, ai: 35 },
];
const roadmap = [
    { title: "Advanced TypeScript & React Patterns", tasks: ["Master generics & utility types", "Learn Next.js App Router deeply", "Build 2 portfolio projects"] },
    { title: "Backend & API Mastery", tasks: ["FastAPI or NestJS deep dive", "PostgreSQL + Redis caching", "RESTful & GraphQL APIs"] },
    { title: "Cloud & DevOps Fundamentals", tasks: ["AWS Certified Developer prep", "Docker + Kubernetes basics", "CI/CD with GitHub Actions"] },
    { title: "AI/ML Integration", tasks: ["Python ML basics", "LangChain & GPT APIs", "Build AI-powered project"] },
    { title: "System Design & Leadership", tasks: ["HLD & LLD for interviews", "Distributed systems basics", "Tech lead communication"] },
];

export default function CareerPathPage() {
    const { profile } = useAppStore();

    // Resume guard
    if (!profile || !profile.skills || profile.skills.length === 0) {
        return (
            <div className="page-enter">
                <div style={{ marginBottom: 24 }}>
                    <h1>Career Path Prediction</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>ML-powered career alignment, salary projection, and 1-year growth roadmap.</p>
                </div>
                <div className="card card-glow" style={{ textAlign: "center", padding: "56px 32px", background: "linear-gradient(135deg,rgba(124,58,237,0.12),rgba(167,139,250,0.06))" }}>
                    <div style={{ fontSize: "3rem", marginBottom: 16 }} className="animate-float">🗺️</div>
                    <h2 style={{ marginBottom: 8 }}>Resume Required</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: 420, margin: "0 auto 24px", lineHeight: 1.7 }}>
                        Upload your resume to unlock your personalized career path prediction, role alignment scores, salary projections, and a tailored 6-month growth roadmap.
                    </p>
                    <Link href="/resume" className="btn-primary" style={{ textDecoration: "none", padding: "13px 32px", fontSize: "0.95rem" }}>
                        🚀 Upload Resume — Unlock Career Path
                    </Link>
                </div>
                <div style={{ opacity: 0.3, filter: "blur(3px)", pointerEvents: "none", userSelect: "none", marginTop: 24 }}>
                    <div className="grid-2" style={{ marginBottom: 20 }}>
                        {roles.map((r) => (
                            <div key={r.title} className="card" style={{ borderColor: `${r.color}40` }}>
                                <h2 style={{ marginBottom: 4 }}>{r.title}</h2>
                                <div className="progress-track"><div className="progress-fill" style={{ width: `${r.align}%` }} /></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ textAlign: "center", marginTop: 8, fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    🔒 Upload a resume to unlock all career path insights
                </div>
            </div>
        );
    }

    const userRoles = roles.map(r => ({
        ...r,
        align: Math.min(98, r.align + (profile.experience || 0) * 3),
    }));
    const userProbData = probData.map(p => ({
        ...p,
        prob: Math.min(98, p.prob + (profile.experience || 0) * 2),
    }));

    return (
        <div className="page-enter">
            <h1 style={{ marginBottom: 4 }}>Career Path Prediction</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24 }}>
                Based on your <strong style={{ color: "var(--accent)" }}>{profile.domain}</strong> profile with{" "}
                <strong style={{ color: "var(--accent)" }}>{profile.skills.length} skills</strong>.
            </p>

            <div className="grid-2" style={{ marginBottom: 20 }}>
                {userRoles.map((r) => (
                    <div key={r.title} className="card" style={{ borderColor: `${r.color}40` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                            <div>
                                <h2 style={{ marginBottom: 4 }}>{r.title}</h2>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{r.salary}</div>
                            </div>
                            <span className="badge-purple">Market: {r.demand}</span>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 4 }}>
                                <span>Alignment Score</span><span style={{ color: r.color, fontWeight: 700 }}>{r.align}%</span>
                            </div>
                            <div className="progress-track"><div className="progress-fill" style={{ width: `${r.align}%`, background: `linear-gradient(90deg, ${r.color}88, ${r.color})` }} /></div>
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>{r.desc}</p>
                    </div>
                ))}
            </div>

            <div className="grid-2" style={{ marginBottom: 20 }}>
                <div className="card">
                    <h3>Role Probability Analysis</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={userProbData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="role" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: "var(--bg-deep)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }} />
                            <Bar dataKey="prob" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="card">
                    <h3>Salary Projection (LPA)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={salaryData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="year" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: "var(--bg-deep)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }} />
                            <Line type="monotone" dataKey="fsd" stroke="#a78bfa" strokeWidth={2} name="Full-Stack" />
                            <Line type="monotone" dataKey="ai" stroke="#34d399" strokeWidth={2} name="AI Eng" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card">
                <h3>6-Month Growth Roadmap</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {roadmap.map((phase, i) => (
                        <div key={i} style={{ display: "flex", gap: 14 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "white", flexShrink: 0 }}>{i + 1}</div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text)", marginBottom: 4 }}>{phase.title}</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {phase.tasks.map(t => <span key={t} className="skill-tag">{t}</span>)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
