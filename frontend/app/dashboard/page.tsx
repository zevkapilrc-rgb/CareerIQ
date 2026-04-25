"use client";
import React from "react";
import { useAppStore } from "@/src/state/useAppStore";
import Link from "next/link";
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar
} from "recharts";
import { FileText, Rocket, Lock, Star, Mic, BookOpen } from "lucide-react";

function EmptyDashboard() {
    return (
        <div className="page-enter">
            <div style={{ marginBottom: 24 }}>
                <h1>Your Career Dashboard</h1>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Upload your resume to unlock personalized insights</p>
            </div>
            {/* Upload CTA */}
            <div className="card card-glow animate-glow" style={{ textAlign: "center", padding: "56px 32px", marginBottom: 24, background: "linear-gradient(135deg,rgba(124,58,237,0.12),rgba(167,139,250,0.06))" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, color: "var(--accent)" }} className="animate-float"><FileText size={48} /></div>
                <h2 style={{ marginBottom: 8 }}>No Resume Uploaded Yet</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: 420, margin: "0 auto 24px", lineHeight: 1.7 }}>
                    Upload your resume to activate your personalized career dashboard, AI skill radar, career health score, and growth analytics.
                </p>
                <Link href="/resume" className="btn-primary" style={{ textDecoration: "none", padding: "13px 32px", fontSize: "0.95rem", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Rocket size={16} /> Upload Resume — Unlock Dashboard
                </Link>
            </div>
            {/* Preview cards blurred */}
            <div style={{ opacity: 0.3, filter: "blur(3px)", pointerEvents: "none", userSelect: "none" }}>
                <div className="grid-4" style={{ marginBottom: 20 }}>
                    {["Career Health Score", "Skill Match %", "Interview Ready", "XP Earned"].map(l => (
                        <div key={l} className="stat-card">
                            <div className="stat-label">{l}</div>
                            <div className="stat-value">—</div>
                        </div>
                    ))}
                </div>
                <div className="grid-2">
                    <div className="card" style={{ height: 200 }} />
                    <div className="card" style={{ height: 200 }} />
                </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 12, fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Lock size={14} /> Upload a resume to unlock all dashboard sections
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { profile } = useAppStore();
    const [analysis, setAnalysis] = React.useState<any>(null);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("ciq-resume-analysis");
            if (stored) setAnalysis(JSON.parse(stored));
        }
    }, []);

    if (!profile || !profile.skills || profile.skills.length === 0) {
        return <EmptyDashboard />;
    }

    const skills = profile.skills.slice(0, 6);
    const radarData = skills.map((s, i) => ({ skill: s.length > 10 ? s.slice(0, 10) : s, value: 55 + i * 7 + (profile.experience || 0) * 5 }));

    const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    const base = 40 + (profile.experience || 0) * 8;
    const growthData = months.map((m, i) => ({ month: m, score: Math.min(98, base + i * 6) }));

    const activityData = [
        { day: "Mon", hours: 2.5 }, { day: "Tue", hours: 1.8 }, { day: "Wed", hours: 3.2 },
        { day: "Thu", hours: 2.0 }, { day: "Fri", hours: 2.8 }, { day: "Sat", hours: 1.5 }, { day: "Sun", hours: 0.8 },
    ];

    const atsScore = analysis?.atsScore || Math.min(97, 50 + skills.length * 3 + (profile.experience || 0) * 6);
    const weakSkills = analysis?.weakSkills || [];
    const missingSkills = analysis?.missingSkills || [];
    const futureSkills = analysis?.futureSkills || [];
    const careerPath = analysis?.careerInsights?.suggestedPath || `${profile.domain} → Senior → Lead`;
    const recommendations = analysis?.careerInsights?.growthRecommendations || [];
    const healthScore = Math.min(97, 50 + skills.length * 3 + (profile.experience || 0) * 6);
    const xpToNext = profile.xp < 500 ? 500 - profile.xp : profile.xp < 1500 ? 1500 - profile.xp : 3000 - profile.xp;

    return (
        <div className="page-enter">
            <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>Welcome back,</div>
                <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>{profile.name}! Your career is trending up <Rocket size={24} color="var(--accent)" /></h1>
            </div>

            {/* Stat cards */}
            <div className="grid-4 stagger" style={{ marginBottom: 20 }}>
                {[
                    ["ATS Score", `${atsScore}`, "/100", "var(--accent)"],
                    ["Core Skills", `${skills.length}`, " detected", "var(--green)"],
                    ["Experience", `${profile.experience}`, " year(s)", "var(--blue)"],
                    ["Total XP", `${profile.xp}`, " pts", "var(--yellow)"],
                ].map(([l, v, s, c]) => (
                    <div key={l as string} className="stat-card">
                        <div className="stat-label">{l}</div>
                        <div style={{ fontSize: "1.8rem", fontWeight: 700, color: c as string, marginTop: 4 }}>
                            {v}<span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{s}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Career Path from Resume */}
            <div className="card" style={{ marginBottom: 20, background: "linear-gradient(135deg,rgba(124,58,237,0.12),rgba(167,139,250,0.06))", borderColor: "rgba(124,58,237,0.3)" }}>
                <h2 style={{ marginBottom: 4 }}>AI Career Health Score</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.83rem", marginBottom: 16 }}>
                    Based on your <strong style={{ color: "var(--accent)" }}>{profile.domain}</strong> profile with {skills.length} skills and {profile.experience} year(s) of experience.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", marginBottom: 16 }}>
                    <div style={{ fontSize: "3rem", fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>{healthScore}</div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <div className="progress-track" style={{ height: 10, marginBottom: 8 }}>
                            <div className="progress-fill" style={{ width: `${healthScore}%` }} />
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}><Star size={12} color="var(--yellow)" /> {profile.xp} XP · {xpToNext} XP to reach next level</div>
                    </div>
                </div>
                {/* Career Path */}
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px 16px", border: "1px solid rgba(167,139,250,0.15)" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 6 }}>DETECTED CAREER PATH</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>{careerPath}</div>
                </div>
            </div>

            {/* Skills Analysis from Resume */}
            <div className="grid-3" style={{ marginBottom: 20 }}>
                <div className="card" style={{ borderColor: "rgba(248,113,113,0.2)" }}>
                    <h3 style={{ fontSize: "0.85rem", marginBottom: 12, color: "#fca5a5" }}>Weak Skills</h3>
                    {weakSkills.length > 0 ? weakSkills.map((s: string) => (
                        <div key={s} style={{ padding: "6px 12px", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 8, marginBottom: 6, fontSize: "0.8rem", color: "#f87171" }}>{s}</div>
                    )) : <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No weak skills detected</div>}
                </div>
                <div className="card" style={{ borderColor: "rgba(251,191,36,0.2)" }}>
                    <h3 style={{ fontSize: "0.85rem", marginBottom: 12, color: "#fde68a" }}>Missing Skills</h3>
                    {missingSkills.length > 0 ? missingSkills.map((s: string) => (
                        <div key={s} style={{ padding: "6px 12px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 8, marginBottom: 6, fontSize: "0.8rem", color: "#fbbf24" }}>{s}</div>
                    )) : <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No missing skills detected</div>}
                </div>
                <div className="card" style={{ borderColor: "rgba(96,165,250,0.2)" }}>
                    <h3 style={{ fontSize: "0.85rem", marginBottom: 12, color: "#93c5fd" }}>Future Skills to Learn</h3>
                    {futureSkills.length > 0 ? futureSkills.map((s: string) => (
                        <div key={s} style={{ padding: "6px 12px", background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: 8, marginBottom: 6, fontSize: "0.8rem", color: "#60a5fa" }}>{s}</div>
                    )) : <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Upload resume to see suggestions</div>}
                </div>
            </div>

            <div className="grid-2" style={{ marginBottom: 20 }}>
                {/* Radar */}
                <div className="card">
                    <h3>Skill Radar — Your {profile.domain}</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.08)" />
                            <PolarAngleAxis dataKey="skill" tick={{ fill: "#6b7280", fontSize: 10 }} />
                            <Radar dataKey="value" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.2} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                {/* Growth */}
                <div className="card">
                    <h3>Career Score Progression</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={growthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0" }} />
                            <Line type="monotone" dataKey="score" stroke="#a78bfa" strokeWidth={2} dot={{ fill: "#a78bfa", r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid-2">
                {/* Activity */}
                <div className="card">
                    <h3>Study Activity (hrs/day)</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={activityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0" }} />
                            <Bar dataKey="hours" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* Growth Recommendations */}
                <div className="card">
                    <h3>Growth Recommendations</h3>
                    {recommendations.length > 0 ? recommendations.map((r: string, i: number) => (
                        <div key={i} className="activity-item">
                            <div className="activity-dot" />
                            {r}
                        </div>
                    )) : (
                        <>
                            <div className="activity-item"><div className="activity-dot" />{`Resume scanned — ${skills.length} skills detected`}</div>
                            <div className="activity-item"><div className="activity-dot" />{`Domain identified: ${profile.domain}`}</div>
                            <div className="activity-item"><div className="activity-dot" />{`Career health score: ${healthScore}/100`}</div>
                        </>
                    )}
                    <div style={{ marginTop: 14 }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 6 }}>Level Progress: {profile.level}</div>
                        <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${Math.min(98, (profile.xp % 1000) / 10)}%` }} />
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 4 }}>{xpToNext} XP to next level</div>
                    </div>
                    <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <Link href="/interview" className="btn-primary" style={{ textDecoration: "none", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 6 }}><Mic size={14} /> Start Interview</Link>
                        <Link href="/learning" className="btn-ghost" style={{ textDecoration: "none", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 6 }}><BookOpen size={14} /> Learning Path</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

