import type { TemplateConfig, TemplateCategory } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE REGISTRY — All available resume templates
// ─────────────────────────────────────────────────────────────────────────────

export const TEMPLATE_REGISTRY: TemplateConfig[] = [
  // ── ATS TEMPLATES ─────────────────────────────────────────────────────────
  {
    id: "ats-basic",
    name: "ATS Classic",
    category: "ATS",
    description: "Maximally ATS-friendly. Clean single-column layout with standard sections that every ATS parses perfectly.",
    colors: { primary: "#1a1a2e", accent: "#2563eb", text: "#111827", bg: "#ffffff" },
    atsScore: 99,
    tags: ["ATS Safe", "Clean", "Universal"],
    recommended: ["Any Role", "Government", "Corporate"],
  },
  {
    id: "ats-professional",
    name: "ATS Professional",
    category: "ATS",
    description: "Two-column layout with clean typography. Balances ATS compatibility with visual hierarchy.",
    colors: { primary: "#0f172a", accent: "#1d4ed8", text: "#1e293b", bg: "#ffffff" },
    atsScore: 96,
    tags: ["ATS Safe", "Professional", "2-Column"],
    recommended: ["Finance", "Consulting", "Management"],
  },
  {
    id: "ats-executive",
    name: "ATS Executive",
    category: "ATS",
    description: "Bold header with executive-level typography. Commands attention while staying fully ATS-parseable.",
    colors: { primary: "#1e1b4b", accent: "#4f46e5", text: "#111827", bg: "#ffffff" },
    atsScore: 94,
    tags: ["Executive", "Senior", "Leadership"],
    recommended: ["C-Suite", "Director", "VP Level"],
  },

  // ── CORPORATE TEMPLATES ────────────────────────────────────────────────────
  {
    id: "corporate-business",
    name: "Business Professional",
    category: "Corporate",
    description: "McKinsey-inspired clean layout. Conservative, trust-building design for top consulting and finance roles.",
    colors: { primary: "#0c1445", accent: "#1a56db", text: "#1f2937", bg: "#f9fafb" },
    atsScore: 90,
    tags: ["Consulting", "Finance", "Banking"],
    recommended: ["McKinsey", "Goldman Sachs", "Big 4"],
  },
  {
    id: "corporate-executive",
    name: "Executive Leadership",
    category: "Corporate",
    description: "Prestige layout with achievement-focused formatting. Designed for senior executive profiles.",
    colors: { primary: "#1c1917", accent: "#78350f", text: "#1c1917", bg: "#fffbeb" },
    atsScore: 88,
    tags: ["Executive", "Leadership", "Premium"],
    recommended: ["CEO", "CTO", "VP Engineering"],
  },

  // ── TECH TEMPLATES ─────────────────────────────────────────────────────────
  {
    id: "tech-engineer",
    name: "Software Engineer",
    category: "Tech",
    description: "GitHub-inspired minimal layout. Projects and tech stack prominently featured. Loved by FAANG recruiters.",
    colors: { primary: "#0d1117", accent: "#238636", text: "#24292f", bg: "#ffffff" },
    atsScore: 93,
    tags: ["FAANG", "GitHub Style", "Tech Stack"],
    recommended: ["Google", "Meta", "Amazon", "Startups"],
  },
  {
    id: "tech-modern",
    name: "AI & Data Engineer",
    category: "Tech",
    description: "Modern sidebar layout with skills visualization. Perfect for AI, ML, and data science profiles.",
    colors: { primary: "#1e1b4b", accent: "#7c3aed", text: "#1f2937", bg: "#ffffff" },
    atsScore: 91,
    tags: ["AI/ML", "Data Science", "Modern"],
    recommended: ["AI Engineer", "Data Scientist", "MLOps"],
  },
  {
    id: "tech-devops",
    name: "DevOps & Cloud",
    category: "Tech",
    description: "Infrastructure-focused layout highlighting certifications, tools, and system architecture experience.",
    colors: { primary: "#0f172a", accent: "#0ea5e9", text: "#0f172a", bg: "#f0f9ff" },
    atsScore: 92,
    tags: ["Cloud", "DevOps", "Certifications"],
    recommended: ["AWS", "GCP", "Azure", "Kubernetes"],
  },

  // ── STUDENT TEMPLATES ──────────────────────────────────────────────────────
  {
    id: "student-fresher",
    name: "Fresher Graduate",
    category: "Student",
    description: "Clean entry-level layout emphasizing education, projects, and skills over work experience.",
    colors: { primary: "#1e3a5f", accent: "#3b82f6", text: "#1e293b", bg: "#ffffff" },
    atsScore: 95,
    tags: ["Entry Level", "Fresh Graduate", "Internship"],
    recommended: ["Campus Placements", "Startups", "Internships"],
  },
  {
    id: "student-academic",
    name: "Academic / Research",
    category: "Student",
    description: "CV-style layout with research publications, academic projects, and academic achievements.",
    colors: { primary: "#1a1a2e", accent: "#dc2626", text: "#111827", bg: "#ffffff" },
    atsScore: 90,
    tags: ["PhD", "Research", "Academic"],
    recommended: ["Universities", "Research Labs", "PhD Programs"],
  },

  // ── CREATIVE TEMPLATES ─────────────────────────────────────────────────────
  {
    id: "creative-designer",
    name: "Creative Designer",
    category: "Creative",
    description: "Visually bold with colored sidebar and strong visual hierarchy. ATS-safe while looking premium.",
    colors: { primary: "#831843", accent: "#ec4899", text: "#1f2937", bg: "#ffffff" },
    atsScore: 82,
    tags: ["Creative", "Visual", "Designer"],
    recommended: ["UX Designer", "Graphic Designer", "Product Designer"],
  },
  {
    id: "creative-modern",
    name: "Modern Portfolio",
    category: "Creative",
    description: "Contemporary layout with accent column, project portfolio integration, and striking typography.",
    colors: { primary: "#064e3b", accent: "#10b981", text: "#1f2937", bg: "#ffffff" },
    atsScore: 79,
    tags: ["Modern", "Portfolio", "Premium"],
    recommended: ["Product Manager", "Marketing", "Creative Roles"],
  },
];

export const CATEGORY_META: Record<
  string,
  { label: string; description: string; icon: string; color: string; bgGradient: string }
> = {
  ATS: {
    label: "ATS Templates",
    description: "Maximum compatibility with Applicant Tracking Systems. Guaranteed to pass 99%+ of ATS parsers.",
    icon: "🎯",
    color: "#2563eb",
    bgGradient: "from-blue-950/40 to-blue-950/10",
  },
  Corporate: {
    label: "Corporate / Consulting",
    description: "Premium layouts for top consulting, banking, and enterprise corporate roles. McKinsey-approved style.",
    icon: "🏛️",
    color: "#78350f",
    bgGradient: "from-amber-950/40 to-amber-950/10",
  },
  Tech: {
    label: "Tech / Engineering",
    description: "FAANG-ready layouts. Projects and tech stack front and center. Used by engineers at Google, Meta, Amazon.",
    icon: "⚡",
    color: "#238636",
    bgGradient: "from-emerald-950/40 to-emerald-950/10",
  },
  Student: {
    label: "Student / Fresher",
    description: "Entry-level optimized layouts. Highlights education, projects, and skills to land campus placements.",
    icon: "🎓",
    color: "#3b82f6",
    bgGradient: "from-sky-950/40 to-sky-950/10",
  },
  Creative: {
    label: "Creative / Portfolio",
    description: "Visually stunning yet ATS-safe layouts for designers, marketers, and creative professionals.",
    icon: "🎨",
    color: "#ec4899",
    bgGradient: "from-pink-950/40 to-pink-950/10",
  },
};

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "ATS",
  "Corporate",
  "Tech",
  "Student",
  "Creative",
];

export function getTemplatesByCategory(category: TemplateCategory) {
  return TEMPLATE_REGISTRY.filter((t) => t.category === category);
}

export function getTemplateById(id: string): TemplateConfig | undefined {
  return TEMPLATE_REGISTRY.find((t) => t.id === id);
}
