import { CARDS_BY_ID } from "@/data/cards";
import { SPREADS } from "@/data/spreads";
import { TOPICS } from "@/data/topics";
import { isMbtiType } from "@/types/mbti";
import type { ReadingInput, Spread, Topic } from "@/types/reading";
import { QUESTION_MAX_LENGTH } from "@/types/reading";
import type { TarotCard } from "@/types/tarot";

export type ValidationResult =
  | { ok: true; topic: Topic; spread: Spread; cards: TarotCard[] }
  | { ok: false; errors: string[] };

export function validateReadingInput(input: ReadingInput): ValidationResult {
  const errors: string[] = [];

  const topic: Topic | undefined = TOPICS[input.topicId];
  if (!topic) errors.push(`알 수 없는 고민 분야: ${input.topicId}`);

  const spread: Spread | undefined = SPREADS[input.spreadId];
  if (!spread) errors.push(`알 수 없는 스프레드: ${input.spreadId}`);

  if (topic && spread && !topic.allowedSpreads.includes(spread.id)) {
    errors.push(`'${topic.nameKo}' 분야에서는 '${spread.nameKo}'를 사용할 수 없습니다`);
  }

  if (input.mbti !== null && !isMbtiType(input.mbti)) {
    errors.push(`유효하지 않은 MBTI: ${input.mbti}`);
  }

  if (input.question && input.question.length > QUESTION_MAX_LENGTH) {
    errors.push(`질문이 ${QUESTION_MAX_LENGTH}자를 초과했습니다 (${input.question.length}자)`);
  }

  if (spread && input.drawnCardIds.length !== spread.cardCount) {
    errors.push(
      `카드 수 불일치: ${input.drawnCardIds.length}장 선택 (${spread.nameKo}는 ${spread.cardCount}장)`,
    );
  }

  if (input.reversedFlags && input.reversedFlags.length !== input.drawnCardIds.length) {
    errors.push(
      `역방향 플래그 수 불일치: ${input.reversedFlags.length}개 (카드 ${input.drawnCardIds.length}장)`,
    );
  }

  const seen = new Set<string>();
  const cards: TarotCard[] = [];
  for (const id of input.drawnCardIds) {
    if (seen.has(id)) errors.push(`중복 선택된 카드: ${id}`);
    seen.add(id);
    const card = CARDS_BY_ID.get(id);
    if (!card) errors.push(`존재하지 않는 카드: ${id}`);
    else cards.push(card);
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, topic: topic!, spread: spread!, cards };
}
