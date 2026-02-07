import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {TextEffect} from "./motion-primitives/text-effect"
import {AnimatedGroup} from "@/components/motion-primitives/animated-group";
import {transitionVariants} from "@/lib/utils";

export default function CallToAction() {
    return (
        <section className="py-16 mx-2">
            <div className="mx-auto max-w-5xl rounded-3xl border px-6 py-12 md:py-20 lg:py-32">
                <div className="text-center">
                    <TextEffect
                        triggerOnView
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        as="h2"
                        className="text-balance text-4xl font-semibold lg:text-5xl">
                        Ready to ship?
                    </TextEffect>
                    <TextEffect
                        triggerOnView
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        delay={0.3}
                        as="p"
                        className="mt-4 text-muted-foreground max-w-lg mx-auto">
                        Submit to the v0 global showcase, then register your project for the Lima community vote.
                    </TextEffect>
                    <AnimatedGroup
                        triggerOnView
                        variants={{
                            container: {
                                visible: {
                                    transition: {
                                        staggerChildren: 0.05,
                                        delayChildren: 0.75,
                                    },
                                },
                            },
                            ...transitionVariants,
                        }}
                        className="mt-12 flex flex-wrap justify-center gap-4"
                    >
                        <Button
                            asChild
                            size="lg">
                            <Link href="https://v0-v0prompttoproduction2026.vercel.app/submit" target="_blank" rel="noopener noreferrer">
                                <span>1. Submit to v0</span>
                            </Link>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            variant="outline">
                            <Link href="/internal">
                                <span>2. Community vote</span>
                            </Link>
                        </Button>
                    </AnimatedGroup>
                    <p className="mt-4 text-xs text-muted-foreground">
                        Not attending?{" "}
                        <Link href="https://lu.ma/vtg473h3" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
                            Join the waitlist
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
