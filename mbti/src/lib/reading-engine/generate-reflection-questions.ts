import type { Spread, Topic } from "@/types/reading";
import type { TarotCard } from "@/types/tarot";
import { dedupeSentences } from "./compose/dedupe";
import type { UsedSentenceRegistry } from "./compose/registry";

interface ScoredQuestion {
  text: string;
  score: number;
  order: number;
}

/**
 * 자기성찰 질문 정확히 count개 (기본 3).
 * caution 위치 카드의 질문 우선(+2), 분야 명사 일치 +1.
 * 후보 부족 시 분야 추천 질문으로 보충.
 */
export function generateReflectionQuestions(args: {
  cards: readonly TarotCard[];
  spread: Spread;
  topic: Topic;
  registry: UsedSentenceRegistry;
  count?: number;
}): string[] {
  const { cards, spread, topic, registry, count = 3 } = args;

  const candidates: ScoredQuestion[] = [];
  let order = 0;
  cards.forEach((card, positionIndex) => {
    const mode = spread.positions[positionIndex]?.interpretationMode ?? "light";
    const modeBonus = mode === "caution" ? 2 : 0;
    for (const question of card.reflectionQuestions) {
      let score = modeBonus;
      if (topic.contextNouns.some((noun) => question.includes(noun))) score += 1;
      candidates.push({ text: question, score, order: order++ });
    }
  });

  const ranked = candidates
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((c) => c.text)
    .filter((text) => !registry.isDuplicate(text));

  let result = dedupeSentences(ranked).slice(0, count);

  // 보충: 분야 추천 질문 (역시 중복 제거)
  if (result.length < count) {
    const fallback = topic.recommendedQuestions.filter(
      (q) => !registry.isDuplicate(q) && !result.includes(q),
    );
    result = dedupeSentences([...result, ...fallback]).slice(0, count);
  }

  for (const text of result) registry.add(text);
  return result;
}
