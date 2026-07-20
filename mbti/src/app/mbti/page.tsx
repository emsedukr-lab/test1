import type { Metadata } from "next";
import Link from "next/link";
import { MBTI_PROFILES } from "@/data/mbti";
import { MBTI_GROUP_NAMES, MBTI_GROUPS, type MbtiGroup } from "@/types/mbti";

export const metadata: Metadata = {
  title: "MBTI별 타로 가이드 — 16개 유형",
  description:
    "16개 MBTI 유형별로 타로를 더 잘 활용하는 방법을 정리했습니다. 유형별 강점, 과잉 패턴, 잘 맞는 질문 방식을 확인해 보세요.",
  alternates: { canonical: "/mbti" },
};

const GROUP_ORDER: readonly MbtiGroup[] = ["analyst", "diplomat", "sentinel", "explorer"];

export default function MbtiIndexPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">MBTI별 타로 가이드</h1>
      <p className="mt-2 text-sm text-muted">
        같은 카드라도 성향에 따라 받아들이기 좋은 방식이 다릅니다. 내 유형의 가이드를 읽어보세요.
      </p>

      {GROUP_ORDER.map((group) => (
        <section key={group} className="mt-8">
          <h2 className="text-sm font-medium text-gold">{MBTI_GROUP_NAMES[group]}</h2>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {MBTI_GROUPS[group].map((type) => {
              const profile = MBTI_PROFILES[type];
              return (
                <Link
                  key={type}
                  href={`/mbti/${type.toLowerCase()}`}
                  className="rounded-xl border border-border-subtle bg-surface p-3 hover:border-gold/50"
                >
                  <span className="block text-base font-bold">{type}</span>
                  <span className="mt-0.5 block text-xs text-gold-strong">{profile.title}</span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
