import { CLOSINGS, type ClosingContext } from "@/data/templates/closings";
import { OPENINGS, type OpeningContext } from "@/data/templates/openings";
import type { MbtiProfile } from "@/types/mbti";
import type {
  CardReadingSection,
  CombinationInsight,
  ReadingResult,
  SafetyCheckResult,
  Spread,
  Topic,
} from "@/types/reading";
import type { TarotCard } from "@/types/tarot";
import type { MbtiAdjustedSection } from "../apply-mbti-profile";
import type { Rng } from "../rng";
import { dedupeSentences } from "./dedupe";
import type { UsedSentenceRegistry } from "./registry";
import { pickVariant } from "./sentence-bank";

/** light/caution 위치 카드에서 강점·주의점 하이라이트 추출 (최대 2개) */
function pickHighlights(
  cards: readonly TarotCard[],
  spread: Spread,
  topic: Topic,
  field: "strengths" | "cautions",
  wantedMode: "light" | "caution",
): string[] {
  const fromWanted: string[] = [];
  const fromOthers: string[] = [];
  cards.forEach((card, i) => {
    const mode = spread.positions[i]?.interpretationMode ?? "light";
    (mode === wantedMode ? fromWanted : fromOthers).push(...card[field]);
  });
  const pool = [...fromWanted, ...fromOthers];
  const scored = pool
    .map((text, order) => ({
      text,
      order,
      score: topic.contextNouns.some((n) => text.includes(n)) ? 1 : 0,
    }))
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((s) => s.text);
  return dedupeSentences(scored).slice(0, 2);
}

export function assembleReading(parts: {
  topic: Topic;
  spread: Spread;
  profile: MbtiProfile | null;
  safety: SafetyCheckResult;
  mbtiLens: string | null;
  sections: readonly MbtiAdjustedSection[];
  cards: readonly TarotCard[];
  keywords: readonly string[];
  combos: readonly CombinationInsight[];
  actions: readonly string[];
  questions: readonly string[];
  rng: Rng;
  registry: UsedSentenceRegistry;
  seed: number;
  cardIds: readonly string[];
  reversedFlags: readonly boolean[];
  mbti: MbtiProfile["type"] | null;
}): ReadingResult {
  const {
    topic,
    spread,
    safety,
    mbtiLens,
    sections,
    cards,
    keywords,
    combos,
    actions,
    questions,
    rng,
    registry,
    seed,
    cardIds,
    reversedFlags,
    mbti,
  } = parts;

  const openingCtx: OpeningContext = {
    topicNameKo: topic.nameKo,
    contextNoun: rng.pick(topic.contextNouns),
    firstKeyword: keywords[0],
    lastKeyword: keywords[keywords.length - 1],
    cardCount: cards.length,
  };
  const opening = pickVariant(OPENINGS, openingCtx, rng, registry);

  const cardSections: CardReadingSection[] = sections.map((section, i) => {
    const card = cards[i];
    const position = spread.positions[i];
    const reversed = reversedFlags[i];
    const para2 = section.bridge ? `${section.modifier} ${section.bridge}` : section.modifier;
    return {
      cardId: card.id,
      cardNameKo: card.nameKo,
      positionTitle: position.titleKo,
      mode: position.interpretationMode,
      reversed,
      headline: `${position.titleKo} — ${card.nameKo}${reversed ? " (역방향)" : ""}`,
      paragraphs: [`${section.frame} ${section.body}`, para2],
    };
  });

  const closingCtx: ClosingContext = {
    cardNameKo: cards[0].nameKo,
    keyword: keywords[0],
    contextNoun: rng.pick(topic.contextNouns),
  };
  const closing = pickVariant(CLOSINGS, closingCtx, rng, registry);

  return {
    meta: { topicId: topic.id, spreadId: spread.id, mbti, cardIds, reversedFlags, seed },
    safety,
    opening,
    mbtiLens,
    cardSections,
    combinationInsights: combos,
    strengthsHighlight: pickHighlights(cards, spread, topic, "strengths", "light"),
    cautionsHighlight: pickHighlights(cards, spread, topic, "cautions", "caution"),
    actions,
    reflectionQuestions: questions,
    closing,
  };
}
