"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/src/state/useAppStore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
    AreaChart, Area, XAxis, YAxis, Tooltip
} from "recharts";
import {
    FileText, Rocket, Mic, BookOpen, Briefcase,
    Zap, TrendingUp, CheckCircle, Sparkles, ChevronRight,
    Award, ShieldAlert, Code, ArrowUpRight, LockKeyhole,
    CheckCircle2, Activity
} from "lucide-react";
import GlassCard from "@/src/components/ui/GlassCard";
import KPICard from "@/src/components/ui/KPICard";
import ProgressRing from "@/src/components/ui/ProgressRing";
import TabBar from "@/src/components/ui/TabBar";
import Badge from "@/src/components/ui/Badge";
import PremiumButton from "@/src/components/ui/PremiumButton";

const LinkedinIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

// Skeletons / Empty state matching futuristic theme
function EmptyDashboard() {
    return (
        <div className="max-w-[1200px] mx-auto py-16 px-4 relative overflow-hidden animate-fade">
            {/* Ambient Background Orbs */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--teal)]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="mb-12 text-center relative z-10">
                <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text)] font-display mb-3 tracking-tight">
                    Competence Command Dashboard
                </h1>
                <p className="text-[10px] text-[var(--text-muted)] font-extrabold tracking-widest uppercase font-display">
                    Initialize your profile coordinates to activate platform personalization
                </p>
            </div>
            
            <GlassCard hoverLift={false} className="max-w-xl mx-auto text-center py-16 px-8 relative overflow-hidden z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--teal)]/5 via-transparent to-transparent pointer-events-none" />
                
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--teal)]/10 border border-[var(--teal)]/20 flex items-center justify-center text-[var(--accent)] animate-pulse">
                        <FileText size={32} />
                    </div>
                </div>
                
                <h2 className="text-xl font-bold text-[var(--text)] mb-3 font-display">No Resume Uploaded</h2>
                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mb-8 leading-relaxed font-semibold">
                    Upload your professional resume scan to activate your personalized AI skill dashboard, competency matrix, and labor demand forecasts.
                </p>
                
                <Link href="/resume" className="inline-flex justify-center w-full sm:w-auto">
                    <PremiumButton variant="primary" className="h-11 px-8">
                        <Rocket size={16} /> Get Started Now
                    </PremiumButton>
                </Link>
            </GlassCard>
            
            <div className="opacity-30 filter blur-[1px] pointer-events-none select-none mt-12 max-w-4xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {["Match Score", "Career Health", "Detected Skills", "Total Experience"].map((l, i) => (
                        <div key={i} className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl text-center">
                            <div className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest font-display">{l}</div>
                            <div className="text-xl font-bold text-[var(--text-muted)] mt-2">—</div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="text-center mt-12 text-[10px] text-zinc-550 font-extrabold flex items-center justify-center gap-2 relative z-10 uppercase tracking-widest font-display">
                <LockKeyhole size={14} className="text-[var(--accent)]" /> Personalization gate active
            </div>
        </div>
    );
}

interface MetricCardProps {
    label: string;
    value: string | number;
    suffix?: string;
    icon: React.ReactNode;
    secondsAgo: number;
    sparkData: number[];
    color: string;
}

function MetricCard({ label, value, suffix, icon, secondsAgo, sparkData, color }: MetricCardProps) {
    return (
        <KPICard
            title={label}
            value={value}
            suffix={suffix}
            icon={icon}
            sparklineData={sparkData}
            sparklineColor={color}
            footer={
                <div className="flex items-center gap-1.5 text-[9px] text-[var(--text-muted)] font-extrabold font-mono uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                    <span>Sync {secondsAgo}s ago</span>
                </div>
            }
        />
    );
}

export default function DashboardPage() {
    const { profile } = useAppStore();
    const [analysis, setAnalysis] = useState<any>(null);
    const [activeDetailTab, setActiveDetailTab] = useState<string>("summary");
    const [secondsAgo, setSecondsAgo] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [projection, setProjection] = useState<string>("default");
    const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
    const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("ciq-resume-analysis") || (profile?.resumeAnalysis ? JSON.stringify(profile.resumeAnalysis) : null);
            if (stored) {
                try {
                    setAnalysis(JSON.parse(stored));
                } catch (e) {
                    console.error("Failed parsing storage resume details", e);
                }
            }
            const storedTasks = localStorage.getItem("ciq-dashboard-tasks");
            if (storedTasks) {
                try {
                    setCompletedTasks(JSON.parse(storedTasks));
                } catch {}
            }
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                if (!tickIntervalRef.current) {
                    tickIntervalRef.current = setInterval(() => {
                        setSecondsAgo(s => s + 1);
                    }, 1000);
                }
            } else {
                if (tickIntervalRef.current) {
                    clearInterval(tickIntervalRef.current);
                    tickIntervalRef.current = null;
                }
            }
        };

        tickIntervalRef.current = setInterval(() => {
            setSecondsAgo(s => s + 1);
        }, 1000);

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [profile]);

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div style={{
                    width: 24, height: 24,
                    border: "2px solid rgba(109,0,26,0.3)",
                    borderTopColor: "var(--teal)",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite"
                }} />
            </div>
        );
    }

    if (!profile || !profile.skills || profile.skills.length === 0) {
        return <EmptyDashboard />;
    }

    const baseAtsScore = analysis?.scores?.ats_score || analysis?.atsScore || Math.min(97, 50 + profile.skills.length * 3 + (profile.experience || 0) * 6);
    const baseHealthScore = Math.min(97, 50 + profile.skills.length * 3 + (profile.experience || 0) * 6);
    const baseCareerPath = analysis?.career_insights?.suggested_career_paths?.[0] || analysis?.careerInsights?.suggestedPath || `${profile.domain} â†’ Consultant â†’ Architect`;

    const activeProj = projection !== "default" ? (
        projection === "senior" ? {
            domain: "Senior Software Architect",
            experience: Math.max(8, (profile?.experience || 0) + 4),
            skills: [...(profile?.skills || []), "System Design", "Cloud Architecture", "Kubernetes", "Microservices"],
            atsScore: Math.min(98, baseAtsScore + 15),
            healthScore: Math.min(99, baseHealthScore + 12),
            careerPath: "Senior Architect â†’ VP of Engineering â†’ CTO"
        } : projection === "ai_specialist" ? {
            domain: "AI Full-Stack Specialist",
            experience: Math.max(5, (profile?.experience || 0) + 2),
            skills: [...(profile?.skills || []), "Python", "PyTorch", "LangChain", "Vector Databases", "LLMOps"],
            atsScore: Math.min(96, baseAtsScore + 10),
            healthScore: Math.min(97, baseHealthScore + 15),
            careerPath: "AI Engineer â†’ Applied AI Lead â†’ Chief AI Scientist"
        } : {
            domain: "Engineering Manager",
            experience: Math.max(10, (profile?.experience || 0) + 5),
            skills: [...(profile?.skills || []), "Agile Management", "Strategic Planning", "Leadership", "Team Mentoring"],
            atsScore: Math.min(95, baseAtsScore + 8),
            healthScore: Math.min(96, baseHealthScore + 10),
            careerPath: "Engineering Manager â†’ Director of Engineering â†’ VP of Eng"
        }
    ) : null;

    const activeDomain = activeProj?.domain || profile.domain;
    const activeExperience = activeProj?.experience || profile.experience || 0;
    const activeSkills = activeProj?.skills || profile.skills || [];
    const atsScore = activeProj?.atsScore || baseAtsScore;
    const healthScore = activeProj?.healthScore || baseHealthScore;
    const careerPath = activeProj?.careerPath || baseCareerPath;

    const skills = activeSkills.slice(0, 6);
    const radarData = skills.map((s, i) => ({ 
        skill: s.length > 10 ? s.slice(0, 10) : s, 
        value: 55 + i * 7 + (activeExperience || 0) * 5 
    }));

    const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    const base = 40 + (activeExperience || 0) * 8;
    const growthData = months.map((m, i) => ({ month: m, score: Math.min(98, base + i * 6) }));

    const weakSkills = analysis?.skill_intelligence?.weak_skills || analysis?.weakSkills || [];
    const missingSkills = analysis?.skill_intelligence?.missing_skills || analysis?.missingSkills || [];
    const futureSkills = analysis?.skill_intelligence?.future_skills || analysis?.futureSkills || [];
    const recommendations = analysis?.career_insights?.growth_recommendations || analysis?.careerInsights?.growthRecommendations || [
        `Master the top missing skill: ${missingSkills[0] || "Advanced System Design"}`,
        `Complete at least 2 simulated mock interviews for ${activeDomain}`,
        `Obtain certification or build a project using ${futureSkills[0] || "Agentic AI Frameworks"}`
    ];

    const completedCount = Object.values(completedTasks).filter(Boolean).length;
    const readinessPercent = Math.min(100, Math.floor((activeSkills?.length || 0) / 12 * 100)) || 15;

    const improvedSummary = analysis?.improved_summary || null;
    const bulletAnalyses = analysis?.resume_breakdown?.bullet_analyses || [];
    const enhancedExperienceItems = analysis?.enhanced_experience?.items || [];
    const personalBranding = analysis?.personal_branding || null;
    const portfolioContent = analysis?.portfolio_content || null;

    const getXpProgress = () => {
        const xp = profile?.xp || 0;
        let prev = 0;
        let next = 500;
        if (xp < 500) { prev = 0; next = 500; }
        else if (xp < 1500) { prev = 500; next = 1500; }
        else if (xp < 3000) { prev = 1500; next = 3000; }
        else if (xp < 6000) { prev = 3000; next = 6000; }
        else { prev = 6000; next = 10000; }
        const pct = Math.min(100, Math.max(0, ((xp - prev) / (next - prev)) * 100));
        return { prev, next, pct };
    };
    const { next: nextLevelXp, pct: xpProgressPct } = getXpProgress();

    const getActivityLogs = () => {
        const logs: { text: string; time: string; icon: string; active?: boolean }[] = [];
        if (profile?.name) {
            logs.push({ text: `Telemetry initialized for ${profile.name}`, time: "1s ago", icon: "🤖" });
        }
        if (profile?.domain) {
            logs.push({ text: `Core domain vector mapped to ${profile.domain}`, time: "4s ago", icon: "🎯" });
        }
        if (profile?.skills?.length) {
            logs.push({ text: `Scanned ${profile.skills.length} active competence nodes`, time: "12s ago", icon: "🧬" });
        }
        if (atsScore) {
            logs.push({ text: `Calibrated ATS Match rate: ${atsScore}%`, time: "30s ago", icon: "📈" });
        }
        if (profile?.xp) {
            logs.push({ text: `Earned +${profile.xp} XP from profile integration`, time: "1m ago", icon: "⚡" });
        }
        logs.push({ text: "Checking global scanner for active matches...", time: "Live", icon: "🔍", active: true });
        return logs;
    };
    const activityLogs = getActivityLogs();

    const toggleTask = (task: string) => {
        const updated = { ...completedTasks, [task]: !completedTasks[task] };
        setCompletedTasks(updated);
        localStorage.setItem("ciq-dashboard-tasks", JSON.stringify(updated));
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
    };

    const tabs = [
        { id: "summary", label: "Recruiter Pitch" },
        { id: "experience", label: "Bullet Optimizer" },
        { id: "branding", label: "LinkedIn Social" },
        { id: "portfolio", label: "Blueprint Architecture" },
    ];

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-[1280px] mx-auto px-4 pb-16 pt-2 relative"
        >
            {/* Header Title Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 border-b border-white/[0.05] pb-6 mb-8 mt-2 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] font-display">Competence Intelligence Command</span>
                        <Badge label="LIVE TELEMETRY" variant="green" size="sm" dot={true} />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none font-display">
                        {profile.name}
                    </h1>
                    
                    {/* XP Progress Widget */}
                    <div className="flex items-center gap-3 mt-3 max-w-[280px]">
                        <div className="text-[10px] font-mono font-bold text-[var(--accent)] shrink-0">
                            LVL: {profile.level || "Explorer"}
                        </div>
                        <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.05]">
                            <div 
                                className="h-full bg-gradient-to-r from-[var(--teal)] to-[var(--accent)] rounded-full transition-all duration-500" 
                                style={{ width: `${xpProgressPct}%` }}
                            />
                        </div>
                        <div className="text-[9px] font-mono text-[var(--text-muted)] shrink-0">
                            {profile.xp || 0} / {nextLevelXp} XP
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2.5">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] font-display">Simulate Projection:</span>
                        <select
                            value={projection}
                            onChange={(e) => setProjection(e.target.value)}
                            className="bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text)] rounded-xl px-3 py-1.5 outline-none focus:border-[var(--color-primary)] transition-colors"
                        >
                            <option value="default">Default Profile</option>
                            <option value="senior">Senior Architect Projection</option>
                            <option value="ai_specialist">AI Specialist Projection</option>
                            <option value="manager">Engineering Manager Projection</option>
                        </select>
                    </div>
                    <span className="inline-flex items-center gap-2 bg-[var(--teal)]/10 border border-[var(--teal)]/20 text-xs font-bold text-white px-4 py-2 rounded-xl shadow-md">
                        <Briefcase size={13} className="text-[var(--accent)]" />
                        {activeDomain}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10">
                <motion.div variants={itemVariants}>
                    <MetricCard 
                        label="ATS Match score" 
                        value={atsScore} 
                        suffix="%" 
                        icon={<CheckCircle size={16} />} 
                        secondsAgo={secondsAgo}
                        sparkData={[62, 65, 70, 72, 79, atsScore]}
                        color="var(--teal)"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <MetricCard 
                        label="Career Health Index" 
                        value={healthScore} 
                        suffix="/100" 
                        icon={<TrendingUp size={16} />} 
                        secondsAgo={secondsAgo}
                        sparkData={[50, 58, 62, 65, 78, healthScore]}
                        color="var(--accent-dark)"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <MetricCard 
                        label="Mapped Skill Nodes" 
                        value={activeSkills?.length || 0} 
                        suffix="" 
                        icon={<Zap size={16} />} 
                        secondsAgo={secondsAgo}
                        sparkData={[4, 6, 8, 9, 11, activeSkills?.length || 0]}
                        color="var(--accent)"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <MetricCard 
                        label="Total experience" 
                        value={activeExperience} 
                        suffix=" yrs" 
                        icon={<Award size={16} />} 
                        secondsAgo={secondsAgo}
                        sparkData={[1, 1.5, 2, 2, 2.5, activeExperience]}
                        color="#a1a1aa"
                    />
                </motion.div>
            </div>

            {/* Quick-Action Pillar Tiles */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8 relative z-10">
                {[
                    { label: "Resume Studio", desc: "Build & Optimize", href: "/resume", icon: FileText, activeColor: "var(--accent)" },
                    { label: "Career Intel", desc: "View Roadmaps", href: "/career-path", icon: TrendingUp, activeColor: "var(--teal)" },
                    { label: "Interview Prep", desc: "Start Mock Sim", href: "/interview", icon: Mic, activeColor: "var(--accent)" },
                    { label: "Growth Hub", desc: "Check Syllabus", href: "/learning", icon: BookOpen, activeColor: "var(--teal)" },
                    { label: "Jobs Scanner", desc: "Match Roles", href: "/global-scanner", icon: Briefcase, activeColor: "var(--accent)" }
                ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <Link href={item.href} key={idx} className="group block">
                            <div 
                                className="p-4 rounded-xl flex items-center gap-3 bg-white/[0.01] border border-white/[0.05] transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-0.5"
                                style={{
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = item.activeColor;
                                    e.currentTarget.style.background = `${item.activeColor}08`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(247, 244, 236, 0.05)";
                                    e.currentTarget.style.background = "rgba(247, 244, 236, 0.01)";
                                }}
                            >
                                <div 
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                                    style={{
                                        background: `${item.activeColor}15`,
                                        border: `1px solid ${item.activeColor}30`,
                                        color: item.activeColor
                                    }}
                                >
                                    <Icon size={14} />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs font-bold text-white font-display truncate">{item.label}</div>
                                    <div className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider truncate mt-0.5">{item.desc}</div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </motion.div>

            {/* Bento Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative z-10">
                
                {/* Left Column: Target Career Vector + XP (Spans 2 cols on wide) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    
                    {/* Career Trajectory Bento */}
                    <motion.div variants={itemVariants}>
                        <GlassCard className="p-6 flex flex-col justify-between min-h-[220px]">
                            <div className="absolute top-0 right-0 w-44 h-44 bg-[var(--teal)]/5 rounded-full blur-3xl pointer-events-none" />
                            
                            <div>
                                <h2 className="text-base font-bold text-white mb-4 font-display flex items-center gap-2">
                                    <TrendingUp size={18} className="text-[var(--accent)]" /> Mapped Career Pathway
                                </h2>
                                <div className="bg-[var(--teal)]/10 border border-[var(--teal)]/20 rounded-xl p-4.5 mb-6">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent)] font-mono">Predicted Vector Trajectory</span>
                                    <div className="text-base font-bold text-white mt-1 flex items-center gap-2">
                                        {careerPath}
                                        <ArrowUpRight size={16} className="text-zinc-550" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider font-display">
                                    <span>Core Competency Progress</span>
                                    <span>{readinessPercent}% Profile Completed</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[var(--teal)] to-[var(--accent)] rounded-full" style={{ width: `${readinessPercent}%` }} />
                                </div>
                                <div className="flex justify-between items-center text-[9px] text-zinc-650 font-bold uppercase tracking-wider">
                                    <span>Target Profile Readiness</span>
                                    <span>{activeSkills?.length || 0} of 12 key skills mapped</span>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Skill Gaps Bento */}
                    <motion.div variants={itemVariants}>
                        <GlassCard className="p-6">
                            <h2 className="text-base font-bold text-white mb-5 font-display flex items-center gap-2">
                                <ShieldAlert size={18} className="text-[var(--accent)]" /> Skill Gaps & Intelligence Indicators
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="bg-white/[0.005] border border-white/[0.05] p-4 rounded-xl flex flex-col gap-2">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-red-400 block border-b border-white/[0.05] pb-1.5 font-mono">Calibration Target</span>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {weakSkills.length > 0 ? weakSkills.map((s: string) => (
                                            <span key={s} className="px-2.5 py-1 text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/15 rounded-md">{s}</span>
                                        )) : <span className="text-[10px] text-zinc-600 italic font-semibold">None detected</span>}
                                    </div>
                                </div>
                                
                                <div className="bg-white/[0.005] border border-white/[0.05] p-4 rounded-xl flex flex-col gap-2">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400 block border-b border-white/[0.05] pb-1.5 font-mono">Priority Target</span>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {missingSkills.length > 0 ? missingSkills.map((s: string) => (
                                            <span key={s} className="px-2.5 py-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/15 rounded-md">{s}</span>
                                        )) : <span className="text-[10px] text-zinc-600 italic font-semibold">None detected</span>}
                                    </div>
                                </div>

                                <div className="bg-white/[0.005] border border-white/[0.05] p-4 rounded-xl flex flex-col gap-2">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-sky-400 block border-b border-white/[0.05] pb-1.5 font-mono">Future Strategy</span>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {futureSkills.length > 0 ? futureSkills.map((s: string) => (
                                            <span key={s} className="px-2.5 py-1 text-[10px] font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/15 rounded-md">{s}</span>
                                        )) : <span className="text-[10px] text-zinc-600 italic font-semibold">None detected</span>}
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Right Column: Milestone Progress Ring + Recommendation List & Live Telemetry Feed */}
                <div className="flex flex-col gap-6">
                    <motion.div variants={itemVariants}>
                        <GlassCard className="p-6 flex flex-col justify-between h-full min-h-[350px]">
                            <div>
                                <h2 className="text-base font-bold text-white mb-5 font-display flex items-center gap-2">
                                    <Sparkles size={18} className="text-[var(--accent)]" /> Campaign Checklist
                                </h2>
                                
                                <div className="flex items-center gap-4 bg-white/[0.015] border border-white/[0.05] rounded-xl p-4 mb-5">
                                    <ProgressRing
                                        progress={Math.min(100, Math.floor((completedCount / Math.max(1, recommendations.length)) * 100)) || 0}
                                        size={58}
                                        strokeWidth={4.5}
                                        color="var(--teal)"
                                        glow={true}
                                    />
                                    <div>
                                        <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-display">Milestone Status</div>
                                        <div className="text-sm font-bold text-white mt-0.5">Task Board</div>
                                        <div className="text-[10px] text-zinc-400 mt-0.5 font-semibold">{completedCount} of {recommendations.length} items complete</div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 mb-6">
                                    {recommendations.slice(0, 3).map((r: string, i: number) => {
                                        const isDone = !!completedTasks[r];
                                        return (
                                            <div 
                                                key={i} 
                                                onClick={() => toggleTask(r)}
                                                className={`flex gap-3 items-center p-3.5 bg-black/40 border border-white/[0.04] rounded-xl text-xs font-semibold leading-relaxed text-zinc-300 cursor-pointer select-none transition-all hover:bg-[var(--teal)]/5 ${isDone ? "opacity-60 line-through decoration-zinc-500" : ""}`}
                                            >
                                                <input 
                                                    type="checkbox" 
                                                    checked={isDone} 
                                                    onChange={() => {}}
                                                    className="rounded border-white/[0.08] bg-black text-[var(--teal)] focus:ring-0 w-3.5 h-3.5 cursor-pointer accent-[var(--teal)]"
                                                />
                                                <span>{r}</span>
                                            </div>
                                        );
                                    })}
                                    {recommendations.length === 0 && (
                                        <div className="text-xs text-zinc-500 italic p-3 text-center">No active recommendations</div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <Link href="/learning" className="flex">
                                    <PremiumButton variant="secondary" className="w-full h-9 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                                        <BookOpen size={12} /> Syllabus
                                    </PremiumButton>
                                </Link>
                                <Link href="/interview" className="flex">
                                    <PremiumButton variant="ghost" className="w-full h-9 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                                        <Mic size={12} /> Practice
                                    </PremiumButton>
                                </Link>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Live Telemetry Activity Feed */}
                    <motion.div variants={itemVariants}>
                        <GlassCard className="p-6">
                            <h2 className="text-base font-bold text-white mb-4 font-display flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Activity size={18} className="text-[var(--accent)]" /> Live Telemetry Feed
                                </span>
                                <Badge label="ACTIVE" variant="green" size="sm" dot={true} />
                            </h2>
                            <div className="flex flex-col gap-3">
                                {activityLogs.map((log, idx) => (
                                    <div key={idx} className="flex gap-3 items-start p-3 bg-black/40 border border-white/[0.04] rounded-xl text-xs font-semibold leading-relaxed">
                                        <span className="text-sm shrink-0">{log.icon}</span>
                                        <div className="min-w-0 flex-1">
                                            <p style={{ color: "var(--text-sub)" }} className="truncate">{log.text}</p>
                                            <span className="text-[9px] text-zinc-500 font-mono mt-0.5 block">{log.time}</span>
                                        </div>
                                        {log.active && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981] mt-1.5 shrink-0" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>

            {/* Health & Proficiency Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 relative z-10">
                {/* Health Index Progression */}
                <motion.div variants={itemVariants}>
                    <GlassCard className="p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-base font-bold text-white font-display">Health Index Progression</h2>
                            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider font-mono">6 Month Matrix</span>
                        </div>
                        <div className="h-60 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                    <defs>
                                        <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.25}/>
                                            <stop offset="95%" stopColor="var(--teal)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <PolarGrid stroke="rgba(255,255,255,0.03)" />
                                    <XAxis dataKey="month" tick={{ fill: "#71717A", fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: "#71717A", fontSize: 10 }} axisLine={false} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                                    <Tooltip contentStyle={{ background: "#121214", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 8, color: "#ffffff", fontSize: "11px" }} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="score" 
                                        stroke="var(--teal)" 
                                        strokeWidth={2.5} 
                                        fill="url(#colorHealth)"
                                        dot={{ fill: "var(--teal)", strokeWidth: 1.5, r: 3 }} 
                                        activeDot={{ r: 5, stroke: "#fff", strokeWidth: 1 }} 
                                        isAnimationActive={true}
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Skill Proficiency Radar */}
                <motion.div variants={itemVariants}>
                    <GlassCard className="p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-base font-bold text-white font-display">Proficiency Indicators</h2>
                            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider font-mono">Radar Analysis</span>
                        </div>
                        <div className="h-60 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.04)" />
                                    <PolarAngleAxis dataKey="skill" tick={{ fill: "#71717A", fontSize: 9, fontWeight: 700 }} />
                                    <Radar 
                                        dataKey="value" 
                                        stroke="var(--teal)" 
                                        fill="var(--teal)" 
                                        fillOpacity={0.15} 
                                        isAnimationActive={true}
                                        animationDuration={1200}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>

            {/* Profile Blueprint Bento at Bottom */}
            <motion.div variants={itemVariants}>
                <GlassCard className="p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--teal)]/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <h2 className="text-base font-bold text-white mb-5 font-display flex items-center gap-2">
                        <FileText size={18} className="text-[var(--accent)]" /> Parsed Profile Credentials Blueprint
                    </h2>

                    <TabBar
                        tabs={tabs}
                        activeTab={activeDetailTab}
                        onChange={(id) => setActiveDetailTab(id)}
                    />

                    {/* Tab contents */}
                    <div className="mt-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeDetailTab}
                                initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
                                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {activeDetailTab === "summary" && (
                                    <div className="flex flex-col gap-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white/[0.005] border border-white/[0.05] rounded-xl p-5">
                                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-2 font-mono">Original Bio statement</span>
                                                <p className="text-xs text-zinc-400 font-semibold leading-relaxed italic">
                                                    &ldquo;{improvedSummary?.original || profile.bio || "No summary statement extracted."}&rdquo;
                                                </p>
                                            </div>
                                            <div className="bg-[var(--teal)]/5 border border-[var(--teal)]/20 rounded-xl p-5 relative overflow-hidden">
                                                <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-black/40 border border-white/[0.05] px-2.5 py-0.5 rounded-full text-[9px] font-bold text-[var(--accent)] font-mono">
                                                    <Sparkles size={10} /> AI OPTIMIZED
                                                </div>
                                                <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-widest block mb-2 font-mono">Optimized Recruiter Summary</span>
                                                <p className="text-xs text-white font-bold leading-relaxed pr-16">
                                                    {improvedSummary?.improved || profile.bio || "Upload resume to compile analysis."}
                                                </p>
                                            </div>
                                        </div>

                                        {improvedSummary?.key_keywords && (
                                            <div className="bg-white/[0.005] border border-white/[0.05] rounded-xl p-5">
                                                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block mb-3 font-mono">Extracted Target Competency Keywords</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {improvedSummary.key_keywords.map((kw: string, i: number) => (
                                                        <span key={i} className="px-2.5 py-1 text-[10px] font-semibold text-zinc-300 bg-white/[0.02] border border-white/[0.06] rounded-lg">{kw}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeDetailTab === "experience" && (
                                    <div className="flex flex-col gap-4">
                                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">
                                            Calibrated bullet optimizations with active action verbs & quantitative metrics:
                                        </p>
                                        {bulletAnalyses && bulletAnalyses.length > 0 ? (
                                            <div className="flex flex-col gap-4">
                                                {bulletAnalyses.slice(0, 3).map((item: any, idx: number) => (
                                                    <div key={idx} className="bg-white/[0.005] border border-white/[0.05] rounded-xl p-5 flex flex-col gap-3.5">
                                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 text-xs">
                                                            <div className="md:col-span-2 text-[9px] font-bold text-red-400 uppercase tracking-wider font-mono">Before:</div>
                                                            <div className="md:col-span-10 text-zinc-400 font-medium italic">&ldquo;{item.original}&rdquo;</div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 text-xs">
                                                            <div className="md:col-span-2 text-[9px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Optimized:</div>
                                                            <div className="md:col-span-10 text-white font-semibold">&ldquo;{item.improved}&rdquo;</div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-4 border-t border-white/[0.05] pt-3.5 mt-1.5">
                                                            {item.action_verb && (
                                                                <div className="flex items-center gap-1.5 text-[9px] font-mono">
                                                                    <span className="text-zinc-500 font-bold uppercase">Impact Verb:</span>
                                                                    <span className="bg-[var(--teal)]/10 border border-[var(--teal)]/20 px-2 py-0.5 rounded text-white font-semibold">{item.action_verb}</span>
                                                                </div>
                                                            )}
                                                            {item.metric_added && (
                                                                <div className="flex items-center gap-1.5 text-[9px] font-mono">
                                                                    <span className="text-zinc-500 font-bold uppercase">Quantitative Metric:</span>
                                                                    <span className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 font-semibold">{item.metric_added}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : enhancedExperienceItems && enhancedExperienceItems.length > 0 ? (
                                            <div className="flex flex-col gap-4">
                                                {enhancedExperienceItems.slice(0, 3).map((item: any, idx: number) => (
                                                    <div key={idx} className="bg-white/[0.005] border border-white/[0.05] rounded-xl p-5 flex flex-col gap-2">
                                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 text-xs">
                                                            <div className="md:col-span-2 text-[9px] font-bold text-red-400 uppercase tracking-wider font-mono">Before:</div>
                                                            <div className="md:col-span-10 text-zinc-400 font-medium italic">&ldquo;{item.original}&rdquo;</div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 text-xs">
                                                            <div className="md:col-span-2 text-[9px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Optimized:</div>
                                                            <div className="md:col-span-10 text-white font-semibold">&ldquo;{item.improved}&rdquo;</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-zinc-500 italic p-4 text-center">
                                                No experience statements parsed. Make sure your uploaded resume contains quantifiable history.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeDetailTab === "branding" && (
                                    <div className="flex flex-col gap-4">
                                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-4">
                                            Personal branding configurations optimized for professional platforms:
                                        </p>
                                        
                                        <div className="bg-white/[0.005] border border-white/[0.05] rounded-xl overflow-hidden shadow-lg mb-4">
                                            <div className="h-16 bg-gradient-to-r from-[var(--teal)] to-[#0A0A0B] relative flex items-center px-5">
                                                <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-black/40 border border-white/[0.05] px-2.5 py-0.5 rounded text-[8px] text-zinc-450 font-bold uppercase tracking-wider font-mono">
                                                    <LinkedinIcon size={9} /> LinkedIn Banner
                                                </div>
                                            </div>
                                            
                                            <div className="px-6 pb-6 relative">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--teal)] to-[var(--accent-dark)] border-2 border-[#09090B] -mt-6 flex items-center justify-center text-xl shadow-md z-10 relative select-none">
                                                    ðŸ§‘
                                                </div>
                                                
                                                <div className="mt-3">
                                                    <h3 className="text-sm font-bold text-white m-0">{profile.name}</h3>
                                                    <p className="text-xs font-bold text-[var(--accent)] mt-1 mb-2 leading-relaxed">
                                                        {personalBranding?.linkedin_headline || "Specialized Expert in " + profile.domain}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white/[0.005] border border-white/[0.05] rounded-xl p-5">
                                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-2 font-mono">Elevator Pitch</span>
                                                <p className="text-xs text-zinc-400 leading-relaxed italic font-medium">
                                                    &ldquo;{personalBranding?.elevator_pitch || "A professional, metrics-based elevator introduction."}&rdquo;
                                                </p>
                                            </div>
                                            
                                            <div className="bg-[var(--teal)]/5 border border-[var(--teal)]/20 rounded-xl p-5 flex flex-col justify-center">
                                                <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-widest block mb-2 font-mono">AI Tagline</span>
                                                <div className="text-sm font-bold text-white leading-relaxed">
                                                    {personalBranding?.tagline ? `"${personalBranding.tagline}"` : `Building future-proof solutions in ${profile.domain}`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeDetailTab === "portfolio" && (
                                    <div className="flex flex-col gap-4">
                                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-4">
                                            Custom project architectures generated from technical highlights:
                                        </p>
                                        {portfolioContent?.projects && portfolioContent.projects.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {portfolioContent.projects.slice(0, 4).map((p: any, idx: number) => (
                                                    <div key={idx} className="bg-white/[0.005] border border-white/[0.05] rounded-xl p-5 hover:border-white/[0.08] transition-colors">
                                                        <h4 className="text-xs font-bold text-white mb-2">{p.title || p.name}</h4>
                                                        <p className="text-[11px] text-zinc-400 leading-relaxed mb-3 font-semibold">{p.description || p.desc}</p>
                                                        {p.tech_stack && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {p.tech_stack.map((t: string) => (
                                                                    <span key={t} className="px-2 py-0.5 text-[9px] font-semibold text-zinc-450 bg-[#09090B] rounded border border-white/[0.05]">{t}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-zinc-550 italic p-4 text-center">
                                                No customized project layouts compiled. Scans with full technical highlights to activate.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
}

