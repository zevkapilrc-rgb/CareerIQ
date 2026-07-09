"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../state/useAuthStore";
import { Card } from "@/src/components/ui/Card";
import { Award } from "lucide-react";

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
    <Card className="p-6 flex flex-col justify-between h-44">
      <div>
        <h2 className="text-sm font-semibold text-zinc-200 tracking-wider uppercase mb-1 flex items-center gap-2">
          <Award size={14} className="text-[var(--teal)]" /> Accumulated Points
        </h2>
        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
          You&apos;ll earn points as you complete activities.
        </p>
      </div>
      <div>
        <p className="text-4xl font-normal font-mono text-zinc-100">
          {data?.points ?? 0} <span className="text-xs text-zinc-500 font-sans tracking-wide uppercase">pts</span>
        </p>
      </div>
    </Card>
  );
}





