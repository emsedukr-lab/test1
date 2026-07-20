import { describe, expect, it } from "vitest";
import { getCardById } from "@/data/cards";
import { SPREADS } from "@/data/spreads";
import { getTopic } from "@/data/topics";
import type { TarotCard } from "@/types/tarot";
import { analyzeCardCombination } from "../analyze-combination";
import { createRng } from "../rng";

function cards(...ids: string[]): TarotCard[] {
  return ids.map((id) => {
    const card = getCardById(id);
    if (!card) throw new Error(`카드 없음: ${id}`);
    return card;
  });
}

const rng = () => createRng(["combo-test"]);

describe("analyzeCardCombination", () => {
  it("한 장 리딩은 빈 배열을 반환한다", () => {
    expect(
      analyzeCardCombination(cards("major-00"), SPREADS["one-card"], getTopic("daily"), rng()),
    ).toEqual([]);
  });

  it("메이저 비율 50% 이상이면 major-dominant", () => {
    const result = analyzeCardCombination(
      cards("major-00", "major-13", "cups-03"),
      SPREADS["three-card"],
      getTopic("daily"),
      rng(),
    );
    expect(result.map((r) => r.kind)).toContain("major-dominant");
  });

  it("5장 이상에서 메이저 0장이면 major-absent", () => {
    const result = analyzeCardCombination(
      cards("cups-02", "wands-03", "swords-04", "pentacles-06", "cups-09"),
      SPREADS.relationship,
      getTopic("love"),
      rng(),
    );
    expect(result.map((r) => r.kind)).toContain("major-absent");
  });

  it("한 슈트가 절반 이상이면 suit-dominant", () => {
    const result = analyzeCardCombination(
      cards("wands-02", "wands-05", "cups-03"),
      SPREADS["three-card"],
      getTopic("daily"),
      rng(),
    );
    const dominant = result.find((r) => r.kind === "suit-dominant");
    expect(dominant).toBeDefined();
    expect(dominant!.body).toContain("완드");
  });

  it("연애 질문에서 컵이 없으면 topic-suit-missing", () => {
    const result = analyzeCardCombination(
      cards("wands-02", "swords-05", "major-01"),
      SPREADS["three-card"],
      getTopic("love"),
      rng(),
    );
    expect(result.map((r) => r.kind)).toContain("topic-suit-missing");
  });

  it("같은 숫자 반복을 감지한다", () => {
    const result = analyzeCardCombination(
      cards("wands-03", "cups-03", "swords-03"),
      SPREADS["three-card"],
      getTopic("daily"),
      rng(),
    );
    const repeated = result.find((r) => r.kind === "repeated-number");
    expect(repeated).toBeDefined();
    expect(repeated!.weight).toBe(80); // 3장 반복
  });

  it("에이스 2장 이상이면 ace-cluster", () => {
    const result = analyzeCardCombination(
      cards("wands-01", "cups-01", "major-05"),
      SPREADS["three-card"],
      getTopic("daily"),
      rng(),
    );
    expect(result.map((r) => r.kind)).toContain("ace-cluster");
  });

  it("최대 2개까지만 반환한다", () => {
    const result = analyzeCardCombination(
      cards("wands-01", "wands-01", "wands-01").slice(0, 1).concat(cards("cups-01", "swords-01")),
      SPREADS["three-card"],
      getTopic("daily"),
      rng(),
    );
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it("결정적이다 — 같은 입력이면 같은 결과", () => {
    const input = cards("major-00", "major-13", "cups-03");
    const a = analyzeCardCombination(input, SPREADS["three-card"], getTopic("daily"), rng());
    const b = analyzeCardCombination(input, SPREADS["three-card"], getTopic("daily"), rng());
    expect(a).toEqual(b);
  });
});
