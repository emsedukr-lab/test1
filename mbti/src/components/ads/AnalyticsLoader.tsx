"use client";

import Script from "next/script";
import { useConsentStore } from "@/stores/consentStore";
import { useStoreHydrated } from "@/stores/hydration";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** 동의(granted) 이후에만 GA4를 로드한다 — IP 익명화, 질문 원문 미수집 */
export function AnalyticsLoader() {
  const hydrated = useStoreHydrated(useConsentStore);
  const adConsent = useConsentStore((s) => s.adConsent);

  if (
    process.env.NODE_ENV !== "production" ||
    !GA_ID ||
    !hydrated ||
    adConsent !== "granted"
  ) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
      <Script id="ga-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
