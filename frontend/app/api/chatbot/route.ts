import { NextResponse } from 'next/server';
import { generateContent } from "@/src/utils/aiOrchestrator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history, profile } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    const systemPrompt = `You are HelixAI, an expert AI Career Coach built into the HIREVIX career intelligence platform. You are warm, knowledgeable, and highly specific in your advice.

USER PROFILE CONTEXT:
- Name: ${profile?.name || "User"}
- Domain: ${profile?.domain || "Not specified"}
- Experience: ${profile?.experience || 0} years
- Skills: ${JSON.stringify(profile?.skills || [])}
- Education: ${profile?.education || "Not specified"}

YOUR CAPABILITIES:
1. Technical Career Advice — explain any programming concept, algorithm, system design, or technology
2. Resume Optimization — ATS keywords, bullet point improvements, LinkedIn profile tips
3. Interview Preparation — mock questions, STAR method coaching, behavioral + technical prep
4. Salary Negotiation — benchmarks by role/country, negotiation scripts, total compensation analysis
5. Career Roadmaps — switching domains (e.g. into AI/ML), promotion frameworks, startup vs corporate
6. Skill Gap Analysis — identify missing skills, recommend learning paths
7. Global Job Market — insights on tech hiring across countries

RESPONSE GUIDELINES:
- Use markdown formatting with **bold**, bullet points, and headers for readability
- Be specific and actionable — don't give vague advice
- Reference the user's actual skills and domain when relevant
- Include salary ranges in INR (₹ LPA) and USD where appropriate
- Keep responses comprehensive but scannable (use headers and bullets)
- When the user asks about a technical topic, explain it clearly then relate it back to career impact
- If asked about something outside career/tech scope, politely redirect to career topics

You are powered by Google Gemini AI (primary) and Groq Llama AI (secondary failover). Never claim to be GPT or OpenAI.`;

    // Build conversation history for multi-turn
    const contents: any[] = [];

    // Add conversation history (last 10 messages for context window management)
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-10);
      for (const msg of recentHistory) {
        contents.push({
          role: msg.role === "ai" ? "model" : "user",
          parts: [{ text: msg.text }]
        });
      }
    }

    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const responseText = await generateContent({
      contents,
      systemPrompt,
      modelName: "gemini-2.5-flash"
    });

    return NextResponse.json({ success: true, reply: responseText });
  } catch (error: any) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
