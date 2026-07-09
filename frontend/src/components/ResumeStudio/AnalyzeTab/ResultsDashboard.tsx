"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { AlertTriangle, BarChart, Sparkles, BookOpen, Clock, FileText, CheckCircle2, TrendingUp, History, GitCompare } from "lucide-react";
import { scoreBulletImpact } from "@/src/lib/resume-heuristics";
import { buildResumeVersionDiff, createResumeVersionEntry, loadStoredResumeVersions, persistResumeVersions, ResumeVersionEntry } from "@/src/lib/resume-versioning";
import { ResumeProfile } from "@/src/types";
import SealBadge from "../SealBadge";
import IssuesList from "./IssuesList";
import CompareToJD from "./CompareToJD";
import RecruiterScanSimulator from "./RecruiterScanSimulator";
import CoverLetterComposer from "./CoverLetterComposer";

interface ResultsDashboardProps {
  profile: ResumeProfile;
  onUpdate: (updated: ResumeProfile) => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ profile, onUpdate }) => {
  const [subTab, setSubTab] = useState<"ats" | "compare">("ats");
  const [versions, setVersions] = useState<ResumeVersionEntry[]>([]);
  const [versionLabel, setVersionLabel] = useState("");
  const [compareId, setCompareId] = useState<string>("");
  const [diff, setDiff] = useState<{ added: string[]; removed: string[] } | null>(null);

  // Create section refs for scrolling navigation
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const expRef = useRef<HTMLDivElement | null>(null);
  const skillsRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const criticalIssues = (profile.atsIssues || []).filter((i) => i.severity === "critical");
  const warnings = (profile.atsIssues || []).filter((i) => i.severity === "warning");
  const bulletScores = useMemo(() => scoreBulletImpact(profile.experience.flatMap((item) => item.bullets || [])), [profile]);

  useEffect(() => {
    setVersions(loadStoredResumeVersions());
  }, []);

  useEffect(() => {
    if (!compareId) {
      setDiff(null);
      return;
    }

    const selected = versions.find((entry) => entry.id === compareId);
    if (selected) {
      setDiff(buildResumeVersionDiff(profile, selected.profile));
    }
  }, [compareId, profile, versions]);

  // Calculate mini-scores dynamically based on details
  const summaryScore = profile.summary ? 90 : 30;
  const experienceScore = profile.experience?.length ? Math.min(100, 60 + profile.experience.length * 10) : 40;
  const skillsScore = profile.skills?.technical?.length ? Math.min(100, 50 + profile.skills.technical.length * 8) : 30;
  const formattingScore = profile.atsIssues?.length ? Math.max(40, 100 - profile.atsIssues.length * 10) : 98;

  const saveCurrentVersion = () => {
    const entry = createResumeVersionEntry(profile, versionLabel || `Version ${profile.version || 1}`);
    const next = [entry, ...versions].slice(0, 6);
    setVersions(next);
    persistResumeVersions(next);
    setVersionLabel("");
    onUpdate(entry.profile);
  };

  return (
    <div className="space-y-8">
      {/* Overview Block */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 relative overflow-hidden">
        {/* Glow element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--teal)]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          {/* Main overall ATS score gauge (B3.1) */}
          <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-white/[0.06] space-y-3">
            <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest font-display">
              Overall ATS Score
            </span>
            <SealBadge score={profile.atsScore || 70} size={110} />
            <div className="text-xs font-bold text-white uppercase tracking-wider font-display">
              {profile.atsScore >= 75 ? "Highly Compatible" : profile.atsScore >= 50 ? "Needs Calibration" : "Action Recommended"}
            </div>
          </div>

          {/* Mini-section scores (B3.2) */}
          <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-6 pl-0 md:pl-4">
            <div
              onClick={() => scrollToSection(summaryRef)}
              className="flex flex-col items-center justify-center text-center p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] cursor-pointer hover:bg-white/[0.04] transition-all"
            >
              <SealBadge score={summaryScore} size={50} label="Summary" showPercent={false} />
            </div>

            <div
              onClick={() => scrollToSection(expRef)}
              className="flex flex-col items-center justify-center text-center p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] cursor-pointer hover:bg-white/[0.04] transition-all"
            >
              <SealBadge score={experienceScore} size={50} label="Experience" showPercent={false} />
            </div>

            <div
              onClick={() => scrollToSection(skillsRef)}
              className="flex flex-col items-center justify-center text-center p-3 rounded-lg bg-white/[0.01] border border-white/[0.04] cursor-pointer hover:bg-white/[0.04] transition-all"
            >
              <SealBadge score={skillsScore} size={50} label="Skills" showPercent={false} />
            </div>

            <div className="flex flex-col items-center justify-center text-center p-3 rounded-lg bg-white/[0.01] border border-white/[0.04]">
              <SealBadge score={formattingScore} size={50} label="Formatting" showPercent={false} />
            </div>
          </div>
        </div>

        {/* Global overview diagnostics */}
        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-white/[0.06] text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>Format layout complies with standard ATS engines</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={14} className={criticalIssues.length > 0 ? "text-red-400" : "text-zinc-500"} />
            <span>{criticalIssues.length} Critical errors, {warnings.length} Warnings flagged</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Clock size={14} className="text-zinc-500" />
            <span>Last Scanned: {profile.lastAnalyzedAt ? new Date(profile.lastAnalyzedAt).toLocaleDateString() : "Just now"}</span>
          </div>
        </div>
      </div>

      {/* Comparative dashboard tabs selector (B5.1) */}
      <div className="flex border-b border-white/[0.06]">
        <button
          onClick={() => setSubTab("ats")}
          className={`flex items-center gap-1.5 px-5 py-2.5 border-b-2 text-xs font-bold font-display uppercase tracking-widest transition-all duration-300 ${
            subTab === "ats" ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <FileText size={14} /> ATS Compliance Check
        </button>
        <button
          onClick={() => setSubTab("compare")}
          className={`flex items-center gap-1.5 px-5 py-2.5 border-b-2 text-xs font-bold font-display uppercase tracking-widest transition-all duration-300 ${
            subTab === "compare" ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <Sparkles size={14} /> Compare to Job Description
        </button>
      </div>

      {/* Subtab viewport */}
      <div className="space-y-8">
        {subTab === "ats" ? (
          <>
            {/* Recruiter scan Simulator */}
            <RecruiterScanSimulator profile={profile} />

            {/* Scroll Anchor Summary */}
            <div ref={summaryRef} />

            {/* Issues list (B3.3 / B4) */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-widest font-display">
                ATS Compatibility Compliance Issues
              </h4>
              <IssuesList profile={profile} onUpdate={onUpdate} />
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-[var(--accent)]" />
                <h4 className="text-sm font-extrabold text-white uppercase tracking-widest font-display">
                  Bullet Impact Scorer
                </h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Each bullet is scored on action verbs, measurable impact, and outcome clarity. The suggestions are heuristic-based and designed to be transparent rather than fabricated.
              </p>
              <div className="space-y-3">
                {bulletScores.map((item, index) => (
                  <div key={`${item.text}-${index}`} className="rounded-lg border border-white/[0.05] bg-slate-950/40 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-zinc-200">{item.text}</p>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${item.grade === "high" ? "bg-emerald-500/10 text-emerald-300" : item.grade === "medium" ? "bg-amber-500/10 text-amber-300" : "bg-rose-500/10 text-rose-300"}`}>
                        {item.score}/100
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{item.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <History size={14} className="text-[var(--accent)]" />
                <h4 className="text-sm font-extrabold text-white uppercase tracking-widest font-display">
                  Resume Version History
                </h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Save named versions for different targets and compare them side by side to see what changed.
              </p>
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  value={versionLabel}
                  onChange={(e) => setVersionLabel(e.target.value)}
                  placeholder="e.g. Backend Role"
                  className="flex-1 rounded-lg border border-white/[0.08] bg-slate-950/40 px-3 py-2 text-sm text-white outline-none"
                />
                <button
                  onClick={saveCurrentVersion}
                  className="rounded-lg bg-[var(--teal)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white"
                >
                  Save Version
                </button>
              </div>
              <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/8 px-3 py-2 text-[11px] text-emerald-300">
                Recent snapshots are stored locally in this browser and can be compared against the current draft.
              </div>
              <div className="grid gap-3 md:grid-cols-[0.7fr_1.3fr]">
                <div className="space-y-2">
                  {versions.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => setCompareId(entry.id)}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-xs ${compareId === entry.id ? "border-[var(--accent)] bg-[var(--accent)]/10 text-white" : "border-white/[0.05] bg-slate-950/30 text-zinc-400"}`}
                    >
                      <div className="font-semibold">{entry.label}</div>
                      <div className="mt-1 text-[10px] uppercase tracking-wider text-zinc-500">{new Date(entry.createdAt).toLocaleDateString()}</div>
                    </button>
                  ))}
                </div>
                <div className="rounded-lg border border-white/[0.05] bg-slate-950/30 p-3">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                    <GitCompare size={14} className="text-[var(--accent)]" />
                    Version Diff
                  </div>
                  {diff ? (
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="mb-1 font-semibold text-emerald-300">Added</div>
                        <ul className="space-y-1 text-slate-400">
                          {diff.added.slice(0, 5).map((line) => <li key={line}>+ {line}</li>)}
                        </ul>
                      </div>
                      <div>
                        <div className="mb-1 font-semibold text-rose-300">Removed</div>
                        <ul className="space-y-1 text-slate-400">
                          {diff.removed.slice(0, 5).map((line) => <li key={line}>- {line}</li>)}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Select a saved version to compare against the current draft.</p>
                  )}
                </div>
              </div>
            </div>

            <CoverLetterComposer profile={profile} />

            {/* Scroll Anchors for Experience & Skills */}
            <div ref={expRef} />
            <div ref={skillsRef} />
          </>
        ) : (
          <CompareToJD profile={profile} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
};

export default ResultsDashboard;
