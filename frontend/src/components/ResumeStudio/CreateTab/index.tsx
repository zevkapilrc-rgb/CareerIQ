"use client";

import React, { useState } from "react";
import { Sparkles, FileText, Mic, AlertCircle, RefreshCw, Upload, MicOff } from "lucide-react";
import IntakeModal from "./IntakeModal";
import CanvasEditor from "./CanvasEditor";
import { ResumeProfile } from "@/src/types";

interface CreateTabProps {
  draftProfile: ResumeProfile | null;
  onProfileChange: (newProfile: ResumeProfile | null) => void;
}

export const CreateTab: React.FC<CreateTabProps> = ({ draftProfile, onProfileChange }) => {
  const [showIntake, setShowIntake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Speech Recognition states
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  // Initialize a blank ResumeProfile
  const createBlankProfile = (
    jobTitle: string,
    seniority: "entry" | "mid" | "senior",
    industry: string
  ): ResumeProfile => {
    return {
      id: Math.random().toString(36).slice(2, 9),
      userId: "user-id",
      rawText: "",
      personalInfo: {
        name: "Professional Resume",
        email: "your.email@example.com",
        phone: "+1 (555) 123-4567",
        location: "City, Country",
      },
      summary: "",
      education: [],
      experience: [],
      projects: [],
      certifications: [],
      skills: {
        technical: [],
        soft: [],
        tools: [],
      },
      atsScore: 0,
      atsIssues: [],
      careerSignals: {
        domain: jobTitle,
        seniority,
        yearsOfExperience: seniority === "senior" ? 8 : seniority === "mid" ? 4 : 1,
        // custom field for intake tracking
        jobTitle,
        industry,
      } as any,
      lastAnalyzedAt: new Date().toISOString(),
      version: 1,
    };
  };

  // 1. Path 1: Start from Scratch - submit intake
  const handleIntakeSubmit = async (data: {
    jobTitle: string;
    seniority: "entry" | "mid" | "senior";
    industry: string;
  }) => {
    setShowIntake(false);
    setLoading(true);
    setLoadingMessage("Generating professional summary section with HIREVIX AI...");

    try {
      const response = await fetch("/api/resume/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: "summary",
          context: {
            jobTitle: data.jobTitle,
            seniority: data.seniority,
            industry: data.industry,
          },
        }),
      });

      const resData = await response.json();
      if (!resData.success) throw new Error(resData.error || "Failed to generate summary");

      const profile = createBlankProfile(data.jobTitle, data.seniority, data.industry);
      profile.summary = resData.text;

      onProfileChange(profile);
    } catch (e: any) {
      setError(e.message || "Failed to initiate resume profile");
    } finally {
      setLoading(false);
    }
  };

  // 2. Path 2: Import Resume
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setLoadingMessage("Reading file & running secure Gemini extractor...");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Call the existing analyze endpoint
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to extract profile");
      const resJson = await response.json();
      if (!resJson.success) throw new Error(resJson.error || "Extraction failed");

      const extracted = resJson.data;

      // Translate output to ResumeProfile structure
      const parsed: ResumeProfile = {
        id: Math.random().toString(36).slice(2, 9),
        userId: "user-id",
        rawText: "",
        personalInfo: {
          name: extracted.candidateInformation?.fullName?.extractedContent || "Professional",
          email: extracted.candidateInformation?.email?.extractedContent || "",
          phone: extracted.candidateInformation?.phoneNumber?.extractedContent || "",
          location: extracted.candidateInformation?.location?.extractedContent || "",
          linkedin: extracted.candidateInformation?.linkedInProfile?.extractedContent || "",
          portfolio: extracted.candidateInformation?.portfolioOrGitHub?.extractedContent || "",
        },
        summary: extracted.improved_summary?.improved || extracted.candidateInformation?.professionalSummaryOrObjectives?.extractedContent || "",
        education: (extracted.educationAnalysis || []).map((edu: any) => ({
          institution: edu.institution || "",
          degree: edu.degree || "",
          field: edu.field || "",
          startDate: "2018",
          endDate: edu.graduationYear || "2022",
        })),
        experience: (extracted.enhanced_experience?.items || extracted.experienceAnalysis || []).map((exp: any) => ({
          company: exp.company || "",
          role: exp.role || "",
          startDate: exp.startDate || exp.duration?.split("-")?.[0]?.trim() || "2022",
          endDate: exp.endDate || exp.duration?.split("-")?.[1]?.trim() || "Present",
          bullets: exp.bullets || (exp.responsibilities ? [exp.responsibilities] : []),
        })),
        projects: (extracted.projectAnalysis || []).map((p: any) => ({
          name: p.projectName || "Project",
          description: p.description || "",
          technologies: p.technologies || [],
        })),
        certifications: extracted.candidateInformation?.certifications?.extractedContent?.split(",")?.map((c: string) => c.trim()) || [],
        skills: {
          technical: (extracted.skill_intelligence?.core_skills || []).map((s: string) => ({ name: s, category: "technical" })),
          soft: (extracted.skill_intelligence?.weak_skills || []).map((s: string) => ({ name: s, category: "soft" })),
          tools: [],
        },
        atsScore: extracted.scores?.overallResumeScore?.score || 80,
        atsIssues: (extracted.atsAnalysis?.issues || []).map((i: any) => ({
          severity: i.severity || "warning",
          section: i.section || "Experience",
          message: i.issue || i.message || "",
          fix: i.improvement || i.fix || "",
        })),
        careerSignals: {
          domain: extracted.career_insights?.suggested_career_paths?.[0] || "Engineering",
          seniority: extracted.candidateInformation?.candidateType?.extractedContent || "mid",
          yearsOfExperience: parseFloat(extracted.candidateInformation?.yearsOfExperience?.extractedContent) || 3,
        },
        lastAnalyzedAt: new Date().toISOString(),
        version: 1,
      };

      onProfileChange(parsed);
    } catch (err: any) {
      setError(err.message || "Failed to process resume file");
    } finally {
      setLoading(false);
    }
  };

  // 3. Path 3: Speak It (Voice to Resume)
  const handleVoiceTranscription = () => {
    setShowVoiceRecorder(true);
    setSpeechError(null);
    setTranscript("");

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("Browser Speech API is not supported. Please paste or type your bio details directly.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event: any) => {
      let finalStr = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalStr += event.results[i][0].transcript;
        }
      }
      setTranscript((prev) => prev + finalStr);
    };

    rec.onerror = (e: any) => {
      setSpeechError(`Speech recognition error: ${e.error}`);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.start();
    setIsListening(true);
    (window as any).currRec = rec;
  };

  const handleStopVoice = async () => {
    if ((window as any).currRec) {
      (window as any).currRec.stop();
    }
    setIsListening(false);

    if (!transcript) {
      setShowVoiceRecorder(false);
      return;
    }

    setLoading(true);
    setLoadingMessage("Parsing transcript and extracting profile details...");
    setShowVoiceRecorder(false);

    try {
      // Re-use same extraction logic via API, but simulating it since we have plain text
      // We'll call a quick extraction function or simulate generating draft profile
      const response = await fetch("/api/resume/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: "summary",
          context: {
            jobTitle: "Unstructured Profile",
            rawFacts: transcript,
          },
        }),
      });

      const resData = await response.json();
      if (!resData.success) throw new Error(resData.error || "Failed to parse speech");

      const profile = createBlankProfile("Voice Profile", "mid", "Tech");
      profile.summary = resData.text;

      // Add a simulated experience slot based on the speech
      profile.experience = [
        {
          company: "Extracted Company",
          role: "Extracted Role",
          startDate: "2023",
          endDate: "Present",
          bullets: ["Transcribed: " + transcript],
        },
      ];

      onProfileChange(profile);
    } catch (e: any) {
      setError(e.message || "Failed to process voice details");
    } finally {
      setLoading(false);
    }
  };

  // Render Editor Canvas if profile exists
  if (draftProfile) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] rounded-lg p-4">
          <div className="text-xs text-zinc-400">
            Currently working on: <strong className="text-white font-medium">{draftProfile.personalInfo?.name || "Draft Resume"}</strong>
          </div>
          <button
            onClick={() => {
              if (window.confirm("Start over? Your current edits will be cleared.")) {
                onProfileChange(null);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold font-display uppercase tracking-wider"
          >
            Clear Draft
          </button>
        </div>

        <CanvasEditor profile={draftProfile} onUpdate={onProfileChange} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Loading overlay */}
      {loading && (
        <div className="p-12 text-center bg-black/5 dark:bg-white/[0.02] border border-[var(--border)] rounded-xl flex flex-col items-center justify-center space-y-4">
          <RefreshCw size={24} className="animate-spin text-[var(--accent)]" />
          <p className="text-sm font-semibold text-[var(--text)] animate-pulse">{loadingMessage}</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/15 flex items-center gap-3 text-xs text-red-400">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Entry Cards (A1) */}
      {!loading && !showVoiceRecorder && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Scratch */}
          <div
            onClick={() => setShowIntake(true)}
            className="group cursor-pointer p-8 rounded-xl bg-black/5 dark:bg-white/[0.02] border border-[var(--border)] hover:border-[var(--color-primary)]/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[220px]"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)]/5 rounded-full filter blur-xl pointer-events-none group-hover:bg-[var(--color-primary)]/10" />
            <div>
              <Sparkles size={24} className="text-[var(--color-primary)] mb-4" />
              <h3 className="text-lg font-bold text-[var(--text)] font-display uppercase tracking-wider">
                Start from Scratch
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                Provide target job configurations and build your credentials section-by-section with AI guidance.
              </p>
            </div>
            <span className="text-[10px] font-extrabold text-[var(--color-primary)] uppercase tracking-wider group-hover:translate-x-1 inline-flex items-center gap-1 transition-all mt-6">
              Create Profile &rarr;
            </span>
          </div>

          {/* Card 2: Import */}
          <label className="group cursor-pointer p-8 rounded-xl bg-black/5 dark:bg-white/[0.02] border border-[var(--border)] hover:border-[var(--color-primary)]/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)]/5 rounded-full filter blur-xl pointer-events-none group-hover:bg-[var(--color-primary)]/10" />
            <input type="file" onChange={handleFileUpload} accept="*" className="hidden" />
            <div>
              <FileText size={24} className="text-[var(--color-primary)] mb-4" />
              <h3 className="text-lg font-bold text-[var(--text)] font-display uppercase tracking-wider">
                Import Resume
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                Upload your existing PDF, Word, image, or text file. HIREVIX will extract structured information instantly.
              </p>
            </div>
            <span className="text-[10px] font-extrabold text-[var(--color-primary)] uppercase tracking-wider group-hover:translate-x-1 inline-flex items-center gap-1 transition-all mt-6">
              Upload Any Format &rarr;
            </span>
          </label>

          {/* Card 3: Voice (A4) */}
          <div
            onClick={handleVoiceTranscription}
            className="group cursor-pointer p-8 rounded-xl bg-black/5 dark:bg-white/[0.02] border border-[var(--border)] hover:border-[var(--color-primary)]/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[220px]"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)]/5 rounded-full filter blur-xl pointer-events-none group-hover:bg-[var(--color-primary)]/10" />
            <div>
              <Mic size={24} className="text-[var(--color-accent)] mb-4" />
              <h3 className="text-lg font-bold text-[var(--text)] font-display uppercase tracking-wider">
                Speak It (Voice)
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                Just talk! Turn your spoken background details and work experiences into a polished resume layout.
              </p>
            </div>
            <span className="text-[10px] font-extrabold text-[var(--color-accent)] uppercase tracking-wider group-hover:translate-x-1 inline-flex items-center gap-1 transition-all mt-6">
              Start Recording &rarr;
            </span>
          </div>
        </div>
      )}

      {/* Voice Recorder Overlay (A4) */}
      {showVoiceRecorder && (
        <div className="p-8 text-center bg-black/5 dark:bg-white/[0.02] border border-[var(--border)] rounded-xl flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 flex items-center justify-center animate-pulse">
              <Mic size={24} className="text-[var(--color-primary)]" />
            </div>
            {isListening && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
              </span>
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-[var(--text)] font-display uppercase tracking-wider">
              {isListening ? "Listening... Speak naturally" : "Mic Idle"}
            </h4>
            <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto mt-2 leading-relaxed">
              &ldquo;Just talk &mdash; we&apos;ll turn it into a resume.&rdquo; Say things like: &ldquo;I worked at Google for two years as a frontend engineer. I developed their landing page using React.&rdquo;
            </p>
          </div>

          {speechError && (
            <div className="p-3 bg-red-500/5 border border-red-500/10 text-red-400 text-xs rounded-lg max-w-md">
              {speechError}
            </div>
          )}

          {transcript && (
            <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-sub)] text-left max-w-xl w-full leading-relaxed max-h-32 overflow-y-auto">
              <strong>Transcript preview:</strong>
              <p className="mt-1.5 italic font-medium">{transcript}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => {
                if ((window as any).currRec) (window as any).currRec.stop();
                setShowVoiceRecorder(false);
              }}
              className="px-5 py-2 rounded-lg bg-black/5 dark:bg-white/[0.03] border border-[var(--border)] text-xs font-bold font-display uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              Cancel
            </button>
            <button
              onClick={handleStopVoice}
              className="px-6 py-2.5 rounded-lg bg-[var(--color-primary)] hover:opacity-90 text-white text-xs font-bold font-display uppercase tracking-wider flex items-center gap-1.5"
            >
              <MicOff size={13} /> Done Speaking
            </button>
          </div>
        </div>
      )}

      {/* Intake Modal */}
      <IntakeModal isOpen={showIntake} onClose={() => setShowIntake(false)} onSubmit={handleIntakeSubmit} />
    </div>
  );
};

export default CreateTab;
