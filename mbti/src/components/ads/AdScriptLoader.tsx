"use client";

import Script from "next/script";
import { useConsentStore } from "@/stores/consentStore";
import { useStoreHydrated } from "@/stores/hydration";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/** 동의(granted) 이후에만 AdSense 스크립트를 1회 주입한다 */
export function AdScriptLoader() {
  const hydrated = useStoreHydrated(useConsentStore);
  const adConsent = useConsentStore((s) => s.adConsent);

  if (
    process.env.NODE_ENV !== "production" ||
    !ADSENSE_CLIENT ||
    !hydrated ||
    adConsent !== "granted"
  ) {
    return null;
  }

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      strategy="lazyOnload"
      crossOrigin="anonymous"
    />
  );
}
