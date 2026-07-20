"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LiveRegion } from "@/components/a11y/LiveRegion";
import { CardBackFace, CardBackSprite } from "@/components/cards/CardBackSprite";
import { StepGuard } from "@/components/wizard/StepGuard";
import { getCardById } from "@/data/cards";
import { SPREADS } from "@/data/spreads";
import { selectDrawnCardIds, useReadingStore } from "@/stores/readingStore";

export function RevealStep() {
  const router = useRouter();
  const spreadId = useReadingStore((s) => s.spreadId);
  const deckOrder = useReadingStore((s) => s.deckOrder);
  const selectedIndices = useReadingStore((s) => s.selectedIndices);
  const revealedCount = useReadingStore((s) => s.revealedCount);
  const revealNext = useReadingStore((s) => s.revealNext);
  const revealAll = useReadingStore((s) => s.revealAll);

  const spread = spreadId ? SPREADS[spreadId] : null;
  const cardIds = selectDrawnCardIds({ deckOrder, selectedIndices });
  const allRevealed = revealedCount >= cardIds.length && cardIds.length > 0;

  const lastRevealed =
    revealedCount > 0 ? getCardById(cardIds[revealedCount - 1])?.nameKo : null;

  return (
    <StepGuard step="reveal">
      <h1 className="text-xl font-bold">카드를 한 장씩 공개해 보세요</h1>
      <p className="mt-1 text-sm text-muted">
        카드를 누르면 앞면이 공개됩니다. ({revealedCount}/{cardIds.length})
      </p>
      <LiveRegion
        message={
          lastRevealed
            ? `${revealedCount}번째 카드 공개: ${lastRevealed}`
            : "아직 공개된 카드가 없습니다"
        }
      />

      <CardBackSprite />
      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-3">
        {cardIds.map((cardId, i) => {
          const card = getCardById(cardId);
          const isRevealed = i < revealedCount;
          const position = spread?.positions[i];
          if (!card || !position) return null;
          return (
            <div key={cardId} className="text-center">
              <button
                type="button"
                disabled={isRevealed || i > revealedCount}
                onClick={revealNext}
                aria-label={
                  isRevealed
                    ? `${position.titleKo}: ${card.nameKo}`
                    : `${position.titleKo} 자리 카드 공개하기`
                }
                className={`flip block w-full ${isRevealed ? "is-revealed" : ""} ${
                  i === revealedCount ? "ring-2 ring-gold rounded-md" : ""
                }`}
              >
                <div className="flip-inner aspect-[3/5] w-full">
                  <div className="flip-face">
                    <CardBackFace className="h-full w-full" />
                  </div>
                  <div className="flip-face flip-front overflow-hidden rounded-md border border-gold/40 bg-surface">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      width={120}
                      height={200}
                      className="h-full w-full object-cover"
                      priority={i === 0}
                    />
                  </div>
                </div>
              </button>
              <p className="mt-1.5 text-xs text-muted">{position.titleKo}</p>
              {isRevealed && <p className="text-xs font-bold text-gold-strong">{card.nameKo}</p>}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex gap-2">
        {!allRevealed && (
          <button
            type="button"
            onClick={revealAll}
            className="rounded-xl border border-border-subtle px-4 py-3 text-sm font-medium"
          >
            모두 공개
          </button>
        )}
        <button
          type="button"
          disabled={!allRevealed}
          onClick={() => router.push("/reading/result")}
          className="flex-1 rounded-xl bg-gold px-4 py-3 text-sm font-bold text-background disabled:opacity-40"
        >
          해석 보기
        </button>
      </div>
    </StepGuard>
  );
}
