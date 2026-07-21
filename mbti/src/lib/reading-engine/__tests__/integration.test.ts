import { describe, expect, it } from "vitest";
import { ALL_CARDS } from "@/data/cards";
import { findForbidden } from "@/lib/content-rules";
import type { ReadingInput, ReadingResult } from "@/types/reading";
import { normalizeSentence } from "../compose/dedupe";
import { generateReading } from "../generate-reading";

const base: ReadingInput = {
  topicId: "love",
  spreadId: "three-card",
  mbti: "INFP",
  question: "이 관계에서 내가 놓치고 있는 것은 무엇일까요?",
  drawnCardIds: ["cups-02", "swords-08", "major-17"],
};

function allText(result: ReadingResult): string[] {
  return [
    result.verdict?.text ?? "",
    result.opening,
    result.mbtiBriefing?.approach ?? "",
    result.mbtiBriefing?.focusCard.reason ?? "",
    result.mbtiBriefing?.pitfall ?? "",
    ...result.cardSections.flatMap((s) => [s.essence, s.intro, s.main, s.mbtiView ?? ""]),
    ...result.combinationInsights.map((c) => c.body),
    ...result.strengthsHighlight,
    ...result.cautionsHighlight,
    result.actionsIntro ?? "",
    ...result.actions,
    ...result.reflectionQuestions,
    result.closing,
  ].filter(Boolean);
}

describe("generateReading — 통합", () => {
  it("결정적이다: 같은 입력 → 같은 결과", () => {
    expect(generateReading(base)).toEqual(generateReading(base));
  });

  it("질문 텍스트는 결과 본문에 영향을 주지 않는다 (안전 검사 제외)", () => {
    const a = generateReading(base);
    const b = generateReading({ ...base, question: "완전히 다른 평범한 질문이에요" });
    expect(allText(a)).toEqual(allText(b));
  });

  it("MBTI가 다르면 결과 텍스트가 달라진다", () => {
    const a = generateReading(base);
    const b = generateReading({ ...base, mbti: "ESTJ" });
    expect(allText(a).join()).not.toBe(allText(b).join());
    // 유형 브리핑은 유형 고유 정보를 담는다
    expect(a.mbtiBriefing?.type).toBe("INFP");
    expect(b.mbtiBriefing?.type).toBe("ESTJ");
  });

  it("분야가 다르면 해석이 달라진다", () => {
    const a = generateReading(base);
    const b = generateReading({ ...base, topicId: "relationship" });
    expect(allText(a).join()).not.toBe(allText(b).join());
  });

  it("카드 순서가 다르면 결과가 달라진다", () => {
    const a = generateReading(base);
    const b = generateReading({
      ...base,
      drawnCardIds: ["major-17", "swords-08", "cups-02"],
    });
    expect(allText(a).join()).not.toBe(allText(b).join());
  });

  it("구조 규칙을 지킨다", () => {
    const result = generateReading(base);
    expect(result.cardSections).toHaveLength(3);
    expect(result.actions.length).toBeLessThanOrEqual(3);
    expect(result.actions.length).toBeGreaterThan(0);
    expect(result.reflectionQuestions).toHaveLength(3);
    expect(result.combinationInsights.length).toBeLessThanOrEqual(2);
    expect(result.opening.trim()).not.toBe("");
    expect(result.closing.trim()).not.toBe("");
    // verdict
    expect(result.verdict).not.toBeNull();
    expect(result.verdict!.text.trim()).not.toBe("");
    expect(result.verdict!.keywords).toHaveLength(3);
    expect(result.verdict!.firstStep).toBe(result.actions[0]);
    // 유형 브리핑 + 모든 섹션에 MBTI 시선
    expect(result.mbtiBriefing).not.toBeNull();
    expect(result.mbtiBriefing!.focusCard.cardId).toMatch(/^(major|wands|cups|swords|pentacles)-/);
    expect(result.actionsIntro).toContain("INFP");
    for (const s of result.cardSections) {
      expect(s.mbtiView, s.cardId).not.toBeNull();
      expect(s.essence).toContain(s.keyword);
      expect(s.intro.trim()).not.toBe("");
      expect(s.main.trim()).not.toBe("");
    }
  });

  it("MBTI 미선택이면 브리핑·시선·인트로가 모두 null이고 리딩은 정상 생성된다", () => {
    const result = generateReading({ ...base, mbti: null });
    expect(result.mbtiBriefing).toBeNull();
    expect(result.actionsIntro).toBeNull();
    expect(result.cardSections).toHaveLength(3);
    for (const s of result.cardSections) expect(s.mbtiView).toBeNull();
    expect(result.verdict).not.toBeNull();
    for (const text of allText(result)) {
      expect(text).not.toMatch(/[EI][SN][TF][JP]/);
    }
  });

  it("결과 전체에 금지 표현이 없다", () => {
    for (const mbti of ["INFP", "ESTJ", null] as const) {
      const result = generateReading({ ...base, mbti });
      for (const text of allText(result)) {
        expect(findForbidden(text), text).toEqual([]);
      }
    }
  });

  it("결과 안에 완전히 같은 문장이 반복되지 않는다", () => {
    const result = generateReading(base);
    const sentences = allText(result)
      .flatMap((t) => t.split(/(?<=[.?!])\s+/))
      .map(normalizeSentence)
      .filter((s) => s.length > 10);
    const dupes = sentences.filter((s, i) => sentences.indexOf(s) !== i);
    expect(dupes).toEqual([]);
  });

  it("역방향 카드는 다르게 해석되고 헤드라인에 표시된다", () => {
    const upright = generateReading(base);
    const reversed = generateReading({ ...base, reversedFlags: [true, false, false] });

    expect(reversed.cardSections[0].reversed).toBe(true);
    expect(reversed.cardSections[0].headline).toContain("(역방향)");
    expect(reversed.cardSections[1].reversed).toBe(false);
    // 같은 카드라도 역방향이면 본문이 달라진다
    expect(reversed.cardSections[0].main).not.toBe(upright.cardSections[0].main);
    // 역방향도 결정적이다
    expect(reversed).toEqual(generateReading({ ...base, reversedFlags: [true, false, false] }));
    // 금지 표현 없음
    for (const text of allText(reversed)) {
      expect(findForbidden(text), text).toEqual([]);
    }
  });

  it("역방향 플래그 수가 카드 수와 다르면 검증 오류", () => {
    expect(() => generateReading({ ...base, reversedFlags: [true] })).toThrow();
  });

  it("위기 질문이면 리딩을 생성하지 않고 안내만 반환한다", () => {
    const result = generateReading({ ...base, question: "죽고 싶다는 생각이 들어요" });
    expect(result.safety.action).toBe("block");
    expect(result.safety.message).toContain("109");
    expect(result.cardSections).toEqual([]);
    expect(result.verdict).toBeNull();
    expect(result.mbtiBriefing).toBeNull();
    expect(result.opening).toBe("");
  });

  it("의료 질문이면 warn과 함께 리딩을 진행한다", () => {
    const result = generateReading({ ...base, question: "수술을 받아야 할까요?" });
    expect(result.safety.action).toBe("warn");
    expect(result.cardSections).toHaveLength(3);
  });

  it("모든 스프레드에서 정상 동작한다", () => {
    const spreadCases: [ReadingInput["spreadId"], ReadingInput["topicId"], string[]][] = [
      ["one-card", "daily", ["major-00"]],
      ["three-card", "self", ["cups-04", "major-09", "wands-08"]],
      ["relationship", "love", ["cups-02", "cups-06", "swords-03", "major-06", "wands-02"]],
      [
        "choice",
        "decision",
        ["major-11", "wands-02", "wands-10", "cups-08", "swords-06", "major-14"],
      ],
      [
        "career",
        "career-path",
        ["wands-01", "swords-09", "pentacles-03", "pentacles-10", "major-15", "wands-08"],
      ],
    ];
    for (const [spreadId, topicId, cardIds] of spreadCases) {
      const result = generateReading({
        topicId,
        spreadId,
        mbti: "ENTP",
        drawnCardIds: cardIds,
      });
      expect(result.cardSections, spreadId).toHaveLength(cardIds.length);
      expect(result.reflectionQuestions).toHaveLength(3);
      expect(result.verdict!.text.trim(), spreadId).not.toBe("");
      // choice에서만 기울기 존재
      if (spreadId === "choice") expect(result.verdict!.choiceLean).toBeDefined();
      else expect(result.verdict!.choiceLean).toBeUndefined();
    }
  });

  it("78장 × 대표 유형 스모크 — 예외와 빈 필드가 없다", () => {
    for (const card of ALL_CARDS) {
      const result = generateReading({
        topicId: "daily",
        spreadId: "one-card",
        mbti: "ISFJ",
        drawnCardIds: [card.id],
      });
      const s = result.cardSections[0];
      expect(s.intro.trim(), card.id).not.toBe("");
      expect(s.main.trim(), card.id).not.toBe("");
      expect(s.essence.trim(), card.id).not.toBe("");
      expect(s.mbtiView, card.id).not.toBeNull();
      expect(result.verdict!.text.trim(), card.id).not.toBe("");
    }
  });
});
