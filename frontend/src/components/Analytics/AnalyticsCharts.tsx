"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../state/useAuthStore";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8000");

type Point = {
  skill: string;
  current: number;
  target: number;
};

export default function AnalyticsCharts() {
  const token = useAuthStore((s) => s.token);

  const { data } = useQuery<{ points: Point[] }>({
    queryKey: ["skill-gap"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/analytics/skill-gap`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Failed to load skill gap data");
      return res.json();
    },
    enabled: !!token,
  });

  const chartData =
    data?.points.map((p) => ({
      skill: p.skill,
      current: p.current * 100,
      target: p.target * 100,
    })) ?? [];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="text-lg font-semibold mb-2">3D Radar & Analytics</h2>
      {!token && (
        <p className="text-xs text-slate-400">
          Login to see your live radar chart.
        </p>
      )}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis />
            <Radar
              name="Current"
              dataKey="current"
              stroke="#A3779D"
              fill="#A3779D"
              fillOpacity={0.4}
            />
            <Radar
              name="Target"
              dataKey="target"
              stroke="#E6C7E6"
              fill="#E6C7E6"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}



