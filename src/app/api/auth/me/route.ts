import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { getUser } from "@/lib/store";

export async function GET() {
  const userId = await currentUserId();
  const user = userId ? await getUser(userId) : null;
  return NextResponse.json({ user });
}
