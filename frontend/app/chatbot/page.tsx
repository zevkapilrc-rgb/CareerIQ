"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/src/state/useAppStore";
import { Bot, Send, Sparkles, RefreshCw, Copy, Check, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/src/components/ui/GlassCard";
import Badge from "@/src/components/ui/Badge";
import PremiumButton from "@/src/components/ui/PremiumButton";

const SUGGESTIONS = [
  { label: "What salary should I negotiate?", category: "Salary" },
  { label: "Give me a system design question", category: "Technical" },
  { label: "How do I switch to AI/ML?", category: "Career" },
  { label: "Write a 3-month Rust roadmap", category: "Roadmap" },
  { label: "What are my interview blind spots?", category: "Interview" },
  { label: "FAANG vs startup — which suits me?", category: "Strategy" },
  { label: "Explain microservices architecture", category: "Tech" },
  { label: "How to crack Google interviews?", category: "Interview" },
  { label: "Optimize my resume for ATS", category: "Resume" },
  { label: "Top skills to learn in 2026", category: "Skills" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Salary: "#6D001A", Technical: "#C0506A", Career: "#cbd5e1",
  Roadmap: "#6D001A", Interview: "#C0506A", Strategy: "#6D001A",
  Tech: "#cbd5e1", Resume: "#C0506A", Skills: "#cbd5e1",
};

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    let rendered = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#FFFFFF;font-weight:700">$1</strong>');
    rendered = rendered.replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.06);padding:2px 5px;border-radius:6px;font-family:monospace;font-size:0.85em;color:#C0506A">$1</code>');

    if (/^#{1,3}\s/.test(rendered)) {
      const headerText = rendered.replace(/^#{1,3}\s/, "");
      return (
        <div key={i} className="font-bold text-white text-xs mt-4 mb-2 pb-1 border-b border-white/[0.05] font-display uppercase tracking-widest" dangerouslySetInnerHTML={{ __html: headerText }} />
      );
    }
    if (/^[\s]*[-•]/.test(rendered)) {
      rendered = rendered.replace(/^[\s]*[-•]\s*/, "");
      return (
        <div key={i} className="flex gap-2 items-start mb-1.5 font-semibold">
          <span className="text-[#C0506A] mt-1.5 flex-shrink-0" style={{ fontSize: 6 }}>●</span>
          <span dangerouslySetInnerHTML={{ __html: rendered }} />
        </div>
      );
    }
    return (
      <div key={i} dangerouslySetInnerHTML={{ __html: rendered }} className="font-semibold" style={{ marginBottom: rendered.trim() ? 3 : 8 }} />
    );
  });
}

export default function ChatbotPage() {
  const { profile, addXP } = useAppStore();

  const welcome = `Hey${profile?.name ? " " + profile.name.split(" ")[0] : ""}! I'm **HelixAI** — your career intelligence mentor powered by Google Gemini.

${profile?.domain
    ? `✓ Profile synced: **${profile.domain}**${profile.experience ? `, ${profile.experience} yr(s) exp` : ""}${profile.skills?.length ? `, skills in ${profile.skills.slice(0, 3).join(", ")}` : ""}. All advice is calibrated to your background.`
    : "Upload your resume in the Resume module to initialize **personalized** career calibration!"}

I can help you with:
- Technical concepts, DSA, system design & architecture
- Salary negotiation strategies, scripts & market data
- Resume improvements, ATS keywords & formatting
- Interview prep — STAR stories, behavioral questions
- Career roadmaps, domain switching, upskilling paths
- Global job market insights & hiring trends`;

  const [messages, setMessages] = useState<{ role: string; text: string; id: string }[]>([
    { role: "ai", text: welcome, id: "init" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + "px";
    }
  }, [input]);

  const send = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    const id = Date.now().toString();
    setMessages(m => [...m, { role: "user", text: msg, id }]);
    setInput("");
    setLoading(true);
    setShowSuggestions(false);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: messages.slice(-10),
          profile: profile ? {
            name: profile.name, domain: profile.domain,
            experience: profile.experience, skills: profile.skills, education: profile.education,
          } : null,
        }),
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setMessages(m => [...m, { role: "ai", text: data.reply, id: Date.now().toString() }]);
      } else {
        setMessages(m => [...m, { role: "ai", text: `⚠️ Issue: ${data.error || "Unknown error"}. Please retry.`, id: Date.now().toString() }]);
      }
    } catch {
      setMessages(m => [...m, { role: "ai", text: "⚠️ Network error. Check your connection and retry.", id: Date.now().toString() }]);
    }

    setLoading(false);
    const nc = questionCount + 1;
    setQuestionCount(nc);
    if (nc === 5) addXP(80, "Asked HelixAI 5 questions");
  };

  const copyMsg = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const clearChat = () => {
    setMessages([{ role: "ai", text: welcome, id: "init" }]);
    setShowSuggestions(true);
    setQuestionCount(0);
  };

  return (
    <div
      className="flex flex-col animate-fade font-sans"
      style={{
        height: "calc(100vh - 105px)",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/[0.05]"
        style={{ background: "rgba(10,10,11,0.6)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center gap-3">
          {/* Animated AI Avatar */}
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-[#6D001A]/10 border border-[#6D001A]/20 flex items-center justify-center text-[#C0506A]">
              <Bot size={17} />
            </div>
            <span
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-450 border-2 border-[#09090B]"
              style={{ boxShadow: "0 0 6px rgba(16,185,129,0.5)" }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--text)] font-display uppercase tracking-wider">Helix AI</span>
              <Badge label="Gemini" variant="red" size="sm" />
            </div>
            <div className="text-[10px] text-zinc-550 font-semibold uppercase tracking-wider">
              {profile?.domain ? `Synced · ${profile.domain}` : "Career Intelligence Mentor"}
              {questionCount > 0 && <span className="ml-2 font-mono text-zinc-650">· {questionCount} msgs</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge label="ONLINE" variant="green" size="sm" dot={true} />
          <PremiumButton
            variant="secondary"
            size="sm"
            onClick={clearChat}
            className="p-2 h-8 w-8 flex items-center justify-center"
            title="Clear conversation"
          >
            <RefreshCw size={13} />
          </PremiumButton>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`flex gap-3 items-start group ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              {m.role === "ai" ? (
                <div className="w-8 h-8 rounded-xl bg-[#6D001A]/10 border border-[#6D001A]/20 flex items-center justify-center text-[#C0506A] flex-shrink-0 mt-0.5">
                  <Bot size={14} />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-[#6D001A] border border-[#6D001A]/40 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5 font-display">
                  {profile?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}

              {/* Bubble */}
              <div className={`relative max-w-[80%] ${m.role === "user" ? "items-end" : ""}`}>
                <div
                  className="px-4 py-3 rounded-xl text-xs leading-relaxed"
                  style={m.role === "ai" ? {
                    background: "rgba(255,255,255,0.01)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    color: "#D4D4D8",
                    borderRadius: "4px 16px 16px 16px",
                  } : {
                    background: "rgba(109,0,26,0.12)",
                    border: "1px solid rgba(109,0,26,0.25)",
                    color: "#F4F4F5",
                    borderRadius: "16px 4px 16px 16px",
                  }}
                >
                  {m.role === "ai" ? renderMarkdown(m.text) : m.text}
                </div>

                {/* Copy button */}
                {m.role === "ai" && (
                  <button
                    onClick={() => copyMsg(m.text, m.id)}
                    className="absolute -bottom-5 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-550 hover:text-zinc-400 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider font-display outline-none"
                  >
                    {copied === m.id ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                    {copied === m.id ? "Copied" : "Copy"}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex gap-3 items-start"
            >
              <div className="w-8 h-8 rounded-xl bg-[#6D001A]/10 border border-[#6D001A]/20 flex items-center justify-center text-[#C0506A] flex-shrink-0 mt-0.5">
                <Bot size={14} />
              </div>
              <div
                className="px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "4px 16px 16px 16px" }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-zinc-650"
                        style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-widest font-display">HelixAI is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && messages.length <= 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-shrink-0 px-5 pb-3 bg-gradient-to-t from-black/20 to-transparent"
          >
            <div className="text-[8px] font-bold uppercase tracking-widest text-zinc-550 mb-2 font-display">Suggested calibration topics</div>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {SUGGESTIONS.map(s => {
                const color = CATEGORY_COLORS[s.category] || "#6D001A";
                return (
                  <button
                    key={s.label}
                    onClick={() => send(s.label)}
                    disabled={loading}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border bg-black/45 border-white/[0.04] text-zinc-400 hover:text-white transition-all outline-none"
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = `${color}40`;
                      e.currentTarget.style.background = `${color}08`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.background = "rgba(0,0,0,0.45)";
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: color }} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div
        className="flex-shrink-0 border-t border-white/[0.05] p-4 bg-[#09090B]/60"
        style={{ backdropFilter: "blur(20px)" }}
      >
        <div
          className="flex gap-3 items-end rounded-xl border border-white/[0.06] p-3 transition-all focus-within:border-[#6D001A]/50 focus-within:shadow-[0_0_15px_rgba(109,0,26,0.05)] bg-black/40"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask HelixAI anything — salary, code, career strategy, resume tips..."
            rows={1}
            className="flex-1 bg-transparent text-xs text-white placeholder-zinc-650 resize-none outline-none leading-relaxed font-semibold h-9"
            style={{ minHeight: 36, maxHeight: 140 }}
            disabled={loading}
          />
          <div className="flex items-center gap-2 flex-shrink-0 pb-0.5">
            {input.length > 0 && (
              <span className="text-[9px] text-zinc-600 font-mono">{input.length}</span>
            )}
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
              style={{
                background: input.trim() && !loading ? "linear-gradient(135deg, #6D001A, #C0506A)" : "rgba(255,255,255,0.02)",
                boxShadow: input.trim() && !loading ? "0 4px 12px rgba(109,0,26,0.2)" : "none",
              }}
            >
              {loading
                ? <RefreshCw size={13} className="text-white animate-spin" />
                : <Send size={13} className="text-white" style={{ transform: "translateX(1px)" }} />
              }
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 px-1 font-mono text-[9px] text-zinc-600 uppercase font-bold tracking-wider">
          <span>Enter to send · Shift+Enter for newline</span>
          <span>Powered by Google Gemini</span>
        </div>
      </div>
    </div>
  );
}
