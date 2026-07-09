import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase";
import prisma from "@/src/lib/prisma";

async function readJsonBody(req: Request) {
  const text = await req.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON payload.");
  }
}

export async function POST(req: Request) {
  try {
    const body = await readJsonBody(req);
    const { name, email, password } = body as { name?: string; email?: string; password?: string };

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ message: "Authentication service is not configured." }, { status: 503 });
    }

    // Check if user already exists in Prisma DB
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists with this email." }, { status: 409 });
    }

    // 1. Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password: password,
      email_confirm: true,
      user_metadata: { name }
    });

    if (authError || !authUser.user) {
      console.error("Supabase auth registration error:", authError);
      return NextResponse.json({ message: authError?.message || "Failed to create authentication user." }, { status: 500 });
    }

    // 2. Create user in Prisma DB using the Supabase User ID
    const newUser = await prisma.user.create({
      data: {
        id: authUser.user.id,
        email: email.toLowerCase(),
        name,
        role: "user"
      }
    });

    return NextResponse.json(
      { message: "User created successfully", user: { id: newUser.id, name: newUser.name, email: newUser.email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    const status = error.message === "Invalid JSON payload." ? 400 : 500;
    return NextResponse.json({ message: error.message || "An error occurred during registration." }, { status });
  }
}
