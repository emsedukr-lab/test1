"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SPREADS } from "@/data/spreads";
import { selectMbtiDone, useReadingStore } from "@/stores/readingStore";
import { useStoreHydrated } from "@/stores/hydration";

export type WizardStep = "mbti" | "topic" | "spread" | "cards" | "reveal" | "result";

export const STEP_ORDER: readonly WizardStep[] = [
  "mbti",
  "topic",
  "spread",
  "cards",
  "reveal",
  "result",
];

export const STEP_TITLES: Record<WizardStep, string> = {
  mbti: "MBTI 선택",
  topic: "고민 분야",
  spread: "리딩 방식",
  cards: "카드 선택",
  reveal: "카드 공개",
  result: "결과",
};

/** 하이드레이션 후 상태 기준으로, 진입 가능한 가장 앞선 단계를 계산 */
function earliestIncompleteStep(s: {
  mbti: ReturnType<typeof useReadingStore.getState>["mbti"];
  mbtiSkipped: boolean;
  topicId: ReturnType<typeof useReadingStore.getState>["topicId"];
  spreadId: ReturnType<typeof useReadingStore.getState>["spreadId"];
  selectedIndices: number[];
  revealedCount: number;
}): WizardStep {
  if (!selectMbtiDone(s)) return "mbti";
  if (!s.topicId) return "topic";
  if (!s.spreadId) return "spread";
  const required = SPREADS[s.spreadId].cardCount;
  if (s.selectedIndices.length < required) return "cards";
  if (s.revealedCount < required) return "reveal";
  return "result";
}

/**
 * 단계 가드 — 선행 조건이 없으면 가장 앞선 미완료 단계로 replace.
 * 전진 방향으로는 자동 이동하지 않는다 (뒤로 가서 수정하는 흐름 보장).
 */
export function StepGuard({
  step,
  children,
}: {
  step: WizardStep;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useStoreHydrated(useReadingStore);
  const state = useReadingStore();

  const earliest = earliestIncompleteStep(state);
  const stepIndex = STEP_ORDER.indexOf(step);
  const earliestIndex = STEP_ORDER.indexOf(earliest);
  const blocked = hydrated && stepIndex > earliestIndex;

  useEffect(() => {
    if (blocked) {
      router.replace(`/reading/${earliest}`);
    }
  }, [blocked, earliest, router, pathname]);

  if (!hydrated || blocked) {
    return (
      <div className="animate-pulse space-y-4 py-8" aria-busy="true" aria-label="불러오는 중">
        <div className="h-6 w-40 rounded bg-surface" />
        <div className="h-32 rounded bg-surface" />
        <div className="h-32 rounded bg-surface" />
      </div>
    );
  }

  return <>{children}</>;
}
