import { describe, expect, it } from "vitest";
import { ALL_CARDS, CARDS_BY_ID, CARDS_BY_SLUG, MAJOR_CARDS } from "@/data/cards";
import { ALL_CARD_IDS } from "@/data/cards/ids";
import { findForbidden, REQUIRED_MIN } from "@/lib/content-rules";
import { MINOR_RANK_NUMBER, SUITS } from "@/types/tarot";

describe("카드 데이터 무결성", () => {
  it("정확히 78장이다", () => {
    expect(ALL_CARDS).toHaveLength(78);
  });

  it("메이저 22장, 슈트별 14장이다", () => {
    expect(MAJOR_CARDS).toHaveLength(22);
    for (const suit of SUITS) {
      const count = ALL_CARDS.filter((c) => c.arcana === "minor" && c.suit === suit).length;
      expect(count, suit).toBe(14);
    }
  });

  it("메이저 번호 0~21이 빠짐없이 있다", () => {
    const numbers = new Set(MAJOR_CARDS.map((c) => c.number));
    for (let i = 0; i <= 21; i++) expect(numbers.has(i), `번호 ${i}`).toBe(true);
  });

  it("id와 slug가 전역 고유하다", () => {
    expect(new Set(ALL_CARDS.map((c) => c.id)).size).toBe(78);
    expect(new Set(ALL_CARDS.map((c) => c.slug)).size).toBe(78);
    expect(CARDS_BY_ID.size).toBe(78);
    expect(CARDS_BY_SLUG.size).toBe(78);
  });

  it("경량 id 목록이 실제 카드 id와 일치한다", () => {
    expect([...ALL_CARD_IDS].sort()).toEqual(ALL_CARDS.map((c) => c.id).sort());
  });

  it("마이너 rank와 number가 일치한다", () => {
    for (const card of ALL_CARDS) {
      if (card.arcana === "minor") {
        expect(card.number, card.id).toBe(MINOR_RANK_NUMBER[card.rank]);
      }
    }
  });

  it("필수 배열 최소 개수를 지킨다", () => {
    for (const card of ALL_CARDS) {
      for (const [field, min] of Object.entries(REQUIRED_MIN)) {
        expect(
          card[field as keyof typeof REQUIRED_MIN].length,
          `${card.id}.${field}`,
        ).toBeGreaterThanOrEqual(min);
      }
    }
  });

  it("모든 텍스트 필드에 금지 표현이 없다", () => {
    for (const card of ALL_CARDS) {
      const texts = [
        card.summary,
        card.lightMeaning,
        card.shadowMeaning,
        card.relationshipMeaning,
        card.careerMeaning,
        card.moneyMeaning,
        card.selfGrowthMeaning,
        card.decisionMeaning,
        ...card.strengths,
        ...card.cautions,
        ...card.reflectionQuestions,
        ...card.suggestedActions,
      ];
      for (const text of texts) {
        expect(findForbidden(text), `${card.id}: "${text}"`).toEqual([]);
      }
    }
  });

  it("이미지 경로가 /cards/<id>.jpg 규칙을 따른다", () => {
    for (const card of ALL_CARDS) {
      expect(card.image).toBe(`/cards/${card.id}.jpg`);
      expect(card.imageAlt.trim()).not.toBe("");
    }
  });
});
