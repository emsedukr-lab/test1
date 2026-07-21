"use client";

import { memo, useCallback, useRef, useState, useSyncExternalStore } from "react";
import { CardBackFace, CardBackSprite } from "./CardBackSprite";

const DESKTOP_QUERY = "(min-width: 768px)";

function subscribeDesktop(onStoreChange: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

interface FanLayout {
  /** 부채꼴별 카드 수 — 합이 78 */
  rows: number[];
  cardW: number;
  cardH: number;
  /** 회전 피벗까지의 반지름(px) */
  radius: number;
  /** 반각(도) — 카드가 ±maxAngle 사이에 펼쳐진다 */
  maxAngle: number;
  /** 부채꼴 행 사이 겹침(px, 모바일) */
  rowOverlap: number;
}

const DESKTOP_LAYOUT: FanLayout = {
  rows: [78],
  cardW: 76,
  cardH: 127,
  radius: 290,
  maxAngle: 80,
  rowOverlap: 0,
};

const MOBILE_LAYOUT: FanLayout = {
  rows: [20, 20, 19, 19],
  cardW: 60,
  cardH: 100,
  radius: 185,
  maxAngle: 46,
  rowOverlap: 58,
};

function useFanLayout(): FanLayout {
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
  return isDesktop ? DESKTOP_LAYOUT : MOBILE_LAYOUT;
}

interface FanCardProps {
  deckIndex: number;
  angle: number;
  layout: FanLayout;
  selected: boolean;
  selectionOrder: number | null;
  tabbable: boolean;
  onToggle: (deckIndex: number) => void;
  onFocusIndex: (deckIndex: number) => void;
}

const FanCard = memo(function FanCard({
  deckIndex,
  angle,
  layout,
  selected,
  selectionOrder,
  tabbable,
  onToggle,
  onFocusIndex,
}: FanCardProps) {
  return (
    <div
      className={`absolute left-1/2 top-0 transition-transform hover:z-40 focus-within:z-40 motion-reduce:transition-none ${
        selected ? "z-30" : ""
      }`}
      style={{
        width: layout.cardW,
        height: layout.cardH,
        marginLeft: -layout.cardW / 2,
        transformOrigin: `50% ${layout.radius}px`,
        transform: `rotate(${angle}deg)`,
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
        className={`relative block h-full w-full rounded-md transition-transform motion-reduce:transition-none ${
          selected
            ? "-translate-y-5 ring-2 ring-gold drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)]"
            : "hover:-translate-y-2.5 focus-visible:-translate-y-2.5"
        }`}
      >
        <CardBackFace className="h-full w-full" />
        {selected && (
          <span
            aria-hidden="true"
            className="absolute -top-1.5 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-background"
          >
            {selectionOrder}
          </span>
        )}
      </button>
    </div>
  );
});

interface CardFanProps {
  deckSize: number;
  selectedIndices: readonly number[];
  requiredCount: number;
  onToggle: (deckIndex: number) => void;
}

/**
 * 부채꼴 스프레드 — 스크롤 없이 전체 78장이 한 화면에 보인다.
 * 데스크톱: 큰 부채꼴 1개(±80°), 모바일: 부채꼴 4단(20+20+19+19)이 겹쳐 쌓임.
 * listbox 시맨틱 + roving tabindex (←/→/↑/↓, Home/End, Enter/Space).
 */
export function CardFan({ deckSize, selectedIndices, requiredCount, onToggle }: CardFanProps) {
  const layout = useFanLayout();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedSet = new Set(selectedIndices);

  const focusCard = useCallback((index: number) => {
    containerRef.current
      ?.querySelector<HTMLButtonElement>(`[data-deck-index="${index}"]`)
      ?.focus();
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

  // 부채꼴 한 단의 높이: 아치 하강분 + 카드 높이 + 팝업 여유
  const arcDrop = layout.radius * (1 - Math.cos((layout.maxAngle * Math.PI) / 180));
  const rowHeight = arcDrop + layout.cardH + 8;

  let deckOffset = 0;
  const rows = layout.rows.map((count) => {
    const start = deckOffset;
    deckOffset += count;
    return { start, count };
  });

  return (
    <div className="overflow-x-clip">
      <CardBackSprite />
      <p className="mb-1 text-center text-xs text-muted" aria-hidden="true">
        겹쳐 있는 부채에서 마음이 가는 카드를 골라보세요
      </p>
      <div
        ref={containerRef}
        role="listbox"
        aria-multiselectable="true"
        aria-label={`타로 카드 ${deckSize}장 부채꼴 — ${requiredCount}장을 선택하세요`}
        onKeyDown={handleKeyDown}
        className="pt-7"
      >
        {rows.map(({ start, count }, rowIdx) => (
          <div
            key={rowIdx}
            className="relative"
            style={{
              height: rowHeight,
              marginTop: rowIdx === 0 ? 0 : -layout.rowOverlap,
            }}
          >
            {Array.from({ length: count }, (_, i) => {
              const deckIndex = start + i;
              const t = count === 1 ? 0 : i / (count - 1) - 0.5;
              return (
                <FanCard
                  key={deckIndex}
                  deckIndex={deckIndex}
                  angle={t * 2 * layout.maxAngle}
                  layout={layout}
                  selected={selectedSet.has(deckIndex)}
                  selectionOrder={
                    selectedSet.has(deckIndex) ? selectedIndices.indexOf(deckIndex) + 1 : null
                  }
                  tabbable={deckIndex === activeIndex}
                  onToggle={onToggle}
                  onFocusIndex={setActiveIndex}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
