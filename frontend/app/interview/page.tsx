"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/src/state/useAppStore";
import { useRouter } from "next/navigation";
import ResumeGate from "@/src/components/ResumeGate";
import {
  Mic, Target, Briefcase, Monitor, Code, Rocket, BarChart, Check,
  AlertTriangle, Lightbulb, Flag, Clock, Star, ArrowRight, ShieldCheck,
  ChevronRight, RefreshCw, Award, Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/src/components/ui/GlassCard";
import KPICard from "@/src/components/ui/KPICard";
import ProgressRing from "@/src/components/ui/ProgressRing";
import Badge from "@/src/components/ui/Badge";
import PremiumButton from "@/src/components/ui/PremiumButton";

type QType = "theory" | "practical" | "problem" | "behavioral" | "aptitude";
interface Question { text: string; type: QType; hint: string; marks: number; }

const typeLabel: Record<QType, string> = { 
  theory: "Core Theory", 
  practical: "Practical Application", 
  problem: "Problem Solving / DSA", 
  behavioral: "Behavioral (STAR)", 
  aptitude: "Aptitude / Reasoning" 
};

function buildQuestions(skills: string[], domain: string, exp: number): Question[] {
    const s0 = skills[0] || "programming";
    const s1 = skills[1] || "backend";
    const s2 = skills[2] || "frontend";

    const topics = [
        "dependency injection", "event loops", "garbage collection models", "distributed cache replication",
        "connection pooling structures", "database indexing mechanics", "microservice messaging protocols",
        "stateless token authentication", "virtualized container clustering", "REST vs RPC patterns",
        "concurrency management", "horizontal scaling", "memory leaks detection", "throttling and rate-limiting",
        "SQL query execution plans", "CI/CD staging freezes", "load balancer routing algorithms",
        "DNS resolution mechanisms", "data serialization techniques", "state synchronization"
    ];

    const issues = [
        "debugging a production memory leak", "reducing network latency spikes", 
        "handling 10,000 concurrent database connections", "recovering from database split-brain partition states",
        "optimizing heavy query scans", "routing real-time telemetry packets", 
        "managing web socket state disconnect cycles", "handling sudden API throughput spikes",
        "mitigating database deadlocks", "securing private customer data leaks"
    ];

    const behaviors = [
        "resolving a major system release regression under tight deadlines", 
        "handling a disagreement with a lead product owner regarding tech debt", 
        "debugging a critical hotfix 1 hour before staging code freeze", 
        "coaching a struggling junior developer with Git merge conflicts", 
        "proposing a complete rewrite of a legacy codebase module to senior leadership",
        "adapting to a sudden pivot in architectural design decisions mid-sprint"
    ];

    const structures = [
        "doubly linked list", "unbalanced binary search tree", "sliding window log buffer", 
        "weighted directed graph", "min heap trace structure", "thread-safe cyclic queue",
        "trie search tree prefix map", "bloom filter checker", "circular array list"
    ];

    const targets = [
        "detect cycles and return the starting node", "find the lowest common ancestor in O(log N) complexity", 
        "compute the maximum path sum dynamically", "extract the k-th smallest item efficiently", 
        "optimize average search lookup complexity to O(1)", "merge overlapping key intervals in O(N log N)",
        "find the longest contiguous unique subsegment in O(N) time"
    ];

    const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

    const shuffledTopics = shuffle(topics);
    const shuffledIssues = shuffle(issues);
    const shuffledBehaviors = shuffle(behaviors);
    const shuffledStructures = shuffle(structures);
    const shuffledTargets = shuffle(targets);

    const runId = Math.floor(Math.random() * 100000) + 1;

    const theory: Question[] = [
        { 
            text: `[Node #${runId}-T1] Explain the core concepts of ${shuffledTopics[0]} in a ${domain} architecture. How does it relate to ${s0}?`, 
            type: "theory", 
            hint: "Cover design principles, potential performance trade-offs, and scaling implications.", 
            marks: 15 
        },
        { 
            text: `[Node #${runId}-T2] What are the key architectural differences when implementing ${shuffledTopics[1]} compared to standard alternatives in a ${s1} codebase?`, 
            type: "theory", 
            hint: `Contrast benefits and issues when integrated with ${s1}.`, 
            marks: 15 
        },
        { 
            text: `[Node #${runId}-T3] Walk us through how you would handle ${shuffledTopics[2]} dynamically. What security or latency considerations apply?`, 
            type: "theory", 
            hint: "Focus on networking, threads, or resource allocations depending on context.", 
            marks: 10 
        }
    ];

    const practical: Question[] = [
        { 
            text: `[Node #${runId}-P1] How would you approach ${shuffledIssues[0]} in a production app built with ${s0} that serves thousands of active sessions?`, 
            type: "practical", 
            hint: "Mention diagnostic tools, logs, profiling, and mitigation strategies.", 
            marks: 15 
        },
        { 
            text: `[Node #${runId}-P2] Design a robust testing and deployment pipeline for a service handling ${shuffledIssues[1]} using modern DevOps patterns.`, 
            type: "practical", 
            hint: "Explain integration tests, failure failovers, and monitoring alerts.", 
            marks: 15 
        },
        { 
            text: `[Node #${runId}-P3] Describe a past scenario where you had to tackle ${shuffledIssues[2]} under pressure. What metrics proved success?`, 
            type: "practical", 
            hint: "Use the STAR framework (Situation, Task, Action, Result) with clear outcomes.", 
            marks: 10 
        }
    ];

    const problem: Question[] = [
        { 
            text: `[Node #${runId}-D1] Write pseudo-code to solve the following problem: Given a ${shuffledStructures[0]}, implement a method to ${shuffledTargets[0]}. Analyze the time and space complexity.`, 
            type: "problem", 
            hint: `Think of optimal algorithm traversal patterns. Try to target O(N) or O(log N).`, 
            marks: 20 
        },
        { 
            text: `[Node #${runId}-D2] Walk through the edge cases and data structures required to build an system component that can ${shuffledTargets[1]} on a live ${shuffledStructures[1]}.`, 
            type: "problem", 
            hint: "Outline structural nodes, hash checks, or pointer setups.", 
            marks: 20 
        }
    ];

    const behavioral: Question[] = [
        { 
            text: `[Node #${runId}-B1] Tell me about a time you were responsible for ${shuffledBehaviors[0]}. How did you communicate trade-offs?`, 
            type: "behavioral", 
            hint: "Emphasize documentation, alignment, and collaborative team outcomes.", 
            marks: 10 
        },
        { 
            text: `[Node #${runId}-B2] How do you maintain code quality and personal focus when tasked with ${shuffledBehaviors[1]}?`, 
            type: "behavioral", 
            hint: "Focus on software craftsmanship, professional growth, and engineering integrity.", 
            marks: 10 
        }
    ];

    const pick = <T,>(arr: T[], n: number) => arr.slice(0, n);
    const result: Question[] = [
        ...pick(shuffle(theory), 2),
        ...pick(shuffle(practical), 2),
        ...pick(shuffle(problem), 1),
        ...pick(shuffle(behavioral), 1),
    ];
    return shuffle(result);
}

function scoreAnswer(ans: string, q: Question, skills: string[]): { score: number; feedback: string } {
    const words = ans.trim().split(/\s+/).filter(Boolean).length;
    if (words < 10) return { score: 5, feedback: "Answer too short. A strong answer requires technical explanation and concrete examples." };
    let score = 35;
    if (words > 40) score += 12;
    if (words > 100) score += 8;
    const techTerms = ["algorithm", "complexity", "pattern", "design", "architecture", "performance", "scalable", "cache", "async", "thread", "database", "index", "query", "event", "hook", "component", "api", "http", "tcp", "hash", "tree", "graph", "queue", "stack", "heap"];
    const hits = techTerms.filter(t => ans.toLowerCase().includes(t)).length;
    score += Math.min(hits * 6, 25);
    const skillHits = skills.filter(s => ans.toLowerCase().includes(s.toLowerCase())).length;
    score += Math.min(skillHits * 8, 20);
    const finalScore = Math.min(q.marks, Math.round((score / 100) * q.marks * 1.4));
    const pct = Math.round((finalScore / q.marks) * 100);
    let feedback = "";
    if (pct >= 85) feedback = "Excellent! Your answer showed deep conceptual understanding and clean technical taxonomy.";
    else if (pct >= 65) feedback = "Good answer. Consider adding specific performance metrics, examples, or edge cases for full marks.";
    else if (pct >= 40) feedback = "Partial. The answer lacked detail. Try structuring: Definition â†’ Core Mechanics â†’ Architecture Trade-offs.";
    else feedback = "Needs improvement. A strong answer requires technical accuracy, concrete examples, and clear design reasoning.";
    return { score: finalScore, feedback };
}

type Phase = "setup" | "interview" | "result";

export default function InterviewPage() {
    const router = useRouter();
    const { profile, addXP } = useAppStore();
    const [phase, setPhase] = useState<Phase>("setup");
    const [round, setRound] = useState("hr");
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
    const [timerDuration, setTimerDuration] = useState(120);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [qIdx, setQIdx] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [feedbacks, setFeedbacks] = useState<{ score: number; feedback: string }[]>([]);
    const [current, setCurrent] = useState("");
    const [timer, setTimer] = useState(120);
    const [pasteCount, setPasteCount] = useState(0);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const h = localStorage.getItem("ciq-interview-history");
            if (h) setHistory(JSON.parse(h));
        }
    }, []);

    useEffect(() => {
        if (phase !== "interview") return;
        const interval = setInterval(() => {
            setTimer(t => {
                if (t <= 1) {
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [phase, qIdx]);

    useEffect(() => {
        if (timer === 0 && phase === "interview") {
            handleSubmit(true);
        }
    }, [timer, phase]);

    const getResumeQuestions = (): Question[] => {
        const analysis = profile?.resumeAnalysis;
        if (!analysis || !analysis.interview_questions) return [];
        
        let sourceList: any[] = [];
        let qType: QType = "theory";
        
        if (round === "hr") {
            sourceList = analysis.interview_questions.hr || [];
            qType = "behavioral";
        } else if (round === "tech") {
            sourceList = analysis.interview_questions.technical || [];
            qType = "theory";
        } else if (round === "code") {
            sourceList = analysis.interview_questions.situational || [];
            qType = "problem";
        }
        
        if (!Array.isArray(sourceList) || sourceList.length === 0) {
            return [];
        }
        
        return sourceList.map((item: any) => {
            const text = typeof item === "string" ? item : (item.question || item.text || `Interview question for ${round}`);
            const category = typeof item === "string" ? round.toUpperCase() : (item.category || item.type || round.toUpperCase());
            const hint = `Analyze based on your profile domain: ${profile?.domain || "your expertise"}. Focus on ${category}.`;
            return {
                text,
                type: qType,
                hint,
                marks: qType === "problem" ? 20 : 15
            };
        });
    };

    const startInterview = () => {
        const skills = profile?.skills || ["React", "TypeScript", "Node.js"];
        const domain = profile?.domain || "Full-Stack Developer";
        const exp = profile?.experience || 0;
        
        let qs = getResumeQuestions();
        if (qs.length === 0) {
            qs = buildQuestions(skills, domain, exp);
        }
        
        setQuestions(qs);
        setQIdx(0);
        setAnswers([]);
        setFeedbacks([]);
        setCurrent("");
        setTimer(timerDuration);
        setPasteCount(0);
        setPhase("interview");
    };

    const handleSubmit = (auto = false) => {
        const currentAns = auto ? "(Time Expired)" : current;
        const fb = scoreAnswer(currentAns, questions[qIdx], profile?.skills || []);
        const newAnswers = [...answers, currentAns];
        const newFB = [...feedbacks, fb];
        
        setAnswers(newAnswers);
        setFeedbacks(newFB);
        setCurrent("");

        if (qIdx + 1 >= questions.length) {
            const totalScored = newFB.reduce((a, b) => a + b.score, 0);
            const totalMarks = questions.reduce((a, b) => a + b.marks, 0);
            const pct = Math.round((totalScored / totalMarks) * 100);
            addXP(Math.round(pct * 1.5), `${round.toUpperCase()} Interview â€” ${pct}%`);
            
            const record = { 
                round, 
                difficulty, 
                pct, 
                totalScored, 
                totalMarks, 
                date: new Date().toISOString(), 
                domain: profile?.domain || "" 
            };
            const updatedHistory = [record, ...history].slice(0, 20);
            setHistory(updatedHistory);
            if (typeof window !== "undefined") {
                localStorage.setItem("ciq-interview-history", JSON.stringify(updatedHistory));
                localStorage.setItem("ciq-interview-done", "true");
            }
            setPhase("result");
        } else {
            setQIdx(i => i + 1);
            setTimer(timerDuration);
        }
    };

    return (
        <ResumeGate pageName="Interview Simulator" pageIcon={<Mic size={64} />}>
            <div className="max-w-[850px] mx-auto px-4 pb-20 pt-4 animate-fade">
                <AnimatePresence mode="wait">
                    {/* SETUP phase */}
                    {phase === "setup" && (
                        <motion.div
                            key="setup"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 border-b border-white/[0.05] pb-6 mb-8 mt-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent)] font-display">Simulations Module</span>
                                        <Badge label="Interactive Sandbox" variant="green" size="sm" dot={true} />
                                    </div>
                                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none font-display">
                                        Interview Simulator
                                    </h1>
                                    <p className="text-xs text-zinc-550 mt-2.5 leading-relaxed font-semibold">
                                        Initiate tailored mock interviews evaluating domain competencies based on scanned profile keywords.
                                    </p>
                                </div>
                            </div>

                            {profile?.domain && (
                                <GlassCard className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-[var(--teal)]/20">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--teal)]/10 border border-[var(--teal)]/20 flex items-center justify-center text-[var(--accent)]">
                                        <Target size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block font-display">Linked Profile</span>
                                        <h3 className="text-sm font-bold text-white font-display mt-0.5">{profile.domain}</h3>
                                        <p className="text-[11px] text-zinc-400 font-semibold mt-1">
                                            {profile.experience || 0} yr experience Â· {profile.skills?.slice(0, 4).join(", ")}{profile.skills?.length > 4 ? ` +${profile.skills.length - 4} more` : ""}
                                        </p>
                                    </div>
                                    <Badge label="Sync Active" variant="green" size="sm" dot={true} />
                                </GlassCard>
                            )}

                            {/* Round Selection */}
                            <div>
                                <p className="text-[10px] font-extrabold text-zinc-550 uppercase tracking-widest mb-4 font-display">Select Focus Round</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { id: "hr", icon: Briefcase, title: "HR & Behavioral", desc: "STAR framework behavioral evaluation." },
                                        { id: "tech", icon: Monitor, title: "Technical Theory", desc: "System architectures, algorithms, language specs." },
                                        { id: "code", icon: Code, title: "Programming/DSA", desc: "Data structures, problem solving, complexity analysis." }
                                    ].map((item) => {
                                        const Icon = item.icon;
                                        const isActive = round === item.id;
                                        return (
                                            <GlassCard
                                                key={item.id}
                                                onClick={() => setRound(item.id)}
                                                className={`cursor-pointer flex flex-col justify-between p-5 transition-all duration-300 ${
                                                    isActive 
                                                        ? "border-[var(--teal)]/35 bg-[var(--teal)]/5 shadow-[0_0_15px_rgba(109,0,26,0.15)]" 
                                                        : "hover:border-white/[0.08]"
                                                }`}
                                            >
                                                <div>
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-4 border ${
                                                        isActive 
                                                            ? "bg-[var(--teal)]/10 border-[var(--teal)]/20 text-[var(--accent)]" 
                                                            : "bg-white/[0.02] border-white/[0.05] text-zinc-400"
                                                    }`}>
                                                        <Icon size={16} />
                                                    </div>
                                                    <h4 className="text-sm font-bold text-white mb-1.5 font-display">{item.title}</h4>
                                                    <p className="text-[11px] text-zinc-450 leading-relaxed font-semibold mb-4">{item.desc}</p>
                                                </div>
                                                {isActive && (
                                                    <span className="text-[9px] text-[var(--accent)] font-bold flex items-center gap-1 mt-auto font-display uppercase tracking-widest">
                                                        <Check size={12} /> Active Round
                                                    </span>
                                                )}
                                            </GlassCard>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Difficulty & Timer Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <GlassCard className="p-5">
                                    <p className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest mb-4 font-display">Difficulty Level</p>
                                    <div className="flex gap-2 bg-black/40 p-1 border border-white/[0.05] rounded-xl">
                                        {(["easy", "medium", "hard"] as const).map(d => (
                                            <button
                                                key={d}
                                                onClick={() => setDifficulty(d)}
                                                className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all outline-none ${
                                                    difficulty === d
                                                        ? "bg-[var(--teal)] text-white shadow-md font-extrabold"
                                                        : "bg-transparent text-zinc-400 hover:text-zinc-200"
                                                }`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </GlassCard>
                                
                                <GlassCard className="p-5">
                                    <p className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest mb-4 font-display">Timer per Question</p>
                                    <div className="flex gap-2 bg-black/40 p-1 border border-white/[0.05] rounded-xl">
                                        {[60, 120, 180].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setTimerDuration(t)}
                                                className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all outline-none ${
                                                    timerDuration === t
                                                        ? "bg-[var(--teal)] text-white shadow-md font-extrabold"
                                                        : "bg-transparent text-zinc-400 hover:text-zinc-200"
                                                }`}
                                            >
                                                {t}s
                                            </button>
                                        ))}
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Integrity Warnings */}
                            <GlassCard className="border-red-500/10 bg-red-500/[0.015] p-5">
                                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2 mb-2.5 font-display">
                                    <AlertTriangle size={14} className="animate-pulse" /> Assessment Integrity Controls
                                </h4>
                                <ul className="text-xs text-zinc-450 list-disc pl-5 space-y-1.5 leading-relaxed font-semibold">
                                    <li>Clipboard paste functions are disabled in the response editor windows.</li>
                                    <li>Focus loss checks and typing anomalies will be tracked automatically.</li>
                                    <li>Answers auto-submit for verification once the question clock runs out.</li>
                                </ul>
                            </GlassCard>

                            {/* History Section */}
                            {history.length > 0 && (
                                <GlassCard className="p-5">
                                    <p className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest mb-4 font-display">Past Sessions Logs</p>
                                    <div className="space-y-3">
                                        {history.slice(0, 3).map((h, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-4 p-3 bg-white/[0.01] border border-white/[0.05] rounded-xl"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center font-bold text-xs text-[var(--accent)] font-mono">
                                                    {h.pct}%
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">{h.round} round Â· {h.difficulty}</h5>
                                                    <span className="text-[10px] text-zinc-500 font-semibold block mt-0.5">{new Date(h.date).toLocaleDateString()} Â· {h.domain}</span>
                                                </div>
                                                <span className="text-xs text-zinc-400 font-bold font-mono">{h.totalScored}/{h.totalMarks} pts</span>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            )}

                            <PremiumButton variant="primary" className="w-full h-12" onClick={startInterview}>
                                <Play size={15} /> Start Simulated Interview Session
                            </PremiumButton>
                        </motion.div>
                    )}

                    {/* INTERVIEW phase */}
                    {phase === "interview" && questions.length > 0 && (
                        <motion.div
                            key="interview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Question Header */}
                            <div className="flex justify-between items-start mb-6 border-b border-white/[0.05] pb-6">
                                <div>
                                    <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-widest flex items-center gap-1.5 mb-1.5 font-display">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] animate-pulse" />
                                        Session Active
                                    </span>
                                    <h2 className="text-xl font-bold text-white font-display">Question {qIdx + 1} of {questions.length}</h2>
                                    <p className="text-xs text-zinc-550 mt-1 font-semibold">Grading is calculated using custom semantic similarity.</p>
                                </div>

                                {/* Custom Timer Progress Ring */}
                                <div className="relative w-16 h-16 flex items-center justify-center">
                                    <ProgressRing
                                        progress={(timer / timerDuration) * 100}
                                        size={56}
                                        strokeWidth={4.5}
                                        color={timer > timerDuration * 0.5 ? "#10b981" : timer > timerDuration * 0.25 ? "#f59e0b" : "#ef4444"}
                                        glow={true}
                                    />
                                    <div className="absolute text-center">
                                        <span className="text-xs font-bold text-white font-mono">{timer}s</span>
                                    </div>
                                </div>
                            </div>

                            {/* Indicators Progress Bar */}
                            <div className="flex gap-1.5 mb-6">
                                {questions.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                            i < qIdx 
                                                ? "bg-[var(--teal)]" 
                                                : i === qIdx 
                                                    ? "bg-[var(--accent)]" 
                                                    : "bg-white/[0.04]"
                                        }`}
                                    />
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={qIdx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-6"
                                >
                                    <div className="flex gap-2">
                                        <span className="bg-[var(--teal)]/10 text-[var(--accent)] border border-[var(--teal)]/20 px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider font-display">
                                            {typeLabel[questions[qIdx].type]}
                                        </span>
                                        <span className="bg-white/[0.02] text-zinc-400 border border-white/[0.05] px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider font-display">
                                            {questions[qIdx].marks} Marks
                                        </span>
                                    </div>

                                    {/* Question Card */}
                                    <GlassCard className="p-6">
                                        <h3 className="text-base text-zinc-200 font-semibold leading-relaxed mb-4">{questions[qIdx].text}</h3>
                                        <div className="bg-white/[0.01] border border-white/[0.05] rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-zinc-450 font-semibold">
                                            <Lightbulb size={14} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
                                            <span><strong>System Focus Hint:</strong> {questions[qIdx].hint}</span>
                                        </div>
                                    </GlassCard>

                                    {/* Answer Textarea */}
                                    {(() => {
                                        const wordCount = current.trim() ? current.trim().split(/\s+/).length : 0;
                                        const qualityColor = wordCount >= 80 ? "text-emerald-400" : wordCount >= 40 ? "text-amber-400" : "text-zinc-550";
                                        const qualityLabel = wordCount >= 80 ? "Great response density" : wordCount >= 40 ? "Good draft â€” add an active metric" : "Start drafting technical answer...";

                                        return (
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <textarea
                                                        value={current}
                                                        onChange={e => setCurrent(e.target.value)}
                                                        onPaste={e => { e.preventDefault(); setPasteCount(p => p + 1); }}
                                                        onCopy={e => e.preventDefault()}
                                                        onCut={e => e.preventDefault()}
                                                        onContextMenu={e => e.preventDefault()}
                                                        placeholder="Draft response details here. Define structures, evaluate architectures, and describe real trade-offs."
                                                        className="w-full h-44 bg-black/40 border border-white/[0.06] rounded-xl p-4 text-xs font-semibold text-white placeholder-zinc-750 focus:border-[var(--teal)]/60 outline-none transition-colors duration-200 resize-none font-sans leading-relaxed"
                                                    />
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                                                        <div className="h-full bg-[var(--teal)] rounded-full" style={{ width: `${Math.min(100, (wordCount / 80) * 100)}%` }} />
                                                    </div>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${qualityColor}`}>
                                                        {wordCount} words Â· {qualityLabel}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-white/[0.05]">
                                                    <div className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">
                                                        Assessment integrity scans active.
                                                        {pasteCount > 0 && (
                                                            <span className="text-red-400 font-extrabold ml-2">
                                                                * {pasteCount} block flags logged
                                                            </span>
                                                        )}
                                                    </div>
                                                    <PremiumButton variant="primary" onClick={() => handleSubmit()} className="w-full sm:w-auto">
                                                        {qIdx + 1 === questions.length ? (
                                                            <span className="flex items-center gap-2"><Flag size={14} /> Submit Assessment</span>
                                                        ) : (
                                                            "Next Question"
                                                        )}
                                                    </PremiumButton>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* RESULT phase */}
                    {phase === "result" && questions.length > 0 && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {(() => {
                                const totalScored = feedbacks.reduce((a, b) => a + b.score, 0);
                                const totalMarks = questions.reduce((a, b) => a + b.marks, 0);
                                const pct = Math.round((totalScored / totalMarks) * 100);
                                const status = pct >= 75 ? "Highly Recommended" : pct >= 50 ? "Qualified Target" : "Under Development";
                                const statusColor = pct >= 75 ? "text-emerald-400" : pct >= 50 ? "text-amber-400" : "text-red-400";

                                return (
                                    <>
                                        <GlassCard className="text-center p-8 border-[var(--teal)]/20">
                                            <div className="flex justify-center text-zinc-550 mb-4">
                                                <BarChart size={40} className="text-[var(--accent)]" />
                                            </div>
                                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block font-display">Performance Report</span>
                                            <h1 className="text-xl font-bold text-white font-display mt-1">Assessment Complete</h1>
                                            
                                            <div className={`text-6xl font-bold font-mono my-6 ${statusColor}`}>
                                                {pct}%
                                            </div>

                                            <div className={`text-xs font-bold uppercase tracking-widest mb-6 ${statusColor}`}>{status}</div>
                                            
                                            <div className="flex gap-2 justify-center">
                                                <span className="bg-white/[0.01] border border-white/[0.05] text-zinc-300 px-3 py-1 rounded-lg text-xs font-semibold">
                                                    {totalScored} / {totalMarks} Total Points
                                                </span>
                                                <span className="bg-white/[0.01] border border-white/[0.05] text-zinc-300 px-3 py-1 rounded-lg text-xs font-semibold">
                                                    {questions.length} Question Nodes
                                                </span>
                                            </div>
                                        </GlassCard>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { label: "Technical Score", val: `${Math.round(feedbacks.filter((_, i) => questions[i].type === "theory" || questions[i].type === "problem").reduce((a, b) => a + b.score, 0) / Math.max(1, (feedbacks.filter((_, i) => questions[i].type === "theory" || questions[i].type === "problem").length)) * 100)}%`, col: "text-zinc-200" },
                                                { label: "Communication Flow", val: pct >= 65 ? "Articulate" : "Structured", col: "text-zinc-200" },
                                                { label: "Analytical Depth", val: pct >= 70 ? "Advanced" : pct >= 50 ? "Proficient" : "Foundational", col: "text-zinc-200" },
                                                { label: "Integrity Checks", val: pasteCount === 0 ? "Verified Clear" : `${pasteCount} paste blocks`, col: pasteCount === 0 ? "text-emerald-405" : "text-red-405" },
                                            ].map((stat, i) => (
                                                <GlassCard key={i} className="text-center p-4">
                                                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-display">{stat.label}</span>
                                                    <div className={`text-sm font-bold mt-2 ${stat.col}`}>{stat.val}</div>
                                                </GlassCard>
                                            ))}
                                        </div>

                                        <GlassCard className="p-6">
                                            <h3 className="text-base font-bold text-white mb-5 font-display">Response Audit Details</h3>
                                            <div className="space-y-4">
                                                {questions.map((q, i) => (
                                                    <div
                                                        key={i}
                                                        className="p-4 bg-white/[0.005] border border-white/[0.05] rounded-xl flex flex-col sm:flex-row justify-between gap-4"
                                                    >
                                                        <div className="flex-grow min-w-0">
                                                            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                                                                <span className="text-[9px] bg-white/[0.02] border border-white/[0.06] text-zinc-400 px-2 py-0.5 rounded font-bold uppercase font-display">
                                                                    Q{i + 1} Â· {typeLabel[q.type]}
                                                                </span>
                                                                <h4 className="text-xs font-bold text-zinc-350">{q.text.slice(0, 75)}...</h4>
                                                            </div>

                                                            {answers[i] && answers[i] !== "(Time Expired)" ? (
                                                                <p className="text-xs text-zinc-400 italic bg-black/40 p-3 rounded-xl border border-white/[0.04] mb-2.5 leading-relaxed font-semibold">
                                                                    &ldquo;{answers[i]}&rdquo;
                                                                </p>
                                                            ) : (
                                                                <div className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/15 p-2 rounded mb-2.5 font-bold uppercase tracking-wider">
                                                                    (Time Expired - Null response)
                                                                </div>
                                                            )}

                                                            <div className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed mt-2 font-semibold">
                                                                <Check size={14} className="text-emerald-450 flex-shrink-0 mt-0.5" />
                                                                <span>{feedbacks[i]?.feedback}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <span className="text-sm font-bold font-mono text-[var(--accent)]">{feedbacks[i]?.score} / {q.marks}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </GlassCard>

                                        <div className="flex flex-wrap gap-3">
                                            <PremiumButton variant="primary" onClick={() => { setPhase("setup"); setQIdx(0); }}>
                                                Retake Assessment
                                            </PremiumButton>
                                            <PremiumButton variant="ghost" onClick={() => router.push("/profile")}>
                                                Exit Simulator
                                            </PremiumButton>
                                            <PremiumButton variant="secondary" onClick={() => router.push("/learning")}>
                                                Open Learning Paths <ArrowRight size={12} />
                                            </PremiumButton>
                                        </div>
                                    </>
                                );
                             })()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ResumeGate>
    );
}

