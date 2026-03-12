import LeaderboardTable from "@/src/components/Leaderboard/LeaderboardTable";
import PointsTracker from "@/src/components/Gamification/PointsTracker";
import ProgressBadges from "@/src/components/Gamification/ProgressBadges";

export const metadata = { title: "Leaderboard – CareerIQ" };

export default function LeaderboardPage() {
    return (
        <div className="min-h-screen bg-purple-glass text-slate-50 p-6 space-y-4">
            <h1 className="text-2xl font-semibold mb-4">Leaderboard</h1>
            <div className="grid gap-4 md:grid-cols-3">
                <PointsTracker />
                <ProgressBadges />
                <LeaderboardTable />
            </div>
        </div>
    );
}



