import { NextResponse } from "next/server";
import { z } from "zod";
import { createSubmission, getSubmissions } from "@/lib/submissions";

const CATEGORIES = [
  "gtm",
  "marketing",
  "design",
  "product",
  "animation",
  "dev",
  "data",
  "agents",
] as const;

const createSchema = z.object({
  name: z.string().min(1).max(100),
  author: z.string().min(1).max(100),
  authorTwitter: z.string().max(100).default(""),
  description: z.string().min(1).max(500),
  category: z.enum(CATEGORIES),
  projectUrl: z.string().url(),
  socialPostUrl: z.string().url().or(z.literal("")),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createSchema.parse(body);
    const submission = await createSubmission(data);
    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const submissions = await getSubmissions();
    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
