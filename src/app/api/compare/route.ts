import { NextRequest, NextResponse } from "next/server";
import { getCollegesByIds } from "@/lib/store";

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get("ids")?.split(",").filter(Boolean).slice(0, 3) ?? [];
  const colleges = await getCollegesByIds(ids);
  return NextResponse.json({ items: colleges });
}
