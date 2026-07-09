/* eslint-disable */
"use client";

import React, { useEffect, useState } from "react";
import { useAppStore } from "@/src/state/useAppStore";
import Link from "next/link";
import ResumeGate from "@/src/components/ResumeGate";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Puzzle, AlertTriangle, CheckCircle, ArrowUpRight, Zap, BookOpen, Target, Clock, Star, BrainCircuit, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import PageHeader from "@/src/components/ui/PageHeader";
import { ProgressBar, ProgressRing } from "@/src/components/ui/Progress";

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
        { skill: "Collaboration", weight: 75 }, { skill: "Critical Thinking", weight: 80 }, { skill: "Time Management", weight: 70 },
        { skill: "Adaptability", weight: 85 }, { skill: "Technical Literacy", weight: 75 }, { skill: "Conflict Resolution", weight: 65 },
    ],
};

function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setCount(value);
            }
        };
        window.requestAnimationFrame(step);
    }, [value, duration]);

    return <>{count}</>;
}

// Custom Glassmorphic Tooltip
function CustomTooltip({ active, payload, label, suffix = "" }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#121214]/90 backdrop-blur-md border border-zinc-800/80 rounded-xl p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.65)] text-left min-w-[130px]">
                <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-2 border-b border-zinc-800/60 pb-1">
                    {label}
                </p>
                <div className="space-y-1.5">
                    {payload.map((p: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between gap-4">
                            <span className="text-xs text-zinc-450 flex items-center gap-1.5 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.stroke || p.fill || "#6D001A" }} />
                                {p.name}
                            </span>
                            <span className="text-xs font-bold text-[#F4F4F5]" style={{ fontVariantNumeric: "tabular-nums" }}>
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

export default function SkillsPage() {
    const { profile } = useAppStore();
    const [analysis, setAnalysis] = useState<any>(null);
    const [activeView, setActiveView] = useState<"gap" | "radar" | "priority">("gap");
    const [mounted, setMounted] = useState(false);

    // Sandbox Simulation Acquired State
    const [simulatedAcquired, setSimulatedAcquired] = useState<string[]>([]);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("ciq-resume-analysis");
            if (stored) setAnalysis(JSON.parse(stored));
        }
    }, []);

    const domain = profile?.domain || "";
    const domainKey = Object.keys(DOMAIN_REQUIRED).find(k => domain.toLowerCase().includes(k.toLowerCase())) || "default";
    
    const getDynamicRequiredSkills = () => {
        const analysisData = analysis || profile?.resumeAnalysis;
        const defaultReq = DOMAIN_REQUIRED[domainKey];
        if (!analysisData) return defaultReq;
        
        const skillInt = analysisData.skill_intelligence || analysisData.skillIntelligence;
        if (!skillInt) return defaultReq;
        
        const core = skillInt.core_skills || profile?.skills || [];
        const weak = skillInt.weak_skills || analysisData.weakSkills || [];
        const missing = skillInt.missing_skills || analysisData.missingSkills || [];
        const future = skillInt.future_skills || analysisData.futureSkills || [];
        
        const dynamicSet = new Set<string>();
        const dynamicList: { skill: string; weight: number }[] = [];
        
        const addItems = (items: any[], weight: number) => {
            items.forEach((item: any) => {
                const sName = typeof item === "string" ? item : (item.skill || item.name || "");
                const clean = sName.trim();
                if (clean && !dynamicSet.has(clean.toLowerCase())) {
                    dynamicSet.add(clean.toLowerCase());
                    dynamicList.push({ skill: clean, weight });
                }
            });
        };

        addItems(core, 90);
        addItems(weak, 80);
        addItems(missing, 75);
        addItems(future, 70);
        
        if (dynamicList.length < 6) {
            defaultReq.forEach(item => {
                if (!dynamicSet.has(item.skill.toLowerCase())) {
                    dynamicSet.add(item.skill.toLowerCase());
                    dynamicList.push(item);
                }
            });
        }
        
        return dynamicList;
    };
    
    const requiredSkills = getDynamicRequiredSkills();
    const userSkillsLower = (profile?.skills || []).map(s => s.toLowerCase());

    const skillIntel = analysis?.skill_intelligence || analysis?.skillIntelligence || {};
    
    const getCleanStringList = (arr: any) => {
        if (!arr) return [];
        if (!Array.isArray(arr)) return [];
        return arr.map((item: any) => {
            if (typeof item === "string") return item;
            return item.skill || item.name || JSON.stringify(item);
        });
    };

    const weakSkills = getCleanStringList(skillIntel.weak_skills || analysis?.weakSkills || analysis?.weak_skills || []);
    const missingSkills = getCleanStringList(skillIntel.missing_skills || analysis?.missingSkills || analysis?.missing_skills || []);

    const gapData = requiredSkills.map((req, i) => {
        const hasSkill = userSkillsLower.some(us => us.includes(req.skill.toLowerCase()) || req.skill.toLowerCase().includes(us));
        const isWeak = weakSkills.some((w: string) => w.toLowerCase().includes(req.skill.toLowerCase()) || req.skill.toLowerCase().includes(w.toLowerCase()));
        const isMissing = missingSkills.some((m: string) => m.toLowerCase().includes(req.skill.toLowerCase()) || req.skill.toLowerCase().includes(m.toLowerCase()));
        
        const isSimulatedAcquired = simulatedAcquired.includes(req.skill.toLowerCase());

        let yours = hasSkill ? Math.min(95, 55 + (profile?.experience || 0) * 8 + i * 2) : isMissing ? 10 : isWeak ? 35 : 20;
        if (isWeak && hasSkill) yours = Math.min(yours, 45);
        if (isSimulatedAcquired) yours = req.weight; // Met exactly in simulation

        return {
            name: req.skill,
            yours,
            required: req.weight,
            gap: Math.max(0, req.weight - yours),
            status: yours >= req.weight ? "met" : req.weight - yours > 25 ? "critical" : req.weight - yours > 10 ? "moderate" : "minor",
        };
    });

    const met = gapData.filter(s => s.status === "met").length;
    const critical = gapData.filter(s => s.status === "critical").length;
    const moderate = gapData.filter(s => s.status === "moderate").length;
    const overallScore = Math.round(gapData.reduce((sum, s) => sum + Math.min(100, (s.yours / s.required) * 100), 0) / gapData.length);

    const radarData = gapData.slice(0, 12).map(s => ({
        skill: s.name.length > 10 ? s.name.slice(0, 10) : s.name,
        yours: s.yours,
        required: s.required,
    }));

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

    const barData = gapData.slice(0, 12).map(s => ({
        skill: s.name.length > 8 ? s.name.slice(0, 8) : s.name,
        yours: s.yours,
        required: s.required,
    }));

    const toggleSimulate = (skillName: string) => {
        const lower = skillName.toLowerCase();
        if (simulatedAcquired.includes(lower)) {
            setSimulatedAcquired(simulatedAcquired.filter(s => s !== lower));
        } else {
            setSimulatedAcquired([...simulatedAcquired, lower]);
        }
    };

    return (
        <ResumeGate pageName="Skill Gap Analyzer" pageIcon={<Puzzle size={64} />}>
            <div className="max-w-[1280px] mx-auto px-4 pb-16 pt-2">
                {/* Header Banner */}
                <PageHeader 
                    title="Skill Gap Intelligence"
                    description={`Comparing your ${profile?.domain || "profile"} capabilities against verified industry standard requirements.`}
                    badge="Assessment System Active"
                />

                {/* KPI Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="flex items-center justify-between p-6">
                        <div>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Readiness Rate</span>
                            <div className={`text-3xl font-bold font-serif mt-2 ${overallScore >= 75 ? "text-emerald-400" : overallScore >= 50 ? "text-amber-400" : "text-[#Fca5a5]"}`}>
                                <AnimatedNumber value={overallScore} />%
                            </div>
                        </div>
                        <ProgressRing
                            value={overallScore}
                            size={56}
                            strokeWidth={4}
                            color={overallScore >= 75 ? "#10b981" : overallScore >= 50 ? "#f59e0b" : "#6D001A"}
                        />
                    </Card>

                    <Card className="p-6">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Skills Met</span>
                        <div className="text-3xl font-bold font-serif text-emerald-400 mt-2">
                            <AnimatedNumber value={met} />
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-455 mt-3 font-semibold uppercase tracking-wider">
                            <CheckCircle size={12} className="text-emerald-400" />
                            Target met
                        </div>
                    </Card>

                    <Card className="p-6 border-l-2 border-l-[#6D001A]">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Critical Gaps</span>
                        <div className="text-3xl font-bold font-serif text-[#Fca5a5] mt-2">
                            <AnimatedNumber value={critical} />
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-455 mt-3 font-semibold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6D001A] animate-pulse" />
                            High Action Target
                        </div>
                    </Card>

                    <Card className="p-6">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Moderate Gaps</span>
                        <div className="text-3xl font-bold font-serif text-zinc-200 mt-2">
                            <AnimatedNumber value={moderate} />
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-455 mt-3 font-semibold uppercase tracking-wider">
                            <Star size={12} className="text-zinc-500" />
                            Upgrade Recommended
                        </div>
                    </Card>
                </div>

                {/* Gap Solver Simulator Panel */}
                <Card highlighted className="p-6 mb-8 border-[#6D001A]/30 bg-[#6D001A]/5">
                    <div className="flex items-center gap-2 mb-4">
                        <BrainCircuit size={18} className="text-[#Fca5a5]" />
                        <h3 className="text-sm font-semibold text-[#F4F4F5] uppercase tracking-wider">Gap Solver Simulator</h3>
                        <span className="text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-0.5 font-semibold uppercase tracking-wider ml-auto">Simulated Training Suite</span>
                    </div>
                    <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                        Select which skill gaps you want to simulate resolving to immediately project your improved platform readiness rating and competency matching levels.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {gapData.map(s => {
                            const isInitiallyMet = s.yours >= s.required && !simulatedAcquired.includes(s.name.toLowerCase());
                            const isAcquired = simulatedAcquired.includes(s.name.toLowerCase()) || s.yours >= s.required;
                            return (
                                <button
                                    key={s.name}
                                    onClick={() => s.yours < s.required && toggleSimulate(s.name)}
                                    disabled={s.yours >= s.required && !simulatedAcquired.includes(s.name.toLowerCase())}
                                    className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all select-none ${
                                        isInitiallyMet 
                                            ? "bg-emerald-950/15 border-emerald-900/30 text-emerald-450 opacity-60 cursor-not-allowed"
                                            : isAcquired
                                                ? "bg-[#6D001A]/20 border-[#6D001A]/60 text-white font-medium shadow-[0_0_10px_rgba(109,0,26,0.2)]"
                                                : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                    }`}
                                >
                                    <div className="flex justify-between items-start w-full">
                                        <span className="text-xs font-semibold truncate max-w-[80%]">{s.name}</span>
                                        <input 
                                            type="checkbox"
                                            checked={isAcquired}
                                            readOnly
                                            className="accent-[#6D001A] h-3.5 w-3.5 mt-0.5 rounded cursor-pointer pointer-events-none"
                                        />
                                    </div>
                                    <div className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider mt-2.5">
                                        {isInitiallyMet ? "Initially Met" : isAcquired ? "Simulated Resolved" : `Target Gap: ${s.gap}%`}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {simulatedAcquired.length > 0 && (
                        <div className="mt-4 pt-3.5 border-t border-zinc-850 flex justify-between items-center text-[10px] text-zinc-500">
                            <span>Simulating {simulatedAcquired.length} acquired skill(s). Overall readiness recalculated in real-time.</span>
                            <button onClick={() => setSimulatedAcquired([])} className="text-[#Fca5a5] font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                                <RefreshCw size={10} /> Reset Simulator
                            </button>
                        </div>
                    )}
                </Card>

                {/* View Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="flex gap-1.5 p-1 bg-zinc-950/60 border border-zinc-800 rounded-lg">
                        {([["gap", "Detailed Analysis"], ["radar", "Radar View"], ["priority", "Priority Actions"]] as const).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setActiveView(key)}
                                className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
                                    activeView === key
                                        ? "bg-[#6D001A] text-white"
                                        : "bg-transparent text-zinc-400 hover:text-white"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeView}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Gap Analysis View */}
                        {activeView === "gap" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="p-6">
                                    <h3 className="text-sm font-semibold text-[#F4F4F5] mb-6">Detailed Competency Status</h3>
                                    <div className="space-y-5">
                                        {gapData.map((s, index) => (
                                            <div key={s.name}>
                                                <div className="flex justify-between text-xs mb-2">
                                                    <span className="font-semibold text-zinc-350 flex items-center gap-2">
                                                        {s.status === "met" ? (
                                                            <CheckCircle size={14} className="text-emerald-400" />
                                                        ) : s.status === "critical" ? (
                                                            <AlertTriangle size={14} className="text-[#Fca5a5]" />
                                                        ) : (
                                                            <ArrowUpRight size={14} className="text-zinc-500" />
                                                        )}
                                                        {s.name}
                                                    </span>
                                                    <span className={`font-bold ${s.status === "met" ? "text-emerald-400" : s.status === "critical" ? "text-[#Fca5a5]" : "text-zinc-400"}`}>
                                                        {s.status === "met" ? "✓ Met" : `Gap: ${s.gap}%`}
                                                    </span>
                                                </div>
                                                <ProgressBar value={s.yours} />
                                                <div className="flex justify-between text-[10px] text-zinc-550 font-bold uppercase tracking-wider mt-1.5">
                                                    <span>Profile: {s.yours}%</span>
                                                    <span>Required: {s.required}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                                
                                <motion.div 
                                    className="h-full"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                 >
                                    <Card className="p-6 h-full">
                                        <h3 className="text-sm font-semibold text-[#F4F4F5] mb-6">Competency vs Industry Baselines</h3>
                                        <div className="w-full h-96">
                                            {mounted && (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={barData} margin={{ left: -20, right: 10 }}>
                                                        <defs>
                                                            <linearGradient id="barYours" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#6D001A" stopOpacity={0.8}/>
                                                                <stop offset="95%" stopColor="#6D001A" stopOpacity={0.4}/>
                                                            </linearGradient>
                                                            <linearGradient id="barReq" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#3f3f46" stopOpacity={0.6}/>
                                                                <stop offset="95%" stopColor="#3f3f46" stopOpacity={0.2}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                                        <XAxis dataKey="skill" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                                                        <YAxis tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                                        <Tooltip content={<CustomTooltip suffix="%" />} cursor={{ fill: 'rgba(255,255,255,0.01)' }} />
                                                        <Bar 
                                                            dataKey="yours" 
                                                            name="Your Level" 
                                                            fill="url(#barYours)" 
                                                            radius={[4, 4, 0, 0]} 
                                                            isAnimationActive={true}
                                                            animationBegin={100}
                                                            animationDuration={1000}
                                                            animationEasing="ease-out"
                                                        />
                                                        <Bar 
                                                            dataKey="required" 
                                                            name="Required" 
                                                            fill="url(#barReq)" 
                                                            radius={[4, 4, 0, 0]} 
                                                            isAnimationActive={true}
                                                            animationBegin={100}
                                                            animationDuration={1000}
                                                            animationEasing="ease-out"
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            )}
                                        </div>
                                    </Card>
                                 </motion.div>
                            </div>
                        )}

                        {/* Radar View */}
                        {activeView === "radar" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div 
                                    className="h-full"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                 >
                                    <Card className="p-6 h-full">
                                        <h3 className="text-sm font-semibold text-[#F4F4F5] mb-6">Radar Mapping</h3>
                                        <div className="w-full h-80">
                                            {mounted && (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart data={radarData}>
                                                        <PolarGrid stroke="rgba(255,255,255,0.04)" />
                                                        <PolarAngleAxis dataKey="skill" tick={{ fill: "#71717a", fontSize: 9 }} />
                                                        <Radar 
                                                            dataKey="yours" 
                                                            name="Your Skills" 
                                                            stroke="#6D001A" 
                                                            fill="#6D001A" 
                                                            fillOpacity={0.25} 
                                                            isAnimationActive={true}
                                                            animationBegin={100}
                                                            animationDuration={1000}
                                                            animationEasing="ease-out"
                                                        />
                                                        <Radar 
                                                            dataKey="required" 
                                                            name="Baseline" 
                                                            stroke="#3f3f46" 
                                                            fill="#3f3f46" 
                                                            fillOpacity={0.05} 
                                                            isAnimationActive={true}
                                                            animationBegin={100}
                                                            animationDuration={1000}
                                                            animationEasing="ease-out"
                                                        />
                                                        <Tooltip content={<CustomTooltip suffix="%" />} />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            )}
                                        </div>
                                    </Card>
                                 </motion.div>

                                <Card className="p-6">
                                    <h3 className="text-sm font-semibold text-[#F4F4F5] mb-6">Skill Profile Distribution</h3>
                                    <div className="space-y-4 flex flex-col justify-center">
                                        {gapData.map((s, idx) => (
                                            <div key={s.name} className="flex items-center gap-4 py-2 border-b border-zinc-805 last:border-b-0">
                                                <div className="w-2 h-2 rounded-full bg-[#6D001A]" />
                                                <span className="flex-1 text-xs text-zinc-350 font-semibold">{s.name}</span>
                                                <ProgressBar value={s.yours} className="w-32" />
                                                <span className={`text-[10px] font-bold font-mono w-10 text-right ${s.status === "met" ? "text-emerald-400" : "text-[#Fca5a5]"}`}>
                                                    {s.yours}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        )}

                        {/* Priority Actions View */}
                        {activeView === "priority" && (
                            <div className="space-y-6">
                                <Card className="p-6">
                                    <h3 className="text-sm font-semibold text-[#F4F4F5] flex items-center gap-2 mb-6">
                                        <Target size={18} className="text-[#Fca5a5]" /> Priority Development Steps
                                    </h3>
                                    <div className="space-y-3">
                                        {priorities.length > 0 ? (
                                            priorities.map((p, i) => (
                                                <div 
                                                    key={p.skill} 
                                                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-zinc-950/40 border border-zinc-850 rounded-lg ${
                                                        p.priority === "Critical" ? "border-l-2 border-l-[#6D001A]" : ""
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                                                            {i + 1}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xs font-semibold text-[#F4F4F5]">{p.skill}</h4>
                                                            <p className="text-[10px] text-zinc-500 font-medium block mt-0.5">{p.action}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2">
                                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${
                                                            p.priority === "Critical" 
                                                                ? "bg-red-950/20 text-red-400 border-red-900/30" 
                                                                : p.priority === "High" 
                                                                    ? "bg-amber-950/20 text-amber-400 border-amber-900/30" 
                                                                    : "bg-zinc-900 text-zinc-400 border-zinc-800"
                                                        }`}>
                                                            {p.priority}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1 mt-1">
                                                            <Clock size={10} /> {p.time}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-6 border border-dashed border-zinc-800 rounded-lg">
                                                <p className="text-xs text-zinc-500">No skill gaps detected. You fit all core indicators.</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                <div className="flex gap-3">
                                    <Link href="/learning">
                                        <Button variant="primary">
                                            <BookOpen size={14} /> Open Tailored Syllabus
                                        </Button>
                                    </Link>
                                    <Link href="/interview">
                                        <Button variant="ghost">
                                            <Zap size={14} /> Practice Mock Interview
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </ResumeGate>
    );
}
