"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "../../state/useAppStore";
import { Mic, Check, ClipboardList, Loader2, Rocket, Clock, ArrowRight, PartyPopper, RefreshCw, RotateCcw } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8000");

// Randomised question bank – questions chosen based on role
const QUESTION_BANK: Record<string, string[]> = {
  default: [
    "Tell me about yourself and your background.",
    "What are your greatest professional strengths?",
    "Describe a challenge you've faced at work and how you overcame it.",
    "Where do you see yourself in 5 years?",
    "Why are you interested in this role?",
    "How do you handle tight deadlines and pressure?",
    "Give an example of a time you demonstrated leadership.",
    "What motivates you in your career?",
    "Describe a time you worked effectively in a team.",
    "What is your biggest weakness and how are you working on it?",
  ],
  "Frontend Engineer": [
    "Explain the difference between `useEffect` and `useLayoutEffect` in React.",
    "How do you optimise the performance of a React application?",
    "What is the virtual DOM and how does it work?",
    "Explain CSS specificity and the cascade.",
    "What are React hooks and why were they introduced?",
    "How do you approach responsive design?",
    "Explain the event loop in JavaScript.",
    "What is server-side rendering and how does it benefit SEO?",
    "How would you debug a slow rendering component in React?",
    "Explain CORS and how you handle it on the frontend.",
  ],
  "Backend Developer": [
    "What is the difference between SQL and NoSQL databases?",
    "Explain RESTful API design principles.",
    "How do you handle database transactions?",
    "What is middleware in Express.js?",
    "Explain the CAP theorem.",
    "How do you secure a REST API?",
    "What are microservices and when would you use them?",
    "Describe your approach to API rate limiting.",
    "How do you handle authentication and authorisation?",
    "Explain caching strategies and when to use them.",
  ],
  "Full-Stack Developer": [
    "Walk me through the architecture of a recent project you built.",
    "How do you manage state in a large React application?",
    "Explain the difference between authentication and authorisation.",
    "How does HTTPS work?",
    "What is GraphQL and how is it different from REST?",
    "Describe CI/CD and your experience with deployment pipelines.",
    "How do you prioritise technical debt vs. new features?",
    "Explain database indexing and when to use it.",
    "How do you approach system design for a URL shortener?",
    "Describe your process for code review.",
  ],
  "AI/ML Engineer": [
    "Explain overfitting and how you prevent it.",
    "What is the difference between supervised and unsupervised learning?",
    "How do gradient descent and backpropagation work?",
    "What is a confusion matrix and what does it tell you?",
    "Explain the bias-variance tradeoff.",
    "What are transformer models and why are they important?",
    "How do you handle imbalanced datasets?",
    "Describe your experience with model deployment.",
    "What metrics do you use to evaluate a classification model?",
    "Explain the attention mechanism in deep learning.",
  ],
  "Data Scientist": [
    "Explain the steps in a typical data science project.",
    "How do you handle missing data?",
    "What is the difference between correlation and causation?",
    "Describe a machine learning model you've built end-to-end.",
    "How do you visualise high-dimensional data?",
    "What is A/B testing and how do you interpret its results?",
    "Explain regularisation (L1 vs L2).",
    "How do you communicate complex results to non-technical stakeholders?",
    "What tools do you use for data wrangling?",
    "Describe your experience with SQL and when you prefer Python for analysis.",
  ],
};

function getQuestionsForRole(role: string): string[] {
  // Find best matching key
  const key = Object.keys(QUESTION_BANK).find(k =>
    k !== "default" && role.toLowerCase().includes(k.toLowerCase())
  ) || "default";
  const roleQs = QUESTION_BANK[key] || QUESTION_BANK["default"];
  // Combine with some default questions, shuffle, take 8
  const combined = [...roleQs, ...QUESTION_BANK["default"]];
  const unique = Array.from(new Set(combined));
  return unique.sort(() => Math.random() - 0.5).slice(0, 8);
}

type Phase = "setup" | "interview" | "review";

export default function InterviewSimulator() {
  const { profile } = useAppStore();
  const [role, setRole] = useState("Frontend Engineer");
  const [seniority, setSeniority] = useState("Mid");
  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(90);

  // Pre-fill role from resume profile
  useEffect(() => {
    if (profile?.domain) setRole(profile.domain);
  }, [profile]);

  // Countdown timer per question
  useEffect(() => {
    if (phase !== "interview") return;
    if (timer <= 0) return;
    const t = setInterval(() => setTimer(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timer]);

  const startInterview = async () => {
    setLoading(true);
    try {
      // Try AI-generated questions first
      const res = await fetch(`${API_BASE}/interview/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, seniority }),
      });
      if (res.ok) {
        const data = await res.json();
        const qs = (data.questions as { question: string }[]).map(q => q.question);
        setQuestions(qs.sort(() => Math.random() - 0.5).slice(0, 8));
      } else throw new Error("fallback");
    } catch {
      // Fallback to local question bank
      setQuestions(getQuestionsForRole(role));
    }
    setAnswers([]);
    setCurrentIdx(0);
    setCurrentAnswer("");
    setTimer(90);
    setPhase("interview");
    setLoading(false);
  };

  const submitAnswer = () => {
    const updated = [...answers, currentAnswer || "(Skipped)"];
    setAnswers(updated);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1);
      setCurrentAnswer("");
      setTimer(90);
    } else {
      setPhase("review");
    }
  };

  const timerColor = timer > 30 ? "var(--green)" : timer > 10 ? "var(--yellow)" : "#f87171";
  const progress = questions.length ? (currentIdx / questions.length) * 100 : 0;

  // ── SETUP SCREEN ──
  if (phase === "setup") return (
    <section style={{ borderRadius: 20, border: "1px solid rgba(163,119,157,0.2)", background: "rgba(18,10,34,0.6)", backdropFilter: "blur(20px)", padding: 28, maxWidth: 620, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#663399,#9b59b6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}><Mic size={20} /></div>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>AI Interview Simulator</h2>
          <p style={{ margin: 0, fontSize: "0.72rem", color: "rgba(163,119,157,0.7)" }}>Powered by HelixAI · Questions based on your resume</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        <div>
          <label style={{ fontSize: "0.72rem", color: "rgba(163,119,157,0.75)", marginBottom: 5, display: "block", fontWeight: 600, letterSpacing: "0.06em" }}>TARGET ROLE</label>
          <input
            className="input-field"
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="e.g. Frontend Engineer"
            style={{ width: "100%" }}
          />
          {profile?.domain && (
            <p style={{ fontSize: "0.65rem", color: "rgba(86,227,160,0.8)", marginTop: 4, display: "flex", alignItems: "center" }}><Check size={12} className="mr-1" /> Pre-filled from your resume: <strong>{profile.domain}</strong></p>
          )}
        </div>
        <div>
          <label style={{ fontSize: "0.72rem", color: "rgba(163,119,157,0.75)", marginBottom: 5, display: "block", fontWeight: 600, letterSpacing: "0.06em" }}>SENIORITY LEVEL</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["Junior", "Mid", "Senior", "Lead"].map(s => (
              <button key={s} onClick={() => setSeniority(s)} style={{ flex: 1, padding: "8px 0", borderRadius: 9, border: `2px solid ${seniority === s ? "#9b59b6" : "rgba(163,119,157,0.2)"}`, background: seniority === s ? "rgba(102,51,153,0.25)" : "transparent", color: seniority === s ? "#f0e8ff" : "rgba(163,119,157,0.6)", fontWeight: 700, cursor: "pointer", fontSize: "0.75rem", transition: "all 0.15s" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "rgba(102,51,153,0.08)", border: "1px solid rgba(163,119,157,0.12)", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(163,119,157,0.7)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}><ClipboardList size={14} /> WHAT TO EXPECT</div>
        <div style={{ fontSize: "0.75rem", color: "rgba(240,232,255,0.7)", lineHeight: 1.7 }}>
          • 8 randomised interview questions for your role<br />
          • 90 seconds to think & type each answer<br />
          • Full review with all your answers at the end<br />
          • Resume-aware questions when available
        </div>
      </div>

      <button
        onClick={startInterview}
        disabled={loading || !role.trim()}
        style={{ width: "100%", padding: "14px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#663399,#9b59b6)", color: "white", fontWeight: 800, fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1, boxShadow: "0 6px 24px rgba(102,51,153,0.45)", transition: "all 0.2s", letterSpacing: "0.02em" }}
        onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
      >
        {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Loader2 className="animate-spin" size={16} /> Preparing questions...</span> : <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Rocket size={16} /> Start Interview Session</span>}
      </button>
    </section>
  );

  // ── INTERVIEW SCREEN ──
  if (phase === "interview") {
    const q = questions[currentIdx];
    return (
      <section style={{ borderRadius: 20, border: "1px solid rgba(163,119,157,0.2)", background: "rgba(18,10,34,0.6)", backdropFilter: "blur(20px)", padding: 28, maxWidth: 620, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: "0.72rem", color: "rgba(163,119,157,0.7)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <Mic size={14} /> {role} · {seniority}
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "0.88rem", fontWeight: 700, color: timerColor, background: `${timerColor}15`, border: `1px solid ${timerColor}30`, borderRadius: 8, padding: "3px 10px", display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={12} /> {timer}s
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: "0.68rem", color: "rgba(163,119,157,0.6)" }}>Question {currentIdx + 1} of {questions.length}</span>
            <span style={{ fontSize: "0.68rem", color: "rgba(86,227,160,0.8)", fontWeight: 600 }}>{Math.round(progress)}% complete</span>
          </div>
          <div style={{ height: 5, borderRadius: 99, background: "rgba(163,119,157,0.12)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#663399,#9b59b6)", width: `${progress}%`, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
            {questions.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i < currentIdx ? "var(--green)" : i === currentIdx ? "#9b59b6" : "rgba(163,119,157,0.15)", transition: "background 0.3s" }} />
            ))}
          </div>
        </div>

        {/* Question */}
        <div style={{ background: "rgba(102,51,153,0.1)", border: "1px solid rgba(163,119,157,0.2)", borderRadius: 14, padding: "18px 20px", marginBottom: 18 }}>
          <div style={{ fontSize: "0.65rem", color: "#9b59b6", fontWeight: 700, marginBottom: 8, letterSpacing: "0.08em" }}>QUESTION {currentIdx + 1}</div>
          <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "#f0e8ff", lineHeight: 1.7 }}>{q}</p>
        </div>

        {/* Answer textarea */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: "0.68rem", color: "rgba(163,119,157,0.7)", fontWeight: 600, letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>YOUR ANSWER</label>
          <textarea
            autoFocus
            value={currentAnswer}
            onChange={e => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here... Take your time and think through your response."
            rows={5}
            style={{
              width: "100%", boxSizing: "border-box",
              background: "rgba(102,51,153,0.08)", border: "1px solid rgba(163,119,157,0.2)",
              borderRadius: 12, padding: "12px 14px", color: "#f0e8ff",
              fontSize: "0.85rem", lineHeight: 1.6, resize: "vertical", outline: "none",
              fontFamily: "inherit", transition: "border-color 0.2s",
            }}
            onFocus={e => { e.target.style.borderColor = "rgba(155,89,182,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(102,51,153,0.15)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(163,119,157,0.2)"; e.target.style.boxShadow = "none"; }}
          />
          <div style={{ fontSize: "0.65rem", color: "rgba(163,119,157,0.5)", marginTop: 4 }}>{currentAnswer.length} characters</div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={submitAnswer}
            style={{ flex: 1, padding: "12px 0", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#663399,#9b59b6)", color: "white", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", boxShadow: "0 4px 16px rgba(102,51,153,0.4)", transition: "all 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
          >
            {currentIdx + 1 < questions.length ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>Next Question <ArrowRight size={14} /></span> : <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>Finish Interview <Check size={14} /></span>}
          </button>
          <button
            onClick={() => { setCurrentAnswer(""); submitAnswer(); }}
            style={{ padding: "12px 16px", borderRadius: 11, border: "1px solid rgba(163,119,157,0.2)", background: "transparent", color: "rgba(163,119,157,0.6)", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}
          >
            Skip
          </button>
        </div>
      </section>
    );
  }

  // ── REVIEW SCREEN ──
  return (
    <section style={{ borderRadius: 20, border: "1px solid rgba(86,227,160,0.25)", background: "rgba(18,10,34,0.6)", backdropFilter: "blur(20px)", padding: 28, maxWidth: 620, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><PartyPopper size={48} color="var(--accent)" /></div>
        <h2 style={{ margin: 0, fontWeight: 800 }}>Interview Complete!</h2>
        <p style={{ color: "rgba(163,119,157,0.7)", fontSize: "0.8rem", margin: "8px 0 0" }}>
          You answered {answers.filter(a => a !== "(Skipped)").length}/{questions.length} questions · {role} · {seniority}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
        {questions.map((q, i) => (
          <div key={i} style={{ borderRadius: 14, border: "1px solid rgba(163,119,157,0.15)", background: "rgba(102,51,153,0.06)", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(163,119,157,0.1)", background: "rgba(102,51,153,0.1)" }}>
              <span style={{ fontSize: "0.62rem", color: "#9b59b6", fontWeight: 700 }}>Q{i + 1}</span>
              <p style={{ margin: "4px 0 0", fontSize: "0.82rem", fontWeight: 600, color: "#f0e8ff", lineHeight: 1.5 }}>{q}</p>
            </div>
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: "0.62rem", color: "rgba(86,227,160,0.8)", fontWeight: 700, marginBottom: 4 }}>YOUR ANSWER</div>
              <p style={{ margin: 0, fontSize: "0.8rem", color: answers[i] === "(Skipped)" ? "rgba(163,119,157,0.4)" : "rgba(240,232,255,0.8)", lineHeight: 1.6, fontStyle: answers[i] === "(Skipped)" ? "italic" : "normal" }}>
                {answers[i] || "(Skipped)"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => { setPhase("setup"); setAnswers([]); setCurrentIdx(0); }}
          style={{ flex: 1, padding: "12px 0", borderRadius: 11, border: "none", background: "linear-gradient(135deg,#663399,#9b59b6)", color: "white", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <RefreshCw size={16} /> New Session
        </button>
        <button
          onClick={() => { setQuestions(getQuestionsForRole(role)); setAnswers([]); setCurrentIdx(0); setCurrentAnswer(""); setTimer(90); setPhase("interview"); }}
          style={{ flex: 1, padding: "12px 0", borderRadius: 11, border: "1px solid rgba(163,119,157,0.3)", background: "transparent", color: "#f0e8ff", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <RotateCcw size={16} /> Retry Same Role
        </button>
      </div>
    </section>
  );
}
