"use client";
import React from "react";
import { useAppStore } from "@/src/state/useAppStore";
import Link from "next/link";
import ResumeGate from "@/src/components/ResumeGate";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Puzzle, AlertTriangle, CheckCircle, ArrowUpRight, Zap, BookOpen, Target, TrendingUp, Shield, Clock } from "lucide-react";

const SKILL_COLORS = ["#a78bfa", "#60a5fa", "#34d399", "#fbbf24", "#f87171", "#f472b6", "#56e3a0", "#7eb8f7", "#9b59b6", "#61dafb", "#e879f9", "#fb923c"];

const DOMAIN_REQUIRED: Record<string, { skill: string; weight: number }[]> = {
    "Full-Stack": [
        { skill: "React", weight: 90 }, { skill: "Node.js", weight: 85 }, { skill: "TypeScript", weight: 85 },
        { skill: "MongoDB", weight: 70 }, { skill: "PostgreSQL", weight: 75 }, { skill: "System Design", weight: 80 },
        { skill: "Docker", weight: 65 }, { skill: "AWS", weight: 60 }, { skill: "GraphQL", weight: 55 },
        { skill: "Redis", weight: 50 }, { skill: "CI/CD", weight: 60 }, { skill: "Testing", weight: 65 },
    ],
    "AI": [
        { skill: "Python", weight: 95 }, { skill: "TensorFlow", weight: 80 }, { skill: "PyTorch", weight: 80 },
        { skill: "Machine Learning", weight: 90 }, { skill: "Deep Learning", weight: 85 }, { skill: "SQL", weight: 70 },
        { skill: "Mathematics", weight: 75 }, { skill: "Data Visualization", weight: 60 }, { skill: "MLOps", weight: 55 },
        { skill: "NLP", weight: 65 }, { skill: "Computer Vision", weight: 60 }, { skill: "Statistics", weight: 75 },
    ],
    "default": [
        { skill: "Problem Solving", weight: 90 }, { skill: "Communication", weight: 85 }, { skill: "Domain Expertise", weight: 80 },
        { skill: "Leadership", weight: 70 }, { skill: "Analytics", weight: 65 }, { skill: "Project Management", weight: 60 },
    ],
};

export default function SkillsPage() {
    const { profile } = useAppStore();
    const [analysis, setAnalysis] = React.useState<any>(null);
    const [activeView, setActiveView] = React.useState<"gap" | "radar" | "priority">("gap");

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("ciq-resume-analysis");
            if (stored) setAnalysis(JSON.parse(stored));
        }
    }, []);

    const domain = profile?.domain || "";
    const domainKey = Object.keys(DOMAIN_REQUIRED).find(k => domain.toLowerCase().includes(k.toLowerCase())) || "default";
    const requiredSkills = DOMAIN_REQUIRED[domainKey];

    // Build skill gap from actual resume skills + stored analysis
    const userSkillsLower = (profile?.skills || []).map(s => s.toLowerCase());
    const weakSkills = analysis?.weakSkills || [];
    const missingSkills = analysis?.missingSkills || [];

    const gapData = requiredSkills.map((req, i) => {
        const hasSkill = userSkillsLower.some(us => us.includes(req.skill.toLowerCase()) || req.skill.toLowerCase().includes(us));
        const isWeak = weakSkills.some((w: string) => w.toLowerCase().includes(req.skill.toLowerCase()) || req.skill.toLowerCase().includes(w.toLowerCase()));
        const isMissing = missingSkills.some((m: string) => m.toLowerCase().includes(req.skill.toLowerCase()) || req.skill.toLowerCase().includes(m.toLowerCase()));
        
        let yours = hasSkill ? Math.min(95, 55 + (profile?.experience || 0) * 8 + i * 2) : isMissing ? 10 : isWeak ? 35 : 20;
        if (isWeak && hasSkill) yours = Math.min(yours, 45);

        return {
            name: req.skill,
            yours,
            required: req.weight,
            gap: Math.max(0, req.weight - yours),
            color: SKILL_COLORS[i % SKILL_COLORS.length],
            status: yours >= req.weight ? "met" : req.weight - yours > 25 ? "critical" : req.weight - yours > 10 ? "moderate" : "minor",
        };
    });

    const met = gapData.filter(s => s.status === "met").length;
    const critical = gapData.filter(s => s.status === "critical").length;
    const moderate = gapData.filter(s => s.status === "moderate").length;
    const overallScore = Math.round(gapData.reduce((sum, s) => sum + Math.min(100, (s.yours / s.required) * 100), 0) / gapData.length);

    // Radar data
    const radarData = gapData.slice(0, 8).map(s => ({
        skill: s.name.length > 10 ? s.name.slice(0, 10) : s.name,
        yours: s.yours,
        required: s.required,
    }));

    // Priority recommendations
    const priorities = [...gapData]
        .filter(s => s.gap > 0)
        .sort((a, b) => b.gap - a.gap)
        .slice(0, 6)
        .map((s, i) => ({
            skill: s.name,
            gap: s.gap,
            priority: s.status === "critical" ? "Critical" : s.status === "moderate" ? "High" : "Medium",
            time: s.gap > 30 ? `${Math.ceil(s.gap / 10)} weeks` : `${Math.ceil(s.gap / 5)} week(s)`,
            action: s.gap > 30 ? "Deep course + hands-on projects" : s.gap > 15 ? "Focused study + practice" : "Quick refresher needed",
        }));

    // Chart data for bar comparison
    const barData = gapData.slice(0, 8).map(s => ({
        skill: s.name.length > 8 ? s.name.slice(0, 8) : s.name,
        yours: s.yours,
        required: s.required,
    }));

    return (
        <ResumeGate pageName="Skill Gap Analyzer" pageIcon={<Puzzle size={64} />}>
        <div className="page-enter" style={{ maxWidth: 1100, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 20 }}>
                <div>
                    <h1 style={{ marginBottom: 8, fontSize: "2rem", display: "flex", alignItems: "center", gap: 12 }}>
                        <Puzzle size={28} color="var(--accent)" /> Skill Gap Intelligence
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        Analyzing <strong style={{ color: "var(--accent)" }}>{profile?.domain}</strong> skills against industry requirements.
                    </p>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid-4" style={{ marginBottom: 24 }}>
                <div className="card" style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, color: overallScore >= 75 ? "var(--green)" : overallScore >= 50 ? "var(--yellow)" : "var(--red)" }}>{overallScore}%</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>Overall Readiness</div>
                </div>
                <div className="card" style={{ textAlign: "center", borderColor: "rgba(52,211,153,0.2)" }}>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#34d399" }}>{met}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>Skills Met</div>
                </div>
                <div className="card" style={{ textAlign: "center", borderColor: "rgba(248,113,113,0.2)" }}>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#f87171" }}>{critical}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>Critical Gaps</div>
                </div>
                <div className="card" style={{ textAlign: "center", borderColor: "rgba(251,191,36,0.2)" }}>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#fbbf24" }}>{moderate}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>Moderate Gaps</div>
                </div>
            </div>

            {/* View Toggle */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {([["gap", "Detailed Analysis"], ["radar", "Radar View"], ["priority", "Priority Actions"]] as const).map(([key, label]) => (
                    <button key={key} onClick={() => setActiveView(key)} style={{
                        padding: "8px 18px", borderRadius: 10, border: `1px solid ${activeView === key ? "var(--accent)" : "rgba(255,255,255,0.1)"}`,
                        background: activeView === key ? "rgba(167,139,250,0.15)" : "transparent",
                        color: activeView === key ? "var(--accent)" : "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                    }}>{label}</button>
                ))}
            </div>

            {/* Gap Analysis View */}
            {activeView === "gap" && (
                <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
                    <div className="card">
                        <h3 style={{ marginBottom: 16 }}>Skill-by-Skill Gap Analysis</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {gapData.map((s) => (
                                <div key={s.name}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 6 }}>
                                        <span style={{ color: "var(--text)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                                            {s.status === "met" ? <CheckCircle size={14} color="#34d399" /> : s.status === "critical" ? <AlertTriangle size={14} color="#f87171" /> : <ArrowUpRight size={14} color="#fbbf24" />}
                                            {s.name}
                                        </span>
                                        <span style={{ color: s.status === "met" ? "var(--green)" : s.status === "critical" ? "var(--red)" : "var(--yellow)", fontWeight: 700 }}>
                                            {s.status === "met" ? "✓ Met" : `Gap: ${s.gap}%`}
                                        </span>
                                    </div>
                                    <div style={{ position: "relative", height: 8, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                                        <div style={{ position: "absolute", height: "100%", width: `${s.required}%`, background: "rgba(255,255,255,0.08)", borderRadius: 99 }} />
                                        <div style={{ position: "absolute", height: "100%", width: `${s.yours}%`, background: s.color, borderRadius: 99, transition: "width 0.5s" }} />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: 3 }}>
                                        <span>Yours: {s.yours}%</span><span>Required: {s.required}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card">
                        <h3 style={{ marginBottom: 16 }}>You vs Market Requirements</h3>
                        <ResponsiveContainer width="100%" height={380}>
                            <BarChart data={barData} margin={{ left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="skill" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                <Tooltip contentStyle={{ background: "rgba(10,10,14,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                                <Bar dataKey="yours" name="Your Level" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="required" name="Required" fill="#4b5563" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Radar View */}
            {activeView === "radar" && (
                <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
                    <div className="card">
                        <h3>Competency Radar</h3>
                        <ResponsiveContainer width="100%" height={340}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                                <PolarAngleAxis dataKey="skill" tick={{ fill: "#6b7280", fontSize: 10 }} />
                                <Radar dataKey="yours" name="Your Skills" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.25} />
                                <Radar dataKey="required" name="Industry Req" stroke="#f87171" fill="#f87171" fillOpacity={0.08} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="card" style={{ display: "flex", flexDirection: "column" }}>
                        <h3 style={{ marginBottom: 16 }}>Skill Distribution</h3>
                        {gapData.map(s => (
                            <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                                <span style={{ flex: 1, fontSize: "0.8rem", color: "var(--text-sub)" }}>{s.name}</span>
                                <div style={{ width: 100, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${s.yours}%`, background: s.color, borderRadius: 99 }} />
                                </div>
                                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: s.status === "met" ? "#34d399" : "#f87171", width: 35, textAlign: "right" }}>{s.yours}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Priority Actions View */}
            {activeView === "priority" && (
                <div style={{ marginBottom: 24 }}>
                    <div className="card" style={{ marginBottom: 20 }}>
                        <h3 style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}><Target size={20} color="var(--accent)" /> Priority Upskilling Actions</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {priorities.map((p, i) => (
                                <div key={p.skill} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: `1px solid ${p.priority === "Critical" ? "rgba(248,113,113,0.2)" : p.priority === "High" ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.06)"}` }}>
                                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: p.priority === "Critical" ? "rgba(248,113,113,0.15)" : p.priority === "High" ? "rgba(251,191,36,0.15)" : "rgba(167,139,250,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: p.priority === "Critical" ? "#f87171" : p.priority === "High" ? "#fbbf24" : "#a78bfa", fontWeight: 800, fontSize: "0.85rem", flexShrink: 0 }}>{i + 1}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", marginBottom: 4 }}>{p.skill}</div>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{p.action}</div>
                                    </div>
                                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                                        <span style={{ fontSize: "0.68rem", padding: "3px 10px", borderRadius: 20, fontWeight: 700, background: p.priority === "Critical" ? "rgba(248,113,113,0.12)" : p.priority === "High" ? "rgba(251,191,36,0.12)" : "rgba(167,139,250,0.12)", color: p.priority === "Critical" ? "#f87171" : p.priority === "High" ? "#fbbf24" : "#a78bfa", border: `1px solid ${p.priority === "Critical" ? "rgba(248,113,113,0.25)" : p.priority === "High" ? "rgba(251,191,36,0.25)" : "rgba(167,139,250,0.25)"}` }}>{p.priority}</span>
                                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 6, display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}><Clock size={10} /> {p.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <Link href="/learning" className="btn-primary" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><BookOpen size={16} /> Start Learning Path</Link>
                        <Link href="/interview" className="btn-ghost" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}><Zap size={16} /> Practice Interview</Link>
                    </div>
                </div>
            )}
        </div>
        </ResumeGate>
    );
}
