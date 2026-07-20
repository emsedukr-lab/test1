import type { MbtiProfile } from "@/types/mbti";
import type { Spread, Topic } from "@/types/reading";
import type { TarotCard } from "@/types/tarot";
import { dedupeSentences } from "./compose/dedupe";
import type { UsedSentenceRegistry } from "./compose/registry";

interface ScoredAction {
  text: string;
  score: number;
  /** 동점 시 안정 정렬용 */
  order: number;
}

/**
 * 행동 조언 최대 3개.
 * 점수: action 위치 +2, caution 위치 +1 / MBTI actionPreferences 부분 일치 +1씩 / 분야 명사 일치 +1
 */
export function generateActions(args: {
  cards: readonly TarotCard[];
  spread: Spread;
  topic: Topic;
  profile: MbtiProfile | null;
  registry: UsedSentenceRegistry;
  max?: number;
}): string[] {
  const { cards, spread, topic, profile, registry, max = 3 } = args;

  const candidates: ScoredAction[] = [];
  let order = 0;
  cards.forEach((card, positionIndex) => {
    const mode = spread.positions[positionIndex]?.interpretationMode ?? "light";
    const modeBonus = mode === "action" ? 2 : mode === "caution" ? 1 : 0;
    for (const action of card.suggestedActions) {
      let score = modeBonus;
      if (profile) {
        for (const pref of profile.actionPreferences) {
          if (action.includes(pref)) score += 1;
        }
      }
      if (topic.contextNouns.some((noun) => action.includes(noun))) score += 1;
      candidates.push({ text: action, score, order: order++ });
    }
  });

  const ranked = candidates
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((c) => c.text)
    // 카드 섹션(action 위치 보강 문장)에서 이미 쓴 행동은 제외
    .filter((text) => !registry.isDuplicate(text));

  const result = dedupeSentences(ranked).slice(0, max);
  for (const text of result) registry.add(text);
  return result;
}
