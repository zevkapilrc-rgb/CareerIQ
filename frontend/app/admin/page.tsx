"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";

const userGrowth = [
    { month: "Oct", users: 32000 }, { month: "Nov", users: 36000 }, { month: "Dec", users: 40000 },
    { month: "Jan", users: 44000 }, { month: "Feb", users: 48000 }, { month: "Mar", users: 50000 },
];
const featureUsage = [
    { feature: "Resume AI", usage: 89 }, { feature: "Interview", usage: 76 }, { feature: "Career Path", usage: 68 },
    { feature: "Analytics", usage: 54 }, { feature: "Chatbot", usage: 48 }, { feature: "Gamification", usage: 42 },
];
const recentUsers = [
    { name: "Priya Patel", email: "priya@example.com", joined: "2 hrs ago", level: "Specialist" },
    { name: "Rahul Gupta", email: "rahul@example.com", joined: "4 hrs ago", level: "Explorer" },
    { name: "Sneha Iyer", email: "sneha@example.com", joined: "6 hrs ago", level: "Learner" },
    { name: "Dev Malhotra", email: "dev@example.com", joined: "8 hrs ago", level: "Specialist" },
    { name: "Kavya Reddy", email: "kavya@example.com", joined: "1 day ago", level: "Strategist" },
];

export default function AdminPage() {
    return (
        <div>
            <h1 style={{ marginBottom: 4 }}>Admin Dashboard</h1>
            <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: 24 }}>Platform analytics, user insights, and AI metrics overview.</p>

            <div className="grid-4" style={{ marginBottom: 20 }}>
                {[["Total Users", "50,241", "↑ 12% this month", "#a78bfa"], ["Active Today", "3,842", "↑ 8% vs yesterday", "#34d399"], ["Resumes Analyzed", "121,440", "↑ 340 today", "#60a5fa"], ["Avg Career Score", "74/100", "↑ 3 pts", "#fbbf24"]].map(([label, val, change, color]) => (
                    <div key={label as string} className="stat-card">
                        <div className="stat-label">{label}</div>
                        <div className="stat-value" style={{ color: color as string, fontSize: "1.4rem" }}>{val}</div>
                        <div className="stat-change">{change}</div>
                    </div>
                ))}
            </div>

            <div className="grid-2" style={{ marginBottom: 20 }}>
                <div className="card">
                    <h3>User Growth</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={userGrowth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0" }} formatter={(v: number) => [v.toLocaleString(), "Users"]} />
                            <Line type="monotone" dataKey="users" stroke="#a78bfa" strokeWidth={2} dot={{ fill: "#a78bfa", r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="card">
                    <h3>Feature Usage Heatmap</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={featureUsage} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis type="number" domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
                            <YAxis dataKey="feature" type="category" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} width={75} />
                            <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0" }} />
                            <Bar dataKey="usage" fill="#7c3aed" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card">
                <h3>Recent Users</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {recentUsers.map((u, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < recentUsers.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 700, color: "white", flexShrink: 0 }}>{u.name[0]}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: "0.83rem", color: "#e2e8f0" }}>{u.name}</div>
                                <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>{u.email}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <span className="badge-purple" style={{ fontSize: "0.65rem" }}>{u.level}</span>
                                <div style={{ fontSize: "0.68rem", color: "#6b7280", marginTop: 4 }}>{u.joined}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}



