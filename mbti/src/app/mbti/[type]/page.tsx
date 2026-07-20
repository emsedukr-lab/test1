import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { MBTI_PROFILES } from "@/data/mbti";
import { SITE_NAME } from "@/lib/site";
import { isMbtiType, MBTI_GROUP_NAMES, MBTI_TYPES } from "@/types/mbti";

export const dynamicParams = false;

export function generateStaticParams() {
  return MBTI_TYPES.map((type) => ({ type: type.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const upper = type.toUpperCase();
  if (!isMbtiType(upper)) return {};
  const profile = MBTI_PROFILES[upper];
  return {
    title: `${upper} 타로 가이드 — ${profile.title}`,
    description: `${upper} 유형을 위한 타로 활용법: ${profile.summary}`,
    alternates: { canonical: `/mbti/${type}` },
  };
}

export default async function MbtiGuidePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const upper = type.toUpperCase();
  if (!isMbtiType(upper)) notFound();
  const profile = MBTI_PROFILES[upper];

  return (
    <article className="mx-auto max-w-2xl">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${upper} 타로 가이드 — ${profile.title}`,
          description: profile.summary,
          inLanguage: "ko",
          publisher: { "@type": "Organization", name: SITE_NAME },
        }}
      />
      <nav className="text-xs text-muted" aria-label="브레드크럼">
        <Link href="/mbti" className="hover:text-foreground">
          MBTI 가이드
        </Link>{" "}
        / {upper}
      </nav>

      <h1 className="mt-2 text-2xl font-bold">
        {upper} <span className="text-base font-medium text-gold-strong">{profile.title}</span>
      </h1>
      <p className="mt-1 text-xs text-gold">{MBTI_GROUP_NAMES[profile.group]}</p>
      <p className="mt-3 leading-relaxed">{profile.summary}</p>

      <section className="mt-8 space-y-3">
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <h2 className="text-sm font-bold text-gold-strong">세상을 받아들이는 방식</h2>
          <p className="mt-1.5 text-sm leading-relaxed">{profile.perceptionStyle}</p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <h2 className="text-sm font-bold text-blue-cat">결정을 내리는 방식</h2>
          <p className="mt-1.5 text-sm leading-relaxed">{profile.decisionStyle}</p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <h2 className="text-sm font-bold text-rose">관계를 맺는 방식</h2>
          <p className="mt-1.5 text-sm leading-relaxed">{profile.relationshipStyle}</p>
        </div>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <h2 className="text-sm font-bold text-gold-strong">타로에서 살릴 강점</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {profile.strengths.map((s) => (
              <li key={s}>✦ {s}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <h2 className="text-sm font-bold text-rose">과잉되기 쉬운 패턴</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {profile.overusePatterns.map((o) => (
              <li key={o}>◦ {o}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-border-subtle bg-surface p-4">
        <h2 className="text-sm font-bold text-purple-cat">이 유형에게 잘 맞는 타로 활용법</h2>
        <p className="mt-1.5 text-sm leading-relaxed">{profile.effectiveAdviceStyle}</p>
        <ul className="mt-3 space-y-1.5 text-sm text-muted">
          {profile.balancingPerspectives.map((b) => (
            <li key={b}>· {b}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-xl border border-border-subtle bg-surface p-4">
        <h2 className="text-sm font-bold">스트레스 신호</h2>
        <p className="mt-1 text-xs text-muted">
          이런 패턴이 보이면 카드보다 휴식이 먼저일 수 있어요.
        </p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {profile.stressPatterns.map((s) => (
            <li key={s}>· {s}</li>
          ))}
        </ul>
      </section>

      <div className="mt-8 text-center">
        <Link
          href="/reading/mbti"
          className="inline-block rounded-xl bg-gold px-6 py-3 text-sm font-bold text-background"
        >
          {upper}로 리딩 시작하기
        </Link>
      </div>

      <div className="mt-8">
        <AdSlot slot="mbti-guide-bottom" minHeight={250} />
      </div>
    </article>
  );
}
