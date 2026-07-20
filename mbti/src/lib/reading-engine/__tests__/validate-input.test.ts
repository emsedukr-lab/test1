import { describe, expect, it } from "vitest";
import { validateReadingInput } from "../validate-input";
import type { ReadingInput } from "@/types/reading";

const valid: ReadingInput = {
  topicId: "love",
  spreadId: "three-card",
  mbti: "INFP",
  drawnCardIds: ["major-00", "cups-03", "wands-11"],
};

describe("validateReadingInput", () => {
  it("정상 입력을 통과시킨다", () => {
    const result = validateReadingInput(valid);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.cards).toHaveLength(3);
  });

  it("카드 수 불일치를 잡는다", () => {
    const result = validateReadingInput({ ...valid, drawnCardIds: ["major-00"] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join()).toContain("카드 수 불일치");
  });

  it("중복 카드를 잡는다", () => {
    const result = validateReadingInput({
      ...valid,
      drawnCardIds: ["major-00", "major-00", "wands-11"],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join()).toContain("중복");
  });

  it("존재하지 않는 카드를 잡는다", () => {
    const result = validateReadingInput({
      ...valid,
      drawnCardIds: ["major-00", "cups-03", "wands-99"],
    });
    expect(result.ok).toBe(false);
  });

  it("분야에서 허용하지 않는 스프레드를 잡는다", () => {
    // love는 career 스프레드를 허용하지 않음
    const result = validateReadingInput({
      ...valid,
      spreadId: "career",
      drawnCardIds: ["major-00", "cups-03", "wands-11", "swords-02", "pentacles-05", "major-10"],
    });
    expect(result.ok).toBe(false);
  });

  it("잘못된 MBTI 문자열을 잡는다", () => {
    const result = validateReadingInput({ ...valid, mbti: "ABCD" as never });
    expect(result.ok).toBe(false);
  });

  it("301자 질문을 잡는다", () => {
    const result = validateReadingInput({ ...valid, question: "가".repeat(301) });
    expect(result.ok).toBe(false);
  });

  it("MBTI null(미선택)은 유효하다", () => {
    expect(validateReadingInput({ ...valid, mbti: null }).ok).toBe(true);
  });
});
