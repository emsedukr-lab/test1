import { describe, expect, it } from "vitest";
import { SPREADS } from "@/data/spreads";
import { TOPICS } from "@/data/topics";
import { decodeShare, encodeShare, type SharePayload } from "@/lib/share";

const payload: SharePayload = {
  mbti: "ENFP",
  topicId: "career-path",
  spreadId: "three-card",
  cardIds: ["major-00", "swords-09", "wands-06"],
};

describe("share — 공유 페이로드", () => {
  it("인코딩·디코딩 왕복이 보존된다", () => {
    expect(decodeShare(encodeShare(payload))).toEqual(payload);
  });

  it("MBTI 미선택도 왕복된다", () => {
    const p = { ...payload, mbti: null };
    expect(decodeShare(encodeShare(p))).toEqual(p);
  });

  it("페이로드에 질문이 들어갈 자리가 없다 — 인코딩 결과에 한글 없음", () => {
    const encoded = encodeShare(payload);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("손상된 페이로드는 null을 반환한다", () => {
    expect(decodeShare("garbage!!!")).toBeNull();
    expect(decodeShare("")).toBeNull();
    expect(decodeShare(btoa("2|ENFP|love|three-card|major-00"))).toBeNull(); // 버전 불일치
  });

  it("카드 수가 스프레드와 안 맞으면 null", () => {
    const bad = { ...payload, cardIds: ["major-00"] };
    expect(decodeShare(encodeShare(bad))).toBeNull();
  });

  it("중복 카드는 null", () => {
    const bad = { ...payload, cardIds: ["major-00", "major-00", "wands-06"] };
    expect(decodeShare(encodeShare(bad))).toBeNull();
  });

  it("존재하지 않는 카드 id는 null", () => {
    const bad = { ...payload, cardIds: ["major-00", "swords-09", "wands-99"] };
    expect(decodeShare(encodeShare(bad))).toBeNull();
  });

  it("share.ts의 토픽·스프레드 목록이 실제 데이터와 동기화되어 있다", () => {
    // 실제 토픽 전부가 인코딩·디코딩 가능해야 함 (드리프트 방지)
    for (const topicId of Object.keys(TOPICS)) {
      const p: SharePayload = { ...payload, topicId: topicId as SharePayload["topicId"] };
      expect(decodeShare(encodeShare(p)), topicId).not.toBeNull();
    }
    for (const [spreadId, spread] of Object.entries(SPREADS)) {
      const cardIds = [
        "major-00",
        "major-01",
        "major-02",
        "major-03",
        "major-04",
        "major-05",
      ].slice(0, spread.cardCount);
      const p: SharePayload = {
        ...payload,
        spreadId: spreadId as SharePayload["spreadId"],
        cardIds,
      };
      expect(decodeShare(encodeShare(p)), spreadId).not.toBeNull();
    }
  });
});
