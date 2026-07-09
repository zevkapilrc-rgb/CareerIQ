"use client";

import React, { useState } from "react";
import { AlertTriangle, Sparkles, Check, X, RefreshCw } from "lucide-react";
import { ResumeProfile, ATSIssue } from "@/src/types";

interface IssuesListProps {
  profile: ResumeProfile;
  onUpdate: (updated: ResumeProfile) => void;
}

export const IssuesList: React.FC<IssuesListProps> = ({ profile, onUpdate }) => {
  const [loadingIssueId, setLoadingIssueId] = useState<number | null>(null);
  const [proposals, setProposals] = useState<Record<number, { original: string; proposed: string; section: string }>>({});

  // Group issues by severity
  const criticalIssues = (profile.atsIssues || []).filter((i) => i.severity === "critical");
  const warningIssues = (profile.atsIssues || []).filter((i) => i.severity === "warning");
  const suggestionIssues = (profile.atsIssues || []).filter((i) => i.severity === "info" || !["critical", "warning"].includes(i.severity));

  const handleFixWithAi = async (issue: ATSIssue, indexKey: number) => {
    setLoadingIssueId(indexKey);
    try {
      // Find the text of the section we need to fix
      let targetText = "";
      if (issue.section.toLowerCase().includes("summary")) {
        targetText = profile.summary;
      } else if (issue.section.toLowerCase().includes("experience") && profile.experience && profile.experience.length > 0) {
        // Fix first experience bullet or role for demo
        targetText = profile.experience[0].bullets?.[0] || "";
      } else if (profile.experience && profile.experience.length > 0) {
        targetText = profile.experience[0].bullets?.[0] || "";
      }

      if (!targetText) {
        // Fallback target text
        targetText = profile.summary || "Professional Profile";
      }

      const response = await fetch("/api/resume/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: "bullet",
          context: {
            bulletText: targetText,
            issue: issue.message,
            instruction: "fix flagged issue",
          },
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.text) {
        setProposals((prev) => ({
          ...prev,
          [indexKey]: {
            original: targetText,
            proposed: resData.text,
            section: issue.section,
          },
        }));
      }
    } catch (err) {
      console.error("Failed to run AI fix", err);
    } finally {
      setLoadingIssueId(null);
    }
  };

  const handleAcceptFix = (indexKey: number) => {
    const proposal = proposals[indexKey];
    if (!proposal) return;

    const updatedProfile = { ...profile };

    if (proposal.section.toLowerCase().includes("summary")) {
      updatedProfile.summary = proposal.proposed;
    } else if (updatedProfile.experience && updatedProfile.experience.length > 0) {
      // update the target experience bullet
      const copyExp = [...updatedProfile.experience];
      if (copyExp[0].bullets && copyExp[0].bullets.length > 0) {
        copyExp[0].bullets[0] = proposal.proposed;
      } else {
        copyExp[0].bullets = [proposal.proposed];
      }
      updatedProfile.experience = copyExp;
    }

    // Trigger score updates in parent or recalculate here
    onUpdate(updatedProfile);

    // Clear proposal
    const copyProps = { ...proposals };
    delete copyProps[indexKey];
    setProposals(copyProps);
  };

  const handleRejectFix = (indexKey: number) => {
    const copyProps = { ...proposals };
    delete copyProps[indexKey];
    setProposals(copyProps);
  };

  const renderIssueRow = (issue: ATSIssue, idx: number, severity: "critical" | "warning" | "suggestion") => {
    const indexKey = (severity === "critical" ? 0 : severity === "warning" ? 1000 : 2000) + idx;
    const isFixing = loadingIssueId === indexKey;
    const proposal = proposals[indexKey];

    let severityBg = "bg-red-500/5 border-red-500/10 text-red-400";
    if (severity === "warning") severityBg = "bg-yellow-500/5 border-yellow-500/10 text-yellow-400";
    if (severity === "suggestion") severityBg = "bg-blue-500/5 border-blue-500/10 text-blue-400";

    return (
      <div
        key={idx}
        className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.05] space-y-4 hover:border-white/[0.1] transition-all"
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className={`p-2 rounded-lg border ${severityBg} flex-shrink-0 mt-0.5`}>
              <AlertTriangle size={15} />
            </div>
            <div>
              <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest block font-display">
                Section: {issue.section || "General"}
              </span>
              <p className="text-sm font-semibold text-white leading-relaxed mt-1">{issue.message}</p>
              {issue.fix && <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">Fix: {issue.fix}</p>}
            </div>
          </div>

          <button
            onClick={() => handleFixWithAi(issue, indexKey)}
            disabled={isFixing || !!proposal}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--teal)]/10 border border-[var(--teal)]/20 hover:bg-[var(--teal)]/20 text-xs font-bold text-[var(--accent)] transition-all uppercase tracking-wider font-display"
          >
            {isFixing ? (
              <>
                <RefreshCw size={13} className="animate-spin" /> Fixing...
              </>
            ) : (
              <>
                <Sparkles size={13} /> Fix with AI
              </>
            )}
          </button>
        </div>

        {/* Side-by-side Before/After comparison if proposal exists */}
        {proposal && (
          <div className="bg-[#0E1321] border border-[var(--accent)]/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-[var(--accent)] uppercase tracking-wider font-display">
                Before & After Comparison
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAcceptFix(indexKey)}
                  className="flex items-center gap-1 py-1 px-3 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold"
                >
                  <Check size={11} /> Accept
                </button>
                <button
                  onClick={() => handleRejectFix(indexKey)}
                  className="flex items-center gap-1 py-1 px-3 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.08] text-[10px] font-bold"
                >
                  <X size={11} /> Keep Original
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded bg-white/[0.01] border border-white/[0.04]">
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1 font-bold">Before</div>
                <p className="text-zinc-400 italic">{proposal.original}</p>
              </div>
              <div className="p-3 rounded bg-[var(--teal)]/5 border border-[var(--teal)]/20">
                <div className="text-[9px] text-[var(--teal)] uppercase tracking-wider mb-1 font-bold">Proposed Fix</div>
                <p className="text-white font-medium">{proposal.proposed}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {criticalIssues.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-red-400 uppercase tracking-widest font-display">
            Critical Issues ({criticalIssues.length})
          </h4>
          {criticalIssues.map((issue, idx) => renderIssueRow(issue, idx, "critical"))}
        </div>
      )}

      {warningIssues.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-yellow-400 uppercase tracking-widest font-display">
            Warnings ({warningIssues.length})
          </h4>
          {warningIssues.map((issue, idx) => renderIssueRow(issue, idx, "warning"))}
        </div>
      )}

      {suggestionIssues.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest font-display">
            Suggestions ({suggestionIssues.length})
          </h4>
          {suggestionIssues.map((issue, idx) => renderIssueRow(issue, idx, "suggestion"))}
        </div>
      )}

      {profile.atsIssues?.length === 0 && (
        <div className="p-6 text-center bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-emerald-400 text-xs">
          Outstanding compatibility! No ATS compliance issues flagged.
        </div>
      )}
    </div>
  );
};

export default IssuesList;
