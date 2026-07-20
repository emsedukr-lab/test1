import { SUITS } from "@/types/tarot";

/**
 * 78장 카드 id 목록 — 카드 본문 데이터를 불러오지 않고도 쓸 수 있는 경량 모듈.
 * 카드 선택 화면(뒷면만 표시)이 전체 해설 텍스트를 번들에 싣지 않게 한다.
 */
export const ALL_CARD_IDS: readonly string[] = [
  ...Array.from({ length: 22 }, (_, i) => `major-${String(i).padStart(2, "0")}`),
  ...SUITS.flatMap((suit) =>
    Array.from({ length: 14 }, (_, i) => `${suit}-${String(i + 1).padStart(2, "0")}`),
  ),
];
