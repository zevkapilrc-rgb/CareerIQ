import { NextResponse } from "next/server";
import { generateResumeSectionV2 } from "@/src/lib/gemini-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sectionType, context } = body;

    if (!sectionType || !context) {
      return NextResponse.json(
        { success: false, error: "Missing sectionType or context parameters" },
        { status: 400 }
      );
    }

    const result = await generateResumeSectionV2(sectionType, context);
    return NextResponse.json({ success: true, text: result });
  } catch (error: any) {
    console.error("Error in generate-section API route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate resume section" },
      { status: 500 }
    );
  }
}
