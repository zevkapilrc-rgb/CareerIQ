"use client";
import { useState, useRef, useEffect } from "react";
import { useAppStore, ResumeProfile } from "@/src/state/useAppStore";
import { useRouter } from "next/navigation";

// ─── Domain detection ───────────────────────────
const DOMAIN_MAP: Record<string, string[]> = {
    "Full-Stack Developer": ["react", "node", "express", "nextjs", "typescript", "javascript", "html", "css", "mongodb", "postgresql", "rest", "api", "frontend", "backend"],
    "AI/ML Engineer": ["python", "tensorflow", "pytorch", "scikit", "machine learning", "deep learning", "nlp", "langchain", "huggingface", "pandas", "numpy", "ml", "ai"],
    "Data Scientist": ["sql", "pandas", "numpy", "matplotlib", "seaborn", "r", "statistics", "data analysis", "jupyter", "tableau", "powerbi", "bigquery", "spark"],
    "DevOps Engineer": ["docker", "kubernetes", "aws", "gcp", "azure", "terraform", "ci/cd", "jenkins", "github actions", "linux", "bash", "ansible", "helm"],
    "Backend Developer": ["python", "java", "spring", "fastapi", "flask", "django", "nodejs", "go", "rust", "microservices", "kafka", "redis", "grpc"],
    "Mobile Developer": ["flutter", "react native", "ios", "android", "swift", "kotlin", "dart", "expo", "firebase"],
};

const CORE_SKILLS: Record<string, string[]> = {
    "Full-Stack Developer": ["html/css", "javascript", "react", "node.js"],
    "AI/ML Engineer": ["python", "machine learning", "data structures", "numpy"],
    "Data Scientist": ["sql", "python", "statistics", "data analysis"],
    "DevOps Engineer": ["linux", "docker", "ci/cd", "cloud (aws/gcp/azure)"],
    "Backend Developer": ["programming language", "database", "api design", "data structures"],
    "Mobile Developer": ["mobile framework", "javascript/dart", "ui design", "api integration"],
};

function detectDomain(text: string): string {
    const lower = text.toLowerCase();
    const scores: Record<string, number> = {};
    for (const [domain, keywords] of Object.entries(DOMAIN_MAP)) {
        scores[domain] = keywords.filter(k => lower.includes(k)).length;
    }
    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return best[1] > 0 ? best[0] : "";
}

function extractSkills(text: string): string[] {
    const all = Object.values(DOMAIN_MAP).flat();
    const lower = text.toLowerCase();
    const found = Array.from(new Set(all.filter(k => lower.includes(k.toLowerCase()))))
        .map(s => s.charAt(0).toUpperCase() + s.slice(1));
    return found.slice(0, 20);
}

function extractExperience(text: string): number {
    const match = text.match(/(\d+)\s*\+?\s*year/i);
    return match ? parseInt(match[1]) : 0;
}

function extractProjects(text: string): string[] {
    const lines = text.split("\n").filter(l => l.trim().length > 5);
    return lines.filter(l => /project|built|developed|created|implemented/i.test(l)).slice(0, 4).map(l => l.trim().slice(0, 60));
}

function calcXP(skills: string[], exp: number): number {
    return skills.length * 80 + exp * 200 + 300;
}

// ─── ATS Score Engine ─────────────────────────
interface ATSScore {
    total: number;
    keywords: number;
    formatting: number;
    experience: number;
    skills: number;
    tips: string[];
    careerRoadmap: string[];
}

const POWER_KEYWORDS = ["achieved", "built", "designed", "developed", "engineered", "implemented", "improved", "led", "managed", "optimized", "reduced", "scaled", "shipped", "launched", "increased", "deployed", "architected", "delivered", "created", "owned"];
const FORMAT_SIGNALS = ["experience", "education", "projects", "skills", "summary", "objective", "certifications", "achievements", "contact"];

function computeATS(text: string, skills: string[], exp: number, domain: string): ATSScore {
    const lower = text.toLowerCase();
    // Keywords score: power verbs + domain terms
    const kwHits = POWER_KEYWORDS.filter(w => lower.includes(w)).length;
    const keywords = Math.min(100, Math.round((kwHits / POWER_KEYWORDS.length) * 100) + 30);
    // Formatting score: section headers
    const fmtHits = FORMAT_SIGNALS.filter(s => lower.includes(s)).length;
    const formatting = Math.min(100, Math.round((fmtHits / FORMAT_SIGNALS.length) * 100) + 20);
    // Experience score
    const experience = Math.min(100, exp * 20 + 40);
    // Skills score
    const skillsScore = Math.min(100, skills.length * 6 + 30);
    const total = Math.round((keywords * 0.35 + formatting * 0.2 + experience * 0.2 + skillsScore * 0.25));

    const tips: string[] = [];
    if (keywords < 60) tips.push("Add more action verbs (e.g. 'Built', 'Led', 'Optimized') to make achievements stand out");
    if (formatting < 60) tips.push("Include clear section headers: Summary, Experience, Education, Skills, Projects");
    if (exp < 1) tips.push("Add internship, freelance, or personal project experience to strengthen your profile");
    if (skills.length < 6) tips.push("List at least 8–12 specific skills relevant to your target domain");
    if (total < 70) tips.push("Quantify achievements: use numbers (e.g. 'Improved API speed by 40%', 'Managed 5-person team')");
    if (!lower.includes("github") && !lower.includes("linkedin")) tips.push("Add GitHub & LinkedIn URLs — ATS systems reward verifiable online presence");
    if (tips.length === 0) tips.push("Great resume! Consider tailoring keywords to match each specific job description");

    const roadmap = domain ? [
        `Master ${domain} fundamentals via structured courses`,
        "Complete 3–5 end-to-end projects and push to GitHub",
        "Earn a relevant certification (AWS, Google, Microsoft, etc.)",
        "Contribute to open source or build a portfolio website",
        "Apply to internships / junior roles and iterate on feedback",
        "Build your LinkedIn network — engage with recruiters in your domain",
    ] : [
        "Identify your target domain and start a structured learning path",
        "Build and upload your resume to unlock personalized guidance",
    ];

    return { total, keywords, formatting, experience: experience, skills: skillsScore, tips, careerRoadmap: roadmap };
}

// ─── Question generation ───────────────────────
type QType = "theory" | "practical" | "problem" | "behavioral";
interface Question { id: number; text: string; type: QType; hint: string; }

function generateQuestions(profile: ResumeProfile): Question[] {
    const qs: Question[] = [];
    const skills = profile.skills.slice(0, 6);
    const domain = profile.domain;

    const theory: [string, string][] = [
        [`Explain the difference between ${skills[0] || "frontend"} and ${skills[1] || "backend"} development.`, "Cover architecture, responsibilities, and data flow"],
        [`What are the core principles of ${domain}? Name at least 3.`, "Think about fundamentals, design patterns, and best practices"],
        [`How does memory management work in ${skills[0] || "your primary language"}?`, "Cover garbage collection, stack/heap, references"],
        [`Describe the SOLID principles and how you apply them.`, "Name each principle with a real example"],
        [`What is the difference between REST and GraphQL APIs?`, "Cover structure, querying, pros and cons"],
    ];
    const practical: [string, string][] = [
        [`Walk me through a project where you used ${skills[0] || "your top skill"}. What challenges did you face?`, "Use STAR method: Situation, Task, Action, Result"],
        [`How would you optimise a slow ${domain} application?`, "Cover profiling, caching, database tuning, lazy loading"],
        [`You have a bug in production at 3AM. Walk me through your debugging process.`, "Cover logs, monitoring, rollback strategy"],
        [`Design a ${skills[0] || "scalable"} system that handles 1 million users.`, "Cover load balancing, caching, database sharding"],
    ];
    const problem: [string, string][] = [
        [`Given an array of integers, find the two numbers that sum to a target. Write pseudocode.`, "Consider time/space complexity. Optimal: O(n) with hash map"],
        [`How would you detect a cycle in a linked list using ${profile.skills.includes("Python") ? "Python" : "your language"}?`, "Floyd's cycle detection algorithm"],
        [`Reverse a string without using built-in reverse functions.`, "Consider a two-pointer approach"],
    ];
    const behavioral: [string, string][] = [
        [`Tell me about a time you disagreed with your team. How did you handle it?`, "Focus on communication, empathy, and outcome"],
        [`Describe your biggest technical failure and what you learned.`, "Show self-awareness and growth mindset"],
    ];

    // 40% theory (2), 30% practical (2), 20% problem (1), 10% behavioral (1) → 6 questions
    const pick = <T,>(arr: T[], n: number) => arr.sort(() => Math.random() - 0.5).slice(0, n);
    let id = 1;
    const add = (arr: [string, string][], type: QType, n: number) =>
        pick(arr, n).forEach(([text, hint]) => qs.push({ id: id++, text, type, hint }));

    add(theory, "theory", 2);
    add(practical, "practical", 2);
    add(problem, "problem", 1);
    add(behavioral, "behavioral", 1);

    return qs.sort(() => Math.random() - 0.5);
}

// ─── Scoring ──────────────────────────────────
function scoreAnswer(answer: string, question: Question, profile: ResumeProfile): number {
    if (!answer || answer.trim().length < 20) return Math.floor(Math.random() * 15) + 5; // very short = low
    const words = answer.trim().split(/\s+/).length;
    let score = 40; // base
    if (words > 30) score += 15;
    if (words > 80) score += 10;
    // keyword bonus
    const relevant = [...profile.skills, profile.domain.toLowerCase()].map(s => s.toLowerCase());
    const ansLower = answer.toLowerCase();
    const hits = relevant.filter(k => ansLower.includes(k)).length;
    score += Math.min(hits * 8, 25);
    // bonus for technical terms
    const techTerms = ["algorithm", "complexity", "o(n)", "database", "cache", "api", "async", "thread", "memory", "scalable", "microservice", "design pattern"];
    const techHits = techTerms.filter(t => ansLower.includes(t)).length;
    score += Math.min(techHits * 5, 15);
    return Math.min(95, Math.max(25, score + Math.floor(Math.random() * 8) - 4));
}

// ─── Main Component ───────────────────────────
type Module = "upload" | "processing" | "m1-result" | "m2-gate" | "m2-block" | "m3-interview" | "m3-result";

export default function ResumePage() {
    const { profile, setProfile, addXP, role } = useAppStore();
    const router = useRouter();

    // ── Guest guard — redirect to login ──
    useEffect(() => {
        if (role === "guest") {
            router.replace("/login");
        }
    }, [role, router]);

    const fileRef = useRef<HTMLInputElement>(null);
    const [mod, setMod] = useState<Module>("upload");
    const [rawText, setRawText] = useState("");
    const [extracted, setExtracted] = useState<Partial<ResumeProfile>>({});
    const [domain, setDomain] = useState("");
    const [missingCore, setMissingCore] = useState<string[]>([]);
    const [ats, setAts] = useState<ATSScore | null>(null);
    // Interview state
    const [questions, setQuestions] = useState<Question[]>([]);
    const [qIdx, setQIdx] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [timer, setTimer] = useState(120);
    const [timerActive, setTimerActive] = useState(false);
    const [scores, setScores] = useState<number[]>([]);
    const [pasteAttempts, setPasteAttempts] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Process file reading (simulate extraction for all formats)
    const handleFile = (file: File) => {
        const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", "image/png", "image/jpeg", "image/jpg", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "text/plain"];
        if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|docx|doc|png|jpg|jpeg|ppt|pptx|txt)$/i)) {
            alert("Unsupported format. Please upload PDF, DOCX, PNG, JPG, PPT, or TXT.");
            return;
        }
        setMod("processing");
        // Simulate extraction (in production, send to backend)
        setTimeout(() => {
            // For demo: generate realistic mock data based on filename patterns
            const demoText = `
        John Doe | Full-Stack Developer | 3 years experience
        Skills: React, TypeScript, Node.js, Express, PostgreSQL, Redis, Docker, Python
        Projects: E-Commerce Platform (React+Node), REST API for FinTech startup, Real-time Chat App
        Education: B.Tech Computer Science
        Experience: 3 years building web applications
      `;
            const text = demoText; // In prod: extracted from actual file
            const skills = extractSkills(text);
            const exp = extractExperience(text);
            const dom = detectDomain(text);
            const projects = extractProjects(text);
            const xp = calcXP(skills, exp);
            const atsScore = computeATS(text, skills, exp, dom || "Full-Stack Developer");
            setRawText(text);
            setDomain(dom || "Full-Stack Developer");
            setExtracted({ skills, experience: exp, domain: dom || "Full-Stack Developer", projects, xp, name: profile?.name || "User", education: "B.Tech Computer Science", level: "Specialist" });
            setAts(atsScore);
            setMod("m1-result");
        }, 2500);
    };

    const handleM2Check = () => {
        const core = CORE_SKILLS[domain] || [];
        const skillsLower = (extracted.skills || []).map(s => s.toLowerCase());
        const missing = core.filter(c => !skillsLower.some(s => s.includes(c.toLowerCase().split("/")[0])));
        setMissingCore(missing);
        if (missing.length > 0) {
            setMod("m2-block");
        } else {
            // Set profile and proceed
            const fullProfile: ResumeProfile = { name: profile?.name || "User", ...extracted, level: "Specialist" } as ResumeProfile;
            setProfile(fullProfile);
            const qs = generateQuestions(fullProfile);
            setQuestions(qs);
            setMod("m3-interview");
            startTimer();
        }
    };

    const startTimer = () => {
        setTimer(120); setTimerActive(true); setQIdx(0); setAnswers([]); setCurrentAnswer(""); setScores([]);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setTimer(t => { if (t <= 1) { autoSubmit(); return 120; } return t - 1; }), 1000);
    };

    const autoSubmit = () => {
        submitCurrent();
    };

    const submitCurrent = () => {
        if (!profile && !extracted.skills) return;
        const mockProfile = { ...extracted, name: profile?.name || "User" } as ResumeProfile;
        const s = scoreAnswer(currentAnswer, questions[qIdx], profile || mockProfile);
        const newScores = [...scores, s];
        const newAnswers = [...answers, currentAnswer];
        setScores(newScores);
        setAnswers(newAnswers);
        setCurrentAnswer("");
        setTimer(120);
        if (qIdx + 1 >= questions.length) {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimerActive(false);
            setMod("m3-result");
            const avg = newScores.reduce((a, b) => a + b, 0) / newScores.length;
            addXP(Math.round(avg * 2), "Interview completed");
        } else {
            setQIdx(i => i + 1);
        }
    };

    const blockPaste = (e: React.ClipboardEvent) => { e.preventDefault(); setPasteAttempts(p => p + 1); };

    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    const typeColor: Record<QType, string> = { theory: "#a78bfa", practical: "#60a5fa", problem: "#34d399", behavioral: "#fbbf24" };
    const typeLabel: Record<QType, string> = { theory: "Core Theory", practical: "Practical", problem: "Problem Solving", behavioral: "Behavioral" };

    // ── Guest loading state (redirect in progress) ──
    if (role === "guest") return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid rgba(167,139,250,0.3)", borderTopColor: "#a78bfa", animation: "spin 1s linear infinite" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Redirecting to login…</p>
        </div>
    );

    // ── Upload screen ──
    if (mod === "upload") return (
        <div className="page-enter" style={{ maxWidth: 700, margin: "0 auto" }}>
            <h1 style={{ marginBottom: 4 }}>Resume Intelligence</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 32 }}>AI-powered 3-module pipeline: Extract → Validate → Interview</p>

            {/* Pipeline overview */}
            <div className="grid-3" style={{ marginBottom: 28 }}>
                {[["🔵", "Module 1", "Resume Intake", "Extract skills, experience & domain"], ["🟡", "Module 2", "Validation Gate", "Check domain readiness & core skills"], ["🟢", "Module 3", "Interview", "AI questions from your resume"]].map(([icon, m, t, d]) => (
                    <div key={m as string} className="card" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>{icon}</div>
                        <div style={{ fontSize: "0.65rem", color: "var(--accent)", fontWeight: 600, marginBottom: 4 }}>{m}</div>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: 4 }}>{t}</div>
                        <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>{d}</div>
                    </div>
                ))}
            </div>

            {/* Upload */}
            <div className="card" style={{ textAlign: "center", padding: 48, borderStyle: "dashed", borderColor: "rgba(167,139,250,0.3)", cursor: "pointer", background: "rgba(167,139,250,0.03)" }}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }} className="animate-float">📤</div>
                <h2 style={{ marginBottom: 8 }}>Upload Your Resume</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: 20 }}>Drag & drop or click to browse</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
                    {["PDF", "DOCX", "DOC", "PNG", "JPG", "PPT", "PPTX", "TXT"].map(f => <span key={f} className="badge-purple">{f}</span>)}
                </div>
                <button className="btn-primary" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>Choose File</button>
                <input ref={fileRef} type="file" style={{ display: "none" }} accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.ppt,.pptx,.txt,image/*,application/pdf" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
        </div>
    );

    // ── Processing ──
    if (mod === "processing") return (
        <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center" }} className="page-enter">
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 24px", animation: "spin 2s linear infinite" }}>🧠</div>
            <h2 style={{ marginBottom: 8 }}>Analyzing Your Resume</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 28 }}>Running AI pipeline: extraction → normalization → domain detection</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Extracting text & structure...", "Normalizing skill names...", "Detecting domain..."].map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--surface)", borderRadius: 10, padding: "10px 16px", animation: `fadeIn 0.4s ${i * 0.5}s forwards`, opacity: 0 }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
                        <span style={{ fontSize: "0.82rem", color: "var(--text-sub)" }}>{s}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    // ── Module 1 Result ──
    if (mod === "m1-result") return (
        <div className="page-enter" style={{ maxWidth: 740, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <div className="badge-blue">🔵 Module 1 Complete</div>
                <h1 style={{ fontSize: "1.2rem" }}>Resume Analysed</h1>
            </div>

            {/* ── ATS Score Card ── */}
            {ats && (
                <div className="card liquid-glass" style={{ marginBottom: 20, borderColor: ats.total >= 70 ? "rgba(86,227,160,0.3)" : ats.total >= 50 ? "rgba(246,201,78,0.3)" : "rgba(248,113,113,0.3)", background: ats.total >= 70 ? "rgba(86,227,160,0.04)" : ats.total >= 50 ? "rgba(246,201,78,0.04)" : "rgba(248,113,113,0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
                        <div>
                            <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>ATS SCORE</div>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                                <span style={{ fontSize: "3rem", fontWeight: 900, color: ats.total >= 70 ? "var(--green)" : ats.total >= 50 ? "var(--yellow)" : "var(--red)", lineHeight: 1 }}>{ats.total}</span>
                                <span style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>/100</span>
                            </div>
                            <div style={{ fontSize: "0.78rem", fontWeight: 600, color: ats.total >= 70 ? "var(--green)" : ats.total >= 50 ? "var(--yellow)" : "var(--red)", marginTop: 4 }}>
                                {ats.total >= 80 ? "🥇 Excellent — ATS Optimised" : ats.total >= 65 ? "✅ Good — Minor improvements needed" : ats.total >= 50 ? "⚠️ Fair — Several areas need work" : "❌ Needs Major Improvement"}
                            </div>
                        </div>
                        {/* Gauge */}
                        <svg width={90} height={90}>
                            <circle cx={45} cy={45} r={38} fill="none" stroke="rgba(163,119,157,0.12)" strokeWidth={8} />
                            <circle cx={45} cy={45} r={38} fill="none" stroke={ats.total >= 70 ? "#56e3a0" : ats.total >= 50 ? "#f6c94e" : "#f87171"} strokeWidth={8}
                                strokeDasharray={2 * Math.PI * 38} strokeDashoffset={2 * Math.PI * 38 * (1 - ats.total / 100)}
                                strokeLinecap="round" transform="rotate(-90 45 45)" style={{ transition: "stroke-dashoffset 1s ease" }} />
                            <text x={45} y={50} textAnchor="middle" fill="#f0e8ff" fontSize={14} fontWeight={800}>{ats.total}%</text>
                        </svg>
                    </div>

                    {/* Sub-scores */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                        {([
                            ["🔑 Keywords", ats.keywords, "Action verbs & domain terms"],
                            ["📄 Formatting", ats.formatting, "Section headers & structure"],
                            ["🏆 Experience", ats.experience, "Years & quality of experience"],
                            ["🛠️ Skills", ats.skills, "Skill variety & relevance"],
                        ] as [string, number, string][]).map(([label, score, desc]) => (
                            <div key={label} style={{ background: "rgba(102,51,153,0.08)", borderRadius: 10, padding: "10px 12px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text)" }}>{label}</span>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: score >= 70 ? "var(--green)" : score >= 50 ? "var(--yellow)" : "var(--red)" }}>{score}%</span>
                                </div>
                                <div className="progress-track" style={{ height: 5 }}>
                                    <div className="progress-fill" style={{ width: `${score}%`, background: score >= 70 ? "var(--green)" : score >= 50 ? "var(--yellow)" : "var(--red)" }} />
                                </div>
                                <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", marginTop: 4 }}>{desc}</div>
                            </div>
                        ))}
                    </div>

                    {/* Improvement Tips */}
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--accent)", marginBottom: 8, letterSpacing: "0.06em" }}>💡 HOW TO IMPROVE YOUR RESUME</div>
                        {ats.tips.map((tip, i) => (
                            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, background: "rgba(102,51,153,0.07)", borderRadius: 8, padding: "8px 12px" }}>
                                <span style={{ color: "var(--accent)", flexShrink: 0 }}>→</span>
                                <span style={{ fontSize: "0.78rem", color: "var(--text-sub)", lineHeight: 1.5 }}>{tip}</span>
                            </div>
                        ))}
                    </div>

                    {/* Career Roadmap */}
                    <div style={{ borderTop: "1px solid rgba(163,119,157,0.12)", paddingTop: 14 }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--green)", marginBottom: 8, letterSpacing: "0.06em" }}>🗺️ CAREER ROADMAP FOR {(domain || "YOUR DOMAIN").toUpperCase()}</div>
                        {ats.careerRoadmap.map((step, i) => (
                            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6, alignItems: "flex-start" }}>
                                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#663399,#9b59b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 800, color: "white", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                                <span style={{ fontSize: "0.78rem", color: "var(--text-sub)", lineHeight: 1.6 }}>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid-2 stagger" style={{ marginBottom: 20 }}>
                <div className="card">
                    <h3>Detected Domain</h3>
                    <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>{domain || "—"}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <span className="badge-green">✓ Detected</span>
                        <span className="badge-blue">{extracted.experience || 0} Years Exp</span>
                    </div>
                </div>
                <div className="card">
                    <h3>XP Earned</h3>
                    <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--green)", marginBottom: 8 }}>+{extracted.xp} XP</div>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>From {extracted.skills?.length} skills + {extracted.experience}y exp</p>
                </div>
            </div>
            <div className="card" style={{ marginBottom: 20 }}>
                <h3>Extracted Skills ({extracted.skills?.length})</h3>
                <div style={{ display: "flex", flexWrap: "wrap" }}>{extracted.skills?.map(s => <span key={s} className="skill-tag">{s}</span>)}</div>
            </div>
            {extracted.projects && extracted.projects.length > 0 && (
                <div className="card" style={{ marginBottom: 20 }}>
                    <h3>Detected Projects</h3>
                    {extracted.projects.map((p, i) => <div key={i} style={{ fontSize: "0.82rem", color: "var(--text-sub)", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>📦 {p}</div>)}
                </div>
            )}
            <div style={{ display: "flex", gap: 12 }}>
                <button className="btn-primary" onClick={handleM2Check}>Proceed to Module 2 →</button>
                <button className="btn-ghost" onClick={() => setMod("upload")}>Re-upload</button>
            </div>
        </div>
    );

    // ── Module 2 Block ──
    if (mod === "m2-block") return (
        <div className="page-enter" style={{ maxWidth: 600, margin: "0 auto" }}>
            <div className="card" style={{ background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.3)", textAlign: "center", padding: 32, marginBottom: 20 }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🚫</div>
                <h2 style={{ color: "var(--red)", marginBottom: 8 }}>Domain Not Ready for Interview</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Missing core skills required for <strong style={{ color: "var(--text)" }}>{domain}</strong>. Complete your learning plan first.</p>
            </div>
            <div className="card" style={{ marginBottom: 20 }}>
                <h3>Missing Core Skills</h3>
                {missingCore.map(s => (
                    <div key={s} style={{ padding: "10px 14px", background: "rgba(248,113,113,0.06)", borderRadius: 8, marginBottom: 8, display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ color: "var(--red)" }}>⚠</span>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text)" }}>{s}</div>
                            <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>Required for {domain}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="card" style={{ background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.2)" }}>
                <h3>💡 Learning Plan</h3>
                <div style={{ color: "var(--accent)", fontStyle: "italic", fontSize: "0.82rem", marginBottom: 12 }}>"Strong fundamentals create strong engineers."</div>
                {missingCore.map(s => <div key={s} style={{ fontSize: "0.8rem", color: "var(--text-sub)", padding: "4px 0" }}>→ Study: <strong style={{ color: "var(--text)" }}>{s}</strong> fundamentals & practice exercises</div>)}
                <div style={{ marginTop: 16 }}>
                    <button className="btn-primary" onClick={() => router.push("/learning")}>Go to Learning Path →</button>
                </div>
            </div>
        </div>
    );

    // ── Module 3 Interview ──
    if (mod === "m3-interview" && questions.length > 0) {
        const q = questions[qIdx];
        const timerPct = (timer / 120) * 100;
        const timerColor = timer > 60 ? "var(--green)" : timer > 30 ? "var(--yellow)" : "var(--red)";
        return (
            <div className="page-enter vr-container" style={{ maxWidth: 800, margin: "0 auto", padding: 32 }}>
                <div className="vr-grid" />
                <div className="vr-glow" style={{ width: 300, height: 300, background: "rgba(124,58,237,0.15)", top: -100, right: -100 }} />
                <div className="vr-glow" style={{ width: 200, height: 200, background: "rgba(167,139,250,0.1)", bottom: -50, left: -50 }} />

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, position: "relative" }}>
                    <div>
                        <div style={{ fontSize: "0.65rem", color: "var(--accent)", fontWeight: 600, letterSpacing: "0.1em", marginBottom: 4 }}>🎤 VIRTUAL INTERVIEW SESSION</div>
                        <h2 style={{ color: "#f1f5f9", margin: 0 }}>Question {qIdx + 1} / {questions.length}</h2>
                    </div>
                    {/* Timer */}
                    <div style={{ textAlign: "center" }}>
                        <svg width="64" height="64">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                            <circle cx="32" cy="32" r="28" fill="none" stroke={timerColor} strokeWidth="4"
                                strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * (1 - timerPct / 100)}
                                className="timer-ring" style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }} />
                            <text x="32" y="37" textAnchor="middle" fill={timerColor} fontSize="13" fontWeight="700">{timer}s</text>
                        </svg>
                    </div>
                    {/* Anti-cheat */}
                    {pasteAttempts > 0 && <div style={{ position: "absolute", top: -10, right: -10, background: "rgba(248,113,113,0.2)", border: "1px solid rgba(248,113,113,0.4)", borderRadius: 8, padding: "4px 10px", fontSize: "0.7rem", color: "var(--red)" }}>⚠ {pasteAttempts} paste attempt(s) flagged</div>}
                </div>

                {/* Progress */}
                <div className="progress-track" style={{ marginBottom: 24 }}>
                    <div className="progress-fill" style={{ width: `${(qIdx / questions.length) * 100}%` }} />
                </div>

                {/* Type badge */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <span style={{ background: `${typeColor[q.type]}22`, color: typeColor[q.type], border: `1px solid ${typeColor[q.type]}44`, borderRadius: 20, padding: "3px 12px", fontSize: "0.72rem", fontWeight: 600 }}>{typeLabel[q.type]}</span>
                    <span className="badge-purple">Resume-Based</span>
                </div>

                {/* Question */}
                <div style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 14, padding: "20px 24px", marginBottom: 20 }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--accent)", marginBottom: 10, fontWeight: 600 }}>QUESTION {qIdx + 1}</div>
                    <p style={{ fontSize: "1rem", color: "#f1f5f9", lineHeight: 1.6, margin: 0 }}>{q.text}</p>
                    <div style={{ marginTop: 12, fontSize: "0.75rem", color: "#6b7280", fontStyle: "italic" }}>💡 Hint: {q.hint}</div>
                </div>

                {/* Answer */}
                <textarea
                    value={currentAnswer}
                    onChange={e => setCurrentAnswer(e.target.value)}
                    onPaste={blockPaste}
                    onCopy={e => e.preventDefault()}
                    onCut={e => e.preventDefault()}
                    placeholder="Type your answer here (paste disabled for integrity)..."
                    style={{ width: "100%", minHeight: 140, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 12, padding: "14px 18px", color: "#e2e8f0", fontSize: "0.88rem", resize: "vertical", outline: "none", fontFamily: "inherit" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                    <div style={{ fontSize: "0.73rem", color: "#6b7280" }}>{currentAnswer.split(/\s+/).filter(Boolean).length} words · typing monitored for integrity</div>
                    <button className="btn-primary" onClick={submitCurrent} style={{ minWidth: 140 }}>
                        {qIdx + 1 === questions.length ? "Finish Interview →" : "Submit & Next →"}
                    </button>
                </div>
            </div>
        );
    }

    // ── Module 3 Result ──
    if (mod === "m3-result") {
        const techScore = scores.filter((_, i) => questions[i]?.type === "theory" || questions[i]?.type === "problem").reduce((a, b, _, arr) => a + b / arr.length, 0);
        const status = avgScore >= 70 ? "Recommended for Next Round" : avgScore >= 50 ? "Under Review" : "Needs Improvement";
        const statusColor = avgScore >= 70 ? "var(--green)" : avgScore >= 50 ? "var(--yellow)" : "var(--red)";
        return (
            <div className="page-enter" style={{ maxWidth: 700, margin: "0 auto" }}>
                <div className="card card-glow animate-glow" style={{ textAlign: "center", padding: 36, marginBottom: 20, background: "linear-gradient(135deg,rgba(124,58,237,0.12),rgba(167,139,250,0.06))" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📊</div>
                    <h1 style={{ marginBottom: 4 }}>Interview Complete!</h1>
                    <div style={{ fontSize: "3rem", fontWeight: 800, color: statusColor, margin: "12px 0" }}>{avgScore}%</div>
                    <div style={{ fontSize: "1rem", fontWeight: 600, color: statusColor, marginBottom: 8 }}>Final Status: {status}</div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Based on {questions.length} questions across all domains</p>
                    {pasteAttempts > 0 && <div style={{ marginTop: 12 }} className="badge-red">⚠ {pasteAttempts} Paste Attempt(s) — Flagged for Review</div>}
                </div>

                <div className="grid-2 stagger" style={{ marginBottom: 20 }}>
                    {[
                        ["Technical Score", `${Math.round(techScore)}%`, "var(--accent)"],
                        ["Communication", avgScore >= 60 ? "Good" : "Developing", "var(--blue)"],
                        ["Interview Score", `${avgScore}%`, statusColor],
                        ["Plagiarism Risk", pasteAttempts === 0 ? "Low" : "Moderate", pasteAttempts === 0 ? "var(--green)" : "var(--yellow)"],
                    ].map(([l, v, c]) => (
                        <div key={l as string} className="stat-card">
                            <div className="stat-label">{l}</div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: c as string }}>{v}</div>
                        </div>
                    ))}
                </div>

                <div className="card" style={{ marginBottom: 20 }}>
                    <h3>Per-Question Breakdown</h3>
                    {questions.map((q, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < questions.length - 1 ? "1px solid var(--border)" : "none" }}>
                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${typeColor[q.type]}22`, border: `1px solid ${typeColor[q.type]}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: typeColor[q.type], fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "0.8rem", color: "var(--text)" }}>{q.text.slice(0, 60)}...</div>
                                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                    <span style={{ fontSize: "0.7rem", color: typeColor[q.type] }}>{typeLabel[q.type]}</span>
                                    <span style={{ fontSize: "0.7rem", color: scores[i] >= 70 ? "var(--green)" : scores[i] >= 50 ? "var(--yellow)" : "var(--red)", fontWeight: 600 }}>Score: {scores[i]}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                    <button className="btn-primary" onClick={() => { setMod("upload"); setQIdx(0); setScores([]); }}>Take Another Interview</button>
                    <button className="btn-ghost" onClick={() => router.push("/dashboard")}>View Dashboard</button>
                </div>
            </div>
        );
    }

    return null;
}



