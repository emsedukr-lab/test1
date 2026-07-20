import { SAFETY_MESSAGES } from "@/data/templates/safety-messages";
import type { SafetyCategory, SafetyCheckResult } from "@/types/reading";

export const SAFETY_KEYWORDS: Record<SafetyCategory, readonly string[]> = {
  "self-harm": ["자살", "자해", "죽고 싶", "죽고싶", "극단적 선택", "극단적선택", "살기 싫", "살기싫"],
  violence: ["죽이", "죽여", "해치", "폭행", "복수하", "때리"],
  medical: ["진단", "치료법", "병명", "수술", "약을 끊", "복용", "암인지", "임신인지"],
  legal: ["소송", "고소", "합의금", "법적 책임", "변호사", "형량"],
  investment: ["수익 보장", "원금", "몇 배", "확실한 수익", "전 재산", "빚내서", "몰빵", "코인 사도", "주식 사도"],
};

/** 카테고리별 대응 수위 — block은 리딩을 생성하지 않는다 */
export const SAFETY_ACTION: Record<SafetyCategory, "warn" | "block"> = {
  "self-harm": "block",
  violence: "block",
  medical: "warn",
  legal: "warn",
  investment: "warn",
};

/** 매칭 우선순위 — self-harm이 항상 먼저 */
const CATEGORY_ORDER: readonly SafetyCategory[] = [
  "self-harm",
  "violence",
  "medical",
  "legal",
  "investment",
];

export function checkQuestionSafety(question: string | undefined): SafetyCheckResult {
  if (!question || question.trim() === "") {
    return { flagged: false, category: null, action: "none", message: null };
  }
  const normalized = question.replace(/\s+/g, " ");
  const compact = normalized.replace(/\s/g, "");

  for (const category of CATEGORY_ORDER) {
    for (const keyword of SAFETY_KEYWORDS[category]) {
      // 공백 포함 키워드는 공백 정규화 문자열에서, 나머지는 공백 제거 문자열에서 찾는다
      const haystack = keyword.includes(" ") ? normalized : compact;
      if (haystack.includes(keyword)) {
        return {
          flagged: true,
          category,
          action: SAFETY_ACTION[category],
          message: SAFETY_MESSAGES[category],
        };
      }
    }
  }
  return { flagged: false, category: null, action: "none", message: null };
}
