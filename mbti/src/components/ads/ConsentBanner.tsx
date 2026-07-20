"use client";

import Link from "next/link";
import { useConsentStore } from "@/stores/consentStore";
import { useStoreHydrated } from "@/stores/hydration";

/** 하단 고정 쿠키/광고 동의 배너 — 동의·거부 버튼 동일 크기(다크패턴 금지) */
export function ConsentBanner() {
  const hydrated = useStoreHydrated(useConsentStore);
  const adConsent = useConsentStore((s) => s.adConsent);
  const setConsent = useConsentStore((s) => s.setConsent);

  if (!hydrated || adConsent !== "unknown") return null;

  return (
    <div
      role="region"
      aria-label="쿠키 및 광고 동의"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border-subtle bg-surface-raised p-4 shadow-lg"
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        <p className="text-sm text-muted">
          이 서비스는 무료 제공을 위해 광고를 사용합니다. 맞춤 광고와 방문 통계 쿠키 사용에
          동의하시겠어요?{" "}
          <Link href="/cookie-policy" className="underline text-gold">
            쿠키 정책 보기
          </Link>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setConsent("denied")}
            className="flex-1 rounded-lg border border-border-subtle px-4 py-2.5 text-sm font-medium"
          >
            거부
          </button>
          <button
            type="button"
            onClick={() => setConsent("granted")}
            className="flex-1 rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-background"
          >
            동의
          </button>
        </div>
      </div>
    </div>
  );
}
