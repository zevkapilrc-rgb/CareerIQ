"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../state/useAuthStore";
import GlassCard from "../ui/GlassCard";
import Badge from "../ui/Badge";
import { BarChart3, Database, MessageSquare } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8000");

type AdminAnalytics = {
  active_users: number;
  total_resumes_scored: number;
  interviews_run: number;
};

export default function AdminDashboard() {
  const token = useAuthStore((s) => s.token);

  const { data } = useQuery<AdminAnalytics>({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/admin/analytics`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Failed to load admin analytics");
      return res.json();
    },
    enabled: !!token,
  });

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-bold text-white uppercase tracking-widest font-display flex items-center gap-2">
          <BarChart3 size={15} className="text-[var(--accent)]" /> Admin Analytics
        </h2>
        {token ? (
          <Badge label="Live Sync" variant="green" size="sm" dot={true} />
        ) : (
          <Badge label="Requires Login" variant="red" size="sm" />
        )}
      </div>

      {!token && (
        <p className="text-xs text-zinc-550 font-semibold leading-relaxed">
          Please authenticate with an administrative account to read operational telemetry values.
        </p>
      )}

      {data && (
        <div className="grid grid-cols-3 gap-4 text-xs font-sans">
          <div className="p-3 bg-white/[0.01] border border-white/[0.05] rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest font-display mb-1 block">Active Users</span>
            <span className="text-base font-bold font-mono text-white leading-none">{data.active_users}</span>
          </div>
          <div className="p-3 bg-white/[0.01] border border-white/[0.05] rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest font-display mb-1 block">Resumes Scanned</span>
            <span className="text-base font-bold font-mono text-white leading-none">
              {data.total_resumes_scored}
            </span>
          </div>
          <div className="p-3 bg-white/[0.01] border border-white/[0.05] rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest font-display mb-1 block">Interviews Run</span>
            <span className="text-base font-bold font-mono text-white leading-none">{data.interviews_run}</span>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

