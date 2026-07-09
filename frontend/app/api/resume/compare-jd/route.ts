import { NextResponse } from "next/server";
import { generateResumeMatchInsights } from "@/src/lib/resume-heuristics";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resumeProfile, jdText } = body;

    if (!resumeProfile || !jdText) {
      return NextResponse.json(
        { success: false, error: "Missing resumeProfile or jdText parameters" },
        { status: 400 }
      );
    }

    const result = generateResumeMatchInsights(resumeProfile, jdText);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error in compare-jd API route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to compare to job description" },
      { status: 500 }
    );
  }
}
