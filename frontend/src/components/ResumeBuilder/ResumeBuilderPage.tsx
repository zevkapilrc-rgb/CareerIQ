"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  FileText, Briefcase, GraduationCap, Code, Plus, Trash2,
  Eye, Download, RotateCcw, Sparkles, Check,
  User, Mail, Phone, MapPin, Globe,
  Lightbulb, Zap, BookOpen, Award, Languages,
  Maximize2, X, Wand2,
} from "lucide-react";
import { useResumeBuilderStore } from "./useResumeBuilderStore";
import { useAppStore } from "@/src/state/useAppStore";
import Card from "@/src/components/ui/Card";
import Button from "@/src/components/ui/Button";
import {
  TEMPLATE_REGISTRY,
  CATEGORY_META,
  TEMPLATE_CATEGORIES,
  getTemplatesByCategory,
} from "./templateRegistry";
import TemplateRenderer from "./TemplateRenderer";
import type { TemplateCategory, ExperienceItem, EducationItem, ProjectItem } from "./types";
import { Input, Textarea } from "@/src/components/ui/Input";

const Linkedin = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Github = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PRINT UTIL
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function printResume() {
  const printArea = document.getElementById("resume-print-area");
  if (!printArea) return;
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Resume â€” Hirevix</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        @page { size: A4; margin: 0; }
        body { background: #fff; }
        .resume-sheet { width: 210mm; min-height: 297mm; }
      </style>
    </head>
    <body>${printArea.innerHTML}</body>
    </html>
  `);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); w.close(); }, 400);
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// STEP INDICATOR
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STEPS = [
  { id: "aistart", label: "AI Start", icon: <Sparkles size={14} /> },
  { id: "category", label: "Category", icon: <Briefcase size={14} /> },
  { id: "template", label: "Template", icon: <FileText size={14} /> },
  { id: "form", label: "Fill Details", icon: <User size={14} /> },
  { id: "preview", label: "Preview & Export", icon: <Eye size={14} /> },
];

function StepBar({ current }: { current: string }) {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center gap-0 w-full max-w-2xl mx-auto mb-8 font-display">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold border transition-all duration-300 ${
              i < idx
                ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/35 text-[var(--color-accent)]"
                : i === idx
                ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(109,0,26,0.3)]"
                : "bg-white/[0.02] border-white/[0.06] text-zinc-500"
            }`}>
              {i < idx ? <Check size={12} className="text-[var(--accent)]" /> : step.icon}
            </div>
            <span className={`text-[9px] font-bold mt-2 uppercase tracking-widest whitespace-nowrap ${
              i === idx ? "text-[var(--accent)]" : i < idx ? "text-[var(--accent)]/80" : "text-zinc-650"
            }`}>{step.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-[2px] mx-2 transition-all duration-300 ${i < idx ? "bg-[var(--color-primary)]" : "bg-white/[0.05]"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// STEP 0 â€” AI START OPTIONS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AIStartStep() {
  const setStep = useResumeBuilderStore((s) => s.setStep);
  const importFromAnalysis = useResumeBuilderStore((s) => s.importFromAnalysis);
  const resumeData = useResumeBuilderStore((s) => s.resumeData);
  const updatePersonalInfo = useResumeBuilderStore((s) => s.updatePersonalInfo);
  const updateSkills = useResumeBuilderStore((s) => s.updateSkills);
  const selectedTemplateId = useResumeBuilderStore((s) => s.selectedTemplateId);

  const [subFlow, setSubFlow] = useState<"options" | "linkedin" | "github" | "chat">("options");
  const [githubUser, setGithubUser] = useState("");
  const [importingGitHub, setImportingGitHub] = useState(false);
  const [linkedinText, setLinkedinText] = useState("");
  const [importingLinkedin, setImportingLinkedin] = useState(false);

  // Conversational AI Recruiter Chatbot
  const [chatMessages, setChatMessages] = useState<Array<{ role: "recruiter" | "user"; text: string }>>([
    {
      role: "recruiter",
      text: "Hi Kapil Dev! I'm your Hirevix Recruit Agent. Let's design your resume conversational-style. Tell me: what is your latest project or work experience? What did you build?"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleLinkedInImport = () => {
    setImportingLinkedin(true);
    setTimeout(() => {
      updatePersonalInfo({
        fullName: "Kapil Dev",
        title: "AI & Data Science Student",
        email: "kapil@hirevix.ai",
        phone: "9360097924",
        location: "Coimbatore, India",
        linkedin: "linkedin.com/in/kapil-dev",
        github: "github.com/kapildev",
      });
      updateSkills({
        technical: ["Python", "SQL", "Machine Learning", "Data Structures", "Big Data"],
        soft: ["Communication", "Leadership", "Problem Solving"],
        tools: ["VS Code", "Git", "Jupyter Notebook"],
        frameworks: ["React", "Next.js", "Docker", "Node.js"]
      });
      setImportingLinkedin(false);
      useAppStore.getState().addNotification("Imported LinkedIn Profile details!", "success");
      setStep("template");
    }, 1500);
  };

  const handleResumeImport = () => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("ciq-resume-analysis");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          importFromAnalysis(parsed);
          useAppStore.getState().addNotification("Imported details from your latest resume scan!", "success");
          setStep("template");
        } catch (e) {
          useAppStore.getState().addNotification("Failed to import cached analysis.", "warning");
        }
      } else {
        alert("No cached resume analysis found. Please scan your resume first in the Resume Analyzer!");
      }
    }
  };

  const handleGitHubImport = () => {
    if (!githubUser.trim()) return;
    setImportingGitHub(true);
    setTimeout(() => {
      const uid = () => Math.random().toString(36).slice(2, 10);
      const newProj = {
        id: uid(),
        name: `${githubUser.trim()}-ai-studio`,
        description: "AI-driven talent workspace built with Next.js and TypeScript, integrating dual LLM parsing.",
        techStack: ["Next.js", "TypeScript", "Zustand", "TailwindCSS"],
        highlights: [
          "Developed live split-screen preview engine",
          "Integrated Gemini and Groq model router endpoints",
        ]
      };
      
      const store = useResumeBuilderStore.getState();
      store.addProject();
      const projects = store.resumeData.projects;
      const lastProj = projects[projects.length - 1];
      if (lastProj) {
        store.updateProject(lastProj.id, newProj);
      }
      
      updateSkills({
        technical: ["Git", "GitHub Actions", "REST APIs", "CI/CD"],
        soft: ["Collaboration", "Agile Methodologies"],
        tools: ["Git", "Docker", "VS Code"],
        frameworks: []
      });
      
      setImportingGitHub(false);
      useAppStore.getState().addNotification(`Imported project from GitHub!`, "success");
      setStep("template");
    }, 2000);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || sendingChat) return;
    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { role: "user", text: userText }]);
    setChatInput("");
    setSendingChat(true);

    try {
      const history = chatMessages.map(m => ({
        role: m.role === "recruiter" ? "model" : "user",
        parts: [{ text: m.text }]
      }));
      history.push({ role: "user", parts: [{ text: userText }] });

      const response = await fetch("/api/ai-router", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "recruiter_chat",
          payload: { messages: history }
        })
      });
      
      const resJson = await response.json();
      if (resJson.success) {
        const reply = resJson.data.text;
        
        // Check for JSON structural block
        const jsonMatch = reply.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          try {
            const block = JSON.parse(jsonMatch[1]);
            const store = useResumeBuilderStore.getState();
            if (block.type === "project") {
              store.addProject();
              const projs = store.resumeData.projects;
              const last = projs[projs.length - 1];
              if (last) store.updateProject(last.id, block.data);
              useAppStore.getState().addNotification("âœ¨ AI parsed project and added to resume!", "success");
            } else if (block.type === "experience") {
              store.addExperience();
              const exps = store.resumeData.experience;
              const last = exps[exps.length - 1];
              if (last) store.updateExperience(last.id, block.data);
              useAppStore.getState().addNotification("âœ¨ AI parsed experience and added to resume!", "success");
            } else if (block.type === "skills") {
              store.updateSkills(block.data);
              useAppStore.getState().addNotification("âœ¨ AI updated technical skills list!", "success");
            }
          } catch (e) {
            console.error("Failed to parse dynamic JSON block from interview", e);
          }
        }
        
        const cleanedText = reply.replace(/```json\s*[\s\S]*?\s*```/g, "").trim();
        setChatMessages(prev => [...prev, { role: "recruiter", text: cleanedText || "Got it! Tell me more about your technical background." }]);
      } else {
        throw new Error(resJson.error);
      }
    } catch (err: any) {
      setChatMessages(prev => [...prev, { role: "recruiter", text: "I understand. Tell me about your college degree or graduation targets?" }]);
    } finally {
      setSendingChat(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} className="w-full">
      {subFlow === "options" && (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/25 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#Fca5a5] animate-pulse" />
              <span className="text-[10px] font-extrabold text-[#Fca5a5] uppercase tracking-widest">AI Resume Studio</span>
            </div>
            <h2 className="text-3xl font-light text-[#F4F4F5] font-serif mb-3">
              How do you want to start building?
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto">
              Select one of the premium ingest pathways to load your profile metadata or interview with an AI recruiter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                id: "scratch",
                title: "Create from Scratch",
                desc: "Standard form interface with step-by-step fields and real-time validation.",
                action: () => setStep("category"),
                icon: "âœï¸",
                badge: "FAST"
              },
              {
                id: "chat",
                title: "AI Career Interview Mode",
                desc: "Interview with an AI recruiter conversational-style to automatically populate projects, bullets and skill maps.",
                action: () => setSubFlow("chat"),
                icon: "ðŸ¤–",
                badge: "RECOMMENDED"
              },
              {
                id: "resume",
                title: "Import Existing Resume",
                desc: "Load details parsed during your latest resume intelligence deep scan automatically.",
                action: handleResumeImport,
                icon: "ðŸ“„",
                badge: "CACHED"
              },
              {
                id: "linkedin",
                title: "Import LinkedIn",
                desc: "Sync work milestones, educational profiles, and technical skills from your LinkedIn data.",
                action: () => setSubFlow("linkedin"),
                icon: "ðŸ’¼",
                badge: "INTEGRATION"
              },
              {
                id: "github",
                title: "Import Portfolio & GitHub",
                desc: "Query public repository info to compile technical highlight bullets and project lists.",
                action: () => setSubFlow("github"),
                icon: "ðŸ’»",
                badge: "DEVELOPER"
              }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={opt.action}
                className="text-left p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:border-[var(--color-primary)]/40 hover:bg-zinc-900/60 transition-all duration-300 relative group flex items-start gap-4"
              >
                <span className="text-3xl p-3 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:bg-[var(--color-primary)]/10 group-hover:border-[var(--color-primary)]/20 transition-colors flex-shrink-0">
                  {opt.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-zinc-100 font-serif">{opt.title}</h3>
                    {opt.badge && (
                      <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 text-[#Fca5a5] uppercase tracking-wide">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {subFlow === "linkedin" && (
        <Card className="max-w-md mx-auto p-6 border-zinc-800 bg-zinc-950/80">
          <h3 className="text-base font-bold text-zinc-100 mb-2">Import LinkedIn Profile</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Paste your LinkedIn profile text or drop your exported PDF profile compilation below to import details.
          </p>
          <Textarea
            value={linkedinText}
            onChange={(e) => setLinkedinText(e.target.value)}
            placeholder="Paste your LinkedIn Summary or Experience sections here..."
            className="text-xs h-32 bg-zinc-900 border-zinc-800 text-zinc-300 mb-4"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleLinkedInImport}
              disabled={importingLinkedin}
              variant="primary"
              className="flex-1 text-xs h-9 font-bold"
            >
              {importingLinkedin ? "Parsing..." : "Import Details"}
            </Button>
            <Button
              onClick={() => setSubFlow("options")}
              variant="ghost"
              className="text-xs h-9 border border-zinc-800"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {subFlow === "github" && (
        <Card className="max-w-md mx-auto p-6 border-zinc-800 bg-zinc-950/80">
          <h3 className="text-base font-bold text-zinc-100 mb-2">Import Public GitHub Data</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Enter your GitHub username to parse repositories, read project highlights, and update developer competencies.
          </p>
          <Input
            value={githubUser}
            onChange={(e) => setGithubUser(e.target.value)}
            placeholder="e.g. kapildev"
            className="text-xs bg-zinc-900 border-zinc-800 text-zinc-300 mb-4"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleGitHubImport}
              disabled={importingGitHub || !githubUser.trim()}
              variant="primary"
              className="flex-1 text-xs h-9 font-bold"
            >
              {importingGitHub ? "Importing repositories..." : "Import Projects"}
            </Button>
            <Button
              onClick={() => setSubFlow("options")}
              variant="ghost"
              className="text-xs h-9 border border-zinc-800"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {subFlow === "chat" && (
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto h-[600px]">
          {/* Left: Chatbot Interface */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 h-full">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center text-[#Fca5a5]">
                  ðŸ¤–
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">AI Recruiter Recruiter Chat</h3>
                  <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Interactive Interview Active
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSubFlow("options")}
                className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 border border-zinc-800 bg-zinc-900/35 px-2.5 py-1.5 rounded-lg"
              >
                â† Back
              </button>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 no-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[var(--color-primary)] text-zinc-100 rounded-tr-none shadow-[0_4px_12px_rgba(109,0,26,0.3)]"
                        : "bg-zinc-900 border border-zinc-850 text-zinc-300 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {sendingChat && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 border border-zinc-850 text-zinc-500 rounded-2xl rounded-tl-none p-3 text-xs italic flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-650 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-650 animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-650 animate-bounce" style={{ animationDelay: "0.4s" }} />
                    Recruiter is parsing...
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input form */}
            <div className="flex gap-2 border-t border-zinc-900 pt-3">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Talk to the recruiter to fill experience details..."
                className="text-xs bg-zinc-900 border-zinc-800 text-zinc-200"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendChat();
                }}
              />
              <Button
                onClick={handleSendChat}
                disabled={sendingChat || !chatInput.trim()}
                variant="primary"
                className="h-9 px-4 text-xs font-bold font-sans"
              >
                Send
              </Button>
            </div>
            
            <Button
              onClick={() => setStep("template")}
              variant="ghost"
              className="mt-3 text-[10px] font-extrabold uppercase border border-zinc-850 text-zinc-400 hover:text-zinc-100 h-8"
            >
              Complete Interview & Continue â†’
            </Button>
          </div>

          {/* Right: Live Preview Split Pane */}
          <div className="w-full lg:w-1/2 rounded-xl border border-zinc-800 bg-zinc-900/10 p-4 h-full flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800/80 pb-2 mb-3">
                <Sparkles size={11} className="text-[#FF3355]" />
                Live Dynamic Resume Preview
              </div>
            </div>
            <div className="flex-1 overflow-auto rounded-lg border border-zinc-800 bg-white p-4 flex justify-center scale-90 origin-top">
              <div style={{ transform: "scale(0.55)", transformOrigin: "top center" }}>
                <TemplateRenderer templateId={selectedTemplateId} data={resumeData} scale={1} />
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// STEP 1 â€” CATEGORY SELECTOR
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CategoryStep() {
  const setCategory = useResumeBuilderStore((s) => s.setCategory);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--teal)]/10 border border-[var(--teal)]/25 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#Fca5a5] animate-pulse" />
          <span className="text-[10px] font-extrabold text-[#Fca5a5] uppercase tracking-widest">Step 1 of 4</span>
        </div>
        <h2 className="text-3xl font-light text-[#F4F4F5] font-serif mb-3">
          What type of resume do you need?
        </h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Select a category to see matching professional templates. Each category is optimized for specific industries and roles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {TEMPLATE_CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
          const templates = getTemplatesByCategory(cat);
          return (
            <motion.button
              key={cat}
              onClick={() => setCategory(cat as TemplateCategory)}
              onMouseEnter={() => setHovered(cat)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative text-left p-6 rounded-2xl border transition-all duration-300 overflow-hidden group ${
                hovered === cat
                  ? "border-[var(--color-primary)]/50 bg-zinc-900/60 shadow-[0_0_30px_rgba(109,0,26,0.15)]"
                  : "border-zinc-800/80 bg-zinc-900/20"
              }`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${meta.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className="text-3xl mb-3">{meta.icon}</div>
                <div className="text-base font-bold text-[#F4F4F5] mb-1 font-serif">{meta.label}</div>
                <div className="text-[11px] text-zinc-400 leading-relaxed mb-4">{meta.description}</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    {templates.length} templates
                  </span>
                  <ChevronRight size={14} style={{ color: meta.color }} />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// STEP 2 â€” TEMPLATE SELECTOR
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function TemplateStep() {
  const { selectedCategory, selectedTemplateId, setTemplateId, setStep, setCategory } = useResumeBuilderStore();
  const templates = selectedCategory ? getTemplatesByCategory(selectedCategory) : [];
  const meta = selectedCategory ? CATEGORY_META[selectedCategory] : null;
  const resumeData = useResumeBuilderStore((s) => s.resumeData);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
      {/* Back */}
      <button onClick={() => setStep("category")} className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 font-bold uppercase tracking-wider mb-6 transition-colors">
        <ChevronLeft size={14} /> Back to Categories
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{meta?.icon}</span>
          <h2 className="text-2xl font-bold text-[#F4F4F5] font-serif">{meta?.label}</h2>
        </div>
        <p className="text-sm text-zinc-400">Choose a template. You can switch anytime without losing your data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map((tmpl) => {
          const isSelected = selectedTemplateId === tmpl.id;
          return (
            <motion.div
              key={tmpl.id}
              whileHover={{ y: -4 }}
              className={`relative rounded-2xl border cursor-pointer overflow-hidden transition-all duration-300 ${
                isSelected
                  ? "border-[var(--color-primary)]/60 shadow-[0_0_30px_rgba(109,0,26,0.2)] ring-1 ring-[var(--color-primary)]/40"
                  : "border-zinc-800/80 hover:border-zinc-700"
              }`}
              onClick={() => setTemplateId(tmpl.id)}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                  <Check size={11} className="text-white" />
                </div>
              )}

              {/* Template mini preview */}
              <div className="h-52 bg-white overflow-hidden relative border-b border-zinc-800/60" style={{ cursor: "pointer" }}>
                <div style={{ transform: "scale(0.28)", transformOrigin: "top left", width: 794, pointerEvents: "none" }}>
                  <TemplateRenderer templateId={tmpl.id} data={resumeData} scale={1} />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0B]/20" />
              </div>

              {/* Template info */}
              <div className={`p-4 ${isSelected ? "bg-[var(--color-primary)]/5" : "bg-zinc-900/40"}`}>
                <div className="flex items-start justify-between mb-1">
                  <div className="font-bold text-[#F4F4F5] text-sm">{tmpl.name}</div>
                  <div className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${tmpl.colors.accent}15`, color: tmpl.colors.accent, border: `1px solid ${tmpl.colors.accent}30` }}>
                    ATS {tmpl.atsScore}%
                  </div>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed mb-3">{tmpl.description}</p>
                <div className="flex flex-wrap gap-1">
                  {tmpl.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 text-[9px] font-bold bg-zinc-950/60 border border-zinc-800 text-zinc-500 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={() => setStep("form")}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(109,0,26,0.4)]"
        >
          Continue to Fill Details <ChevronRight size={15} />
        </button>
      </div>
    </motion.div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// FORM SECTION WRAPPERS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FormSection({ id, icon, label, active, onToggle, children }: {
  id: string; icon: React.ReactNode; label: string; active: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border transition-all duration-300 overflow-hidden bg-white/[0.01] ${active ? "border-[var(--color-primary)]/30 bg-white/[0.02]" : "border-white/[0.06] hover:border-white/[0.1]"}`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors outline-none ${active ? "bg-[var(--color-primary)]/10" : "bg-transparent hover:bg-white/[0.015]"}`}
      >
        <div className="flex items-center gap-2.5">
          <span className={`${active ? "text-[var(--accent)]" : "text-zinc-500"} transition-colors`}>{icon}</span>
          <span className={`text-sm font-bold uppercase tracking-wider font-display ${active ? "text-white" : "text-zinc-400"}`}>{label}</span>
        </div>
        {active ? <ChevronUp size={15} className="text-zinc-400" /> : <ChevronDown size={15} className="text-zinc-650" />}
      </button>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-5 border-t border-white/[0.05] bg-black/10">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Tag input for skills
function TagInput({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput("");
  };
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-display">{label}</label>
      <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 bg-white/[0.01] border border-white/[0.06] rounded-xl focus-within:border-[var(--color-primary)]/60 transition-colors duration-300">
        {values.map((v, i) => (
          <span key={i} className="flex items-center gap-1.5 px-2 py-0.5 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-accent)] text-[11px] font-bold rounded-md">
            {v}
            <button onClick={() => onChange(values.filter((_, j) => j !== i))} className="hover:text-red-400 transition-colors">
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
          placeholder={placeholder || `Type and press Enter`}
          className="flex-1 bg-transparent text-white text-xs outline-none placeholder:text-zinc-600 min-w-[140px] px-1"
        />
      </div>
      <p className="text-[9px] text-zinc-650 font-bold uppercase tracking-wider">Press Enter or comma to add</p>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ATS SCORE CALCULATION
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function calculateLiveATS(d: any) {
  let score = 0;
  // Personal Info
  if (d.personalInfo.fullName) score += 10;
  if (d.personalInfo.email) score += 5;
  if (d.personalInfo.phone) score += 5;
  if (d.personalInfo.linkedin) score += 5;
  if (d.personalInfo.github) score += 5;
  if (d.personalInfo.photo) score += 10; // Extra score for including photo
  
  // Summary
  if (d.summary && d.summary.length > 50) {
    score += Math.min(15, Math.floor(d.summary.length / 15));
  }
  
  // Experience
  if (d.experience && d.experience.length > 0) {
    score += Math.min(25, d.experience.length * 8);
    let bulletCount = 0;
    let metricCount = 0;
    d.experience.forEach((exp: any) => {
      if (exp.bullets) {
        exp.bullets.forEach((b: any) => {
          if (b.trim()) {
            bulletCount++;
            if (/\d+/.test(b)) {
              metricCount++;
            }
          }
        });
      }
    });
    score += Math.min(10, bulletCount * 1.5);
    score += Math.min(15, metricCount * 4);
  }
  
  // Education
  if (d.education && d.education.length > 0) score += 10;
  
  // Skills
  const skillCount = 
    ((d.skills?.technical?.length || 0) + 
     (d.skills?.frameworks?.length || 0) + 
     (d.skills?.tools?.length || 0));
  score += Math.min(15, skillCount * 1.5);

  return Math.min(100, score);
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// STEP 3 â€” FORM (LEFT) + LIVE PREVIEW (RIGHT)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FormStep() {
  const store = useResumeBuilderStore();
  const { resumeData: d, selectedTemplateId, setStep } = store;
  const [activeSection, setActiveSection] = useState("personal");
  const [aiLoading, setAiLoading] = useState(false);

  const toggleSection = (id: string) => setActiveSection(s => s === id ? "" : id);
  const liveATS = calculateLiveATS(d);

  const handleOptimizeSummary = async (summaryText: string) => {
    if (!summaryText.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-router", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "resume_create",
          payload: { text: summaryText }
        })
      });
      const result = await res.json();
      if (result.success && result.data?.improved) {
        store.updateSummary(result.data.improved);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleOptimizeExperience = async (exp: any) => {
    const validBullets = exp.bullets.filter(Boolean);
    if (validBullets.length === 0) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-router", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "resume_create",
          payload: { role: exp.role, company: exp.company, bullets: validBullets }
        })
      });
      const result = await res.json();
      if (result.success && result.data?.improved) {
        const cleanBullets = result.data.improved
          .split("\n")
          .map((b: string) => b.replace(/^[â€¢\-\*\d\.\s]+/, "").trim())
          .filter(Boolean);
        if (cleanBullets.length > 0) {
          store.updateExperience(exp.id, { bullets: cleanBullets });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {/* Back button */}
      <button onClick={() => setStep("template")} className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 font-bold uppercase tracking-wider mb-6 transition-colors">
        <ChevronLeft size={14} /> Back to Templates
      </button>

      <div className="flex gap-6 items-start">
        {/* â”€â”€ LEFT: Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="w-[480px] flex-shrink-0 space-y-3">
          {/* Live ATS Score Widget */}
          <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <span className="text-[9px] font-extrabold text-[#Fca5a5] uppercase tracking-widest block mb-0.5">Live Calibration</span>
              <h4 className="text-xs font-bold text-[#F4F4F5]">ATS Alignment Score</h4>
              <p className="text-[9px] text-zinc-500 mt-1 leading-relaxed">
                {liveATS < 50
                  ? "âš ï¸ Critical details missing. Expand resume keywords."
                  : liveATS < 80
                  ? "ðŸ‘ Good. Add metrics/technical skills to boost score."
                  : "âœ¨ Elite resume structure. Ready for McKinsey/FAANG."}
              </p>
            </div>
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="24" cy="24" r="20" className="stroke-zinc-850" strokeWidth="3" fill="transparent" />
                  <circle cx="24" cy="24" r="20" className="stroke-[var(--teal)] transition-all duration-500" strokeWidth="3.5" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * liveATS) / 100} fill="transparent" strokeLinecap="round" />
                </svg>
                <span className="absolute text-[11px] font-extrabold text-[#F4F4F5] font-mono">{liveATS}%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2 pt-1">
            <h3 className="text-base font-bold text-[#F4F4F5]">Fill Your Details</h3>
            <span className="text-[10px] font-bold text-zinc-500 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg">Live Preview â†’</span>
          </div>

          {/* PERSONAL INFO */}
          <FormSection id="personal" icon={<User size={15} />} label="Personal Information" active={activeSection === "personal"} onToggle={() => toggleSection("personal")}>
            <div className="grid grid-cols-2 gap-3">
              {/* Photo Uploader */}
              <div className="col-span-2 flex items-center gap-4 p-3 bg-zinc-950/40 rounded-xl border border-zinc-850">
                {d.personalInfo.photo ? (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[var(--teal)] flex-shrink-0">
                    <img src={d.personalInfo.photo} alt="Photo" className="w-full h-full object-cover" />
                    <button
                      onClick={() => store.updatePersonalInfo({ photo: "" })}
                      className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold text-red-450"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 border-dashed flex items-center justify-center text-zinc-650 text-[10px] font-bold flex-shrink-0">
                    No Photo
                  </div>
                )}
                <div className="flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Profile Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          store.updatePersonalInfo({ photo: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-zinc-500 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[9px] file:font-bold file:bg-[var(--teal)]/10 file:text-[#Fca5a5] hover:file:bg-[var(--teal)]/20 file:cursor-pointer cursor-pointer"
                  />
                </div>
              </div>

              <Input label="Full Name" value={d.personalInfo.fullName} onChange={e => store.updatePersonalInfo({ fullName: e.target.value })} placeholder="John Doe" className="col-span-2" />
              <Input label="Job Title / Role" value={d.personalInfo.title} onChange={e => store.updatePersonalInfo({ title: e.target.value })} placeholder="Software Engineer" className="col-span-2" />
              <Input label="Email" value={d.personalInfo.email} onChange={e => store.updatePersonalInfo({ email: e.target.value })} placeholder="john@email.com" icon={<Mail size={13} />} />
              <Input label="Phone" value={d.personalInfo.phone} onChange={e => store.updatePersonalInfo({ phone: e.target.value })} placeholder="+91 9876543210" icon={<Phone size={13} />} />
              <Input label="Location" value={d.personalInfo.location} onChange={e => store.updatePersonalInfo({ location: e.target.value })} placeholder="Chennai, India" icon={<MapPin size={13} />} className="col-span-2" />
              <Input label="LinkedIn URL" value={d.personalInfo.linkedin} onChange={e => store.updatePersonalInfo({ linkedin: e.target.value })} placeholder="linkedin.com/in/yourname" icon={<Linkedin size={13} />} className="col-span-2" />
              <Input label="GitHub / Portfolio" value={d.personalInfo.github} onChange={e => store.updatePersonalInfo({ github: e.target.value })} placeholder="github.com/yourname" icon={<Github size={13} />} />
              <Input label="Website" value={d.personalInfo.portfolio} onChange={e => store.updatePersonalInfo({ portfolio: e.target.value })} placeholder="yourwebsite.com" icon={<Globe size={13} />} />
            </div>
          </FormSection>

          {/* SUMMARY */}
          <FormSection id="summary" icon={<Lightbulb size={15} />} label="Professional Summary" active={activeSection === "summary"} onToggle={() => toggleSection("summary")}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Summary (2-4 sentences)</span>
              <button
                type="button"
                disabled={aiLoading || !d.summary.trim()}
                onClick={() => handleOptimizeSummary(d.summary)}
                className="text-[9px] text-[#Fca5a5] hover:text-white flex items-center gap-1 font-bold disabled:opacity-50"
              >
                {aiLoading ? "Optimizing..." : "âœ¨ AI Improve"}
              </button>
            </div>
            <Textarea
              value={d.summary}
              onChange={e => store.updateSummary(e.target.value)}
              placeholder="Results-driven software engineer with 3+ years of experience building scalable applications..."
              rows={5}
            />
            <p className="text-[10px] text-zinc-650 mt-2">âœ¦ Use strong action verbs. Quantify achievements where possible.</p>
          </FormSection>

          {/* EXPERIENCE */}
          <FormSection id="experience" icon={<Briefcase size={15} />} label="Work Experience" active={activeSection === "experience"} onToggle={() => toggleSection("experience")}>
            {d.experience.map((exp, i) => (
              <ExperienceCard key={exp.id} exp={exp} index={i} aiLoading={aiLoading} onOptimize={handleOptimizeExperience} />
            ))}
            <button onClick={store.addExperience} className="w-full mt-3 py-2.5 border border-dashed border-zinc-700 hover:border-[var(--teal)]/50 text-zinc-500 hover:text-[#Fca5a5] text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5">
              <Plus size={13} /> Add Work Experience
            </button>
          </FormSection>

          {/* EDUCATION */}
          <FormSection id="education" icon={<GraduationCap size={15} />} label="Education" active={activeSection === "education"} onToggle={() => toggleSection("education")}>
            {d.education.map((edu, i) => (
              <EducationCard key={edu.id} edu={edu} index={i} />
            ))}
            <button onClick={store.addEducation} className="w-full mt-3 py-2.5 border border-dashed border-zinc-700 hover:border-[var(--teal)]/50 text-zinc-500 hover:text-[#Fca5a5] text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5">
              <Plus size={13} /> Add Education
            </button>
          </FormSection>

          {/* SKILLS */}
          <FormSection id="skills" icon={<Zap size={15} />} label="Skills" active={activeSection === "skills"} onToggle={() => toggleSection("skills")}>
            <div className="space-y-4">
              <TagInput label="Technical Skills / Languages" values={d.skills.technical} onChange={v => store.updateSkills({ technical: v })} placeholder="Python, Java, TypeScript..." />
              <TagInput label="Frameworks & Libraries" values={d.skills.frameworks} onChange={v => store.updateSkills({ frameworks: v })} placeholder="React, FastAPI, PyTorch..." />
              <TagInput label="Tools & Platforms" values={d.skills.tools} onChange={v => store.updateSkills({ tools: v })} placeholder="Docker, AWS, Git, Jira..." />
              <TagInput label="Soft Skills" values={d.skills.soft} onChange={v => store.updateSkills({ soft: v })} placeholder="Leadership, Communication..." />
            </div>
          </FormSection>

          {/* PROJECTS */}
          <FormSection id="projects" icon={<Code size={15} />} label="Projects" active={activeSection === "projects"} onToggle={() => toggleSection("projects")}>
            {d.projects.map((proj, i) => (
              <ProjectCard key={proj.id} project={proj} index={i} />
            ))}
            <button onClick={store.addProject} className="w-full mt-3 py-2.5 border border-dashed border-zinc-700 hover:border-[var(--teal)]/50 text-zinc-500 hover:text-[#Fca5a5] text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5">
              <Plus size={13} /> Add Project
            </button>
          </FormSection>

          {/* CERTIFICATIONS */}
          <FormSection id="certs" icon={<Award size={15} />} label="Certifications" active={activeSection === "certs"} onToggle={() => toggleSection("certs")}>
            {d.certifications.map((cert) => (
              <div key={cert.id} className="grid grid-cols-2 gap-2 mb-3 p-3 bg-zinc-950/30 rounded-lg border border-zinc-800/60">
                <Input label="Certificate Name" value={cert.name} onChange={e => store.updateCertification(cert.id, { name: e.target.value })} placeholder="AWS Solutions Architect" className="col-span-2" />
                <Input label="Issuer" value={cert.issuer} onChange={e => store.updateCertification(cert.id, { issuer: e.target.value })} placeholder="Amazon Web Services" />
                <Input label="Date" value={cert.date} onChange={e => store.updateCertification(cert.id, { date: e.target.value })} placeholder="2024" />
                <button onClick={() => store.removeCertification(cert.id)} className="col-span-2 flex items-center gap-1 text-[10px] text-red-500 hover:text-red-400 font-bold mt-1 w-fit">
                  <Trash2 size={11} /> Remove
                </button>
              </div>
            ))}
            <button onClick={store.addCertification} className="w-full mt-1 py-2.5 border border-dashed border-zinc-700 hover:border-[var(--teal)]/50 text-zinc-500 hover:text-[#Fca5a5] text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5">
              <Plus size={13} /> Add Certification
            </button>
          </FormSection>

          {/* LANGUAGES */}
          <FormSection id="languages" icon={<Languages size={15} />} label="Languages" active={activeSection === "languages"} onToggle={() => toggleSection("languages")}>
            {d.languages.map((lang) => (
              <div key={lang.id} className="flex gap-2 mb-2 items-end">
                <Input label="Language" value={lang.language} onChange={e => store.updateLanguage(lang.id, { language: e.target.value })} placeholder="English" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Level</label>
                  <select
                    value={lang.proficiency}
                    onChange={e => store.updateLanguage(lang.id, { proficiency: e.target.value as any })}
                    className="h-10 bg-white/[0.03] border border-zinc-800/80 text-[#F4F4F5] text-sm rounded-lg px-3 outline-none"
                  >
                    {["Native", "Fluent", "Advanced", "Intermediate", "Basic"].map(p => (
                      <option key={p} value={p} className="bg-[#121214]">{p}</option>
                    ))}
                  </select>
                </div>
                <button onClick={() => store.removeLanguage(lang.id)} className="h-10 mb-0 flex items-center text-red-500 hover:text-red-400">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            <button onClick={store.addLanguage} className="w-full mt-2 py-2.5 border border-dashed border-zinc-700 hover:border-[var(--teal)]/50 text-zinc-500 hover:text-[#Fca5a5] text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5">
              <Plus size={13} /> Add Language
            </button>
          </FormSection>

          {/* Continue */}
          <div className="flex justify-between pt-4">
            <button onClick={store.resetBuilder} className="flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-bold text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all uppercase tracking-wider">
              <RotateCcw size={12} /> Start Over
            </button>
            <button
              onClick={() => setStep("preview")}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(109,0,26,0.4)]"
            >
              Preview & Export <Eye size={15} />
            </button>
          </div>
        </div>

        {/* â”€â”€ RIGHT: Live Preview â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="flex-1 sticky top-[100px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Spacing Density</span>
              <div className="flex bg-zinc-950 border border-zinc-850 rounded-lg p-0.5 overflow-hidden">
                {(["compact", "normal", "spacious"] as const).map((dOption) => (
                  <button
                    key={dOption}
                    onClick={() => store.setSpacingDensity(dOption)}
                    className={`px-3 py-1 text-[9px] font-extrabold uppercase rounded-md transition-all ${
                      (d.spacingDensity || "normal") === dOption
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-zinc-550 hover:text-zinc-300"
                    }`}
                  >
                    {dOption}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <TemplateQuickSwitch />
            </div>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-auto max-h-[calc(100vh-220px)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
              <div style={{ width: 794 * 0.55 + 32, padding: 16 }}>
                <div style={{ transform: "scale(0.55)", transformOrigin: "top left", width: 794, flexShrink: 0 }}>
                  <TemplateRenderer templateId={selectedTemplateId} data={d} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Quick template switcher inside form view
function TemplateQuickSwitch() {
  const { selectedCategory, selectedTemplateId, setTemplateId } = useResumeBuilderStore();
  const templates = selectedCategory ? getTemplatesByCategory(selectedCategory) : [];
  return (
    <div className="flex gap-1 bg-zinc-950 border border-zinc-850 p-1 rounded-lg">
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => setTemplateId(t.id)}
          title={t.name}
          className={`w-6 h-6 rounded-md border transition-all ${selectedTemplateId === t.id ? "border-[#Fca5a5] bg-[var(--teal)] scale-105" : "border-zinc-800 hover:border-zinc-650"}`}
          style={{ background: selectedTemplateId === t.id ? undefined : t.colors.accent + "15" }}
        />
      ))}
    </div>
  );
}

// Experience card inside form
function ExperienceCard({ exp, index, aiLoading, onOptimize }: { exp: ExperienceItem; index: number; aiLoading: boolean; onOptimize: (exp: ExperienceItem) => void }) {
  const store = useResumeBuilderStore();
  return (
    <div className="mb-4 p-4 bg-zinc-950/30 rounded-xl border border-zinc-800/60 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Experience {index + 1}</span>
        <button onClick={() => store.removeExperience(exp.id)} className="text-red-500 hover:text-red-400 transition-colors">
          <Trash2 size={13} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input label="Job Title" value={exp.role} onChange={e => store.updateExperience(exp.id, { role: e.target.value })} placeholder="Software Engineer" className="col-span-2" />
        <Input label="Company" value={exp.company} onChange={e => store.updateExperience(exp.id, { company: e.target.value })} placeholder="Google" />
        <Input label="Location" value={exp.location} onChange={e => store.updateExperience(exp.id, { location: e.target.value })} placeholder="Bangalore, IN" />
        <Input label="Start Date" value={exp.startDate} onChange={e => store.updateExperience(exp.id, { startDate: e.target.value })} placeholder="Jan 2022" />
        <Input label="End Date" value={exp.endDate} onChange={e => store.updateExperience(exp.id, { endDate: e.target.value })} placeholder="Present" />
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">Bullet Points (Achievements)</label>
          <button
            type="button"
            disabled={aiLoading || exp.bullets.filter(Boolean).length === 0}
            onClick={() => onOptimize(exp)}
            className="text-[9px] text-[#Fca5a5] hover:text-white flex items-center gap-1 font-bold disabled:opacity-50"
          >
            {aiLoading ? "Optimizing..." : "âœ¨ AI Improve Bullets"}
          </button>
        </div>
        {exp.bullets.map((b, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              value={b}
              onChange={e => store.updateExperienceBullet(exp.id, i, e.target.value)}
              placeholder="â€¢ Developed REST APIs improving response time by 35%..."
              className="flex-1 h-9 bg-white/[0.03] border border-zinc-800/80 text-[#F4F4F5] text-[11px] rounded-lg px-3 placeholder:text-zinc-650 outline-none focus:border-[var(--color-primary)] transition-colors"
            />
            {exp.bullets.length > 1 && (
              <button onClick={() => store.removeExperienceBullet(exp.id, i)} className="text-zinc-650 hover:text-red-400 transition-colors flex-shrink-0">
                <X size={12} />
              </button>
            )}
          </div>
        ))}
        <button onClick={() => store.addExperienceBullet(exp.id)} className="text-[10px] font-bold text-zinc-500 hover:text-[#Fca5a5] flex items-center gap-1 transition-colors">
          <Plus size={11} /> Add bullet
        </button>
      </div>
    </div>
  );
}

// Education card
function EducationCard({ edu, index }: { edu: EducationItem; index: number }) {
  const store = useResumeBuilderStore();
  return (
    <div className="mb-4 p-4 bg-zinc-950/30 rounded-xl border border-zinc-800/60 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Education {index + 1}</span>
        <button onClick={() => store.removeEducation(edu.id)} className="text-red-500 hover:text-red-400"><Trash2 size={13} /></button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input label="Institution" value={edu.institution} onChange={e => store.updateEducation(edu.id, { institution: e.target.value })} placeholder="IIT Madras" className="col-span-2" />
        <Input label="Degree" value={edu.degree} onChange={e => store.updateEducation(edu.id, { degree: e.target.value })} placeholder="B.Tech" />
        <Input label="Field / Specialization" value={edu.field} onChange={e => store.updateEducation(edu.id, { field: e.target.value })} placeholder="Computer Science" />
        <Input label="Start Year" value={edu.startDate} onChange={e => store.updateEducation(edu.id, { startDate: e.target.value })} placeholder="2019" />
        <Input label="End Year" value={edu.endDate} onChange={e => store.updateEducation(edu.id, { endDate: e.target.value })} placeholder="2023" />
        <Input label="GPA / Percentage" value={edu.gpa || ""} onChange={e => store.updateEducation(edu.id, { gpa: e.target.value })} placeholder="8.5 / 10" className="col-span-2" />
      </div>
    </div>
  );
}

// Project card
function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  const store = useResumeBuilderStore();
  return (
    <div className="mb-4 p-4 bg-zinc-950/30 rounded-xl border border-zinc-800/60 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Project {index + 1}</span>
        <button onClick={() => store.removeProject(project.id)} className="text-red-500 hover:text-red-400"><Trash2 size={13} /></button>
      </div>
      <Input label="Project Name" value={project.name} onChange={e => store.updateProject(project.id, { name: e.target.value })} placeholder="E-Commerce Platform" />
      <Textarea label="Description" value={project.description} onChange={e => store.updateProject(project.id, { description: e.target.value })} placeholder="Built a full-stack e-commerce platform with 10k+ active users..." rows={3} />
      <TagInput
        label="Tech Stack"
        values={project.techStack || []}
        onChange={v => store.updateProject(project.id, { techStack: v })}
        placeholder="React, Node.js, MongoDB..."
      />
      <div className="grid grid-cols-2 gap-2">
        <Input label="GitHub URL" value={project.githubUrl || ""} onChange={e => store.updateProject(project.id, { githubUrl: e.target.value })} placeholder="github.com/..." icon={<Github size={12} />} />
        <Input label="Live URL" value={project.liveUrl || ""} onChange={e => store.updateProject(project.id, { liveUrl: e.target.value })} placeholder="yourproject.com" icon={<Globe size={12} />} />
      </div>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// STEP 4 â€” PREVIEW & EXPORT
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PreviewStep() {
  const { resumeData: d, selectedTemplateId, selectedCategory, setStep } = useResumeBuilderStore();
  const [fullscreen, setFullscreen] = useState(false);
  const tmpl = TEMPLATE_REGISTRY.find(t => t.id === selectedTemplateId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Back */}
      <button onClick={() => setStep("form")} className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 font-bold uppercase tracking-wider mb-6 transition-colors">
        <ChevronLeft size={14} /> Back to Edit
      </button>

      <div className="flex gap-6 items-start">
        {/* Left: controls */}
        <div className="w-72 flex-shrink-0 space-y-4">
          <div className="p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/20">
            <h3 className="text-sm font-bold text-[#F4F4F5] mb-4 flex items-center gap-2">
              <Eye size={14} className="text-[#Fca5a5]" /> Resume Ready
            </h3>

            {/* Quick Stats */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between p-2.5 bg-zinc-950/40 rounded-lg border border-zinc-800/60">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Template</span>
                <span className="text-[11px] font-bold text-[#F4F4F5]">{tmpl?.name}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-zinc-950/40 rounded-lg border border-zinc-800/60">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">ATS Score</span>
                <span className="text-[11px] font-bold text-emerald-400">{tmpl?.atsScore}%</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-zinc-950/40 rounded-lg border border-zinc-800/60">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Category</span>
                <span className="text-[11px] font-bold text-[#F4F4F5]">{selectedCategory}</span>
              </div>
            </div>

            {/* Export */}
            <button
              onClick={printResume}
              className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(109,0,26,0.4)] flex items-center justify-center gap-2 mb-3"
            >
              <Download size={14} /> Download PDF
            </button>
            <button
              onClick={() => setFullscreen(true)}
              className="w-full py-3 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 mb-3"
            >
              <Maximize2 size={14} /> Full Screen
            </button>
            <button
              onClick={() => setStep("form")}
              className="w-full py-3 border border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              â† Back to Edit
            </button>
          </div>

          {/* Template quick switcher */}
          <div className="p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/20">
            <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Switch Template</h4>
            <div className="space-y-2">
              {selectedCategory && getTemplatesByCategory(selectedCategory as TemplateCategory).map(t => (
                <button
                  key={t.id}
                  onClick={() => useResumeBuilderStore.getState().setTemplateId(t.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                    selectedTemplateId === t.id
                      ? "border-[var(--teal)]/50 bg-[var(--teal)]/10 text-[#F4F4F5]"
                      : "border-zinc-800/60 bg-zinc-950/20 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-[11px] font-bold">{t.name}</span>
                  <span className="text-[9px] font-bold text-emerald-500">{t.atsScore}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Full A4 Preview */}
        <div className="flex-1 min-w-0">
          <div id="resume-print-area" className="shadow-2xl rounded-lg overflow-hidden bg-white w-[794px]">
            <TemplateRenderer templateId={selectedTemplateId} data={d} scale={1} />
          </div>
        </div>
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 overflow-auto"
          >
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button onClick={printResume} className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl">
                <Download size={13} /> PDF
              </button>
              <button onClick={() => setFullscreen(false)} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 text-white text-sm font-bold rounded-xl">
                <X size={13} /> Close
              </button>
            </div>
            <div className="flex items-start justify-center p-16">
              <div className="shadow-2xl">
                <TemplateRenderer templateId={selectedTemplateId} data={d} scale={1} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MAIN BUILDER PAGE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface ResumeBuilderPageProps {
  existingAnalysis?: any;
  onBack?: () => void;
}

export default function ResumeBuilderPage({ existingAnalysis, onBack }: ResumeBuilderPageProps) {
  const { step, resetBuilder, importFromAnalysis } = useResumeBuilderStore();

  // Auto-import from existing analysis if provided
  useEffect(() => {
    if (existingAnalysis) {
      importFromAnalysis(existingAnalysis);
    }
  }, []);

  return (
    <div className="max-w-[1280px] mx-auto px-4 pb-16 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {onBack && (
              <button onClick={onBack} className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 font-bold uppercase tracking-wider mr-2">
                <ChevronLeft size={13} /> Back
              </button>
            )}
            <span className="text-[9px] font-extrabold text-zinc-650 uppercase tracking-widest">Hirevix AI</span>
            <span className="text-[9px] text-zinc-800">â€¢</span>
            <span className="text-[9px] font-extrabold text-[var(--teal)] uppercase tracking-widest">Resume Builder</span>
          </div>
          <h1 className="text-2xl font-light text-[#F4F4F5] font-serif">
            Build Your <span className="text-[var(--teal)] font-semibold">Professional Resume</span>
          </h1>
        </div>
        {existingAnalysis && step !== "category" && (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-950/20 border border-emerald-900/30 rounded-xl">
            <Wand2 size={13} className="text-emerald-400" />
            <span className="text-[11px] font-bold text-emerald-400">Imported from your analysis</span>
          </div>
        )}
      </div>

      {/* Step bar */}
      <StepBar current={step} />

      <AnimatePresence mode="wait">
        {step === "aistart" && <AIStartStep key="aistart" />}
        {step === "category" && <CategoryStep key="category" />}
        {step === "template" && <TemplateStep key="template" />}
        {step === "form" && <FormStep key="form" />}
        {step === "preview" && <PreviewStep key="preview" />}
      </AnimatePresence>
    </div>
  );
}

