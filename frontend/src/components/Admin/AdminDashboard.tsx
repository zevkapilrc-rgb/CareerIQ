"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../state/useAuthStore";

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
    <section className="glass-surface p-4">
      <h2 className="text-lg font-semibold mb-2">Admin Analytics</h2>
      {!token && (
        <p className="text-xs text-slate-400">
          Login as an admin user to view metrics.
        </p>
      )}
      {data && (
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs text-slate-400">Active users</div>
            <div className="text-xl font-semibold">{data.active_users}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Resumes scored</div>
            <div className="text-xl font-semibold">
              {data.total_resumes_scored}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Interviews run</div>
            <div className="text-xl font-semibold">{data.interviews_run}</div>
          </div>
        </div>
      )}
    </section>
  );
}



