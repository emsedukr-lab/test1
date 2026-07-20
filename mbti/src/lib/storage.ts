import type { StateStorage } from "zustand/middleware";

/**
 * 프라이빗 모드·쿼터 초과·손상 데이터에서도 앱이 죽지 않는 스토리지 래퍼.
 * getStorage 콜백은 지연 실행 — SSR 시점에는 호출되지 않는다 (skipHydration과 함께 사용).
 */
export function safeStorage(getStorage: () => Storage): StateStorage {
  return {
    getItem: (name) => {
      try {
        return getStorage().getItem(name);
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        getStorage().setItem(name, value);
      } catch {
        // 쿼터 초과 등 — 조용히 무시 (기능은 메모리 상태로 계속 동작)
      }
    },
    removeItem: (name) => {
      try {
        getStorage().removeItem(name);
      } catch {
        // 무시
      }
    },
  };
}
