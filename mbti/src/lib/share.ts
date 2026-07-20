import { ALL_CARD_IDS } from "@/data/cards/ids";
import { isMbtiType, type MbtiType } from "@/types/mbti";
import type { SpreadId, TopicId } from "@/types/reading";

const TOPIC_IDS: readonly string[] = [
  "daily",
  "love",
  "crush",
  "reunion",
  "relationship",
  "work",
  "career-path",
  "money",
  "decision",
  "self",
  "study",
  "free",
];
const SPREAD_CARD_COUNT: Record<string, number> = {
  "one-card": 1,
  "three-card": 3,
  relationship: 5,
  choice: 6,
  career: 6,
};

export interface SharePayload {
  mbti: MbtiType | null;
  topicId: TopicId;
  spreadId: SpreadId;
  cardIds: string[];
  /** 위치별 역방향 여부 — 카드 id 뒤 'r' 접미사로 인코딩 */
  reversedFlags: boolean[];
}

function toBase64Url(s: string): string {
  const b64 = typeof btoa === "function" ? btoa(s) : Buffer.from(s, "utf8").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): string | null {
  try {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    return typeof atob === "function" ? atob(b64) : Buffer.from(b64, "base64").toString("utf8");
  } catch {
    return null;
  }
}

/**
 * 공유 페이로드 인코딩 — 질문 원문은 구조적으로 포함될 수 없다.
 * 형식: `1|{mbti|-}|{topicId}|{spreadId}|{cardId[r].cardId[r]...}`
 * (역방향 카드는 id 뒤에 'r' 접미사)
 */
export function encodeShare(payload: SharePayload): string {
  const mbtiPart = payload.mbti ?? "-";
  const cardsPart = payload.cardIds
    .map((id, i) => (payload.reversedFlags[i] ? `${id}r` : id))
    .join(".");
  const raw = ["1", mbtiPart, payload.topicId, payload.spreadId, cardsPart].join("|");
  return toBase64Url(raw);
}

export function decodeShare(encoded: string): SharePayload | null {
  const raw = fromBase64Url(encoded);
  if (!raw) return null;
  const parts = raw.split("|");
  if (parts.length !== 5 || parts[0] !== "1") return null;

  const [, mbtiPart, topicId, spreadId, cardsPart] = parts;
  const mbti = mbtiPart === "-" ? null : mbtiPart;
  if (mbti !== null && !isMbtiType(mbti)) return null;
  if (!TOPIC_IDS.includes(topicId)) return null;
  const expectedCount = SPREAD_CARD_COUNT[spreadId];
  if (!expectedCount) return null;

  const tokens = cardsPart.split(".");
  if (tokens.length !== expectedCount) return null;
  const reversedFlags = tokens.map((t) => t.endsWith("r"));
  const cardIds = tokens.map((t) => (t.endsWith("r") ? t.slice(0, -1) : t));
  const validIds = new Set(ALL_CARD_IDS);
  if (cardIds.some((id) => !validIds.has(id))) return null;
  if (new Set(cardIds).size !== cardIds.length) return null;

  return {
    mbti: mbti as MbtiType | null,
    topicId: topicId as TopicId,
    spreadId: spreadId as SpreadId,
    cardIds,
    reversedFlags,
  };
}

/** Web Share API + 클립보드 폴백. 공유 텍스트에도 질문 원문을 넣지 않는다 */
export async function shareUrl(url: string, title: string): Promise<"shared" | "copied" | "failed"> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, url });
      return "shared";
    } catch {
      // 사용자가 취소한 경우 등 — 클립보드 폴백으로 진행하지 않고 종료
      return "failed";
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
}
