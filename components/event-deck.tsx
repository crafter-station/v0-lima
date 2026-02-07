"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const slides = [
  { id: "intro", label: "Intro" },
  { id: "context", label: "Context" },
  { id: "hosts", label: "Hosts" },
  { id: "agenda", label: "Agenda" },
  { id: "tracks", label: "Tracks" },
  { id: "rules", label: "Rules" },
  { id: "v0", label: "v0" },
  { id: "build", label: "Build" },
  { id: "submit", label: "Submit" },
  { id: "thanks", label: "Thanks" },
];

const AGENDA_ITEMS = [
  { time: "9:30", label: "Walk-in & warm-up", duration: "20 min" },
  { time: "9:50", label: "Kickoff & context", duration: "20 min" },
  { time: "10:10", label: "Form groups", duration: "10 min" },
  { time: "10:20", label: "v0 demo", duration: "10 min" },
  { time: "10:30", label: "Build time \u2014 Block 1", duration: "60 min" },
  { time: "11:30", label: "Break + checkpoint", duration: "10 min" },
  { time: "11:40", label: "Build time \u2014 Final block", duration: "20 min" },
  { time: "12:00", label: "Ship & submit", duration: "10 min" },
  { time: "12:10", label: "Gallery walk", duration: "15 min" },
  { time: "12:25", label: "Closing & group photo", duration: "5 min" },
];

const TRACKS = [
  { name: "GTM", tagline: "Close deals faster with AI-powered tools" },
  { name: "Marketing", tagline: "Turn ideas into campaigns that ship" },
  { name: "Product", tagline: "From PRD to prototype in one session" },
  { name: "Design", tagline: "Refine layouts and maintain systems" },
  { name: "Dev", tagline: "Unblock stakeholders, automate the tedious" },
  { name: "Data & Ops", tagline: "Automate reporting and surface insights" },
];

const HOSTS = [
  { name: "Railly Hugo", role: "Founder, Crafter Station" },
  { name: "Shiara Arauzo", role: "Design Engineer" },
  { name: "Edward Ramos", role: "Community Lead" },
];

export function EventDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const goToSlide = useCallback(
    (index: number, dir?: "next" | "prev") => {
      if (isTransitioning || index === currentSlide) return;
      if (index < 0 || index >= slides.length) return;

      setDirection(dir || (index > currentSlide ? "next" : "prev"));
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 300);
    },
    [currentSlide, isTransitioning]
  );

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1, "next");
    }
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1, "prev");
    }
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Home") {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goToSlide(slides.length - 1);
      } else if (e.key >= "1" && e.key <= "9") {
        const index = parseInt(e.key) - 1;
        if (index < slides.length) {
          e.preventDefault();
          goToSlide(index);
        }
      } else if (e.key === "0") {
        e.preventDefault();
        goToSlide(9);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [nextSlide, prevSlide]);

  const slideClasses = `
    absolute inset-0 flex items-center justify-center p-8 md:p-16
    transition-all duration-500 ease-out
    ${isTransitioning ? (direction === "next" ? "opacity-0 translate-x-12" : "opacity-0 -translate-x-12") : "opacity-100 translate-x-0"}
  `;

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-foreground/5 via-transparent to-transparent rotate-12 animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-foreground/3 via-transparent to-transparent -rotate-12 animate-pulse"
          style={{ animationDuration: "6s" }}
        />
      </div>

      <div className="absolute top-0 left-0 right-0 h-1 bg-muted z-50">
        <div
          className="h-full bg-foreground transition-all duration-300 ease-out"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(i)}
            className={`
              group relative h-2 transition-all duration-300
              ${i === currentSlide ? "w-8 bg-foreground" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"}
            `}
            aria-label={`Go to slide ${i + 1}: ${slide.label}`}
          >
            <span
              className={`
              absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono whitespace-nowrap
              transition-opacity duration-200
              ${i === currentSlide ? "opacity-100 text-foreground" : "opacity-0 group-hover:opacity-100 text-muted-foreground"}
            `}
            >
              {slide.label}
            </span>
          </button>
        ))}
      </div>

      <div className="absolute bottom-8 right-8 text-muted-foreground text-sm hidden md:flex items-center gap-4 z-50">
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-muted border border-border text-xs font-mono">
            &larr;
          </kbd>
          <kbd className="px-2 py-1 bg-muted border border-border text-xs font-mono">
            &rarr;
          </kbd>
          <span className="ml-1 font-mono text-xs">navigate</span>
        </span>
      </div>

      <div className="absolute bottom-8 right-8 text-muted-foreground text-xs flex md:hidden items-center gap-2 z-50">
        <svg
          className="size-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
          />
        </svg>
        <span className="font-mono">swipe</span>
      </div>

      <div className="absolute top-8 right-8 text-muted-foreground font-mono text-sm z-50">
        {String(currentSlide + 1).padStart(2, "0")} /{" "}
        {String(slides.length).padStart(2, "0")}
      </div>

      <a
        href="/"
        className="absolute top-8 left-8 text-muted-foreground hover:text-foreground transition-colors z-50 flex items-center gap-2"
      >
        <svg
          className="size-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        <span className="hidden md:inline text-sm font-mono">Back</span>
      </a>

      <div className="relative w-full h-full">
        {/* Slide 1: Intro */}
        {currentSlide === 0 && (
          <div className={slideClasses}>
            <div className="text-center max-w-5xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted border border-border mb-8">
                <span className="size-2 bg-foreground rounded-full animate-pulse" />
                <span className="text-sm text-foreground font-mono">
                  Lima Build Session
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-foreground leading-[0.9] tracking-tighter">
                PROMPT
                <br />
                <span className="text-muted-foreground">TO PRODUCTION</span>
              </h1>
              <div className="mt-8 space-y-2">
                <p className="text-xl md:text-2xl text-muted-foreground font-mono">
                  Saturday February 7th, 2026
                </p>
                <p className="text-lg text-muted-foreground/70 font-mono">
                  UTEC Ventures, Barranco
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 2: Context */}
        {currentSlide === 1 && (
          <div className={slideClasses}>
            <div className="max-w-4xl">
              <p className="text-foreground text-lg font-mono mb-4">
                What is this?
              </p>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-8">
                v0 Prompt to{" "}
                <span className="text-muted-foreground">Production Week</span>
              </h2>
              <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
                <p>
                  A global build week by Vercel. Build real apps with v0 and
                  submit to the community gallery.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 p-6 bg-muted border border-border">
                    <p className="text-4xl font-bold text-foreground font-mono">
                      6
                    </p>
                    <p className="text-sm mt-1">events across Latin America</p>
                  </div>
                  <div className="flex-1 p-6 bg-muted border border-border">
                    <p className="text-4xl font-bold text-foreground font-mono">
                      4
                    </p>
                    <p className="text-sm mt-1">
                      hosted by Crafter Station
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 3: Hosts */}
        {currentSlide === 2 && (
          <div className={slideClasses}>
            <div className="max-w-4xl w-full">
              <p className="text-foreground text-lg font-mono mb-4 text-center">
                Your hosts for today
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-12">
                Meet the team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {HOSTS.map((host) => (
                  <div
                    key={host.name}
                    className="p-8 bg-muted border border-border text-center"
                  >
                    <div className="size-16 bg-background border border-border flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl font-bold text-foreground font-mono">
                        {host.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {host.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono">
                      {host.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Slide 4: Agenda */}
        {currentSlide === 3 && (
          <div className={slideClasses}>
            <div className="max-w-4xl w-full">
              <p className="text-foreground text-lg font-mono mb-4 text-center">
                Schedule
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-10">
                Agenda
              </h2>
              <div className="space-y-0">
                {AGENDA_ITEMS.map((item, i) => (
                  <div
                    key={item.time}
                    className={`flex items-center gap-4 md:gap-6 py-3 ${i !== AGENDA_ITEMS.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <span className="text-foreground font-mono text-sm md:text-base w-14 shrink-0">
                      {item.time}
                    </span>
                    <span className="text-foreground text-sm md:text-base flex-1">
                      {item.label}
                    </span>
                    <span className="text-muted-foreground font-mono text-xs shrink-0">
                      {item.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Slide 5: Tracks */}
        {currentSlide === 4 && (
          <div className={slideClasses}>
            <div className="max-w-5xl w-full">
              <p className="text-foreground text-lg font-mono mb-4 text-center">
                Pick your track
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-4">
                Tracks
              </h2>
              <p className="text-muted-foreground text-center mb-10 font-mono text-sm">
                Tracks are guidance, not rules.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {TRACKS.map((track) => (
                  <div
                    key={track.name}
                    className="p-6 bg-muted border border-border hover:border-foreground/20 transition-colors"
                  >
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {track.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {track.tagline}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Slide 6: Rules */}
        {currentSlide === 5 && (
          <div className={slideClasses}>
            <div className="max-w-4xl">
              <p className="text-foreground text-lg font-mono mb-4">
                Ground rules
              </p>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-12">
                How we <span className="text-muted-foreground">roll</span>
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="size-12 bg-muted border border-border flex items-center justify-center shrink-0">
                    <span className="text-foreground font-bold text-xl font-mono">
                      01
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      Ship &gt; perfecto
                    </h3>
                    <p className="text-muted-foreground">
                      Done is better than perfect. Get it live.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="size-12 bg-muted border border-border flex items-center justify-center shrink-0">
                    <span className="text-foreground font-bold text-xl font-mono">
                      02
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      Solo or in groups
                    </h3>
                    <p className="text-muted-foreground">
                      Build alone or team up (3-4 people max).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="size-12 bg-muted border border-border flex items-center justify-center shrink-0">
                    <span className="text-foreground font-bold text-xl font-mono">
                      03
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      Publish on X / LinkedIn
                    </h3>
                    <p className="text-muted-foreground">
                      Share what you build. Build in public.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="size-12 bg-muted border border-border flex items-center justify-center shrink-0">
                    <span className="text-foreground font-bold text-xl font-mono">
                      04
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      $10 v0 credits
                    </h3>
                    <p className="text-muted-foreground">
                      Every participant gets $10 in v0 credits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 7: v0 */}
        {currentSlide === 6 && (
          <div className={slideClasses}>
            <div className="max-w-4xl text-center">
              <p className="text-foreground text-lg font-mono mb-4">
                The tool
              </p>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-tight mb-8">
                v0
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10">
                Prompt &rarr; production-ready UI in seconds.
                <br />
                Built by Vercel. Powered by AI.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="p-5 bg-muted border border-border">
                  <p className="font-mono text-foreground font-bold mb-1">
                    Prompt
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Describe what you want
                  </p>
                </div>
                <div className="p-5 bg-muted border border-border">
                  <p className="font-mono text-foreground font-bold mb-1">
                    Generate
                  </p>
                  <p className="text-sm text-muted-foreground">
                    AI builds the UI
                  </p>
                </div>
                <div className="p-5 bg-muted border border-border">
                  <p className="font-mono text-foreground font-bold mb-1">
                    Ship
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Deploy to production
                  </p>
                </div>
              </div>
              <a
                href="https://v0.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-8 font-mono text-muted-foreground hover:text-foreground transition-colors underline"
              >
                v0.dev &rarr;
              </a>
            </div>
          </div>
        )}

        {/* Slide 8: Build Time */}
        {currentSlide === 7 && (
          <div className={slideClasses}>
            <div className="text-center max-w-4xl">
              <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-foreground leading-[0.9] tracking-tighter">
                TIME TO
                <br />
                <span className="text-muted-foreground">BUILD</span>
              </h2>
              <div className="mt-12 space-y-4">
                <p className="text-lg md:text-xl text-muted-foreground">
                  +10 min stuck? Ask for help.
                </p>
                <p className="text-muted-foreground/70 font-mono text-sm">
                  Hosts are here to support you.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 9: Submit */}
        {currentSlide === 8 && (
          <div className={slideClasses}>
            <div className="max-w-4xl">
              <p className="text-foreground text-lg font-mono mb-4">
                Ship it
              </p>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-12">
                Submit your{" "}
                <span className="text-muted-foreground">build</span>
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="size-12 bg-foreground text-background flex items-center justify-center shrink-0">
                    <span className="font-bold text-xl font-mono">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      Submit to v0 global showcase
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Your project competes globally with builders worldwide.
                    </p>
                    <a
                      href="https://v0-v0prompttoproduction2026.vercel.app/submit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-muted-foreground hover:text-foreground underline transition-colors"
                    >
                      v0prompttoproduction.vercel.app/submit &rarr;
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="size-12 bg-foreground text-background flex items-center justify-center shrink-0">
                    <span className="font-bold text-xl font-mono">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      Submit to community vote
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      The Lima community votes on best projects.
                    </p>
                    <a
                      href="https://v0.crafter.run/internal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-muted-foreground hover:text-foreground underline transition-colors"
                    >
                      v0.crafter.run/internal &rarr;
                    </a>
                  </div>
                </div>
              </div>
              <p className="mt-10 text-muted-foreground/70 font-mono text-sm text-center">
                Submit to both for maximum visibility.
              </p>
            </div>
          </div>
        )}

        {/* Slide 10: Thanks */}
        {currentSlide === 9 && (
          <div className={slideClasses}>
            <div className="max-w-4xl text-center">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-tight mb-6">
                Thanks for
                <br />
                <span className="text-muted-foreground">building</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12">
                Group photo time!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://github.com/crafter-station"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-4 bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors font-mono text-sm"
                >
                  <svg
                    className="size-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://x.com/CrafterStation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-4 border border-border text-foreground font-semibold hover:border-foreground/50 transition-colors font-mono text-sm"
                >
                  <svg
                    className="size-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X / Twitter
                </a>
                <a
                  href="https://v0.crafter.run"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-4 border border-border text-foreground font-semibold hover:border-foreground/50 transition-colors font-mono text-sm"
                >
                  v0.crafter.run
                </a>
              </div>
              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-muted-foreground font-mono text-sm">
                  Hosted by Crafter Station &middot; Powered by Vercel
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        disabled={currentSlide === 0}
        className={`
          absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3
          transition-all z-50
          ${currentSlide === 0 ? "opacity-20 cursor-not-allowed" : "opacity-100 hover:bg-muted hover:text-foreground"}
        `}
        aria-label="Previous slide"
      >
        <svg
          className="size-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        disabled={currentSlide === slides.length - 1}
        className={`
          absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3
          transition-all z-50
          ${currentSlide === slides.length - 1 ? "opacity-20 cursor-not-allowed" : "opacity-100 hover:bg-muted hover:text-foreground"}
        `}
        aria-label="Next slide"
      >
        <svg
          className="size-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}
