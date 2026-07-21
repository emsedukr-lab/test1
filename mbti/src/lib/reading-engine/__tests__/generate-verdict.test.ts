import { describe, expect, it } from "vitest";
import { findForbidden, hasDoubleHedge } from "@/lib/content-rules";
import type { ReadingInput } from "@/types/reading";
import { generateReading } from "../generate-reading";

function verdictOf(input: ReadingInput) {
  const result = generateReading(input);
  expect(result.verdict).not.toBeNull();
  return result.verdict!;
}

/** 선택 리딩 입력 — [핵심, A가능성, A책임, B가능성, B책임, 판단기준] */
function choiceInput(cardIds: string[], reversedFlags?: boolean[]): ReadingInput {
  return {
    topicId: "decision",
    spreadId: "choice",
    mbti: "INTJ",
    drawnCardIds: cardIds,
    reversedFlags,
  };
}

describe("generateVerdict", () => {
  it("verdict는 결정적이다", () => {
    const input: ReadingInput = {
      topicId: "career-path",
      spreadId: "career",
      mbti: "ENFP",
      drawnCardIds: ["wands-01", "swords-09", "pentacles-03", "pentacles-10", "major-15", "wands-08"],
    };
    expect(verdictOf(input)).toEqual(verdictOf(input));
  });

  it("choice: A쪽이 밝으면 lean A", () => {
    // A가능성=태양(+1)·A책임=별(+1) → scoreA=3 / B가능성=타워(-1)·B책임=소드9(-1) → scoreB=-3
    const verdict = verdictOf(
      choiceInput(["major-11", "major-19", "major-17", "major-16", "swords-09", "major-14"]),
    );
    expect(verdict.choiceLean?.lean).toBe("A");
    expect(verdict.choiceLean?.scoreA).toBe(3);
    expect(verdict.choiceLean?.scoreB).toBe(-3);
    expect(verdict.text).toContain("A");
    expect(verdict.choiceLean?.reason.trim()).not.toBe("");
  });

  it("choice: B쪽이 밝으면 lean B", () => {
    const verdict = verdictOf(
      choiceInput(["major-11", "major-16", "swords-09", "major-19", "major-17", "major-14"]),
    );
    expect(verdict.choiceLean?.lean).toBe("B");
    expect(verdict.text).toContain("B");
  });

  it("choice: 동점이면 even + 판단 기준 안내", () => {
    // 전부 steady 카드 → 0:0
    const verdict = verdictOf(
      choiceInput(["major-09", "major-05", "major-11", "major-14", "wands-02", "swords-04"]),
    );
    expect(verdict.choiceLean?.lean).toBe("even");
    expect(verdict.choiceLean?.reason).toContain("판단 기준");
  });

  it("choice: 역방향이 밝은 카드를 감쇠시켜 기울기를 바꾼다", () => {
    // 정방향이면 A(태양+별=3) > B(컵에이스×2... ) — A의 태양·별을 역방향으로 눌러 A=0
    const upright = verdictOf(
      choiceInput(["major-11", "major-19", "major-17", "cups-01", "major-09", "major-14"]),
    );
    expect(upright.choiceLean?.lean).toBe("A"); // 3 vs 2
    const reversed = verdictOf(
      choiceInput(
        ["major-11", "major-19", "major-17", "cups-01", "major-09", "major-14"],
        [false, true, true, false, false, false],
      ),
    );
    expect(reversed.choiceLean?.lean).toBe("B"); // 0 vs 2
  });

  it("모든 스프레드의 verdict가 금지 표현·이중 헤지 없이 생성된다", () => {
    const cases: ReadingInput[] = [
      { topicId: "daily", spreadId: "one-card", mbti: null, drawnCardIds: ["major-19"] },
      { topicId: "daily", spreadId: "one-card", mbti: null, drawnCardIds: ["major-09"] },
      { topicId: "daily", spreadId: "one-card", mbti: null, drawnCardIds: ["major-16"] },
      { topicId: "self", spreadId: "three-card", mbti: "ISTP", drawnCardIds: ["cups-04", "major-09", "wands-08"] },
      {
        topicId: "love",
        spreadId: "relationship",
        mbti: "ESFJ",
        drawnCardIds: ["cups-02", "cups-06", "swords-03", "major-06", "wands-02"],
      },
      choiceInput(["major-11", "major-19", "major-17", "major-16", "swords-09", "major-14"]),
    ];
    for (const input of cases) {
      const verdict = verdictOf(input);
      expect(findForbidden(verdict.text), verdict.text).toEqual([]);
      expect(hasDoubleHedge(verdict.text), verdict.text).toBe(false);
      if (verdict.choiceLean) {
        expect(findForbidden(verdict.choiceLean.reason)).toEqual([]);
        expect(hasDoubleHedge(verdict.choiceLean.reason)).toBe(false);
      }
    }
  });
});
