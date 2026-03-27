"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "../../state/useAuthStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ResumeUpload() {
  const token = useAuthStore((s) => s.token);
  const [score, setScore] = useState<number | null>(null);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/resume/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: (data) => {
      setScore(data.score);
      setStrengths(data.strengths);
      setImprovements(data.improvements);
      toast.success("Resume analyzed");
    },
    onError: () => toast.error("Upload failed"),
  });

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="text-lg font-semibold mb-2">AI Resume Scoring</h2>
      <input
        type="file"
        className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-dark"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) mutation.mutate(file);
        }}
      />
      {score !== null && (
        <div className="mt-3 space-y-2 text-sm">
          <div>
            <span className="font-semibold">Score:</span> {score.toFixed(1)}
          </div>
          <div>
            <span className="font-semibold">Strengths:</span>{" "}
            {strengths.join(", ")}
          </div>
          <div>
            <span className="font-semibold">Improvements:</span>{" "}
            {improvements.join(", ")}
          </div>
        </div>
      )}
    </section>
  );
}



