import {TextEffect} from "@/components/motion-primitives/text-effect";
import {AnimatedGroup} from "@/components/motion-primitives/animated-group";
import {transitionVariants} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const tracks = [
    {
        number: "01",
        name: "GTM",
        tagline: "Close deals faster. Automate research, personalize demos, and generate proposals on demand.",
        ideas: [
            "Custom product demo with prospect's logo and sample data",
            "Pricing configurator with real-time quotes",
            "Agent that researches prospects via web search and drafts outreach",
            "Agent that logs call notes and creates follow-ups",
            "Deal room portal for sharing proposals and tracking views",
            "ROI calculator tailored to prospect's industry",
        ],
    },
    {
        number: "02",
        name: "Marketing",
        tagline: "Turn ideas into campaigns. Repurpose content, analyze performance, and ship without waiting.",
        ideas: [
            "Campaign landing page with countdown timer and waitlist",
            "Agent that repurposes blog posts into social threads",
            "SEO brief generator that researches keywords and drafts outlines",
            "Event registration page with database-powered signups",
            "A/B test variant generator for landing page headlines",
            "Agent that pulls from your changelog, blog, and website to draft newsletter content",
        ],
    },
    {
        number: "03",
        name: "Design",
        tagline: "Refine layouts and maintain systems. Check consistency, document components, iterate faster.",
        ideas: [
            "Component library with buttons, cards, and forms",
            "Interactive style guide with live previews",
            "Agent that audits pages and creates issues for fixes",
            "Agent that documents components and generates usage examples",
            "Color palette generator with accessibility contrast checks",
            "Icon browser with search and copy-to-clipboard",
        ],
    },
    {
        number: "04",
        name: "Product",
        tagline: "Turn feedback and PRDs into prototypes. Synthesize, prioritize, and ship specs faster.",
        ideas: [
            "Feature prototype generated from your PRD",
            "Agent that synthesizes feedback and creates tickets",
            "Agent that reads specs and generates working UI",
            "Changelog page that pulls releases from your project management tool",
            "Feature voting board with database-powered submissions",
            "Agent that turns rough ideas into scoped stories",
        ],
    },
    {
        number: "05",
        name: "Animation",
        tagline: "Bring interfaces to life. Build transitions, micro-interactions, and scroll-driven effects.",
        ideas: [
            "Animated landing page with scroll-triggered sections",
            "Micro-interaction library for buttons, toggles, and cards",
            "Page transition system with shared layout animations",
            "SVG animation playground with timeline controls",
            "Parallax scrolling showcase with configurable layers",
            "Loading state collection with skeleton screens and spinners",
        ],
    },
    {
        number: "06",
        name: "Dev",
        tagline: "Unblock stakeholders without breaking prod. Triage, document, and automate the tedious stuff.",
        ideas: [
            "Admin panel for managing users and permissions",
            "Agent that triages errors and creates tickets",
            "Agent that generates API docs from your codebase",
            "Internal tool for customer support workflows",
            "Feature flag dashboard with rollout controls",
            "Agent that syncs issues to docs for stakeholders",
        ],
    },
    {
        number: "07",
        name: "Data & Ops",
        tagline: "Automate reporting and surface insights. Monitor metrics, alert on issues, keep teams informed.",
        ideas: [
            "Executive dashboard with KPIs and trend charts",
            "Natural language SQL agent connected to your database",
            "Agent that detects anomalies and creates alerts",
            "Agent that generates weekly reports and exports to PDF",
            "Data validation UI that flags issues in CSV uploads",
            "Status page showing system health and uptime",
        ],
    },
    {
        number: "08",
        name: "Practical Agents",
        tagline: "Build agents that do real work. Automate workflows, connect tools, and ship autonomous systems.",
        ideas: [
            "Email triage agent that categorizes and drafts responses",
            "Meeting prep agent that pulls context from docs and calendar",
            "Code review agent that checks PRs for common issues",
            "Customer onboarding agent that guides users through setup",
            "Content scheduling agent that manages social media posts",
            "Research agent that synthesizes information from multiple sources",
        ],
    },
];

export default function InspirationPage() {
    return (
        <main className="overflow-x-hidden pt-24 pb-16">
            <section className="mx-auto max-w-5xl px-6">
                <div className="text-center mb-16">
                    <span className="font-mono text-sm text-muted-foreground uppercase">Inspiration</span>
                    <TextEffect
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        as="h1"
                        className="mt-4 text-balance text-4xl font-semibold md:text-5xl lg:text-6xl">
                        Pick a track. Start building.
                    </TextEffect>
                    <TextEffect
                        per="line"
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        delay={0.3}
                        as="p"
                        className="mt-4 text-muted-foreground text-lg">
                        Not sure what to make? Here&apos;s some inspiration by role. Tracks are guidance, not rules.
                    </TextEffect>
                </div>

                <AnimatedGroup
                    variants={{
                        container: {
                            visible: {
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: 0.3,
                                },
                            },
                        },
                        ...transitionVariants,
                    }}
                    className="space-y-12"
                >
                    {tracks.map((track) => (
                        <div key={track.number} className="border-t border-dashed pt-8">
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="font-mono text-sm text-muted-foreground">{track.number}</span>
                                <h2 className="text-2xl font-semibold">{track.name}</h2>
                            </div>
                            <p className="text-muted-foreground mb-6 max-w-2xl">{track.tagline}</p>
                            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {track.ideas.map((idea) => (
                                    <li key={idea} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30"/>
                                        {idea}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </AnimatedGroup>

                <div className="mt-16 text-center">
                    <TextEffect
                        triggerOnView
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        as="h2"
                        className="text-3xl font-semibold mb-4">
                        Ready to ship?
                    </TextEffect>
                    <Button asChild size="lg">
                        <Link href="/submit">
                            <span>Submit your build</span>
                        </Link>
                    </Button>
                </div>
            </section>
        </main>
    );
}
