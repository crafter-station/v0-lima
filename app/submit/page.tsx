"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const CATEGORIES = [
  { value: "gtm", label: "GTM" },
  { value: "marketing", label: "Marketing" },
  { value: "design", label: "Design" },
  { value: "product", label: "Product" },
  { value: "animation", label: "Animation" },
  { value: "dev", label: "Dev" },
  { value: "data", label: "Data & Ops" },
  { value: "agents", label: "Practical Agents" },
];

export default function SubmitPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name") as string,
      author: formData.get("author") as string,
      authorTwitter: (formData.get("authorTwitter") as string) || "",
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      projectUrl: formData.get("projectUrl") as string,
      socialPostUrl: (formData.get("socialPostUrl") as string) || "",
    };

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <main className="overflow-x-hidden pt-24 pb-16">
        <section className="mx-auto max-w-xl px-6 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-6" />
          <h1 className="text-3xl font-semibold mb-4">Project submitted!</h1>
          <p className="text-muted-foreground mb-4">
            Your project is now live on the Crafter Station community showcase.
          </p>
          <p className="text-muted-foreground mb-8">
            To see the results and connect with other builders, join the community on Discord or WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/browse">Browse & vote</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="overflow-x-hidden pt-24 pb-16">
      <section className="mx-auto max-w-xl px-6">
        <div className="text-center mb-10">
          <span className="font-mono text-sm text-muted-foreground uppercase">
            Submit
          </span>
          <TextEffect
            preset="fade-in-blur"
            speedSegment={0.3}
            as="h1"
            className="mt-4 text-balance text-3xl font-semibold md:text-4xl"
          >
            Submit your build
          </TextEffect>
          <p className="mt-3 text-muted-foreground">
            Deploy your project, share it publicly, and submit it here.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium"
            >
              Project name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={100}
              placeholder="My awesome project"
              className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label
              htmlFor="author"
              className="mb-1.5 block text-sm font-medium"
            >
              Your name *
            </label>
            <input
              id="author"
              name="author"
              type="text"
              required
              maxLength={100}
              placeholder="John Doe"
              className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label
              htmlFor="authorTwitter"
              className="mb-1.5 block text-sm font-medium"
            >
              X / Twitter handle
            </label>
            <input
              id="authorTwitter"
              name="authorTwitter"
              type="text"
              maxLength={100}
              placeholder="@handle"
              className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              maxLength={500}
              rows={3}
              placeholder="What does your project do?"
              className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-1.5 block text-sm font-medium"
            >
              Track / Category *
            </label>
            <select
              id="category"
              name="category"
              required
              className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a track</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="projectUrl"
              className="mb-1.5 block text-sm font-medium"
            >
              Deployed project URL *
            </label>
            <input
              id="projectUrl"
              name="projectUrl"
              type="url"
              required
              placeholder="https://my-project.vercel.app"
              className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label
              htmlFor="socialPostUrl"
              className="mb-1.5 block text-sm font-medium"
            >
              Social post URL (X or LinkedIn)
            </label>
            <input
              id="socialPostUrl"
              name="socialPostUrl"
              type="url"
              placeholder="https://x.com/user/status/123"
              className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit project"}
          </Button>
        </form>
      </section>
    </main>
  );
}
