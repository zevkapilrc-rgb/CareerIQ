"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../state/useAuthStore";

const API_BASE = "http://localhost:8000";

type Step = {
  title: string;
  description: string;
  eta_hours: number;
};

export default function LearningPath() {
  const token = useAuthStore((s) => s.token);

  const { data } = useQuery<{ steps: Step[] }>({
    queryKey: ["learning-path"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/learning-path/personalized`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Failed to load learning path");
      return res.json();
    },
    enabled: !!token,
  });

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="text-lg font-semibold mb-2">Personalized Learning Path</h2>
      {!token && (
        <p className="text-xs text-slate-400">
          Login to see your personalized roadmap.
        </p>
      )}
      {data && (
        <ol className="mt-2 list-decimal list-inside text-sm text-slate-300 space-y-1">
          {data.steps.map((step) => (
            <li key={step.title}>
              <span className="font-medium">{step.title}</span> ·{" "}
              {step.description} ({step.eta_hours}h)
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}



