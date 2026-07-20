"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LiveRegion } from "@/components/a11y/LiveRegion";
import { CardGrid } from "@/components/cards/CardGrid";
import { StepGuard } from "@/components/wizard/StepGuard";
import { DECK_SIZE } from "@/lib/deck";
import { SPREADS } from "@/data/spreads";
import { useStoreHydrated } from "@/stores/hydration";
import { useReadingStore } from "@/stores/readingStore";
import { track } from "@/lib/analytics";

export function CardsStep() {
  const router = useRouter();
  const spreadId = useReadingStore((s) => s.spreadId);
  const deckOrder = useReadingStore((s) => s.deckOrder);
  const selectedIndices = useReadingStore((s) => s.selectedIndices);
  const revealedCount = useReadingStore((s) => s.revealedCount);
  const toggleCard = useReadingStore((s) => s.toggleCard);
  const ensureShuffled = useReadingStore((s) => s.ensureShuffled);
  const reshuffle = useReadingStore((s) => s.reshuffle);

  const hydrated = useStoreHydrated(useReadingStore);
  const required = spreadId ? SPREADS[spreadId].cardCount : 0;
  const done = selectedIndices.length === required;
  const revealed = revealedCount > 0;

  // 새로고침으로 덱이 비어 있으면 복구 (멱등).
  // 반드시 하이드레이션 완료 후에만 — 그 전에 set()이 실행되면
  // persist가 초기 상태로 저장소를 덮어써 진행 상태가 날아간다.
  useEffect(() => {
    if (hydrated && deckOrder.length === 0) ensureShuffled();
  }, [hydrated, deckOrder.length, ensureShuffled]);

  return (
    <StepGuard step="cards">
      <h1 className="text-xl font-bold">마음이 가는 카드를 골라 주세요</h1>
      <p className="mt-1 text-sm text-muted" aria-live="polite">
        {required}장 중 {selectedIndices.length}장 선택
        {done ? " — 준비 완료!" : ""}
      </p>
      <LiveRegion
        message={
          revealed
            ? "카드가 이미 공개되었습니다. 다시 뽑으려면 다시 뽑기 버튼을 사용하세요."
            : `${required}장 중 ${selectedIndices.length}장 선택됨`
        }
      />

      {revealed ? (
        <div className="mt-6 rounded-xl border border-border-subtle bg-surface p-4 text-sm">
          <p>이미 카드를 공개했습니다. 선택을 바꾸려면 처음부터 다시 뽑아야 해요.</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={reshuffle}
              className="rounded-lg border border-border-subtle px-4 py-2 text-sm font-medium"
            >
              다시 뽑기
            </button>
            <button
              type="button"
              onClick={() => router.push("/reading/result")}
              className="flex-1 rounded-lg bg-gold px-4 py-2 text-sm font-bold text-background"
            >
              결과 다시 보기
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <CardGrid
            deckSize={DECK_SIZE}
            selectedIndices={selectedIndices}
            requiredCount={required}
            onToggle={toggleCard}
          />
        </div>
      )}

      {!revealed && (
        <div className="sticky bottom-0 mt-6 flex gap-2 bg-background/95 py-3 backdrop-blur">
          <button
            type="button"
            onClick={() => router.push("/reading/spread")}
            className="rounded-xl border border-border-subtle px-4 py-3 text-sm font-medium"
          >
            이전
          </button>
          <button
            type="button"
            disabled={!done}
            onClick={() => {
              track("cards_selected", { count: required });
              router.push("/reading/reveal");
            }}
            className="flex-1 rounded-xl bg-gold px-4 py-3 text-sm font-bold text-background disabled:opacity-40"
          >
            {done ? "카드 공개하기" : `${required - selectedIndices.length}장 더 선택`}
          </button>
        </div>
      )}
    </StepGuard>
  );
}
