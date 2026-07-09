import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

// ── Helper to Call Groq API ───────────────────────────────────────────
async function callGroq(messages: any[], systemPrompt?: string, responseJson = false): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const groqMessages = [...messages];
  if (systemPrompt) {
    groqMessages.unshift({ role: "system", content: systemPrompt });
  }

  const payload: any = {
    model: "llama-3.3-70b-versatile",
    messages: groqMessages,
    temperature: 0.3,
    max_tokens: 4096,
  };

  if (responseJson) {
    payload.response_format = { type: "json_object" };
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error: ${errText}`);
  }

  const result = await response.json();
  return result?.choices?.[0]?.message?.content || "";
}

// ── Helper to Call Gemini API ─────────────────────────────────────────
async function callGemini(prompt: string, systemPrompt?: string, responseJson = false): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const finalPrompt = systemPrompt ? `System Instruction: ${systemPrompt}\n\nUser Input:\n${prompt}` : prompt;

  const response = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
    generationConfig: responseJson ? { responseMimeType: "application/json" } : undefined,
  });

  return response.response.text() || "";
}

// ── Helper to Clean Markdown & Parse JSON Safely ──────────────────────
function safeParseJson(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "").replace(/\s*```$/, "");
  }
  return JSON.parse(cleaned.trim());
}

// ── Main Route POST Handler ───────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { feature, payload } = body;

    if (!feature) {
      return NextResponse.json({ success: false, error: "Missing feature parameter" }, { status: 400 });
    }

    let responseData: any = null;

    switch (feature) {
      case "resume_create": {
        // -> Groq
        const prompt = `Create a professional ATS-compliant resume summary or bullet point list based on these raw details:
        ${JSON.stringify(payload)}
        Ensure metric-driven achievements and high-impact action verbs. Output a clean JSON object with {"improved": "..."}.`;
        const res = await callGroq([{ role: "user", content: prompt }], "You are an elite corporate CV writer.", true);
        responseData = safeParseJson(res);
        break;
      }

      case "resume_analyze": {
        // -> Gemini + Groq
        const geminiRes = await callGemini(
          `Analyze this resume for keyword matching and section completeness: ${JSON.stringify(payload)}`,
          "Perform deep ATS scoring and analysis. Output raw JSON object with scores: {ats_score, keyword_matches, suggestions}.",
          true
        );
        const groqRes = await callGroq(
          [{ role: "user", content: `Based on this ATS analysis, draft high-impact alternative bullet points: ${geminiRes}` }],
          "You are a professional resume writer.",
          true
        );
        responseData = {
          analysis: safeParseJson(geminiRes),
          rewrites: safeParseJson(groqRes),
        };
        break;
      }

      case "interview": {
        // -> Groq (ask) + Gemini (score)
        const groqQuestion = await callGroq(
          [{ role: "user", content: `Generate a tough behavioral interview question for a ${payload.role || "Software Engineer"} based on this topic: ${payload.topic}` }],
          "You are a Fortune 500 tech interviewer."
        );
        const geminiScore = await callGemini(
          `Score this candidate answer: "${payload.answer || ""}" against the question: "${groqQuestion}"`,
          "Return a JSON score card: {score: number, feedback: string}.",
          true
        );
        responseData = {
          question: groqQuestion,
          evaluation: safeParseJson(geminiScore),
        };
        break;
      }

      case "career_path": {
        // -> Gemini
        const res = await callGemini(
          `Project career path suggestions for domain: ${payload.domain} with experience: ${payload.experience} years.`,
          "Output a JSON list of paths with role, salary potential, demand index: {paths: [{role, salary, demand}]}.",
          true
        );
        responseData = safeParseJson(res);
        break;
      }

      case "skill_gap": {
        // -> Gemini
        const res = await callGemini(
          `Compare user skills: ${JSON.stringify(payload.userSkills)} against target role: ${payload.targetRole}.`,
          "Output a JSON object with: {gaps: string[], recommendation: string}.",
          true
        );
        responseData = safeParseJson(res);
        break;
      }

      case "learning_path": {
        // -> Groq + Gemini
        const geminiSyllabus = await callGemini(
          `Create a curriculum syllabus for missing skills: ${JSON.stringify(payload.missingSkills)}`,
          "Output structural JSON syllabus outline: {modules: [{title, topics: string[]}]}.",
          true
        );
        const groqResources = await callGroq(
          [{ role: "user", content: `Find online articles, tools, and courses for this syllabus: ${geminiSyllabus}` }],
          "Recommend top-tier professional learning resources.",
          true
        );
        responseData = {
          syllabus: safeParseJson(geminiSyllabus),
          resources: safeParseJson(groqResources),
        };
        break;
      }

      case "analytics": {
        // -> DB + Gemini
        const res = await callGemini(
          `Summarize this user telemetry and competence log for dashboard highlights: ${JSON.stringify(payload)}`,
          "Return JSON analytics summary: {strengths, improvements, careerHealthScore}.",
          true
        );
        responseData = safeParseJson(res);
        break;
      }

      case "skill_dna": {
        // -> Gemini + Groq
        const geminiDNA = await callGemini(
          `Generate a capability map vector for these technologies: ${JSON.stringify(payload.skills)}`,
          "Return JSON vector coordinates: {coordinates: [{name, x, y, category}]}.",
          true
        );
        const groqRecs = await callGroq(
          [{ role: "user", content: `Recommend projects to build to strengthen this capability map: ${geminiDNA}` }],
          "Provide advanced project blueprints.",
          true
        );
        responseData = {
          dna: safeParseJson(geminiDNA),
          recommendations: safeParseJson(groqRecs),
        };
        break;
      }

      case "forecast": {
        // -> Gemini
        const res = await callGemini(
          `Calculate 5-year salary projection for domain: ${payload.domain} under marketswing: ${payload.swing}% and upskills: ${payload.upskills}.`,
          "Return JSON salary projections: {years: [string], base: [number], optimized: [number]}.",
          true
        );
        responseData = safeParseJson(res);
        break;
      }

      case "jobs": {
        // -> API + Gemini
        const res = await callGemini(
          `Rank these raw job listings based on suitability for candidate skills: ${JSON.stringify(payload.jobs)}`,
          "Return JSON array of ranked listings with match percentages: {ranked: [{id, matchPercent, rationale}]}.",
          true
        );
        responseData = safeParseJson(res);
        break;
      }

      case "profile": {
        // -> Gemini + Groq
        const geminiBio = await callGemini(
          `Draft a professional bio for a ${payload.title || "Developer"} located in ${payload.location || "India"}.`,
          "Output a clean short bio string."
        );
        const groqHeadline = await callGroq(
          [{ role: "user", content: `Based on this bio, create a killer LinkedIn headline: ${geminiBio}` }],
          "Create a punchy headline under 80 characters."
        );
        responseData = {
          bio: geminiBio.trim(),
          headline: groqHeadline.replace(/"/g, "").trim(),
        };
        break;
      }

      case "recruiter_chat": {
        const { messages } = payload;
        const systemPrompt = `You are a Fortune-500 technical recruiter interviewing Kapil Dev to build their CV/resume. Ask concise, conversational questions, one at a time. Output a valid markdown JSON block at the bottom of your message ONLY when the user provides enough information to extract a project, experience item, or skills list. Check this schema:
        - Project: {"type": "project", "data": {"name", "description", "techStack": [], "highlights": []}}
        - Experience: {"type": "experience", "data": {"company", "role", "startDate", "endDate", "location", "bullets": []}}
        - Skills: {"type": "skills", "data": {"technical": [], "frameworks": []}}
        Ask ONLY one question at a time. Be friendly and direct.`;
        
        const responseText = await callGemini(
          JSON.stringify(messages),
          systemPrompt,
          false
        );
        responseData = { text: responseText };
        break;
      }

      default:
        return NextResponse.json({ success: false, error: `Unsupported feature: ${feature}` }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: responseData });
  } catch (err: any) {
    console.error("[AI Router] Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to route AI request" }, { status: 500 });
  }
}
