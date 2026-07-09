"use client";

import LeaderboardTable from "@/src/components/Leaderboard/LeaderboardTable";
import Badge from "@/src/components/ui/Badge";

export default function LeaderboardPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 pb-16 pt-4 space-y-8 animate-fade">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 border-b border-white/[0.05] pb-6 mt-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#C0506A] font-display">Gamification Standings</span>
            <Badge label="Global Sync" variant="red" size="sm" dot={true} />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none font-display">
            Leaderboard
          </h1>
          <p className="text-xs text-zinc-550 mt-2.5 leading-relaxed font-semibold">
            Track user standings, achievements unlocked, and points calibrated directly from active training sessions.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <LeaderboardTable />
      </div>
    </div>
  );
}
