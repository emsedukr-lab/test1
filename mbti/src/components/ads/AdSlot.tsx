"use client";

import { useEffect, useRef } from "react";
import { useConsentStore } from "@/stores/consentStore";
import { useStoreHydrated } from "@/stores/hydration";

/**
 * 광고 배치 화이트리스트 — 카드 선택/공개 단계와 주요 CTA 인접 배치용 id는
 * 아예 정의하지 않는 것으로 배치 규칙을 타입 수준에서 강제한다.
 */
export type AdPlacementId =
  | "home-mid"
  | "home-bottom"
  | "card-detail-mid"
  | "card-detail-bottom"
  | "mbti-guide-bottom"
  | "guide-bottom"
  | "result-after-summary"
  | "result-before-actions"
  | "result-bottom";

interface AdSlotProps {
  slot: AdPlacementId;
  /** CLS 방지용 예약 높이(px) — 필수 */
  minHeight: number;
  className?: string;
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({ slot, minHeight, className }: AdSlotProps) {
  const consentStore = useConsentStore;
  const hydrated = useStoreHydrated(consentStore);
  const adConsent = useConsentStore((s) => s.adConsent);
  const pushed = useRef(false);

  const canServe =
    process.env.NODE_ENV === "production" && !!ADSENSE_CLIENT && hydrated && adConsent === "granted";

  useEffect(() => {
    if (!canServe || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle ||= []).push({});
    } catch {
      // 광고 차단 등 — 예약 높이만 유지
    }
  }, [canServe]);

  // 개발 환경: 플레이스홀더
  if (process.env.NODE_ENV !== "production") {
    return (
      <div
        data-ad-slot={slot}
        aria-hidden="true"
        className={`flex items-center justify-center rounded-lg border border-dashed border-border-subtle text-xs text-muted ${className ?? ""}`}
        style={{ minHeight }}
      >
        광고 영역 ({slot})
      </div>
    );
  }

  // 운영이지만 AdSense 미설정: 광고가 영원히 없으므로 공간 자체를 만들지 않는다
  if (!ADSENSE_CLIENT) {
    return null;
  }

  // 운영: 동의 전에는 예약 높이만 가진 중립 박스 (동의 후 로드 시 CLS 방지)
  return (
    <div data-ad-slot={slot} className={className} style={{ minHeight }} aria-hidden={!canServe}>
      {canServe && (
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
