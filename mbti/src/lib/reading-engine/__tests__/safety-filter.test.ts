import { describe, expect, it } from "vitest";
import { checkQuestionSafety } from "../safety-filter";

describe("checkQuestionSafety", () => {
  it("평범한 질문은 통과한다", () => {
    const result = checkQuestionSafety("이직을 계속 준비해도 될까요?");
    expect(result).toEqual({ flagged: false, category: null, action: "none", message: null });
  });

  it("질문이 없으면 통과한다", () => {
    expect(checkQuestionSafety(undefined).flagged).toBe(false);
    expect(checkQuestionSafety("  ").flagged).toBe(false);
  });

  it("자해 신호는 block한다", () => {
    const result = checkQuestionSafety("요즘 너무 힘들어서 죽고 싶어요");
    expect(result.category).toBe("self-harm");
    expect(result.action).toBe("block");
    expect(result.message).toContain("109");
  });

  it("공백이 섞여도 자해 신호를 잡는다", () => {
    expect(checkQuestionSafety("죽 고 싶 다").category).toBe("self-harm");
  });

  it("의료 질문은 warn한다", () => {
    const result = checkQuestionSafety("이 병의 치료법이 효과가 있을까요?");
    expect(result.category).toBe("medical");
    expect(result.action).toBe("warn");
  });

  it("법률 질문은 warn한다", () => {
    expect(checkQuestionSafety("소송에서 이길 수 있을까요?").category).toBe("legal");
  });

  it("투자 질문은 warn한다", () => {
    expect(checkQuestionSafety("전 재산을 걸어도 될까요?").category).toBe("investment");
  });

  it("self-harm이 다른 카테고리보다 우선한다", () => {
    const result = checkQuestionSafety("소송 때문에 죽고 싶어요");
    expect(result.category).toBe("self-harm");
  });
});
