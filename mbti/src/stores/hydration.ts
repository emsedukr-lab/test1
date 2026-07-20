"use client";

import { useSyncExternalStore } from "react";

interface PersistApi {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (fn: () => void) => () => void;
  };
}

/**
 * persist 스토어의 하이드레이션 완료 여부.
 * persisted 값을 읽는 UI는 hydrated 전에는 스켈레톤을 렌더해
 * 서버 HTML(초기 상태)과의 미스매치를 막는다.
 */
export function useStoreHydrated(store: PersistApi): boolean {
  return useSyncExternalStore(
    (onStoreChange) => store.persist.onFinishHydration(onStoreChange),
    () => store.persist.hasHydrated(),
    () => false,
  );
}
