// ═══════════════════════════════════════════════════════════════
// Hirevix — Shared TypeScript Types
// Central type definitions consumed by all modules
// ═══════════════════════════════════════════════════════════════

// ── Core Profile Types ──────────────────────────────────────────

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights?: string[];
}

export interface ExperienceEntry {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location?: string;
  bullets: string[];
  skills?: string[];
}

export interface ProjectEntry {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  highlights?: string[];
}

export interface SkillNode {
  name: string;
  category: string;
  proficiency: number; // 0–100
  evidenceSource: string; // which section of the resume evidenced this
}

export interface ATSIssue {
  severity: "critical" | "warning" | "info";
  section: string;
  message: string;
  fix: string;
}

export interface CareerSignals {
  domain: string;
  jobTitle?: string;
  industry?: string;
  seniority: "entry" | "mid" | "senior";
  yearsOfExperience: number;
}

export interface ResumeProfile {
  id: string;
  userId: string;
  rawText: string;
  personalInfo: PersonalInfo;
  summary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  certifications: string[];
  skills: {
    technical: SkillNode[];
    soft: SkillNode[];
    tools: SkillNode[];
  };
  atsScore: number;
  atsIssues: ATSIssue[];
  careerSignals: CareerSignals;
  embeddingVector?: number[];
  lastAnalyzedAt: string;
  version: number;
}

// ── Career Path Types ───────────────────────────────────────────

export interface CareerPathNode {
  id: string;
  role: string;
  timeframe: string; // "current" | "1yr" | "3yr" | "5yr"
  requiredSkills: string[];
  salaryRange?: { min: number; max: number; currency: string };
  confidence: number; // 0–100
}

export interface CareerPath {
  id: string;
  label: string;
  nodes: CareerPathNode[];
  likelihood: number; // 0–100
}

// ── Skill Gap Types ─────────────────────────────────────────────

export interface SkillGapItem {
  skill: string;
  status: "matched" | "partial" | "missing";
  currentProficiency: number;
  requiredProficiency: number;
  importance: "critical" | "high" | "medium" | "low";
}

export interface SkillGap {
  targetRole: string;
  overallMatchPercent: number;
  items: SkillGapItem[];
}

// ── Skill DNA Graph Types ───────────────────────────────────────

export interface SkillGraphNode {
  id: string;
  name: string;
  category: "technical" | "soft" | "tools";
  proficiency: number; // 0–100
  evidence: string;
}

export interface SkillGraphEdge {
  source: string;
  target: string;
  relationship: string; // e.g. "prerequisite", "complementary", "same-domain"
  weight: number;
}

export interface SkillGraph {
  nodes: SkillGraphNode[];
  edges: SkillGraphEdge[];
}

// ── Learning Path Types ─────────────────────────────────────────

export interface LearningModule {
  id: string;
  title: string;
  skill: string;
  type: "video" | "course" | "article" | "project";
  provider: string;
  url: string;
  thumbnailUrl?: string;
  duration?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  priority: number;
}

// ── Interview Types ─────────────────────────────────────────────

export type InterviewType = "hr" | "technical" | "behavioral" | "panel";

export interface InterviewTurn {
  question: string;
  followUpHint: string;
}

export interface InterviewScore {
  score: number; // 0–100
  feedback: string;
  modelAnswer: string;
  category: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  type: InterviewType;
  targetRole: string;
  turns: Array<{
    question: string;
    answer: string;
    score: InterviewScore;
  }>;
  overallScore: number;
  categoryBreakdown: Record<string, number>;
  createdAt: string;
}

// ── Market Forecast Types ───────────────────────────────────────

export interface MarketSignal {
  skill: string;
  demandTrend: "rising" | "stable" | "declining";
  demandDelta: number; // percentage change
  salaryRange: { min: number; max: number; currency: string };
  topHiringCompanies: string[];
  source: string;
  asOfDate: string;
}

// ── Jobs Types ──────────────────────────────────────────────────

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange?: string;
  matchPercent: number;
  missingKeywords: string[];
  url: string;
  source: string;
  postedDate: string;
}

export type ApplicationStatus = "saved" | "applied" | "interviewing" | "offer" | "rejected";

export interface TrackedApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  appliedAt?: string;
  notes: string;
  updatedAt: string;
}

// ── Analytics Types ─────────────────────────────────────────────

export interface UserAnalytics {
  atsScoreHistory: Array<{ date: string; score: number }>;
  interviewScoreTrend: Array<{ date: string; score: number }>;
  learningCompletionPercent: number;
  skillProficiencyRadar: Array<{ skill: string; value: number }>;
  resumeVersions: Array<{ id: string; label: string; atsScore: number; date: string }>;
  xpTotal: number;
  streakDays: number;
}

// ── Helix AI Types ──────────────────────────────────────────────

export interface HelixContext {
  currentPillar: string;
  currentTab: string;
  resumeProfile?: ResumeProfile;
}

export interface HelixMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
