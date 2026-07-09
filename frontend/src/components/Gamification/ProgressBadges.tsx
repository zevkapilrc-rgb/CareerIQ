"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../state/useAuthStore";
import { Card } from "@/src/components/ui/Card";
import { BadgeCheck } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8000");

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
    <Card className="p-6 flex flex-col justify-between h-44">
      <div>
        <h2 className="text-sm font-semibold text-zinc-200 tracking-wider uppercase mb-1 flex items-center gap-2">
          <BadgeCheck size={14} className="text-[var(--teal)]" /> Unlocked Badges
        </h2>
        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
          Achievements earned through platform engagement.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <span
            key={badge}
            className="rounded-lg bg-[var(--teal)]/10 px-3 py-1 text-xs text-[#FCA5A5] border border-[var(--teal)]/20 font-medium"
          >
            {badge}
          </span>
        ))}
      </div>
    </Card>
  );
}





