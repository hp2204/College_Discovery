import { NextRequest, NextResponse } from "next/server";
import { listColleges } from "@/lib/store";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const result = await listColleges({
    q: params.get("q") || undefined,
    exam: params.get("exam") || undefined,
    type: params.get("type") || undefined,
    maxFee: params.get("maxFee") ? Number(params.get("maxFee")) : undefined,
    page: params.get("page") ? Number(params.get("page")) : 1,
    pageSize: 6,
  });

  return NextResponse.json(result);
}
