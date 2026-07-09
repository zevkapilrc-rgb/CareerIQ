import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
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
    const { identifier, password } = body as { identifier?: string; password?: string };

    if (!identifier || !password) {
      return NextResponse.json({ message: "Missing email or password." }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ message: "Authentication service is not configured." }, { status: 503 });
    }

    // 1. Sign in via Supabase Auth
    const { data: authSession, error: authError } = await supabase.auth.signInWithPassword({
      email: identifier.toLowerCase(),
      password: password
    });

    if (authError || !authSession.session || !authSession.user) {
      console.error("Supabase login error:", authError);
      return NextResponse.json({ message: authError?.message || "Invalid email or password." }, { status: 401 });
    }

    // 2. Fetch user information from Prisma
    let dbUser = await prisma.user.findUnique({
      where: { id: authSession.user.id }
    });

    // Fallback: If user is authenticated in Supabase but not yet recorded in Prisma
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: authSession.user.id,
          email: authSession.user.email || identifier.toLowerCase(),
          name: authSession.user.user_metadata?.name || identifier.split("@")[0],
          role: "user"
        }
      });
    }

    return NextResponse.json(
      { 
        message: "Login successful", 
        access_token: authSession.session.access_token, 
        user: { 
          name: dbUser.name, 
          email: dbUser.email, 
          role: dbUser.role 
        } 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    const status = error.message === "Invalid JSON payload." ? 400 : 500;
    return NextResponse.json({ message: error.message || "An error occurred during login." }, { status });
  }
}
