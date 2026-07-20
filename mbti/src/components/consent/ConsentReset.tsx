"use client";

import { useConsentStore } from "@/stores/consentStore";
import { useStoreHydrated } from "@/stores/hydration";

/** 쿠키 정책 페이지 내 동의 상태 확인·초기화 위젯 */
export function ConsentReset() {
  const hydrated = useStoreHydrated(useConsentStore);
  const adConsent = useConsentStore((s) => s.adConsent);
  const resetConsent = useConsentStore((s) => s.resetConsent);

  const label = !hydrated
    ? "확인 중…"
    : adConsent === "granted"
      ? "동의함"
      : adConsent === "denied"
        ? "거부함"
        : "아직 선택하지 않음";

  return (
    <div className="mt-4 rounded-xl border border-border-subtle bg-surface p-4">
      <p className="text-sm text-muted">
        현재 광고 쿠키 동의 상태:{" "}
        <span className="font-medium text-foreground">{label}</span>
      </p>
      <button
        type="button"
        onClick={resetConsent}
        disabled={!hydrated || adConsent === "unknown"}
        className="mt-3 rounded-lg border border-border-subtle px-4 py-2 text-sm font-medium hover:border-gold/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        동의 상태 초기화
      </button>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        초기화하면 저장된 선택이 삭제되고, 다음 화면부터 동의 배너가 다시 표시되어 새로
        선택할 수 있습니다.
      </p>
    </div>
  );
}
