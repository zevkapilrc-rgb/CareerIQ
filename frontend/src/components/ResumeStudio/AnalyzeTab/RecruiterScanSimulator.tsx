"use client";

import React, { useState, useEffect } from "react";
import { Eye, HelpCircle, RefreshCw } from "lucide-react";
import { ResumeProfile } from "@/src/types";

interface RecruiterScanSimulatorProps {
  profile: ResumeProfile;
}

export const RecruiterScanSimulator: React.FC<RecruiterScanSimulatorProps> = ({ profile }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    highVisibilitySpans: Array<{ text: string; reason: string }>;
    likelySkippedSpans: Array<{ text: string; reason: string }>;
  } | null>(null);

  useEffect(() => {
    const fetchSimulation = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/resume/recruiter-scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeProfile: profile }),
        });
        const resJson = await response.json();
        if (resJson.success) {
          setData(resJson.data);
        }
      } catch (err) {
        console.error("Failed to run recruiter scan simulation", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulation();
  }, [profile.summary, profile.experience]);

  // Helper to render text with color spans based on scan results
  const renderHighlightedContent = (rawText: string) => {
    if (!data) return rawText;

    let resultHTML = rawText;

    // Highlight high visibility spans
    data.highVisibilitySpans?.forEach((span) => {
      if (!span.text) return;
      const escaped = span.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      resultHTML = resultHTML.replace(
        regex,
        `<span class="relative group cursor-help inline-block px-1 rounded bg-emerald-500/10 border-b border-emerald-400 font-bold text-white">
          $1
          <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 rounded bg-zinc-900 border border-white/[0.08] text-[9px] font-bold text-zinc-300 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-xl leading-relaxed">
            👁️ Recruiter Eye Focus:<br/>
            ${span.reason}
          </span>
        </span>`
      );
    });

    // Highlight likely skipped spans
    data.likelySkippedSpans?.forEach((span) => {
      if (!span.text) return;
      const escaped = span.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      resultHTML = resultHTML.replace(
        regex,
        `<span class="relative group cursor-help inline-block px-1 rounded bg-red-500/5 border-b border-dashed border-red-500/30 text-zinc-500">
          $1
          <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 rounded bg-zinc-900 border border-white/[0.08] text-[9px] font-bold text-zinc-300 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-xl leading-relaxed">
            ⚠️ Skipped in 6s scan:<br/>
            ${span.reason}
          </span>
        </span>`
      );
    });

    return <div dangerouslySetInnerHTML={{ __html: resultHTML }} className="leading-relaxed whitespace-pre-line" />;
  };

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold text-white uppercase tracking-widest font-display flex items-center gap-1.5">
          <Eye size={14} className="text-[var(--accent)]" />
          Recruiter Scan Eye-Tracking Simulator
        </h4>
        <div className="text-[10px] text-zinc-500 flex items-center gap-1">
          <HelpCircle size={12} /> Hover highlighted spans to see parser reasoning
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
          <RefreshCw size={24} className="animate-spin text-[var(--accent)]" />
          <p className="text-xs text-zinc-500">Simulating recruiter eye tracking scans...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main simulator preview canvas */}
          <div className="lg:col-span-2 p-6 rounded-xl bg-zinc-950 border border-white/[0.04] text-xs font-medium text-zinc-400 space-y-6 max-h-[500px] overflow-y-auto">
            {/* Header info */}
            <div>
              <h2 className="text-base font-bold text-white">{profile.personalInfo?.name || "Candidate Profile"}</h2>
              <p className="text-[10px] text-zinc-500">{profile.personalInfo?.email} &bull; {profile.personalInfo?.phone}</p>
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <h5 className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider">Summary</h5>
              {renderHighlightedContent(profile.summary || "No summary profile provided.")}
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <h5 className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-wider">Professional Experience</h5>
              {profile.experience?.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-bold text-white text-[11px]">
                    <span>{exp.role} at {exp.company}</span>
                    <span className="text-[10px] text-zinc-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="space-y-1 pl-3 border-l border-white/[0.04]">
                    {exp.bullets?.map((b, bIdx) => (
                      <div key={bIdx} className="flex gap-1.5">
                        <span className="text-zinc-500">&bull;</span>
                        <div className="flex-grow">{renderHighlightedContent(b)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eye tracking insights stats legend */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] space-y-3">
              <h5 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest font-display">
                Eye Tracking Insights
              </h5>

              <div className="space-y-2.5 text-[11px] leading-relaxed text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-400 flex-shrink-0" />
                  <span><strong>High-Impact Anchor Points:</strong> Verified metrics and action triggers that secure callbacks.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-red-500/10 border border-dashed border-red-500/40 flex-shrink-0" />
                  <span><strong>Skipped Blocks:</strong> Passive terminology and lack of metric measurements lead to text skipping.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterScanSimulator;
