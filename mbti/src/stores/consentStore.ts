"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeStorage } from "@/lib/storage";

export type AdConsent = "unknown" | "granted" | "denied";

interface ConsentState {
  adConsent: AdConsent;
  decidedAt: string | null;
  setConsent: (consent: Exclude<AdConsent, "unknown">) => void;
  resetConsent: () => void;
}

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      adConsent: "unknown",
      decidedAt: null,

      setConsent: (consent) => set({ adConsent: consent, decidedAt: new Date().toISOString() }),

      resetConsent: () => set({ adConsent: "unknown", decidedAt: null }),
    }),
    {
      name: "mt.consent.v1",
      version: 1,
      storage: createJSONStorage(() => safeStorage(() => localStorage)),
      skipHydration: true,
    },
  ),
);
