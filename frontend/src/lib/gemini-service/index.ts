// ═══════════════════════════════════════════════════════════════
// Hirevix Gemini Service — Core Functions
// All AI-related operations live here ONLY.
// ═══════════════════════════════════════════════════════════════

import { callGemini, GeminiMessage } from "./client";
import {
  ResumeProfileSchema,
  ATSScoreSchema,
  CareerPathSchema,
  SkillGapSchema,
  SkillDNASchema,
  LearningPathSchema,
  InterviewTurnSchema,
  InterviewScoreSchema,
  MarketForecastSchema,
  CompareToJDSchema,
  RecruiterScanSchema
} from "./schemas";
import {
  ResumeProfile,
  ATSIssue,
  CareerPath,
  SkillGap,
  SkillGraph,
  LearningModule,
  InterviewTurn,
  InterviewScore,
  MarketSignal
} from "../../types";

// Helper to construct basic messages
function userMsg(text: string): GeminiMessage[] {
  return [
    {
      role: "user",
      parts: [{ text }]
    }
  ];
}

// Helper to safely parse JSON from raw LLM responses that might include markdown block formatting
function safeJsonParse<T>(text: string): T {
  try {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("AI response was not in valid JSON format");
  }
}

// ── 1. extractResumeProfile ──────────────────────────────────────
export async function extractResumeProfile(rawText: string): Promise<Omit<ResumeProfile, "id" | "userId" | "lastAnalyzedAt" | "version">> {
  const prompt = `
    Analyze the following raw resume text and extract all structural elements strictly conforming to the output schema.
    If fields are not present in the text, use sensible defaults (empty arrays, strings, etc.) rather than throwing errors.
    
    Resume Text:
    ${rawText}
  `;
  const response = await callGemini({
    contents: userMsg(prompt),
    responseSchema: ResumeProfileSchema as any,
    systemPrompt: "You are an advanced resume extraction parser. Extract structured details from the text accurately."
  });
  return safeJsonParse(response);
}

// ── 2. scoreATS ──────────────────────────────────────────────────
export async function scoreATS(profile: ResumeProfile): Promise<{ score: number; issues: ATSIssue[] }> {
  const prompt = `
    Evaluate the following Resume Profile against Applicant Tracking System (ATS) parsing rules, formatting check, and keyword compatibility.
    Highlight formatting errors, typical scan failures, missing headers, or problematic text formats.
    
    Resume Profile:
    ${JSON.stringify(profile)}
  `;
  const response = await callGemini({
    contents: userMsg(prompt),
    responseSchema: ATSScoreSchema as any,
    systemPrompt: "You are a professional ATS parser simulator. Assign scores and write down critical formatting/syntactic fixes."
  });
  return safeJsonParse(response);
}

// ── 3. predictCareerPaths ────────────────────────────────────────
export async function predictCareerPaths(profile: ResumeProfile): Promise<CareerPath[]> {
  const prompt = `
    Based on the candidate's current domain, skill list, and years of experience, predict 3 realistic, high-value career paths.
    Each path must follow a real chronological progression: Current Role -> Next Role -> 3-Year Target -> 5-Year Target.
    Specify the required skills the user needs to acquire to progress through each stage.
    
    Profile:
    ${JSON.stringify({
      domain: profile.careerSignals.domain,
      experience: profile.careerSignals.yearsOfExperience,
      skills: profile.skills
    })}
  `;
  const response = await callGemini({
    contents: userMsg(prompt),
    responseSchema: CareerPathSchema as any,
    systemPrompt: "You are a senior career intelligence architect. Output a node-based career roadmap representing career steps."
  });
  const data = safeJsonParse<{ paths: CareerPath[] }>(response);
  return data.paths;
}

// ── 4. computeSkillGap ───────────────────────────────────────────
export async function computeSkillGap(profile: ResumeProfile, targetRole: string): Promise<SkillGap> {
  const prompt = `
    Compare the skills of the user against the industry benchmark requirements for the target role: "${targetRole}".
    List each skill, mark whether it is matched, partial, or missing, list current vs required proficiency, and prioritize its importance.
    
    User Profile Skills:
    Technical: ${JSON.stringify(profile.skills.technical.map(s => s.name))}
    Soft: ${JSON.stringify(profile.skills.soft.map(s => s.name))}
    Tools: ${JSON.stringify(profile.skills.tools.map(s => s.name))}
  `;
  const response = await callGemini({
    contents: userMsg(prompt),
    responseSchema: SkillGapSchema as any,
    systemPrompt: "You are an expert HR recruiter and competency analyst. Compare candidates skills vs role requirements."
  });
  return safeJsonParse(response);
}

// ── 5. buildSkillDNA ─────────────────────────────────────────────
export async function buildSkillDNA(profile: ResumeProfile): Promise<SkillGraph> {
  const prompt = `
    Analyze the candidate's skillset and construct a force-directed skill relationship graph.
    Map both direct skills and their prerequisite or complementary connections (e.g. React -> JavaScript, Git -> GitHub, Node -> backend).
    Include relationships between categories (technical, soft, tools).
    
    Skills List:
    Technical: ${JSON.stringify(profile.skills.technical)}
    Soft: ${JSON.stringify(profile.skills.soft)}
    Tools: ${JSON.stringify(profile.skills.tools)}
  `;
  const response = await callGemini({
    contents: userMsg(prompt),
    responseSchema: SkillDNASchema as any,
    systemPrompt: "You are a graph database modeling assistant. Create a list of nodes and edges connecting skills together based on context."
  });
  return safeJsonParse(response);
}

// ── 6. recommendLearningPath ─────────────────────────────────────
export async function recommendLearningPath(skillGap: SkillGap): Promise<LearningModule[]> {
  const prompt = `
    Generate a recommended learning path containing study modules to close the identified skill gaps.
    For each module, output a title, target skill, course/resource provider, and a targeted search query (e.g. YouTube search queries) to find verified tutorials.
    
    Skill Gap Data:
    ${JSON.stringify(skillGap.items.filter(item => item.status !== "matched"))}
  `;
  const response = await callGemini({
    contents: userMsg(prompt),
    responseSchema: LearningPathSchema as any,
    systemPrompt: "You are an educational curriculum advisor. Build structured learning modules matching missing skills."
  });
  const data = safeJsonParse<{ modules: LearningModule[] }>(response);
  return data.modules;
}

// ── 7. runInterviewTurn ──────────────────────────────────────────
export async function runInterviewTurn(
  profile: ResumeProfile,
  role: string,
  type: string,
  history: Array<{ question: string; answer: string }>
): Promise<InterviewTurn> {
  const prompt = `
    Conduct a mock interview for the role of: "${role}" (Mode: ${type}).
    Generate the next single interview question. Reference the user's experience and actual projects from their resume where appropriate to make it highly personalized.
    Include a helpful subtext hint explaining what the interviewer is looking for in a strong response.
    
    Candidate Bio: ${profile.summary}
    Experience Bullets: ${JSON.stringify(profile.experience.flatMap(e => e.bullets))}
    Projects: ${JSON.stringify(profile.projects)}
    
    Interview History:
    ${JSON.stringify(history)}
  `;
  const response = await callGemini({
    contents: userMsg(prompt),
    responseSchema: InterviewTurnSchema as any,
    systemPrompt: "You are an elite interviewer. Ask deep, challenging, personalized questions based on the candidate's resume."
  });
  return safeJsonParse(response);
}

// ── 8. scoreInterviewAnswer ──────────────────────────────────────
export async function scoreInterviewAnswer(question: string, answer: string): Promise<InterviewScore> {
  const prompt = `
    Score the candidate's response to the interview question below.
    Provide a score (0-100), detailed feedback highlighting strengths/weaknesses, and write a model response that demonstrates a perfect answer.
    
    Question:
    ${question}
    
    Candidate Answer:
    ${answer}
  `;
  const response = await callGemini({
    contents: userMsg(prompt),
    responseSchema: InterviewScoreSchema as any,
    systemPrompt: "You are a professional assessor. Evaluate interview answers with objective metrics and feedback."
  });
  return safeJsonParse(response);
}

// ── 9. chatHelixAI ───────────────────────────────────────────────
export async function chatHelixAI(
  message: string,
  profile: ResumeProfile | null,
  history: Array<{ role: "user" | "model" | "assistant"; parts: Array<{ text: string }> }>,
  currentPillar: string,
  currentTab: string
): Promise<string> {
  // Map standard formats
  const geminiHistory: GeminiMessage[] = history.map(item => ({
    role: item.role === "model" ? "model" : "user",
    parts: item.parts
  }));
  
  // Append current turn
  geminiHistory.push({
    role: "user",
    parts: [{ text: message }]
  });

  const systemPrompt = `
    You are Helix AI, a hyper-intelligent career mentor and personal coach built into Hirevix.
    You help users with resumes, careers, interview preparation, skills improvement, and salary negotiation.
    
    Current Environment context:
    Pillar: ${currentPillar}
    Tab: ${currentTab}
    
    User Profile Summary:
    ${profile ? JSON.stringify({
      name: profile.personalInfo.name,
      domain: profile.careerSignals.domain,
      experience: profile.careerSignals.yearsOfExperience,
      skills: profile.skills,
      atsScore: profile.atsScore
    }) : "No resume uploaded yet."}
    
    Keep responses friendly, authoritative, clear, and actionable. Do not use plain lists; use beautiful formatting.
  `;

  return callGemini({
    contents: geminiHistory,
    systemPrompt
  });
}

// ── 10. forecastMarket ───────────────────────────────────────────
export async function forecastMarket(domain: string): Promise<MarketSignal[]> {
  const prompt = `
    Research the current real-time job market forecast, salary indicators, hiring companies, and trending technical/soft skills for the domain: "${domain}".
    Output the data conforming to the schema rules.
  `;

  // We add googleSearch tool directly if available
  const response = await callGemini({
    contents: userMsg(prompt),
    responseSchema: MarketForecastSchema as any,
    systemPrompt: "You are a market intelligence analyst. Provide realistic job market demand indexes.",
    modelName: "gemini-2.5-flash" // Best for grounded search queries
  });

  const data = safeJsonParse<{ signals: MarketSignal[] }>(response);
  return data.signals;
}

// ── 11. generateResumeSection ────────────────────────────────────
export async function generateResumeSection(sectionName: string, bulletText: string, context: string): Promise<string> {
  const prompt = `
    Improve and rewrite the following resume bullet point/text for the section: "${sectionName}".
    Make it punchy, quantitative, and metric-focused using action verbs.
    
    Original text:
    "${bulletText}"
    
    Additional Context:
    ${context}
    
    Just return the final optimized string, no JSON, no wrapping quotes.
  `;
  return callGemini({
    contents: userMsg(prompt),
    systemPrompt: "You are an expert resume writer. Output ONLY the optimized plain text sentence directly."
  });
}

// ── 12. generateResumeSectionV2 ──────────────────────────────────
export async function generateResumeSectionV2(
  sectionType: string,
  context: {
    jobTitle?: string;
    seniority?: string;
    industry?: string;
    rawFacts?: string;
    bulletText?: string;
    instruction?: string;
    issue?: string;
    fullResumeText?: string;
    targetTone?: string;
  }
): Promise<string> {
  const prompt = `
    You are an expert resume builder and career consultant.
    Your task is to generate or rewrite content for the section "${sectionType}".
    
    CRITICAL SAFETY RULES:
    1. NEVER invent or fabricate skills, employers, dates, achievements, or educational credentials that the user hasn't provided.
    2. Only rephrase, structure, refine, format, or highlight existing raw facts or inputs truthfully.
    3. Ensure content is professional, achievement-oriented, and flows exceptionally well.
    
    Input Context:
    ${JSON.stringify(context, null, 2)}
  `;

  return callGemini({
    contents: userMsg(prompt),
    systemPrompt: "You are an elite resume editor. Rewrite, structure, or improve the content according to instructions. Output ONLY the optimized resume text or bullet points, no commentary, no quotes, no conversational filler."
  });
}

// ── 13. compareToJobDescription ──────────────────────────────────
export async function compareToJobDescription(
  resumeProfile: ResumeProfile,
  jdText: string
): Promise<{
  matchPercent: number;
  missingKeywords: Array<{ keyword: string; importance: "high" | "medium" | "low" }>;
  suggestedRewrites: Array<{ originalBullet: string; suggestedBullet: string; reason: string }>;
}> {
  const prompt = `
    Analyze the following resume profile and compare it to the target job description.
    
    CRITICAL PROMPT-SAFETY RULE:
    Do NOT fabricate, hallucinate, or invent experience, achievements, dates, employers, or skills that the user does not actually possess based on their resume profile.
    Only reword, highlight, or emphasize existing, truthful experiences from their profile to better align with the job description keywords.
    
    Resume Profile:
    ${JSON.stringify(resumeProfile, null, 2)}
    
    Job Description:
    ${jdText}
  `;

  const response = await callGemini({
    contents: userMsg(prompt),
    responseSchema: CompareToJDSchema as any,
    systemPrompt: "You are a recruiting intelligence assistant. Compare a candidate's resume with a job description and suggest keyword matching improvements without fabricating credentials."
  });

  return safeJsonParse(response);
}

// ── 14. simulateRecruiterScan ────────────────────────────────────
export async function simulateRecruiterScan(
  resumeProfile: ResumeProfile
): Promise<{
  highVisibilitySpans: Array<{ text: string; reason: string }>;
  likelySkippedSpans: Array<{ text: string; reason: string }>;
}> {
  const prompt = `
    Simulate how a human recruiter would read this resume in the first 6 seconds.
    Identify high-visibility elements (e.g. name, current job title, prominent achievements, education keywords) and spans of text that are likely to be skipped or skimmed over.
    
    Resume Profile:
    ${JSON.stringify(resumeProfile, null, 2)}
  `;

  const response = await callGemini({
    contents: userMsg(prompt),
    responseSchema: RecruiterScanSchema as any,
    systemPrompt: "You are an expert executive recruiter. Perform a 6-second cognitive eye-tracking simulation on the resume profile."
  });

  return safeJsonParse(response);
}
