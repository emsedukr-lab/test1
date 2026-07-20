import { ALL_CARD_IDS } from "@/data/cards/ids";

/**
 * 78장 덱 셔플 — crypto 기반 Fisher–Yates.
 * 셔플 결과는 readingStore(sessionStorage persist)에 저장되어 새로고침에도 유지된다.
 * 카드 본문 데이터를 import하지 않아 선택 화면 번들이 가볍다.
 */
export function shuffleDeck(): string[] {
  const ids = [...ALL_CARD_IDS];
  const randoms = new Uint32Array(ids.length);
  crypto.getRandomValues(randoms);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = randoms[i] % (i + 1);
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}

export const DECK_SIZE = 78;
