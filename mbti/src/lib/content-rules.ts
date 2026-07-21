/**
 * 콘텐츠 품질 규칙 — 검증 스크립트와 Vitest가 공유한다.
 * 미래를 확정하거나 사람을 단정하는 표현을 데이터·템플릿 어디에도 남기지 않는 것이 목적.
 */

export const FORBIDDEN_EXPRESSIONS: readonly string[] = [
  "반드시",
  "무조건",
  "절대로",
  "틀림없",
  "확실합니다",
  "100%",
  "헤어집니다",
  "헤어지게 됩니다",
  "이별하게 됩니다",
  "성공합니다",
  "실패합니다",
  "망합니다",
  "불행해집니다",
  "저주",
  "벌을 받",
  "당신은 원래",
  "사랑하지 않습니다",
];

export const REQUIRED_MIN = {
  keywords: 3,
  reflectionQuestions: 3,
  suggestedActions: 3,
  strengths: 2,
  cautions: 2,
} as const;

export const ENDING_RULES = {
  suggestedActions: /(보세요|볼까요)[.]?$/,
  reflectionQuestions: /(까요|나요|가요)\?$/,
} as const;

export const SUMMARY_LENGTH = { min: 20, max: 90 } as const;
export const MEANING_LENGTH = { min: 30, max: 160 } as const;

/** 텍스트에 포함된 금지 표현 목록을 반환 (없으면 빈 배열) */
export function findForbidden(text: string): string[] {
  return FORBIDDEN_EXPRESSIONS.filter((expr) => text.includes(expr));
}

/**
 * verdict·essence 전용 — 한 문장 안에서 헤지 표현이 두 번 이상 겹치는 것을 검출.
 * "~일 수도 있을 것 같습니다"류의 이중 헤지가 대답을 흐리는 것을 막는다.
 */
export const DOUBLE_HEDGE_PATTERNS: readonly RegExp[] = [
  /(수 있|보입니다|모릅니다|것 같)[^.?!]*(수 있|보입니|모릅니|것 같)/,
];

export function hasDoubleHedge(text: string): boolean {
  return DOUBLE_HEDGE_PATTERNS.some((p) => p.test(text));
}
