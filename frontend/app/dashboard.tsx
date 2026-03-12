import Radar3D from "@/src/components/Dashboard/Radar3D";
import SkillCloud from "@/src/components/Dashboard/SkillCloud";
import Charts from "@/src/components/Dashboard/Charts";
import AuthPanel from "@/src/components/Auth/AuthPanel";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-purple-glass text-slate-50 p-6 space-y-4">
      <AuthPanel />
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Radar3D />
        <SkillCloud />
        <Charts />
      </div>
    </main>
  );
}




