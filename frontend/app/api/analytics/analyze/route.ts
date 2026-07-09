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
    const { skills, experience, domain, atsScore, historyCount } = body;

    const prompt = `
You are a senior Talent Acquisition Director and Competency Specialist.
Analyze the following professional profile data:
- Domain: ${domain || "Software Engineering"}
- Experience: ${experience || 0} years
- Current Skill Set: ${JSON.stringify(skills || [])}
- Current Resume ATS Score: ${atsScore || 60}
- Mock Interview History count: ${historyCount || 0}

Generate deep career analytics and comparative benchmarks.
Provide a JSON object matching this TypeScript structure:
interface AnalyticsResponse {
  healthScore: number; // 0-100 career health index
  healthTier: string; // e.g. "Top 15% in your domain", "Top 5% of Engineers"
  atsComparison: string; // e.g. "+15% vs market average"
  readinessLabel: string; // e.g. "Ready for Senior roles", "Gaps detected"
  marketDemandLevel: "High" | "Moderate" | "Extremely High" | "Low";
  growthTrajectory: Array<{
    m: string; // Month label, e.g. "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"
    ats: number; // simulated historical ATS score progress
    interview: number; // simulated historical interview readiness progress
    marketDemand: number; // simulated market demand index progress
  }>;
  benchmarkData: Array<{
    skill: string; // core competency area (e.g. Frontend, Backend, System Design, DevOps, Security)
    user: number; // user's score (0-100)
    avg: number; // market average score (0-100)
    top10: number; // top 10% average score (0-100)
  }>;
  skillMasteryTime: Array<{
    skill: string; // short skill name
    hours: number; // estimated hours invested or needed to master
    mastery: number; // mastery percentage (0-100)
  }>;
  macroTrendData: Array<{
    quarter: string; // e.g. "Q1 '25", "Q2 '25"
    demand: number; // relative industry demand index
    supply: number; // relative talent supply index
  }>;
  macroTrendSummary: string; // summary of macro demand/supply trend
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
    console.error("Analytics API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process analytics data" },
      { status: 500 }
    );
  }
}
