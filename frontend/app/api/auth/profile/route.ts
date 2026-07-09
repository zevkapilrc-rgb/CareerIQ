import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/src/lib/mongodb";
import User from "@/src/models/User";

export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev";

function getUserIdFromToken(req: Request): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
}

// GET — Fetch saved profile from MongoDB
export async function GET(req: Request) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const user = await User.findById(userId).select("name email profile");
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({
      name: user.name,
      email: user.email,
      profile: user.profile || null,
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ message: "Failed to fetch profile" }, { status: 500 });
  }
}

// PUT — Save/update profile in MongoDB
export async function PUT(req: Request) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { skills, experience, domain, projects, education, bio, xp, level, resumeAnalysis } = body;

    await connectToDatabase();
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          profile: {
            skills: skills || [],
            experience: experience || 0,
            domain: domain || "",
            projects: projects || [],
            education: education || "",
            bio: bio || "",
            xp: xp || 0,
            level: level || "Explorer",
            resumeAnalysis: resumeAnalysis || null,
          },
        },
      },
      { new: true }
    );

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "Profile saved", profile: user.profile });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ message: "Failed to save profile" }, { status: 500 });
  }
}
