import { NextRequest, NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { createAnswer, createQuestion, listQuestions } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ items: await listQuestions() });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const authorId = (await currentUserId()) ?? undefined;

  if (body.questionId) {
    if (!body.body) return NextResponse.json({ error: "Answer body is required" }, { status: 400 });
    return NextResponse.json(await createAnswer({ questionId: body.questionId, body: body.body, authorId }));
  }

  if (!body.title || !body.body) return NextResponse.json({ error: "Title and question body are required" }, { status: 400 });
  return NextResponse.json(await createQuestion({ title: body.title, body: body.body, collegeId: body.collegeId, authorId }));
}
