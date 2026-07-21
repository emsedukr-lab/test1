import { ACTION_INTROS } from "@/data/templates/action-intros";
import {
  BRIEFING_APPROACH,
  FOCUS_CARD_REASONS,
  PITFALLS,
} from "@/data/templates/mbti-briefing";
import { MBTI_VIEWS, type MbtiViewContext } from "@/data/templates/mbti-views";
import type { MbtiProfile } from "@/types/mbti";
import type { MbtiBriefing, Spread, SpreadPosition, Topic, TopicId } from "@/types/reading";
import type { TarotCard } from "@/types/tarot";
import { pickVariant } from "./compose/sentence-bank";
import type { UsedSentenceRegistry } from "./compose/registry";
import type { Rng } from "./rng";

/** 카드 위치 모드별 'MBTI의 시선' 블록 본문 — 모든 카드 섹션에 하나씩 */
export function applyMbtiView(args: {
  card: TarotCard;
  keyword: string;
  profile: MbtiProfile | null;
  position: SpreadPosition;
  topic: Topic;
  rng: Rng;
  registry: UsedSentenceRegistry;
}): string | null {
  const { card, keyword, profile, position, topic, rng, registry } = args;
  if (!profile) return null;

  const ctx: MbtiViewContext = {
    type: profile.type,
    traitNoun: rng.pick(profile.strengths),
    overuseNoun: rng.pick(profile.overusePatterns),
    focus: profile.focus,
    keyword,
    contextNoun: rng.pick(topic.contextNouns),
    positionTitle: position.titleKo,
  };
  void card;

  return pickVariant(
    MBTI_VIEWS,
    ctx,
    rng,
    registry,
    profile.toneRules,
    position.interpretationMode,
  );
}

/**
 * 이번 배열에서 이 유형이 특히 주목할 카드 선정 (결정적, rng 불개입).
 * score = 슈트 친화(major: N+2/S+1, swords: T+2, cups: F+2, wands: N+1, pentacles: S+1)
 *       + actionPreferences 토큰이 카드 키워드에 부분 포함되면 토큰당 +2
 *       + 역방향 +1 (더 살펴야 할 신호)
 * 동점 시 interpretationMode 우선순위 action > caution > light → position index 최소.
 */
export function selectFocusCard(
  profile: MbtiProfile,
  cards: readonly TarotCard[],
  spread: Spread,
  reversedFlags: readonly boolean[],
): number {
  const sn = profile.type[1]; // 'S' | 'N'
  const tf = profile.type[2]; // 'T' | 'F'
  const modePriority = { action: 0, caution: 1, light: 2 } as const;

  let bestIndex = 0;
  let bestScore = -Infinity;

  cards.forEach((card, i) => {
    let score = 0;
    if (card.arcana === "major") {
      score += sn === "N" ? 2 : 1;
    } else if (card.suit === "swords" && tf === "T") {
      score += 2;
    } else if (card.suit === "cups" && tf === "F") {
      score += 2;
    } else if (card.suit === "wands" && sn === "N") {
      score += 1;
    } else if (card.suit === "pentacles" && sn === "S") {
      score += 1;
    }
    for (const pref of profile.actionPreferences) {
      if (card.keywords.some((k) => k.includes(pref))) score += 2;
    }
    if (reversedFlags[i]) score += 1;

    const better =
      score > bestScore ||
      (score === bestScore &&
        modePriority[spread.positions[i].interpretationMode] <
          modePriority[spread.positions[bestIndex].interpretationMode]);
    if (better) {
      bestScore = score;
      bestIndex = i;
    }
  });

  return bestIndex;
}

const RELATION_TOPICS: readonly TopicId[] = ["love", "crush", "reunion", "relationship"];
const DECISION_TOPICS: readonly TopicId[] = ["work", "career-path", "study", "money", "decision"];

/** 유형 브리핑 — ①주제를 대하는 방식 ②주목할 카드 ③유형별 함정 */
export function buildMbtiBriefing(args: {
  profile: MbtiProfile;
  topic: Topic;
  spread: Spread;
  cards: readonly TarotCard[];
  keywords: readonly string[];
  reversedFlags: readonly boolean[];
  rng: Rng;
  registry: UsedSentenceRegistry;
}): MbtiBriefing {
  const { profile, topic, spread, cards, keywords, reversedFlags, rng, registry } = args;

  const styleSentence = RELATION_TOPICS.includes(topic.id)
    ? profile.relationshipStyle
    : DECISION_TOPICS.includes(topic.id)
      ? profile.decisionStyle
      : profile.perceptionStyle;
  registry.add(styleSentence);

  const approach = pickVariant(
    BRIEFING_APPROACH,
    { type: profile.type, styleSentence, topicNameKo: topic.nameKo, focus: profile.focus },
    rng,
    registry,
    profile.toneRules,
  );

  const focusIndex = selectFocusCard(profile, cards, spread, reversedFlags);
  const focusCardData = cards[focusIndex];
  const reason = pickVariant(
    FOCUS_CARD_REASONS,
    {
      positionTitle: spread.positions[focusIndex].titleKo,
      cardNameKo: focusCardData.nameKo,
      keyword: keywords[focusIndex],
      focus: profile.focus,
    },
    rng,
    registry,
  );

  const pitfall = pickVariant(
    PITFALLS,
    { overuseNoun: rng.pick(profile.overusePatterns), topicNameKo: topic.nameKo },
    rng,
    registry,
  );

  return {
    type: profile.type,
    title: profile.title,
    approach,
    focusCard: {
      cardId: focusCardData.id,
      cardNameKo: focusCardData.nameKo,
      positionTitle: spread.positions[focusIndex].titleKo,
      reason,
    },
    pitfall,
  };
}

/** 행동 리스트 인트로 — 유형의 행동 방식(actionFraming) 프레이밍 */
export function buildActionsIntro(
  profile: MbtiProfile,
  rng: Rng,
  registry: UsedSentenceRegistry,
): string {
  return pickVariant(
    ACTION_INTROS,
    { type: profile.type, actionFraming: profile.actionFraming },
    rng,
    registry,
    profile.toneRules,
  );
}
