"use client";

import React, { useMemo, useState } from "react";
import { Sparkles, RefreshCw, Copy, CheckCircle2 } from "lucide-react";
import { ResumeProfile } from "@/src/types";
import { buildCoverLetterPrompt } from "@/src/lib/coverLetterUtils";

interface CoverLetterComposerProps {
  profile: ResumeProfile;
}

export const CoverLetterComposer: React.FC<CoverLetterComposerProps> = ({ profile }) => {
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [focus, setFocus] = useState("");
  const [tone, setTone] = useState("confident and concise");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prompt = useMemo(() => buildCoverLetterPrompt(profile, { role, company, tone, focus }), [company, focus, profile, role, tone]);

  const handleGenerate = async () => {
    if (!role.trim() || !company.trim()) {
      setError("Please provide a target role and company first.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/resume/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: "cover-letter",
          context: {
            role,
            company,
            focus,
            tone,
            profile,
          },
        }),
      });

      const resJson = await response.json();
      if (!resJson.success) throw new Error(resJson.error || "Failed to generate cover letter");
      setDraft(resJson.text || "Your cover letter draft will appear here.");
    } catch (err: any) {
      setError(err.message || "Unexpected issue while generating the draft.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!draft) return;
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center gap-2">
        <Sparkles size={15} className="text-[var(--accent)]" />
        <h4 className="text-sm font-extrabold uppercase tracking-widest text-white">Cover Letter Studio</h4>
      </div>
      <p className="text-xs leading-relaxed text-zinc-400">
        Generate a tailored letter from your current profile and sharpen it for a specific company or role.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-xs text-zinc-400">
          <span className="font-semibold uppercase tracking-wider">Target role</span>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Senior Product Engineer"
            className="w-full rounded-lg border border-white/[0.08] bg-slate-950/40 px-3 py-2 text-sm text-white outline-none"
          />
        </label>
        <label className="space-y-2 text-xs text-zinc-400">
          <span className="font-semibold uppercase tracking-wider">Company</span>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Hirevix"
            className="w-full rounded-lg border border-white/[0.08] bg-slate-950/40 px-3 py-2 text-sm text-white outline-none"
          />
        </label>
      </div>

      <label className="space-y-2 text-xs text-zinc-400">
        <span className="font-semibold uppercase tracking-wider">Optional focus</span>
        <input
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          placeholder="AI platform experience, leadership, or cross-functional delivery"
          className="w-full rounded-lg border border-white/[0.08] bg-slate-950/40 px-3 py-2 text-sm text-white outline-none"
        />
      </label>

      <label className="space-y-2 text-xs text-zinc-400">
        <span className="font-semibold uppercase tracking-wider">Tone</span>
        <input
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          placeholder="confident and concise"
          className="w-full rounded-lg border border-white/[0.08] bg-slate-950/40 px-3 py-2 text-sm text-white outline-none"
        />
      </label>

      <div className="rounded-lg border border-white/[0.06] bg-slate-950/30 p-3 text-[11px] text-zinc-500">
        <div className="mb-2 font-semibold uppercase tracking-wider text-zinc-400">Prompt preview</div>
        <pre className="whitespace-pre-wrap leading-relaxed text-zinc-400">{prompt}</pre>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleGenerate}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white"
        >
          {loading ? <span className="flex items-center gap-2"><RefreshCw size={12} className="animate-spin" /> Drafting…</span> : "Generate Draft"}
        </button>
        {draft ? (
          <button
            onClick={handleCopy}
            className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-300"
          >
            {copied ? <span className="flex items-center gap-2"><CheckCircle2 size={12} /> Copied</span> : <span className="flex items-center gap-2"><Copy size={12} /> Copy</span>}
          </button>
        ) : null}
      </div>

      {error ? <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">{error}</div> : null}

      {draft ? (
        <div className="rounded-lg border border-white/[0.06] bg-slate-950/40 p-4 text-sm leading-7 text-zinc-200">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Generated draft</div>
          <div className="whitespace-pre-wrap">{draft}</div>
        </div>
      ) : null}
    </div>
  );
};

export default CoverLetterComposer;
