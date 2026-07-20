"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { shuffleDeck, shuffleOrientations } from "@/lib/deck";
import { safeStorage } from "@/lib/storage";
import type { MbtiType } from "@/types/mbti";
import type { SpreadId, TopicId } from "@/types/reading";
import { SPREADS } from "@/data/spreads";

interface ReadingState {
  // 입력
  mbti: MbtiType | null;
  /** 'MBTI 없이 시작하기'를 명시적으로 선택했는지 (null과 구분) */
  mbtiSkipped: boolean;
  topicId: TopicId | null;
  question: string;
  spreadId: SpreadId | null;
  /** 역방향 카드 포함 여부 (기본 꺼짐) */
  includeReversed: boolean;
  // 덱 — 셔플 순서는 세션 내 유지 (sessionStorage persist)
  deckOrder: string[];
  /** 덱 인덱스별 역방향 여부 (includeReversed일 때만 적용) */
  orientations: boolean[];
  /** 선택한 덱 인덱스, 선택한 순서대로 */
  selectedIndices: number[];
  /** 공개 단계 진행도 */
  revealedCount: number;
  readingId: string | null;
  startedAt: string | null;

  // 액션
  setMbti: (mbti: MbtiType | null, skipped?: boolean) => void;
  setTopic: (topicId: TopicId) => void;
  setQuestion: (question: string) => void;
  setSpread: (spreadId: SpreadId) => void;
  setIncludeReversed: (include: boolean) => void;
  /** deckOrder가 비어 있을 때만 셔플 (멱등 — 새로고침 시 유지) */
  ensureShuffled: () => void;
  reshuffle: () => void;
  toggleCard: (deckIndex: number) => void;
  revealNext: () => void;
  revealAll: () => void;
  reset: () => void;
}

const initialData = {
  mbti: null as MbtiType | null,
  mbtiSkipped: false,
  topicId: null as TopicId | null,
  question: "",
  spreadId: null as SpreadId | null,
  includeReversed: false,
  deckOrder: [] as string[],
  orientations: [] as boolean[],
  selectedIndices: [] as number[],
  revealedCount: 0,
  readingId: null as string | null,
  startedAt: null as string | null,
};

export const useReadingStore = create<ReadingState>()(
  persist(
    (set, get) => ({
      ...initialData,

      setMbti: (mbti, skipped = false) => set({ mbti, mbtiSkipped: mbti === null ? skipped : false }),

      setTopic: (topicId) => set({ topicId }),

      setQuestion: (question) => set({ question: question.slice(0, 300) }),

      setSpread: (spreadId) => {
        const prev = get().spreadId;
        if (prev === spreadId) return;
        // 스프레드 변경 시 선택·공개 상태 초기화 (덱 순서는 유지)
        set({ spreadId, selectedIndices: [], revealedCount: 0, readingId: null });
      },

      setIncludeReversed: (include) => {
        if (get().revealedCount > 0) return; // 공개 후 변경 불가
        set({ includeReversed: include });
      },

      ensureShuffled: () => {
        if (get().deckOrder.length === 0) {
          set({ deckOrder: shuffleDeck(), orientations: shuffleOrientations() });
        }
      },

      reshuffle: () =>
        set({
          deckOrder: shuffleDeck(),
          orientations: shuffleOrientations(),
          selectedIndices: [],
          revealedCount: 0,
          readingId: null,
        }),

      toggleCard: (deckIndex) => {
        const { selectedIndices, spreadId, revealedCount } = get();
        if (revealedCount > 0) return; // 공개 시작 후에는 변경 불가
        const required = spreadId ? SPREADS[spreadId].cardCount : 0;
        if (selectedIndices.includes(deckIndex)) {
          set({ selectedIndices: selectedIndices.filter((i) => i !== deckIndex) });
        } else if (selectedIndices.length < required) {
          const next = [...selectedIndices, deckIndex];
          set({
            selectedIndices: next,
            readingId: get().readingId ?? crypto.randomUUID(),
            startedAt: get().startedAt ?? new Date().toISOString(),
          });
        }
      },

      revealNext: () => {
        const { revealedCount, selectedIndices } = get();
        if (revealedCount < selectedIndices.length) set({ revealedCount: revealedCount + 1 });
      },

      revealAll: () => set({ revealedCount: get().selectedIndices.length }),

      reset: () => set({ ...initialData }),
    }),
    {
      name: "mt.reading.v1",
      version: 1,
      storage: createJSONStorage(() => safeStorage(() => sessionStorage)),
      skipHydration: true,
      partialize: (s) => ({
        mbti: s.mbti,
        mbtiSkipped: s.mbtiSkipped,
        topicId: s.topicId,
        question: s.question,
        spreadId: s.spreadId,
        includeReversed: s.includeReversed,
        deckOrder: s.deckOrder,
        orientations: s.orientations,
        selectedIndices: s.selectedIndices,
        revealedCount: s.revealedCount,
        readingId: s.readingId,
        startedAt: s.startedAt,
      }),
    },
  ),
);

/** 선택 순서대로의 카드 id 목록 (스프레드 위치 순서) */
export function selectDrawnCardIds(s: Pick<ReadingState, "deckOrder" | "selectedIndices">): string[] {
  return s.selectedIndices.map((i) => s.deckOrder[i]).filter(Boolean);
}

/** 선택 순서대로의 역방향 여부 — '역방향 포함'이 꺼져 있으면 전부 정방향 */
export function selectReversedFlags(
  s: Pick<ReadingState, "selectedIndices" | "orientations" | "includeReversed">,
): boolean[] {
  return s.selectedIndices.map((i) => (s.includeReversed ? (s.orientations[i] ?? false) : false));
}

/** MBTI 단계 완료 여부 — 선택했거나 명시적으로 건너뜀 */
export function selectMbtiDone(s: Pick<ReadingState, "mbti" | "mbtiSkipped">): boolean {
  return s.mbti !== null || s.mbtiSkipped;
}
