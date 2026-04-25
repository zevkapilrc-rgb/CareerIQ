import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/src/lib/mongodb";
import User from "@/src/models/User";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    await connectToDatabase();

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ name: user.name, email: user.email }, { status: 200 });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ message: "Unauthorized or token expired." }, { status: 401 });
  }
}
