"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, FileText, Globe, Play, Compass, Minimize2, Maximize2 } from "lucide-react";
import { useAppStore } from "@/src/state/useAppStore";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "ai";
  text: string;
  time: string;
}

interface HelixAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelixAIPanel: React.FC<HelixAIPanelProps> = ({ isOpen, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hello! I am your Helix AI Assistant. I understand your career goals, resume, and skills. How can I help you accelerate your growth today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const { profile } = useAppStore();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const actions = [
    { label: "Optimize Resume", icon: <FileText className="w-3.5 h-3.5" />, prompt: "Can you analyze my resume and give specific suggestions to improve it for ATS screening?", path: "/resume" },
    { label: "Find Matching Jobs", icon: <Globe className="w-3.5 h-3.5" />, prompt: "Based on my current skills, can you recommend some top remote or global job options?", path: "/global-scanner" },
    { label: "Start Mock Interview", icon: <Play className="w-3.5 h-3.5" />, prompt: "I want to start a coding and behavioral interview practice session. Can you help me prep?", path: "/interview" },
    { label: "Refine Career Plan", icon: <Compass className="w-3.5 h-3.5" />, prompt: "What are the most in-demand skills I should learn next to move to the next level in my career path?", path: "/career-path" },
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          profile: profile || {},
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: Message = {
          role: "ai",
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (err: any) {
      const errorMessage: Message = {
        role: "ai",
        text: `Error: ${err.message || "Failed to communicate with AI"}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: typeof actions[0]) => {
    handleSendMessage(action.prompt);
    if (action.path) {
      router.push(action.path);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 80, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`fixed bottom-6 right-6 w-full max-w-[380px] sm:max-w-[420px] rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden transition-all duration-300 z-50 ${
            isMinimized ? "h-[56px]" : "h-[580px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] p-4 bg-white/[0.01]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold tracking-wide text-[var(--text)] font-display uppercase">
                  HELIX AI ASSISTANT
                </span>
                <span className="text-[9px] text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE & CONTEXT AWARE
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-white/[0.05] hover:text-[var(--text)] transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-white/[0.05] hover:text-[var(--text)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body & Input (only visible when not minimized) */}
          {!isMinimized && (
            <>
              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 no-scrollbar bg-black/5 dark:bg-black/20">
                {messages.map((m, idx) => {
                  const isAI = m.role === "ai";
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[85%] ${
                        isAI ? "self-start items-start" : "self-end items-end ml-auto"
                      }`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed border font-medium ${
                          isAI
                            ? "bg-[var(--surface)] border-[var(--border)] text-[var(--text-sub)] rounded-tl-sm shadow-sm"
                            : "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20 text-[var(--text)] rounded-tr-sm"
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9px] text-[var(--text-muted)] font-bold mt-1.5 px-1.5 uppercase font-mono">
                        {m.time}
                      </span>
                    </div>
                  );
                })}
                {isLoading && (
                  <div className="self-start flex flex-col items-start max-w-[85%]">
                    <div className="p-3.5 rounded-2xl rounded-tl-sm bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] text-xs flex items-center gap-1.5 font-medium shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)] animate-spin" />
                      Helix is analyzing context...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions Quick Action Panel */}
              {messages.length === 1 && (
                <div className="p-3 border-t border-[var(--border)] bg-black/5 dark:bg-white/[0.01] flex flex-col gap-2">
                  <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1 font-mono">
                    Quick AI Actions
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(act)}
                        className="flex items-center gap-2 p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] text-[var(--text-sub)] hover:text-[var(--text)] transition-all text-[11px] font-semibold text-left shadow-sm"
                      >
                        <span className="text-[var(--color-accent)]">{act.icon}</span>
                        <span className="truncate">{act.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Controls */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(input);
                }}
                className="p-3 border-t border-[var(--border)] bg-[var(--bg-deep)] flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask Helix something... e.g. Resume tips"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--color-primary)]/60 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white disabled:opacity-40 disabled:pointer-events-none hover:shadow-md transition-all active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HelixAIPanel;
