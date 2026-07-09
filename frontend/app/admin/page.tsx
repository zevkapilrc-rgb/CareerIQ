"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useAuth } from "@/src/context/AuthContext";
import GlassCard from "@/src/components/ui/GlassCard";
import KPICard from "@/src/components/ui/KPICard";
import Badge from "@/src/components/ui/Badge";
import PremiumButton from "@/src/components/ui/PremiumButton";
import { Users, BarChart3, Database, Trophy, Calendar, MessageSquare, Mail, TrendingUp, RefreshCw } from "lucide-react";

const featureUsage = [
    { feature: "Resume AI", usage: 89 }, { feature: "Interview", usage: 76 }, { feature: "Career Path", usage: 68 },
    { feature: "Analytics", usage: 54 }, { feature: "Chatbot", usage: 48 }, { feature: "Gamification", usage: 42 },
];

function CustomTooltip({ active, payload, label, suffix = "" }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#09090B]/90 backdrop-blur-md border border-white/[0.08] rounded-xl p-3.5 shadow-2xl text-left min-w-[140px] font-sans">
                <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-2 border-b border-white/[0.05] pb-1 font-display">
                    {label}
                </p>
                <div className="space-y-1.5">
                    {payload.map((p: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between gap-4">
                            <span className="text-xs text-zinc-405 flex items-center gap-1.5 font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.stroke || p.fill || "#6D001A" }} />
                                {p.name}
                            </span>
                            <span className="text-xs font-bold text-white font-mono">
                                {p.value}{suffix}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
}

export default function AdminPage() {
    const { isAdmin } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeToday: 0,
        resumesAnalyzed: 0,
        avgScore: 0,
    });
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [growthData, setGrowthData] = useState<any[]>([]);
    const [recentMessages, setRecentMessages] = useState<any[]>([]);
    const [totalMessages, setTotalMessages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        try {
            const res = await fetch("/api/admin/stats");
            if (res.ok) {
                const data = await res.json();
                setStats({
                    totalUsers: data.totalUsers ?? 0,
                    activeToday: data.activeToday ?? 0,
                    resumesAnalyzed: data.resumesAnalyzed ?? 0,
                    avgScore: data.avgScore ?? 0,
                });
                if (data.recentUsers?.length > 0) setRecentUsers(data.recentUsers);
                if (data.growthData?.length > 0) setGrowthData(data.growthData);
                if (data.recentMessages) setRecentMessages(data.recentMessages);
                if (data.totalMessages !== undefined) setTotalMessages(data.totalMessages);
            }
        } catch (err) {
            console.error("Failed to fetch admin stats");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (!isAdmin) return;
        fetchStats();
    }, [isAdmin]);

    const statCardsData = [
        { label: "Total Users", val: stats.totalUsers, desc: "Registered in MongoDB", icon: Users, color: "#6D001A" },
        { label: "Active Today", val: stats.activeToday, desc: "Updated within 24h", icon: Calendar, color: "#A1A1AA" },
        { label: "Resumes Scanned", val: stats.resumesAnalyzed, desc: "Mapped profiles", icon: Database, color: "#6D001A" },
        { label: "Avg XP Score", val: stats.avgScore > 0 ? stats.avgScore : "—", desc: "User median", icon: Trophy, color: "#A1A1AA" },
        { label: "Messages", val: totalMessages, desc: "Total inquiries", icon: MessageSquare, color: "#6D001A" },
    ];

    if (!isAdmin) {
        return (
            <div className="max-w-[760px] mx-auto px-4 pb-16 pt-10">
                <GlassCard className="p-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Access Restricted</h1>
                    <p className="mt-3 text-sm text-[var(--text-muted)]">You need administrative access to view this console.</p>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="max-w-[1280px] mx-auto px-4 pb-16 pt-4 space-y-8 animate-fade">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 border-b border-[var(--border)] pb-6 mt-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-primary-light)] font-display">System Operations</span>
                        <Badge variant="danger">Helix Console</Badge>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text)] tracking-tight leading-none font-display">
                        AI Control Center
                    </h1>
                    <p className="text-xs text-[var(--text-muted)] mt-2.5 leading-relaxed font-semibold">
                        Administrative node dashboard displaying statistics and message logs directly parsed from MongoDB database.
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <PremiumButton onClick={() => fetchStats(true)} disabled={refreshing}>
                        <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
                        Refresh Operations
                    </PremiumButton>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {statCardsData.map((s, idx) => {
                    const Icon = s.icon;
                    return (
                        <KPICard
                            key={idx}
                            title={s.label}
                            value={loading ? "—" : typeof s.val === 'number' ? s.val.toLocaleString() : s.val}
                            icon={<Icon size={16} />}
                            sparklineData={idx % 2 === 0 ? [20, 30, 28, 42, 50, 65] : [40, 35, 45, 38, 55, 52]}
                            sparklineColor={s.color}
                            footer={
                                <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mt-1">
                                    {s.desc}
                                </span>
                            }
                        />
                    );
                })}
            </div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                    <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-widest flex items-center gap-2 mb-6 font-display border-b border-[var(--border)] pb-4">
                        <TrendingUp size={15} className="text-[var(--color-primary-light)]" /> Registration Growth
                    </h3>
                    <div className="h-[230px]">
                        {loading ? (
                            <div className="flex items-center justify-center h-full text-xs text-zinc-500 font-semibold">Loading charts...</div>
                        ) : growthData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={growthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="users" name="Registrations" stroke="#6D001A" strokeWidth={2.5} dot={{ fill: "#6D001A", stroke: "#121214", strokeWidth: 1.5, r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-xs text-zinc-500 font-semibold">No data logged yet</div>
                        )}
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-widest flex items-center gap-2 mb-6 font-display border-b border-[var(--border)] pb-4">
                        <BarChart3 size={15} className="text-[var(--color-primary-light)]" /> Feature Usage Ratio
                    </h3>
                    <div className="h-[230px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={featureUsage} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
                                <YAxis dataKey="feature" type="category" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                                <Tooltip content={<CustomTooltip suffix="%" />} />
                                <Bar dataKey="usage" name="Usage Share" fill="#6D001A" radius={[0, 4, 4, 0]} barSize={13} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </div>

            {/* Recent Registrations Table */}
            <GlassCard className="p-6">
                <div className="flex justify-between items-center mb-6 border-b border-[var(--border)] pb-4">
                    <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-widest flex items-center gap-2 font-display">
                        <Users size={15} className="text-[var(--color-primary-light)]" /> Recent Registrations
                    </h3>
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-widest font-mono">Live MongoDB Query</span>
                </div>
                {loading ? (
                    <div className="text-center py-8 text-xs text-zinc-500 font-semibold">Retrieving records...</div>
                ) : recentUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-sans">
                            <thead>
                                <tr className="border-b border-[var(--border)]">
                                    <th className="py-3 px-3 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest font-display">User</th>
                                    <th className="py-3 px-3 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest font-display">Email</th>
                                    <th className="py-3 px-3 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest font-display">Level</th>
                                    <th className="py-3 px-3 text-right text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest font-display">XP</th>
                                    <th className="py-3 px-3 text-right text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest font-display">Skills</th>
                                    <th className="py-3 px-3 text-right text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest font-display">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map((u, i) => (
                                    <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center text-[10px] font-bold text-[var(--color-primary-light)] flex-shrink-0">
                                                    {u.name?.[0] || "?"}
                                                </div>
                                                <span className="text-[var(--text)] font-bold truncate max-w-[120px]">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-[var(--text-muted)] font-mono truncate max-w-[160px]">{u.email}</td>
                                        <td className="py-3 px-3">
                                            <Badge variant="primary">{u.level}</Badge>
                                        </td>
                                        <td className="py-3 px-3 text-right text-[var(--text)] font-bold font-mono">{u.xp || 0}</td>
                                        <td className="py-3 px-3 text-right text-[var(--text-muted)] font-semibold">{u.skills || 0} nodes</td>
                                        <td className="py-3 px-3 text-right text-[var(--text-muted)] font-semibold font-mono">{u.joined}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-xs text-zinc-500">No registered users yet.</div>
                )}
            </GlassCard>

            {/* Contact Messages Table */}
            <GlassCard className="p-6">
                <div className="flex justify-between items-center mb-6 border-b border-[var(--border)] pb-4">
                    <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-widest flex items-center gap-2 font-display">
                        <Mail size={15} className="text-[var(--color-primary-light)]" /> Recent Contact Messages
                    </h3>
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-widest font-mono">
                        {totalMessages} total inquiries
                    </span>
                </div>
                {loading ? (
                    <div className="text-center py-8 text-xs text-zinc-500 font-semibold">Retrieving records...</div>
                ) : recentMessages.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-sans">
                            <thead>
                                <tr className="border-b border-[var(--border)]">
                                    <th className="py-3 px-3 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest font-display">Sender</th>
                                    <th className="py-3 px-3 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest font-display">Email</th>
                                    <th className="py-3 px-3 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest font-display">Subject</th>
                                    <th className="py-3 px-3 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest font-display">Message</th>
                                    <th className="py-3 px-3 text-right text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest font-display">Received</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentMessages.map((m, i) => (
                                    <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-6 h-6 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[9px] font-bold text-zinc-400 flex-shrink-0">
                                                    {m.name?.[0] || "?"}
                                                </div>
                                                <span className="text-white font-bold truncate max-w-[100px]">{m.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-[var(--text-muted)] font-mono truncate max-w-[140px]">{m.email}</td>
                                        <td className="py-3 px-3 text-[var(--text)] font-bold truncate max-w-[120px]">{m.subject}</td>
                                        <td className="py-3 px-3 text-[var(--text-muted)] truncate max-w-[200px] font-semibold">{m.message}</td>
                                        <td className="py-3 px-3 text-right text-[var(--text-muted)] font-semibold font-mono whitespace-nowrap">{m.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-xs text-zinc-500">No contact messages yet.</div>
                )}
            </GlassCard>
        </div>
    );
}
