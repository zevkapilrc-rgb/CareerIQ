"use client";
import React from "react";
import { useAppStore } from "@/src/state/useAppStore";
import Link from "next/link";
import ResumeGate from "@/src/components/ResumeGate";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { Compass, TrendingUp, Target, Zap, Award, ArrowRight, Clock, DollarSign, Briefcase, Shield } from "lucide-react";

const ROLE_DB: Record<string, { roles: { title: string; base: number; salary: string; demand: string; color: string; skills: string[] }[]; roadmap: { title: string; timeline: string; tasks: string[] }[] }> = {
    "Full-Stack Developer": {
        roles: [
            { title: "Senior Full-Stack Engineer", base: 85, salary: "₹18–28 LPA", demand: "Very High", color: "#a78bfa", skills: ["React", "Node.js", "TypeScript", "System Design"] },
            { title: "AI Full-Stack Engineer", base: 62, salary: "₹22–35 LPA", demand: "Explosive", color: "#34d399", skills: ["Python", "LangChain", "Vector DBs", "LLM APIs"] },
            { title: "Tech Lead / Architect", base: 50, salary: "₹28–45 LPA", demand: "High", color: "#60a5fa", skills: ["System Design", "Leadership", "Cloud Architecture"] },
            { title: "DevOps Engineer", base: 45, salary: "₹16–24 LPA", demand: "High", color: "#fbbf24", skills: ["Docker", "Kubernetes", "AWS", "CI/CD"] },
        ],
        roadmap: [
            { title: "Advanced TypeScript & React Patterns", timeline: "Month 1-2", tasks: ["Master generics & utility types", "Next.js App Router deep dive", "Build 2 portfolio projects"] },
            { title: "Backend & API Mastery", timeline: "Month 2-3", tasks: ["FastAPI or NestJS deep dive", "PostgreSQL + Redis caching", "GraphQL API design"] },
            { title: "Cloud & DevOps", timeline: "Month 3-4", tasks: ["AWS Certified Developer prep", "Docker + Kubernetes basics", "GitHub Actions CI/CD"] },
            { title: "AI/ML Integration", timeline: "Month 4-5", tasks: ["Python ML basics", "LangChain & GPT APIs", "Build AI-powered project"] },
            { title: "System Design & Leadership", timeline: "Month 5-6", tasks: ["HLD & LLD interviews", "Distributed systems", "Tech lead communication"] },
        ],
    },
    "AI/ML Engineer": {
        roles: [
            { title: "Senior ML Engineer", base: 80, salary: "₹22–35 LPA", demand: "Very High", color: "#34d399", skills: ["Python", "TensorFlow", "PyTorch", "MLOps"] },
            { title: "AI Research Scientist", base: 55, salary: "₹30–50 LPA", demand: "High", color: "#a78bfa", skills: ["Research", "Papers", "Novel architectures"] },
            { title: "LLM Engineer", base: 70, salary: "₹25–40 LPA", demand: "Explosive", color: "#f472b6", skills: ["LangChain", "RAG", "Fine-tuning", "Prompt Engineering"] },
            { title: "Data Engineer", base: 60, salary: "₹18–28 LPA", demand: "High", color: "#60a5fa", skills: ["Spark", "Airflow", "Data Pipelines"] },
        ],
        roadmap: [
            { title: "Deep Learning Mastery", timeline: "Month 1-2", tasks: ["CNNs, RNNs, Transformers", "PyTorch Lightning", "Build 3 DL projects"] },
            { title: "LLM & Generative AI", timeline: "Month 2-3", tasks: ["Fine-tuning LLMs", "RAG pipelines", "LangChain agents"] },
            { title: "MLOps & Deployment", timeline: "Month 3-4", tasks: ["MLflow, W&B tracking", "Model serving (FastAPI)", "Docker + K8s for ML"] },
            { title: "Research & Innovation", timeline: "Month 4-5", tasks: ["Read 10 papers", "Reproduce a SOTA model", "Publish findings"] },
            { title: "Leadership & Strategy", timeline: "Month 5-6", tasks: ["AI ethics & governance", "Team mentoring", "Product-AI alignment"] },
        ],
    },
};

const DEFAULT_ROLES = {
    roles: [
        { title: "Senior Engineer", base: 75, salary: "₹16–26 LPA", demand: "High", color: "#a78bfa", skills: ["Core Domain", "Problem Solving", "Leadership"] },
        { title: "Tech Lead", base: 55, salary: "₹24–38 LPA", demand: "High", color: "#34d399", skills: ["System Design", "Communication", "Architecture"] },
        { title: "Product Manager", base: 40, salary: "₹20–30 LPA", demand: "Medium", color: "#60a5fa", skills: ["Product Thinking", "Analytics", "Strategy"] },
    ],
    roadmap: [
        { title: "Domain Expertise", timeline: "Month 1-2", tasks: ["Deep dive into core domain", "Build expertise projects", "Get certified"] },
        { title: "Leadership Skills", timeline: "Month 2-4", tasks: ["Mentor juniors", "Lead a team project", "Communication workshops"] },
        { title: "Strategic Thinking", timeline: "Month 4-6", tasks: ["System design practice", "Business case studies", "Cross-functional collaboration"] },
    ],
};

export default function CareerPathPage() {
    const { profile } = useAppStore();
    const [analysis, setAnalysis] = React.useState<any>(null);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("ciq-resume-analysis");
            if (stored) setAnalysis(JSON.parse(stored));
        }
    }, []);

    // Find best matching role database
    const domain = profile?.domain || "";
    const domainKey = Object.keys(ROLE_DB).find(k => domain.toLowerCase().includes(k.toLowerCase().split(" ")[0].replace(/[^a-z]/g, ""))) || "";
    const db = ROLE_DB[domainKey] || DEFAULT_ROLES;

    // Calculate alignment based on actual user skills
    const userSkills = (profile?.skills || []).map(s => s.toLowerCase());
    const roles = db.roles.map(r => {
        const matchedSkills = r.skills.filter(rs => userSkills.some(us => us.includes(rs.toLowerCase()) || rs.toLowerCase().includes(us)));
        const skillMatch = r.skills.length > 0 ? (matchedSkills.length / r.skills.length) * 100 : 0;
        const expBoost = (profile?.experience || 0) * 4;
        const align = Math.min(98, Math.round(r.base * 0.4 + skillMatch * 0.6 + expBoost));
        return { ...r, align, matchedSkills, totalSkills: r.skills.length };
    }).sort((a, b) => b.align - a.align);

    const topRole = roles[0];
    const careerPath = analysis?.careerInsights?.suggestedPath || `${topRole.title} → Tech Lead → Engineering Manager`;

    // Charts data
    const probData = roles.map(r => ({ role: r.title.split(" ").slice(0, 2).join(" "), prob: r.align, fill: r.color }));

    const salaryData = [
        { year: "Now", primary: 14 + (profile?.experience || 0) * 3, secondary: 12 + (profile?.experience || 0) * 2 },
        { year: "+1yr", primary: 20 + (profile?.experience || 0) * 3, secondary: 16 + (profile?.experience || 0) * 2 },
        { year: "+2yr", primary: 28 + (profile?.experience || 0) * 3, secondary: 22 + (profile?.experience || 0) * 2 },
        { year: "+3yr", primary: 38 + (profile?.experience || 0) * 3, secondary: 28 + (profile?.experience || 0) * 2 },
        { year: "+5yr", primary: 55 + (profile?.experience || 0) * 3, secondary: 38 + (profile?.experience || 0) * 2 },
    ];

    const radarSkills = (profile?.skills || []).slice(0, 6).map((s, i) => ({
        skill: s.length > 10 ? s.slice(0, 10) : s,
        current: Math.min(95, 55 + i * 5 + (profile?.experience || 0) * 5),
        target: Math.min(100, 80 + i * 2),
    }));

    const marketReadiness = Math.round(roles.reduce((sum, r) => sum + r.align, 0) / roles.length);

    return (
        <ResumeGate pageName="Career Path AI" pageIcon={<Compass size={64} />}>
        <div className="page-enter" style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 20 }}>
                <div>
                    <h1 style={{ marginBottom: 8, fontSize: "2rem", display: "flex", alignItems: "center", gap: 12 }}>
                        <Compass size={28} color="var(--accent)" /> Career Path Intelligence
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: 600 }}>
                        AI-analyzed career trajectory for <strong style={{ color: "var(--accent)" }}>{profile?.domain}</strong> with{" "}
                        <strong style={{ color: "var(--green)" }}>{profile?.skills?.length} skills</strong> and{" "}
                        <strong>{profile?.experience} year(s)</strong> experience.
                    </p>
                </div>
                <div style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", padding: "8px 18px", borderRadius: 12, fontSize: "0.85rem", color: "#34d399", fontWeight: 600 }}>
                    Market Readiness: {marketReadiness}%
                </div>
            </div>

            {/* Career Path Banner */}
            <div className="card animate-glow" style={{ marginBottom: 24, padding: "28px 32px", background: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(0,0,0,0.4))", borderColor: "rgba(167,139,250,0.4)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -30, right: -30, width: 200, height: 200, background: "radial-gradient(circle,rgba(167,139,250,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />
                <div style={{ fontSize: "0.7rem", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>AI-PREDICTED CAREER TRAJECTORY</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>{careerPath}</div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--text-muted)" }}><DollarSign size={14} color="#34d399" /> Top Potential: {topRole.salary}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--text-muted)" }}><TrendingUp size={14} color="#60a5fa" /> Demand: {topRole.demand}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--text-muted)" }}><Shield size={14} color="#fbbf24" /> Alignment: {topRole.align}%</div>
                </div>
            </div>

            {/* Role Cards */}
            <div className="grid-2" style={{ marginBottom: 24 }}>
                {roles.slice(0, 4).map((r) => (
                    <div key={r.title} className="card" style={{ borderColor: `${r.color}40`, position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -15, right: -15, width: 60, height: 60, background: `${r.color}10`, borderRadius: "50%", pointerEvents: "none" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 14 }}>
                            <div>
                                <h3 style={{ marginBottom: 4 }}>{r.title}</h3>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{r.salary}</div>
                            </div>
                            <span style={{ fontSize: "0.68rem", background: `${r.color}18`, color: r.color, border: `1px solid ${r.color}35`, borderRadius: 20, padding: "3px 12px", fontWeight: 700 }}>{r.demand}</span>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 4 }}>
                                <span>Alignment</span><span style={{ color: r.color, fontWeight: 700 }}>{r.align}%</span>
                            </div>
                            <div className="progress-track"><div className="progress-fill" style={{ width: `${r.align}%`, background: `linear-gradient(90deg, ${r.color}88, ${r.color})` }} /></div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {r.skills.map(s => {
                                const has = r.matchedSkills.includes(s);
                                return <span key={s} style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: 6, background: has ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.08)", color: has ? "#34d399" : "#f87171", border: `1px solid ${has ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.2)"}` }}>{has ? "✓" : "✕"} {s}</span>;
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid-2" style={{ marginBottom: 24, gap: 24 }}>
                <div className="card">
                    <h3>Role Probability Analysis</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={probData} layout="vertical" margin={{ left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                            <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <YAxis type="category" dataKey="role" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
                            <Tooltip contentStyle={{ background: "rgba(10,10,14,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                            <Bar dataKey="prob" radius={[0, 6, 6, 0]} fill="#7c3aed" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="card">
                    <h3>Salary Projection (₹ LPA)</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={salaryData}>
                            <defs>
                                <linearGradient id="salGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="year" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: "rgba(10,10,14,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                            <Area type="monotone" dataKey="primary" name="AI-Enhanced Path" stroke="#a78bfa" strokeWidth={3} fill="url(#salGrad)" />
                            <Area type="monotone" dataKey="secondary" name="Traditional Path" stroke="#4b5563" strokeWidth={2} fill="transparent" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Skill Radar + Readiness */}
            <div className="grid-2" style={{ marginBottom: 24, gap: 24 }}>
                <div className="card">
                    <h3>Skill vs Target Radar</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <RadarChart data={radarSkills}>
                            <PolarGrid stroke="rgba(255,255,255,0.08)" />
                            <PolarAngleAxis dataKey="skill" tick={{ fill: "#6b7280", fontSize: 10 }} />
                            <Radar dataKey="current" name="Your Level" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.2} />
                            <Radar dataKey="target" name="Target" stroke="#34d399" fill="#34d399" fillOpacity={0.08} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                <div className="card" style={{ display: "flex", flexDirection: "column" }}>
                    <h3 style={{ marginBottom: 16 }}>Career Readiness Scorecard</h3>
                    {[
                        ["Technical Depth", Math.min(95, 60 + (profile?.skills?.length || 0) * 3), "var(--accent)"],
                        ["Market Demand Fit", marketReadiness, "var(--green)"],
                        ["Experience Level", Math.min(95, 30 + (profile?.experience || 0) * 15), "var(--blue)"],
                        ["AI Readiness", Math.min(90, 25 + (profile?.skills || []).filter(s => ["python", "ai", "ml", "tensorflow", "pytorch", "langchain"].some(k => s.toLowerCase().includes(k))).length * 20), "#f472b6"],
                        ["Leadership Potential", Math.min(85, 35 + (profile?.experience || 0) * 12), "var(--yellow)"],
                    ].map(([label, val, color]) => (
                        <div key={label as string} style={{ marginBottom: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: 4 }}>
                                <span style={{ color: "var(--text-sub)" }}>{label}</span>
                                <span style={{ color: color as string, fontWeight: 700 }}>{val}%</span>
                            </div>
                            <div className="progress-track" style={{ height: 6 }}>
                                <div className="progress-fill" style={{ width: `${val}%`, background: color as string }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Roadmap */}
            <div className="card">
                <h3 style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}><Award size={20} color="var(--accent)" /> 6-Month Growth Roadmap</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {db.roadmap.map((phase, i) => (
                        <div key={i} style={{ display: "flex", gap: 16, position: "relative" }}>
                            {i < db.roadmap.length - 1 && <div style={{ position: "absolute", left: 15, top: 32, width: 2, height: "calc(100% - 8px)", background: "rgba(167,139,250,0.15)" }} />}
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, color: "white", flexShrink: 0, boxShadow: "0 4px 12px rgba(124,58,237,0.3)" }}>{i + 1}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>{phase.title}</div>
                                    <span style={{ fontSize: "0.7rem", color: "var(--accent)", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 8, padding: "2px 10px", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Clock size={10} /> {phase.timeline}</span>
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {phase.tasks.map(t => <span key={t} className="skill-tag">{t}</span>)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </ResumeGate>
    );
}
