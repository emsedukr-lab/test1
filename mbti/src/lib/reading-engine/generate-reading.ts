import { getProfile } from "@/data/mbti";
import type { ReadingInput, ReadingResult } from "@/types/reading";
import { applyMbtiProfile, buildMbtiLens, planBridgeSlots } from "./apply-mbti-profile";
import { applyPositionContext } from "./apply-position-context";
import { analyzeCardCombination } from "./analyze-combination";
import { assembleReading } from "./compose/assemble";
import { UsedSentenceRegistry } from "./compose/registry";
import { generateActions } from "./generate-actions";
import { generateReflectionQuestions } from "./generate-reflection-questions";
import { createRng, seedOf } from "./rng";
import { checkQuestionSafety } from "./safety-filter";
import { selectCardMeaning } from "./select-card-meaning";
import { validateReadingInput } from "./validate-input";

export class ReadingInputError extends Error {
  constructor(public readonly errors: readonly string[]) {
    super(`유효하지 않은 리딩 입력: ${errors.join(" / ")}`);
    this.name = "ReadingInputError";
  }
}

/**
 * 리딩 생성 파이프라인 (결정적 — 같은 입력이면 같은 결과).
 * 질문 텍스트는 안전 검사에만 쓰이고 시드·본문 생성에는 관여하지 않는다.
 */
export function generateReading(input: ReadingInput): ReadingResult {
  const validation = validateReadingInput(input);
  if (!validation.ok) throw new ReadingInputError(validation.errors);
  const { topic, spread, cards } = validation;

  const safety = checkQuestionSafety(input.question);

  const reversedFlags = input.reversedFlags ?? input.drawnCardIds.map(() => false);
  const seedParts = [
    spread.id,
    topic.id,
    input.mbti ?? "NONE",
    ...input.drawnCardIds.map((id, i) => (reversedFlags[i] ? `${id}r` : id)),
  ];
  const seed = seedOf(seedParts);

  // 위기 신호: 리딩을 생성하지 않고 안내만 반환
  if (safety.action === "block") {
    return {
      meta: {
        topicId: topic.id,
        spreadId: spread.id,
        mbti: input.mbti,
        cardIds: input.drawnCardIds,
        reversedFlags,
        seed,
      },
      safety,
      opening: "",
      mbtiLens: null,
      cardSections: [],
      combinationInsights: [],
      strengthsHighlight: [],
      cautionsHighlight: [],
      actions: [],
      reflectionQuestions: [],
      closing: "",
    };
  }

  const rng = createRng(seedParts);
  const registry = new UsedSentenceRegistry();
  const profile = getProfile(input.mbti);

  // 카드별 해석
  const bridgeSlots = planBridgeSlots(spread, profile);
  const meanings = cards.map((card) => selectCardMeaning(card, topic, rng));
  const sections = cards.map((card, i) => {
    const positioned = applyPositionContext({
      card,
      meaning: meanings[i],
      position: spread.positions[i],
      topic,
      reversed: reversedFlags[i],
      rng,
      registry,
      toneRules: profile?.toneRules ?? null,
    });
    return applyMbtiProfile({
      positioned,
      card,
      keyword: meanings[i].keyword,
      profile,
      hasBridgeSlot: bridgeSlots.has(spread.positions[i].index),
      topic,
      rng,
      registry,
    });
  });

  const mbtiLens = profile ? buildMbtiLens(profile, topic, rng, registry) : null;
  const combos = analyzeCardCombination(cards, spread, topic, rng);
  const actions = generateActions({ cards, spread, topic, profile, registry });
  const questions = generateReflectionQuestions({ cards, spread, topic, registry });

  return assembleReading({
    topic,
    spread,
    profile,
    safety,
    mbtiLens,
    sections,
    cards,
    keywords: meanings.map((m) => m.keyword),
    combos,
    actions,
    questions,
    rng,
    registry,
    seed,
    cardIds: input.drawnCardIds,
    reversedFlags,
    mbti: input.mbti,
  });
}
