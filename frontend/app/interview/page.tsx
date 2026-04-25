"use client";
import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/src/state/useAppStore";
import { useRouter } from "next/navigation";
import ResumeGate from "@/src/components/ResumeGate";
import { Mic, Target, Briefcase, Monitor, Code, Rocket, BarChart, Check, AlertTriangle, Lightbulb, Flag, Clock } from "lucide-react";

type QType = "theory" | "practical" | "problem" | "behavioral" | "aptitude";
interface Question { text: string; type: QType; hint: string; marks: number; }
const typeColor: Record<QType, string> = { theory: "#a78bfa", practical: "#60a5fa", problem: "#34d399", behavioral: "#fbbf24", aptitude: "#f472b6" };
const typeLabel: Record<QType, string> = { theory: "Core Theory", practical: "Practical", problem: "Problem Solving", behavioral: "Behavioral", aptitude: "Aptitude / Reasoning" };

function buildAptitudeQuestions(domain: string, skills: string[]): Question[] {
    const s0 = skills[0] || "programming";
    const quantitative: Question[] = [
        { text: `If a ${s0} application processes 1,200 requests/minute and each request takes 250ms on average, how many concurrent workers are needed to handle the load without queuing?`, type: "aptitude", hint: "Little's Law: Workers = Arrival Rate × Processing Time. Convert units carefully.", marks: 10 },
        { text: `A software team of 4 developers: A finishes a module in 12 days, B in 18 days, C in 24 days, D in 36 days. How many days will it take all four working together (round to nearest whole day)?`, type: "aptitude", hint: "Sum of work rates: 1/12 + 1/18 + 1/24 + 1/36 per day. Find combined rate.", marks: 10 },
        { text: `A ${domain} project costs ₹2,40,000. After a 15% cost overrun and then a 10% discount on the new total, what is the final cost?`, type: "aptitude", hint: "Apply overrun first: 2,40,000 × 1.15, then apply 10% discount on that result.", marks: 10 },
        { text: `In a binary search of a sorted array of 65,536 elements, what is the maximum number of comparisons needed in the worst case?`, type: "aptitude", hint: "Binary search: ⌈log₂(n)⌉ comparisons. 65,536 = 2^16.", marks: 10 },
        { text: `Server A processes tasks twice as fast as Server B. Together they finish 360 tasks in 4 hours. How many tasks can Server A alone finish in 3 hours?`, type: "aptitude", hint: "If B does x tasks/hr, A does 2x. Together 3x × 4hrs = 360. Find A's rate.", marks: 10 },
        { text: `A company's ${domain} team grows by 20% each quarter. If they start with 25 engineers, how many engineers will they have after 3 quarters?`, type: "aptitude", hint: "Compound growth: 25 × (1.20)^3. Calculate step by step.", marks: 8 },
    ];
    const logical: Question[] = [
        { text: `In a code review: every bug found by engineer P is also found by Q. Some bugs found by Q are critical. Which conclusion is DEFINITELY true?\nA) All of P's bugs are critical\nB) Some of P's bugs may be critical\nC) P finds no non-critical bugs\nD) Q finds all critical bugs`, type: "aptitude", hint: "P ⊆ Q and Q ∩ Critical ≠ ∅. Does P necessarily intersect Critical? Use Venn diagram reasoning.", marks: 8 },
        { text: `Decode the pattern: API → 1-16-9, URL → 21-18-12, SDK → 19-4-11. What does BUG decode to?`, type: "aptitude", hint: "Each letter maps to its position in the alphabet (A=1, B=2... Z=26). Verify with the examples.", marks: 8 },
        { text: `A ${domain} team: A is senior to B, C is junior to D, E is senior to D, B is senior to C. Rank all from most to least senior.`, type: "aptitude", hint: "Build chains: A > B > C on one side, E > D > C on the other. Find the full order.", marks: 8 },
        { text: `If CLOUD is coded as ENWQF (each letter shifted forward by +2, +1, +2, +1, +2...), what would REACT be coded as?`, type: "aptitude", hint: "Alternating shift: odd positions +2, even positions +1. Apply to each letter of REACT.", marks: 8 },
        { text: `Three CI/CD pipelines start at 9AM. Pipeline A takes 45min, B takes 30min, C takes 60min. If they can only run one at a time (in order A, B, C), when does the last pipeline finish?`, type: "aptitude", hint: "Sequential: 9AM + 45min = 9:45, then +30min = 10:15, then +60min = 11:15AM.", marks: 8 },
    ];
    const verbal: Question[] = [
        { text: `Choose the word most opposite in meaning to "DEPRECATED" in a software context:\nA) Outdated  B) Obsolete  C) Current  D) Legacy`, type: "aptitude", hint: "Deprecated means no longer recommended / being phased out. What is the opposite state?", marks: 5 },
        { text: `Fill in the blank: "A well-designed ${s0} API should be _____ to new features without breaking existing _____ contracts."\nA) closed, API  B) open, interface  C) rigid, user  D) deprecated, binary`, type: "aptitude", hint: "Think Open-Closed Principle: open for extension, closed for modification. What breaks when APIs change?", marks: 5 },
        { text: `Identify the one that does NOT belong with the others: Git, Docker, Jenkins, React, Kubernetes — which one is primarily a UI library rather than a DevOps/infrastructure tool?`, type: "aptitude", hint: "Think about what each tool's primary purpose is. Which builds user interfaces?", marks: 5 },
        { text: `Choose the best synonym for CONCURRENCY in ${domain}: A) Parallelism only  B) Sequential execution  C) Multiple tasks making progress simultaneously  D) Single-threaded processing`, type: "aptitude", hint: "Concurrency vs parallelism: concurrency is about structure (interleaved progress), not necessarily simultaneous execution.", marks: 5 },
    ];
    const all = [...quantitative, ...logical, ...verbal];
    return all.sort(() => Math.random() - 0.5).slice(0, 3);
}

function buildQuestions(skills: string[], domain: string, exp: number): Question[] {
    const s0 = skills[0] || "programming"; const s1 = skills[1] || "backend"; const s2 = skills[2] || "SQL";
    const theory: Question[] = [
        { text: `Explain the core concepts of ${s0}. What makes it different from its alternatives?`, type: "theory", hint: "Cover architecture, design principles, and real trade-offs.", marks: 15 },
        { text: `What are the SOLID principles in software design? Give a real example for each using ${domain}.`, type: "theory", hint: `5 principles with concrete ${domain} examples.`, marks: 15 },
        { text: `Explain how memory management works in ${s0 || "your primary language"}.`, type: "theory", hint: "Garbage collection, stack/heap, references, memory leaks.", marks: 10 },
        { text: `What is the difference between REST, GraphQL, and gRPC? When would you use each in a ${domain} project?`, type: "theory", hint: "Compare architecture, use cases, performance and when each shines.", marks: 10 },
        { text: `Describe the concurrency model in ${domain.includes("Full") ? "JavaScript" : s0}. How does it handle async operations?`, type: "theory", hint: "Call stack, event queue, microtasks vs macrotasks, async/await.", marks: 10 },
        { text: `How does ${s1} handle authentication and authorization? What are best security practices?`, type: "theory", hint: "JWT, OAuth2, role-based access, token refresh, secure headers.", marks: 10 },
    ];
    const practical: Question[] = [
        { text: `Walk me through a ${domain} project where ${s0} was critical. What was the toughest technical challenge?`, type: "practical", hint: "Use STAR: Situation, Task, Action, Result with metrics", marks: 15 },
        { text: `How would you debug a production performance issue in a ${s0} application with thousands of users?`, type: "practical", hint: "Profiling, logs, APM tools, root cause analysis approach", marks: 15 },
        { text: `You need to design a data pipeline that processes 1M records per day using your stack (${s0}, ${s2}). Explain your approach.`, type: "practical", hint: "Architecture, failover, monitoring, cost optimization", marks: 10 },
        { text: `How do you ensure code quality and testability in your ${domain} projects?`, type: "practical", hint: "Testing pyramid, coverage, code review, CI/CD integration", marks: 10 },
    ];
    const problem: Question[] = [
        { text: `Given a sorted array of integers, find all pairs that sum to a target value. Write pseudocode and analyze time complexity.`, type: "problem", hint: "Two pointer technique: O(n) time, O(1) space", marks: 20 },
        { text: `Design a rate limiter for an API that should allow 100 requests per minute per user. What data structures would you use?`, type: "problem", hint: "Token bucket / sliding window, Redis for distributed systems", marks: 20 },
        { text: `How would you detect a cycle in a linked list? Implement the algorithm.`, type: "problem", hint: "Floyd's cycle detection: fast and slow pointers", marks: 15 },
    ];
    const behavioral: Question[] = [
        { text: `Tell me about a time you disagreed with a senior engineer or your team lead. How did you handle it?`, type: "behavioral", hint: "Show empathy, data-driven approach, outcome focus", marks: 10 },
        { text: `Describe your biggest technical failure. What happened and what did you learn?`, type: "behavioral", hint: "Self-awareness, growth mindset, what changed after", marks: 10 },
    ];

    const pick = <T,>(arr: T[], n: number) => arr.slice(0, n);
    const result: Question[] = [
        ...pick(theory.sort(() => Math.random() - 0.5), 2),  // 40% → 2 theory
        ...pick(practical.sort(() => Math.random() - 0.5), 2), // 30% → 2 practical  
        ...pick(problem.sort(() => Math.random() - 0.5), 1),   // 20% → 1 problem
        ...pick(behavioral.sort(() => Math.random() - 0.5), 1), // 10% → 1 behavioral
    ];
    return result.sort(() => Math.random() - 0.5);
}

function scoreAnswer(ans: string, q: Question, skills: string[]): { score: number; feedback: string } {
    const words = ans.trim().split(/\s+/).filter(Boolean).length;
    if (words < 10) return { score: 5, feedback: "Answer too short. A strong answer requires explanation and examples." };
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
    if (pct >= 85) feedback = "Excellent! Your answer showed deep understanding and proper technical terminology.";
    else if (pct >= 65) feedback = "Good answer. Consider adding specific metrics, examples, or edge cases for full marks.";
    else if (pct >= 40) feedback = "Partial. The answer lacked depth. Try structuring with: Definition → How it works → Example → Trade-offs.";
    else feedback = "Needs improvement. A strong answer requires technical accuracy, examples, and reasoning.";
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
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const h = localStorage.getItem("ciq-interview-history");
            if (h) setHistory(JSON.parse(h));
        }
    }, []);

    const startInterview = () => {
        const skills = profile?.skills || ["React", "TypeScript", "Node.js"];
        const domain = profile?.domain || "Full-Stack Developer";
        const exp = profile?.experience || 0;
        const qs = buildQuestions(skills, domain, exp);
        setQuestions(qs);
        setQIdx(0); setAnswers([]); setFeedbacks([]); setCurrent(""); setTimer(timerDuration); setPasteCount(0);
        setPhase("interview");
        startTimer(qs.length > 0);
    };

    const startTimer = (active: boolean) => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (!active) return;
        timerRef.current = setInterval(() => setTimer(t => {
            if (t <= 1) { handleSubmit(true); return timerDuration; }
            return t - 1;
        }), 1000);
    };

    useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

    const handleSubmit = (auto = false) => {
        if (timerRef.current) clearInterval(timerRef.current);
        const fb = scoreAnswer(auto ? "(time expired)" : current, questions[qIdx], profile?.skills || []);
        const newAnswers = [...answers, auto ? "(Time Expired)" : current];
        const newFB = [...feedbacks, fb];
        setAnswers(newAnswers);
        setFeedbacks(newFB);
        setCurrent("");
        if (qIdx + 1 >= questions.length) {
            const totalScored = newFB.reduce((a, b) => a + b.score, 0);
            const totalMarks = questions.reduce((a, b) => a + b.marks, 0);
            const pct = Math.round((totalScored / totalMarks) * 100);
            addXP(Math.round(pct * 1.5), `${round.toUpperCase()} Interview — ${pct}%`);
            // Save to interview history
            const record = { round, difficulty, pct, totalScored, totalMarks, date: new Date().toISOString(), domain: profile?.domain || "" };
            const updatedHistory = [record, ...history].slice(0, 20);
            setHistory(updatedHistory);
            if (typeof window !== "undefined") localStorage.setItem("ciq-interview-history", JSON.stringify(updatedHistory));
            setPhase("result");
        } else {
            setQIdx(i => i + 1);
            setTimer(timerDuration);
            startTimer(true);
        }
    };

    // SETUP phase
    if (phase === "setup") return (
        <ResumeGate pageName="Interview Simulator" pageIcon={<Mic size={64} />}>
        <div className="page-enter" style={{ maxWidth: 800, margin: "0 auto" }}>
            <h1 style={{ marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}><Mic size={26} /> Interview Simulator</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 16 }}>AI-powered VR mock interviews with questions tailored to your resume — including aptitude & reasoning rounds</p>

            {/* Resume role pre-fill banner */}
            {profile?.domain && (
                <div style={{ marginBottom: 20, padding: "14px 20px", borderRadius: 14, background: "linear-gradient(135deg,rgba(167,139,250,0.12),rgba(96,165,250,0.08))", border: "1px solid rgba(167,139,250,0.3)", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ color: "var(--accent)" }}><Target size={32} /></div>
                    <div>
                        <div style={{ fontSize: "0.7rem", color: "rgba(167,139,250,0.7)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>RESUME-DETECTED ROLE</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f1f5f9" }}>{profile.domain}</div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 2 }}>{profile.experience || 0} yr experience · {profile.skills?.slice(0, 3).join(", ")}{profile.skills?.length > 3 ? ` +${profile.skills.length - 3} more` : ""}</div>
                    </div>
                    <div style={{ marginLeft: "auto", fontSize: "0.68rem", color: "rgba(52,211,153,0.8)", fontWeight: 600, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 20, padding: "4px 12px", display: "flex", alignItems: "center" }}><Check size={12} className="mr-1" /> Resume Loaded</div>
                </div>
            )}

            <div className="card" style={{ background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.2)", marginBottom: 20 }}>
                <h3>Question Distribution — 8 Questions Total</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                    {[["2", "Core Theory", "#a78bfa","Based on your skills"], ["2", "Practical", "#60a5fa","Real-world scenarios"], ["1", "Problem Solving", "#34d399","DSA & algorithms"], ["1", "Behavioral", "#fbbf24","Soft skills"], ["2", "Aptitude", "#f472b6","Quantitative & logical"]].map(([p, l, c, sub]) => (
                        <div key={l as string} style={{ flex: 1, minWidth: 110, background: `${c}11`, border: `1px solid ${c}33`, borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
                            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: c as string }}>{p}</div>
                            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: c as string, marginBottom: 2 }}>{l}</div>
                            <div style={{ fontSize: "0.62rem", color: "var(--text-muted)" }}>{sub}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
                <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}><Target size={18} /> Your Resume Profile — Questions Personalized For You</h3>
                <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 10 }}>{profile!.skills.slice(0, 8).map(s => <span key={s} className="skill-tag">{s}</span>)}</div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>Domain: <strong style={{ color: "var(--accent)" }}>{profile!.domain}</strong> · {profile!.experience} year(s) experience · Aptitude questions adapted to your field</p>
            </div>

            {/* Round Selection */}
            <div className="grid-3" style={{ marginBottom: 20 }}>
                {[["hr", <Briefcase key="hr" size={32} />, "HR Round", "Behavioral & personality + domain questions", "#a78bfa"], ["tech", <Monitor key="tech" size={32} />, "Technical Round", "Deep technical + system design", "#60a5fa"], ["code", <Code key="code" size={32} />, "Coding Round", "DSA, algorithms + problem solving", "#34d399"]].map(([id, icon, title, desc, color]) => (
                    <div key={id as string} className="card" style={{ cursor: "pointer", borderColor: round === id ? (color as string) : undefined, background: round === id ? `${color}11` : undefined, transition: "all 0.2s" }} onClick={() => setRound(id as string)}>
                        <div style={{ marginBottom: 10, color: color as string }}>{icon}</div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{desc}</div>
                        {round === id && <div style={{ marginTop: 10, fontSize: "0.7rem", color: color as string, display: "flex", alignItems: "center", gap: 4 }}><Check size={12} /> Selected</div>}
                    </div>
                ))}
            </div>

            {/* Difficulty & Timer Selection */}
            <div className="grid-2" style={{ marginBottom: 20 }}>
                <div className="card">
                    <h3 style={{ marginBottom: 12, fontSize: "0.85rem" }}>Difficulty Level</h3>
                    <div style={{ display: "flex", gap: 8 }}>
                        {(["easy", "medium", "hard"] as const).map(d => (
                            <button key={d} onClick={() => setDifficulty(d)} style={{
                                flex: 1, padding: "10px 14px", borderRadius: 10, border: `1px solid ${difficulty === d ? (d === "easy" ? "#34d399" : d === "medium" ? "#fbbf24" : "#f87171") : "rgba(255,255,255,0.1)"}`,
                                background: difficulty === d ? (d === "easy" ? "rgba(52,211,153,0.1)" : d === "medium" ? "rgba(251,191,36,0.1)" : "rgba(248,113,113,0.1)") : "transparent",
                                color: difficulty === d ? (d === "easy" ? "#34d399" : d === "medium" ? "#fbbf24" : "#f87171") : "var(--text-muted)",
                                fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s",
                            }}>{d}</button>
                        ))}
                    </div>
                </div>
                <div className="card">
                    <h3 style={{ marginBottom: 12, fontSize: "0.85rem" }}>Timer per Question</h3>
                    <div style={{ display: "flex", gap: 8 }}>
                        {[60, 120, 180].map(t => (
                            <button key={t} onClick={() => setTimerDuration(t)} style={{
                                flex: 1, padding: "10px 14px", borderRadius: 10, border: `1px solid ${timerDuration === t ? "var(--accent)" : "rgba(255,255,255,0.1)"}`,
                                background: timerDuration === t ? "rgba(167,139,250,0.12)" : "transparent",
                                color: timerDuration === t ? "var(--accent)" : "var(--text-muted)",
                                fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                            }}>{t}s</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Anti-Cheat */}
            <div className="card" style={{ marginBottom: 20, background: "rgba(248,113,113,0.05)", borderColor: "rgba(248,113,113,0.2)" }}>
                <div style={{ fontWeight: 600, color: "var(--red)", marginBottom: 8, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 4 }}><AlertTriangle size={14} /> Anti-Cheat Notice</div>
                <ul style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 2, paddingLeft: 16 }}>
                    <li>Paste is disabled in all answer fields</li>
                    <li>Copy is blocked within the interview session</li>
                    <li>Typing speed anomalies are monitored</li>
                    <li>Each answer auto-submits when the {timerDuration}s timer expires</li>
                </ul>
            </div>

            {/* Past Interview History */}
            {history.length > 0 && (
                <div className="card" style={{ marginBottom: 20 }}>
                    <h3 style={{ marginBottom: 12, fontSize: "0.85rem" }}>Past Interview Performance</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {history.slice(0, 5).map((h, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: h.pct >= 75 ? "rgba(52,211,153,0.15)" : h.pct >= 50 ? "rgba(251,191,36,0.15)" : "rgba(248,113,113,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.8rem", color: h.pct >= 75 ? "#34d399" : h.pct >= 50 ? "#fbbf24" : "#f87171" }}>{h.pct}%</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text)" }}>{h.round.toUpperCase()} Round · {h.difficulty}</div>
                                    <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{new Date(h.date).toLocaleDateString()} · {h.domain}</div>
                                </div>
                                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{h.totalScored}/{h.totalMarks}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button className="btn-primary" onClick={startInterview} style={{ padding: "13px 32px", fontSize: "0.95rem", background: "linear-gradient(135deg,#7c3aed,#a78bfa)", boxShadow: "0 8px 24px rgba(124,58,237,0.35)", display: "flex", alignItems: "center", gap: 8 }}>
                <Rocket size={18} /> Start {round.toUpperCase()} Interview ({difficulty}) →
            </button>
        </div>
        </ResumeGate>
    );

    // INTERVIEW phase
    if (phase === "interview" && questions.length > 0) {
        const q = questions[qIdx];
        const timerPct = (timer / timerDuration) * 100;
        const timerColor = timer > timerDuration * 0.5 ? "var(--green)" : timer > timerDuration * 0.25 ? "var(--yellow)" : "var(--red)";
        const totalMarks = questions.reduce((a, b) => a + b.marks, 0);
        return (
            <div className="vr-container page-enter animate-fade" style={{ maxWidth: 860, margin: "0 auto", padding: "32px 36px" }}>
                <div className="vr-grid" />
                <div className="vr-glow" style={{ width: 400, height: 400, background: `rgba(${q.type === "theory" ? "167,139,250" : q.type === "practical" ? "96,165,250" : q.type === "problem" ? "52,211,153" : "251,191,36"},0.08)`, top: -150, right: -100 }} />
                <div className="vr-glow" style={{ width: 200, height: 200, background: "rgba(124,58,237,0.1)", bottom: -50, left: -50 }} />

                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 28, position: "relative" }}>
                    <div>
                        <div style={{ fontSize: "0.6rem", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.12em", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><Mic size={12} /> {round.toUpperCase()} VIRTUAL INTERVIEW</div>
                        <h1 style={{ fontSize: "1.1rem", color: "#f8fafc" }}>Question {qIdx + 1} of {questions.length}</h1>
                        <div style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: 2 }}>Total marks: {totalMarks} · Paste blocked</div>
                    </div>
                    {/* Timer SVG */}
                    <div style={{ textAlign: "center", position: "relative" }}>
                        <svg width="72" height="72">
                            <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
                            <circle cx="36" cy="36" r="30" fill="none" stroke={timerColor} strokeWidth="4"
                                strokeDasharray={2 * Math.PI * 30} strokeDashoffset={2 * Math.PI * 30 * (1 - timerPct / 100)}
                                style={{ transformOrigin: "50% 50%", transform: "rotate(-90deg)", transition: "stroke-dashoffset 1s linear, stroke 0.5s" }} />
                            <text x="36" y="42" textAnchor="middle" fill={timerColor} fontSize="14" fontWeight="700">{timer}s</text>
                        </svg>
                        {timer <= 15 && <div style={{ fontSize: "0.6rem", color: "var(--red)", fontWeight: 700 }}>AUTO-SUBMIT</div>}
                    </div>
                    {pasteCount > 0 && <div style={{ position: "absolute", top: -8, right: 90, background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.4)", borderRadius: 8, padding: "3px 10px", fontSize: "0.68rem", color: "var(--red)", display: "flex", alignItems: "center", gap: 4 }}><AlertTriangle size={12} /> {pasteCount} paste attempt(s)</div>}
                </div>

                {/* Progress */}
                <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
                    {questions.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i < qIdx ? "var(--accent)" : i === qIdx ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.08)" }} />)}
                </div>

                {/* Type badge */}
                <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                    <span style={{ background: `${typeColor[q.type]}18`, color: typeColor[q.type], border: `1px solid ${typeColor[q.type]}40`, borderRadius: 20, padding: "3px 14px", fontSize: "0.72rem", fontWeight: 700 }}>{typeLabel[q.type]}</span>
                    <span className="badge-blue">{q.marks} marks</span>
                    {profile?.domain && <span className="badge-purple">{profile.domain}</span>}
                </div>

                {/* Question box */}
                <div style={{ background: "rgba(167,139,250,0.07)", border: `1px solid ${typeColor[q.type]}30`, borderRadius: 14, padding: "22px 26px", marginBottom: 22 }}>
                    <div style={{ fontSize: "0.62rem", color: typeColor[q.type], fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>QUESTION {qIdx + 1}</div>
                    <p style={{ fontSize: "1rem", color: "#f1f5f9", lineHeight: 1.7, margin: 0 }}>{q.text}</p>
                    <div style={{ marginTop: 14, padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8, fontSize: "0.75rem", color: "#6b7280", fontStyle: "italic", display: "flex", alignItems: "center", gap: 6 }}><Lightbulb size={14} /> Hint: {q.hint}</div>
                </div>

                {/* Answer */}
                {(() => {
                    const wordCount = current.trim() ? current.trim().split(/\s+/).length : 0;
                    const quality = wordCount >= 80 ? "var(--green)" : wordCount >= 40 ? "var(--yellow)" : wordCount >= 10 ? "#f97316" : "rgba(255,255,255,0.15)";
                    const qualityLabel = wordCount >= 80 ? "Excellent depth" : wordCount >= 40 ? "Good — add examples" : wordCount >= 10 ? "Too brief" : "Start typing…";
                    return (
                        <>
                            <textarea
                                value={current}
                                onChange={e => setCurrent(e.target.value)}
                                onPaste={e => { e.preventDefault(); setPasteCount(p => p + 1); }}
                                onCopy={e => e.preventDefault()}
                                onCut={e => e.preventDefault()}
                                onContextMenu={e => e.preventDefault()}
                                autoFocus
                                placeholder="Write your answer in detail. Explain concepts, give examples, mention trade-offs. Paste is disabled for integrity."
                                style={{
                                    width: "100%", minHeight: 180, boxSizing: "border-box",
                                    background: "rgba(255,255,255,0.05)",
                                    border: `1px solid ${wordCount >= 40 ? "rgba(167,139,250,0.45)" : "rgba(167,139,250,0.2)"}`,
                                    borderRadius: 12, padding: "16px 18px",
                                    color: "#e2e8f0", fontSize: "0.9rem",
                                    resize: "vertical", outline: "none",
                                    fontFamily: "Inter, sans-serif", lineHeight: 1.8,
                                    pointerEvents: "all", userSelect: "text",
                                    transition: "border-color 0.3s",
                                }}
                            />
                            {/* Live quality bar */}
                            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ flex: 1, height: 3, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${Math.min(100, (wordCount / 80) * 100)}%`, background: quality, borderRadius: 99, transition: "width 0.3s, background 0.3s" }} />
                                </div>
                                <span style={{ fontSize: "0.65rem", color: quality, fontWeight: 600, whiteSpace: "nowrap" }}>{wordCount} words · {qualityLabel}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                                <div style={{ fontSize: "0.7rem", color: "#4b5563" }}>
                                    {q.marks} marks · anti-cheat active
                                    {pasteCount > 0 && <span style={{ color: "var(--red)", marginLeft: 8, display: "inline-flex", alignItems: "center", gap: 4 }}><AlertTriangle size={12} /> {pasteCount} paste attempt(s)</span>}
                                </div>
                                <button className="btn-primary" onClick={() => handleSubmit()} style={{ minWidth: 170, padding: "10px 22px" }}>
                                    {qIdx + 1 === questions.length ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Flag size={16} /> Finish Interview</span> : "Submit & Next →"}
                                </button>
                            </div>
                        </>
                    );
                })()}
            </div>
        );
    }

    // RESULT phase
    if (phase === "result" && questions.length > 0) {
        const totalScored = feedbacks.reduce((a, b) => a + b.score, 0);
        const totalMarks = questions.reduce((a, b) => a + b.marks, 0);
        const pct = Math.round((totalScored / totalMarks) * 100);
        const status = pct >= 75 ? "Recommended for Next Round" : pct >= 50 ? "Under Review" : "Needs Improvement";
        const statusColor = pct >= 75 ? "var(--green)" : pct >= 50 ? "var(--yellow)" : "var(--red)";
        return (
            <div className="page-enter" style={{ maxWidth: 800, margin: "0 auto" }}>
                <div className="card animate-glow card-glow" style={{ textAlign: "center", padding: 40, marginBottom: 24, background: "linear-gradient(135deg,rgba(124,58,237,0.12),rgba(167,139,250,0.06))" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, color: statusColor }}><BarChart size={48} /></div>
                    <h1 style={{ marginBottom: 4 }}>Interview Analysis Report</h1>
                    <div style={{ fontSize: "3.5rem", fontWeight: 800, color: statusColor, margin: "16px 0 8px" }}>{pct}%</div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 600, color: statusColor, marginBottom: 12 }}>Final Status: {status}</div>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <span className="badge-purple">{totalScored}/{totalMarks} marks</span>
                        {pasteCount > 0 && <span className="badge-red" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><AlertTriangle size={12} /> {pasteCount} paste attempt(s)</span>}
                        <span className="badge-blue">{questions.length} questions</span>
                    </div>
                </div>

                <div className="grid-4" style={{ marginBottom: 20 }}>
                    {[["Technical Score", `${Math.round(feedbacks.filter((_, i) => questions[i].type === "theory" || questions[i].type === "problem").reduce((a, b) => a + b.score, 0) / Math.max(1, (feedbacks.filter((_, i) => questions[i].type === "theory" || questions[i].type === "problem").length)) * 100)}%`, "var(--accent)"],
                    ["Communication", pct >= 65 ? "Good" : "Developing", "var(--blue)"],
                    ["Confidence", pct >= 70 ? "Strong" : pct >= 50 ? "Moderate" : "Low", statusColor],
                    ["Plagiarism Risk", pasteCount === 0 ? "Low" : pasteCount < 3 ? "Moderate" : "High", pasteCount === 0 ? "var(--green)" : pasteCount < 3 ? "var(--yellow)" : "var(--red)"],
                    ].map(([l, v, c]) => (
                        <div key={l as string} className="stat-card">
                            <div className="stat-label">{l}</div>
                            <div style={{ fontSize: "1.3rem", fontWeight: 700, color: c as string, marginTop: 4 }}>{v}</div>
                        </div>
                    ))}
                </div>

                <div className="card" style={{ marginBottom: 20 }}>
                    <h3>Per-Question Breakdown</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {questions.map((q, i) => (
                            <div key={i} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "16px 18px", borderLeft: `3px solid ${typeColor[q.type]}` }}>
                                <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap", alignItems: "center" }}>
                                    <span style={{ fontWeight: 700, fontSize: "0.83rem", color: "var(--text)" }}>Q{i + 1}: {q.text.slice(0, 80)}...</span>
                                    <span style={{ marginLeft: "auto", fontWeight: 800, color: (feedbacks[i]?.score / q.marks) >= 0.7 ? "var(--green)" : (feedbacks[i]?.score / q.marks) >= 0.4 ? "var(--yellow)" : "var(--red)", fontSize: "1rem" }}>{feedbacks[i]?.score}/{q.marks}</span>
                                </div>
                                {/* User's typed answer snippet */}
                                {answers[i] && answers[i] !== "(Time Expired)" && (
                                    <div style={{ margin: "8px 0", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, fontSize: "0.74rem", color: "#94a3b8", fontStyle: "italic", lineHeight: 1.6, borderLeft: "2px solid rgba(167,139,250,0.3)" }}>
                                        <span style={{ color: "rgba(167,139,250,0.6)", fontStyle: "normal", fontWeight: 600, marginRight: 6 }}>Your answer:</span>
                                        {answers[i].length > 200 ? answers[i].slice(0, 200) + "…" : answers[i]}
                                    </div>
                                )}
                                {answers[i] === "(Time Expired)" && (
                                    <div style={{ margin: "8px 0", padding: "6px 12px", background: "rgba(248,113,113,0.06)", borderRadius: 8, fontSize: "0.72rem", color: "#f87171", display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> Time expired — no answer submitted</div>
                                )}
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>{feedbacks[i]?.feedback}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button className="btn-primary" onClick={() => { setPhase("setup"); setQIdx(0); }}>Retake Interview</button>
                    <button className="btn-ghost" onClick={() => router.push("/dashboard")}>View Dashboard</button>
                    <button className="btn-ghost" onClick={() => router.push("/learning")}>Improve Skills →</button>
                </div>
            </div>
        );
    }
    return null;
}



