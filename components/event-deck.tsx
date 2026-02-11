"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { transitionVariants } from "@/lib/utils";
import V0Icon from "@/components/icons/v0-icon";
import CrafterStationIcon from "@/components/icons/crafter-station-icon";

const Dither = dynamic(() => import("@/components/Dither"), { ssr: false });

const slides = [
  { id: "title", label: "Title" },
  { id: "numbers", label: "Numbers" },
  { id: "cities", label: "Cities" },
  { id: "lima", label: "Lima" },
  { id: "medellin", label: "Medellin" },
  { id: "bogota", label: "Bogota" },
  { id: "arequipa", label: "Arequipa" },
  { id: "diversity", label: "Diversity" },
  { id: "photos", label: "Photos" },
  { id: "infographic", label: "Summary" },
  { id: "thanks", label: "Thanks" },
];

const CITIES = [
  {
    name: "Lima",
    country: "Peru",
    flag: "🇵🇪",
    registered: "60+",
    attendees: 34,
    projects: 20,
    women: 12,
    womenPct: "35%",
    venue: "UTEC Ventures, Barranco",
  },
  {
    name: "Medellin",
    country: "Colombia",
    flag: "🇨🇴",
    registered: "55+",
    attendees: 32,
    projects: 18,
    women: 11,
    womenPct: "34%",
    venue: "Ruta N",
  },
  {
    name: "Bogota",
    country: "Colombia",
    flag: "🇨🇴",
    registered: "45+",
    attendees: 26,
    projects: 14,
    women: 9,
    womenPct: "35%",
    venue: "Hub Asobancaria",
  },
  {
    name: "Arequipa",
    country: "Peru",
    flag: "🇵🇪",
    registered: "60+",
    attendees: 26,
    projects: 14,
    women: 0,
    womenPct: "—",
    venue: "UNSA",
  },
];

function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  delay = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  delay?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 1200;
      const steps = 40;
      const increment = value / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplay(value);
          clearInterval(interval);
        } else {
          setDisplay(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function EventDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [slideKey, setSlideKey] = useState(0);
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
        setSlideKey((k) => k + 1);
        setIsTransitioning(false);
      }, 300);
    },
    [currentSlide, isTransitioning]
  );

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1, "next");
    } else {
      goToSlide(0, "next");
    }
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1, "prev");
    } else {
      goToSlide(slides.length - 1, "prev");
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
      } else if (e.key === "Escape") {
        window.location.href = "/";
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
    <div className="fixed inset-0 z-50 bg-background overflow-hidden font-sans">
      {/* Dither background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <Dither enableMouseInteraction={false} />
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-border z-50">
        <div
          className="h-full bg-foreground transition-all duration-300 ease-out"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        />
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(i)}
            className={`
              group relative h-1.5 rounded-full transition-all duration-300
              ${i === currentSlide ? "w-8 bg-foreground" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"}
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

      {/* Keyboard hint */}
      <div className="absolute bottom-8 right-8 text-muted-foreground text-sm hidden md:flex items-center gap-4 z-50">
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-background/80 backdrop-blur-sm border border-border rounded-sm text-xs font-mono">
            &larr;
          </kbd>
          <kbd className="px-2 py-1 bg-background/80 backdrop-blur-sm border border-border rounded-sm text-xs font-mono">
            &rarr;
          </kbd>
          <span className="ml-1 font-mono text-xs">navigate</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-background/80 backdrop-blur-sm border border-border rounded-sm text-xs font-mono">
            esc
          </kbd>
          <span className="ml-1 font-mono text-xs">home</span>
        </span>
      </div>

      {/* Swipe hint (mobile) */}
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

      {/* Slide counter */}
      <div className="absolute top-6 right-8 text-muted-foreground font-mono text-sm z-50">
        {String(currentSlide + 1).padStart(2, "0")} /{" "}
        {String(slides.length).padStart(2, "0")}
      </div>

      {/* Back button */}
      <a
        href="/"
        className="absolute top-6 left-8 text-muted-foreground hover:text-foreground transition-colors z-50 flex items-center gap-2"
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

      {/* Slides */}
      <div className="relative w-full h-full cursor-pointer" onClick={nextSlide}>
        {/* Slide 1: Title */}
        {currentSlide === 0 && (
          <div className={slideClasses} key={`title-${slideKey}`}>
            <div className="text-center max-w-5xl relative z-10">
              <div className="flex items-center justify-center gap-3 mb-8">
                <V0Icon size={28} className="text-foreground" />
                <span className="text-muted-foreground font-mono text-sm">&times;</span>
                <CrafterStationIcon size={16} className="text-foreground" />
              </div>
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="text-balance text-5xl md:text-7xl lg:text-[9rem] font-medium leading-[0.9] tracking-tighter"
              >
                Prompt to
              </TextEffect>
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.2}
                as="h1"
                className="text-balance text-5xl md:text-7xl lg:text-[9rem] font-medium leading-[0.9] tracking-tighter"
              >
                Production
              </TextEffect>
              <div className="mt-10">
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="font-mono text-muted-foreground uppercase text-sm md:text-base tracking-widest"
                >
                  LATAM Results &middot; February 2026
                </TextEffect>
              </div>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.8}
                as="p"
                className="mt-3 text-muted-foreground/50 font-mono text-xs"
              >
                4 cities &middot; 260+ registered &middot; 52 projects shipped
              </TextEffect>
            </div>
          </div>
        )}

        {/* Slide 2: The Numbers */}
        {currentSlide === 1 && (
          <div className={slideClasses} key={`numbers-${slideKey}`}>
            <div className="max-w-5xl w-full relative z-10">
              <span className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
                The numbers
              </span>
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h2"
                className="mt-4 text-balance text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight"
              >
                One day. Four cities. Real impact.
              </TextEffect>
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: { staggerChildren: 0.1, delayChildren: 0.4 },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
              >
                <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8">
                  <p className="text-5xl md:text-7xl font-semibold font-mono tracking-tighter">
                    <AnimatedNumber value={4} delay={500} />
                  </p>
                  <p className="text-sm text-muted-foreground mt-3 font-mono">
                    cities
                  </p>
                </div>
                <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8">
                  <p className="text-5xl md:text-7xl font-semibold font-mono tracking-tighter">
                    <AnimatedNumber value={260} suffix="+" delay={650} />
                  </p>
                  <p className="text-sm text-muted-foreground mt-3 font-mono">
                    registered
                  </p>
                </div>
                <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8">
                  <p className="text-5xl md:text-7xl font-semibold font-mono tracking-tighter">
                    <AnimatedNumber value={92} delay={800} />
                  </p>
                  <p className="text-sm text-muted-foreground mt-3 font-mono">
                    attendees
                  </p>
                </div>
                <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8">
                  <p className="text-5xl md:text-7xl font-semibold font-mono tracking-tighter">
                    <AnimatedNumber value={52} delay={950} />
                  </p>
                  <p className="text-sm text-muted-foreground mt-3 font-mono">
                    projects shipped
                  </p>
                </div>
              </AnimatedGroup>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={1.5}
                as="p"
                className="mt-8 text-muted-foreground/60 font-mono text-sm text-center"
              >
                All in a single day.
              </TextEffect>
            </div>
          </div>
        )}

        {/* Slide 3: Cities Overview */}
        {currentSlide === 2 && (
          <div className={slideClasses} key={`cities-${slideKey}`}>
            <div className="max-w-5xl w-full relative z-10">
              <span className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
                By city
              </span>
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h2"
                className="mt-4 text-balance text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight"
              >
                Four cities, one mission
              </TextEffect>
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: { staggerChildren: 0.08, delayChildren: 0.4 },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {CITIES.map((city) => (
                  <div
                    key={city.name}
                    className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8 flex flex-col"
                  >
                    <div className="flex items-baseline justify-between mb-4">
                      <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                        {city.name}
                      </h3>
                      <span className="text-muted-foreground font-mono text-xs uppercase flex items-center gap-1.5">
                        <span className="text-base">{city.flag}</span>
                        {city.country}
                      </span>
                    </div>
                    <div className="flex items-end gap-6 mt-auto">
                      <div>
                        <p className="text-3xl md:text-4xl font-semibold font-mono tracking-tighter">
                          {city.registered}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                          registered
                        </p>
                      </div>
                      {city.attendees > 0 && (
                        <div>
                          <p className="text-3xl md:text-4xl font-semibold font-mono tracking-tighter">
                            {city.attendees}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono mt-1">
                            attended
                          </p>
                        </div>
                      )}
                      {city.projects > 0 && (
                        <div>
                          <p className="text-3xl md:text-4xl font-semibold font-mono tracking-tighter">
                            {city.projects}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono mt-1">
                            projects
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </AnimatedGroup>
            </div>
          </div>
        )}

        {/* Slide 4: Lima Deep Dive */}
        {currentSlide === 3 && (
          <div className={slideClasses} key={`lima-${slideKey}`}>
            <div className="max-w-4xl w-full relative z-10">
              <span className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
                🇵🇪 Lima, Peru
              </span>
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h2"
                className="mt-4 text-balance text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tight"
              >
                The flagship
              </TextEffect>
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: { staggerChildren: 0.1, delayChildren: 0.4 },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-10 grid grid-cols-3 gap-4 md:gap-6"
              >
                <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8 text-center">
                  <p className="text-4xl md:text-6xl font-semibold font-mono tracking-tighter">
                    <AnimatedNumber value={60} suffix="+" delay={500} />
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-3 font-mono">
                    registered
                  </p>
                </div>
                <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8 text-center">
                  <p className="text-4xl md:text-6xl font-semibold font-mono tracking-tighter">
                    <AnimatedNumber value={34} delay={650} />
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-3 font-mono">
                    attendees
                  </p>
                </div>
                <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8 text-center">
                  <p className="text-4xl md:text-6xl font-semibold font-mono tracking-tighter">
                    <AnimatedNumber value={20} delay={800} />
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-3 font-mono">
                    projects shipped
                  </p>
                </div>
              </AnimatedGroup>
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: { staggerChildren: 0.1, delayChildren: 1.2 },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-6 flex flex-col sm:flex-row gap-4"
              >
                <div className="flex-1 rounded-xl border border-dashed bg-background/30 backdrop-blur-sm p-5 flex items-center gap-4">
                  <p className="text-3xl md:text-4xl font-semibold font-mono tracking-tighter">
                    35%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    female participation — leading all cities
                  </p>
                </div>
                <div className="flex-1 rounded-xl border border-dashed bg-background/30 backdrop-blur-sm p-5">
                  <p className="text-sm text-muted-foreground font-mono">
                    UTEC Ventures, Barranco
                  </p>
                  <p className="text-xs text-muted-foreground/50 font-mono mt-1">
                    Saturday, February 7th
                  </p>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        )}

        {/* Slide 5: Medellin */}
        {currentSlide === 4 && (
          <div className={slideClasses} key={`medellin-${slideKey}`}>
            <div className="max-w-4xl w-full relative z-10">
              <span className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
                🇨🇴 Medellin, Colombia
              </span>
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h2"
                className="mt-4 text-balance text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tight"
              >
                Neck and neck
              </TextEffect>
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: { staggerChildren: 0.1, delayChildren: 0.4 },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-10 grid grid-cols-3 gap-4 md:gap-6"
              >
                <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8 text-center">
                  <p className="text-4xl md:text-6xl font-semibold font-mono tracking-tighter">
                    <AnimatedNumber value={55} suffix="+" delay={500} />
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-3 font-mono">
                    registered
                  </p>
                </div>
                <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8 text-center">
                  <p className="text-4xl md:text-6xl font-semibold font-mono tracking-tighter">
                    <AnimatedNumber value={32} delay={650} />
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-3 font-mono">
                    attendees
                  </p>
                </div>
                <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8 text-center">
                  <p className="text-4xl md:text-6xl font-semibold font-mono tracking-tighter">
                    <AnimatedNumber value={18} delay={800} />
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-3 font-mono">
                    projects shipped
                  </p>
                </div>
              </AnimatedGroup>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={1.2}
                as="p"
                className="mt-8 text-muted-foreground/60 font-mono text-sm text-center"
              >
                Numbers nearly identical to Lima — strong showing from Colombia.
              </TextEffect>
            </div>
          </div>
        )}

        {/* Slide 6: Bogota */}
        {currentSlide === 5 && (
          <div className={slideClasses} key={`bogota-${slideKey}`}>
            <div className="max-w-4xl w-full relative z-10">
              <span className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
                🇨🇴 Bogota, Colombia
              </span>
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h2"
                className="mt-4 text-balance text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tight"
              >
                Closing strong
              </TextEffect>
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: { staggerChildren: 0.1, delayChildren: 0.4 },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-10 grid grid-cols-3 gap-4 md:gap-6"
              >
                <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8 text-center">
                  <p className="text-4xl md:text-6xl font-semibold font-mono tracking-tighter">
                    <AnimatedNumber value={45} suffix="+" delay={500} />
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-3 font-mono">
                    registered
                  </p>
                </div>
                <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8 text-center">
                  <p className="text-4xl md:text-6xl font-semibold font-mono tracking-tighter">
                    <AnimatedNumber value={26} delay={650} />
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-3 font-mono">
                    attendees
                  </p>
                </div>
                <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8 text-center">
                  <p className="text-4xl md:text-6xl font-semibold font-mono tracking-tighter">
                    <AnimatedNumber value={14} delay={800} />
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-3 font-mono">
                    projects shipped
                  </p>
                </div>
              </AnimatedGroup>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={1.2}
                as="p"
                className="mt-8 text-muted-foreground/60 font-mono text-sm text-center"
              >
                Solid turnout. 14 projects shipped with 26 builders.
              </TextEffect>
            </div>
          </div>
        )}

        {/* Slide 7: Arequipa */}
        {currentSlide === 6 && (
          <div className={slideClasses} key={`arequipa-${slideKey}`}>
            <div className="max-w-4xl w-full relative z-10">
              <span className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
                🇵🇪 Arequipa, Peru
              </span>
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h2"
                className="mt-4 text-balance text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tight"
              >
                The white city
              </TextEffect>
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: { staggerChildren: 0.1, delayChildren: 0.4 },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-10 grid grid-cols-3 gap-4 md:gap-6"
              >
                <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8 text-center">
                  <p className="text-4xl md:text-6xl font-semibold font-mono tracking-tighter">
                    <AnimatedNumber value={60} suffix="+" delay={500} />
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-3 font-mono">
                    registered
                  </p>
                </div>
                <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8 text-center">
                  <p className="text-4xl md:text-6xl font-semibold font-mono tracking-tighter">
                    <AnimatedNumber value={26} delay={650} />
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-3 font-mono">
                    attendees
                  </p>
                </div>
                <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-6 md:p-8 text-center">
                  <p className="text-4xl md:text-6xl font-semibold font-mono tracking-tighter">
                    <AnimatedNumber value={14} delay={800} />
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-3 font-mono">
                    projects shipped
                  </p>
                </div>
              </AnimatedGroup>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={1.2}
                as="p"
                className="mt-8 text-muted-foreground/60 font-mono text-sm text-center"
              >
                Strong turnout from Peru's second city.
              </TextEffect>
            </div>
          </div>
        )}

        {/* Slide 8: Diversity */}
        {currentSlide === 7 && (
          <div className={slideClasses} key={`diversity-${slideKey}`}>
            <div className="max-w-4xl text-center relative z-10">
              <span className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
                The standout metric
              </span>
              <div className="mt-8">
                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="p"
                  className="text-7xl md:text-9xl lg:text-[12rem] font-semibold font-mono tracking-tighter leading-none"
                >
                  34%
                </TextEffect>
              </div>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.4}
                as="p"
                className="mt-6 text-xl md:text-2xl text-muted-foreground"
              >
                average female participation across all cities
              </TextEffect>
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: { staggerChildren: 0.1, delayChildren: 0.8 },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-12 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
              >
                <div className="flex-1 rounded-xl border bg-background/50 backdrop-blur-sm p-6">
                  <p className="text-4xl md:text-5xl font-semibold font-mono tracking-tighter">
                    35%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Lima — 12 of 34 attendees
                  </p>
                </div>
                <div className="flex-1 rounded-xl border border-dashed bg-background/30 backdrop-blur-sm p-6">
                  <p className="text-4xl md:text-5xl font-semibold font-mono tracking-tighter text-muted-foreground">
                    32
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    women builders total across all events
                  </p>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        )}

        {/* Slide 9: Photos */}
        {currentSlide === 8 && (
          <div className={slideClasses} key={`photos-${slideKey}`}>
            <div className="max-w-4xl text-center relative z-10">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h2"
                className="text-balance text-5xl md:text-7xl lg:text-8xl font-medium leading-tight tracking-tight"
              >
                See it yourself
              </TextEffect>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.3}
                as="p"
                className="mt-6 text-lg md:text-xl text-muted-foreground"
              >
                Event photos from all four cities.
              </TextEffect>
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: { staggerChildren: 0.05, delayChildren: 0.6 },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-12"
              >
                <a
                  href="https://devshots.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors text-lg font-mono"
                >
                  devshots.vercel.app
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
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
              </AnimatedGroup>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.9}
                as="p"
                className="mt-8 text-muted-foreground/50 font-mono text-xs"
              >
                Lima &middot; Medellin &middot; Bogota &middot; Arequipa
              </TextEffect>
            </div>
          </div>
        )}

        {/* Slide 10: Infographic */}
        {currentSlide === 9 && (
          <div className={slideClasses} key={`infographic-${slideKey}`}>
            <div className="max-w-3xl w-full relative z-10 bg-background/80 backdrop-blur-md border rounded-2xl p-8 md:p-12">
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-dashed">
                <div className="flex items-center gap-3">
                  <V0Icon size={22} className="text-foreground" />
                  <span className="text-muted-foreground font-mono text-xs">&times;</span>
                  <CrafterStationIcon size={12} className="text-foreground" />
                </div>
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Feb 2026
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Prompt to Production
              </h2>
              <p className="text-muted-foreground font-mono text-sm mt-1">
                LATAM Results
              </p>

              {/* Big numbers row */}
              <div className="grid grid-cols-4 gap-4 mt-8">
                <div>
                  <p className="text-3xl md:text-5xl font-semibold font-mono tracking-tighter">4</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">cities</p>
                </div>
                <div>
                  <p className="text-3xl md:text-5xl font-semibold font-mono tracking-tighter">260+</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">registered</p>
                </div>
                <div>
                  <p className="text-3xl md:text-5xl font-semibold font-mono tracking-tighter">92</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">attendees</p>
                </div>
                <div>
                  <p className="text-3xl md:text-5xl font-semibold font-mono tracking-tighter">52</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">projects</p>
                </div>
              </div>

              {/* City breakdown */}
              <div className="mt-8 pt-6 border-t border-dashed">
                <div className="grid grid-cols-4 gap-4 mb-3">
                  <span className="text-xs text-muted-foreground font-mono">City</span>
                  <span className="text-xs text-muted-foreground font-mono text-right">Reg.</span>
                  <span className="text-xs text-muted-foreground font-mono text-right">Att.</span>
                  <span className="text-xs text-muted-foreground font-mono text-right">Projects</span>
                </div>
                {[
                  { flag: "🇵🇪", name: "Lima", reg: "60+", att: "34", proj: "20" },
                  { flag: "🇨🇴", name: "Medellin", reg: "55+", att: "32", proj: "18" },
                  { flag: "🇨🇴", name: "Bogota", reg: "45+", att: "26", proj: "14" },
                  { flag: "🇵🇪", name: "Arequipa", reg: "60+", att: "26", proj: "14" },
                ].map((city) => (
                  <div key={city.name} className="grid grid-cols-4 gap-4 py-2 border-t border-border/50">
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      <span className="text-base">{city.flag}</span>
                      {city.name}
                    </span>
                    <span className="text-sm font-mono text-right">{city.reg}</span>
                    <span className="text-sm font-mono text-right">{city.att}</span>
                    <span className="text-sm font-mono text-right">{city.proj}</span>
                  </div>
                ))}
              </div>

              {/* Diversity highlight */}
              <div className="mt-6 pt-6 border-t border-dashed flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Female participation</p>
                  <p className="text-xs text-muted-foreground/60 font-mono mt-0.5">
                    Lima leading at 35% (12 of 34)
                  </p>
                </div>
                <p className="text-4xl md:text-5xl font-semibold font-mono tracking-tighter">34%</p>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-dashed flex items-center justify-between">
                <p className="text-muted-foreground/50 font-mono text-xs">
                  devshots.vercel.app
                </p>
                <p className="text-muted-foreground/50 font-mono text-xs">
                  Hosted by Crafter Station &middot; Powered by Vercel
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Slide 11: Thanks */}
        {currentSlide === 10 && (
          <div className={slideClasses} key={`thanks-${slideKey}`}>
            <div className="max-w-4xl text-center relative z-10">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h2"
                className="text-balance text-5xl md:text-7xl lg:text-8xl font-medium leading-tight tracking-tight"
              >
                Thanks for building
              </TextEffect>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.3}
                as="p"
                className="mt-4 text-lg md:text-xl text-muted-foreground"
              >
                92 builders. 52 projects. 4 cities. 1 day.
              </TextEffect>
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: { staggerChildren: 0.05, delayChildren: 0.6 },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-12 flex flex-wrap justify-center gap-3"
              >
                <a
                  href="https://github.com/crafter-station"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2.5 px-5 py-3 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors text-sm"
                >
                  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
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
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2.5 px-5 py-3 border border-border text-foreground font-medium rounded-lg hover:border-foreground/30 transition-colors text-sm"
                >
                  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X / Twitter
                </a>
                <a
                  href="https://devshots.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2.5 px-5 py-3 border border-border text-foreground font-medium rounded-lg hover:border-foreground/30 transition-colors text-sm font-mono"
                >
                  Event Photos
                </a>
              </AnimatedGroup>
              <div className="mt-12 pt-6 border-t border-dashed">
                <div className="flex items-center justify-center gap-3">
                  <CrafterStationIcon size={14} className="text-muted-foreground" />
                  <p className="text-muted-foreground font-mono text-sm">
                    Hosted by Crafter Station &middot; Powered by Vercel
                  </p>
                </div>
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
          absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-lg
          transition-all z-50
          ${currentSlide === 0 ? "opacity-20 cursor-not-allowed" : "opacity-60 hover:opacity-100 hover:bg-background/50 hover:backdrop-blur-sm"}
        `}
        aria-label="Previous slide"
      >
        <svg
          className="size-6 md:size-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
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
          absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-lg
          transition-all z-50
          ${currentSlide === slides.length - 1 ? "opacity-20 cursor-not-allowed" : "opacity-60 hover:opacity-100 hover:bg-background/50 hover:backdrop-blur-sm"}
        `}
        aria-label="Next slide"
      >
        <svg
          className="size-6 md:size-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
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
