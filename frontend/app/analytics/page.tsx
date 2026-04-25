"use client";
import React, { useEffect, useState } from "react";
import { useAppStore } from "@/src/state/useAppStore";
import { 
    LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, 
    BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, ComposedChart, Scatter, ScatterChart, ZAxis, Legend, Cell 
} from "recharts";
import { TrendingUp, BarChart2, Activity, Target, Zap, Briefcase, Award, Globe, Database } from "lucide-react";
import ResumeGate from "@/src/components/ResumeGate";

const DOMAIN_BENCHMARKS: Record<string, { skill: string; user: number; avg: number; top10: number }[]> = {
    "Full-Stack": [
        { skill: "Frontend", user: 85, avg: 65, top10: 95 },
        { skill: "Backend", user: 70, avg: 60, top10: 90 },
        { skill: "Database", user: 65, avg: 55, top10: 85 },
        { skill: "DevOps", user: 40, avg: 50, top10: 80 },
        { skill: "System Design", user: 55, avg: 45, top10: 85 },
        { skill: "Security", user: 45, avg: 40, top10: 75 },
    ],
    "AI": [
        { skill: "ML Models", user: 80, avg: 60, top10: 95 },
        { skill: "Data Eng", user: 60, avg: 55, top10: 85 },
        { skill: "Math/Stats", user: 75, avg: 65, top10: 90 },
        { skill: "Cloud", user: 45, avg: 50, top10: 80 },
        { skill: "Deployment", user: 40, avg: 45, top10: 85 },
        { skill: "NLP/CV", user: 65, avg: 55, top10: 90 },
    ],
    "Data Science": [
        { skill: "Python/R", user: 85, avg: 70, top10: 95 },
        { skill: "Statistics", user: 75, avg: 60, top10: 90 },
        { skill: "Visualization", user: 65, avg: 55, top10: 85 },
        { skill: "SQL/NoSQL", user: 80, avg: 65, top10: 90 },
        { skill: "Big Data", user: 50, avg: 45, top10: 80 },
        { skill: "Business Acumen", user: 60, avg: 50, top10: 85 },
    ],
    "Cloud": [
        { skill: "AWS/Azure/GCP", user: 75, avg: 60, top10: 95 },
        { skill: "Infrastructure as Code", user: 65, avg: 50, top10: 85 },
        { skill: "Networking", user: 60, avg: 55, top10: 80 },
        { skill: "Security", user: 70, avg: 60, top10: 90 },
        { skill: "Containerization", user: 80, avg: 65, top10: 95 },
        { skill: "Cost Optimization", user: 55, avg: 45, top10: 80 },
    ],
    "Cybersecurity": [
        { skill: "Pen Testing", user: 70, avg: 55, top10: 90 },
        { skill: "Network Security", user: 80, avg: 65, top10: 95 },
        { skill: "Cryptography", user: 60, avg: 50, top10: 80 },
        { skill: "Incident Response", user: 65, avg: 55, top10: 85 },
        { skill: "Compliance/Audit", user: 55, avg: 50, top10: 75 },
        { skill: "Cloud Security", user: 50, avg: 45, top10: 85 },
    ],
    "Mobile": [
        { skill: "Swift/Kotlin", user: 80, avg: 65, top10: 95 },
        { skill: "React Native/Flutter", user: 75, avg: 60, top10: 90 },
        { skill: "UI/UX", user: 65, avg: 55, top10: 80 },
        { skill: "State Management", user: 70, avg: 60, top10: 85 },
        { skill: "API Integration", user: 85, avg: 70, top10: 95 },
        { skill: "App Publishing", user: 55, avg: 45, top10: 80 },
    ],
    "UX": [
        { skill: "Wireframing", user: 85, avg: 70, top10: 95 },
        { skill: "User Research", user: 70, avg: 55, top10: 85 },
        { skill: "Prototyping", user: 80, avg: 65, top10: 90 },
        { skill: "Visual Design", user: 75, avg: 60, top10: 90 },
        { skill: "Interaction Design", user: 65, avg: 55, top10: 80 },
        { skill: "Usability Testing", user: 60, avg: 50, top10: 85 },
    ],
    "Product": [
        { skill: "Roadmapping", user: 80, avg: 65, top10: 90 },
        { skill: "Agile/Scrum", user: 85, avg: 70, top10: 95 },
        { skill: "User Stories", user: 75, avg: 60, top10: 85 },
        { skill: "Data Analysis", user: 65, avg: 55, top10: 80 },
        { skill: "Market Research", user: 70, avg: 60, top10: 85 },
        { skill: "Stakeholder Mgmt", user: 60, avg: 50, top10: 80 },
    ],
    "default": [
        { skill: "Core Skills", user: 70, avg: 60, top10: 90 },
        { skill: "Communication", user: 80, avg: 70, top10: 95 },
        { skill: "Problem Solving", user: 75, avg: 65, top10: 90 },
        { skill: "Leadership", user: 50, avg: 55, top10: 85 },
        { skill: "Domain Exp", user: 65, avg: 60, top10: 85 },
        { skill: "Tech Tools", user: 60, avg: 50, top10: 80 },
    ]
};

export default function AnalyticsPage() {
    const { profile } = useAppStore();
    const [analysis, setAnalysis] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedAnalysis = localStorage.getItem("ciq-resume-analysis");
            if (storedAnalysis) setAnalysis(JSON.parse(storedAnalysis));

            const storedHistory = localStorage.getItem("ciq-interview-history");
            if (storedHistory) setHistory(JSON.parse(storedHistory));
        }
    }, []);

    const domain = profile?.domain || "Software Engineering";
    const domainKey = Object.keys(DOMAIN_BENCHMARKS).find(k => domain.toLowerCase().includes(k.toLowerCase())) || "default";
    let benchmarkData = DOMAIN_BENCHMARKS[domainKey];

    // Adjust benchmark dynamically if profile skills exist
    if (profile?.skills?.length) {
        benchmarkData = benchmarkData.map((b, i) => ({
            ...b,
            user: Math.min(95, 40 + i * 5 + (profile.experience || 0) * 8)
        }));
    }

    const atsScore = analysis?.atsScore || 65;
    const exp = profile?.experience || 0;

    // Generate dynamic history data
    const monthLabels = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    const growthData = monthLabels.map((m, i) => ({
        m, 
        ats: Math.min(99, Math.max(40, atsScore - (5 - i) * 6)), 
        interview: Math.min(95, 45 + i * 8 + (history.length > 0 ? 5 : 0)),
        marketDemand: 60 + i * 5 + exp * 2
    }));

    const skillVelocityData = (profile?.skills || ["React", "Node.js", "Python", "SQL"]).slice(0, 8).map((s, i) => ({
        skill: s.length > 10 ? s.slice(0, 10) : s,
        hours: Math.floor(Math.random() * 40) + 10,
        mastery: Math.min(100, 40 + Math.floor(Math.random() * 50) + exp * 5),
    }));

    const marketData = [
        { quarter: "Q1 '25", demand: 70, supply: 85 },
        { quarter: "Q2 '25", demand: 75, supply: 80 },
        { quarter: "Q3 '25", demand: 85, supply: 75 },
        { quarter: "Q4 '25", demand: 92, supply: 70 },
        { quarter: "Q1 '26", demand: 98, supply: 65 },
    ];

    const stats = [
        { label: "Career Health Score", value: `${Math.round((atsScore + (benchmarkData[0].user) + 75) / 3)}/100`, icon: <Activity size={20} color="#a78bfa" />, change: "Top 15% in your domain", color: "#a78bfa" },
        { label: "Current ATS Match", value: `${atsScore}%`, icon: <Target size={20} color="#34d399" />, change: `+${atsScore > 60 ? atsScore - 60 : 0}% vs market avg`, color: "#34d399" },
        { label: "Interview Readiness", value: `${history.length > 0 ? history[0].pct : 72}%`, icon: <Briefcase size={20} color="#60a5fa" />, change: `${history.length} mock sessions done`, color: "#60a5fa" },
        { label: "Market Demand", value: "High", icon: <Globe size={20} color="#fbbf24" />, change: "Based on 10,000+ open roles", color: "#fbbf24" },
    ];

    return (
        <ResumeGate pageName="Career Analytics" pageIcon={<BarChart2 size={64} />}>
        <div className="page-enter" style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 20 }}>
                <div>
                    <h1 style={{ marginBottom: 8, fontSize: "2rem", display: "flex", alignItems: "center", gap: 12 }}>
                        <BarChart2 size={28} color="var(--accent)" /> Advanced Analytics
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        Deep intelligence on your career trajectory as a <strong style={{ color: "var(--accent)" }}>{domain}</strong>.
                    </p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <button className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.8rem", background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", color: "var(--accent)" }}>Export PDF Report</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid-4" style={{ marginBottom: 24 }}>
                {stats.map((s) => (
                    <div key={s.label} className="card liquid-glass" style={{ position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -15, right: -15, width: 60, height: 60, background: `${s.color}15`, borderRadius: "50%", pointerEvents: "none" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                            <div style={{ padding: 6, background: `${s.color}15`, borderRadius: 8 }}>{s.icon}</div>
                        </div>
                        <div style={{ fontSize: "1.8rem", fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-sub)" }}>{s.change}</div>
                    </div>
                ))}
            </div>

            <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
                {/* Career Growth Trajectory */}
                <div className="card">
                    <h3 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><TrendingUp size={18} color="#a78bfa" /> Competency Trajectory vs Market</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <ComposedChart data={growthData}>
                            <defs>
                                <linearGradient id="colorAts" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="m" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip contentStyle={{ background: "rgba(15,15,20,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }} />
                            <Legend wrapperStyle={{ fontSize: "0.8rem", paddingTop: 10 }} />
                            <Area type="monotone" dataKey="ats" name="ATS Score" stroke="#34d399" fillOpacity={1} fill="url(#colorAts)" />
                            <Line type="monotone" dataKey="interview" name="Interview Skill" stroke="#60a5fa" strokeWidth={3} dot={{ fill: "#60a5fa", r: 4, strokeWidth: 0 }} />
                            <Line type="monotone" dataKey="marketDemand" name="Market Demand" stroke="#fbbf24" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Domain Benchmark Radar */}
                <div className="card">
                    <h3 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Target size={18} color="#34d399" /> {domain} Benchmark</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <RadarChart data={benchmarkData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                            <PolarGrid stroke="rgba(255,255,255,0.08)" />
                            <PolarAngleAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                            <Radar name="You" dataKey="user" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.4} />
                            <Radar name="Market Avg" dataKey="avg" stroke="#4b5563" fill="transparent" strokeDasharray="3 3" />
                            <Radar name="Top 10%" dataKey="top10" stroke="#34d399" fill="transparent" strokeOpacity={0.5} />
                            <Legend wrapperStyle={{ fontSize: "0.8rem" }} />
                            <Tooltip contentStyle={{ background: "rgba(15,15,20,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid-2" style={{ gap: 24 }}>
                {/* Skill Mastery vs Investment */}
                <div className="card">
                    <h3 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Zap size={18} color="#fbbf24" /> Skill Mastery vs Time Investment</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis type="number" dataKey="hours" name="Est. Hours Invested" unit="h" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis type="number" dataKey="mastery" name="Mastery Score" unit="%" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <ZAxis type="category" dataKey="skill" name="Skill" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: "rgba(15,15,20,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                            <Scatter name="Skills" data={skillVelocityData} fill="#8b5cf6">
                                {skillVelocityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.mastery > 75 ? "#34d399" : entry.mastery > 50 ? "#a78bfa" : "#f87171"} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 10, fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399" }}/> Expert (&gt;75%)</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa" }}/> Intermediate (50-75%)</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f87171" }}/> Beginner (&lt;50%)</span>
                    </div>
                </div>

                {/* Macro Demand Supply */}
                <div className="card">
                    <h3 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Database size={18} color="#60a5fa" /> Global Macro-Trend for {domain}</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={marketData} margin={{ left: -20 }}>
                            <defs>
                                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="quarter" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip contentStyle={{ background: "rgba(15,15,20,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                            <Legend wrapperStyle={{ fontSize: "0.8rem", paddingTop: 10 }} />
                            <Area type="monotone" dataKey="demand" name="Industry Demand" stroke="#60a5fa" strokeWidth={2} fillOpacity={1} fill="url(#colorDemand)" />
                            <Area type="monotone" dataKey="supply" name="Talent Supply" stroke="#f87171" strokeWidth={2} fillOpacity={1} fill="url(#colorSupply)" />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: 10, fontSize: "0.75rem", color: "var(--text-sub)", textAlign: "center", padding: "8px 12px", background: "rgba(96,165,250,0.1)", borderRadius: 8, border: "1px solid rgba(96,165,250,0.2)" }}>
                        Demand for {domain}s is projected to outpace supply significantly by Q1 2026.
                    </div>
                </div>
            </div>
        </div>
        </ResumeGate>
    );
}
