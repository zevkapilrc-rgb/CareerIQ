"use client";

import React, { useState } from "react";
import { UploadCloud, AlertCircle, RefreshCw, AlertTriangle, FileText } from "lucide-react";
import ResultsDashboard from "./ResultsDashboard";
import { ResumeProfile } from "@/src/types";

interface AnalyzeTabProps {
  draftProfile: ResumeProfile | null;
  onProfileChange: (newProfile: ResumeProfile | null) => void;
}

export const AnalyzeTab: React.FC<AnalyzeTabProps> = ({ draftProfile, onProfileChange }) => {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Status messages shown sequentially during extraction (B2.4)
  const statusMessages = [
    "Reading document...",
    "Identifying sections & extraction vectors...",
    "Scoring against ATS criteria...",
    "Calibrating recruiter eye-tracking matrix...",
    "Finalizing resume intelligence metrics..."
  ];

  const triggerExtractionSequence = async (file: File) => {
    setLoading(true);
    setLoadingStep(0);
    setError(null);

    // sequential status message interval simulation
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < statusMessages.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("API route error");
      const resJson = await response.json();
      if (!resJson.success) throw new Error(resJson.error || "Failed to analyze resume");

      const extracted = resJson.data;
      clearInterval(interval);

      // Translate to structured ResumeProfile format
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
      clearInterval(interval);
      setError(err.message || "Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      triggerExtractionSequence(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      triggerExtractionSequence(e.dataTransfer.files[0]);
    }
  };

  // Render Dashboard directly if profile is available (B1)
  if (draftProfile) {
    return <ResultsDashboard profile={draftProfile} onUpdate={onProfileChange} />;
  }

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="p-12 text-center bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <RefreshCw size={36} className="animate-spin text-[var(--accent)]" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[var(--text)] font-display uppercase tracking-widest animate-pulse">
              {statusMessages[loadingStep]}
            </h4>
            <p className="text-[11px] text-[var(--text-muted)]">Processing document details in secure AI Sandbox</p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`p-12 text-center border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 transition-all ${
            isDragOver
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
              : "border-[var(--border)] bg-black/5 dark:bg-white/[0.01] hover:border-[var(--border-hover)]"
          }`}
        >
          <div className="p-4 rounded-full bg-black/5 dark:bg-white/[0.02] border border-[var(--border)] text-[var(--text-muted)]">
            <UploadCloud size={32} />
          </div>

          <div>
            <h3 className="text-base font-bold text-[var(--text)] font-display uppercase tracking-wider">
              Upload Your Resume
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-2 max-w-sm mx-auto leading-relaxed font-sans">
              Any file format accepted (PDF, DOCX, DOC, TXT, RTF, ODT, or images like PNG/JPG for scanned resumes).
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/5 border border-red-500/10 text-red-400 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <label className="relative mt-2">
            <input type="file" onChange={handleFileChange} accept="*" className="hidden" />
            <span className="cursor-pointer px-5 py-2.5 rounded-lg bg-[var(--color-primary)] hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider font-display transition-all">
              Choose Document
            </span>
          </label>
        </div>
      )}
    </div>
  );
};

export default AnalyzeTab;
