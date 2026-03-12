"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const stats = [
    { label: "Career Health", value: "78/100", change: "↑ 6 pts this month", color: "#a78bfa" },
    { label: "Avg ATS Score", value: "82%", change: "↑ 22 pts vs 6 months ago", color: "#34d399" },
    { label: "Interview Score", value: "71%", change: "↑ 26 pts vs baseline", color: "#60a5fa" },
    { label: "Skills Tracked", value: "10", change: "88% avg proficiency", color: "#fbbf24" },
];
const growthData = [{ m: "Oct", v: 52 }, { m: "Nov", v: 58 }, { m: "Dec", v: 63 }, { m: "Jan", v: 68 }, { m: "Feb", v: 74 }, { m: "Mar", v: 80 }];
const atsData = [{ m: "Oct", v: 60 }, { m: "Nov", v: 64 }, { m: "Dec", v: 68 }, { m: "Jan", v: 74 }, { m: "Feb", v: 78 }, { m: "Mar", v: 82 }];
const interviewData = [{ m: "Oct", v: 45 }, { m: "Nov", v: 52 }, { m: "Dec", v: 58 }, { m: "Jan", v: 63 }, { m: "Feb", v: 68 }, { m: "Mar", v: 71 }];
const productivityData = [{ day: "Mon", hours: 3 }, { day: "Tue", hours: 2 }, { day: "Wed", hours: 4 }, { day: "Thu", hours: 2.5 }, { day: "Fri", hours: 3.5 }, { day: "Sat", hours: 1.5 }, { day: "Sun", hours: 0.5 }];
const radarData = [{ skill: "React", v: 88 }, { skill: "TS", v: 80 }, { skill: "Node", v: 72 }, { skill: "Python", v: 45 }, { skill: "SQL", v: 70 }, { skill: "DSA", v: 60 }];

export default function AnalyticsPage() {
    return (
        <div>
            <h1 style={{ marginBottom: 4 }}>Career Analytics</h1>
            <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: 24 }}>Deep insights into your skill growth, interview progress, and career trajectory.</p>

            <div className="grid-4" style={{ marginBottom: 20 }}>
                {stats.map((s) => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value" style={{ color: s.color, fontSize: "1.6rem" }}>{s.value}</div>
                        <div className="stat-change">{s.change}</div>
                    </div>
                ))}
            </div>

            <div className="grid-2" style={{ marginBottom: 20 }}>
                <div className="card">
                    <h3>Skill Growth Curve</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={growthData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="m" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0" }} /><Line type="monotone" dataKey="v" stroke="#a78bfa" strokeWidth={2} dot={{ fill: "#a78bfa", r: 3 }} /></LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="card">
                    <h3>ATS Score Improvement</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={atsData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="m" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0" }} /><Line type="monotone" dataKey="v" stroke="#34d399" strokeWidth={2} dot={{ fill: "#34d399", r: 3 }} /></LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h3>Interview Readiness</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={interviewData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="m" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0" }} /><Line type="monotone" dataKey="v" stroke="#60a5fa" strokeWidth={2} dot={{ fill: "#60a5fa", r: 3 }} /></LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="card">
                    <h3>Weekly Productivity</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={productivityData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0" }} /><Bar dataKey="hours" fill="#7c3aed" radius={[4, 4, 0, 0]} /></BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}



