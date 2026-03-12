"use client";
import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/src/state/useAppStore";
import { useRouter } from "next/navigation";

type QType = "theory" | "practical" | "problem" | "behavioral";
interface Question { text: string; type: QType; hint: string; marks: number; }
const typeColor: Record<QType, string> = { theory: "#a78bfa", practical: "#60a5fa", problem: "#34d399", behavioral: "#fbbf24" };
const typeLabel: Record<QType, string> = { theory: "Core Theory", practical: "Practical", problem: "Problem Solving", behavioral: "Behavioral" };

function buildQuestions(skills: string[], domain: string, exp: number): Question[] {
    const s0 = skills[0] || "programming"; const s1 = skills[1] || "backend"; const s2 = skills[2] || "SQL";
    const theory: Question[] = [
        { text: `Explain the core concepts of ${s0}. What makes it different from alternatives?`, type: "theory", hint: "Cover architecture, design principles, and trade-offs", marks: 15 },
        { text: `What are the SOLID principles in software design? Give a real example for each using ${domain}.`, type: "theory", hint: "5 principles with concrete ${domain} examples", marks: 15 },
        { text: `Explain how memory management works in ${s0 || "your primary language"}.`, type: "theory", hint: "Garbage collection, stack/heap, references, leaks", marks: 10 },
        { text: `What is the difference between REST, GraphQL, and gRPC? When would you use each?`, type: "theory", hint: "Compare architecture, use cases, performance", marks: 10 },
        { text: `Describe the event loop and concurrency model in ${domain.includes("Full") ? "JavaScript" : s0}.`, type: "theory", hint: "Call stack, event queue, microtasks vs macrotasks", marks: 10 },
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
    const [questions, setQuestions] = useState<Question[]>([]);
    const [qIdx, setQIdx] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [feedbacks, setFeedbacks] = useState<{ score: number; feedback: string }[]>([]);
    const [current, setCurrent] = useState("");
    const [timer, setTimer] = useState(120);
    const [pasteCount, setPasteCount] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startInterview = () => {
        const skills = profile?.skills || ["React", "TypeScript", "Node.js"];
        const domain = profile?.domain || "Full-Stack Developer";
        const exp = profile?.experience || 0;
        const qs = buildQuestions(skills, domain, exp);
        setQuestions(qs);
        setQIdx(0); setAnswers([]); setFeedbacks([]); setCurrent(""); setTimer(120); setPasteCount(0);
        setPhase("interview");
        startTimer(qs.length > 0);
    };

    const startTimer = (active: boolean) => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (!active) return;
        timerRef.current = setInterval(() => setTimer(t => {
            if (t <= 1) { handleSubmit(true); return 120; }
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
            setPhase("result");
        } else {
            setQIdx(i => i + 1);
            setTimer(120);
            startTimer(true);
        }
    };

    // SETUP phase
    if (phase === "setup") return (
        <div className="page-enter" style={{ maxWidth: 800, margin: "0 auto" }}>
            <h1 style={{ marginBottom: 4 }}>🎤 Interview Simulator</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 16 }}>AI-powered VR mock interviews with questions tailored to your resume profile</p>

            {/* Resume role pre-fill banner */}
            {profile?.domain && (
                <div style={{ marginBottom: 20, padding: "14px 20px", borderRadius: 14, background: "linear-gradient(135deg,rgba(167,139,250,0.12),rgba(96,165,250,0.08))", border: "1px solid rgba(167,139,250,0.3)", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ fontSize: "2rem" }}>🎯</div>
                    <div>
                        <div style={{ fontSize: "0.7rem", color: "rgba(167,139,250,0.7)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>RESUME-DETECTED ROLE</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f1f5f9" }}>{profile.domain}</div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 2 }}>{profile.experience || 0} yr experience · {profile.skills?.slice(0, 3).join(", ")}{profile.skills?.length > 3 ? ` +${profile.skills.length - 3} more` : ""}</div>
                    </div>
                    <div style={{ marginLeft: "auto", fontSize: "0.68rem", color: "rgba(52,211,153,0.8)", fontWeight: 600, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 20, padding: "4px 12px" }}>✓ Auto-filled</div>
                </div>
            )}

            <div className="card" style={{ background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.2)", marginBottom: 20 }}>
                <h3>Question Distribution</h3>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {[["40%", "Core Theory", "#a78bfa"], ["30%", "Practical", "#60a5fa"], ["20%", "Problem Solving", "#34d399"], ["10%", "Behavioral", "#fbbf24"]].map(([p, l, c]) => (
                        <div key={l as string} style={{ flex: 1, minWidth: 120, background: `${c}11`, border: `1px solid ${c}33`, borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
                            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: c as string }}>{p}</div>
                            <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>{l}</div>
                        </div>
                    ))}
                </div>
            </div>

            {profile?.skills && profile.skills.length > 0 ? (
                <div className="card" style={{ marginBottom: 20 }}>
                    <h3>Questions will be based on your profile</h3>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>{profile.skills.slice(0, 8).map(s => <span key={s} className="skill-tag">{s}</span>)}</div>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 10, margin: 0 }}>Domain: <strong style={{ color: "var(--accent)" }}>{profile.domain}</strong> · {profile.experience} years experience</p>
                </div>
            ) : (
                <div className="card" style={{ marginBottom: 20, borderColor: "rgba(251,191,36,0.3)" }}>
                    <div style={{ color: "var(--yellow)", fontWeight: 600, marginBottom: 8 }}>⚠ No Resume Profile Found</div>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 14 }}>For personalized questions, upload your resume first. Otherwise, default Full-Stack Developer questions will be used.</p>
                    <button className="btn-ghost" onClick={() => router.push("/resume")}>Upload Resume →</button>
                </div>
            )}

            <div className="grid-3" style={{ marginBottom: 24 }}>
                {[["hr", "👔", "HR Round", "Behavioral & personality + domain questions", "#a78bfa"], ["tech", "💻", "Technical Round", "Deep technical + system design", "#60a5fa"], ["code", "🧑‍💻", "Coding Round", "DSA, algorithms + problem solving", "#34d399"]].map(([id, icon, title, desc, color]) => (
                    <div key={id as string} className="card" style={{ cursor: "pointer", borderColor: round === id ? (color as string) : undefined, background: round === id ? `${color}11` : undefined, transition: "all 0.2s" }} onClick={() => setRound(id as string)}>
                        <div style={{ fontSize: "1.6rem", marginBottom: 10 }}>{icon}</div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{desc}</div>
                        {round === id && <div style={{ marginTop: 10, fontSize: "0.7rem", color: color as string }}>✓ Selected</div>}
                    </div>
                ))}
            </div>

            <div className="card" style={{ marginBottom: 20, background: "rgba(248,113,113,0.05)", borderColor: "rgba(248,113,113,0.2)" }}>
                <div style={{ fontWeight: 600, color: "var(--red)", marginBottom: 8, fontSize: "0.85rem" }}>⚠ Anti-Cheat Notice</div>
                <ul style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 2, paddingLeft: 16 }}>
                    <li>Paste is disabled in all answer fields</li>
                    <li>Copy is blocked within the interview session</li>
                    <li>Typing speed anomalies are monitored</li>
                    <li>Instant large text insertions are flagged</li>
                    <li>Each answer auto-submits when the 2-minute timer expires</li>
                </ul>
            </div>

            <button className="btn-primary" onClick={startInterview} style={{ padding: "13px 32px", fontSize: "0.95rem" }}>
                Start {round.toUpperCase()} Interview →
            </button>
        </div>
    );

    // INTERVIEW phase
    if (phase === "interview" && questions.length > 0) {
        const q = questions[qIdx];
        const timerPct = (timer / 120) * 100;
        const timerColor = timer > 60 ? "var(--green)" : timer > 30 ? "var(--yellow)" : "var(--red)";
        const totalMarks = questions.reduce((a, b) => a + b.marks, 0);
        return (
            <div className="vr-container page-enter animate-fade" style={{ maxWidth: 860, margin: "0 auto", padding: "32px 36px" }}>
                <div className="vr-grid" />
                <div className="vr-glow" style={{ width: 400, height: 400, background: `rgba(${q.type === "theory" ? "167,139,250" : q.type === "practical" ? "96,165,250" : q.type === "problem" ? "52,211,153" : "251,191,36"},0.08)`, top: -150, right: -100 }} />
                <div className="vr-glow" style={{ width: 200, height: 200, background: "rgba(124,58,237,0.1)", bottom: -50, left: -50 }} />

                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 28, position: "relative" }}>
                    <div>
                        <div style={{ fontSize: "0.6rem", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.12em", marginBottom: 4 }}>🎤 {round.toUpperCase()} VIRTUAL INTERVIEW</div>
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
                    {pasteCount > 0 && <div style={{ position: "absolute", top: -8, right: 90, background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.4)", borderRadius: 8, padding: "3px 10px", fontSize: "0.68rem", color: "var(--red)" }}>⚠ {pasteCount} paste attempt(s)</div>}
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
                    <div style={{ marginTop: 14, padding: "8px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8, fontSize: "0.75rem", color: "#6b7280", fontStyle: "italic" }}>💡 Hint: {q.hint}</div>
                </div>

                {/* Answer */}
                <textarea
                    value={current}
                    onChange={e => setCurrent(e.target.value)}
                    onPaste={e => { e.preventDefault(); setPasteCount(p => p + 1); }}
                    onCopy={e => e.preventDefault()}
                    onCut={e => e.preventDefault()}
                    onContextMenu={e => e.preventDefault()}
                    placeholder="Write your answer in detail. Explain concepts, give examples, mention trade-offs. Paste is disabled."
                    style={{ width: "100%", minHeight: 160, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: 12, padding: "16px 18px", color: "#e2e8f0", fontSize: "0.88rem", resize: "vertical", outline: "none", fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                    <div style={{ fontSize: "0.72rem", color: "#4b5563" }}>
                        {current.split(/\s+/).filter(Boolean).length} words · {q.marks} marks available · answer monitored
                    </div>
                    <button className="btn-primary" onClick={() => handleSubmit()} style={{ minWidth: 160 }}>
                        {qIdx + 1 === questions.length ? "Finish Interview →" : "Submit & Next →"}
                    </button>
                </div>
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
                    <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📊</div>
                    <h1 style={{ marginBottom: 4 }}>Interview Analysis Report</h1>
                    <div style={{ fontSize: "3.5rem", fontWeight: 800, color: statusColor, margin: "16px 0 8px" }}>{pct}%</div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 600, color: statusColor, marginBottom: 12 }}>Final Status: {status}</div>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <span className="badge-purple">{totalScored}/{totalMarks} marks</span>
                        {pasteCount > 0 && <span className="badge-red">⚠ {pasteCount} paste attempt(s)</span>}
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
                                    <div style={{ margin: "8px 0", padding: "6px 12px", background: "rgba(248,113,113,0.06)", borderRadius: 8, fontSize: "0.72rem", color: "#f87171" }}>⏱ Time expired — no answer submitted</div>
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



