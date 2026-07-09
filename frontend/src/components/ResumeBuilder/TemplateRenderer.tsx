/**
 * Template Switcher — renders the correct template component for a given ID
 */
import React from "react";
import type { ResumeData } from "./types";

// Lazy-load all templates
import ATSBasicTemplate from "./templates/ATSBasic";
import ATSProfessionalTemplate from "./templates/ATSProfessional";
import TechEngineerTemplate from "./templates/TechEngineer";
import ExecutiveTemplate from "./templates/Executive";
import CreativeModernTemplate from "./templates/CreativeModern";
import FresherTemplate from "./templates/Fresher";

interface Props {
  templateId: string;
  data: ResumeData;
  scale?: number;
}

const TEMPLATE_MAP: Record<string, React.ComponentType<{ data: ResumeData; scale?: number }>> = {
  "ats-basic": ATSBasicTemplate,
  "ats-professional": ATSProfessionalTemplate,
  "ats-executive": ATSProfessionalTemplate,   // uses same base, accent differs
  "corporate-business": ExecutiveTemplate,
  "corporate-executive": ExecutiveTemplate,
  "tech-engineer": TechEngineerTemplate,
  "tech-modern": CreativeModernTemplate,       // purple variant
  "tech-devops": ATSProfessionalTemplate,      // blue clean variant
  "student-fresher": FresherTemplate,
  "student-academic": FresherTemplate,
  "creative-designer": CreativeModernTemplate,
  "creative-modern": CreativeModernTemplate,
};

export default function TemplateRenderer({ templateId, data, scale = 1 }: Props) {
  const TemplateComponent = TEMPLATE_MAP[templateId] || ATSBasicTemplate;
  return <TemplateComponent data={data} scale={scale} />;
}
