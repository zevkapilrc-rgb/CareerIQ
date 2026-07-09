/* eslint-disable */
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAppStore } from "@/src/state/useAppStore";
import { 
    LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, 
    BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, ComposedChart, Scatter, ScatterChart, ZAxis, Legend, Cell 
} from "recharts";
import { TrendingUp, BarChart2, Activity, Target, Zap, Briefcase, Globe, Database, RefreshCw, Layers, Eye, BrainCircuit, AlertTriangle, ArrowDownRight, ArrowUpRight, Cpu, Compass, Lightbulb, ArrowRight, Star, Send, Bot, HelpCircle, LockKeyhole, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ResumeGate from "@/src/components/ResumeGate";
import GlassCard from "@/src/components/ui/GlassCard";
import KPICard from "@/src/components/ui/KPICard";
import ProgressRing from "@/src/components/ui/ProgressRing";
import Badge from "@/src/components/ui/Badge";
import PremiumButton from "@/src/components/ui/PremiumButton";
import TabBar from "@/src/components/ui/TabBar";
import { PremiumLoader } from "@/src/components/ui/PremiumLoader";

// â”€â”€ BENCHMARKS & FORECAST SEED â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DOMAIN_BENCHMARKS: Record<string, { skill: string; user: number; avg: number; top10: number }[]> = {
    "default": [
        { skill: "Core Skills", user: 70, avg: 60, top10: 90 },
        { skill: "Communication", user: 80, avg: 70, top10: 95 },
        { skill: "Problem Solving", user: 75, avg: 65, top10: 90 },
        { skill: "Leadership", user: 50, avg: 55, top10: 85 },
        { skill: "Domain Exp", user: 65, avg: 60, top10: 85 },
        { skill: "Tech Tools", user: 60, avg: 50, top10: 80 },
    ]
};

const DISRUPTION_SEED: Record<string, { risk: number; safety: string; strategy: string }> = {
    "react": { risk: 15, safety: "High Safety", strategy: "Highly resilient. Focus on modular state architectures and custom UI orchestration rather than raw CSS code creation." },
    "node.js": { risk: 20, safety: "High Safety", strategy: "Resilient. Shift focus from writing basic router endpoints to clustering, API performance tuning, and distributed systems integrations." },
    "python": { risk: 25, safety: "Moderate Risk", strategy: "Partially assisted by LLMs. Shift focus to dataset engineering, ML pipelines orchestration, and AI model evaluation frameworks." },
    "manual qa": { risk: 85, safety: "Critical Threat", strategy: "Highly repetitive. Pivot immediately towards test script automation, Cypress, Playwright, or building agentic testing frameworks." },
    "copywriting": { risk: 80, safety: "Critical Threat", strategy: "Text generation is highly automated. Pivot to target group strategy, high-level brand auditing, and tone validation." },
    "system design": { risk: 5, safety: "Absolute Safety", strategy: "Highly structural and cognitive. AI tools struggle to model custom constraints, legacy databases, and latency trade-offs." },
    "docker": { risk: 10, safety: "High Safety", strategy: "infrastructure configs are deterministic. Specialize in cloud security pipelines, automated scaling architectures, and service mesh structures." },
    "kubernetes": { risk: 5, safety: "Absolute Safety", strategy: "Very high syntax and architectural overhead. Deepen knowledge of multi-region clustering and cost-performance tuning." },
};

function calculateDisruption(skill: string) {
    const s = skill.trim().toLowerCase();
    if (DISRUPTION_SEED[s]) return DISRUPTION_SEED[s];
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0;
    }
    const risk = Math.max(5, Math.min(95, 30 + (Math.abs(hash) % 65)));
    const safety = risk > 70 ? "Critical Threat" : risk > 40 ? "Moderate Risk" : "High Safety";
    const strategy = risk > 70 
        ? "Deterministic code or structured inputs are highly automatable. Reorient your career toward architecture, prompt orchestration, and domain management." 
        : risk > 40 
            ? "Assisted scripting is common. Enhance your value by focusing on security audits, performance profiling, and systems integrations." 
            : "Requires abstract reasoning and alignment checks. Highly resilient; continue scaling complex projects and custom deployments.";
    return { risk, safety, strategy };
}

function computeCombinedFallback(domain: string, skills: string[], experience: number, atsScore: number, historyCount: number) {
    // Fallback analytics
    const healthScore = Math.round((atsScore + 72 + 75) / 3);
    const healthTier = "Top 15% in your domain";
    const atsComparison = `+${atsScore > 60 ? atsScore - 60 : 0}% vs market avg`;
    const readinessLabel = historyCount > 0 ? "Ready for interview" : "Training required";
    const marketDemandLevel = "High";

    const monthLabels = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    const growthTrajectory = monthLabels.map((m, i) => ({
        m, 
        ats: Math.min(99, Math.max(40, atsScore - (5 - i) * 6)), 
        interview: Math.min(95, 45 + i * 8 + (historyCount > 0 ? 5 : 0)),
        marketDemand: 60 + i * 5 + experience * 2
    }));

    const benchmarkData = DOMAIN_BENCHMARKS.default.map((b, i) => ({
        ...b,
        user: Math.min(95, 40 + i * 5 + (experience || 0) * 8)
    }));

    const skillMasteryTime = (skills.length > 0 ? skills : ["React", "Node.js", "Python", "SQL"]).slice(0, 8).map((s, i) => ({
        skill: s.length > 10 ? s.slice(0, 10) : s,
        hours: Math.floor(Math.random() * 40) + 15,
        mastery: Math.min(100, 45 + Math.floor(Math.random() * 45) + experience * 5),
    }));

    const macroTrendData = [
        { quarter: "Q1 '25", demand: 70, supply: 85 },
        { quarter: "Q2 '25", demand: 75, supply: 80 },
        { quarter: "Q3 '25", demand: 85, supply: 75 },
        { quarter: "Q4 '25", demand: 92, supply: 70 },
        { quarter: "Q1 '26", demand: 98, supply: 65 },
    ];

    const macroTrendSummary = `Demand for ${domain}s is projected to outpace supply significantly by Q1 2026.`;

    // Fallback forecast
    const today = new Date();
    const seed = today.getDate() + today.getMonth() * 31 + today.getFullYear() * 365;
    const isTech = domain.toLowerCase().includes("engineer") || domain.toLowerCase().includes("developer") || domain.toLowerCase().includes("data");

    let hash = seed;
    for (let i = 0; i < domain.length; i++) {
        hash = (hash << 5) - hash + domain.charCodeAt(i);
        hash |= 0;
    }
    
    const confidenceScore = Number((93 + (Math.abs(hash) % 35) / 10).toFixed(1));
    const riskOffset = (Math.abs(hash >> 2) % 9) - 4;
    const automationRisk = isTech ? Math.max(10, Math.min(90, 22 + riskOffset)) : Math.max(10, Math.min(90, 58 + riskOffset));
    
    const salaryBoostOffset = (Math.abs(hash >> 4) % 11) - 5;
    const salaryPremium = isTech ? Math.max(5, 45 + salaryBoostOffset) : Math.max(5, 14 + salaryBoostOffset);
    const disruptionTimeline = isTech ? "5-7 Years" : "2-3 Years";
    const targetEvolution = isTech ? `AI-Augmented ${domain}` : `${domain} Strategy Lead`;

    const forecastGrowthData = [
        { year: "2024", demand: 100, automation: 10 },
        { year: "2025", demand: 115 + (Math.abs(hash) % 5), automation: 18 + (Math.abs(hash >> 1) % 3) },
        { year: "2026", demand: 130 + (Math.abs(hash) % 7), automation: 25 + (Math.abs(hash >> 2) % 4) },
        { year: "2027", demand: 160 + (Math.abs(hash) % 9), automation: 35 + (Math.abs(hash >> 3) % 5) },
        { year: "2028", demand: 190 + (Math.abs(hash) % 11), automation: 42 + (Math.abs(hash >> 4) % 6) },
        { year: "2029", demand: 240 + (Math.abs(hash) % 13), automation: 48 + (Math.abs(hash >> 5) % 7) },
        { year: "2030", demand: 310 + (Math.abs(hash) % 15), automation: 55 + (Math.abs(hash >> 6) % 8) },
    ];

    const salaryData = [
        { role: "Traditional", current: 80, future: 85 + (Math.abs(hash) % 6) },
        { role: "AI-Enhanced", current: 110, future: 165 + (Math.abs(hash) % 11) },
        { role: "AI-Creator", current: 150, future: 240 + (Math.abs(hash) % 16) },
    ];

    const declining = isTech 
        ? ["jQuery", "Vanilla REST APIs", "Manual QA Testing", "Basic CRUD Scripting", "On-Premises Infrastructure"] 
        : ["Manual Data Entry", "Basic Copywriting", "Level-1 Support Tickets", "Routine Scheduling", "Data Filing & Records"];
        
    const rising = isTech 
        ? ["Agentic AI Systems", "LLM Orchestration Frameworks", "Rust & WASM Compilation", "Vector Databases & RAG", "AI Application Security"] 
        : ["AI Prompt Design", "Strategic Blueprinting", "Human-in-the-Loop QA", "Empathy-Driven Consulting", "AI Process Auditing"];

    const survivalBlueprint = `The market for pure ${domain} is polarizing. Top earners are leveraging AI coding assistants and automation to achieve 10x output. Master LLM integration, prompt engineering, and transition from a syntax-writer to an architecture-level orchestrator by 2026.`;

    return {
        healthScore,
        healthTier,
        atsComparison,
        readinessLabel,
        marketDemandLevel,
        growthTrajectory,
        benchmarkData,
        skillMasteryTime,
        macroTrendData,
        macroTrendSummary,
        confidenceScore,
        automationRisk,
        salaryPremium,
        disruptionTimeline,
        targetEvolution,
        forecastGrowthData,
        salaryData,
        obsolescenceWatch: declining,
        risingTechnologies: rising,
        survivalBlueprint
    };
}

function AnimatedCounter({ value, suffix = "", colorClass = "" }: { value: number | string; suffix?: string; colorClass?: string }) {
    const [display, setDisplay] = useState(0);
    const numVal = typeof value === "string" ? parseInt(value) || 0 : value;
    
    useEffect(() => {
        let start = 0;
        const duration = 1200;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * numVal));
            if (progress < 1) requestAnimationFrame(step);
        };
        let startTime: number | null = null;
        requestAnimationFrame(step);
    }, [numVal]);

    return <span className={colorClass} style={{ fontVariantNumeric: "tabular-nums" }}>{display}{suffix}</span>;
}

function CustomTooltip({ active, payload, label, suffix = "" }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#09090B]/90 backdrop-blur-md border border-white/[0.08] rounded-xl p-3.5 shadow-2xl text-left min-w-[150px]">
                <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-2 border-b border-white/[0.05] pb-1 font-display">
                    {label}
                </p>
                <div className="space-y-1.5">
                    {payload.map((p: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between gap-4">
                            <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.stroke || p.fill || "var(--teal)" }} />
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

function getRecommendation(demand: number, supply: number, healthScore: number) {
    const totalOffset = demand - supply;
    if (totalOffset > 15) {
        return {
            title: "Market Expansion Phase Detected",
            badge: "High Growth Potential",
            desc: "Demand is surging relative to supply. Now is the premium window to negotiate senior roles or contract assignments. Highlight high-complexity skills.",
            action: "Focus on salary premium negotiation & architectural roles."
        };
    } else if (totalOffset < -15) {
        return {
            title: "Market Saturation Warning",
            badge: "High Candidate Supply",
            desc: "Talent density is outpacing role creation. To stand out, prioritize specialized niche skill mutations (e.g., AI systems, compiler design) and secure high-retention stacks.",
            action: "Accelerate specialization. Gain 1-2 edge certifications."
        };
    } else {
        return {
            title: "Market Equilibrium Baseline",
            badge: "Stable Horizon",
            desc: "The sector is in balanced growth. Steady skill enhancement and maintaining an optimal ATS rating will yield predictable career progression.",
            action: "Maintain baseline skills. Target standard career steps."
        };
    }
}

interface ChatMessage {
    sender: "user" | "copilot";
    text: string;
}

export default function AnalyticsPage({ searchParams }: { searchParams?: { tab?: string } }) {
    const defaultTab = searchParams?.tab || "overview";
    const { profile } = useAppStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [analytics, setAnalytics] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<string>(defaultTab);
    const [mounted, setMounted] = useState(false);

    // Simulator offsets
    const [demandOffset, setDemandOffset] = useState<number>(0);
    const [supplyOffset, setSupplyOffset] = useState<number>(0);

    // Skills Disruption Calculator States
    const [calcQuery, setCalcQuery] = useState("");
    const [calcResult, setCalcResult] = useState<any>(null);

    // Chat states
    const [chatInput, setChatInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const domain = profile?.domain || "Software Engineering";
    const skills = profile?.skills || [];
    const experience = profile?.experience || 0;

    const [atsScore, setAtsScore] = useState<number>(65);
    const [historyCount, setHistoryCount] = useState<number>(0);

    // Sync scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, isTyping]);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== "undefined") {
            const storedAnalysis = localStorage.getItem("ciq-resume-analysis");
            let score = 65;
            if (storedAnalysis) {
                try {
                    const parsed = JSON.parse(storedAnalysis);
                    if (parsed?.scores?.ats_score) {
                        score = parsed.scores.ats_score;
                        setAtsScore(parsed.scores.ats_score);
                    } else if (parsed?.atsScore) {
                        score = parsed.atsScore;
                        setAtsScore(parsed.atsScore);
                    }
                } catch {}
            }

            const storedHistory = localStorage.getItem("ciq-interview-history");
            let count = 0;
            if (storedHistory) {
                try {
                    const parsed = JSON.parse(storedHistory);
                    count = parsed.length || 0;
                    setHistoryCount(count);
                } catch {}
            }

            const cacheKey = `ciq-gemini-analytics-combined-${profile?.name || "guest"}`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                try {
                    setAnalytics(JSON.parse(cached));
                } catch {
                    fetchLiveAnalytics(score, count);
                }
            } else if (skills.length > 0) {
                fetchLiveAnalytics(score, count);
            }
        }
    }, [profile?.name, skills.length]);

    // Initial greeting
    useEffect(() => {
        if (mounted) {
            setChatHistory([
                {
                    sender: "copilot",
                    text: `Hello! I am your HIREVIX AI Strategy Copilot. I have analyzed your profile as a ${domain} with skills including ${skills.slice(0, 3).join(', ') || 'general engineering'}. Ask me anything about automation risks, salary premiums, or high-growth skillsets in your field.`
                }
            ]);
        }
    }, [mounted, domain]);

    const fetchLiveAnalytics = async (currentAts = atsScore, currentHistory = historyCount) => {
        if (skills.length === 0) return;
        setLoading(true);
        try {
            const res = await fetch("/api/analytics/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skills, experience, domain, atsScore: currentAts, historyCount: currentHistory }),
            });
            const result = await res.json();
            if (result.success && result.data) {
                // Synthesize complete payload mapping
                const completeData = {
                    ...result.data,
                    ...computeCombinedFallback(domain, skills, experience, currentAts, currentHistory)
                };
                setAnalytics(completeData);
                const cacheKey = `ciq-gemini-analytics-combined-${profile?.name || "guest"}`;
                localStorage.setItem(cacheKey, JSON.stringify(completeData));
            } else {
                throw new Error(result.error || "Failed payload extraction");
            }
        } catch (err) {
            console.error("Failed to load Gemini analysis. Falling back to local data.", err);
            const fallback = computeCombinedFallback(domain, skills, experience, currentAts, currentHistory);
            setAnalytics(fallback);
        } finally {
            setLoading(false);
        }
    };

    const rawData = analytics || computeCombinedFallback(domain, skills, experience, atsScore, historyCount);

    const getDynamicBenchmarks = () => {
        const analysisData = analytics || profile?.resumeAnalysis;
        const defaultBench = [
            { skill: "Core Skills", user: 70, avg: 60, top10: 90 },
            { skill: "Communication", user: 80, avg: 70, top10: 95 },
            { skill: "Problem Solving", user: 75, avg: 65, top10: 90 },
            { skill: "Leadership", user: 50, avg: 55, top10: 85 },
            { skill: "Domain Exp", user: 65, avg: 60, top10: 85 },
            { skill: "Tech Tools", user: 60, avg: 50, top10: 80 },
        ];
        
        if (!analysisData) {
            return defaultBench.map((b, i) => ({
                ...b,
                user: Math.min(95, 40 + i * 5 + (experience || 0) * 8)
            }));
        }
        
        const ats = analysisData.scores?.ats_score || analysisData.atsScore || 65;
        const recruiter = analysisData.recruiter_simulation?.shortlist_probability || analysisData.recruiterSimulation?.shortlistProbability || 70;
        const impact = analysisData.scores?.impact_score || analysisData.scores?.overall_score || 68;
        const depth = analysisData.scores?.skill_depth_score || (ats + recruiter) / 2;
        const overall = analysisData.scores?.overall_score || (ats + recruiter + impact) / 3;
        
        return [
            { skill: "ATS Readiness", user: ats, avg: 60, top10: 85 },
            { skill: "Recruiter Sim", user: recruiter, avg: 62, top10: 90 },
            { skill: "Impact Weight", user: Math.round(impact), avg: 64, top10: 88 },
            { skill: "Skill Depth", user: Math.round(depth), avg: 63, top10: 86 },
            { skill: "Overall Score", user: Math.round(overall), avg: 65, top10: 89 }
        ];
    };

    // Simulated data derivatives
    const simulatedMacroTrend = rawData.macroTrendData.map((item: any) => ({
        ...item,
        demand: Math.min(100, Math.max(10, item.demand + demandOffset)),
        supply: Math.min(100, Math.max(10, item.supply + supplyOffset)),
    }));

    const simulatedGrowth = rawData.growthTrajectory.map((item: any) => ({
        ...item,
        ats: Math.min(100, Math.max(10, item.ats + Math.round(demandOffset * 0.4))),
        interview: Math.min(100, Math.max(10, item.interview + Math.round(supplyOffset * 0.2))),
        marketDemand: Math.min(100, Math.max(10, item.marketDemand + demandOffset)),
    }));

    const data = {
        ...rawData,
        growthTrajectory: simulatedGrowth,
        macroTrendData: simulatedMacroTrend,
        healthScore: Math.min(100, Math.max(20, rawData.healthScore + Math.round(demandOffset * 0.3) - Math.round(supplyOffset * 0.15))),
        benchmarkData: getDynamicBenchmarks(),
    };

    const stats = [
        { label: "Career Health", value: data.healthScore, suffix: "/100", icon: Activity, change: data.healthTier, colorClass: "text-emerald-450", baseColor: "var(--teal)", sparkData: [40, 55, 60, 58, 72, data.healthScore] },
        { label: "ATS Overlap", value: atsScore, suffix: "%", icon: Target, change: data.atsComparison, colorClass: "text-emerald-400", baseColor: "#10b981", sparkData: [30, 42, 50, 55, 60, atsScore] },
        { label: "Automation Risk", value: data.automationRisk, suffix: "%", icon: Cpu, change: `Timeline: ${data.disruptionTimeline}`, colorClass: "text-red-400", baseColor: "#ef4444", sparkData: [10, 15, 20, 22, 21, data.automationRisk] },
        { label: "Market Demand", value: data.marketDemandLevel, suffix: "", icon: Globe, change: "Real-world labor indexing", colorClass: "text-[var(--accent)]", baseColor: "var(--teal)", sparkData: [50, 55, 65, 72, 80, 92] },
    ];

    const tabs = [
        { id: "overview", label: "Overview Matrix" },
        { id: "benchmarks", label: "Benchmarks" },
        { id: "deepdive", label: "Skills Radar" },
        { id: "forecast", label: "Automation Forecast" },
        { id: "calculator", label: "Disruption Tool" },
        { id: "copilot", label: "Strategy Copilot" },
    ];

    const triggerPrint = () => {
        if (typeof window !== "undefined") {
            window.print();
        }
    };

    const handleCalc = () => {
        if (!calcQuery) return;
        setCalcResult({
            name: calcQuery,
            ...calculateDisruption(calcQuery)
        });
    };

    const triggerChatResponse = (queryText: string) => {
        setChatHistory(prev => [...prev, { sender: "user", text: queryText }]);
        setIsTyping(true);

        const lowerQuery = queryText.toLowerCase();
        let responseText = "";

        setTimeout(() => {
            if (lowerQuery.includes("upskill") || lowerQuery.includes("recommend") || lowerQuery.includes("learn") || lowerQuery.includes("path")) {
                responseText = `To secure your career as a ${domain}, your recommended path is to pivot towards AI-enabled architecture. Focus on these rising technologies: ${data.risingTechnologies.slice(0, 3).join(', ')}. Avoid boilerplate code writing and routine script configurations, which are rapidly automatable.`;
            } else if (lowerQuery.includes("salary") || lowerQuery.includes("pay") || lowerQuery.includes("earn") || lowerQuery.includes("premium")) {
                responseText = `Professionals who successfully integrate AI tools into their workflow command a +${data.salaryPremium}% salary premium. By 2030, our forecast indicates traditional positions in your sector will flatline, while AI-Augmented profiles will see salaries climb up to 150%+ of the current baseline.`;
            } else if (lowerQuery.includes("automation") || lowerQuery.includes("risk") || lowerQuery.includes("obsolescence") || lowerQuery.includes("replace")) {
                responseText = `Your current automation risk is assessed at ${data.automationRisk}%. The primary vulnerability lies in skills like ${data.obsolescenceWatch.slice(0, 2).join(' or ') || 'boilerplate writing'}. Focus on systems-level architecture, design planning, and security validation, which have high resilience indices.`;
            } else {
                responseText = `For a ${domain} with experience in ${skills.slice(0, 3).join(', ')}, the AI forecast indicates significant transformation over the next ${data.disruptionTimeline}. I suggest focusing on systems orchestration and integrating agentic automation into your current workspace to secure your premium market positioning.`;
            }

            setChatHistory(prev => [...prev, { sender: "copilot", text: responseText }]);
            setIsTyping(false);
        }, 1200);
    };

    const handleSendChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const text = chatInput;
        setChatInput("");
        triggerChatResponse(text);
    };

    const advisor = getRecommendation(demandOffset, supplyOffset, data.healthScore);

    return (
        <ResumeGate pageName="Career Analytics" pageIcon={<BarChart2 size={64} />}>
            <div className="max-w-[1280px] mx-auto px-4 pb-16 pt-2 animate-fade">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 border-b border-white/[0.05] pb-6 mb-8 mt-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent)] font-display">Market & Future intelligence</span>
                            <Badge label="Active Indexing" variant="green" size="sm" dot={true} />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none font-display">
                            Competency & AI Forecast
                        </h1>
                        <p className="text-xs text-zinc-550 mt-2.5 leading-relaxed font-semibold">
                            Comprehensive intelligence mapping your personal career trajectory and automation risk profile as a {domain}.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 no-print">
                        <PremiumButton variant="secondary" onClick={triggerPrint}>
                            Export Dossier
                        </PremiumButton>
                        <PremiumButton variant="primary" onClick={() => fetchLiveAnalytics()}>
                            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                            Calibrate Analytics
                        </PremiumButton>
                    </div>
                </div>

                <div className="relative">
                    <AnimatePresence>
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-[#0A0A0B]/85 backdrop-blur-md flex items-center justify-center"
                            >
                                <div className="bg-[#121214]/90 border border-white/[0.05] rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center">
                                    <PremiumLoader 
                                        message="Calibrating Analytics"
                                        submessage="Processing domain benchmarks & career histories..."
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map((s, idx) => {
                            const Icon = s.icon;
                            return (
                                <KPICard
                                    key={s.label}
                                    title={s.label}
                                    value={s.value}
                                    suffix={s.suffix}
                                    icon={<Icon size={16} />}
                                    sparklineData={s.sparkData}
                                    sparklineColor={s.baseColor}
                                    footer={
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mt-1">
                                            {s.change}
                                        </span>
                                    }
                                />
                            );
                        })}
                    </div>

                    {/* Labor Market Simulator Control Panel & AI Simulation Advisory side-by-side */}
                    <div className="no-print grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2">
                            <GlassCard className="p-5 border-[var(--teal)]/20 bg-[var(--teal)]/5 h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Activity size={16} className="text-[var(--accent)]" />
                                        <h3 className="text-xs font-extrabold text-white uppercase tracking-widest font-display">Labor Market Simulator</h3>
                                    </div>
                                    <p className="text-xs text-zinc-400 mb-5 leading-relaxed font-semibold">
                                        Adjust simulated macro labor swings to project demand volatility and supply saturation on your competency indexes.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2.5">
                                        <div className="flex justify-between text-xs font-bold text-zinc-300">
                                            <span>Tech Demand Swing</span>
                                            <span className={`font-mono font-bold ${demandOffset > 0 ? "text-emerald-400" : demandOffset < 0 ? "text-red-400" : "text-zinc-550"}`}>
                                                {demandOffset > 0 ? `+${demandOffset}` : demandOffset}%
                                            </span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="-30" 
                                            max="50" 
                                            value={demandOffset} 
                                            onChange={(e) => setDemandOffset(parseInt(e.target.value))}
                                            className="w-full accent-[var(--teal)] bg-white/[0.04] rounded-lg appearance-none h-1.5 cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2.5">
                                        <div className="flex justify-between text-xs font-bold text-zinc-300">
                                            <span>Candidate Supply Swing</span>
                                            <span className={`font-mono font-bold ${supplyOffset > 0 ? "text-red-400" : supplyOffset < 0 ? "text-emerald-400" : "text-zinc-550"}`}>
                                                {supplyOffset > 0 ? `+${supplyOffset}` : supplyOffset}%
                                            </span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="-30" 
                                            max="50" 
                                            value={supplyOffset} 
                                            onChange={(e) => setSupplyOffset(parseInt(e.target.value))}
                                            className="w-full accent-[var(--teal)] bg-white/[0.04] rounded-lg appearance-none h-1.5 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                        <div>
                            <GlassCard className="p-5 border-emerald-500/10 bg-emerald-500/[0.008] h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3.5">
                                        <div className="flex items-center gap-1.5">
                                            <BrainCircuit size={16} className="text-emerald-400" />
                                            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-display">Simulation Advisor</h4>
                                        </div>
                                        <Badge label={advisor.badge} variant="green" size="sm" />
                                    </div>
                                    <h3 className="text-xs font-extrabold text-white mb-2 font-display">{advisor.title}</h3>
                                    <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold">
                                        {advisor.desc}
                                    </p>
                                </div>
                                <div className="text-[9px] text-zinc-300 font-bold uppercase tracking-wider bg-black/40 p-2.5 rounded-xl border border-white/[0.05] mt-3.5 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                                    <span className="truncate">Strategy: {advisor.action}</span>
                                </div>
                            </GlassCard>
                        </div>
                    </div>

                    <TabBar
                        tabs={tabs}
                        activeTab={activeTab}
                        onChange={(id) => setActiveTab(id)}
                    />

                    {/* Tab Content */}
                    <div className="mt-8">
                        <AnimatePresence mode="wait">
                            {activeTab === "overview" && (
                                <motion.div 
                                    key="overview" 
                                    initial={{ opacity: 0, y: 8, filter: "blur(3px)" }} 
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
                                    exit={{ opacity: 0, y: -8, filter: "blur(3px)" }} 
                                    transition={{ duration: 0.25 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <GlassCard className="p-6">
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6 border-b border-white/[0.05] pb-4 font-display">
                                            <TrendingUp size={16} className="text-[var(--accent)]" /> Competency Growth Trajectory
                                        </h3>
                                        <div className="w-full h-80">
                                            {mounted && (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <ComposedChart data={data.growthTrajectory} margin={{ left: -20, right: 10 }}>
                                                        <defs>
                                                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                                                <feGaussianBlur stdDeviation="4" result="blur" />
                                                                <feMerge>
                                                                    <feMergeNode in="blur" />
                                                                    <feMergeNode in="SourceGraphic" />
                                                                </feMerge>
                                                            </filter>
                                                            <linearGradient id="colorAts" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.4}/>
                                                                <stop offset="95%" stopColor="var(--teal)" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                                        <XAxis dataKey="m" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                                                        <YAxis tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend wrapperStyle={{ fontSize: "0.75rem", paddingTop: 10 }} />
                                                        <Area 
                                                             type="monotone" 
                                                             dataKey="ats" 
                                                             name="ATS Score" 
                                                             stroke="var(--teal)" 
                                                             strokeWidth={2}
                                                             fillOpacity={1} 
                                                             fill="url(#colorAts)" 
                                                             isAnimationActive={true}
                                                             animationBegin={100}
                                                             animationDuration={1000}
                                                             animationEasing="ease-out"
                                                         />
                                                         <Line 
                                                             type="monotone" 
                                                             dataKey="interview" 
                                                             name="Interview Skill" 
                                                             stroke="#cbd5e1" 
                                                             strokeWidth={2} 
                                                             filter="url(#glow)"
                                                             dot={{ fill: "var(--teal)", r: 4, strokeWidth: 0 }} 
                                                             activeDot={{ r: 6 }}
                                                             isAnimationActive={true}
                                                             animationBegin={100}
                                                             animationDuration={1000}
                                                             animationEasing="ease-out"
                                                         />
                                                         <Line 
                                                             type="monotone" 
                                                             dataKey="marketDemand" 
                                                             name="Market Demand" 
                                                             stroke="#71717A" 
                                                             strokeWidth={1.5} 
                                                             strokeDasharray="4 4" 
                                                             dot={false} 
                                                             isAnimationActive={true}
                                                             animationBegin={100}
                                                             animationDuration={1000}
                                                             animationEasing="ease-out"
                                                         />
                                                    </ComposedChart>
                                                </ResponsiveContainer>
                                            )}
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-6">
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6 border-b border-white/[0.05] pb-4 font-display">
                                            <Database size={16} className="text-[var(--accent)]" /> Global Labor Demand for {domain}
                                        </h3>
                                        <div className="w-full h-64 mb-4">
                                            {mounted && (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={data.macroTrendData} margin={{ left: -20, right: 10 }}>
                                                        <defs>
                                                            <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#3f3f46" stopOpacity={0.25}/>
                                                                <stop offset="95%" stopColor="#3f3f46" stopOpacity={0}/>
                                                            </linearGradient>
                                                            <linearGradient id="colorDemandMacro" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#E11D48" stopOpacity={0.35}/>
                                                                <stop offset="95%" stopColor="#E11D48" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                                        <XAxis dataKey="quarter" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                                                        <YAxis tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend wrapperStyle={{ fontSize: "0.75rem", paddingTop: 10 }} />
                                                        <Area 
                                                             type="monotone" 
                                                             dataKey="demand" 
                                                             name="Market Demand" 
                                                             stroke="#E11D48" 
                                                             strokeWidth={2.5} 
                                                             fillOpacity={1} 
                                                             fill="url(#colorDemandMacro)" 
                                                             isAnimationActive={true}
                                                             animationBegin={100}
                                                             animationDuration={1000}
                                                             animationEasing="ease-out"
                                                         />
                                                         <Area 
                                                             type="monotone" 
                                                             dataKey="supply" 
                                                             name="Candidate Supply" 
                                                             stroke="#71717A" 
                                                             strokeWidth={1.5} 
                                                             fillOpacity={1} 
                                                             fill="url(#colorSupply)" 
                                                             isAnimationActive={true}
                                                             animationBegin={100}
                                                             animationDuration={1000}
                                                             animationEasing="ease-out"
                                                         />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            )}
                                        </div>
                                        <div className="bg-[var(--teal)]/5 border border-[var(--teal)]/20 rounded-xl p-3.5 text-xs text-zinc-300 text-center font-semibold leading-relaxed">
                                            {data.macroTrendSummary}
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            )}

                            {activeTab === "benchmarks" && (
                                <motion.div 
                                    key="benchmarks" 
                                    initial={{ opacity: 0, y: 8, filter: "blur(3px)" }} 
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
                                    exit={{ opacity: 0, y: -8, filter: "blur(3px)" }} 
                                    transition={{ duration: 0.25 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <GlassCard className="p-6">
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6 border-b border-white/[0.05] pb-4 font-display">
                                            <Target size={16} className="text-[var(--accent)]" /> Mapped Industry Benchmarking
                                        </h3>
                                        <div className="w-full h-80">
                                            {mounted && (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart data={data.benchmarkData}>
                                                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                                        <PolarAngleAxis dataKey="skill" tick={{ fill: "#71717a", fontSize: 9 }} />
                                                         <Radar 
                                                             name="You" 
                                                             dataKey="user" 
                                                             stroke="var(--teal)" 
                                                             fill="var(--teal)" 
                                                             fillOpacity={0.3} 
                                                             isAnimationActive={true}
                                                             animationBegin={100}
                                                             animationDuration={1000}
                                                             animationEasing="ease-out"
                                                         />
                                                         <Radar 
                                                             name="Median Avg" 
                                                             dataKey="avg" 
                                                             stroke="#71717A" 
                                                             fill="transparent" 
                                                             strokeDasharray="3 3" 
                                                             isAnimationActive={true}
                                                             animationBegin={100}
                                                             animationDuration={1000}
                                                             animationEasing="ease-out"
                                                         />
                                                         <Radar 
                                                             name="Top 10%" 
                                                             dataKey="top10" 
                                                             stroke="#cbd5e1" 
                                                             fill="transparent" 
                                                             strokeOpacity={0.6} 
                                                             isAnimationActive={true}
                                                             animationBegin={100}
                                                             animationDuration={1000}
                                                             animationEasing="ease-out"
                                                         />
                                                        <Legend wrapperStyle={{ fontSize: "0.75rem", paddingTop: 10 }} />
                                                        <Tooltip content={<CustomTooltip suffix="%" />} />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            )}
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-6">
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6 border-b border-white/[0.05] pb-4 font-display">
                                            <BarChart2 size={16} className="text-[var(--accent)]" /> Dimension Analysis Gaps
                                        </h3>
                                        <div className="space-y-4">
                                            {data.benchmarkData?.map((b: any, i: number) => {
                                                const pct = Math.round((b.user / b.top10) * 100);
                                                return (
                                                    <div key={b.skill}>
                                                        <div className="flex justify-between text-xs mb-1.5 font-semibold">
                                                            <span className="text-zinc-305">{b.skill}</span>
                                                            <span className="text-zinc-400">
                                                                {b.user}% <span className="text-[10px] text-zinc-550 font-medium font-sans">/ {b.top10}% target</span>
                                                            </span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-[var(--teal)] to-[var(--accent)] rounded-full" style={{ width: `${b.user}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            )}

                            {activeTab === "deepdive" && (
                                <motion.div 
                                    key="deepdive" 
                                    initial={{ opacity: 0, y: 8, filter: "blur(3px)" }} 
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
                                    exit={{ opacity: 0, y: -8, filter: "blur(3px)" }} 
                                    transition={{ duration: 0.25 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <GlassCard className="p-6">
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6 border-b border-white/[0.05] pb-4 font-display">
                                            <Zap size={16} className="text-[var(--accent)]" /> Skill Level vs Training Duration
                                        </h3>
                                        <div className="w-full h-64">
                                            {mounted && (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <ScatterChart margin={{ left: -20, right: 10 }}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                                                        <XAxis type="number" dataKey="hours" name="Invested Hours" unit="h" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                                                        <YAxis type="number" dataKey="mastery" name="Skill Level" unit="%" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                                        <ZAxis type="category" dataKey="skill" name="Skill" />
                                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                                                         <Scatter 
                                                             name="Skills" 
                                                             data={data.skillMasteryTime} 
                                                             fill="var(--teal)"
                                                             isAnimationActive={true}
                                                             animationBegin={100}
                                                             animationDuration={1000}
                                                         >
                                                             {data.skillMasteryTime?.map((entry: any, index: number) => (
                                                                 <Cell key={`cell-${index}`} fill={entry.mastery > 75 ? "#10b981" : entry.mastery > 50 ? "var(--teal)" : "#ef4444"} />
                                                             ))}
                                                         </Scatter>
                                                    </ScatterChart>
                                                </ResponsiveContainer>
                                            )}
                                        </div>
                                        <div className="flex gap-4 justify-center mt-6 text-[10px] text-zinc-550 font-bold uppercase tracking-wider font-display">
                                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Expert</span>
                                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--teal)]" /> Intermediate</span>
                                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Foundations</span>
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-6">
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6 border-b border-white/[0.05] pb-4 font-display">
                                            <Activity size={16} className="text-[var(--accent)]" /> Skill Masteries Heatmap
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {data.skillMasteryTime?.map((entry: any, i: number) => {
                                                const bgStyle = entry.mastery > 75 
                                                    ? "bg-emerald-500/10 border-emerald-500/15 text-emerald-400" 
                                                    : entry.mastery > 50 
                                                        ? "bg-[var(--teal)]/10 border-[var(--teal)]/20 text-[var(--accent)]" 
                                                        : "bg-white/[0.02] border-white/[0.06] text-zinc-400";
                                                return (
                                                    <div
                                                        key={entry.skill}
                                                        className={`p-4 rounded-xl border text-center transition-all ${bgStyle}`}
                                                    >
                                                        <div className="text-xl font-bold font-mono">{entry.mastery}%</div>
                                                        <div className="text-[10px] font-bold uppercase tracking-wider mt-2 truncate font-display">{entry.skill}</div>
                                                        <div className="text-[9px] text-zinc-500 font-semibold mt-1 uppercase tracking-wider font-mono">{entry.hours}h study</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            )}

                            {activeTab === "forecast" && (
                                <motion.div
                                    key="forecast"
                                    initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <GlassCard className="p-5 flex flex-col justify-between">
                                            <div>
                                                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block mb-1 font-display">Risk Rating</span>
                                                <h4 className="text-sm font-bold text-white mb-2 font-display">AI Disruption Risk</h4>
                                                <p className="text-[11px] text-zinc-450 leading-relaxed font-semibold">Probability of automation for core functions in the next 5 years.</p>
                                            </div>
                                            <div className="flex items-center gap-3.5 mt-4">
                                                <ProgressRing progress={data.automationRisk} size={54} strokeWidth={4.5} color={data.automationRisk > 60 ? "#ef4444" : data.automationRisk > 30 ? "#f59e0b" : "#10b981"} />
                                                <div>
                                                    <div className="text-lg font-bold font-mono text-white">{data.automationRisk}%</div>
                                                    <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-450 mt-0.5">
                                                        {data.automationRisk > 60 ? "ðŸš¨ HIGH EXPOSURE" : data.automationRisk > 30 ? "âš ï¸ PARTIAL ASSIST" : "ðŸ›¡ï¸ RESILIENT"}
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>

                                        <GlassCard className="p-5 flex flex-col justify-between">
                                            <div>
                                                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block mb-1 font-display">Growth Vector</span>
                                                <h4 className="text-sm font-bold text-white mb-2 font-display">Target Evolution</h4>
                                                <p className="text-[11px] text-zinc-450 leading-relaxed font-semibold">Recommended path upgrade to match automation timelines.</p>
                                            </div>
                                            <div className="mt-4">
                                                <div className="text-xs font-bold text-[var(--accent)] bg-[var(--teal)]/10 border border-[var(--teal)]/20 px-3 py-1.5 rounded-lg inline-block">
                                                    {data.targetEvolution}
                                                </div>
                                            </div>
                                        </GlassCard>

                                        <GlassCard className="p-5 flex flex-col justify-between">
                                            <div>
                                                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block mb-1 font-display">Compensation Catalyst</span>
                                                <h4 className="text-sm font-bold text-white mb-2 font-display">AI Salary Premium</h4>
                                                <p className="text-[11px] text-zinc-450 leading-relaxed font-semibold">Estimated compensation multiplier for AI-augmented skill nodes.</p>
                                            </div>
                                            <div className="mt-4">
                                                <div className="text-xl font-bold font-mono text-emerald-450">+{data.salaryPremium}% <span className="text-xs text-zinc-450 font-sans font-semibold">average boost</span></div>
                                            </div>
                                        </GlassCard>
                                    </div>

                                    {/* Obsolescence and Rising Lists */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <GlassCard className="p-5">
                                            <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4 font-display">Declining/Boilerplate Skills (Obsolescence Watch)</h4>
                                            <div className="space-y-2">
                                                {data.obsolescenceWatch.map((item: string) => (
                                                    <div key={item} className="flex items-center justify-between p-3.5 bg-red-500/[0.015] border border-red-500/10 rounded-xl">
                                                        <span className="text-xs font-semibold text-zinc-200">{item}</span>
                                                        <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5"><ArrowDownRight size={12} /> High Risk</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </GlassCard>

                                        <GlassCard className="p-5">
                                            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 font-display">Rising Competencies (Future Security)</h4>
                                            <div className="space-y-2">
                                                {data.risingTechnologies.map((item: string) => (
                                                    <div key={item} className="flex items-center justify-between p-3.5 bg-emerald-500/[0.015] border border-emerald-500/10 rounded-xl">
                                                        <span className="text-xs font-semibold text-zinc-200">{item}</span>
                                                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5"><ArrowUpRight size={12} /> High Demand</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </GlassCard>
                                    </div>

                                    {/* Growth Projections Area Chart */}
                                    <GlassCard className="p-6">
                                        <h3 className="text-sm font-bold text-white mb-6 font-display">5-Year Growth vs Automation Intensity Projections</h3>
                                        <div className="w-full h-72">
                                            {mounted && (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={data.forecastGrowthData} margin={{ left: -20, right: 10 }}>
                                                        <defs>
                                                            <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.35}/>
                                                                <stop offset="95%" stopColor="var(--teal)" stopOpacity={0}/>
                                                            </linearGradient>
                                                            <linearGradient id="colorAutomation" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                                        <XAxis dataKey="year" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                                                        <YAxis tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Legend wrapperStyle={{ fontSize: "0.75rem", paddingTop: 10 }} />
                                                        <Area type="monotone" dataKey="demand" name="Market Demand Index" stroke="var(--teal)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDemand)" isAnimationActive={true} animationBegin={100} animationDuration={1000} />
                                                        <Area type="monotone" dataKey="automation" name="Automation Intensity" stroke="#ef4444" strokeWidth={1.5} fillOpacity={1} fill="url(#colorAutomation)" isAnimationActive={true} animationBegin={100} animationDuration={1000} />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            )}
                                        </div>
                                    </GlassCard>

                                    {/* Survival Blueprint Card */}
                                    <GlassCard className="p-6 border-[var(--teal)]/20 bg-[var(--teal)]/5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Compass size={18} className="text-[var(--accent)]" />
                                            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-display">AI Strategic Survival Blueprint</h4>
                                        </div>
                                        <p className="text-xs text-zinc-300 leading-relaxed font-semibold">{data.survivalBlueprint}</p>
                                    </GlassCard>
                                </motion.div>
                            )}

                            {activeTab === "calculator" && (
                                <motion.div
                                    key="calculator"
                                    initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
                                    transition={{ duration: 0.25 }}
                                    className="max-w-xl mx-auto"
                                >
                                    <GlassCard className="p-6">
                                        <h3 className="text-sm font-bold text-white mb-3.5 font-display flex items-center gap-2">
                                            <Cpu size={16} className="text-[var(--accent)]" /> Skill Disruption Calculator
                                        </h3>
                                        <p className="text-xs text-zinc-450 leading-relaxed font-semibold mb-6">
                                            Input any particular developer framework, programming language, or process node to evaluate its projected automation risk rating.
                                        </p>
                                        <div className="flex gap-3 mb-6">
                                            <input 
                                                value={calcQuery}
                                                onChange={e => setCalcQuery(e.target.value)}
                                                onKeyDown={e => { if (e.key === "Enter") handleCalc(); }}
                                                placeholder="e.g. System Design, Manual QA, React"
                                                className="flex-1 h-10 bg-black/40 border border-white/[0.06] rounded-xl px-4 text-xs text-white placeholder-zinc-700 focus:border-[var(--teal)]/60 outline-none transition-colors"
                                            />
                                            <PremiumButton variant="primary" onClick={handleCalc} className="h-10 px-5">
                                                Evaluate
                                            </PremiumButton>
                                        </div>

                                        <AnimatePresence mode="wait">
                                            {calcResult && (
                                                <motion.div
                                                    key={calcResult.name}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="border border-white/[0.05] rounded-xl p-5 bg-white/[0.005]"
                                                >
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h4 className="text-xs font-extrabold text-white font-display uppercase tracking-wide">{calcResult.name}</h4>
                                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                                            calcResult.risk > 70 ? "text-red-400 bg-red-500/10 border border-red-500/15" : calcResult.risk > 40 ? "text-amber-400 bg-amber-500/10 border border-amber-500/15" : "text-emerald-400 bg-emerald-500/10 border border-emerald-500/15"
                                                        }`}>
                                                            {calcResult.safety}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="mb-4">
                                                        <div className="flex justify-between text-[10px] text-zinc-550 font-bold uppercase tracking-wider mb-2 font-display">
                                                            <span>Automation Risk Probability</span>
                                                            <span className={calcResult.risk > 70 ? "text-red-400" : calcResult.risk > 40 ? "text-amber-400" : "text-emerald-400"}>{calcResult.risk}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full ${
                                                                calcResult.risk > 70 ? "bg-red-500" : calcResult.risk > 40 ? "bg-amber-500" : "bg-emerald-500"
                                                            }`} style={{ width: `${calcResult.risk}%` }} />
                                                        </div>
                                                    </div>

                                                    <div className="text-[11px] text-zinc-400 leading-relaxed font-semibold border-t border-white/[0.04] pt-3">
                                                        <strong>Mitigation Action:</strong> {calcResult.strategy}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </GlassCard>
                                </motion.div>
                            )}

                            {activeTab === "copilot" && (
                                <motion.div
                                    key="copilot"
                                    initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
                                    transition={{ duration: 0.25 }}
                                    className="max-w-2xl mx-auto"
                                >
                                    <GlassCard className="p-0 border-white/[0.06] overflow-hidden flex flex-col h-[520px]">
                                        <div className="p-4 border-b border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Bot size={18} className="text-[var(--accent)]" />
                                                <div>
                                                    <h3 className="text-xs font-bold text-white font-display">AI Future Strategy Copilot</h3>
                                                    <p className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider mt-0.5">Real-time simulation advisor</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/10">
                                            {chatHistory.map((msg, i) => {
                                                const isCopilot = msg.sender === "copilot";
                                                return (
                                                    <div key={i} className={`flex gap-3 max-w-[85%] ${isCopilot ? "" : "ml-auto flex-row-reverse"}`}>
                                                        <div className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 text-xs select-none ${
                                                            isCopilot ? "bg-[var(--teal)]/10 border-[var(--teal)]/20 text-[var(--accent)]" : "bg-white/[0.02] border-white/[0.05] text-zinc-400"
                                                        }`}>
                                                            {isCopilot ? <Bot size={13} /> : <User size={13} />}
                                                        </div>
                                                        <div className={`p-3 rounded-xl border text-xs leading-relaxed font-semibold ${
                                                            isCopilot ? "bg-white/[0.005] border-white/[0.05] text-zinc-300" : "bg-[var(--teal)]/15 border-[var(--teal)]/25 text-white"
                                                        }`}>
                                                            {msg.text}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {isTyping && (
                                                <div className="flex gap-3 max-w-[80%]">
                                                    <div className="w-7 h-7 rounded-lg border bg-[var(--teal)]/10 border-[var(--teal)]/20 flex items-center justify-center text-[var(--accent)]"><Bot size={13} /></div>
                                                    <div className="p-3 rounded-xl border bg-white/[0.005] border-white/[0.05] text-zinc-500 text-xs italic font-semibold">
                                                        Strategy copilot is analyzing market trends...
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={chatEndRef} />
                                        </div>

                                        {/* Suggested Questions */}
                                        <div className="p-3.5 bg-black/40 border-t border-white/[0.05] flex gap-2 overflow-x-auto scrollbar-none">
                                            {[
                                                "Automation risk profile",
                                                "Niche upskilling recommended",
                                                "Salary premium outlook",
                                            ].map(q => (
                                                <button
                                                    key={q}
                                                    onClick={() => triggerChatResponse(q)}
                                                    className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-white/[0.05] hover:border-white/[0.1] bg-white/[0.01] hover:bg-white/[0.02] text-[10px] font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-wider"
                                                >
                                                    {q}
                                                </button>
                                            ))}
                                        </div>

                                        <form onSubmit={handleSendChat} className="p-4 border-t border-white/[0.06] bg-white/[0.01] flex gap-3">
                                            <input 
                                                value={chatInput}
                                                onChange={e => setChatInput(e.target.value)}
                                                placeholder="Ask the AI Strategy Copilot about future competency swings..."
                                                className="flex-grow h-10 bg-black/40 border border-white/[0.06] rounded-xl px-4 text-xs text-white placeholder-zinc-700 focus:border-[var(--teal)]/60 outline-none transition-colors"
                                            />
                                            <PremiumButton type="submit" variant="primary" className="h-10 px-4">
                                                <Send size={13} />
                                            </PremiumButton>
                                        </form>
                                    </GlassCard>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </ResumeGate>
    );
}

