import HeroSection from "@/components/hero-section";
import Features from "@/components/features-3";
import Agenda from "@/components/agenda";
import CallToAction from "@/components/call-to-action";
import DitherBackground from "@/components/dither-background";

export default function Home() {
    return (
        <>
            <div className="relative">
                <DitherBackground />
                <HeroSection/>
            </div>
            <Features/>
            <Agenda/>
            <CallToAction/>
        </>
    )
}
