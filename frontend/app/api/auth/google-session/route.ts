import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/auth";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/src/lib/mongodb";
import User from "@/src/models/User";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev";

export async function POST(req: Request) {
  try {
    let userEmail = "";
    let userName = "";

    // Try reading from body first
    try {
      const body = await req.json();
      if (body.email) {
        userEmail = body.email.toLowerCase();
        userName = body.name || "User";
      }
    } catch (e) {
      // Fallback to NextAuth session if no JSON body
    }

    if (!userEmail) {
      const session = await getServerSession(authOptions);
      if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      userEmail = session.user.email.toLowerCase();
      userName = session.user.name || "User";
    }

    await connectToDatabase();

    // Check if user exists
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      // Create user if they don't exist
      user = new User({
        name: userName || "User",
        email: userEmail,
        profile: {
          skills: [],
          experience: 0,
          domain: "",
          projects: [],
          education: "",
          bio: "",
          xp: 0,
          level: "Explorer",
        },
      });
      await user.save();
    }

    // Generate standard JWT token matching existing expectations
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role || "user" }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return NextResponse.json({
      message: "Google login successful",
      access_token: token,
      user: { name: user.name, email: user.email, role: user.role || "user" },
    }, { status: 200 });
  } catch (error) {
    console.error("Google session auth error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
