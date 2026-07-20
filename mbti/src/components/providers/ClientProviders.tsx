"use client";

import { useEffect } from "react";
import { useConsentStore } from "@/stores/consentStore";
import { useHistoryStore } from "@/stores/historyStore";
import { useReadingStore } from "@/stores/readingStore";
import { ConsentBanner } from "@/components/ads/ConsentBanner";
import { AdScriptLoader } from "@/components/ads/AdScriptLoader";
import { AnalyticsLoader } from "@/components/ads/AnalyticsLoader";

/**
 * persist 스토어 rehydrate 트리거 — skipHydration: true 스토어들을
 * 클라이언트 마운트 후에만 복원해 SSR 미스매치를 막는다.
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useReadingStore.persist.rehydrate();
    void useHistoryStore.persist.rehydrate();
    void useConsentStore.persist.rehydrate();
  }, []);

  return (
    <>
      {children}
      <ConsentBanner />
      <AdScriptLoader />
      <AnalyticsLoader />
    </>
  );
}
