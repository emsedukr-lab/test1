import {
  CAREER_VERDICTS,
  CHOICE_EVEN_VERDICTS,
  CHOICE_LEAN_VERDICTS,
  ONE_CARD_VERDICTS,
  RELATIONSHIP_VERDICTS,
  THREE_CARD_VERDICTS,
  type VerdictContext,
} from "@/data/templates/verdicts";
import type { ChoiceLean, ReadingVerdict, Spread, Topic } from "@/types/reading";
import type { TarotCard } from "@/types/tarot";
import { polarityScoreOf } from "./card-polarity";
import { josa } from "./compose/josa";
import { pickVariant } from "./compose/sentence-bank";
import type { UsedSentenceRegistry } from "./compose/registry";
import type { Rng } from "./rng";

export interface VerdictArgs {
  topic: Topic;
  spread: Spread;
  cards: readonly TarotCard[];
  /** 카드별 대표 키워드 (위치 순) */
  keywords: readonly string[];
  reversedFlags: readonly boolean[];
  rng: Rng;
  registry: UsedSentenceRegistry;
}

/**
 * 선택 리딩 기울기 — 카드 극성 점수의 가중 합.
 * '가능성' 자리(가중 2) + '책임' 자리(가중 1): 책임 자리가 밝으면 감당이 수월하다는 해석.
 */
function computeChoiceLean(args: VerdictArgs): ChoiceLean {
  const { cards, keywords, reversedFlags, spread } = args;
  const scoreA =
    2 * polarityScoreOf(cards[1].id, reversedFlags[1]) +
    1 * polarityScoreOf(cards[2].id, reversedFlags[2]);
  const scoreB =
    2 * polarityScoreOf(cards[3].id, reversedFlags[3]) +
    1 * polarityScoreOf(cards[4].id, reversedFlags[4]);
  const lean = scoreA > scoreB ? "A" : scoreB > scoreA ? "B" : "even";
  const criterionKw = keywords[5];

  if (lean === "even") {
    return {
      lean,
      scoreA,
      scoreB,
      reason: `양쪽의 기운이 팽팽해, 결정의 열쇠는 판단 기준 자리의 ${criterionKw}에 있습니다.`,
    };
  }

  // 기울기에 가장 크게 기여한 카드 1장 귀속 (이긴 쪽의 +기여와 진 쪽의 -기여 모두 후보)
  const winIdx = lean === "A" ? [1, 2] : [3, 4];
  const loseIdx = lean === "A" ? [3, 4] : [1, 2];
  const weights = [2, 1];
  let driver = winIdx[0];
  let driverContribution = -Infinity;
  let driverOnWinningSide = true;

  winIdx.forEach((idx, w) => {
    const contribution = weights[w] * polarityScoreOf(cards[idx].id, reversedFlags[idx]);
    if (contribution > driverContribution) {
      driverContribution = contribution;
      driver = idx;
      driverOnWinningSide = true;
    }
  });
  loseIdx.forEach((idx, w) => {
    const contribution = -weights[w] * polarityScoreOf(cards[idx].id, reversedFlags[idx]);
    if (contribution > driverContribution) {
      driverContribution = contribution;
      driver = idx;
      driverOnWinningSide = false;
    }
  });

  const driverPosition = spread.positions[driver].titleKo;
  const driverName = cards[driver].nameKo;
  const driverKw = keywords[driver];
  const reasonHead = driverOnWinningSide
    ? `${driverPosition} 자리의 ${driverName}(${driverKw})${josa(driverName, "이/가").slice(driverName.length)} 밝은 기운을 보태고 있기 때문입니다.`
    : `반대편 ${driverPosition} 자리의 ${driverName}(${driverKw})${josa(driverName, "이/가").slice(driverName.length)} 무거운 기운을 드리우고 있기 때문입니다.`;

  return {
    lean,
    scoreA,
    scoreB,
    reason: `${reasonHead} 최종 기준은 ${criterionKw}입니다.`,
  };
}

/** firstStep은 assemble 단계에서 actions[0]로 채워진다 */
export function generateVerdict(args: VerdictArgs): Omit<ReadingVerdict, "firstStep"> {
  const { topic, spread, cards, keywords, reversedFlags, rng, registry } = args;

  const base: VerdictContext = {
    topicNameKo: topic.nameKo,
    contextNoun: rng.pick(topic.contextNouns),
    keyword: keywords[0],
    secondKeyword: keywords[keywords.length - 1],
    cardNameKo: cards[0].nameKo,
  };

  let text: string;
  let choiceLean: ChoiceLean | undefined;

  switch (spread.id) {
    case "one-card": {
      const score = polarityScoreOf(cards[0].id, reversedFlags[0]);
      const pool =
        score > 0
          ? ONE_CARD_VERDICTS.bright
          : score < 0
            ? ONE_CARD_VERDICTS.challenging
            : ONE_CARD_VERDICTS.steady;
      text = pickVariant(pool, base, rng, registry);
      break;
    }
    case "three-card": {
      // 현재 상황(0) → 필요한 행동(2)의 이동
      text = pickVariant(
        THREE_CARD_VERDICTS,
        { ...base, keyword: keywords[0], secondKeyword: keywords[2] },
        rng,
        registry,
      );
      break;
    }
    case "relationship": {
      // 필요한 대화(4) + caution 두 자리(2,3) 중 극성이 낮은 카드
      const cautionIdx =
        polarityScoreOf(cards[3].id, reversedFlags[3]) <
        polarityScoreOf(cards[2].id, reversedFlags[2])
          ? 3
          : 2;
      text = pickVariant(
        RELATIONSHIP_VERDICTS,
        { ...base, keyword: keywords[4], secondKeyword: keywords[cautionIdx] },
        rng,
        registry,
      );
      break;
    }
    case "career": {
      // 현재 동기(0) → 다음 행동(5)
      text = pickVariant(
        CAREER_VERDICTS,
        { ...base, keyword: keywords[0], secondKeyword: keywords[5] },
        rng,
        registry,
      );
      break;
    }
    case "choice": {
      choiceLean = computeChoiceLean(args);
      const ctx = { ...base, keyword: keywords[0], secondKeyword: keywords[5] };
      text =
        choiceLean.lean === "even"
          ? pickVariant(CHOICE_EVEN_VERDICTS, ctx, rng, registry)
          : pickVariant(CHOICE_LEAN_VERDICTS, { ...ctx, leanLabel: choiceLean.lean }, rng, registry);
      break;
    }
  }

  return { text, keywords, choiceLean };
}
