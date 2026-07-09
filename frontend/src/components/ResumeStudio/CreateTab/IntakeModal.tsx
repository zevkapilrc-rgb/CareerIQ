"use client";

import React, { useState } from "react";
import { X, Sparkles, AlertTriangle } from "lucide-react";
import PremiumButton from "@/src/components/ui/PremiumButton";
import { Input } from "@/src/components/ui/Input";

interface IntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { jobTitle: string; seniority: "entry" | "mid" | "senior"; industry: string }) => void;
}

export const IntakeModal: React.FC<IntakeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [seniority, setSeniority] = useState<"entry" | "mid" | "senior">("mid");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !industry) return;
    setLoading(true);
    try {
      await onSubmit({ jobTitle, seniority, industry });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0E1321] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Sparkles className="text-[var(--accent)]" size={18} />
            <h3 className="text-lg font-bold text-white font-display uppercase tracking-wider">
              Intake Configuration
            </h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest block">
              Target Job Title
            </label>
            <Input
              type="text"
              placeholder="e.g. Senior Frontend Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              className="bg-white/[0.02] border-white/[0.08] text-white focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest block">
              Seniority Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["entry", "mid", "senior"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSeniority(level)}
                  className={`py-2 px-4 rounded-lg text-xs font-bold font-display uppercase tracking-widest border transition-all duration-200 ${
                    seniority === level
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest block">
              Target Industry
            </label>
            <Input
              type="text"
              placeholder="e.g. Finance, Tech, Healthcare"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
              className="bg-white/[0.02] border-white/[0.08] text-white focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/10 text-[11px] text-zinc-400">
            <AlertTriangle className="text-[var(--accent)] flex-shrink-0" size={14} />
            <p>
              HIREVIX will generate a personalized Professional Summary section instantly on submit. You can build other sections sequentially.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-xs font-bold font-display uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <PremiumButton type="submit" variant="primary" size="md" disabled={loading}>
              {loading ? "Generating summary..." : "Generate Base Profile"}
            </PremiumButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntakeModal;
