"use client";

import dynamic from "next/dynamic";

const Dither = dynamic(() => import("@/components/Dither"), { ssr: false });

export default function DitherBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
      <Dither enableMouseInteraction={false} />
    </div>
  );
}
