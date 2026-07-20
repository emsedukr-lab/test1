"use client";

import { usePathname } from "next/navigation";
import { STEP_ORDER, STEP_TITLES, type WizardStep } from "./StepGuard";

/** 리딩 진행 표시 — 스크린리더가 현재 단계를 읽을 수 있게 한다 */
export function WizardProgress() {
  const pathname = usePathname();
  const current = (pathname.split("/").pop() ?? "mbti") as WizardStep;
  const currentIndex = Math.max(0, STEP_ORDER.indexOf(current));

  return (
    <nav aria-label="리딩 진행 단계" className="mb-6">
      <p className="sr-only">
        {STEP_ORDER.length}단계 중 {currentIndex + 1}단계: {STEP_TITLES[current] ?? ""}
      </p>
      <ol className="flex items-center gap-1.5">
        {STEP_ORDER.map((step, i) => (
          <li key={step} className="flex-1">
            <span
              aria-current={i === currentIndex ? "step" : undefined}
              title={STEP_TITLES[step]}
              className={`block h-1.5 rounded-full ${
                i < currentIndex ? "bg-gold/60" : i === currentIndex ? "bg-gold" : "bg-surface-raised"
              }`}
            />
          </li>
        ))}
      </ol>
      <p aria-hidden="true" className="mt-2 text-sm font-medium text-muted">
        {currentIndex + 1}/{STEP_ORDER.length} · {STEP_TITLES[current] ?? ""}
      </p>
    </nav>
  );
}
