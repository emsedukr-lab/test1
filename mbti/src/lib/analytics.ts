/**
 * 동의 기반 분석 이벤트 — 질문 원문·자유 메모는 절대 포함하지 않는다.
 * GA 스크립트가 로드되지 않았으면(미동의/미설정) 조용히 no-op.
 */

export type AnalyticsEvent =
  | "mbti_selected"
  | "topic_selected"
  | "spread_selected"
  | "cards_selected"
  | "result_viewed"
  | "result_saved"
  | "result_shared";

type Gtag = (command: "event", name: string, params?: Record<string, string | number>) => void;

export function track(name: AnalyticsEvent, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const gtag = (window as { gtag?: Gtag }).gtag;
  if (typeof gtag === "function") {
    gtag("event", name, params);
  }
}
