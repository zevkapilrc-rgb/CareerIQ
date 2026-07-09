"use client";

import React, { useState } from "react";
import { Sparkles, Edit3, Trash2, Plus, RefreshCw, Check, X, Wand2 } from "lucide-react";
import PremiumButton from "@/src/components/ui/PremiumButton";
import { Input, Textarea } from "@/src/components/ui/Input";

interface SectionCardProps {
  title: string;
  sectionType: "summary" | "experience" | "education" | "skills" | "projects" | "certifications";
  content: any;
  onUpdate: (updatedContent: any) => void;
  jobTitle: string;
  seniority: string;
  industry: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  sectionType,
  content,
  onUpdate,
  jobTitle,
  seniority,
  industry,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState("");

  // AI Generation inline form state
  const [showAiForm, setShowAiForm] = useState(false);
  const [rawFacts, setRawFacts] = useState("");

  // Temporary container for before/after comparison
  const [aiProposal, setAiProposal] = useState<{ index?: number; field?: string; original: string; proposed: string } | null>(null);

  // Helper: call API route to generate section content
  const callGenerateSection = async (facts: string, customInstruction?: string) => {
    setIsLoading(true);
    setError(null);
    setLoadingMsg("Orchestrating AI generation...");
    try {
      const response = await fetch("/api/resume/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType,
          context: {
            jobTitle,
            seniority,
            industry,
            rawFacts: facts,
            instruction: customInstruction,
          },
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Failed to generate section");
      return data.text;
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render Section: SUMMARY ──────────────────────────────────────
  if (sectionType === "summary") {
    const summaryText = typeof content === "string" ? content : "";

    const handleGenerateSummary = async () => {
      const result = await callGenerateSection(
        summaryText || `Professional summary for target job title: ${jobTitle} in ${industry} industry.`
      );
      if (result) {
        setAiProposal({
          field: "summary",
          original: summaryText,
          proposed: result,
        });
      }
    };

    return (
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 relative overflow-hidden transition-all duration-300 hover:border-white/[0.1]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-widest font-display">
            {title}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleGenerateSummary}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-xs font-bold text-[var(--color-accent)] hover:bg-[var(--color-primary)]/20 transition-all duration-200"
            >
              <Sparkles size={13} />
              {summaryText ? "Refine Summary" : "Generate with AI"}
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
            >
              <Edit3 size={15} />
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-[var(--red)] mb-3">{error}</p>}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3 animate-pulse">
            <RefreshCw size={12} className="animate-spin text-[var(--accent)]" />
            {loadingMsg}
          </div>
        )}

        {/* AI Proposal Comparison Overlay */}
        {aiProposal && (
          <div className="bg-[#0D1321] border border-[var(--accent)]/30 rounded-lg p-4 mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-[var(--accent)] uppercase tracking-wider">
                AI Suggestion
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onUpdate(aiProposal.proposed);
                    setAiProposal(null);
                  }}
                  className="flex items-center gap-1 py-1 px-2.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold"
                >
                  <Check size={11} /> Accept
                </button>
                <button
                  onClick={() => setAiProposal(null)}
                  className="flex items-center gap-1 py-1 px-2.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.08] text-[10px] font-bold"
                >
                  <X size={11} /> Keep Original
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded bg-white/[0.01] border border-white/[0.04]">
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1 font-bold">Original</div>
                <p className="text-zinc-400 italic">{aiProposal.original || "Empty"}</p>
              </div>
              <div className="p-3 rounded bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20">
                <div className="text-[9px] text-[var(--color-primary)] uppercase tracking-wider mb-1 font-bold">Proposed</div>
                <p className="text-white font-medium">{aiProposal.proposed}</p>
              </div>
            </div>
          </div>
        )}

        {isEditing ? (
          <Textarea
            value={summaryText}
            onChange={(e) => onUpdate(e.target.value)}
            className="w-full bg-white/[0.02] border-white/[0.08] text-white focus:border-[var(--color-primary)] text-sm leading-relaxed"
            rows={4}
          />
        ) : (
          <p className="text-sm text-zinc-300 leading-relaxed font-medium">
            {summaryText || <span className="text-zinc-500 italic">No summary added yet. Click &apos;Generate with AI&apos; or type manually.</span>}
          </p>
        )}
      </div>
    );
  }

  // ─── Render Section: EXPERIENCE ──────────────────────────────────
  if (sectionType === "experience") {
    const list = Array.isArray(content) ? content : [];

    const handleAddExperience = () => {
      const newExp = {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        location: "",
        bullets: [""],
      };
      onUpdate([...list, newExp]);
      setIsEditing(true);
    };

    const handleUpdateExp = (idx: number, field: string, val: any) => {
      const copy = [...list];
      copy[idx] = { ...copy[idx], [field]: val };
      onUpdate(copy);
    };

    const handleAddBullet = (expIdx: number) => {
      const copy = [...list];
      copy[expIdx].bullets = [...(copy[expIdx].bullets || []), ""];
      onUpdate(copy);
    };

    const handleUpdateBullet = (expIdx: number, bulletIdx: number, val: string) => {
      const copy = [...list];
      const bullets = [...(copy[expIdx].bullets || [])];
      bullets[bulletIdx] = val;
      copy[expIdx].bullets = bullets;
      onUpdate(copy);
    };

    const handleRemoveBullet = (expIdx: number, bulletIdx: number) => {
      const copy = [...list];
      copy[expIdx].bullets = copy[expIdx].bullets.filter((_: any, i: number) => i !== bulletIdx);
      onUpdate(copy);
    };

    const handleRegenerateBullet = async (expIdx: number, bulletIdx: number) => {
      const originalText = list[expIdx].bullets[bulletIdx];
      if (!originalText) return;
      const result = await callGenerateSection(originalText, "quantify impact with metrics");
      if (result) {
        setAiProposal({
          index: expIdx * 1000 + bulletIdx,
          original: originalText,
          proposed: result,
        });
      }
    };

    const handleAcceptProposal = (propIndex: number) => {
      const eIdx = Math.floor(propIndex / 1000);
      const bIdx = propIndex % 1000;
      const copy = [...list];
      const bullets = [...copy[eIdx].bullets];
      bullets[bIdx] = aiProposal?.proposed || "";
      copy[eIdx].bullets = bullets;
      onUpdate(copy);
      setAiProposal(null);
    };

    return (
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 relative overflow-hidden transition-all duration-300 hover:border-white/[0.1] space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-widest font-display">
            {title}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleAddExperience}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-bold text-white hover:bg-white/[0.06] transition-all duration-200"
            >
              <Plus size={13} /> Add Role
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
            >
              <Edit3 size={15} />
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-[var(--red)]">{error}</p>}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 animate-pulse">
            <RefreshCw size={12} className="animate-spin text-[var(--accent)]" />
            {loadingMsg}
          </div>
        )}

        <div className="space-y-6">
          {list.length === 0 ? (
            <p className="text-xs text-zinc-500 italic">No roles added yet. Click &apos;Add Role&apos; to begin.</p>
          ) : (
            list.map((exp, expIdx) => (
              <div key={expIdx} className="p-4 rounded-lg bg-white/[0.01] border border-white/[0.03] space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Company"
                      value={exp.company || ""}
                      onChange={(e) => handleUpdateExp(expIdx, "company", e.target.value)}
                      className="bg-white/[0.01] border-white/[0.08]"
                    />
                    <Input
                      placeholder="Role"
                      value={exp.role || ""}
                      onChange={(e) => handleUpdateExp(expIdx, "role", e.target.value)}
                      className="bg-white/[0.01] border-white/[0.08]"
                    />
                    <Input
                      placeholder="Start Date"
                      value={exp.startDate || ""}
                      onChange={(e) => handleUpdateExp(expIdx, "startDate", e.target.value)}
                      className="bg-white/[0.01] border-white/[0.08]"
                    />
                    <Input
                      placeholder="End Date (or Present)"
                      value={exp.endDate || ""}
                      onChange={(e) => handleUpdateExp(expIdx, "endDate", e.target.value)}
                      className="bg-white/[0.01] border-white/[0.08]"
                    />
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{exp.role || "Role"}</h4>
                      <p className="text-xs text-[var(--accent)] font-bold font-display uppercase tracking-wider mt-0.5">
                        {exp.company || "Company"} &bull; {exp.startDate} - {exp.endDate}
                      </p>
                    </div>
                    <button
                      onClick={() => onUpdate(list.filter((_, i) => i !== expIdx))}
                      className="text-zinc-500 hover:text-[var(--red)] transition-all p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}

                {/* Bullets */}
                <div className="space-y-3 pl-4 border-l border-white/[0.04]">
                  {exp.bullets?.map((bullet: string, bIdx: number) => {
                    const propKey = expIdx * 1000 + bIdx;
                    const hasProposal = aiProposal?.index === propKey;

                    return (
                      <div key={bIdx} className="space-y-2">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={bullet || ""}
                              onChange={(e) => handleUpdateBullet(expIdx, bIdx, e.target.value)}
                              className="bg-white/[0.01] border-white/[0.08] text-xs flex-grow"
                            />
                            <button
                              type="button"
                              onClick={() => handleRegenerateBullet(expIdx, bIdx)}
                              className="p-2 rounded bg-[var(--color-primary)]/10 text-[var(--color-accent)] border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/20"
                            >
                              <Wand2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveBullet(expIdx, bIdx)}
                              className="p-2 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ) : (
                          <div className="group flex items-start gap-2 text-xs leading-relaxed text-zinc-300">
                            <span className="text-[var(--color-primary)] font-bold mt-0.5">&bull;</span>
                            <span className="flex-grow">{bullet || "New achievement bullet"}</span>
                            <div className="opacity-0 group-hover:opacity-100 flex gap-1.5 transition-all">
                              <button
                                onClick={() => handleRegenerateBullet(expIdx, bIdx)}
                                className="p-1 rounded bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/20 text-[var(--color-accent)]"
                                title="Regenerate with AI"
                              >
                                <Wand2 size={11} />
                              </button>
                              <button
                                onClick={() => {
                                  setIsEditing(true);
                                }}
                                className="p-1 rounded bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                                title="Edit Bullet"
                              >
                                <Edit3 size={11} />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Proposal for this bullet */}
                        {hasProposal && (
                          <div className="bg-[#0D1321] border border-[var(--accent)]/30 rounded-lg p-3 space-y-2 ml-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-extrabold text-[var(--accent)] uppercase tracking-wider">
                                Bullet suggestion
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleAcceptProposal(propKey)}
                                  className="py-0.5 px-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => setAiProposal(null)}
                                  className="py-0.5 px-2 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.08] text-[9px] font-bold"
                                >
                                  Skip
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                              <p className="text-zinc-500 italic">{aiProposal.original}</p>
                              <p className="text-white font-medium">{aiProposal.proposed}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {isEditing && (
                    <button
                      onClick={() => handleAddBullet(expIdx)}
                      className="flex items-center gap-1 text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider mt-2 hover:underline"
                    >
                      <Plus size={11} /> Add Bullet
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ─── Render Sections: EDUCATION, PROJECTS, SKILLS, CERTIFICATIONS ──────────
  // Simplify these sections so they display beautifully, are editable, and offer AI support
  const handleAddNewItem = () => {
    if (sectionType === "education") {
      const entry = { institution: "", degree: "", field: "", startDate: "", endDate: "", highlights: [] };
      onUpdate([...(Array.isArray(content) ? content : []), entry]);
      setIsEditing(true);
    } else if (sectionType === "projects") {
      const entry = { name: "", description: "", technologies: [], highlights: [] };
      onUpdate([...(Array.isArray(content) ? content : []), entry]);
      setIsEditing(true);
    } else if (sectionType === "certifications") {
      onUpdate([...(Array.isArray(content) ? content : []), "New Certification"]);
      setIsEditing(true);
    } else if (sectionType === "skills") {
      const copy = {
        technical: [...(content?.technical || [])],
        soft: [...(content?.soft || [])],
        tools: [...(content?.tools || [])],
      };
      copy.technical.push({ name: "New Skill", category: "Technical", proficiency: 80, evidenceSource: "Manual Entry" });
      onUpdate(copy);
      setIsEditing(true);
    }
  };

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 relative overflow-hidden transition-all duration-300 hover:border-white/[0.1] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-widest font-display">
          {title}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleAddNewItem}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-bold text-white hover:bg-white/[0.06] transition-all duration-200"
          >
            <Plus size={13} /> Add Item
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
          >
            <Edit3 size={15} />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[11px] text-zinc-400 mb-2">
            <Sparkles className="text-[var(--accent)] flex-shrink-0" size={14} />
            <p>You can edit standard text and details directly below. Tap the toggle button to exit edit mode.</p>
          </div>
          {sectionType === "certifications" && Array.isArray(content) && (
            <div className="space-y-2">
              {content.map((cert: string, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={cert || ""}
                    onChange={(e) => {
                      const copy = [...content];
                      copy[idx] = e.target.value;
                      onUpdate(copy);
                    }}
                    className="bg-white/[0.01] border-white/[0.08] text-xs"
                  />
                  <button
                    onClick={() => onUpdate(content.filter((_, i) => i !== idx))}
                    className="p-2 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {sectionType === "skills" && (
            <div className="space-y-4">
              {["technical", "soft", "tools"].map((catKey) => {
                const list = content?.[catKey] || [];
                return (
                  <div key={catKey} className="space-y-2">
                    <h4 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">{catKey} Skills</h4>
                    {list.map((sk: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input
                          value={sk.name || ""}
                          placeholder="Skill Name"
                          onChange={(e) => {
                            const copy = { ...content };
                            copy[catKey][idx] = { ...copy[catKey][idx], name: e.target.value };
                            onUpdate(copy);
                          }}
                          className="bg-white/[0.01] border-white/[0.08] text-xs"
                        />
                        <button
                          onClick={() => {
                            const copy = { ...content };
                            copy[catKey] = copy[catKey].filter((_: any, i: number) => i !== idx);
                            onUpdate(copy);
                          }}
                          className="p-2 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {sectionType === "education" && Array.isArray(content) && (
            <div className="space-y-4">
              {content.map((edu: any, idx: number) => (
                <div key={idx} className="p-3 bg-white/[0.01] border border-white/[0.05] rounded space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Institution"
                      value={edu.institution || ""}
                      onChange={(e) => {
                        const copy = [...content];
                        copy[idx] = { ...copy[idx], institution: e.target.value };
                        onUpdate(copy);
                      }}
                      className="bg-white/[0.01] border-white/[0.08]"
                    />
                    <Input
                      placeholder="Degree"
                      value={edu.degree || ""}
                      onChange={(e) => {
                        const copy = [...content];
                        copy[idx] = { ...copy[idx], degree: e.target.value };
                        onUpdate(copy);
                      }}
                      className="bg-white/[0.01] border-white/[0.08]"
                    />
                  </div>
                  <button
                    onClick={() => onUpdate(content.filter((_, i) => i !== idx))}
                    className="text-xs text-red-400 flex items-center gap-1 hover:underline"
                  >
                    <Trash2 size={11} /> Remove Entry
                  </button>
                </div>
              ))}
            </div>
          )}

          {sectionType === "projects" && Array.isArray(content) && (
            <div className="space-y-4">
              {content.map((proj: any, idx: number) => (
                <div key={idx} className="p-3 bg-white/[0.01] border border-white/[0.05] rounded space-y-2">
                  <Input
                    placeholder="Project Name"
                    value={proj.name || ""}
                    onChange={(e) => {
                      const copy = [...content];
                      copy[idx] = { ...copy[idx], name: e.target.value };
                      onUpdate(copy);
                    }}
                    className="bg-white/[0.01] border-white/[0.08]"
                  />
                  <Textarea
                    placeholder="Description"
                    value={proj.description || ""}
                    onChange={(e) => {
                      const copy = [...content];
                      copy[idx] = { ...copy[idx], description: e.target.value };
                      onUpdate(copy);
                    }}
                    className="bg-white/[0.01] border-white/[0.08]"
                    rows={2}
                  />
                  <button
                    onClick={() => onUpdate(content.filter((_, i) => i !== idx))}
                    className="text-xs text-red-400 flex items-center gap-1 hover:underline"
                  >
                    <Trash2 size={11} /> Remove Entry
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs text-zinc-300 space-y-2">
          {sectionType === "certifications" && Array.isArray(content) && (
            <ul className="list-disc pl-4 space-y-1">
              {content.map((cert: string, idx: number) => (
                <li key={idx}>{cert}</li>
              ))}
            </ul>
          )}

          {sectionType === "skills" && (
            <div className="flex flex-wrap gap-2">
              {[...(content?.technical || []), ...(content?.soft || []), ...(content?.tools || [])].map((sk: any, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.06] text-white font-medium"
                >
                  {sk.name || sk}
                </span>
              ))}
            </div>
          )}

          {sectionType === "education" && Array.isArray(content) && (
            <div className="space-y-3">
              {content.map((edu: any, idx: number) => (
                <div key={idx}>
                  <h4 className="font-extrabold text-white">{edu.institution || "Institution"}</h4>
                  <p className="text-zinc-400 text-[11px] mt-0.5">{edu.degree} &bull; {edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          )}

          {sectionType === "projects" && Array.isArray(content) && (
            <div className="space-y-4">
              {content.map((proj: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <h4 className="font-extrabold text-white">{proj.name || "Project"}</h4>
                  <p className="leading-relaxed text-zinc-400">{proj.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SectionCard;
