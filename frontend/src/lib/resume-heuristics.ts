import { ResumeProfile } from "@/src/types";

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "have",
  "from",
  "your",
  "into",
  "were",
  "will",
  "their",
  "been",
  "than",
  "about",
  "over",
  "under",
  "after",
  "before",
  "through",
  "across",
  "using",
  "build",
  "built",
  "team",
  "work",
  "role",
  "skills",
  "experience",
  "projects",
  "product",
  "business",
  "customer",
  "users",
  "based",
  "while",
  "during",
  "using",
  "within",
  "across",
  "both",
  "should",
  "could",
  "would",
  "able",
  "help",
  "high",
  "level",
  "strong",
  "care",
  "career",
  "company",
  "organizations",
  "platform",
  "systems",
  "services",
  "solutions",
  "industry",
  "market",
  "years",
  "year",
  "month",
  "months",
  "day",
  "days",
  "job",
  "jobs",
]);

const ACTION_VERBS = [
  "built",
  "led",
  "designed",
  "developed",
  "launched",
  "delivered",
  "improved",
  "optimized",
  "created",
  "implemented",
  "reduced",
  "increased",
  "shipped",
  "scaled",
  "managed",
  "driven",
  "owned",
  "mentored",
  "architected",
  "automated",
  "engineered",
  "coordinated",
  "accelerated",
  "modernized",
  "streamlined",
  "translated",
  "guided",
  "pioneered",
  "spearheaded",
  "deployed",
];

const OUTCOME_WORDS = [
  "improved",
  "increased",
  "reduced",
  "accelerated",
  "boosted",
  "grew",
  "delivered",
  "enabled",
  "raised",
  "saved",
  "cut",
  "expanded",
  "streamlined",
  "optimized",
  "decreased",
  "enhanced",
  "achieved",
  "succeeded",
  "won",
];

const TECHNICAL_HINTS = [
  "react",
  "nextjs",
  "next.js",
  "typescript",
  "javascript",
  "python",
  "node",
  "sql",
  "aws",
  "docker",
  "kubernetes",
  "postgres",
  "mongodb",
  "graphql",
  "tailwind",
  "figma",
  "jira",
  "agile",
  "api",
  "microservices",
  "redis",
  "spark",
  "tableau",
  "powerbi",
  "excel",
  "analytics",
  "machine",
  "learning",
  "data",
  "cloud",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s.#+/:-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token) && !/^\d+$/.test(token));
}

function extractKeywordCandidates(text: string): string[] {
  const tokens = tokenize(text);
  const seen = new Set<string>();
  const keywords: string[] = [];

  tokens.forEach((token) => {
    const cleaned = token.replace(/\.$/, "");
    if (!cleaned || seen.has(cleaned)) return;

    if (TECHNICAL_HINTS.includes(cleaned) || cleaned.length >= 4) {
      seen.add(cleaned);
      keywords.push(cleaned);
    }
  });

  return keywords;
}

function buildResumeKeywordSet(profile: ResumeProfile): Set<string> {
  const parts = [
    profile.summary,
    profile.personalInfo.name,
    profile.personalInfo.location,
    ...profile.experience.flatMap((exp) => [exp.role, exp.company, ...exp.bullets]),
    ...profile.projects.flatMap((project) => [project.name, project.description, ...project.technologies]),
    ...profile.skills.technical.map((skill) => skill.name),
    ...profile.skills.soft.map((skill) => skill.name),
    ...profile.skills.tools.map((skill) => skill.name),
  ];

  const keywords = new Set<string>();
  parts.forEach((part) => {
    extractKeywordCandidates(part).forEach((keyword) => keywords.add(keyword));
  });

  return keywords;
}

function buildJobKeywords(jdText: string): string[] {
  const candidates = extractKeywordCandidates(jdText);
  return Array.from(new Set(candidates)).slice(0, 12);
}

function hasMetric(text: string): boolean {
  return /\b\d+(?:\.\d+)?(?:%|k|m|x|\+)?\b/.test(text);
}

function hasActionVerb(text: string): boolean {
  const normalized = normalize(text);
  return ACTION_VERBS.some((verb) => normalized.startsWith(verb) || normalized.includes(` ${verb} `));
}

function hasOutcome(text: string): boolean {
  const normalized = normalize(text);
  return OUTCOME_WORDS.some((word) => normalized.includes(` ${word} `) || normalized.startsWith(word));
}

export function generateResumeMatchInsights(profile: ResumeProfile, jdText: string) {
  const resumeKeywords = Array.from(buildResumeKeywordSet(profile));
  const jobKeywords = buildJobKeywords(jdText);
  const matchedKeywords = jobKeywords.filter((keyword) =>
    resumeKeywords.some((resumeKeyword) => resumeKeyword.includes(keyword) || keyword.includes(resumeKeyword))
  );

  const missingKeywords = jobKeywords
    .filter((keyword) => !matchedKeywords.includes(keyword))
    .slice(0, 8)
    .map((keyword, index) => ({
      keyword,
      importance: index < 3 ? "high" : index < 6 ? "medium" : "low",
    }));

  const matchPercent = Math.min(95, Math.max(20, Math.round((matchedKeywords.length / Math.max(1, jobKeywords.length)) * 100)));

  const suggestedRewrites = profile.experience
    .flatMap((exp) => (exp.bullets || []).map((bullet) => ({ exp, bullet })))
    .slice(0, 3)
    .map(({ bullet }) => {
      const missing = missingKeywords.slice(0, 2).map((item) => item.keyword).join(" and ");
      return {
        originalBullet: bullet,
        suggestedBullet: missing
          ? `${bullet} with a stronger emphasis on ${missing}.`
          : `${bullet} with clearer impact framing and measurable outcomes.`,
        reason: missing ? "Keyword alignment" : "Impact framing",
      };
    });

  return {
    matchPercent,
    missingKeywords,
    suggestedRewrites,
  };
}

export function scoreBulletImpact(bullets: string[]) {
  return bullets
    .filter(Boolean)
    .map((bullet) => {
      const reasons: string[] = [];
      let score = 0;

      if (hasActionVerb(bullet)) {
        score += 33;
        reasons.push("Action verb present");
      } else {
        reasons.push("Add an action verb such as led, built, or designed");
      }

      if (hasMetric(bullet)) {
        score += 33;
        reasons.push("Quantified metric present");
      } else {
        reasons.push("Add a concrete metric or percentage");
      }

      if (hasOutcome(bullet)) {
        score += 34;
        reasons.push("Outcome language present");
      } else {
        reasons.push("Clarify the business impact or result");
      }

      const grade = score >= 80 ? "high" : score >= 55 ? "medium" : "low";
      const suggestion =
        grade === "high"
          ? "This bullet already reads like a strong achievement and is ready to use."
          : `Strengthen it by ${reasons[1].toLowerCase()} and ${reasons[2].toLowerCase()}.`;

      return {
        text: bullet,
        score,
        grade,
        reasons,
        suggestion,
      };
    });
}
