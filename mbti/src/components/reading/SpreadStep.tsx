"use client";

import { useRouter } from "next/navigation";
import { StepGuard } from "@/components/wizard/StepGuard";
import { SPREADS } from "@/data/spreads";
import { getTopic } from "@/data/topics";
import { useReadingStore } from "@/stores/readingStore";

export function SpreadStep() {
  const router = useRouter();
  const topicId = useReadingStore((s) => s.topicId);
  const spreadId = useReadingStore((s) => s.spreadId);
  const setSpread = useReadingStore((s) => s.setSpread);
  const ensureShuffled = useReadingStore((s) => s.ensureShuffled);

  const topic = topicId ? getTopic(topicId) : null;
  const available = topic ? topic.allowedSpreads.map((id) => SPREADS[id]) : [];

  const next = () => {
    ensureShuffled();
    router.push("/reading/cards");
  };

  return (
    <StepGuard step="spread">
      <h1 className="text-xl font-bold">리딩 방식을 선택해 주세요</h1>
      {topic && (
        <p className="mt-1 text-sm text-muted">
          &lsquo;{topic.nameKo}&rsquo; 분야에서 사용할 수 있는 방식입니다.
        </p>
      )}

      <div className="mt-6 space-y-2">
        {available.map((spread) => {
          const selected = spreadId === spread.id;
          return (
            <button
              key={spread.id}
              type="button"
              onClick={() => setSpread(spread.id)}
              aria-pressed={selected}
              className={`w-full rounded-xl border p-4 text-left transition-colors ${
                selected
                  ? "border-gold bg-surface-raised"
                  : "border-border-subtle bg-surface hover:border-gold/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">{spread.nameKo}</span>
                <span className="text-xs text-gold">{spread.cardCount}장</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted">{spread.description}</p>
              <p className="mt-2 text-xs text-muted/80">
                {spread.positions.map((p) => p.titleKo).join(" · ")}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex gap-2">
        <button
          type="button"
          onClick={() => router.push("/reading/topic")}
          className="rounded-xl border border-border-subtle px-4 py-3 text-sm font-medium"
        >
          이전
        </button>
        <button
          type="button"
          disabled={!spreadId}
          onClick={next}
          className="flex-1 rounded-xl bg-gold px-4 py-3 text-sm font-bold text-background disabled:opacity-40"
        >
          다음 — 카드 뽑기
        </button>
      </div>
    </StepGuard>
  );
}
