const mockRows = [
  { rank: 1, name: "You", score: 0 },
  { rank: 2, name: "Sample User", score: 0 },
];

export default function LeaderboardTable() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="text-lg font-semibold mb-2">Global Leaderboard (stub)</h2>
      <table className="w-full text-sm">
        <thead className="text-slate-400">
          <tr>
            <th className="text-left py-1">Rank</th>
            <th className="text-left py-1">User</th>
            <th className="text-left py-1">Score</th>
          </tr>
        </thead>
        <tbody>
          {mockRows.map((row) => (
            <tr key={row.rank} className="border-t border-slate-800">
              <td className="py-1">{row.rank}</td>
              <td className="py-1">{row.name}</td>
              <td className="py-1">{row.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}



