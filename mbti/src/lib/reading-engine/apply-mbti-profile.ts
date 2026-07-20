import { MBTI_BRIDGES, type BridgeContext } from "@/data/templates/mbti-bridges";
import type { MbtiProfile } from "@/types/mbti";
import type { Spread, Topic, TopicId } from "@/types/reading";
import type { TarotCard } from "@/types/tarot";
import { pickVariant } from "./compose/sentence-bank";
import type { UsedSentenceRegistry } from "./compose/registry";
import type { Rng } from "./rng";
import type { PositionedMeaning } from "./apply-position-context";

export interface MbtiAdjustedSection extends PositionedMeaning {
  /** MBTI 연결 문장 (예산 소진/미선택 시 null) */
  bridge: string | null;
}

/**
 * 브리지 예산: 1장→1, 3장→2, 5·6장→3.
 * action 위치 우선, 그다음 caution, 그다음 light (같은 mode끼리는 index 순 — 결정적).
 */
export function planBridgeSlots(spread: Spread, profile: MbtiProfile | null): ReadonlySet<number> {
  if (!profile) return new Set();
  const budget = spread.cardCount === 1 ? 1 : spread.cardCount === 3 ? 2 : 3;
  const priority = { action: 0, caution: 1, light: 2 } as const;
  const sorted = [...spread.positions].sort(
    (a, b) => priority[a.interpretationMode] - priority[b.interpretationMode] || a.index - b.index,
  );
  return new Set(sorted.slice(0, budget).map((p) => p.index));
}

export function applyMbtiProfile(args: {
  positioned: PositionedMeaning;
  card: TarotCard;
  keyword: string;
  profile: MbtiProfile | null;
  hasBridgeSlot: boolean;
  topic: Topic;
  rng: Rng;
  registry: UsedSentenceRegistry;
}): MbtiAdjustedSection {
  const { positioned, profile, hasBridgeSlot, topic, keyword, rng, registry } = args;

  if (!profile || !hasBridgeSlot) {
    return { ...positioned, bridge: null };
  }

  const ctx: BridgeContext = {
    type: profile.type,
    traitNoun: rng.pick(profile.strengths),
    overuseNoun: rng.pick(profile.overusePatterns),
    keyword,
    contextNoun: rng.pick(topic.contextNouns),
  };

  const bridge = pickVariant(MBTI_BRIDGES, ctx, rng, registry, profile.toneRules);
  return { ...positioned, bridge };
}

/** 분야 성격에 맞는 성향 설명 + 보완 관점으로 MBTI 렌즈 문단 구성 */
export function buildMbtiLens(
  profile: MbtiProfile,
  topic: Topic,
  rng: Rng,
  registry: UsedSentenceRegistry,
): string {
  const RELATION_TOPICS: readonly TopicId[] = ["love", "crush", "reunion", "relationship"];
  const DECISION_TOPICS: readonly TopicId[] = ["work", "career-path", "study", "money", "decision"];

  const styleSentence = RELATION_TOPICS.includes(topic.id)
    ? profile.relationshipStyle
    : DECISION_TOPICS.includes(topic.id)
      ? profile.decisionStyle
      : profile.perceptionStyle;

  const balancing = rng.pick(profile.balancingPerspectives);
  const lens = `${profile.type} 성향이 강하다면, ${styleSentence} ${balancing}`;
  registry.add(styleSentence);
  registry.add(balancing);
  return lens;
}
