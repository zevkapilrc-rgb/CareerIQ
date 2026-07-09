import { NextResponse } from "next/server";
import { simulateRecruiterScan } from "@/src/lib/gemini-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resumeProfile } = body;

    if (!resumeProfile) {
      return NextResponse.json(
        { success: false, error: "Missing resumeProfile parameter" },
        { status: 400 }
      );
    }

    const result = await simulateRecruiterScan(resumeProfile);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error in recruiter-scan API route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to simulate recruiter scan" },
      { status: 500 }
    );
  }
}
