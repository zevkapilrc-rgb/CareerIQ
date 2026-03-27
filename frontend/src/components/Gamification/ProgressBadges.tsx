"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../state/useAuthStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ProgressBadges() {
  const token = useAuthStore((s) => s.token);

  const { data } = useQuery<{ badges: string[] }>({
    queryKey: ["badges"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/gamification/badges`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Failed to load badges");
      return res.json();
    },
    enabled: !!token,
  });

  const badges = data?.badges ?? ["Rookie", "Consistent", "Rising Star"];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="text-lg font-semibold mb-2">Badges</h2>
      <div className="flex gap-2">
        {badges.map((badge) => (
          <span
            key={badge}
            className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-300 border border-amber-500/40"
          >
            {badge}
          </span>
        ))}
      </div>
    </section>
  );
}



