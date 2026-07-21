import { describe, expect, it } from "vitest";
import { getCardById } from "@/data/cards";
import { MBTI_PROFILES } from "@/data/mbti";
import { SPREADS } from "@/data/spreads";
import type { TarotCard } from "@/types/tarot";
import { selectFocusCard } from "../apply-mbti-profile";

function cards(...ids: string[]): TarotCard[] {
  return ids.map((id) => {
    const card = getCardById(id);
    if (!card) throw new Error(`카드 없음: ${id}`);
    return card;
  });
}

describe("selectFocusCard — 주목할 카드 선정", () => {
  const spread = SPREADS["three-card"];
  const noReverse = [false, false, false];

  it("결정적이다: 같은 입력 → 같은 인덱스", () => {
    const input = cards("wands-03", "swords-05", "cups-09");
    const a = selectFocusCard(MBTI_PROFILES.INTJ, input, spread, noReverse);
    const b = selectFocusCard(MBTI_PROFILES.INTJ, input, spread, noReverse);
    expect(a).toBe(b);
  });

  it("T 유형은 소드, F 유형은 컵에 끌린다", () => {
    // 슈트 신호만 남기기 위해 pentacles(중립적 S 가점 대상 아님·N유형)와 조합
    const input = cards("wands-03", "swords-02", "cups-06");
    const tPick = selectFocusCard(MBTI_PROFILES.INTJ, input, spread, noReverse); // N,T
    const fPick = selectFocusCard(MBTI_PROFILES.INFP, input, spread, noReverse); // N,F
    expect(input[tPick].suit).toBe("swords");
    expect(input[fPick].suit).toBe("cups");
  });

  it("메이저 카드는 N 유형에게 더 강한 신호다", () => {
    const input = cards("pentacles-08", "major-10", "wands-04");
    const pick = selectFocusCard(MBTI_PROFILES.ENFP, input, spread, noReverse);
    expect(input[pick].arcana).toBe("major");
  });

  it("역방향 카드는 가점을 받는다", () => {
    // 동일 슈트 가점 조건에서 역방향만 차이
    const input = cards("swords-02", "swords-06", "wands-04");
    const pick = selectFocusCard(MBTI_PROFILES.INTJ, input, spread, [false, true, false]);
    expect(pick).toBe(1);
  });
});
