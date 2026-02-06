import { redis } from "./redis";

export interface Submission {
  id: string;
  name: string;
  author: string;
  authorTwitter: string;
  description: string;
  category: string;
  projectUrl: string;
  socialPostUrl: string;
  createdAt: number;
}

export interface SubmissionWithVotes extends Submission {
  votes: number;
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function createSubmission(
  data: Omit<Submission, "id" | "createdAt">
): Promise<Submission> {
  const id = generateId();
  const submission: Submission = {
    ...data,
    id,
    createdAt: Date.now(),
  };

  await Promise.all([
    redis.hset(`submission:${id}`, submission),
    redis.zadd("submissions:all", { score: submission.createdAt, member: id }),
    redis.sadd(`submissions:category:${data.category}`, id),
    redis.set(`vote:count:${id}`, 0),
  ]);

  return submission;
}

export async function getSubmissions(): Promise<SubmissionWithVotes[]> {
  const ids = await redis.zrange("submissions:all", 0, -1, { rev: true });
  if (!ids.length) return [];

  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.hgetall(`submission:${id}`);
    pipeline.get(`vote:count:${id}`);
  }

  const results = await pipeline.exec();
  const submissions: SubmissionWithVotes[] = [];

  for (let i = 0; i < ids.length; i++) {
    const data = results[i * 2] as Submission | null;
    const votes = (results[i * 2 + 1] as number) || 0;
    if (data) {
      submissions.push({ ...data, votes });
    }
  }

  return submissions;
}

export async function getSubmission(
  id: string
): Promise<SubmissionWithVotes | null> {
  const [data, votes] = await Promise.all([
    redis.hgetall(`submission:${id}`) as Promise<Submission | null>,
    redis.get(`vote:count:${id}`) as Promise<number | null>,
  ]);

  if (!data) return null;
  return { ...data, votes: votes || 0 };
}

export async function vote(
  submissionId: string,
  voterFingerprint: string
): Promise<{ success: boolean; votes: number }> {
  const added = await redis.sadd(
    `votes:${submissionId}`,
    voterFingerprint
  );

  if (added === 0) {
    const votes =
      (await redis.get<number>(`vote:count:${submissionId}`)) || 0;
    return { success: false, votes };
  }

  const votes = await redis.incr(`vote:count:${submissionId}`);
  return { success: true, votes };
}
