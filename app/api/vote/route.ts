import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";
import { vote } from "@/lib/submissions";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
});

const voteSchema = z.object({
  submissionId: z.string().min(1),
});

function getIpFingerprint(headersList: Headers): string {
  const forwarded = headersList.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return ip;
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const ip = getIpFingerprint(headersList);

    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { submissionId } = voteSchema.parse(body);

    const result = await vote(submissionId, ip);

    if (!result.success) {
      return NextResponse.json(
        { error: "Already voted for this submission", votes: result.votes },
        { status: 409 }
      );
    }

    return NextResponse.json({ votes: result.votes });
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
