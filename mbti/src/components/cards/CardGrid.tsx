"use client";

import { memo, useCallback, useRef, useState, useSyncExternalStore } from "react";
import { CardBackFace, CardBackSprite } from "./CardBackSprite";

const DESKTOP_QUERY = "(min-width: 768px)";

function subscribeDesktop(onStoreChange: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

/** 화면 폭에 따른 그리드 열 수 — 키보드 위/아래 이동 계산과 동기화된다 */
function useGridColumns(): number {
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
  return isDesktop ? 13 : 6;
}

interface CardButtonProps {
  deckIndex: number;
  selected: boolean;
  selectionOrder: number | null;
  tabbable: boolean;
  onToggle: (deckIndex: number) => void;
  onFocusIndex: (deckIndex: number) => void;
}

const CardButton = memo(function CardButton({
  deckIndex,
  selected,
  selectionOrder,
  tabbable,
  onToggle,
  onFocusIndex,
}: CardButtonProps) {
  return (
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
      className={`relative aspect-[3/5] min-h-11 w-full rounded-md transition-transform ${
        selected ? "-translate-y-1.5 ring-2 ring-gold" : "hover:-translate-y-0.5"
      } motion-reduce:transition-none motion-reduce:transform-none`}
    >
      <CardBackFace className="h-full w-full" />
      {selected && (
        <span
          aria-hidden="true"
          className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-background"
        >
          {selectionOrder}
        </span>
      )}
    </button>
  );
});

interface CardGridProps {
  deckSize: number;
  selectedIndices: readonly number[];
  requiredCount: number;
  onToggle: (deckIndex: number) => void;
}

/**
 * 78장 뒷면 카드 그리드 — listbox 시맨틱 + roving tabindex.
 * 화살표로 이동, Enter/Space로 선택·해제, Home/End로 처음·끝.
 * 모바일 6열, 데스크톱 13열(78 = 13×6).
 */
export function CardGrid({ deckSize, selectedIndices, requiredCount, onToggle }: CardGridProps) {
  const columns = useGridColumns();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedSet = new Set(selectedIndices);

  const focusCard = useCallback((index: number) => {
    const el = containerRef.current?.querySelector<HTMLButtonElement>(
      `[data-deck-index="${index}"]`,
    );
    el?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let next: number | null = null;
    switch (e.key) {
      case "ArrowRight":
        next = Math.min(deckSize - 1, activeIndex + 1);
        break;
      case "ArrowLeft":
        next = Math.max(0, activeIndex - 1);
        break;
      case "ArrowDown":
        next = Math.min(deckSize - 1, activeIndex + columns);
        break;
      case "ArrowUp":
        next = Math.max(0, activeIndex - columns);
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
    if (next !== null && next !== activeIndex) {
      setActiveIndex(next);
      focusCard(next);
    }
  };

  return (
    <div>
      <CardBackSprite />
      <div
        ref={containerRef}
        role="listbox"
        aria-multiselectable="true"
        aria-label={`타로 카드 ${deckSize}장 중 ${requiredCount}장을 선택하세요`}
        onKeyDown={handleKeyDown}
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: deckSize }, (_, i) => (
          <CardButton
            key={i}
            deckIndex={i}
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
