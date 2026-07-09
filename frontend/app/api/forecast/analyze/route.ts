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

    const prompt = `
You are a top-tier Tech Industry Market Analyst and Futurist.
Analyze the following professional profile data:
- Domain: ${domain || "Software Engineering"}
- Experience: ${experience || 0} years
- Current Skill Set: ${JSON.stringify(skills || [])}

Generate a comprehensive 5-year Career Forecast and Automation Risk Report.
Provide a JSON object matching this TypeScript structure:
interface ForecastResponse {
  confidenceScore: number; // 0-100, the statistical confidence of this forecast
  automationRisk: number; // 0-100, risk of automation in their specific domain
  salaryPremium: number; // 0-100, estimated salary percentage boost they get by adding advanced/AI capabilities
  disruptionTimeline: string; // e.g. "3-5 Years" or "1-2 Years"
  targetEvolution: string; // e.g. "AI-Augmented Architect", "Human-in-the-loop Engineer"
  growthData: Array<{
    year: string;
    demand: number; // market demand index (relative to 100 in 2024, range 100-350)
    automation: number; // automation index (relative to 100 in 2024, range 10-90)
  }>;
  salaryData: Array<{
    role: string; // e.g. "Traditional", "AI-Enhanced", "AI-Creator"
    current: number; // current salary in thousands (e.g. 80)
    future: number; // projected 2030 salary in thousands (e.g. 150)
  }>;
  obsolescenceWatch: string[]; // 4-5 technologies, tools, or techniques declining in relevance for this domain
  risingTechnologies: string[]; // 4-5 emerging/rising technologies or methodologies relevant to their domain
  survivalBlueprint: string; // 2-3 paragraph detailed professional text outlining concrete steps to remain competitive and survive automation.
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
    console.error("Forecast API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process forecast analysis" },
      { status: 500 }
    );
  }
}
