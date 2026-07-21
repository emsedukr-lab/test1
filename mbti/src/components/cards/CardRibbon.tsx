"use client";

import { memo, useCallback, useRef, useState } from "react";
import { CardBackFace, CardBackSprite } from "./CardBackSprite";

/** 카드 폭(px) — aspect 3/5로 높이 약 127px */
const CARD_WIDTH = 76;
/** 겹침(px) — 보이는 폭 44px가 터치 최소 영역을 만족한다 */
const OVERLAP = 32;
/** 리본 아치: 가장자리로 갈수록 내려가고 살짝 기운다 */
const ARC_DROP = 18;
const ARC_TILT = 7;

interface RibbonCardProps {
  deckIndex: number;
  total: number;
  selected: boolean;
  selectionOrder: number | null;
  tabbable: boolean;
  onToggle: (deckIndex: number) => void;
  onFocusIndex: (deckIndex: number) => void;
}

const RibbonCard = memo(function RibbonCard({
  deckIndex,
  total,
  selected,
  selectionOrder,
  tabbable,
  onToggle,
  onFocusIndex,
}: RibbonCardProps) {
  // -0.5(왼끝) ~ 0.5(오른끝)
  const t = deckIndex / (total - 1) - 0.5;
  const drop = t * t * 4 * ARC_DROP;
  const tilt = t * 2 * ARC_TILT;

  return (
    <div
      className={`relative shrink-0 transition-transform first:!ml-0 hover:z-40 focus-within:z-40 motion-reduce:transition-none ${
        selected ? "z-30" : ""
      }`}
      style={{
        marginLeft: -OVERLAP,
        transform: `translateY(${drop}px) rotate(${tilt}deg)`,
      }}
    >
      <button
        type="button"
        role="option"
        aria-selected={selected}
        aria-label={`${deckIndex + 1}번째 카드${selected ? `, ${selectionOrder}번째로 선택됨` : ""}`}
        data-testid={`card-${deckIndex}`}
        data-deck-index={deckIndex}
        tabIndex={tabbable ? 0 : -1}
        onClick={() => onToggle(deckIndex)}
        onFocus={() => onFocusIndex(deckIndex)}
        className={`relative block aspect-[3/5] rounded-md transition-transform motion-reduce:transition-none ${
          selected
            ? "-translate-y-4 ring-2 ring-gold drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
            : "hover:-translate-y-2 focus-visible:-translate-y-2"
        }`}
        style={{ width: CARD_WIDTH }}
      >
        <CardBackFace className="h-full w-full" />
        {selected && (
          <span
            aria-hidden="true"
            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-background"
          >
            {selectionOrder}
          </span>
        )}
      </button>
    </div>
  );
});

interface CardRibbonProps {
  deckSize: number;
  selectedIndices: readonly number[];
  requiredCount: number;
  onToggle: (deckIndex: number) => void;
}

/**
 * 리본 스프레드 — 78장이 서로 겹친 채 가로로 길게 펼쳐지고,
 * 좌우 스크롤로 훑으며 겹친 틈에서 카드를 뽑는다.
 * listbox 시맨틱 + roving tabindex (←/→/↑/↓, Home/End, Enter/Space).
 */
export function CardRibbon({
  deckSize,
  selectedIndices,
  requiredCount,
  onToggle,
}: CardRibbonProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedSet = new Set(selectedIndices);

  const focusCard = useCallback((index: number) => {
    const el = containerRef.current?.querySelector<HTMLButtonElement>(
      `[data-deck-index="${index}"]`,
    );
    el?.focus();
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let next: number | null = null;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = Math.min(deckSize - 1, activeIndex + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = Math.max(0, activeIndex - 1);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = deckSize - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    if (next !== activeIndex) {
      setActiveIndex(next);
      focusCard(next);
    }
  };

  return (
    <div>
      <CardBackSprite />
      <p className="mb-2 text-center text-xs text-muted" aria-hidden="true">
        ← 좌우로 넘기며 마음이 가는 카드를 골라보세요 →
      </p>
      <div
        ref={containerRef}
        role="listbox"
        aria-multiselectable="true"
        aria-label={`타로 카드 ${deckSize}장 리본 — ${requiredCount}장을 선택하세요`}
        onKeyDown={handleKeyDown}
        className="flex overflow-x-auto px-4 pt-6 pb-8"
        style={{ overscrollBehaviorX: "contain", scrollbarWidth: "thin" }}
      >
        {Array.from({ length: deckSize }, (_, i) => (
          <RibbonCard
            key={i}
            deckIndex={i}
            total={deckSize}
            selected={selectedSet.has(i)}
            selectionOrder={selectedSet.has(i) ? selectedIndices.indexOf(i) + 1 : null}
            tabbable={i === activeIndex}
            onToggle={onToggle}
            onFocusIndex={setActiveIndex}
          />
        ))}
      </div>
    </div>
  );
}
