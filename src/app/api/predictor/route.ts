import { NextRequest, NextResponse } from "next/server";
import { predictColleges } from "@/lib/store";

export async function POST(request: NextRequest) {
  const { exam, rank, category, branch, quota, mode } = await request.json();
  if (!exam || !rank || Number(rank) < 1) {
    return NextResponse.json({ error: "Exam and valid rank are required" }, { status: 400 });
  }
  const items = await predictColleges(exam, Number(rank), { category, branch, quota, mode });
  return NextResponse.json({ items });
}
