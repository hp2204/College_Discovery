import { NextRequest, NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { listSaved, toggleSaved } from "@/lib/store";

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ items: [] });
  return NextResponse.json({ items: await listSaved(userId) });
}

export async function POST(request: NextRequest) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { collegeId } = await request.json();
  return NextResponse.json(await toggleSaved(userId, collegeId));
}
