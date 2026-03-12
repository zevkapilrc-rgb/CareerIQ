import FloatingChat from "@/src/components/AIChatbot/FloatingChat";
import InterviewSimulator from "@/src/components/Interview/InterviewSimulator";
import ConfidenceAnalyzer from "@/src/components/Analytics/ConfidenceAnalyzer";

export default function InterviewPage() {
  return (
    <main className="min-h-screen bg-purple-glass text-slate-50 p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Interview Coach</h1>
      <p className="text-slate-300 mb-4">
        Practice interview questions with the AI assistant (stub).
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <InterviewSimulator />
        <ConfidenceAnalyzer />
      </div>
      <FloatingChat />
    </main>
  );
}




