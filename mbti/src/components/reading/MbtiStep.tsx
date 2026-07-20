"use client";

import { useRouter } from "next/navigation";
import { StepGuard } from "@/components/wizard/StepGuard";
import { MBTI_PROFILES } from "@/data/mbti";
import type { MbtiGroup, MbtiType } from "@/types/mbti";
import { MBTI_GROUP_NAMES, MBTI_GROUPS } from "@/types/mbti";
import { useReadingStore } from "@/stores/readingStore";

const GROUP_ORDER: readonly MbtiGroup[] = ["analyst", "diplomat", "sentinel", "explorer"];

export function MbtiStep() {
  const router = useRouter();
  const mbti = useReadingStore((s) => s.mbti);
  const setMbti = useReadingStore((s) => s.setMbti);

  const choose = (type: MbtiType | null, skipped = false) => {
    setMbti(type, skipped);
    router.push("/reading/topic");
  };

  return (
    <StepGuard step="mbti">
      <h1 className="text-xl font-bold">내 MBTI를 선택해 주세요</h1>
      <p className="mt-1 text-sm text-muted">
        선택한 유형에 맞춰 해석과 행동 조언의 결이 달라집니다.
      </p>

      {GROUP_ORDER.map((group) => (
        <section key={group} className="mt-6">
          <h2 className="mb-2 text-sm font-medium text-gold">{MBTI_GROUP_NAMES[group]}</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {MBTI_GROUPS[group].map((type) => {
              const profile = MBTI_PROFILES[type];
              const selected = mbti === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => choose(type)}
                  aria-pressed={selected}
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    selected
                      ? "border-gold bg-surface-raised"
                      : "border-border-subtle bg-surface hover:border-gold/50"
                  }`}
                >
                  <span className="block text-base font-bold">{type}</span>
                  <span className="mt-0.5 block text-xs font-medium text-gold-strong">
                    {profile.title}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">
                    {profile.summary}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <div className="mt-8 space-y-2">
        <button
          type="button"
          onClick={() => choose(null, true)}
          className="w-full rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm font-medium hover:border-gold/50"
        >
          MBTI 없이 시작하기
        </button>
        <p className="text-center text-xs text-muted">
          MBTI를 모르시면 없이 시작해도 좋아요 — 일반 해석으로 제공됩니다.
        </p>
      </div>
    </StepGuard>
  );
}
