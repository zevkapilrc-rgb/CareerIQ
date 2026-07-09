// ═══════════════════════════════════════════════════════════════
// Hirevix Gemini Service — Output Schemas
// Defines structural constraints for JSON outputs
// ═══════════════════════════════════════════════════════════════

import { SchemaType as Type, Schema } from "@google/generative-ai";

// ── 1. Resume Profile Extraction Schema ──────────────────────────
export const ResumeProfileSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        github: { type: Type.STRING },
        portfolio: { type: Type.STRING }
      },
      required: ["name", "email", "phone", "location"]
    },
    summary: { type: Type.STRING },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          field: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          gpa: { type: Type.STRING },
          highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["institution", "degree", "field", "startDate", "endDate"]
      }
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          location: { type: Type.STRING },
          bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["company", "role", "startDate", "endDate", "bullets"]
      }
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
          url: { type: Type.STRING },
          highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["name", "description", "technologies"]
      }
    },
    certifications: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    skills: {
      type: Type.OBJECT,
      properties: {
        technical: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              proficiency: { type: Type.INTEGER },
              evidenceSource: { type: Type.STRING }
            },
            required: ["name", "category", "proficiency", "evidenceSource"]
          }
        },
        soft: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              proficiency: { type: Type.INTEGER },
              evidenceSource: { type: Type.STRING }
            },
            required: ["name", "category", "proficiency", "evidenceSource"]
          }
        },
        tools: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              proficiency: { type: Type.INTEGER },
              evidenceSource: { type: Type.STRING }
            },
            required: ["name", "category", "proficiency", "evidenceSource"]
          }
        }
      },
      required: ["technical", "soft", "tools"]
    },
    careerSignals: {
      type: Type.OBJECT,
      properties: {
        domain: { type: Type.STRING },
        seniority: { type: Type.STRING },
        yearsOfExperience: { type: Type.INTEGER }
      },
      required: ["domain", "seniority", "yearsOfExperience"]
    }
  },
  required: ["personalInfo", "summary", "education", "experience", "projects", "certifications", "skills", "careerSignals"]
};

// ── 2. ATS Score Schema ──────────────────────────────────────────
export const ATSScoreSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER },
    issues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          severity: { type: Type.STRING }, // critical, warning, info
          section: { type: Type.STRING },
          message: { type: Type.STRING },
          fix: { type: Type.STRING }
        },
        required: ["severity", "section", "message", "fix"]
      }
    }
  },
  required: ["score", "issues"]
};

// ── 3. Career Path Schema ────────────────────────────────────────
export const CareerPathSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    paths: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          nodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                role: { type: Type.STRING },
                timeframe: { type: Type.STRING },
                requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                salaryRange: {
                  type: Type.OBJECT,
                  properties: {
                    min: { type: Type.INTEGER },
                    max: { type: Type.INTEGER },
                    currency: { type: Type.STRING }
                  },
                  required: ["min", "max", "currency"]
                },
                confidence: { type: Type.INTEGER }
              },
              required: ["id", "role", "timeframe", "requiredSkills", "confidence"]
            }
          },
          likelihood: { type: Type.INTEGER }
        },
        required: ["id", "label", "nodes", "likelihood"]
      }
    }
  },
  required: ["paths"]
};

// ── 4. Skill Gap Schema ──────────────────────────────────────────
export const SkillGapSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    targetRole: { type: Type.STRING },
    overallMatchPercent: { type: Type.INTEGER },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          status: { type: Type.STRING }, // matched, partial, missing
          currentProficiency: { type: Type.INTEGER },
          requiredProficiency: { type: Type.INTEGER },
          importance: { type: Type.STRING } // critical, high, medium, low
        },
        required: ["skill", "status", "currentProficiency", "requiredProficiency", "importance"]
      }
    }
  },
  required: ["targetRole", "overallMatchPercent", "items"]
};

// ── 5. Skill DNA Schema ──────────────────────────────────────────
export const SkillDNASchema: Schema = {
  type: Type.OBJECT,
  properties: {
    nodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          category: { type: Type.STRING }, // technical, soft, tools
          proficiency: { type: Type.INTEGER },
          evidence: { type: Type.STRING }
        },
        required: ["id", "name", "category", "proficiency", "evidence"]
      }
    },
    edges: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          source: { type: Type.STRING },
          target: { type: Type.STRING },
          relationship: { type: Type.STRING },
          weight: { type: Type.INTEGER }
        },
        required: ["source", "target", "relationship", "weight"]
      }
    }
  },
  required: ["nodes", "edges"]
};

// ── 6. Learning Path Schema ──────────────────────────────────────
export const LearningPathSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    modules: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          skill: { type: Type.STRING },
          type: { type: Type.STRING }, // video, course, article, project
          provider: { type: Type.STRING },
          searchQuery: { type: Type.STRING }, // Query to search real platforms like YouTube
          difficulty: { type: Type.STRING }, // beginner, intermediate, advanced
          priority: { type: Type.INTEGER }
        },
        required: ["id", "title", "skill", "type", "provider", "searchQuery", "difficulty", "priority"]
      }
    }
  },
  required: ["modules"]
};

// ── 7. Interview Question Turn Schema ──────────────────────────
export const InterviewTurnSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    question: { type: Type.STRING },
    followUpHint: { type: Type.STRING }
  },
  required: ["question", "followUpHint"]
};

// ── 8. Interview Scoring Schema ──────────────────────────────────
export const InterviewScoreSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER },
    feedback: { type: Type.STRING },
    modelAnswer: { type: Type.STRING },
    category: { type: Type.STRING }
  },
  required: ["score", "feedback", "modelAnswer", "category"]
};

// ── 9. Market Forecast Schema ────────────────────────────────────
export const MarketForecastSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    signals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          demandTrend: { type: Type.STRING }, // rising, stable, declining
          demandDelta: { type: Type.INTEGER },
          salaryRange: {
            type: Type.OBJECT,
            properties: {
              min: { type: Type.INTEGER },
              max: { type: Type.INTEGER },
              currency: { type: Type.STRING }
            },
            required: ["min", "max", "currency"]
          },
          topHiringCompanies: { type: Type.ARRAY, items: { type: Type.STRING } },
          source: { type: Type.STRING }
        },
        required: ["skill", "demandTrend", "demandDelta", "salaryRange", "topHiringCompanies", "source"]
      }
    }
  },
  required: ["signals"]
};

// ── 10. Compare to Job Description Schema ────────────────────────
export const CompareToJDSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    matchPercent: { type: Type.INTEGER },
    missingKeywords: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING },
          importance: { type: Type.STRING } // high, medium, low
        },
        required: ["keyword", "importance"]
      }
    },
    suggestedRewrites: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          originalBullet: { type: Type.STRING },
          suggestedBullet: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["originalBullet", "suggestedBullet", "reason"]
      }
    }
  },
  required: ["matchPercent", "missingKeywords", "suggestedRewrites"]
};

// ── 11. Recruiter Scan Simulator Schema ──────────────────────────
export const RecruiterScanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    highVisibilitySpans: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["text", "reason"]
      }
    },
    likelySkippedSpans: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["text", "reason"]
      }
    }
  },
  required: ["highVisibilitySpans", "likelySkippedSpans"]
};
