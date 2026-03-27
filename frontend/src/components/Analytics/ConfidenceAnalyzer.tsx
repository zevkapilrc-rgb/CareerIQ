"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../state/useAuthStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type ConfidenceResponse = {
  confidence: number;
  notes: string[];
};

export default function ConfidenceAnalyzer() {
  const token = useAuthStore((s) => s.token);

  const { data } = useQuery<ConfidenceResponse>({
    queryKey: ["confidence-score"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/analytics/confidence-score`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Failed to load confidence score");
      return res.json();
    },
    enabled: !!token,
  });

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="text-lg font-semibold mb-2">AI Confidence Analyzer</h2>
      {!token && (
        <p className="text-xs text-slate-400">
          Login to analyze your interview confidence.
        </p>
      )}
      {data && (
        <div className="space-y-1 text-sm">
          <div>
            <span className="font-semibold">Confidence:</span>{" "}
            {(data.confidence * 100).toFixed(0)}%
          </div>
          <ul className="list-disc list-inside text-slate-300">
            {data.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}



