"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "../../state/useAppStore";
import { Mic, Check, ClipboardList, Loader2, Rocket, Clock, ArrowRight, PartyPopper, RefreshCw, RotateCcw } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import KPICard from "../ui/KPICard";
import ProgressRing from "../ui/ProgressRing";
import Badge from "../ui/Badge";
import PremiumButton from "../ui/PremiumButton";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8000");

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
  const key = Object.keys(QUESTION_BANK).find(k =>
    k !== "default" && role.toLowerCase().includes(k.toLowerCase())
  ) || "default";
  const roleQs = QUESTION_BANK[key] || QUESTION_BANK["default"];
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

  useEffect(() => {
    if (profile?.domain) setRole(profile.domain);
  }, [profile]);

  useEffect(() => {
    if (phase !== "interview") return;
    if (timer <= 0) return;
    const t = setInterval(() => setTimer(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timer]);

  const startInterview = async () => {
    setLoading(true);
    try {
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

  const timerColor = timer > 30 ? "text-emerald-400" : timer > 10 ? "text-amber-400" : "text-red-400";
  const progress = questions.length ? (currentIdx / questions.length) * 100 : 0;

  // â”€â”€ SETUP SCREEN â”€â”€
  if (phase === "setup") return (
    <GlassCard className="p-7 max-w-[620px] mx-auto animate-fade">
      <div className="flex items-center gap-3.5 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-accent)]"><Mic size={20} /></div>
        <div>
          <h2 className="text-base font-bold text-white font-display">AI Interview Simulator</h2>
          <p className="text-[10px] text-zinc-550 font-semibold uppercase tracking-wider">Powered by HelixAI Â· Questions base on profile</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block font-display">Target Role</label>
          <input
            className="w-full h-10 bg-black/40 border border-white/[0.06] rounded-xl px-3.5 text-xs text-white placeholder-zinc-700 focus:border-[var(--color-primary)]/60 outline-none transition-colors"
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="e.g. Frontend Engineer"
          />
          {profile?.domain && (
            <p className="text-[10px] text-emerald-400 mt-2 font-semibold flex items-center"><Check size={12} className="mr-1" /> Pre-filled from your resume: <strong className="ml-1">{profile.domain}</strong></p>
          )}
        </div>
        <div>
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block font-display">Seniority Level</label>
          <div className="flex gap-2 bg-black/40 p-1 border border-white/[0.05] rounded-xl">
            {["Junior", "Mid", "Senior", "Lead"].map(s => (
              <button key={s} onClick={() => setSeniority(s)} className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all outline-none ${seniority === s ? "bg-[var(--color-primary)] text-white" : "bg-transparent text-zinc-400 hover:text-zinc-200"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/[0.005] border border-white/[0.05] rounded-xl p-4 mb-6 text-xs text-zinc-450 leading-relaxed font-semibold">
        <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5 flex items-center gap-1.5 font-display"><ClipboardList size={14} /> WHAT TO EXPECT</div>
        <div className="space-y-1">
          <div>â€¢ 8 randomised interview questions for your target role</div>
          <div>â€¢ 90 seconds to draft & submit response node details</div>
          <div>â€¢ Direct response calibration breakdown at final step</div>
        </div>
      </div>

      <PremiumButton
        onClick={startInterview}
        disabled={loading || !role.trim()}
        className="w-full h-11"
      >
        {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Compiling simulation...</span> : <span className="flex items-center gap-2"><Rocket size={16} /> Initialize Simulation Session</span>}
      </PremiumButton>
    </GlassCard>
  );

  // â”€â”€ INTERVIEW SCREEN â”€â”€
  if (phase === "interview") {
    const q = questions[currentIdx];
    return (
      <GlassCard className="p-7 max-w-[620px] mx-auto animate-fade">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5 font-display">
            <Mic size={14} className="text-[var(--accent)]" /> {role} Â· {seniority}
          </div>
          <div className={`font-mono text-xs font-bold ${timerColor} bg-black/40 border border-white/[0.06] rounded-lg px-2.5 py-1 flex items-center gap-1.5`}>
            <Clock size={12} /> {timer}s
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-zinc-500 font-semibold">Question {currentIdx + 1} of {questions.length}</span>
            <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider">{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/[0.015] border border-white/[0.05] rounded-xl p-5 mb-5">
          <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-widest block mb-2 font-display">Question Node {currentIdx + 1}</span>
          <p className="text-sm font-semibold text-white leading-relaxed">{q}</p>
        </div>

        {/* Answer textarea */}
        <div className="mb-6">
          <label className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest mb-2 block font-display">Your Response</label>
          <textarea
            autoFocus
            value={currentAnswer}
            onChange={e => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here... Take your time and think through your response."
            rows={5}
            className="w-full bg-black/40 border border-white/[0.06] rounded-xl p-4 text-xs font-semibold text-white placeholder-zinc-700 focus:border-[var(--color-primary)]/60 outline-none transition-colors duration-200 resize-none font-sans leading-relaxed"
          />
          <div className="text-[10px] text-zinc-600 mt-2 font-mono uppercase tracking-wider">{currentAnswer.length} characters</div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <PremiumButton
            onClick={submitAnswer}
            className="flex-1"
          >
            {currentIdx + 1 < questions.length ? <span className="flex items-center gap-1.5">Next Question <ArrowRight size={14} /></span> : <span className="flex items-center gap-1.5">Finish Interview <Check size={14} /></span>}
          </PremiumButton>
          <PremiumButton
            variant="ghost"
            onClick={() => { setCurrentAnswer(""); submitAnswer(); }}
            className="h-10 px-4"
          >
            Skip
          </PremiumButton>
        </div>
      </GlassCard>
    );
  }

  // â”€â”€ REVIEW SCREEN â”€â”€
  return (
    <GlassCard className="p-7 max-w-[620px] mx-auto border-emerald-500/10 bg-emerald-500/[0.003] animate-fade">
      <div className="text-center mb-6">
        <div className="flex justify-center text-zinc-550 mb-3"><PartyPopper size={40} className="text-[var(--accent)] animate-bounce" /></div>
        <h2 className="text-lg font-bold text-white font-display">Interview Complete!</h2>
        <p className="text-[11px] text-zinc-400 font-semibold mt-1.5">
          You answered {answers.filter(a => a !== "(Skipped)").length}/{questions.length} questions Â· {role} Â· {seniority}
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        {questions.map((q, i) => (
          <div key={i} className="rounded-xl border border-white/[0.05] bg-white/[0.005] overflow-hidden">
            <div className="p-4 border-b border-white/[0.05] bg-white/[0.01]">
              <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-wider font-display">Question Q{i + 1}</span>
              <p className="text-xs font-semibold text-zinc-200 leading-relaxed mt-1">{q}</p>
            </div>
            <div className="p-4">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5 font-display">Your Answer Node</span>
              <p className={`text-xs leading-relaxed font-semibold ${answers[i] === "(Skipped)" ? "text-zinc-600 italic" : "text-zinc-350"}`}>
                {answers[i] || "(Skipped)"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <PremiumButton
          onClick={() => { setPhase("setup"); setAnswers([]); setCurrentIdx(0); }}
          className="flex-1"
        >
          <RefreshCw size={14} /> New Session
        </PremiumButton>
        <PremiumButton
          variant="secondary"
          onClick={() => { setQuestions(getQuestionsForRole(role)); setAnswers([]); setCurrentIdx(0); setCurrentAnswer(""); setTimer(90); setPhase("interview"); }}
          className="flex-1"
        >
          <RotateCcw size={14} /> Retry Same Role
        </PremiumButton>
      </div>
    </GlassCard>
  );
}

