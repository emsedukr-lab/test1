import { MAJOR_CARDS_A } from "./major-a";
import { MAJOR_CARDS_B } from "./major-b";
import { WANDS_CARDS } from "./wands";
import { CUPS_CARDS } from "./cups";
import { SWORDS_CARDS } from "./swords";
import { PENTACLES_CARDS } from "./pentacles";
import type { MajorCard, TarotCard } from "@/types/tarot";

export const MAJOR_CARDS: readonly MajorCard[] = [...MAJOR_CARDS_A, ...MAJOR_CARDS_B];

export const ALL_CARDS: readonly TarotCard[] = [
  ...MAJOR_CARDS,
  ...WANDS_CARDS,
  ...CUPS_CARDS,
  ...SWORDS_CARDS,
  ...PENTACLES_CARDS,
];

export const CARDS_BY_ID: ReadonlyMap<string, TarotCard> = new Map(
  ALL_CARDS.map((c) => [c.id, c]),
);

export const CARDS_BY_SLUG: ReadonlyMap<string, TarotCard> = new Map(
  ALL_CARDS.map((c) => [c.slug, c]),
);

export function getCardById(id: string): TarotCard | undefined {
  return CARDS_BY_ID.get(id);
}

export function getCardBySlug(slug: string): TarotCard | undefined {
  return CARDS_BY_SLUG.get(slug);
}
