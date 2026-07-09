"use client";

import { ChangeEvent, DragEvent, useMemo, useState } from "react";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";

interface UploadZoneProps {
  onUploadComplete?: (fileName: string) => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("Drop a resume here to unlock the experience.");
  const [progress, setProgress] = useState(0);

  const accept = useMemo(() => ".pdf,.doc,.docx", []);

  const handleFile = (file?: File | null) => {
    if (!file) return;
    const isAllowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type) || file.name.toLowerCase().endsWith((accept.split(",") as string[]).map((value) => value.trim()).join(""));
    if (!isAllowed) {
      setStatus("error");
      setMessage("Only PDF or DOCX files are supported.");
      setProgress(0);
      return;
    }

    setStatus("uploading");
    setMessage(`Analyzing ${file.name}...`);
    setProgress(10);

    const timer = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          window.clearInterval(timer);
          setStatus("success");
          setMessage(`${file.name} is ready for AI analysis.`);
          onUploadComplete?.(file.name);
          return 100;
        }
        return value + 12;
      });
    }, 220);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragActive(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  return (
    <div className="w-full">
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-8 text-center transition-all duration-300 ${
          dragActive ? "border-[var(--color-primary)] bg-white/10" : "border-white/15 bg-white/5"
        }`}
      >
        <input type="file" accept={accept} className="hidden" onChange={onChange} />
        <div className={`rounded-full border p-3 ${status === "success" ? "border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 text-[var(--color-primary-light)]" : status === "error" ? "border-rose-400/40 bg-rose-500/10 text-rose-300" : "border-white/10 bg-white/10 text-slate-200"}`}>
          {status === "success" ? <CheckCircle2 size={20} /> : status === "error" ? <AlertCircle size={20} /> : <Upload size={20} />}
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-100">Upload Resume</p>
        <p className="mt-1 text-xs text-slate-400">PDF or DOCX • drag and drop or browse</p>
        <p className="mt-3 text-xs text-slate-500">{message}</p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800/70">
          <div className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </label>
    </div>
  );
}

export default UploadZone;
