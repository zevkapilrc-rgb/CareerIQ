"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const growthData = [
    { year: "2022", ai: 45, fullstack: 38 }, { year: "2023", ai: 58, fullstack: 44 },
    { year: "2024", ai: 67, fullstack: 50 }, { year: "2025", ai: 75, fullstack: 55 },
    { year: "2026", ai: 83, fullstack: 60 }, { year: "2027", ai: 90, fullstack: 64 },
    { year: "2028", ai: 78, fullstack: 68 },
];
const declining = ["jQuery", "PHP (legacy)", "REST-only APIs", "On-premise hosting", "Traditional QA"];
const rising = ["LangChain", "Rust", "Edge Computing", "AI-native apps", "WebAssembly"];

export default function ForecastPage() {
    return (
        <div>
            <h1 style={{ marginBottom: 4 }}>AI Career Forecast</h1>
            <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: 24 }}>Predict layoff risk, automation impact, and industry growth probability for your career.</p>

            <div className="grid-3" style={{ marginBottom: 20 }}>
                <div className="card" style={{ borderColor: "rgba(52,211,153,0.3)" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>✅</div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#34d399", marginBottom: 6 }}>Low Layoff Risk</div>
                    <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: 0 }}>Your Full-Stack skills are in high demand. Full-Stack devs have a 12% layoff risk — well below the 35% industry average.</p>
                </div>
                <div className="card" style={{ borderColor: "rgba(251,191,36,0.3)" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>⚠️</div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fbbf24", marginBottom: 6 }}>Moderate Automation Risk</div>
                    <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: 0 }}>35% of entry-level frontend tasks may be AI-automated by 2027. Upskilling to AI/ML integration will future-proof your role.</p>
                </div>
                <div className="card" style={{ borderColor: "rgba(167,139,250,0.3)" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>🚀</div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#a78bfa", marginBottom: 6 }}>Strong Industry Growth</div>
                    <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: 0 }}>The AI & Full-Stack industry is projected to grow 78% by 2028. Now is the right time to invest in AI skills.</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
                <h3>Industry Growth Projection (% YoY)</h3>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={growthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="year" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0" }} />
                        <Line type="monotone" dataKey="ai" stroke="#a78bfa" strokeWidth={2} name="AI" />
                        <Line type="monotone" dataKey="fullstack" stroke="#34d399" strokeWidth={2} name="Full-Stack" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h3>📉 Declining Technologies</h3>
                    {declining.map(t => <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "0.82rem", color: "#f87171" }}><span>↘</span>{t}</div>)}
                </div>
                <div className="card">
                    <h3>📈 Rising Technologies</h3>
                    {rising.map(t => <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "0.82rem", color: "#34d399" }}><span>↗</span>{t}</div>)}
                </div>
            </div>
        </div>
    );
}



