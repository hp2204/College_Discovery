import { NextRequest, NextResponse } from "next/server";
import { hashPassword, setSession } from "@/lib/auth";
import { createUser } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json({ error: "Name, email and a 6+ character password are required" }, { status: 400 });
    }
    const user = await createUser({ name, email: email.toLowerCase(), passwordHash: hashPassword(password) });
    await setSession(user.id);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "An account with this email may already exist" }, { status: 409 });
  }
}
