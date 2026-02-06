import {TextEffect} from "@/components/motion-primitives/text-effect";
import React from "react";
import {transitionVariants} from "@/lib/utils";
import {AnimatedGroup} from "@/components/motion-primitives/animated-group";

export default function Agenda() {
    return (
        <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-y-12 px-2 lg:grid-cols-[1fr_auto]">
                    <div className="text-center lg:text-left">
                        <TextEffect
                            triggerOnView
                            preset="fade-in-blur"
                            speedSegment={0.3}
                            as="h2"
                            className="mb-4 text-3xl font-semibold md:text-4xl">
                            Agenda
                        </TextEffect>
                    </div>

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
                        className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0"
                    >
                        <div className="pb-6">
                            <div className="font-medium space-x-2">
                                <span className='text-muted-foreground font-mono '>09:30</span>
                                <span>Doors open & check-in</span>
                            </div>
                            <p className="text-muted-foreground mt-4">Arrive at UTEC Ventures, Barranco. Get settled and meet other builders.</p>
                        </div>
                        <div className="py-6">
                            <div className="font-medium space-x-2">
                                <span className='text-muted-foreground font-mono '>10:00</span>
                                <span>Quick kickoff & framing</span>
                            </div>
                            <p className="text-muted-foreground mt-4">Welcome, event rules, and inspiration tracks overview.</p>
                        </div>
                        <div className="py-6">
                            <div className="font-medium space-x-2">
                                <span className='text-muted-foreground font-mono '>10:15</span>
                                <span>Build session</span>
                            </div>
                            <p className="text-muted-foreground mt-4">Hands-on building with v0. Work solo or in a small team.</p>
                        </div>
                        <div className="py-6">
                            <div className="font-medium space-x-2">
                                <span className='text-muted-foreground font-mono '>12:00</span>
                                <span>Deploy, submit & demos</span>
                            </div>
                            <p className="text-muted-foreground mt-4">Deploy your project, submit to the global showcase, and optional short demos.</p>
                        </div>
                        <div className="py-6">
                            <div className="font-medium space-x-2">
                                <span className='text-muted-foreground font-mono '>12:30</span>
                                <span>Wrap up</span>
                            </div>
                            <p className="text-muted-foreground mt-4">Networking, photo time, and event close.</p>
                        </div>
                    </AnimatedGroup>
                </div>
            </div>
        </section>
    )
}
