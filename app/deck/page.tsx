import type { Metadata } from "next";
import { EventDeck } from "@/components/event-deck";

export const metadata: Metadata = {
  title: "Hackathon LATAM Results | v0 Prompt to Production",
  description:
    "Results from Hackathon LATAM — 4 cities, 260+ registered, 92 attendees, 52 projects shipped in one day.",
};

export default function DeckPage() {
  return <EventDeck />;
}
