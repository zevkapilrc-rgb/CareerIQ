"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResumeIntelligenceDashboard } from "./ResumeIntelligenceDashboard";
import ResumeBuilderPage from "@/src/components/ResumeBuilder/ResumeBuilderPage";
import { useResumeBuilderStore } from "@/src/components/ResumeBuilder/useResumeBuilderStore";
import {
  FileText, BarChart, User, Target, AlertTriangle, Sparkles, RefreshCw,
  Cpu, Award, Zap, ShieldCheck, Activity, Terminal, UploadCloud, CheckCircle,
  ChevronRight, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/src/state/useAppStore";
import PremiumButton from "@/src/components/ui/PremiumButton";
import GlassCard from "@/src/components/ui/GlassCard";
import { Textarea } from "@/src/components/ui/Input";

interface ResumeAnalysis {
  improved_summary: any;
  enhanced_experience: any;
  skill_optimization: any;
  scores: any;
  recruiter_simulation: any;
  resume_breakdown: any;
  skill_intelligence: any;
  career_insights: any;
  risk_detection: any;
  interview_questions: any;
  personal_branding: any;
  portfolio_content: any;
  optimized_resume: any;
  candidateInformation?: any;
}

export const ResumeAnalyzerPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Advanced pipeline state
  const [scanMode, setScanMode] = useState<"standard" | "elite">("elite");
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [thinkingLogs, setThinkingLogs] = useState<string[]>([]);
  const timersRef = useRef<any[]>([]);
  const [hasCachedAnalysis, setHasCachedAnalysis] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("ciq-resume-analysis");
      if (cached) {
        setHasCachedAnalysis(true);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validTypes = [
        ".pdf",
        ".docx",
        ".doc",
        ".txt",
        ".rtf",
        ".png",
        ".jpg",
        ".jpeg",
        ".webp",
        ".heic",
        ".heif",
      ];
      const matchesType = validTypes.some((ext) => droppedFile.name.toLowerCase().endsWith(ext));
      if (matchesType) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Invalid file format. Please upload a PDF, DOCX, DOC, TXT, RTF, HEIC, HEIF, or Image file.");
      }
    }
  };

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a resume file to analyze");
      return;
    }

    setLoading(true);
    setThinking(true);
    setError(null);
    setCurrentStep(0);
    setThinkingLogs([
      "[HIREVIX Sandbox] Initializing secure parsing environment...",
      "[HIREVIX Sandbox] Allocating vector mapping buffer...",
    ]);

    const stepsTimeline = [
      { log: "[System] Preprocessing document layout & metadata...", delay: 1500 },
      { log: "[Gemini AI] Extracting parsing segments and raw tokens...", delay: 3500 },
      { log: "[Gemini AI] Matching key competencies to industry competency matrix...", delay: 6000 },
      { log: "[Gemini AI] Simulating recruiter cognitive filter pass...", delay: 8500 },
      { log: "[System] Calibrating career roadmaps & personal branding vectors...", delay: 11000 },
      { log: "[System] Compiling finalized resume intelligence report...", delay: 13500 },
    ];

    clearTimers();
    stepsTimeline.forEach((item, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index + 1);
        setThinkingLogs((prev) => [...prev, item.log]);
      }, item.delay);
      timersRef.current.push(timer);
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      let url = `/api/resume/analyze?scan_mode=${scanMode}`;
      if (jobDescription) {
        url += `&job_description=${encodeURIComponent(jobDescription)}`;
      }

      const headers: Record<string, string> = {};
      const token = typeof window !== "undefined" ? localStorage.getItem("ciq-jwt") : null;
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `API returned status ${response.status}`);
      }

      const resJson = await response.json();
      if (!resJson.success) throw new Error(resJson.error || "Failed to analyze resume");

      const analysisData = resJson.data;

      localStorage.setItem("ciq-resume-analysis", JSON.stringify(analysisData));

      let coreSkills = analysisData.skill_intelligence?.core_skills || [];
      if (!coreSkills || coreSkills.length === 0) {
        coreSkills = ["Communication", "Problem Solving", "Adaptability"];
      }

      const domain = analysisData.career_insights?.suggested_career_paths?.[0] || "Professional";
      const bio =
        analysisData.personal_branding?.short_bio ||
        analysisData.improved_summary?.improved ||
        "";
      const projects = analysisData.portfolio_content?.projects || [];
      const education = analysisData.personal_branding?.linkedin_headline || "";

      let experience = 0;
      const yearsExpStr = analysisData.candidateInformation?.yearsOfExperience?.extractedContent;
      if (yearsExpStr && yearsExpStr !== "Not Mentioned in Resume.") {
        const parsedYears = parseFloat(yearsExpStr);
        if (!isNaN(parsedYears)) experience = parsedYears;
      } else {
        experience = Math.max(0, analysisData.enhanced_experience?.items?.length || 0);
      }

      useAppStore.getState().updateProfile({
        skills: coreSkills,
        domain,
        bio,
        projects,
        education,
        experience,
        resumeAnalysis: analysisData,
      });
      useAppStore.getState().addXP(500, "AI Resume scan completed");

      clearTimers();
      setAnalysis(analysisData);
      setThinking(false);
    } catch (err: any) {
      clearTimers();
      setError(err.message || "Failed to analyze resume. Please verify your Gemini API key.");
      setThinking(false);
    } finally {
      setLoading(false);
    }
  };

  const [mode, setMode] = useState<"select" | "builder" | "upgrade">("select");

  if (analysis) {
    return (
      <div className="resumeAiRoot relative w-full">
        <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
          <PremiumButton
            variant="secondary"
            size="sm"
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("ciq-resume-analysis");
              }
              setHasCachedAnalysis(false);
              setAnalysis(null);
              setFile(null);
              setJobDescription("");
              setMode("select");
            }}
          >
            <RefreshCw size={12} className="mr-1.5" />
            New Calibration
          </PremiumButton>

          <Link href="/profile" className="no-underline">
            <PremiumButton variant="primary" size="sm">
              View Profile â†’
            </PremiumButton>
          </Link>
        </div>
        <ResumeIntelligenceDashboard analysis={analysis} />
      </div>
    );
  }

  if (mode === "builder") {
    return (
      <ResumeBuilderPage
        existingAnalysis={null}
        onBack={() => setMode("select")}
      />
    );
  }

  if (mode === "select") {
    return (
      <div className="min-h-[calc(100vh-120px)] py-8 flex items-start justify-center p-4 max-w-[1200px] mx-auto w-full">
        <div className="w-full relative overflow-hidden">
          {/* Ambient details */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full filter blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute -bottom-20 left-0 w-[350px] h-[350px] bg-zinc-900/30 rounded-full filter blur-[100px] pointer-events-none" />

          {/* Hero Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                <span className="text-[10px] font-extrabold text-[var(--color-accent)] uppercase tracking-widest font-display">
                  HIREVIX AI v4 â€¢ Elite Resume Engine
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-1 mb-4 font-display tracking-tight leading-[1.1]">
              Resume Intelligenceâ„¢
              <span className="block text-[var(--accent)] font-extrabold">Command Center</span>
            </h1>
            <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-2xl mb-6">
              The world&apos;s most premium AI career calibration system. Multi-stage parsing, interactive ATS compatibility metrics, and gap simulations to futureproof your positioning.
            </p>

            {/* Trust Stats Bar */}
            <div className="flex flex-wrap gap-8 pb-6 border-b border-white/[0.05]">
              {[
                { label: "Resumes Calibrated", value: "2.4M+" },
                { label: "ATS Configurations Matrixed", value: "380+" },
                { label: "Avg. Score Lift", value: "+34pts" },
                { label: "Callback Multiplier", value: "3.2Ã—" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-xl font-bold text-white font-mono leading-none">{s.value}</span>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {hasCachedAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-accent)]">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Previous Calibration Cache Detected</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">We recovered a verified resume intelligence index in your secure local session.</p>
                </div>
              </div>
              <PremiumButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  const cached = localStorage.getItem("ciq-resume-analysis");
                  if (cached) {
                    try {
                      setAnalysis(JSON.parse(cached));
                    } catch (e) {
                      console.error("Failed to parse cached analysis", e);
                    }
                  }
                }}
              >
                Restore Index Report â†’
              </PremiumButton>
            </motion.div>
          )}

          {/* Choice Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Create Resume Card */}
            <GlassCard glow={false} hoverLift={true} className="flex flex-col justify-between p-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-accent)]">
                      <FileText size={22} />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-[var(--accent)] uppercase tracking-widest block font-display">AI Builder Studio</span>
                      <span className="text-[10px] font-bold text-zinc-500">Construct from raw coordinates</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[var(--color-primary)]/10 text-[var(--color-accent)] border border-[var(--color-primary)]/25 uppercase tracking-wide font-display">STUDIO</span>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2.5 font-display">
                    Create Career Document
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Build a dynamic, calibrated resume from scratch. Gather educational and technical highlights, align layouts, and export standardized PDFs with real-time formatting validation.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 mb-8">
                  {[
                    "Standardized premium multi-page templates",
                    "Context-aware AI bullet optimizations",
                    "Integrated technical skill catalog maps",
                    "Real-time A4 rendering simulator engine",
                    "Automated ATS compliance format check",
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-zinc-300">
                      <span className="text-[var(--accent)] text-xs font-extrabold">âœ¦</span>
                      <span className="text-[11px] font-semibold tracking-wide">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <PremiumButton
                variant="primary"
                onClick={() => {
                  useResumeBuilderStore.getState().resetBuilder();
                  setMode("builder");
                }}
                className="w-full"
              >
                <FileText size={15} />
                Open Builder Studio
                <ChevronRight size={15} />
              </PremiumButton>
            </GlassCard>

            {/* Analyze Resume Card */}
            <GlassCard glow={false} hoverLift={true} className="flex flex-col justify-between p-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <BarChart size={22} />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest block font-display">Dual LLM Pipeline</span>
                      <span className="text-[10px] font-bold text-zinc-500">Gemini & Llama integration</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide font-display">ANALYSIS</span>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2.5 font-display">
                    Resume Intelligence Analyzer
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Examine your existing resume. Execute parsing checks, verify semantic consistency ratios, simulate recruiter scoring metrics, and extract skill gaps immediately.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 mb-8">
                  {[
                    "Calibrate layout parser compatibility metrics",
                    "Simulate 6-second initial screening flow",
                    "Identify semantic missing keyword sets",
                    "Analyze salary and role growth potential",
                    "Run AI-orchestrated risk validation checks",
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-zinc-300">
                      <span className="text-emerald-400 text-xs font-extrabold">â—ˆ</span>
                      <span className="text-[11px] font-semibold tracking-wide">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <PremiumButton
                variant="glow"
                onClick={() => setMode("upgrade")}
                className="w-full border-emerald-950 hover:bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] text-emerald-400"
              >
                <UploadCloud size={15} />
                Initialize Calibration
                <ChevronRight size={15} />
              </PremiumButton>
            </GlassCard>
          </div>

          {/* Bottom stats banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { icon: <Cpu size={14} />, label: "Orchestration Pipeline", desc: "Dual LLM failsafe architecture" },
              { icon: <ShieldCheck size={14} />, label: "Vault Privacy", desc: "Secure sandboxed profiles" },
              { icon: <Zap size={14} />, label: "Execution Speed", desc: "Average response < 12 seconds" },
              { icon: <Award size={14} />, label: "Compliance Index", desc: "Standard format verified compatibility" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3.5 p-4 bg-white/[0.015] border border-white/[0.05] rounded-xl">
                <div className="text-[var(--accent)] flex-shrink-0">{item.icon}</div>
                <div className="flex flex-col gap-0.5">
                  <div className="text-[10px] font-bold text-white uppercase tracking-wide">{item.label}</div>
                  <div className="text-[9px] text-zinc-500 font-semibold">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-zinc-650 font-bold uppercase tracking-wider">
            <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />
            Compliance Shield: Encrypted connection active. Document indices are stored locally and never sold or shared.
          </div>
        </div>
      </div>
    );
  }

  const pipelineSteps = [
    { label: "Extraction", icon: <UploadCloud size={14} />, desc: "Layout & Text parsing" },
    { label: "ATS Heatmap", icon: <LayersIcon size={14} />, desc: "Check structural syntax" },
    { label: "Competencies", icon: <Target size={14} />, desc: "Keyword matching" },
    { label: "Simulation", icon: <Activity size={14} />, desc: "Recruiter bias pass" },
    { label: "Roadmaps", icon: <Award size={14} />, desc: "Career timeline mapping" },
    { label: "Executive summary", icon: <ShieldCheck size={14} />, desc: "Verify profile indicators" },
  ];

  return (
    <div className="min-h-[calc(100vh-110px)] py-8 flex items-center justify-center p-4 max-w-[1200px] mx-auto w-full">
      <div className="w-full flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.05] pb-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_rgba(109,0,26,0.5)] animate-pulse" />
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest font-display">
                HIREVIX AI â€¢ Resume Intelligence
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-white mt-1.5 tracking-tight font-display">
              ATS + Recruiter Calibration Engine
            </h1>
          </div>
          
          <PremiumButton
            variant="secondary"
            size="sm"
            onClick={() => setMode("select")}
            className="self-start md:self-center"
          >
            <ArrowLeft size={14} className="mr-1.5" />
            Back to Options
          </PremiumButton>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Context & Specifications */}
          <div className="lg:col-span-5 flex flex-col justify-between p-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[10px] font-bold tracking-wider text-[var(--color-accent)] uppercase mb-4 font-display">
                <Sparkles size={11} className="animate-pulse" />
                HIREVIX AI Scan Engine
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight leading-snug mb-3 font-display">
                Career Alignment Calibration
              </h2>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-6">
                Our dual-pipeline scan engine executes a comprehensive 13-stage parsing assessment. Verify technical depth, pinpoint critical keywords gaps, and align skills to global demand.
              </p>

              <div className="space-y-4 my-6">
                {[
                  {
                    title: "ATS Parsing Compliance",
                    desc: "Checks header indexing, layout parsing, and standard keyword mapping compliance.",
                    score: "99.8%",
                  },
                  {
                    title: "Cognitive Screening Simulation",
                    desc: "Simulates initial recruiter profile review using advanced semantic scoring.",
                    score: "Instant",
                  },
                  {
                    title: "Target Domain Alignment",
                    desc: "Maps your capabilities against global job vectors and suggested trajectories.",
                    score: "Adaptive",
                  },
                  {
                    title: "Competency Gap Metrics",
                    desc: "Highlights critical, missing, and trending industry certifications.",
                    score: "Real-time",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 bg-white/[0.01] border border-white/[0.05] p-3.5 rounded-xl hover:border-white/[0.1] transition-all duration-300"
                  >
                    <div className="w-5 h-5 rounded bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-accent)] text-[10px] font-bold flex-shrink-0 mt-0.5 shadow-[0_0_8px_rgba(109,0,26,0.15)]">
                      âœ“
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                        <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-1.5 py-0.2 rounded flex-shrink-0">
                          {item.score}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed mt-1 font-semibold">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-zinc-650 font-bold uppercase tracking-wider mt-4 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              Security Guarantee: Your credentials remain sandboxed.
            </div>
          </div>

          {/* Right Column: Upload Form */}
          <GlassCard glow={false} hoverLift={false} className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between h-full relative">
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-1.5 font-display">Initialize Calibration</h3>
                <p className="text-xs text-zinc-400 font-semibold">Upload credentials or resume to begin real-time mapping</p>
              </div>

              <div className="mb-6">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Scanning Pipeline Intensity
                </span>
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-black/40 border border-white/[0.06] rounded-xl">
                  <button
                    type="button"
                    onClick={() => setScanMode("standard")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      scanMode === "standard"
                        ? "bg-white/[0.04] text-white shadow-lg border border-white/[0.08]"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <Cpu size={12} /> Standard Scan
                  </button>
                  <button
                    type="button"
                    onClick={() => setScanMode("elite")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      scanMode === "elite"
                        ? "bg-[var(--color-primary)] text-white shadow-lg border border-[var(--color-primary-dark)]/30 shadow-[var(--color-primary)]/20"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <Zap size={12} className="text-amber-400" /> Elite Deep Scan
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Upload Resume Document
                </span>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className="relative"
                  style={{ cursor: loading ? "not-allowed" : "pointer" }}
                >
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.doc,.txt,.rtf,.heic,.heif,image/*"
                    className="absolute inset-0 opacity-0 z-20 cursor-pointer"
                    disabled={loading}
                  />
                  <div
                    className={`border rounded-xl p-8 text-center transition-all duration-300 relative overflow-hidden ${
                      file
                        ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                        : isDragOver
                          ? "border-[var(--teal)] bg-[var(--teal)]/5 shadow-[0_0_15px_rgba(109,0,26,0.1)]"
                          : "border-white/[0.06] bg-black/20 hover:border-white/[0.12]"
                    }`}
                  >
                    <div className={`mb-3 flex justify-center ${file ? "text-emerald-400 animate-pulse" : "text-[var(--accent)]"}`}>
                      <UploadCloud size={32} />
                    </div>
                    <p className="text-sm text-[#F4F4F5] font-semibold">
                      {file ? file.name : "Drag & drop your resume file here"}
                    </p>
                    <p className="text-xs text-zinc-500 font-semibold mt-1">PDF, DOCX, DOC, RTF, Images (Max 15MB)</p>

                    {file && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 flex items-center justify-center gap-4 text-[10px] text-zinc-400 bg-black/40 border border-white/[0.06] p-2 rounded-lg"
                      >
                        <span>
                          Type: <strong className="text-zinc-200">{file.name.split(".").pop()?.toUpperCase()}</strong>
                        </span>
                        <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                        <span>
                          Size: <strong className="text-zinc-200">{(file.size / (1024 * 1024)).toFixed(2)} MB</strong>
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <Textarea
                  label="Target Job Description (Highly Recommended)"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste target job description to run alignment matching ratios..."
                  disabled={loading}
                  className="min-h-[90px] h-24 text-xs font-mono"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-red-400 text-xs font-semibold mb-5 flex items-start gap-2.5"
                  >
                    <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {thinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-black border border-white/[0.06] rounded-xl p-5 mb-5 space-y-4"
                  >
                    <div className="grid grid-cols-6 gap-2">
                      {pipelineSteps.map((step, idx) => {
                        const isCompleted = currentStep > idx;
                        const isActive = currentStep === idx;
                        return (
                          <div key={idx} className="flex flex-col items-center gap-1.5 text-center">
                            <div
                              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                                isCompleted
                                  ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                                  : isActive
                                    ? "bg-[var(--teal)]/30 border-[var(--teal)] text-[var(--accent)] shadow-[0_0_10px_rgba(109,0,26,0.2)] animate-pulse"
                                    : "bg-white/[0.02] border-white/[0.04] text-zinc-500"
                              }`}
                              title={step.desc}
                            >
                              {isCompleted ? <CheckCircle size={12} /> : step.icon}
                            </div>
                            <span
                              className={`text-[8px] font-bold uppercase tracking-wider whitespace-nowrap ${
                                isActive ? "text-[var(--accent)]" : isCompleted ? "text-emerald-400" : "text-zinc-650"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-[#050507] border border-white/[0.06] rounded-lg p-3 font-mono text-[9px] text-[#A5F3FC] h-24 overflow-y-auto space-y-1.5 no-scrollbar">
                      <div className="flex items-center gap-1.5 text-zinc-500 mb-1 border-b border-zinc-900 pb-1">
                        <Terminal size={10} />
                        <span>HIREVIX ENGINE PIPELINE FEED</span>
                      </div>
                      {thinkingLogs.map((log, i) => (
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={i}
                          className={
                            log.startsWith("[Gemini")
                              ? "text-[#C084FC]"
                              : log.startsWith("[System")
                                ? "text-[#38BDF8]"
                                : "text-zinc-400"
                          }
                        >
                          {log}
                        </motion.div>
                      ))}
                      <div className="flex gap-1 items-center text-zinc-500">
                        <span className="w-1 h-2.5 bg-zinc-500 animate-pulse" />
                        <span>Waiting for stream response...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-3 mt-6">
              <PremiumButton
                onClick={handleAnalyze}
                disabled={!file || loading}
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 rounded-full border-2 border-zinc-550 border-t-white"
                    />
                    <span>Calibrating coordinates...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Zap size={14} className="text-amber-400 animate-bounce" />
                    <span>Run Calibration Process</span>
                  </div>
                )}
              </PremiumButton>

              <PremiumButton
                onClick={() => {
                  const demoProfile = {
                    name: "Alex Dev",
                    bio: "Passionate Full-Stack Software Engineer with 3+ years of experience building web applications.",
                    avatar: "ðŸ’»",
                    skills: ["React", "Next.js", "TypeScript", "Node.js", "Python", "Docker", "AWS", "SQL", "Tailwind CSS"],
                    experience: 3,
                    domain: "Full-Stack Software Engineering",
                    projects: ["E-Commerce Platform", "Real-Time Chat App", "AI Resume Analyzer"],
                    education: "B.S. in Computer Science",
                    xp: 250,
                    level: "Explorer",
                    resumeAnalysis: {
                      scores: {
                        ats_score: 82,
                        recruiter_score: 85,
                        impact_score: 78,
                        skill_depth_score: 80,
                        career_consistency_score: 90,
                        overall_score: 83,
                      },
                      improved_summary: {
                        original: "Developer looking for opportunities.",
                        improved:
                          "Highly motivated Full-Stack Engineer with 3+ years of experience designing and deploying scalable web services, optimizing frontend speeds by 40% using Next.js, and integrating robust database designs.",
                        key_keywords: ["Next.js", "Scalability", "API Integration", "Database Design"],
                        ats_compliance: 88,
                      },
                      enhanced_experience: {
                        items: [
                          {
                            original: "Built features for a website.",
                            improved:
                              "Engineered responsive frontend modules using React and Next.js, boosting user retention rates by 15% and optimizing average page render speeds.",
                            action_verbs: ["Engineered"],
                            metrics: ["15%"],
                            impact_score: 85,
                          },
                          {
                            original: "Managed back-end databases.",
                            improved:
                              "Designed and implemented REST APIs and database schema migrations using Node.js and SQL, reducing endpoint latency by 25%.",
                            action_verbs: ["Designed", "Implemented"],
                            metrics: ["25%"],
                            impact_score: 82,
                          },
                        ],
                        overall_strength: 83,
                      },
                      skill_optimization: {
                        current_skills: ["React", "TypeScript", "Node.js", "Python", "SQL"],
                        optimized_skills: [
                          "React.js",
                          "TypeScript Development",
                          "Node.js Backend",
                          "Python Programming",
                          "SQL Database Management",
                        ],
                        industry_keywords: ["Microservices", "RESTful APIs", "CI/CD Pipelines", "Cloud Deployment"],
                        missing_trending: ["Kubernetes", "GraphQL", "Next.js 14", "AWS Lambda"],
                        coverage_percentage: 82,
                      },
                      recruiter_simulation: {
                        first_impression:
                          "Solid Full-Stack profile with strong metrics. Layout is clean and achievement-oriented.",
                        shortlist_probability: 88,
                        key_concerns: ["Needs more cloud architecture keywords", "More leadership details would improve senior matching"],
                        strengths_spotted: ["Clear action-focused bullet points", "Good skill diversity", "Strong education alignment"],
                      },
                      resume_breakdown: {
                        bullet_analyses: [
                          {
                            original: "Built features for a website.",
                            issues: ["No metrics"],
                            improved: "Engineered responsive frontend modules, boosting user retention rates by 15%.",
                            action_verb: "Engineered",
                            metric_added: "15%",
                          },
                        ],
                        generic_content_percentage: 15,
                        metrics_percentage: 75,
                        improvement_potential: 85,
                      },
                      skill_intelligence: {
                        core_skills: ["React", "Next.js", "TypeScript", "Node.js", "SQL"],
                        weak_skills: ["Python (Basic)"],
                        missing_skills: ["Docker", "Kubernetes"],
                        future_skills: ["AI Engineering", "GraphQL"],
                        skill_gap: 25,
                      },
                      career_insights: {
                        role_alignment: 85,
                        suggested_career_paths: ["Senior Full-Stack Engineer", "Frontend Architect", "Backend Specialist"],
                        growth_recommendations: [
                          "Gain deeper containerization experience (Docker/Kubernetes)",
                          "Lead technical designs for new features",
                        ],
                        timeline_to_next_level: "12-18 months",
                      },
                      risk_detection: {
                        generic_content: false,
                        skill_mismatch: false,
                        timeline_issues: false,
                        employment_gaps: false,
                        risks: ["Minor skill gaps in modern devops practices"],
                        severity: "low",
                      },
                      interview_questions: {
                        technical: [
                          {
                            category: "React",
                            question: "Explain the virtual DOM and Next.js server component rendering.",
                          },
                          {
                            category: "System Design",
                            question: "How would you design a highly scalable real-time notification service?",
                          },
                        ],
                        hr: [
                          {
                            category: "Behavioral",
                            question: "Tell me about a conflict you resolved with a team member.",
                          },
                        ],
                        situational: [
                          {
                            category: "Scenario",
                            question: "How do you handle hot-fixing a critical production bug under tight deadlines?",
                          },
                        ],
                      },
                      personal_branding: {
                        linkedin_headline: "Full-Stack Software Engineer | Next.js Specialist | Node.js Backend",
                        short_bio:
                          "Full-Stack developer dedicated to constructing performant web architectures and interactive user experiences.",
                        tagline: "Building seamless digital solutions from database to viewport.",
                        elevator_pitch: "I specialize in React/Next.js frontends and Node.js backends. I love optimizing speed and scaling APIs.",
                      },
                      portfolio_content: {
                        hero: "Crafting High-Performance Web Applications That Scale.",
                        about:
                          "I'm a full-stack engineer who builds elegant, reliable, and user-centric web platforms.",
                        skills_section: "Specialized in typescript, react, and backend web services.",
                        projects: ["Collaborative Canvas", "NeuralLink Analytics", "Veloce API Gateway"],
                        contact_cta: "Ready to scale your product? Let's connect.",
                      },
                      optimized_resume: {
                        content:
                          "ALEX DEV - FULL STACK ENGINEER\nEmail: alex@example.com | GitHub: github.com/alexdev\n\nPROFESSIONAL SUMMARY\nHighly motivated Full-Stack Engineer with 3+ years of experience designing and deploying scalable web services...\n\nEXPERIENCE\nSoftware Engineer | 2021 - Present\n- Engineered responsive frontend modules using React/Next.js, boosting retention by 15%...",
                        is_tailored: false,
                        job_matched_percentage: 0,
                      },
                    },
                  };

                  useAppStore.getState().updateProfile(demoProfile);
                  setAnalysis(demoProfile.resumeAnalysis);
                }}
                variant="secondary"
                className="w-full text-[var(--accent)] border-[var(--teal)]/35 hover:bg-[var(--teal)]/10"
              >
                âš¡ Load Demo Profile (Instant Unlock)
              </PremiumButton>
            </div>

            <div className="mt-5 pt-5 border-t border-white/[0.05] grid grid-cols-3 gap-3">
              {[
                { icon: <BarChart size={14} />, label: "ATS Heatmap" },
                { icon: <User size={14} />, label: "Recruiter Sim" },
                { icon: <Target size={14} />, label: "Gap Analysis" },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-1.5 p-3 bg-white/[0.015] border border-white/[0.05] rounded-xl text-center hover:bg-white/[0.03] transition-all duration-300"
                >
                  <div className="text-[var(--accent)]">{feature.icon}</div>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider font-display">{feature.label}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

const LayersIcon = ({ size }: { size: number }) => (
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
  >
    <path d="m12 3-10 5 10 5 10-5-10-5Z" />
    <path d="m2 17 10 5 10-5" />
    <path d="m2 12 10 5 10-5" />
  </svg>
);

export default ResumeAnalyzerPage;

