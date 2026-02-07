import type { Metadata } from "next";
import { EventDeck } from "@/components/event-deck";

export const metadata: Metadata = {
  title: "Event Deck | v0 Prompt to Production - Lima",
  description:
    "Presentation deck for v0 Prompt to Production Lima build session.",
};

export default function DeckPage() {
  return <EventDeck />;
}
