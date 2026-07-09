import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ResumeData,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  CertificationItem,
  LanguageItem,
  BuilderStep,
  TemplateCategory,
} from "./types";
import { EMPTY_RESUME_DATA } from "./types";

// ─── Utilities ────────────────────────────────────────────────────────────────
function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Store Interface ──────────────────────────────────────────────────────────
interface ResumeBuilderState {
  // Flow control
  step: BuilderStep;
  selectedCategory: TemplateCategory | null;
  selectedTemplateId: string;

  // Data
  resumeData: ResumeData;

  // Editing state
  activeFormSection: string;

  // Actions — flow
  setStep: (step: BuilderStep) => void;
  setCategory: (cat: TemplateCategory) => void;
  setTemplateId: (id: string) => void;
  setActiveFormSection: (section: string) => void;
  resetBuilder: () => void;

  // Actions — personal info
  updatePersonalInfo: (updates: Partial<ResumeData["personalInfo"]>) => void;
  updateSummary: (summary: string) => void;

  // Actions — experience
  addExperience: () => void;
  updateExperience: (id: string, updates: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;
  addExperienceBullet: (id: string) => void;
  updateExperienceBullet: (id: string, idx: number, value: string) => void;
  removeExperienceBullet: (id: string, idx: number) => void;

  // Actions — education
  addEducation: () => void;
  updateEducation: (id: string, updates: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;

  // Actions — skills
  updateSkills: (updates: Partial<ResumeData["skills"]>) => void;

  // Actions — projects
  addProject: () => void;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;

  // Actions — certifications
  addCertification: () => void;
  updateCertification: (id: string, updates: Partial<CertificationItem>) => void;
  removeCertification: (id: string) => void;

  // Actions — languages
  addLanguage: () => void;
  updateLanguage: (id: string, updates: Partial<LanguageItem>) => void;
  removeLanguage: (id: string) => void;

  // Actions — data import
  importFromAnalysis: (analysisData: any) => void;

  // Actions — density
  setSpacingDensity: (density: "compact" | "normal" | "spacious") => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useResumeBuilderStore = create<ResumeBuilderState>()(
  persist(
    (set, get) => ({
      step: "aistart",
      selectedCategory: null,
      selectedTemplateId: "ats-professional",
      resumeData: EMPTY_RESUME_DATA,
      activeFormSection: "personal",

      // ── Flow ───────────────────────────────────────────────────────────────
      setStep: (step) => set({ step }),
      setCategory: (cat) => set({ selectedCategory: cat, step: "template" }),
      setTemplateId: (id) => set({ selectedTemplateId: id, step: "form" }),
      setActiveFormSection: (section) => set({ activeFormSection: section }),

      resetBuilder: () =>
        set({
          step: "aistart",
          selectedCategory: null,
          selectedTemplateId: "ats-professional",
          resumeData: EMPTY_RESUME_DATA,
          activeFormSection: "personal",
        }),

      // ── Personal Info ──────────────────────────────────────────────────────
      updatePersonalInfo: (updates) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            personalInfo: { ...s.resumeData.personalInfo, ...updates },
          },
        })),

      updateSummary: (summary) =>
        set((s) => ({ resumeData: { ...s.resumeData, summary } })),

      // ── Experience ─────────────────────────────────────────────────────────
      addExperience: () =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            experience: [
              ...s.resumeData.experience,
              {
                id: uid(),
                company: "",
                role: "",
                startDate: "",
                endDate: "Present",
                location: "",
                bullets: [""],
              },
            ],
          },
        })),

      updateExperience: (id, updates) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            experience: s.resumeData.experience.map((e) =>
              e.id === id ? { ...e, ...updates } : e
            ),
          },
        })),

      removeExperience: (id) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            experience: s.resumeData.experience.filter((e) => e.id !== id),
          },
        })),

      addExperienceBullet: (id) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            experience: s.resumeData.experience.map((e) =>
              e.id === id ? { ...e, bullets: [...e.bullets, ""] } : e
            ),
          },
        })),

      updateExperienceBullet: (id, idx, value) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            experience: s.resumeData.experience.map((e) => {
              if (e.id !== id) return e;
              const bullets = [...e.bullets];
              bullets[idx] = value;
              return { ...e, bullets };
            }),
          },
        })),

      removeExperienceBullet: (id, idx) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            experience: s.resumeData.experience.map((e) => {
              if (e.id !== id) return e;
              return { ...e, bullets: e.bullets.filter((_, i) => i !== idx) };
            }),
          },
        })),

      // ── Education ──────────────────────────────────────────────────────────
      addEducation: () =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            education: [
              ...s.resumeData.education,
              {
                id: uid(),
                institution: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
                gpa: "",
                achievements: [],
              },
            ],
          },
        })),

      updateEducation: (id, updates) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            education: s.resumeData.education.map((e) =>
              e.id === id ? { ...e, ...updates } : e
            ),
          },
        })),

      removeEducation: (id) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            education: s.resumeData.education.filter((e) => e.id !== id),
          },
        })),

      // ── Skills ─────────────────────────────────────────────────────────────
      updateSkills: (updates) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            skills: { ...s.resumeData.skills, ...updates },
          },
        })),

      // ── Projects ───────────────────────────────────────────────────────────
      addProject: () =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            projects: [
              ...s.resumeData.projects,
              {
                id: uid(),
                name: "",
                description: "",
                techStack: [],
                highlights: [""],
              },
            ],
          },
        })),

      updateProject: (id, updates) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            projects: s.resumeData.projects.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
          },
        })),

      removeProject: (id) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            projects: s.resumeData.projects.filter((p) => p.id !== id),
          },
        })),

      // ── Certifications ─────────────────────────────────────────────────────
      addCertification: () =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            certifications: [
              ...s.resumeData.certifications,
              { id: uid(), name: "", issuer: "", date: "" },
            ],
          },
        })),

      updateCertification: (id, updates) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            certifications: s.resumeData.certifications.map((c) =>
              c.id === id ? { ...c, ...updates } : c
            ),
          },
        })),

      removeCertification: (id) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            certifications: s.resumeData.certifications.filter(
              (c) => c.id !== id
            ),
          },
        })),

      // ── Languages ──────────────────────────────────────────────────────────
      addLanguage: () =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            languages: [
              ...s.resumeData.languages,
              { id: uid(), language: "", proficiency: "Intermediate" },
            ],
          },
        })),

      updateLanguage: (id, updates) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            languages: s.resumeData.languages.map((l) =>
              l.id === id ? { ...l, ...updates } : l
            ),
          },
        })),

      removeLanguage: (id) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            languages: s.resumeData.languages.filter((l) => l.id !== id),
          },
        })),

      // ── Import from existing analysis ─────────────────────────────────────
      importFromAnalysis: (analysisData: any) => {
        const ci = analysisData?.candidateInformation || {};
        const skills =
          analysisData?.skill_intelligence?.core_skills ||
          analysisData?.skill_optimization?.current_skills ||
          [];
        const summary =
          analysisData?.improved_summary?.improved ||
          analysisData?.personal_branding?.short_bio ||
          ci?.professionalSummaryOrObjectives?.extractedContent ||
          "";
        const expItems: ExperienceItem[] =
          (analysisData?.experienceAnalysis || []).map((e: any) => ({
            id: uid(),
            company: e.company || e.companyName || "",
            role: e.role || e.jobTitle || "",
            startDate: e.startDate || "",
            endDate: e.endDate || "Present",
            location: e.location || "",
            bullets:
              Array.isArray(e.bullets)
                ? e.bullets
                : Array.isArray(e.responsibilities)
                ? e.responsibilities
                : [""],
          }));
        const eduItems: EducationItem[] =
          (analysisData?.educationAnalysis || []).map((e: any) => ({
            id: uid(),
            institution: e.institution || e.college || "",
            degree: e.degree || "",
            field: e.field || e.specialization || "",
            startDate: e.startDate || "",
            endDate: e.endDate || "",
            gpa: e.gpa || "",
            achievements: [],
          }));

        set((s) => ({
          resumeData: {
            ...s.resumeData,
            personalInfo: {
              fullName: ci?.fullName?.extractedContent || s.resumeData.personalInfo.fullName,
              title: analysisData?.career_insights?.suggested_career_paths?.[0] || "",
              email: ci?.email?.extractedContent || s.resumeData.personalInfo.email,
              phone: ci?.phoneNumber?.extractedContent || s.resumeData.personalInfo.phone,
              location: ci?.location?.extractedContent || s.resumeData.personalInfo.location,
              linkedin: ci?.linkedInProfile?.extractedContent || "",
              github: ci?.portfolioOrGitHub?.extractedContent || "",
              portfolio: "",
            },
            summary,
            experience: expItems.length ? expItems : s.resumeData.experience,
            education: eduItems.length ? eduItems : s.resumeData.education,
            skills: {
              technical: skills.slice(0, 10),
              soft: [],
              tools: analysisData?.skill_intelligence?.core_skills?.slice(10) || [],
              frameworks: analysisData?.skill_optimization?.optimized_skills || [],
            },
          },
        }));
      },

      setSpacingDensity: (density) =>
        set((s) => ({
          resumeData: {
            ...s.resumeData,
            spacingDensity: density,
          },
        })),
    }),
    {
      name: "hirevix-resume-builder",
    }
  )
);
