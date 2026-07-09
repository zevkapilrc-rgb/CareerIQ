"use client";

import React, { useState } from "react";
import { Sparkles, AlertCircle, RefreshCw, Check, X, ShieldAlert } from "lucide-react";
import { ResumeProfile } from "@/src/types";
import SealBadge from "../SealBadge";
import PremiumButton from "@/src/components/ui/PremiumButton";
import { Textarea } from "@/src/components/ui/Input";

interface CompareToJDProps {
  profile: ResumeProfile;
  onUpdate: (updated: ResumeProfile) => void;
}

export const CompareToJD: React.FC<CompareToJDProps> = ({ profile, onUpdate }) => {
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchData, setMatchData] = useState<{
    matchPercent: number;
    missingKeywords: Array<{ keyword: string; importance: "high" | "medium" | "low" }>;
    suggestedRewrites: Array<{ originalBullet: string; suggestedBullet: string; reason: string }>;
  } | null>(null);

  // Suggested rewrites acceptance states
  const [acceptedRewrites, setAcceptedRewrites] = useState<Record<number, boolean>>({});

  const handleCompare = async () => {
    if (!jdText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/resume/compare-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeProfile: profile,
          jdText,
        }),
      });

      const resJson = await response.json();
      if (!resJson.success) throw new Error(resJson.error || "Failed to compare profile");
      setMatchData(resJson.data);
      setAcceptedRewrites({});
    } catch (err: any) {
      setError(err.message || "Failed to compare to job description");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRewrite = (idx: number, rewrite: any) => {
    const updatedProfile = { ...profile };

    // Update first experience bullet matching the original text
    if (updatedProfile.experience) {
      const copyExp = [...updatedProfile.experience];
      let updated = false;

      for (let i = 0; i < copyExp.length; i++) {
        const bullets = [...(copyExp[i].bullets || [])];
        const bIdx = bullets.indexOf(rewrite.originalBullet);
        if (bIdx >= 0) {
          bullets[bIdx] = rewrite.suggestedBullet;
          copyExp[i].bullets = bullets;
          updated = true;
          break;
        }
      }

      // If not found in experience bullets, update Summary instead
      if (!updated && updatedProfile.summary === rewrite.originalBullet) {
        updatedProfile.summary = rewrite.suggestedBullet;
      }

      updatedProfile.experience = copyExp;
    }

    onUpdate(updatedProfile);
    setAcceptedRewrites((prev) => ({ ...prev, [idx]: true }));
  };

  const handleSaveAsNewVersion = () => {
    const updated = {
      ...profile,
      version: (profile.version || 1) + 1,
      lastAnalyzedAt: new Date().toISOString(),
    };
    onUpdate(updated);
    alert(`Success: Resume tailored and saved as Version ${updated.version}!`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
        <h4 className="text-xs font-extrabold text-white uppercase tracking-widest font-display">
          Compare Resume to Job Description
        </h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Paste the target job description or requirements detail below to run a semantic gap check. Gemini will identify missing keywords and suggest bullet-level revisions.
        </p>

        <Textarea
          placeholder="Paste job description requirements here..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          rows={5}
          className="bg-white/[0.01] border-white/[0.08]"
        />

        <div className="flex justify-end">
          <PremiumButton onClick={handleCompare} disabled={loading || !jdText.trim()} variant="primary" size="md">
            {loading ? (
              <>
                <RefreshCw size={12} className="animate-spin mr-1.5" /> Analyzing compatibility...
              </>
            ) : (
              "Run Comparison Scan"
            )}
          </PremiumButton>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/5 border border-red-500/10 text-red-400 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {matchData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Match Score & Keywords */}
          <div className="space-y-6">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest font-display">
                Job Description Fit
              </span>
              <SealBadge score={matchData.matchPercent} size={90} />
              <div className="text-xs font-bold text-white uppercase tracking-wider font-display">
                {matchData.matchPercent >= 80
                  ? "Excellent Semantic Match"
                  : matchData.matchPercent >= 60
                  ? "Moderate Alignment"
                  : "Critical Keyword Gaps"}
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
              <h5 className="text-[11px] font-extrabold text-white uppercase tracking-wider font-display">
                Missing Keywords Gap
              </h5>
              <div className="flex flex-wrap gap-2">
                {matchData.missingKeywords?.map((kw, idx) => {
                  let badgeCol = "bg-red-500/10 text-red-400 border-red-500/20";
                  if (kw.importance === "medium") badgeCol = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
                  if (kw.importance === "low") badgeCol = "bg-[var(--color-primary)]/10 text-[var(--color-primary-light)] border-[var(--color-primary)]/20";

                  return (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md border uppercase tracking-wider ${badgeCol}`}
                    >
                      {kw.keyword} ({kw.importance})
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Suggested Bullet Rewrites */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
              <h5 className="text-[11px] font-extrabold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                <Sparkles size={13} className="text-[var(--accent)]" />
                Truthful Keyword Rephrasing Suggestions
              </h5>
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-zinc-400 mb-2">
                <ShieldAlert className="text-emerald-400 flex-shrink-0" size={14} />
                <p className="leading-relaxed">
                  <strong>Prompt Safety rule:</strong> HIREVIX only rephrases existing experiences to reflect job requirements. No fictional experience or skills are created.
                </p>
              </div>

              <div className="space-y-4">
                {matchData.suggestedRewrites?.map((rw, idx) => {
                  const isAccepted = acceptedRewrites[idx];

                  return (
                    <div key={idx} className="p-4 rounded-lg bg-white/[0.01] border border-white/[0.04] space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                            Rewrite Reason: {rw.reason}
                          </span>
                        </div>
                        {!isAccepted && (
                          <button
                            onClick={() => handleAcceptRewrite(idx, rw)}
                            className="flex items-center gap-1.5 py-1 px-3 rounded bg-[var(--color-primary)]/10 text-[var(--color-accent)] border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/20 text-[10px] font-bold uppercase tracking-wider transition-colors"
                          >
                            <Check size={11} /> Accept Fix
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 rounded bg-white/[0.01] border border-white/[0.04]">
                          <span className="text-[8px] text-zinc-500 uppercase tracking-wider font-bold block mb-1">Original Resume Bullet</span>
                          <p className="text-zinc-400 italic">{rw.originalBullet}</p>
                        </div>
                        <div className={`p-3 rounded border transition-all ${isAccepted ? "bg-emerald-500/5 border-emerald-500/20" : "bg-[var(--color-primary)]/5 border-[var(--color-primary)]/20"}`}>
                          <span className="text-[8px] text-[var(--color-primary)] uppercase tracking-wider font-bold block mb-1">Tailored Proposal</span>
                          <p className="text-white font-medium">{rw.suggestedBullet}</p>
                          {isAccepted && (
                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mt-2">
                              Integrated into draft
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Save New Version */}
              <div className="flex justify-end pt-4 border-t border-white/[0.06]">
                <button
                  onClick={handleSaveAsNewVersion}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[var(--teal)] to-[var(--accent-dark)] hover:opacity-90 text-white text-xs font-bold uppercase tracking-widest font-display transition-colors"
                >
                  Tailor and Save as Version { (profile.version || 1) + 1 }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareToJD;
