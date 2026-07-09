import { NextResponse } from "next/server";
import { scoreATS } from "@/src/lib/gemini-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profile } = body;

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Missing profile parameter" },
        { status: 400 }
      );
    }

    const result = await scoreATS(profile);
    return NextResponse.json({ success: true, score: result.score, issues: result.issues });
  } catch (error: any) {
    console.error("Error in score API route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to score resume" },
      { status: 500 }
    );
  }
}
