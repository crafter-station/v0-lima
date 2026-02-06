"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { transitionVariants } from "@/lib/utils";
import { ExternalLink, ThumbsUp } from "lucide-react";
import Link from "next/link";
import type { SubmissionWithVotes } from "@/lib/submissions";

const CATEGORY_LABELS: Record<string, string> = {
  gtm: "GTM",
  marketing: "Marketing",
  design: "Design",
  product: "Product",
  animation: "Animation",
  dev: "Dev",
  data: "Data & Ops",
  agents: "Agents",
};

type SortBy = "votes" | "recent";

export default function BrowsePage() {
  const [submissions, setSubmissions] = useState<SubmissionWithVotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>("votes");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [votingId, setVotingId] = useState<string | null>(null);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  async function handleVote(submissionId: string) {
    if (votedIds.has(submissionId)) return;
    setVotingId(submissionId);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });

      const data = await res.json();

      if (res.ok || res.status === 409) {
        setVotedIds((prev) => new Set([...prev, submissionId]));
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === submissionId ? { ...s, votes: data.votes } : s
          )
        );
      }
    } catch {
      // silently fail
    } finally {
      setVotingId(null);
    }
  }

  const filtered = submissions.filter(
    (s) => filterCategory === "all" || s.category === filterCategory
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "votes") return b.votes - a.votes;
    return b.createdAt - a.createdAt;
  });

  const categories = [
    "all",
    ...new Set(submissions.map((s) => s.category)),
  ];

  return (
    <main className="overflow-x-hidden pt-24 pb-16">
      <section className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-10">
          <span className="font-mono text-sm text-muted-foreground uppercase">
            Community Showcase
          </span>
          <TextEffect
            preset="fade-in-blur"
            speedSegment={0.3}
            as="h1"
            className="mt-4 text-balance text-3xl font-semibold md:text-4xl lg:text-5xl"
          >
            Browse & vote
          </TextEffect>
          <p className="mt-3 text-muted-foreground">
            {submissions.length} submissions &middot;{" "}
            {submissions.reduce((acc, s) => acc + s.votes, 0)} total votes
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-mono transition-colors ${
                  filterCategory === cat
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat === "all" ? "All" : CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("votes")}
              className={`rounded-full px-3 py-1 text-xs font-mono transition-colors ${
                sortBy === "votes"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Top voted
            </button>
            <button
              onClick={() => setSortBy("recent")}
              className={`rounded-full px-3 py-1 text-xs font-mono transition-colors ${
                sortBy === "recent"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Recent
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">
              No submissions yet. Be the first to submit!
            </p>
            <Button asChild>
              <Link href="/internal">Submit to community vote</Link>
            </Button>
          </div>
        ) : (
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.2,
                  },
                },
              },
              ...transitionVariants,
            }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {sorted.map((submission) => (
              <Card
                key={submission.id}
                className="group overflow-hidden transition-colors hover:border-foreground/20"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-base truncate">
                        {submission.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {submission.author}
                        {submission.authorTwitter && (
                          <span> &middot; {submission.authorTwitter}</span>
                        )}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-mono">
                      {CATEGORY_LABELS[submission.category] ||
                        submission.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {submission.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleVote(submission.id)}
                      disabled={
                        votingId === submission.id ||
                        votedIds.has(submission.id)
                      }
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-mono transition-colors ${
                        votedIds.has(submission.id)
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground hover:bg-foreground hover:text-background"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{submission.votes}</span>
                    </button>
                    <div className="flex gap-2">
                      {submission.socialPostUrl && (
                        <a
                          href={submission.socialPostUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <a
                        href={submission.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-muted-foreground hover:text-foreground underline transition-colors"
                      >
                        View project
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </AnimatedGroup>
        )}
      </section>
    </main>
  );
}
