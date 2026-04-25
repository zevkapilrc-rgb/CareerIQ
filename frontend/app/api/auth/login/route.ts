import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/src/lib/mongodb";
import User from "@/src/models/User";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev";

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json({ message: "Missing email or password." }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: identifier.toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // Create a mock token to match the existing frontend expectation
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json(
      { message: "Login successful", access_token: token, user: { name: user.name, email: user.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "An error occurred during login." }, { status: 500 });
  }
}
