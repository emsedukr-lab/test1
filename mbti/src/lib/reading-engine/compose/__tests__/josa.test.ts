import { describe, expect, it } from "vitest";
import { josa } from "../josa";

describe("josa — 한국어 조사 처리", () => {
  it("받침 있는 단어", () => {
    expect(josa("책", "이/가")).toBe("책이");
    expect(josa("마음", "은/는")).toBe("마음은");
    expect(josa("시작", "을/를")).toBe("시작을");
    expect(josa("믿음", "과/와")).toBe("믿음과");
  });

  it("받침 없는 단어", () => {
    expect(josa("사과", "이/가")).toBe("사과가");
    expect(josa("여유", "은/는")).toBe("여유는");
    expect(josa("에너지", "을/를")).toBe("에너지를");
    expect(josa("자유", "과/와")).toBe("자유와");
  });

  it("으로/로 — ㄹ받침은 '로'", () => {
    expect(josa("연필", "으로/로")).toBe("연필로");
    expect(josa("시작", "으로/로")).toBe("시작으로");
    expect(josa("사과", "으로/로")).toBe("사과로");
  });

  it("숫자로 끝나는 카드명 — 발음 기준", () => {
    expect(josa("완드 6", "이/가")).toBe("완드 6이"); // 육
    expect(josa("컵 2", "이/가")).toBe("컵 2가"); // 이
    expect(josa("소드 9", "은/는")).toBe("소드 9는"); // 구
    expect(josa("펜타클 10", "이/가")).toBe("펜타클 10이"); // 십
    expect(josa("완드 7", "으로/로")).toBe("완드 7로"); // 칠 (ㄹ)
    expect(josa("소드 6", "으로/로")).toBe("소드 6으로"); // 육 (ㄱ)
  });

  it("이라는/라는", () => {
    expect(josa("시작", "이라는/라는")).toBe("시작이라는");
    expect(josa("여유", "이라는/라는")).toBe("여유라는");
  });

  it("비한글 끝글자는 받침 없음 폴백", () => {
    expect(josa("MBTI", "은/는")).toBe("MBTI는");
  });
});
