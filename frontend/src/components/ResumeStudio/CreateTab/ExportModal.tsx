"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Download, AlertTriangle } from "lucide-react";
import PremiumButton from "@/src/components/ui/PremiumButton";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: { layout: "ats-safe" | "visual"; format: "pdf" | "docx" }) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport }) => {
  const [layout, setLayout] = useState<"ats-safe" | "visual">("ats-safe");
  const [format, setFormat] = useState<"pdf" | "docx">("pdf");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleExportClick = () => {
    setLoading(true);
    setTimeout(() => {
      onExport({ layout, format });
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0E1321] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Download className="text-[var(--accent)]" size={18} />
            <h3 className="text-lg font-bold text-white font-display uppercase tracking-wider">
              Export Resume
            </h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Layout Choice */}
          <div className="space-y-3">
            <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest block">
              Layout Template
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setLayout("ats-safe")}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  layout === "ats-safe"
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-white"
                    : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:border-white/[0.12]"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={16} className={layout === "ats-safe" ? "text-[var(--color-primary)]" : "text-zinc-400"} />
                  <span className="text-xs font-bold font-display uppercase tracking-wider">ATS-Safe (Recommended)</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Single-column standard fonts, maximum parser compatibility for online applications.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setLayout("visual")}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  layout === "visual"
                    ? "border-[var(--accent)] bg-[var(--accent)]/5 text-white"
                    : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:border-white/[0.12]"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className={layout === "visual" ? "text-[var(--accent)]" : "text-zinc-400"} />
                  <span className="text-xs font-bold font-display uppercase tracking-wider">Visual Multi-Column</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Highly styled multi-column portfolio layout suited for networking and direct email.
                </p>
              </button>
            </div>
          </div>

          {layout === "visual" && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/10 text-[11px] text-[var(--accent)]">
              <AlertTriangle className="flex-shrink-0" size={14} />
              <p className="leading-relaxed">
                Multi-column layouts can confuse some older ATS parsing systems — keep the ATS-Safe version for online form submissions.
              </p>
            </div>
          )}

          {/* Format Choice */}
          <div className="space-y-3">
            <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest block">
              Document Format
            </label>
            <div className="grid grid-cols-2 gap-4">
              {(["pdf", "docx"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`py-3 rounded-lg text-xs font-bold font-display uppercase tracking-widest border transition-all duration-200 ${
                    format === fmt
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white"
                      : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white"
                  }`}
                >
                  {fmt === "pdf" ? "Portable Document (PDF)" : "Microsoft Word (DOCX)"}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-xs font-bold font-display uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <PremiumButton onClick={handleExportClick} variant="primary" size="md" disabled={loading}>
              {loading ? "Exporting..." : "Download Document"}
            </PremiumButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
