import GlassCard from "../ui/GlassCard";
import Badge from "../ui/Badge";
import { Trophy } from "lucide-react";

const mockRows = [
  { rank: 1, name: "You", score: 0 },
  { rank: 2, name: "Sample User", score: 0 },
];

export default function LeaderboardTable() {
  return (
    <GlassCard className="p-6 font-sans">
      <div className="flex items-center justify-between mb-5 border-b border-white/[0.05] pb-4">
        <h2 className="text-xs font-bold text-white uppercase tracking-widest font-display flex items-center gap-2">
          <Trophy size={15} className="text-[var(--accent)]" /> Global Leaderboard
        </h2>
        <Badge label="Calibrated Weekly" variant="purple" size="sm" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/[0.05] text-zinc-500 font-bold uppercase tracking-widest font-display">
              <th className="py-2.5 px-3">Rank</th>
              <th className="py-2.5 px-3">User</th>
              <th className="py-2.5 px-3 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02] text-zinc-300">
            {mockRows.map((row) => (
              <tr key={row.rank} className="hover:bg-white/[0.01] transition-colors">
                <td className="py-3 px-3">
                  {row.rank === 1 ? (
                    <span className="text-[var(--accent)] font-bold font-mono">#1</span>
                  ) : (
                    <span className="font-mono">#{row.rank}</span>
                  )}
                </td>
                <td className="py-3 px-3 font-bold text-white">{row.name}</td>
                <td className="py-3 px-3 text-right font-mono text-zinc-300 font-bold">{row.score} pts</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

