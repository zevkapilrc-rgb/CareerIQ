"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../state/useAuthStore";
import { PlayCircle, Clock, BookOpen, CheckCircle } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8000");

type Module = {
  title: string;
  description: string;
  video_url: string;
};

type Step = {
  title: string;
  description: string;
  eta_hours: number;
  modules: Module[];
};

export default function LearningPath() {
  const token = useAuthStore((s) => s.token);

  const { data, isLoading } = useQuery<{ steps: Step[] }>({
    queryKey: ["learning-path"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/learning-path/personalized`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Failed to load learning path");
      return res.json();
    },
    enabled: !!token,
  });

  return (
    <section className="rounded-3xl border border-slate-800/50 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
          <BookOpen className="w-6 h-6 text-primary-light" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Personalized Masterclass
          </h2>
          <p className="text-sm text-slate-400">Your curated roadmap to industry excellence</p>
        </div>
      </div>

      {!token && (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-700/50 rounded-2xl bg-slate-800/20">
          <BookOpen className="w-12 h-12 text-slate-600 mb-4" />
          <p className="text-slate-400">Login to unlock your personalized career roadmap.</p>
        </div>
      )}

      {isLoading && token && (
        <div className="animate-pulse space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-slate-800/50 rounded-2xl"></div>
          ))}
        </div>
      )}

      {data && (
        <div className="relative border-l border-slate-800 ml-4 space-y-8 pb-4">
          {data.steps.map((step, index) => (
            <div key={step.title} className="relative pl-8">
              {/* Timeline marker */}
              <div className="absolute -left-3 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border border-primary shadow-[0_0_15px_rgba(109, 0, 26,0.3)]">
                <div className="h-2 w-2 rounded-full bg-primary-light"></div>
              </div>

              <div className="mb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-slate-100">{step.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-primary-light bg-primary/10 px-3 py-1 rounded-full border border-primary/20 w-fit">
                    <Clock className="w-3.5 h-3.5" />
                    {step.eta_hours} Hours
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>

              {/* Modules List */}
              {step.modules && step.modules.length > 0 && (
                <div className="grid gap-3 mt-4">
                  {step.modules.map((mod, modIdx) => (
                    <a
                      key={modIdx}
                      href={mod.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0 mt-1">
                          <PlayCircle className="w-8 h-8 text-rose-500/80 group-hover:text-rose-400 transition-colors" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-200 group-hover:text-primary-light transition-colors">
                            {mod.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 leading-snug max-w-xl">
                            {mod.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50 group-hover:bg-rose-500/10 group-hover:text-rose-400 group-hover:border-rose-500/20 transition-all">
                        <span>Watch on YouTube</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <div className="absolute -left-3 bottom-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <CheckCircle className="h-3 w-3 text-emerald-400" />
          </div>
        </div>
      )}
    </section>
  );
}
