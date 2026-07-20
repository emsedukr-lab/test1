import type { Topic } from "@/types/reading";
import type { TarotCard } from "@/types/tarot";
import type { Rng } from "./rng";

export interface SelectedMeaning {
  /** card[topic.cardMeaningField] — 완결문 그대로 */
  primary: string;
  light: string;
  shadow: string;
  /** rng로 뽑은 대표 키워드 1개 (템플릿 삽입용) */
  keyword: string;
}

export function selectCardMeaning(card: TarotCard, topic: Topic, rng: Rng): SelectedMeaning {
  return {
    primary: card[topic.cardMeaningField],
    light: card.lightMeaning,
    shadow: card.shadowMeaning,
    keyword: rng.pick(card.keywords),
  };
}
