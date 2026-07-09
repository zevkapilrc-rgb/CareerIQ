/* eslint-disable */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, X, ChevronDown, ChevronUp, AlertCircle, BookOpen,
  ArrowRight, Briefcase, GraduationCap, Activity, User, FileText,
  MessageSquare, AlertTriangle, Copy, MapPin, Clock, Target,
  Code2, Layers, Cpu, Cloud, Database, Wrench, Sparkles, Award
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import KPICard from "../ui/KPICard";
import ProgressRing from "../ui/ProgressRing";
import TabBar from "../ui/TabBar";
import Badge from "../ui/Badge";
import PremiumButton from "../ui/PremiumButton";

const NOT_MENTIONED = "Not Mentioned in Resume.";

const safeText = (val: string | undefined | null): string => {
  if (!val) return "";
  if (val.trim() === NOT_MENTIONED) return "";
  return val.trim();
};

const isBlank = (val: string | undefined | null): boolean => {
  if (!val) return true;
  if (val.trim() === NOT_MENTIONED) return true;
  return val.trim() === "";
};

const scoreGrade = (score: number): { label: string; color: string; bg: string } => {
  if (score >= 80) return { label: "Excellent", color: "text-primary-400", bg: "bg-primary-500" };
  if (score >= 65) return { label: "Good", color: "text-primary-500", bg: "bg-primary-600" };
  if (score >= 50) return { label: "Fair", color: "text-accent-400", bg: "bg-accent-500" };
  if (score >= 35) return { label: "Weak", color: "text-accent-500", bg: "bg-accent-600" };
  return { label: "Critical", color: "text-alert-coral", bg: "bg-alert-coral" };
};

const priorityCfg: Record<string, { color: string; bg: string; border: string; dot: string }> = {
  High: { color: "text-alert-coral", bg: "bg-alert-coral/10", border: "border-alert-coral/20", dot: "bg-alert-coral" },
  Medium: { color: "text-accent-400", bg: "bg-accent-500/10", border: "border-accent-500/20", dot: "bg-accent-500" },
  Low: { color: "text-primary-400", bg: "bg-primary-500/10", border: "border-primary-500/20", dot: "bg-primary-500" },
};

interface ScoreDetail { score: number; reasons?: string; evidence?: string; improvementsNeeded?: string; }
interface HeatmapSection { sectionName: string; score: number; missingKeywords: string[]; passed: boolean; }
interface InterviewQuestion {
  category: string; question: string; difficulty?: string; answer_framework?: string;
  star_template?: { situation: string; task: string; action: string; result: string; };
  follow_ups?: string[];
}
interface ResumeAnalysis {
  scores: { ats_score: number; recruiter_score: number; impact_score: number; skill_depth_score: number; career_consistency_score: number; overall_score: number; };
  skill_intelligence: { core_skills: string[]; weak_skills: string[]; missing_skills: string[]; future_skills: string[]; skill_gap: number; };
  career_insights: { role_alignment: number; suggested_career_paths: string[]; growth_recommendations: string[]; timeline_to_next_level: string; };
  interview_questions: { technical: InterviewQuestion[]; hr: InterviewQuestion[]; situational: InterviewQuestion[]; };
  personal_branding: { linkedin_headline: string; short_bio: string; tagline: string; elevator_pitch: string; };
  ats_heatmap?: { sections: HeatmapSection[] };
  recruiter_simulation?: { first_impression: string; shortlist_probability: number; key_concerns: string[]; strengths_spotted: string[]; };
  candidateInformation?: {
    fullName?: { extractedContent: string }; email?: { extractedContent: string }; phoneNumber?: { extractedContent: string };
    location?: { extractedContent: string }; linkedInProfile?: { extractedContent: string }; portfolioOrGitHub?: { extractedContent: string };
    professionalSummaryOrObjectives?: { extractedContent: string }; candidateType?: { extractedContent: string }; yearsOfExperience?: { extractedContent: string };
  };
  scoresDetailed?: {
    atsScore?: ScoreDetail; contentQualityScore?: ScoreDetail; skillsPresentationScore?: ScoreDetail;
    experienceQualityScore?: ScoreDetail; projectQualityScore?: ScoreDetail; professionalismScore?: ScoreDetail; overallResumeScore?: ScoreDetail;
  };
  strengths?: Array<{ strength: string; evidence: string }>;
  weaknesses?: Array<{ weakness: string; evidence: string }>;
  atsAnalysis?: { issues: Array<{ issue: string; evidence: string; impact: string; improvement: string }> };
  skillsAnalysis?: {
    technicalSkills?: { extractedSkills: string[]; missingInformation?: string };
    softSkills?: { extractedSkills: string[] }; tools?: { extractedSkills: string[] };
    programmingLanguages?: { extractedSkills: string[] }; frameworks?: { extractedSkills: string[] };
    databases?: { extractedSkills: string[] }; cloudTechnologies?: { extractedSkills: string[] }; otherTechnologies?: { extractedSkills: string[] };
  };
  experienceAnalysis?: Array<{
    company: string; role: string; duration: string; responsibilities: string; achievements: string; technologiesUsed: string[];
    evaluation?: { clarity: string; relevance: string; quantification: string; actionVerbs: string; measurableOutcomes: string; };
  }>;
  projectAnalysis?: Array<{
    projectName: string; description: string; technologies: string[]; outcomes: string;
    evaluation?: { clarity: string; technicalDepth: string; impact: string; relevance: string; measurableResults: string; };
  }>;
  educationAnalysis?: Array<{ degree: string; institution: string; cgpaOrPercentage: string; graduationYear: string; }>;
  improvementRoadmap?: Array<{ priority: string; issue: string; reason: string; suggestedFix: string; expectedImpact: string; }>;
  career_trajectory?: { recommendedNextRoles: string[]; salaryMin: number; salaryMax: number; salaryCurrency: string; growthDurationMonths: number; };
  missingInformation?: string[];
}

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 mb-3 font-display">{children}</p>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="py-12 text-center border border-dashed border-white/[0.06] rounded-2xl bg-white/[0.01]">
    <AlertCircle className="w-5 h-5 text-zinc-600 mx-auto mb-2" />
    <p className="text-xs font-semibold text-zinc-500">{message}</p>
  </div>
);

const ScoreBar: React.FC<{ label: string; score: number; description?: string }> = ({ label, score, description }) => {
  const grade = scoreGrade(score);
  return (
    <div className="space-y-2 bg-white/[0.015] border border-white/[0.04] p-4 rounded-xl">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-zinc-300 font-display">{label}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-white/[0.05] ${grade.color} bg-black/40`}>
            {grade.label}
          </span>
          <span className="text-xs font-bold font-mono text-white w-7 text-right">{score}</span>
        </div>
      </div>
      <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className={`h-full rounded-full ${grade.bg}`} />
      </div>
      {description && !isBlank(description) && <p className="text-[11px] text-zinc-500 font-semibold leading-relaxed mt-1">{description}</p>}
    </div>
  );
};

const Chip: React.FC<{ label: string; variant?: "default" | "green" | "amber" | "red" }> = ({ label, variant = "default" }) => {
  const styles: Record<string, string> = {
    default: "bg-white/[0.03] text-zinc-300 border-white/[0.08] hover:border-white/[0.15]",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20"
  };
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${styles[variant || "default"]}`}>{label}</span>;
};

const SummaryPanel: React.FC<{ analysis: ResumeAnalysis }> = ({ analysis }) => {
  const ci = analysis.candidateInformation;
  const name = safeText(ci?.fullName?.extractedContent) || "Candidate";
  const candidateType = safeText(ci?.candidateType?.extractedContent);
  const years = safeText(ci?.yearsOfExperience?.extractedContent);
  const location = safeText(ci?.location?.extractedContent);
  const summary = safeText(ci?.professionalSummaryOrObjectives?.extractedContent);
  const scores = analysis.scores;
  const sd = analysis.scoresDetailed;
  const strengths = (analysis.strengths || []).filter(s => !isBlank(s.strength));
  const weaknesses = (analysis.weaknesses || []).filter(w => !isBlank(w.weakness));
  const roadmap = (analysis.improvementRoadmap || []).filter(r => !isBlank(r.issue));
  const scoreItems = [
    { label: "ATS Compliance", score: scores.ats_score, desc: safeText(sd?.atsScore?.reasons) },
    { label: "Content Quality", score: scores.career_consistency_score, desc: safeText(sd?.contentQualityScore?.reasons) },
    { label: "Skills Presentation", score: scores.skill_depth_score, desc: safeText(sd?.skillsPresentationScore?.reasons) },
    { label: "Experience Quality", score: scores.impact_score, desc: safeText(sd?.experienceQualityScore?.reasons) },
    { label: "Professionalism", score: scores.recruiter_score, desc: safeText(sd?.professionalismScore?.reasons) },
    { label: "Overall Score", score: scores.overall_score, desc: safeText(sd?.overallResumeScore?.reasons) },
  ];
  return (
    <div className="space-y-8 animate-fade">
      <GlassCard hoverLift={false} className="p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 text-[var(--accent)]">
            <User size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white tracking-tight font-display">{name}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1.5">
              {candidateType && <span className="text-xs text-zinc-400 font-semibold capitalize flex items-center gap-1.5"><Briefcase size={12} className="text-zinc-600" />{candidateType}</span>}
              {years && years !== "0" && <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5"><Clock size={12} className="text-zinc-600" />{years} {parseFloat(years) === 1 ? "year" : "years"} experience</span>}
              {location && <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5"><MapPin size={12} className="text-zinc-600" />{location}</span>}
            </div>
            {summary && <p className="text-xs text-zinc-400 leading-relaxed mt-3.5 max-w-3xl">{summary}</p>}
          </div>
        </div>
      </GlassCard>

      <div>
        <SectionLabel>Resume Indices breakdown</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scoreItems.map((item, i) => <ScoreBar key={i} label={item.label} score={item.score} description={item.desc} />)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <SectionLabel>Extracted Strengths</SectionLabel>
          {strengths.length > 0 ? (
            <div className="space-y-3">
              {strengths.map((s, i) => (
                <div key={i} className="flex gap-3.5 p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.015]">
                  <Check size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white tracking-tight">{s.strength}</p>
                    {!isBlank(s.evidence) && <p className="text-[10px] text-zinc-500 mt-1 italic leading-relaxed font-semibold">{s.evidence}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : <EmptyState message="No strengths extracted." />}
        </div>
        <div>
          <SectionLabel>Target Enhancements</SectionLabel>
          {weaknesses.length > 0 ? (
            <div className="space-y-3">
              {weaknesses.map((w, i) => (
                <div key={i} className="flex gap-3.5 p-4 rounded-xl border border-amber-500/10 bg-amber-500/[0.015]">
                  <AlertCircle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white tracking-tight">{w.weakness}</p>
                    {!isBlank(w.evidence) && <p className="text-[10px] text-zinc-500 mt-1 italic leading-relaxed font-semibold">{w.evidence}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : <EmptyState message="No weaknesses flagged." />}
        </div>
      </div>

      {roadmap.length > 0 && (
        <div>
          <SectionLabel>Calibration Roadmap</SectionLabel>
          <div className="border border-white/[0.06] rounded-2xl overflow-hidden bg-white/[0.005]">
            <div className="hidden md:grid grid-cols-[100px_1fr_1fr_160px] px-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
              {["Priority", "Issue Description", "Suggested Action", "Expected Impact"].map(h => (
                <span key={h} className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-display">{h}</span>
              ))}
            </div>
            <div className="divide-y divide-white/[0.05]">
              {roadmap.map((item, i) => {
                const pKey = (item.priority || "Medium") as keyof typeof priorityCfg;
                const p = priorityCfg[pKey] || priorityCfg.Medium;
                return (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-[100px_1fr_1fr_160px] gap-3 md:gap-4 px-5 py-4 hover:bg-white/[0.01] transition-colors items-center">
                    <div>
                      <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${p.color} ${p.bg} ${p.border}`}>
                        <span className={`w-1 h-1 rounded-full ${p.dot}`} />
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-200 leading-relaxed">{item.issue}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{item.suggestedFix}</p>
                    <p className="text-xs text-zinc-500 italic leading-relaxed font-semibold">{item.expectedImpact}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AtsScannerPanel: React.FC<{ analysis: ResumeAnalysis }> = ({ analysis }) => {
  const atsScore = analysis.scores.ats_score;
  const grade = scoreGrade(atsScore);
  const issues = (analysis.atsAnalysis?.issues || []).filter(i => !isBlank(i.issue));
  const heatmap = analysis.ats_heatmap?.sections || [];
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div className="space-y-6 animate-fade">
      <GlassCard hoverLift={false} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <SectionLabel>ATS Compatibility Index</SectionLabel>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl mt-1.5">{safeText(analysis.scoresDetailed?.atsScore?.reasons) || "ATS screening parses formatting and metadata. Aligning keywords directly helps pass layout filters."}</p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <ProgressRing progress={atsScore} size={88} strokeWidth={6} color="var(--color-primary)">
            <span className="text-xl font-bold font-mono text-white">{atsScore}</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-500">Score</span>
          </ProgressRing>
          <div className="flex flex-col gap-0.5">
            <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.05] ${grade.color}`}>
              {grade.label}
            </span>
          </div>
        </div>
      </GlassCard>

      {heatmap.length > 0 && (
        <div>
          <SectionLabel>Section Alignment Matrix</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heatmap.map((section, i) => {
              const sg = scoreGrade(section.score);
              return (
                <div key={i} className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.005] hover:border-white/[0.08] transition-colors">
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${section.passed ? "bg-emerald-500/10 border border-emerald-500/15" : "bg-red-500/10 border border-red-500/15"}`}>
                      {section.passed ? <Check size={11} className="text-emerald-400" /> : <X size={11} className="text-red-400" />}
                    </div>
                    <span className="text-xs font-bold text-zinc-200 flex-1">{section.sectionName}</span>
                    <span className={`text-xs font-mono font-bold ${sg.color}`}>{section.score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden ml-8">
                    <div className={`h-full rounded-full ${sg.bg}`} style={{ width: `${section.score}%` }} />
                  </div>
                  {section.missingKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5 ml-8">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mr-1 mt-0.5">Missing:</span>
                      {section.missingKeywords.map((kw, ki) => (
                        <span key={ki} className="text-[9px] px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/15 text-red-400 font-mono font-bold">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {issues.length > 0 && (
        <div>
          <SectionLabel>Calibration Warnings ({issues.length})</SectionLabel>
          <div className="space-y-3">
            {issues.map((issue, i) => (
              <div key={i} className="rounded-xl border border-white/[0.05] bg-white/[0.005] overflow-hidden hover:border-white/[0.08] transition-colors">
                <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-start gap-3.5 p-4 text-left outline-none transition-colors hover:bg-white/[0.015]">
                  <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white tracking-tight leading-snug">{issue.issue}</p>
                    {!isBlank(issue.impact) && <p className="text-[10px] text-zinc-500 mt-0.5 font-semibold">Impact: {issue.impact}</p>}
                  </div>
                  {expanded === i ? <ChevronUp size={14} className="text-zinc-500 flex-shrink-0 mt-0.5" /> : <ChevronDown size={14} className="text-zinc-500 flex-shrink-0 mt-0.5" />}
                </button>
                <AnimatePresence>
                  {expanded === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/[0.05] bg-black/40 px-4 py-3.5 space-y-3.5 overflow-hidden">
                      {!isBlank(issue.evidence) && (
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1 font-display">Target Evidence</p>
                          <p className="text-[11px] text-zinc-400 italic leading-relaxed font-semibold">&ldquo;{issue.evidence}&rdquo;</p>
                        </div>
                      )}
                      {!isBlank(issue.improvement) && (
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1 font-display">Required Optimization</p>
                          <p className="text-[11px] text-emerald-400 font-bold leading-relaxed">{issue.improvement}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}
      {issues.length === 0 && heatmap.length === 0 && <EmptyState message="No ATS data available. Run analysis calibration to display coordinates." />}
    </div>
  );
};

const ExperiencePanel: React.FC<{ analysis: ResumeAnalysis }> = ({ analysis }) => {
  type SectionId = "experience" | "projects" | "education";
  const [activeTab, setActiveTab] = useState<SectionId>("experience");
  const [expanded, setExpanded] = useState<number | null>(null);
  const experiences = (analysis.experienceAnalysis || []).filter(e => !isBlank(e.company) && e.company !== NOT_MENTIONED);
  const projects = (analysis.projectAnalysis || []).filter(p => !isBlank(p.projectName) && p.projectName !== NOT_MENTIONED);
  const education = (analysis.educationAnalysis || []).filter(e => !isBlank(e.institution) && e.institution !== NOT_MENTIONED);
  const tabs = [
    { id: "experience", label: `Experience (${experiences.length})` },
    { id: "projects", label: `Projects (${projects.length})` },
    { id: "education", label: `Education (${education.length})` },
  ];
  return (
    <div className="space-y-6 animate-fade">
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => { setActiveTab(id as SectionId); setExpanded(null); }}
      />
      {activeTab === "experience" && (
        <div className="space-y-3">
          {experiences.length > 0 ? experiences.map((exp, i) => (
            <div key={i} className="rounded-xl border border-white/[0.05] bg-white/[0.005] hover:border-white/[0.08] transition-colors overflow-hidden">
              <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-start gap-3.5 p-4 text-left outline-none hover:bg-white/[0.015] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-center flex-shrink-0 text-zinc-400">
                  <Briefcase size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white tracking-tight">{exp.role || "Unknown Role"}</p>
                  <p className="text-xs text-zinc-400 font-semibold">{exp.company}{!isBlank(exp.duration) ? ` Â· ${exp.duration}` : ""}</p>
                </div>
                {expanded === i ? <ChevronUp size={14} className="text-zinc-550 mt-1 flex-shrink-0" /> : <ChevronDown size={14} className="text-zinc-550 mt-1 flex-shrink-0" />}
              </button>
              <AnimatePresence>
                {expanded === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/[0.05] px-5 py-4 space-y-4 bg-black/40 overflow-hidden">
                    {!isBlank(exp.responsibilities) && (
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 font-display">Responsibilities</p>
                        <p className="text-xs text-zinc-300 leading-relaxed font-medium">{exp.responsibilities}</p>
                      </div>
                    )}
                    {!isBlank(exp.achievements) && exp.achievements !== NOT_MENTIONED && (
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 font-display">Key Achievements</p>
                        <p className="text-xs text-zinc-300 leading-relaxed font-medium">{exp.achievements}</p>
                      </div>
                    )}
                    {exp.technologiesUsed && exp.technologiesUsed.filter(t => !isBlank(t)).length > 0 && (
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-2 font-display">Technologies Integration</p>
                        <div className="flex flex-wrap gap-1.5">{exp.technologiesUsed.filter(t => !isBlank(t)).map((tech, ti) => <Chip key={ti} label={tech} variant="green" />)}</div>
                      </div>
                    )}
                    {exp.evaluation && (
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-2.5 font-display">AI Verification Evaluation</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {Object.entries(exp.evaluation).filter(([, v]) => !isBlank(v as string)).map(([key, val]) => (
                            <div key={key} className="p-3 rounded-lg bg-white/[0.015] border border-white/[0.05]">
                              <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold font-display mb-0.5">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                              <p className="text-[11px] text-zinc-300 leading-snug font-medium">{val as string}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )) : <EmptyState message="No work experience found in resume." />}
        </div>
      )}
      {activeTab === "projects" && (
        <div className="space-y-3">
          {projects.length > 0 ? projects.map((proj, i) => (
            <div key={i} className="rounded-xl border border-white/[0.05] bg-white/[0.005] hover:border-white/[0.08] transition-colors overflow-hidden">
              <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-start gap-3.5 p-4 text-left outline-none hover:bg-white/[0.015] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-center flex-shrink-0 text-zinc-400">
                  <Code2 size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white tracking-tight">{proj.projectName}</p>
                  {proj.technologies && proj.technologies.filter(t => !isBlank(t)).length > 0 && <p className="text-xs text-zinc-550 mt-0.5 truncate">{proj.technologies.filter(t => !isBlank(t)).slice(0, 4).join(", ")}</p>}
                </div>
                {expanded === i ? <ChevronUp size={14} className="text-zinc-550 mt-1 flex-shrink-0" /> : <ChevronDown size={14} className="text-zinc-550 mt-1 flex-shrink-0" />}
              </button>
              <AnimatePresence>
                {expanded === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/[0.05] px-5 py-4 space-y-4 bg-black/40 overflow-hidden">
                    {!isBlank(proj.description) && (
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 font-display">Description</p>
                        <p className="text-xs text-zinc-300 leading-relaxed font-medium">{proj.description}</p>
                      </div>
                    )}
                    {!isBlank(proj.outcomes) && proj.outcomes !== NOT_MENTIONED && (
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 font-display">Measurable Outcomes</p>
                        <p className="text-xs text-zinc-300 leading-relaxed font-medium">{proj.outcomes}</p>
                      </div>
                    )}
                    {proj.technologies && proj.technologies.filter(t => !isBlank(t)).length > 0 && (
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-2 font-display">Technologies Integration</p>
                        <div className="flex flex-wrap gap-1.5">{proj.technologies.filter(t => !isBlank(t)).map((tech, ti) => <Chip key={ti} label={tech} variant="green" />)}</div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )) : <EmptyState message="No projects found in resume." />}
        </div>
      )}
      {activeTab === "education" && (
        <div className="space-y-3">
          {education.length > 0 ? education.map((edu, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl border border-white/[0.05] bg-white/[0.005] hover:border-white/[0.08] transition-colors items-center">
              <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-center flex-shrink-0 text-zinc-400">
                <GraduationCap size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white tracking-tight">{edu.degree || "Degree not specified"}</p>
                <p className="text-xs text-zinc-400 font-semibold mt-0.5">{edu.institution}</p>
                <div className="flex flex-wrap gap-4 mt-1.5">
                  {!isBlank(edu.graduationYear) && <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Graduated: {edu.graduationYear}</span>}
                  {!isBlank(edu.cgpaOrPercentage) && <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Score: {edu.cgpaOrPercentage}</span>}
                </div>
              </div>
            </div>
          )) : <EmptyState message="No education details found in resume." />}
        </div>
      )}
    </div>
  );
};

const SkillsPanel: React.FC<{ analysis: ResumeAnalysis }> = ({ analysis }) => {
  const sa = analysis.skillsAnalysis;
  const missing = (analysis.missingInformation || []).filter(m => !isBlank(m));
  const groups = [
    { label: "Technical Competencies", icon: Cpu, data: sa?.technicalSkills?.extractedSkills || [], variant: "green" as const },
    { label: "Programming Languages", icon: Code2, data: sa?.programmingLanguages?.extractedSkills || [], variant: "green" as const },
    { label: "Frameworks & Libraries", icon: Layers, data: sa?.frameworks?.extractedSkills || [], variant: "default" as const },
    { label: "Databases & Engines", icon: Database, data: sa?.databases?.extractedSkills || [], variant: "default" as const },
    { label: "Cloud & Infrastructure", icon: Cloud, data: sa?.cloudTechnologies?.extractedSkills || [], variant: "default" as const },
    { label: "Tools & Utilities", icon: Wrench, data: sa?.tools?.extractedSkills || [], variant: "default" as const },
    { label: "Interpersonal & Leadership", icon: User, data: sa?.softSkills?.extractedSkills || [], variant: "amber" as const },
  ];
  const hasAnySkills = groups.some(g => g.data.filter(s => !isBlank(s)).length > 0);
  return (
    <div className="space-y-6 animate-fade">
      <div className="p-5 rounded-xl border border-white/[0.05] bg-white/[0.005]">
        <ScoreBar label="Skills Depth Validation" score={analysis.scores.skill_depth_score} description={safeText(analysis.scoresDetailed?.skillsPresentationScore?.reasons)} />
      </div>
      {hasAnySkills ? (
        <div className="space-y-6">
          {groups.map((group, i) => {
            const skills = group.data.filter(s => !isBlank(s) && s !== NOT_MENTIONED);
            if (skills.length === 0) return null;
            const Icon = group.icon;
            return (
              <div key={i} className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.003]">
                <div className="flex items-center gap-2 mb-3.5">
                  <Icon size={13} className="text-[var(--accent)]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-display">{group.label}</span>
                </div>
                <div className="flex flex-wrap gap-2">{skills.map((skill, si) => <Chip key={si} label={skill} variant={group.variant} />)}</div>
              </div>
            );
          })}
        </div>
      ) : <EmptyState message="Skill data could not be extracted. Upload a resume with a skills section." />}
      {missing.length > 0 && (
        <div>
          <SectionLabel>Missing from Core Index</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {missing.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 font-semibold font-sans">
                <X size={11} />
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CareerPathPanel: React.FC<{ analysis: ResumeAnalysis }> = ({ analysis }) => {
  const ci = analysis.career_insights;
  const traj = analysis.career_trajectory;
  const recs = (ci?.growth_recommendations || []).filter(r => !isBlank(r) && r !== NOT_MENTIONED);
  const paths = (ci?.suggested_career_paths || []).filter(p => !isBlank(p) && p !== NOT_MENTIONED);
  return (
    <div className="space-y-6 animate-fade">
      <div className="p-5 rounded-xl border border-white/[0.05] bg-white/[0.005]">
        <ScoreBar label="Target Alignment calibration" score={ci?.role_alignment ?? 0} description="Semantic alignment between your current positioning and expected industry paths." />
      </div>
      {paths.length > 0 && (
        <div>
          <SectionLabel>Suggested Path Trajectories</SectionLabel>
          <div className="space-y-2">
            {paths.map((path, i) => (
              <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.005] hover:border-white/[0.08] transition-colors">
                <div className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-[var(--color-accent)] font-mono">{i + 1}</div>
                <span className="text-xs font-bold text-white">{path}</span>
                <ArrowRight size={13} className="text-zinc-600 ml-auto flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
      {traj && (
        <div className="p-5 rounded-xl border border-white/[0.05] bg-white/[0.005]">
          <SectionLabel>Estimated Salary Valuation</SectionLabel>
          <div className="flex items-baseline gap-2 mb-3.5">
            <span className="text-3xl font-bold font-mono text-white">{traj.salaryCurrency === "USD" ? "$" : traj.salaryCurrency}{(traj.salaryMin / 1000).toFixed(0)}k</span>
            <span className="text-zinc-650 font-bold">-</span>
            <span className="text-3xl font-bold font-mono text-white">{traj.salaryCurrency === "USD" ? "$" : ""}{(traj.salaryMax / 1000).toFixed(0)}k</span>
            <span className="text-xs text-zinc-500 font-semibold">/ Year</span>
          </div>
          {traj.recommendedNextRoles && traj.recommendedNextRoles.filter(r => !isBlank(r)).length > 0 && (
            <div>
              <p className="text-[10px] text-zinc-500 mb-2 font-semibold">Target Node Roles:</p>
              <div className="flex flex-wrap gap-1.5">{traj.recommendedNextRoles.filter(r => !isBlank(r)).map((role, ri) => <Chip key={ri} label={role} />)}</div>
            </div>
          )}
        </div>
      )}
      {recs.length > 0 && (
        <div>
          <SectionLabel>Strategic Directives</SectionLabel>
          <div className="space-y-2">
            {recs.map((rec, i) => (
              <div key={i} className="flex gap-3.5 p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.002]">
                <BookOpen size={14} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-300 leading-relaxed font-semibold">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {ci?.timeline_to_next_level && !isBlank(ci.timeline_to_next_level) && (
        <div className="flex items-center gap-3.5 p-4 rounded-xl border border-white/[0.05] bg-white/[0.005]">
          <Clock size={16} className="text-zinc-500 flex-shrink-0" />
          <div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-display">Calibrated Duration to next Level</p>
            <p className="text-sm font-bold text-white mt-0.5">{ci.timeline_to_next_level}</p>
          </div>
        </div>
      )}
      {!paths.length && !traj && !recs.length && <EmptyState message="Career path data will appear here after analysis." />}
    </div>
  );
};

const InterviewPrepPanel: React.FC<{ analysis: ResumeAnalysis }> = ({ analysis }) => {
  type TabId = "technical" | "hr" | "situational";
  const [activeTab, setActiveTab] = useState<TabId>("technical");
  const [expanded, setExpanded] = useState<number | null>(null);
  const data = analysis.interview_questions;
  const allQ = { technical: data?.technical || [], hr: data?.hr || [], situational: data?.situational || [] };
  const tabs = [
    { id: "technical", label: `Technical Questions (${allQ.technical.length})` },
    { id: "hr", label: `HR / Behavioral (${allQ.hr.length})` },
    { id: "situational", label: `Situational Scenario (${allQ.situational.length})` },
  ];
  return (
    <div className="space-y-6 animate-fade">
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => { setActiveTab(id as TabId); setExpanded(null); }}
      />
      <div className="space-y-3">
        {allQ[activeTab].length > 0 ? allQ[activeTab].map((item, i) => {
          const difficulty = item.difficulty || "Medium";
          const diffStyle = difficulty === "Hard" || difficulty === "Expert" ? "text-red-400 border-red-500/15 bg-red-500/10" : difficulty === "Easy" ? "text-emerald-400 border-emerald-500/15 bg-emerald-500/10" : "text-amber-400 border-amber-500/15 bg-amber-500/10";
          return (
            <div key={i} className="rounded-xl border border-white/[0.05] bg-white/[0.005] overflow-hidden hover:border-white/[0.08] transition-colors">
              <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-start gap-3.5 p-4 text-left outline-none hover:bg-white/[0.015] transition-colors">
                <span className="text-[10px] font-bold text-zinc-500 mt-1.5 w-6 flex-shrink-0 font-mono">Q{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.category && <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.02] text-zinc-400 border border-white/[0.05] font-display">{item.category}</span>}
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${diffStyle} font-display`}>{difficulty}</span>
                  </div>
                  <p className="text-xs font-bold text-zinc-200 leading-relaxed">{item.question}</p>
                </div>
                {expanded === i ? <ChevronUp size={14} className="text-zinc-550 flex-shrink-0 mt-1" /> : <ChevronDown size={14} className="text-zinc-550 flex-shrink-0 mt-1" />}
              </button>
              <AnimatePresence>
                {expanded === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/[0.05] bg-black/40 px-5 py-4 space-y-4 overflow-hidden">
                    {item.answer_framework && !isBlank(item.answer_framework) && (
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 font-display">Target Assessment Focus</p>
                        <p className="text-xs text-zinc-300 leading-relaxed font-semibold">{item.answer_framework}</p>
                      </div>
                    )}
                    {item.star_template && (
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-2 font-display">STAR Answer Guideline</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[{ label: "Situation", content: item.star_template.situation }, { label: "Task", content: item.star_template.task }, { label: "Action", content: item.star_template.action }, { label: "Result", content: item.star_template.result }].map(s => (
                            <div key={s.label} className="p-3.5 rounded-lg bg-white/[0.015] border border-white/[0.05]">
                              <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--accent)] mb-1 font-display">{s.label}</p>
                              <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold">{s.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {item.follow_ups && item.follow_ups.length > 0 && (
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 font-display">Expected Follow-Ups</p>
                        <ul className="space-y-1.5">{item.follow_ups.map((fu, fi) => <li key={fi} className="text-[11px] text-zinc-400 flex items-start gap-2 leading-relaxed font-medium"><span className="text-[var(--accent)] flex-shrink-0 mt-0.5">â†³</span>{fu}</li>)}</ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }) : <EmptyState message={`No ${activeTab} questions available.`} />}
      </div>
    </div>
  );
};

const BrandingPanel: React.FC<{ analysis: ResumeAnalysis }> = ({ analysis }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const pb = analysis.personal_branding;
  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(null), 2000); }).catch(() => {});
  };
  const brandItems = [
    { key: "headline", label: "LinkedIn Headline", hint: "Optimize headline to scale networking conversions", value: safeText(pb?.linkedin_headline), icon: Target },
    { key: "tagline", label: "Professional Tagline", hint: "Calibration identifier for layouts, portfolio headers", value: safeText(pb?.tagline), icon: Activity },
    { key: "bio", label: "Personal Biography", hint: "Context description for GitHub, profiles, summaries", value: safeText(pb?.short_bio), icon: FileText },
    { key: "pitch", label: "30-Second Elevator Pitch", hint: "Memorized introduction script for calibration reviews", value: safeText(pb?.elevator_pitch), icon: MessageSquare },
  ].filter(item => !isBlank(item.value));
  return (
    <div className="space-y-4 animate-fade">
      {brandItems.length > 0 ? brandItems.map(item => {
        const Icon = item.icon;
        return (
          <div key={item.key} className="p-5 rounded-xl border border-white/[0.05] bg-white/[0.005]">
            <div className="flex items-start justify-between gap-3 mb-3.5">
              <div className="flex items-start gap-2.5">
                <Icon size={15} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white font-display">{item.label}</p>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">{item.hint}</p>
                </div>
              </div>
              <PremiumButton variant="secondary" size="sm" onClick={() => copyText(item.value, item.key)}
                className={`h-8 min-w-[70px] ${copied === item.key ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" : ""}`}>
                {copied === item.key ? <Check size={12} /> : <Copy size={12} />}
                {copied === item.key ? "Copied!" : "Copy"}
              </PremiumButton>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.05]">
              <p className="text-xs text-zinc-300 leading-relaxed font-semibold">{item.value}</p>
            </div>
          </div>
        );
      }) : <EmptyState message="Branding content could not be generated. Make sure the resume includes a professional summary." />}
    </div>
  );
};

const NAV_ITEMS = [
  { id: "summary", label: "Summary Overview", shortLabel: "Summary", accent: "var(--color-primary)" },
  { id: "ats", label: "ATS Scanner Index", shortLabel: "ATS Compliance", accent: "#0ea5e9" },
  { id: "experience", label: "Experience Details", shortLabel: "Details Hub", accent: "#10b981" },
  { id: "skills", label: "Technical Skills", shortLabel: "Skills Depth", accent: "#f59e0b" },
  { id: "career", label: "Career Roadmap", shortLabel: "Roadmap Node", accent: "#8b5cf6" },
  { id: "interview", label: "Interview Prep", shortLabel: "Mock Prep", accent: "#06b6d4" },
  { id: "branding", label: "Branding Kit", shortLabel: "Personal Brand", accent: "#f97316" },
];

export const ResumeIntelligenceDashboard: React.FC<{ analysis: ResumeAnalysis }> = ({ analysis }) => {
  const [activeSection, setActiveSection] = useState("summary");
  const name = safeText(analysis.candidateInformation?.fullName?.extractedContent) || "Resume Analysis";
  const overallScore = analysis.scores?.overall_score ?? 0;
  const grade = scoreGrade(overallScore);
  const candidateType = safeText(analysis.candidateInformation?.candidateType?.extractedContent);
  const years = safeText(analysis.candidateInformation?.yearsOfExperience?.extractedContent);
  const metricScores = [
    { label: "ATS Compliance", value: analysis.scores.ats_score },
    { label: "Skills Depth", value: analysis.scores.skill_depth_score },
    { label: "Content Quality", value: analysis.scores.career_consistency_score },
  ];

  return (
    <div className="min-h-screen w-full bg-[#09090B] text-zinc-100 flex flex-col">
      <div className="border-b border-white/[0.05] bg-white/[0.01] backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-accent)] rounded-xl flex-shrink-0">
                <Award className="w-7 h-7" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                  <span className="text-[10px] font-extrabold text-zinc-550 uppercase tracking-widest font-display">Calibration Complete</span>
                </div>
                <h1 className="text-xl font-extrabold text-white font-display tracking-tight">{name}</h1>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-zinc-550 font-bold uppercase tracking-wider">
                  {candidateType && <span>{candidateType}</span>}
                  {years && years !== "0" && <span>Â· {years} years experience</span>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-5">
              <div className="hidden sm:flex flex-col gap-2 min-w-[200px]">
                {metricScores.map(m => (
                  <div key={m.label} className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase w-20 flex-shrink-0 tracking-wide font-display">{m.label}</span>
                    <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${scoreGrade(m.value).bg}`} style={{ width: `${m.value}%` }} />
                    </div>
                    <span className="text-[10px] font-bold font-mono text-zinc-400 w-6 text-right">{m.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-3.5 p-4 rounded-xl border border-white/[0.06] bg-black/40">
                <ProgressRing progress={overallScore} size={64} strokeWidth={5} color="var(--color-primary)" glow={true}>
                  <span className="text-base font-extrabold font-mono text-white">{overallScore}</span>
                </ProgressRing>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest font-display">Calibration</span>
                  <span className={`text-xs font-black uppercase ${grade.color}`}>{grade.label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-20 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-8 pt-8">
          {/* Sidebar Menu */}
          <aside className="hidden lg:flex flex-col gap-1 w-52 flex-shrink-0 sticky top-[96px] self-start bg-white/[0.015] border border-white/[0.05] p-2.5 rounded-2xl">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-500 px-3.5 mb-2.5 mt-1.5 font-display">Redesign Index</p>
            {NAV_ITEMS.map(item => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`relative flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-left text-xs font-semibold tracking-wide transition-all outline-none ${
                    isActive
                      ? "bg-[var(--color-primary)]/10 text-white font-bold"
                      : "text-zinc-400 hover:bg-white/[0.02] hover:text-zinc-200"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeSubSectionDot"
                      className="absolute left-0 w-1.5 h-1.5 rounded-r-full"
                      style={{ background: item.accent }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </aside>

          {/* Mobile switcher */}
          <div className="lg:hidden w-full mb-2">
            <div className="flex gap-2 overflow-x-auto pb-2.5 no-scrollbar scroll-smooth">
              {NAV_ITEMS.map(item => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isActive
                        ? "bg-[var(--color-primary)]/10 text-white border-[var(--color-primary)]/20"
                        : "bg-transparent text-zinc-400 border-white/[0.05] hover:text-zinc-200"
                    }`}
                  >
                    {item.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {activeSection === "summary" && <SummaryPanel analysis={analysis} />}
                {activeSection === "ats" && <AtsScannerPanel analysis={analysis} />}
                {activeSection === "experience" && <ExperiencePanel analysis={analysis} />}
                {activeSection === "skills" && <SkillsPanel analysis={analysis} />}
                {activeSection === "career" && <CareerPathPanel analysis={analysis} />}
                {activeSection === "interview" && <InterviewPrepPanel analysis={analysis} />}
                {activeSection === "branding" && <BrandingPanel analysis={analysis} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResumeIntelligenceDashboard;

