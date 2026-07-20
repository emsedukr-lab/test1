"use client";

/** 시각적으로 숨긴 aria-live 영역 — 카드 선택 상태를 스크린리더에 알린다 */
export function LiveRegion({ message }: { message: string }) {
  return (
    <div aria-live="polite" role="status" className="sr-only">
      {message}
    </div>
  );
}
