"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../state/useAuthStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8000");

export default function PointsTracker() {
  const token = useAuthStore((s) => s.token);

  const { data } = useQuery<{ points: number }>({
    queryKey: ["points"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/gamification/points`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Failed to load points");
      return res.json();
    },
    enabled: !!token,
  });

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="text-lg font-semibold mb-1">Points</h2>
      <p className="text-3xl font-bold text-primary">
        {data?.points ?? 0}
      </p>
      <p className="text-xs text-slate-400 mt-1">
        You&apos;ll earn points as you complete activities.
      </p>
    </section>
  );
}



