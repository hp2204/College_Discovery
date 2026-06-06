import { NextRequest, NextResponse } from "next/server";
import { setSession, verifyPassword } from "@/lib/auth";
import { findUserByEmail } from "@/lib/store";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const user = await findUserByEmail(String(email ?? "").toLowerCase());
  if (!user || !verifyPassword(password ?? "", user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  await setSession(user.id);
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
}
