import { COMBINATION_FRAMES, type CombinationContext } from "@/data/templates/combination-frames";
import { TOPIC_SUIT } from "@/data/topics";
import type { CombinationInsight, CombinationKind, Spread, Topic } from "@/types/reading";
import type { Suit, TarotCard } from "@/types/tarot";
import type { Rng } from "./rng";

const SUIT_NAMES_KO: Record<Suit, string> = {
  wands: "완드",
  cups: "컵",
  swords: "소드",
  pentacles: "펜타클",
};

/** 동점 시 고정 우선순위 (결정적) */
const KIND_PRIORITY: readonly CombinationKind[] = [
  "major-dominant",
  "repeated-number",
  "suit-dominant",
  "ace-cluster",
  "topic-suit-missing",
  "court-heavy",
  "expansion-flow",
  "convergence-flow",
  "major-absent",
];

interface Detected {
  kind: CombinationKind;
  weight: number;
  ctx: CombinationContext;
}

export function analyzeCardCombination(
  cards: readonly TarotCard[],
  spread: Spread,
  topic: Topic,
  rng: Rng,
): CombinationInsight[] {
  if (cards.length < 3) return [];

  const total = cards.length;
  const baseCtx: CombinationContext = {
    topicNameKo: topic.nameKo,
    contextNoun: rng.pick(topic.contextNouns),
  };
  const detected: Detected[] = [];

  // 메이저 비율
  const majorCount = cards.filter((c) => c.arcana === "major").length;
  if (majorCount / total >= 0.5) {
    detected.push({ kind: "major-dominant", weight: 90, ctx: baseCtx });
  } else if (total >= 5 && majorCount === 0) {
    detected.push({ kind: "major-absent", weight: 40, ctx: baseCtx });
  }

  // 슈트 집중
  const suitCounts = new Map<Suit, number>();
  for (const c of cards) {
    if (c.arcana === "minor") suitCounts.set(c.suit, (suitCounts.get(c.suit) ?? 0) + 1);
  }
  const dominantSuit = [...suitCounts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  )[0];
  if (dominantSuit && dominantSuit[1] >= Math.ceil(total / 2)) {
    detected.push({
      kind: "suit-dominant",
      weight: 70,
      ctx: { ...baseCtx, suitNameKo: SUIT_NAMES_KO[dominantSuit[0]] },
    });
  }

  // 분야 연관 슈트 부재
  const topicSuit = TOPIC_SUIT[topic.id];
  if (topicSuit && !suitCounts.has(topicSuit)) {
    detected.push({
      kind: "topic-suit-missing",
      weight: 60,
      ctx: { ...baseCtx, suitNameKo: SUIT_NAMES_KO[topicSuit] },
    });
  }

  // 숫자 반복 (메이저 포함, 가장 많이 반복된 숫자 — 동수면 작은 숫자)
  const numberCounts = new Map<number, number>();
  for (const c of cards) numberCounts.set(c.number, (numberCounts.get(c.number) ?? 0) + 1);
  const repeated = [...numberCounts.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])[0];
  if (repeated) {
    detected.push({
      kind: "repeated-number",
      weight: repeated[1] >= 3 ? 80 : 50,
      ctx: { ...baseCtx, number: repeated[0], count: repeated[1] },
    });
  }

  // 궁정 카드 집중
  const courtCount = cards.filter((c) => c.arcana === "minor" && c.number >= 11).length;
  if (courtCount >= 2) {
    detected.push({ kind: "court-heavy", weight: 55, ctx: { ...baseCtx, count: courtCount } });
  }

  // 에이스 클러스터
  const aceCount = cards.filter((c) => c.arcana === "minor" && c.number === 1).length;
  if (aceCount >= 2) {
    detected.push({ kind: "ace-cluster", weight: 65, ctx: { ...baseCtx, count: aceCount } });
  }

  // 확장/수렴 흐름 (핍 카드 3장 이상, 위치 순서 기준 단조 추세)
  const pips = cards.filter((c) => c.arcana === "minor" && c.number <= 10);
  if (pips.length >= 3) {
    const nums = pips.map((c) => c.number);
    const increasing = nums.every((n, i) => i === 0 || n >= nums[i - 1]);
    const decreasing = nums.every((n, i) => i === 0 || n <= nums[i - 1]);
    if (increasing && !decreasing) {
      detected.push({ kind: "expansion-flow", weight: 45, ctx: baseCtx });
    } else if (decreasing && !increasing) {
      detected.push({ kind: "convergence-flow", weight: 45, ctx: baseCtx });
    }
  }

  return detected
    .sort(
      (a, b) =>
        b.weight - a.weight || KIND_PRIORITY.indexOf(a.kind) - KIND_PRIORITY.indexOf(b.kind),
    )
    .slice(0, 2)
    .map((d) => ({
      kind: d.kind,
      weight: d.weight,
      body: rng.pick(COMBINATION_FRAMES[d.kind])(d.ctx),
    }));
}
