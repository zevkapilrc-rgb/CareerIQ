"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/src/state/useAppStore";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  CheckCircle,
  AlertTriangle,
  Briefcase,
  Target,
  Brain,
  Code,
  TrendingUp,
  Award,
  Zap,
  MessageSquare,
  UserCheck,
  Layout,
  Star,
  Activity,
  ChevronRight,
  Loader2
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function ResumeIntelligencePage() {
  const { role, profile, setProfile, addNotification } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Wait for client-side hydration
  useEffect(() => { setMounted(true); }, []);

  // Authentication Guard — only run after mounted (zustand hydrated)
  useEffect(() => {
    if (!mounted) return;
    if (role === "guest") {
      if (typeof window !== "undefined") {
        localStorage.setItem("ciq-redirect-after-login", "resume");
      }
      router.replace("/login");
    }
  }, [role, router, mounted]);

  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"upload" | "processing" | "results">("upload");
  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState("");
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const handleFile = async (file: File) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain"
    ];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|docx|doc|txt)$/i)) {
      addNotification("Unsupported format. Please upload PDF, DOCX, or TXT.", "warning");
      return;
    }

    setStatus("processing");
    setProgress(0);

    const steps = [
      "Extracting text & structure...",
      "Normalizing skill taxonomies...",
      "Running ATS optimization engine...",
      "Simulating recruiter impressions...",
      "Generating career intelligence..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      setProgress((p) => {
        const newP = p + Math.random() * 15;
        return newP > 95 ? 95 : newP;
      });
      if (currentStep < steps.length) {
        setProcessingStep(steps[currentStep]);
        currentStep++;
      }
    }, 600);

    try {
      // Simulate backend API call
      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        // body: formData
      });
      const json = await res.json();

      clearInterval(interval);
      setProgress(100);
      setProcessingStep("Analysis Complete!");

      setTimeout(() => {
        setData(json.data);
        setStatus("results");
        addNotification("Resume Intelligence Analysis Complete", "success");
        
        // Extract domain from API response
        const suggestedPath = json.data?.careerInsights?.suggestedPath || "";
        const detectedDomain = suggestedPath.split("->")[0]?.trim() || "Full-Stack Developer";
        
        // Build complete profile from the analysis
        const coreSkills = json.data?.skills?.core || [];
        const weakSkills = json.data?.skills?.weak || [];
        const missingSkills = json.data?.skills?.missing || [];
        const futureSkills = json.data?.skills?.future || [];
        const atsScore = json.data?.scores?.atsScore || 0;
        const experience = json.data?.experience?.length || 2;
        const projects = json.data?.portfolioContent?.projects?.split(", ") || [];
        const education = json.data?.personalBranding?.linkedInHeadline || "";
        
        const updatedProfile = {
            name: profile?.name || "User",
            email: profile?.email || "",
            phone: profile?.phone || "",
            skills: coreSkills,
            experience: experience,
            domain: detectedDomain,
            projects: projects,
            education: education,
            xp: (profile?.xp || 0) + 300,
            level: profile?.level || "Specialist"
        };

        // Update profile in global store so other modules become active
        setProfile(updatedProfile);

        // Save full analysis data to localStorage for dashboard & other modules
        const fullAnalysis = {
            ...json.data,
            detectedDomain,
            coreSkills,
            weakSkills,
            missingSkills,
            futureSkills,
            atsScore,
            timestamp: new Date().toISOString(),
            profileName: updatedProfile.name,
            profileEmail: updatedProfile.email,
        };
        if (typeof window !== "undefined") {
            localStorage.setItem("ciq-resume-analysis", JSON.stringify(fullAnalysis));
        }

        // Send email with resume details for future reference
        if (updatedProfile.email) {
            sendResumeEmail(updatedProfile, fullAnalysis);
        }

      }, 800);
    } catch (error) {
      clearInterval(interval);
      setStatus("upload");
      addNotification("Analysis failed. Please try again.", "warning");
    }
  };

  // Email resume details for future reference
  const sendResumeEmail = async (prof: any, analysis: any) => {
    try {
      const emailBody = {
        service_id: "service_careeriq",
        template_id: "template_resume",
        user_id: "YOUR_EMAILJS_PUBLIC_KEY",
        template_params: {
          to_email: prof.email,
          to_name: prof.name,
          domain: prof.domain,
          skills: (analysis.coreSkills || []).join(", "),
          weak_skills: (analysis.weakSkills || []).join(", "),
          missing_skills: (analysis.missingSkills || []).join(", "),
          ats_score: analysis.atsScore || "N/A",
          experience: prof.experience,
          career_path: analysis.careerInsights?.suggestedPath || "N/A",
          recommendations: (analysis.careerInsights?.growthRecommendations || []).join("\n• "),
          linkedin_headline: analysis.personalBranding?.linkedInHeadline || "",
          timestamp: new Date().toLocaleString(),
        }
      };
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailBody),
      });
      addNotification("Resume details sent to your email for future reference!", "success");
    } catch {
      // Silently fail — email is a bonus feature
      console.log("Email sending skipped — configure EmailJS keys in production.");
    }
  };

  if (role === "guest") return null;

  return (
    <div className="main-content" style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem" }}>
      <AnimatePresence mode="wait">
        {status === "upload" && (
          <UploadSection key="upload" onUpload={handleFile} fileRef={fileRef} />
        )}
        {status === "processing" && (
          <ProcessingSection key="processing" progress={progress} step={processingStep} />
        )}
        {status === "results" && data && (
          <ResultsSection key="results" data={data} activeTab={activeTab} setActiveTab={setActiveTab} onReset={() => setStatus("upload")} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD SECTION
// ─────────────────────────────────────────────────────────────────────────────
function UploadSection({ onUpload, fileRef }: { onUpload: (f: File) => void; fileRef: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center"
    >
      <div className="mb-6 relative">
        <div className="absolute -inset-4 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center relative z-10 shadow-xl shadow-purple-500/20 border border-white/10">
          <Brain className="text-white w-10 h-10" />
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
        Resume Intelligence Engine
      </h1>
      <p className="text-gray-400 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
        Upload your resume for a comprehensive 360° AI analysis. We evaluate ATS compatibility,
        recruiter impact, skill depth, and generate personalized career growth strategies.
      </p>

      <div
        className="w-full max-w-2xl bg-white/5 border border-purple-500/30 border-dashed rounded-3xl p-12 cursor-pointer hover:bg-white/[0.08] hover:border-purple-500/50 transition-all duration-300 group"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files[0]) onUpload(e.dataTransfer.files[0]);
        }}
      >
        <UploadCloud className="w-16 h-16 text-purple-400 mx-auto mb-6 group-hover:scale-110 group-hover:text-purple-300 transition-transform duration-300" />
        <h3 className="text-xl font-semibold text-white mb-2">Drag & Drop Resume</h3>
        <p className="text-gray-400 text-sm mb-6">Supports PDF, DOCX, TXT (Max 5MB)</p>
        
        <button className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg shadow-purple-500/20">
          Browse Files
        </button>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.doc,.txt"
          onChange={(e) => {
            if (e.target.files?.[0]) onUpload(e.target.files[0]);
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-3xl mt-16">
        {[
          { icon: Target, title: "ATS Optimization", desc: "Beat the bots with keyword alignment" },
          { icon: Eye, title: "Recruiter View", desc: "Simulate a human review in seconds" },
          { icon: TrendingUp, title: "Career Insights", desc: "Data-driven growth recommendations" }
        ].map((f, i) => (
          <div key={i} className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10">
            <f.icon className="w-6 h-6 text-purple-400 mb-3" />
            <h4 className="text-sm font-semibold text-white mb-1">{f.title}</h4>
            <p className="text-xs text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCESSING SECTION
// ─────────────────────────────────────────────────────────────────────────────
function ProcessingSection({ progress, step }: { progress: number; step: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex flex-col items-center justify-center min-h-[70vh]"
    >
      <div className="relative w-48 h-48 mb-8">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="96" cy="96" r="88" className="stroke-white/10" strokeWidth="8" fill="none" />
          <motion.circle
            cx="96" cy="96" r="88"
            className="stroke-purple-500"
            strokeWidth="8"
            fill="none"
            strokeDasharray={2 * Math.PI * 88}
            initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - progress / 100) }}
            transition={{ type: "tween", ease: "linear", duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-2" />
          <span className="text-3xl font-bold text-white">{Math.round(progress)}%</span>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">AI Engine Analyzing</h2>
      <p className="text-purple-300 font-medium animate-pulse">{step}</p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESULTS SECTION
// ─────────────────────────────────────────────────────────────────────────────
function ResultsSection({ data, activeTab, setActiveTab, onReset }: any) {
  const tabs = [
    { id: "overview", label: "Dashboard Overview", icon: Layout },
    { id: "advanced", label: "Deep ATS Analytics", icon: Target },
    { id: "breakdown", label: "Content Breakdown", icon: FileText },
    { id: "skills", label: "Skill Intelligence", icon: Code },
    { id: "interview", label: "Interview Prep", icon: MessageSquare },
    { id: "branding", label: "Personal Branding", icon: Star }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-10">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Intelligence Report</h1>
          <p className="text-gray-400">Comprehensive AI analysis of your professional profile.</p>
        </div>
        <button onClick={onReset} className="text-sm px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors border border-white/10">
          Analyze New Resume
        </button>
      </div>

      {/* Navigation */}
      <div className="flex space-x-2 mb-8 bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Areas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && <OverviewTab data={data} />}
          {activeTab === "advanced" && <AdvancedAtsTab data={data} />}
          {activeTab === "breakdown" && <BreakdownTab data={data} />}
          {activeTab === "skills" && <SkillsTab data={data} />}
          {activeTab === "interview" && <InterviewTab data={data} />}
          {activeTab === "branding" && <BrandingTab data={data} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function AdvancedAtsTab({ data }: { data: any }) {
  const adv = data.advancedMetrics;
  if (!adv) return <div className="text-gray-400">Advanced metrics currently unavailable.</div>;

  return (
    <div className="space-y-6">
      {/* Top Section: Competitiveness & Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Competitiveness */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-3 py-1 rounded-bl-xl font-bold">TOP {100 - adv.competitiveness.percentile}%</div>
          <h3 className="text-xl font-bold text-white mb-2">Market Competitiveness</h3>
          <p className="text-purple-200 text-sm mb-6">Compared to 85,000+ {adv.competitiveness.domain} resumes.</p>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full border-4 border-purple-500 flex items-center justify-center bg-black/20 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <span className="text-3xl font-black text-white">{adv.competitiveness.percentile}</span>
            </div>
            <div>
              <div className="text-sm text-gray-300 font-medium mb-1">Your Percentile Score</div>
              <div className="text-xs text-red-300 bg-red-900/30 px-2 py-1 rounded border border-red-500/20 inline-block mt-2">
                Missing: {adv.competitiveness.topMissingRequirement}
              </div>
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Impact Quantification</h3>
          <p className="text-gray-400 text-sm mb-6">Percentage of bullet points containing measurable metrics.</p>
          
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-white font-bold">{adv.impact.percentageQuantified}% Quantified</span>
            <span className="text-emerald-400 font-bold">Goal: 60%+</span>
          </div>
          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-4">
            <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full" style={{ width: `${adv.impact.percentageQuantified}%` }} />
          </div>
          
          <div className="text-xs text-gray-400 mt-4 border-t border-white/10 pt-4">
            <span className="font-semibold text-gray-200 mb-2 block">Detected Metrics:</span>
            <div className="flex flex-wrap gap-2">
              {adv.impact.detectedMetrics.map((m: string, i: number) => (
                <span key={i} className="bg-white/10 text-white px-2 py-1 rounded text-[10px] font-mono">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Verbs & Format */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Action Verbs */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Action Verb Analysis</h3>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-emerald-400 font-bold mb-2 uppercase tracking-wide">Strong Verbs Detected</div>
              <div className="flex flex-wrap gap-2">
                {adv.actionVerbs.strong.map((v: string, i: number) => (
                  <span key={i} className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded border border-emerald-500/20">{v}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-red-400 font-bold mb-2 uppercase tracking-wide">Weak Verbs to Replace</div>
              <div className="flex flex-wrap gap-2">
                {adv.actionVerbs.weak.map((v: string, i: number) => (
                  <span key={i} className="text-xs bg-red-500/10 text-red-300 px-2 py-1 rounded border border-red-500/20">{v}</span>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">"{adv.actionVerbs.verdict}"</p>
          </div>
        </div>

        {/* Readability & Format */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Readability & Format</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <div className="text-xs text-gray-400 mb-1">Total Word Count</div>
              <div className="text-xl font-bold text-white">{adv.readability.wordCount}</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <div className="text-xs text-gray-400 mb-1">Reading Level</div>
              <div className="text-sm font-bold text-emerald-400">{adv.readability.readingLevel}</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <div className="text-xs text-gray-400 mb-1">Bullet Length</div>
              <div className="text-sm font-bold text-emerald-400">{adv.readability.bulletLength}</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <div className="text-xs text-gray-400 mb-1">White Space</div>
              <div className="text-sm font-bold text-amber-400">{adv.readability.whiteSpace}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ data }: { data: any }) {
  const scores = data.scores;
  
  const radarData = [
    { subject: 'ATS', A: scores.atsScore, fullMark: 100 },
    { subject: 'Recruiter', A: scores.recruiterScore, fullMark: 100 },
    { subject: 'Impact', A: scores.impactScore, fullMark: 100 },
    { subject: 'Skills', A: scores.skillDepthScore, fullMark: 100 },
    { subject: 'Consistency', A: scores.careerConsistencyScore, fullMark: 100 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Score Cards */}
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "ATS Score", value: scores.atsScore, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
          { label: "Recruiter", value: scores.recruiterScore, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
          { label: "Impact", value: scores.impactScore, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
          { label: "Skill Depth", value: scores.skillDepthScore, color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20" },
          { label: "Consistency", value: scores.careerConsistencyScore, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" }
        ].map((s, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${s.bg} ${s.border} flex flex-col items-center justify-center text-center`}>
            <div className="text-xs text-gray-300 font-medium mb-2 uppercase tracking-wider">{s.label}</div>
            <div className={`text-4xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recruiter Simulation */}
      <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center mb-6">
          <Eye className="w-5 h-5 text-purple-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">Recruiter Simulation</h3>
        </div>
        
        <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-5 mb-6">
          <div className="text-xs text-purple-300 uppercase tracking-wider font-semibold mb-2">6-Second Impression</div>
          <p className="text-gray-200 text-lg leading-relaxed">"{data.recruiterSimulation.sixSecondImpression}"</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-semibold text-gray-300 mb-3">Key Concerns</div>
            <ul className="space-y-3">
              {data.recruiterSimulation.keyConcerns.map((c: string, i: number) => (
                <li key={i} className="flex items-start">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-400">{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-300 mb-3">Risk Detection</div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-gray-400">Generic Content</span>
                <span className="text-emerald-400 font-medium">Low Risk</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-gray-400">Skill Mismatch</span>
                <span className="text-amber-400 font-medium">Moderate Risk</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Timeline Issues</span>
                <span className="text-emerald-400 font-medium">Low Risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-2">Profile Balance</h3>
        <p className="text-xs text-gray-400 mb-4">Multi-dimensional analysis</p>
        <div className="flex-1 min-h-[250px] -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Radar name="Score" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function BreakdownTab({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Summary Optimization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl relative">
            <div className="absolute top-0 right-0 bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-bl-xl rounded-tr-xl font-medium">Original</div>
            <p className="text-gray-300 text-sm leading-relaxed mt-2">{data.summary.original}</p>
          </div>
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl relative">
            <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-bl-xl rounded-tr-xl font-medium">AI Improved</div>
            <p className="text-gray-200 text-sm leading-relaxed mt-2">{data.summary.improved}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Experience Bullet Rewrite</h3>
        <div className="space-y-6">
          {data.experience.map((exp: any, idx: number) => (
            <div key={idx} className="border border-white/5 rounded-xl overflow-hidden bg-black/20">
              <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="text-xs text-red-400 font-semibold mb-1 uppercase">Original (Issues Detected)</div>
                  <p className="text-gray-400 text-sm">{exp.original}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {exp.issues.map((iss: string, i: number) => (
                      <span key={i} className="text-[10px] bg-red-500/10 text-red-300 px-2 py-1 rounded border border-red-500/20">{iss}</span>
                    ))}
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center px-2">
                  <ChevronRight className="w-5 h-5 text-purple-500" />
                </div>
                <div className="flex-1 bg-purple-500/5 p-4 rounded-lg border border-purple-500/10">
                  <div className="text-xs text-emerald-400 font-semibold mb-1 uppercase">Optimized version</div>
                  <p className="text-gray-200 text-sm leading-relaxed">{exp.improved}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillsTab({ data }: { data: any }) {
  const sk = data.skills;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center mb-6">
          <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">Core Strengths</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {sk.core.map((s: string, i: number) => (
            <span key={i} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg text-sm font-medium">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">Weak / Unquantified</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {sk.weak.map((s: string, i: number) => (
            <span key={i} className="px-3 py-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-lg text-sm font-medium">
              {s}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">These skills lack projects or metrics proving your proficiency.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center mb-6">
          <Target className="w-5 h-5 text-red-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">Missing Keywords</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {sk.missing.map((s: string, i: number) => (
            <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-300 border border-red-500/20 rounded-lg text-sm font-medium">
              + {s}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">Highly requested in your target domain but missing from resume.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center mb-6">
          <Zap className="w-5 h-5 text-purple-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">Future Skills Focus</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {sk.future.map((s: string, i: number) => (
            <span key={i} className="px-3 py-1.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-lg text-sm font-medium">
              {s}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">Learn these to stay ahead of the curve in your industry.</p>
      </div>
    </div>
  );
}

function InterviewTab({ data }: { data: any }) {
  const iq = data.interviewQuestions;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center mb-4 pb-4 border-b border-white/5">
            <Code className="w-5 h-5 text-blue-400 mr-2" />
            <h3 className="font-semibold text-white">Technical Questions</h3>
          </div>
          <ul className="space-y-4">
            {iq.technical.slice(0, 3).map((q: string, i: number) => (
              <li key={i} className="text-sm text-gray-300 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                <span className="text-blue-400 font-bold mr-2">Q:</span>{q}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center mb-4 pb-4 border-b border-white/5">
            <UserCheck className="w-5 h-5 text-emerald-400 mr-2" />
            <h3 className="font-semibold text-white">Behavioral / HR</h3>
          </div>
          <ul className="space-y-4">
            {iq.hr.slice(0, 3).map((q: string, i: number) => (
              <li key={i} className="text-sm text-gray-300 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                <span className="text-emerald-400 font-bold mr-2">Q:</span>{q}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center mb-4 pb-4 border-b border-white/5">
            <Activity className="w-5 h-5 text-amber-400 mr-2" />
            <h3 className="font-semibold text-white">Situational</h3>
          </div>
          <ul className="space-y-4">
            {iq.situational.slice(0, 3).map((q: string, i: number) => (
              <li key={i} className="text-sm text-gray-300 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                <span className="text-amber-400 font-bold mr-2">Q:</span>{q}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <button className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg shadow-purple-500/20 flex items-center">
          <MessageSquare className="w-4 h-4 mr-2" />
          Start Mock Interview Session
        </button>
      </div>
    </div>
  );
}

function BrandingTab({ data }: { data: any }) {
  const brand = data.personalBranding;

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">LinkedIn Optimization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Target Headline</div>
            <div className="bg-black/30 border border-white/10 p-4 rounded-xl text-gray-200 font-medium">
              {brand.linkedInHeadline}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Personal Tagline</div>
            <div className="bg-black/30 border border-white/10 p-4 rounded-xl text-gray-200 italic">
              "{brand.tagline}"
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">About Section / Bio</div>
            <div className="bg-black/30 border border-white/10 p-5 rounded-xl text-gray-300 leading-relaxed text-sm">
              {brand.shortBio}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Your 30-Second Elevator Pitch</h3>
        <p className="text-sm text-purple-200/70 mb-4">Memorize this for networking events and interviews.</p>
        <div className="bg-black/40 p-5 rounded-xl text-gray-200 leading-relaxed italic border-l-4 border-purple-500">
          "{brand.thirtySecondPitch}"
        </div>
      </div>
    </div>
  );
}

// A mock Eye icon since we didn't import it from lucide
function Eye(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
