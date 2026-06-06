import { NextResponse } from "next/server";
import { getCollege } from "@/lib/store";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const college = await getCollege(slug);
  if (!college) return NextResponse.json({ error: "College not found" }, { status: 404 });
  return NextResponse.json(college);
}
