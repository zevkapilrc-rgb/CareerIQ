import { ResumeProfile } from "@/src/types";

export interface ResumeVersionEntry {
  id: string;
  label: string;
  profile: ResumeProfile;
  createdAt: string;
}

const STORAGE_KEY = "ciq-resume-versions";

export function loadStoredResumeVersions(): ResumeVersionEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function persistResumeVersions(versions: ResumeVersionEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(versions));
}

export function createResumeVersionEntry(profile: ResumeProfile, label: string): ResumeVersionEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label: label.trim() || `Version ${profile.version || 1}`,
    profile: {
      ...profile,
      version: (profile.version || 1) + 1,
      lastAnalyzedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
  };
}

export function buildResumeVersionDiff(current: ResumeProfile, compareTo: ResumeProfile) {
  const buildLines = (profile: ResumeProfile) => {
    const lines = [`Summary: ${profile.summary || "(empty)"}`];
    profile.experience.forEach((exp) => {
      lines.push(`${exp.role} @ ${exp.company}`);
      exp.bullets.forEach((bullet) => lines.push(`• ${bullet}`));
    });
    return lines;
  };

  const currentLines = buildLines(current);
  const compareLines = buildLines(compareTo);

  return {
    added: compareLines.filter((line) => !currentLines.includes(line)),
    removed: currentLines.filter((line) => !compareLines.includes(line)),
  };
}
