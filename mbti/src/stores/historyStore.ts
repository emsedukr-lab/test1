"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeStorage } from "@/lib/storage";
import type { ReadingRecord } from "@/types/reading";

const MAX_RECORDS = 50;

export function isValidRecord(r: unknown): r is ReadingRecord {
  if (typeof r !== "object" || r === null) return false;
  const record = r as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    record.v === 1 &&
    typeof record.createdAt === "string" &&
    (record.mbti === null || typeof record.mbti === "string") &&
    typeof record.topicId === "string" &&
    typeof record.question === "string" &&
    typeof record.spreadId === "string" &&
    Array.isArray(record.cardIds) &&
    record.cardIds.every((c) => typeof c === "string")
  );
}

interface HistoryState {
  records: ReadingRecord[];
  addRecord: (record: ReadingRecord) => void;
  removeRecord: (id: string) => void;
  clearAll: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (record) => {
        if (!isValidRecord(record)) return;
        const rest = get().records.filter((r) => r.id !== record.id);
        set({ records: [record, ...rest].slice(0, MAX_RECORDS) });
      },

      removeRecord: (id) => set({ records: get().records.filter((r) => r.id !== id) }),

      clearAll: () => set({ records: [] }),
    }),
    {
      name: "mt.history.v1",
      version: 1,
      storage: createJSONStorage(() => safeStorage(() => localStorage)),
      skipHydration: true,
      // 손상된 개별 레코드는 걸러내고 나머지는 살린다
      merge: (persisted, current) => {
        const p = persisted as Partial<HistoryState> | undefined;
        const records = Array.isArray(p?.records) ? p.records.filter(isValidRecord) : [];
        return { ...current, records };
      },
      migrate: (state, version) => {
        // 알 수 없는 구버전은 폐기 (v1이 첫 버전)
        if (version < 1) return { records: [] };
        return state as HistoryState;
      },
    },
  ),
);
