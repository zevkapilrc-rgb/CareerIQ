import { NextResponse } from 'next/server';
import { generateContent } from "@/src/utils/aiOrchestrator";

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Neither GEMINI_API_KEY nor GROQ_API_KEY environment variable is configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { skills, experience, domain } = body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json({ success: false, error: "Skills array is required" }, { status: 400 });
    }

    const prompt = `
You are an expert AI Career Coach and Skill Mapping Strategist.
Analyze the following professional profile data:
- Domain: ${domain || "Software Engineering"}
- Experience: ${experience || 0} years
- Current Skill Set: ${JSON.stringify(skills)}

Generate a highly detailed, professional, and advanced Skill DNA Graph report.
Identify:
1. Four core skill metrics (0-100 scale):
   - density: percentage of inter-connections in their skill set (based on how related these skills are to each other)
   - versatility: index of how adaptable their skill set is across different sub-fields/domains
   - depthScore: score representing the deep competence they likely have based on experience and skill combination
   - breadthScore: score representing the wide coverage of different technologies and methodologies
2. Relationships/connections between the skills:
   - Map each skill in their profile to 2-5 other skills in their profile (if they relate) or close industry terms that connect them.
   - For example, if React is in the profile, map it to JavaScript, TypeScript, Next.js, etc.
3. Recommendations (6 total):
   - Include emerging skill shortages, missing skills with high demand, and technologies to level-up.
   - Each recommendation must have a name, priority ("high", "medium", or "low"), and a custom relation string explanation.
4. Short descriptions for each skill:
   - Provide a concise 5-10 word professional definition or description for each of the provided skills.

Generate content and return a JSON object matching this TypeScript interface exactly:
interface SkillDNAResponse {
  metrics: {
    density: number;
    versatility: number;
    depthScore: number;
    breadthScore: number;
  };
  skillRelations: { [skillName: string]: string[] };
  suggestions: Array<{
    name: string;
    relation: string;
    priority: "high" | "medium" | "low";
  }>;
  skillDescriptions: { [skillName: string]: string };
}

Ensure the response is detailed and returned as a valid JSON object without any markdown wrapping (do not wrap with \`\`\`json or \`\`\`).
`;

    // Use AI Orchestrator with Gemini + Groq failover
    const responseText = await generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      responseJson: true,
      modelName: "gemini-2.5-flash"
    });
    const data = JSON.parse(responseText);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Skill DNA API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process skill DNA analysis" },
      { status: 500 }
    );
  }
}
