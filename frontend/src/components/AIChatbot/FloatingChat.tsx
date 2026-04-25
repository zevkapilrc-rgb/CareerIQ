"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuthStore } from "../../state/useAuthStore";
import { X, Sparkles, Zap, Send } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8000");

type Message = { role: "user" | "assistant"; content: string };

export default function FloatingChat() {
  const token = useAuthStore((s) => s.token);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`${API_BASE}/chatbot/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: content }),
      });
      if (!res.ok) throw new Error("Chat failed");
      return res.json();
    },
    onSuccess: (data: { reply: string }) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const content = input.trim();
    setMessages((prev) => [...prev, { role: "user", content }]);
    setInput("");
    mutation.mutate(content);
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 1000,
          width: 52, height: 52, borderRadius: "50%",
          background: "linear-gradient(135deg,#663399,#9b59b6)",
          border: "none", cursor: "pointer", color: "white", fontSize: "1.3rem",
          boxShadow: "0 8px 28px rgba(102,51,153,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X size={24} /> : <Sparkles size={24} />}
      </motion.button>

      {/* Chat Window */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.93 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24 }}
          style={{
            position: "fixed", bottom: 88, right: 24, width: 320, zIndex: 999,
            borderRadius: 20, border: "1px solid rgba(163,119,157,0.25)",
            background: "rgba(18,10,34,0.92)",
            backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 20px 60px rgba(102,51,153,0.35), 0 0 0 1px rgba(163,119,157,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "14px 16px", borderBottom: "1px solid rgba(163,119,157,0.15)",
            background: "linear-gradient(135deg,rgba(102,51,153,0.35),rgba(155,89,182,0.2))",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg,#663399,#9b59b6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", boxShadow: "0 4px 12px rgba(102,51,153,0.5)", color: "white"
            }}><Zap size={16} /></div>
            <div>
              <div style={{ fontWeight: 800, color: "#f0e8ff", fontSize: "0.92rem", letterSpacing: "0.02em" }}>
                HelixAI
              </div>
              <div style={{ fontSize: "0.62rem", color: "rgba(163,119,157,0.75)", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#56e3a0", display: "inline-block", animation: "helixPulse 2s ease-in-out infinite" }} />
                Neural Career Processor
              </div>
            </div>
            {!token && (
              <span style={{ marginLeft: "auto", fontSize: "0.58rem", color: "#fbbf24", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 8, padding: "2px 6px" }}>
                Login for AI answers
              </span>
            )}
          </div>

          {/* Messages */}
          <div style={{
            height: 200, padding: "10px 12px", overflowY: "auto",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
              <div style={{ color: "rgba(163,119,157,0.5)", fontSize: "0.78rem", textAlign: "center", marginTop: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ marginBottom: 6 }}><Sparkles size={36} color="var(--accent)" /></div>
                Hi! I'm HelixAI — ask me anything about your career, resume, or interview prep!
              </div>
            )}
            {messages.map((m, idx) => (
              <div key={idx} style={{
                display: "flex", gap: 6, flexDirection: m.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-start",
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  background: m.role === "user" ? "rgba(102,51,153,0.5)" : "linear-gradient(135deg,#663399,#9b59b6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.55rem", color: "white", fontWeight: 700,
                }}>
                  {m.role === "user" ? "U" : <Zap size={12} />}
                </div>
                <div style={{
                  maxWidth: "78%", padding: "7px 10px", borderRadius: 10, fontSize: "0.75rem",
                  lineHeight: 1.55, color: m.role === "user" ? "#e2e8f0" : "#f0e8ff",
                  background: m.role === "user" ? "rgba(102,51,153,0.25)" : "rgba(46,26,71,0.7)",
                  border: `1px solid ${m.role === "user" ? "rgba(163,119,157,0.2)" : "rgba(102,51,153,0.25)"}`,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {mutation.isPending && (
              <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#663399,#9b59b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.55rem", color: "white", fontWeight: 700, flexShrink: 0 }}>AI</div>
                <div style={{ padding: "7px 12px", borderRadius: 10, background: "rgba(46,26,71,0.7)", border: "1px solid rgba(102,51,153,0.25)", fontSize: "0.85rem" }}>
                  <span style={{ display: "inline-flex", gap: 3 }}>
                    <span style={{ animation: "nexusDot 1.2s ease-in-out infinite", animationDelay: "0s" }}>●</span>
                    <span style={{ animation: "nexusDot 1.2s ease-in-out infinite", animationDelay: "0.2s" }}>●</span>
                    <span style={{ animation: "nexusDot 1.2s ease-in-out infinite", animationDelay: "0.4s" }}>●</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={onSubmit} style={{ padding: "10px 12px", borderTop: "1px solid rgba(163,119,157,0.12)", display: "flex", gap: 8 }}>
            <input
              style={{
                flex: 1, borderRadius: 10, border: "1px solid rgba(163,119,157,0.2)",
                background: "rgba(46,26,71,0.6)", padding: "8px 12px",
                color: "#f0e8ff", fontSize: "0.78rem", outline: "none",
              }}
              placeholder="Ask HelixAI anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={!input.trim()} style={{
              width: 36, height: 36, borderRadius: 10, border: "none",
              background: "linear-gradient(135deg,#663399,#9b59b6)", color: "white",
              cursor: input.trim() ? "pointer" : "not-allowed", opacity: input.trim() ? 1 : 0.5,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><Send size={16} /></button>
          </form>

          <style>{`
            @keyframes nexusDot { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1.2)} }
            @keyframes helixPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0.5} }
          `}</style>
        </motion.div>
      )}
    </>
  );
}
