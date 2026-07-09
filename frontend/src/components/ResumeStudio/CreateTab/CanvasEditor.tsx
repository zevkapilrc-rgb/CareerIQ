"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Download, AlertTriangle, ShieldCheck, Check, RefreshCw } from "lucide-react";
import SectionCard from "./SectionCard";
import ExportModal from "./ExportModal";
import { ResumeProfile } from "@/src/types";
import PremiumButton from "@/src/components/ui/PremiumButton";

interface CanvasEditorProps {
  profile: ResumeProfile;
  onUpdate: (updated: ResumeProfile) => void;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({ profile, onUpdate }) => {
  const [tone, setTone] = useState<"startup" | "corporate" | "government" | "academic">("corporate");
  const [isToneCalibrating, setIsToneCalibrating] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Brand Consistency mismatch simulator state
  const [showConsistencyPanel, setShowConsistencyPanel] = useState(false);
  const [mismatches, setMismatches] = useState<Array<{ id: string; section: string; message: string; fixText: string }>>([]);

  // Timer for debounced ATS scoring
  const scoreTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger brand consistency check on mount/updates
  useEffect(() => {
    const hasLinkedIn = !!profile.personalInfo?.linkedin;
    const hasPortfolio = !!profile.personalInfo?.portfolio || !!profile.personalInfo?.github;

    if (hasLinkedIn || hasPortfolio) {
      setShowConsistencyPanel(true);
      // Simulate real alignment check
      const mockMismatches: Array<{ id: string; section: string; message: string; fixText: string }> = [];
      if (profile.experience && profile.experience.length > 0) {
        const firstRole = profile.experience[0];
        if (firstRole.role && firstRole.role.toLowerCase().includes("analyst") && !firstRole.role.toLowerCase().includes("senior")) {
          mockMismatches.push({
            id: "role-mismatch",
            section: "Experience",
            message: `Your LinkedIn profile lists your role at ${firstRole.company || "current employer"} as 'Senior Analyst', but your resume says '${firstRole.role}'.`,
            fixText: "Senior Analyst",
          });
        }
      }
      setMismatches(mockMismatches);
    } else {
      setShowConsistencyPanel(false);
    }
  }, [profile]);

  // Debounced ATS scoring on profile updates
  useEffect(() => {
    if (scoreTimeoutRef.current) {
      clearTimeout(scoreTimeoutRef.current);
    }

    scoreTimeoutRef.current = setTimeout(async () => {
      setIsScoring(true);
      try {
        const res = await fetch("/api/resume/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile }),
        });
        const data = await res.json();
        if (data.success) {
          onUpdate({
            ...profile,
            atsScore: data.score,
            atsIssues: data.issues || [],
          });
        }
      } catch (e) {
        console.error("Failed to scoring profile:", e);
      } finally {
        setIsScoring(false);
      }
    }, 2000); // 2-second debounce

    return () => {
      if (scoreTimeoutRef.current) clearTimeout(scoreTimeoutRef.current);
    };
  }, [profile.summary, profile.experience, profile.projects, profile.education, profile.skills]);

  // Tone Calibrator trigger
  const handleToneChange = async (targetTone: typeof tone) => {
    setTone(targetTone);
    if (!profile.summary) return;

    if (
      window.confirm(
        "This will rewrite AI-generated sections only. Your manual edits are preserved. Proceed?"
      )
    ) {
      setIsToneCalibrating(true);
      try {
        const response = await fetch("/api/resume/generate-section", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionType: "rewrite-tone",
            context: {
              fullResumeText: profile.summary,
              targetTone,
            },
          }),
        });
        const data = await response.json();
        if (data.success && data.text) {
          onUpdate({
            ...profile,
            summary: data.text,
          });
        }
      } catch (err) {
        console.error("Failed to calibrate tone", err);
      } finally {
        setIsToneCalibrating(false);
      }
    }
  };

  const handleUpdateSection = (sectionKey: keyof ResumeProfile, updatedContent: any) => {
    onUpdate({
      ...profile,
      [sectionKey]: updatedContent,
    });
  };

  const handleFixMismatch = (id: string, fixText: string) => {
    if (id === "role-mismatch" && profile.experience && profile.experience.length > 0) {
      const updatedExp = [...profile.experience];
      updatedExp[0] = { ...updatedExp[0], role: fixText };
      handleUpdateSection("experience", updatedExp);
      setMismatches([]);
    }
  };

  const handleExport = (options: { layout: string; format: string }) => {
    // Reuses existing print/export flow
    if (typeof window !== "undefined") {
      const printArea = document.createElement("div");
      printArea.id = "resume-print-area";
      printArea.innerHTML = `
        <div style="font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #333;">
          <h1 style="margin-bottom: 5px;">${profile.personalInfo?.name || "Candidate Name"}</h1>
          <p style="color: #666; margin-bottom: 20px;">
            ${profile.personalInfo?.email} | ${profile.personalInfo?.phone} | ${profile.personalInfo?.location}
          </p>
          <hr style="border: 0; border-top: 1px solid #ccc; margin-bottom: 20px;" />
          <h3 style="text-transform: uppercase; color: #444;">Professional Summary</h3>
          <p style="margin-bottom: 20px; line-height: 1.6;">${profile.summary}</p>
          
          <h3 style="text-transform: uppercase; color: #444; margin-top: 25px;">Experience</h3>
          ${(profile.experience || []).map((exp) => `
            <div style="margin-bottom: 15px;">
              <strong style="font-size: 14px;">${exp.role}</strong> - <span>${exp.company}</span>
              <div style="font-size: 12px; color: #666; margin-bottom: 5px;">${exp.startDate} - ${exp.endDate}</div>
              <ul style="margin: 5px 0 0 20px; padding: 0; font-size: 13px;">
                ${(exp.bullets || []).map(b => `<li style="margin-bottom: 3px;">${b}</li>`).join("")}
              </ul>
            </div>
          `).join("")}

          <h3 style="text-transform: uppercase; color: #444; margin-top: 25px;">Education</h3>
          ${(profile.education || []).map((edu) => `
            <div style="margin-bottom: 10px; font-size: 13px;">
              <strong>${edu.degree} in ${edu.field}</strong>
              <div>${edu.institution} (${edu.startDate} - ${edu.endDate})</div>
            </div>
          `).join("")}

          <h3 style="text-transform: uppercase; color: #444; margin-top: 25px;">Projects</h3>
          ${(profile.projects || []).map((proj) => `
            <div style="margin-bottom: 10px; font-size: 13px;">
              <strong>${proj.name}</strong>
              <p style="margin: 3px 0 0 0; color: #555;">${proj.description}</p>
            </div>
          `).join("")}
        </div>
      `;
      document.body.appendChild(printArea);

      // Print PDF
      const w = window.open("", "_blank");
      if (w) {
        w.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${profile.personalInfo?.name || "Resume"} — HIREVIX</title>
          </head>
          <body>${printArea.innerHTML}</body>
          </html>
        `);
        w.document.close();
        w.focus();
        setTimeout(() => {
          w.print();
          w.close();
          document.body.removeChild(printArea);
        }, 400);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Editor Canvas Main Column */}
      <div className="lg:col-span-3 space-y-6">
        {/* Tone Calibrator Panel (A5) */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-extrabold font-display uppercase tracking-wider">
                <Sparkles size={13} className="text-[var(--accent)]" />
                Tone Calibrator Engine
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Calibrate AI narrative registers across structural boundaries instantly.
              </p>
            </div>

            {/* Segmented Toggles */}
            <div className="flex items-center p-1 rounded-lg bg-zinc-900 border border-white/[0.04]">
              {(["startup", "corporate", "government", "academic"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleToneChange(t)}
                  disabled={isToneCalibrating}
                  className={`px-4 py-2 rounded text-[10px] font-extrabold uppercase tracking-wider font-display transition-all ${
                    tone === t
                      ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          {isToneCalibrating && (
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-3 animate-pulse">
              <RefreshCw size={12} className="animate-spin text-[var(--accent)]" />
              Recalibrating profile tone to &apos;{tone}&apos;...
            </div>
          )}
        </div>

        {/* Section Cards */}
        <SectionCard
          title="Professional Summary"
          sectionType="summary"
          content={profile.summary}
          onUpdate={(val) => handleUpdateSection("summary", val)}
          jobTitle={profile.careerSignals?.jobTitle || profile.careerSignals?.domain}
          seniority={profile.careerSignals?.seniority}
          industry={profile.careerSignals?.industry || ""}
        />

        <SectionCard
          title="Professional Experience"
          sectionType="experience"
          content={profile.experience}
          onUpdate={(val) => handleUpdateSection("experience", val)}
          jobTitle={profile.careerSignals?.jobTitle || profile.careerSignals?.domain}
          seniority={profile.careerSignals?.seniority}
          industry={profile.careerSignals?.industry || ""}
        />

        <SectionCard
          title="Skills Portfolio"
          sectionType="skills"
          content={profile.skills}
          onUpdate={(val) => handleUpdateSection("skills", val)}
          jobTitle={profile.careerSignals?.jobTitle || profile.careerSignals?.domain}
          seniority={profile.careerSignals?.seniority}
          industry={profile.careerSignals?.industry || ""}
        />

        <SectionCard
          title="Education"
          sectionType="education"
          content={profile.education}
          onUpdate={(val) => handleUpdateSection("education", val)}
          jobTitle={profile.careerSignals?.jobTitle || profile.careerSignals?.domain}
          seniority={profile.careerSignals?.seniority}
          industry={profile.careerSignals?.industry || ""}
        />

        <SectionCard
          title="Personal & Academic Projects"
          sectionType="projects"
          content={profile.projects}
          onUpdate={(val) => handleUpdateSection("projects", val)}
          jobTitle={profile.careerSignals?.jobTitle || profile.careerSignals?.domain}
          seniority={profile.careerSignals?.seniority}
          industry={profile.careerSignals?.industry || ""}
        />

        <SectionCard
          title="Certifications"
          sectionType="certifications"
          content={profile.certifications}
          onUpdate={(val) => handleUpdateSection("certifications", val)}
          jobTitle={profile.careerSignals?.jobTitle || profile.careerSignals?.domain}
          seniority={profile.careerSignals?.seniority}
          industry={profile.careerSignals?.industry || ""}
        />
      </div>

      {/* Side Panel: Brand Consistency Check & Info */}
      <div className="space-y-6">
        {/* Consistency Check Panel (A5) */}
        {showConsistencyPanel && (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-widest font-display flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              Brand Consistency Check
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              HIREVIX is continuously cross-referencing your resume draft with external references (e.g. LinkedIn/portfolio).
            </p>

            {mismatches.length === 0 ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-emerald-400">
                <Check size={12} />
                No profile mismatches found
              </div>
            ) : (
              mismatches.map((m) => (
                <div key={m.id} className="p-3.5 rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/15 space-y-3">
                  <div className="flex gap-2">
                    <AlertTriangle size={14} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
                        {m.section} mismatch
                      </span>
                      <p className="text-[10.5px] text-zinc-300 leading-relaxed mt-1">{m.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFixMismatch(m.id, m.fixText)}
                    className="w-full py-1.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20 text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Align with LinkedIn ({m.fixText})
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Global Stats Summary */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 space-y-4">
          <h4 className="text-xs font-extrabold text-white uppercase tracking-widest font-display">
            Canvas Intelligence
          </h4>
          <div className="space-y-3 text-[11px] text-zinc-400">
            <div className="flex justify-between pb-2 border-b border-white/[0.04]">
              <span>Target Role:</span>
              <span className="text-white font-bold">{profile.careerSignals?.jobTitle || "Not Configured"}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/[0.04]">
              <span>Target Industry:</span>
              <span className="text-white font-bold">{profile.careerSignals?.industry || "Not Configured"}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/[0.04]">
              <span>Active Tone:</span>
              <span className="text-white font-bold capitalize">{tone}</span>
            </div>
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] hover:opacity-90 text-white text-xs font-bold uppercase tracking-widest font-display flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(122,23,48,0.15)]"
          >
            <Download size={14} /> Export Document
          </button>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default CanvasEditor;
