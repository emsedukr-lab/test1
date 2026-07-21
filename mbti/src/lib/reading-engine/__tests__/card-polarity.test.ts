import { describe, expect, it } from "vitest";
import { ALL_CARD_IDS } from "@/data/cards/ids";
import { CARD_POLARITY, polarityScoreOf } from "../card-polarity";

describe("card-polarity", () => {
  it("78장 전부가 분류되어 있고 여분 키가 없다", () => {
    const keys = Object.keys(CARD_POLARITY).sort();
    expect(keys).toEqual([...ALL_CARD_IDS].sort());
  });

  it("궁정 카드(11~14)는 전부 steady", () => {
    for (const suit of ["wands", "cups", "swords", "pentacles"]) {
      for (const n of [11, 12, 13, 14]) {
        const id = `${suit}-${String(n).padStart(2, "0")}`;
        expect(CARD_POLARITY[id], id).toBe("steady");
      }
    }
  });

  it("각 슈트의 5는 challenging", () => {
    for (const suit of ["wands", "cups", "swords", "pentacles"]) {
      expect(CARD_POLARITY[`${suit}-05`], suit).toBe("challenging");
    }
  });

  it("점수: bright +1 / steady 0 / challenging -1", () => {
    expect(polarityScoreOf("major-19", false)).toBe(1); // 태양
    expect(polarityScoreOf("major-09", false)).toBe(0); // 은둔자
    expect(polarityScoreOf("major-16", false)).toBe(-1); // 타워
  });

  it("역방향: bright는 0으로 감쇠, challenging은 -1 유지", () => {
    expect(polarityScoreOf("major-19", true)).toBe(0);
    expect(polarityScoreOf("major-16", true)).toBe(-1);
    expect(polarityScoreOf("major-09", true)).toBe(0);
  });
});
