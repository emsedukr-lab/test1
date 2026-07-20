import { describe, expect, it } from "vitest";
import { dedupeSentences, normalizeSentence, sentenceSimilarity } from "../dedupe";

describe("dedupe — 문장 중복 제거", () => {
  it("완전 일치를 제거한다", () => {
    expect(dedupeSentences(["같은 문장입니다.", "같은 문장입니다.", "다른 문장입니다."])).toEqual([
      "같은 문장입니다.",
      "다른 문장입니다.",
    ]);
  });

  it("문장부호·공백 차이만 있으면 같은 문장으로 본다", () => {
    expect(normalizeSentence("마음을  정리해 보세요.")).toBe(normalizeSentence("마음을 정리해 보세요"));
  });

  it("유사 문장을 threshold 기준으로 제거한다", () => {
    const a = "가까운 사람에게 마음을 먼저 표현해 보세요.";
    const b = "가까운 사람에게 마음을 먼저 이야기해 보세요.";
    expect(sentenceSimilarity(a, b)).toBeGreaterThan(0.6);
    expect(dedupeSentences([a, b])).toEqual([a]);
  });

  it("무관한 문장은 유지한다 (순서 보존)", () => {
    const items = ["오늘 10분 산책해 보세요.", "지출 내역을 한 줄로 적어 보세요."];
    expect(dedupeSentences(items)).toEqual(items);
  });
});
