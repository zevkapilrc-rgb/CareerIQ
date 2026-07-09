// ─────────────────────────────────────────────────────────────────────────────
// HIREVIX — GLOBAL RESUME DATA MODEL
// Single Source of Truth for Builder + Analyzer
// ─────────────────────────────────────────────────────────────────────────────

export interface PersonalInfo {
  fullName: string;
  title: string;        // e.g. "Senior Software Engineer"
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  photo?: string;       // base64 data URL
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;    // "Present" or date string
  location: string;
  bullets: string[];  // action-verb, metric-driven bullets
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Basic";
}

export interface SkillsData {
  technical: string[];
  soft: string[];
  tools: string[];
  frameworks: string[];
}

// ─── Master Resume Data Model ────────────────────────────────────────────────
export type SpacingDensity = "compact" | "normal" | "spacious";

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillsData;
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  spacingDensity?: SpacingDensity;
}

// ─── Template Registry ───────────────────────────────────────────────────────
export type TemplateCategory =
  | "ATS"
  | "Corporate"
  | "Tech"
  | "Student"
  | "Creative";

export interface TemplateConfig {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  colors: {
    primary: string;
    accent: string;
    text: string;
    bg: string;
  };
  atsScore: number; // expected ATS compatibility (0-100)
  tags: string[];
  recommended: string[]; // job roles this template is best for
}

// ─── Builder Step State ───────────────────────────────────────────────────────
export type BuilderStep =
  | "aistart"
  | "category"
  | "template"
  | "form"
  | "preview";

export const EMPTY_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    photo: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    tools: [],
    frameworks: [],
  },
  projects: [],
  certifications: [],
  languages: [],
  spacingDensity: "normal",
};
