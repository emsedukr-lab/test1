import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { MBTI_TYPES } from "@/types/mbti";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_DESCRIPTION,
          inLanguage: "ko",
        }}
      />

      <section className="py-10 text-center">
        <h1 className="text-3xl font-bold leading-snug">
          내 MBTI에 맞는
          <br />
          <span className="text-gold-strong">타로 한 장</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
          {SITE_DESCRIPTION}
        </p>
        <Link
          href="/reading/mbti"
          className="mt-8 inline-block rounded-2xl bg-gold px-10 py-4 text-base font-bold text-background"
        >
          무료로 리딩 시작하기
        </Link>
        <p className="mt-3 text-xs text-muted">회원가입 없음 · 질문은 서버에 저장되지 않아요</p>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          {
            title: "1. MBTI 선택",
            body: "16개 유형 중 나를 고르면 해석의 결이 달라져요. 몰라도 시작할 수 있어요.",
          },
          {
            title: "2. 카드 직접 선택",
            body: "78장 전체 덱에서 마음 가는 카드를 직접 골라요.",
          },
          {
            title: "3. 맞춤 해석과 행동",
            body: "성향에 맞춘 해석, 강점과 주의점, 이번 주에 해볼 행동까지.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-border-subtle bg-surface p-4">
            <h2 className="text-sm font-bold text-gold-strong">{item.title}</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </section>

      <div className="mt-10">
        <AdSlot slot="home-mid" minHeight={100} />
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold">둘러보기</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Link
            href="/cards"
            className="rounded-xl border border-border-subtle bg-surface p-4 hover:border-gold/50"
          >
            <h3 className="text-sm font-bold text-gold-strong">타로 카드 해설 78장</h3>
            <p className="mt-1 text-xs text-muted">
              메이저 아르카나 22장과 4개 슈트 56장의 의미를 한글로 정리했어요.
            </p>
          </Link>
          <Link
            href="/mbti"
            className="rounded-xl border border-border-subtle bg-surface p-4 hover:border-gold/50"
          >
            <h3 className="text-sm font-bold text-purple-cat">MBTI별 타로 가이드</h3>
            <p className="mt-1 text-xs text-muted">
              {MBTI_TYPES.length}개 유형별로 타로를 더 잘 활용하는 방법을 알려드려요.
            </p>
          </Link>
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-border-subtle bg-surface p-5 text-sm leading-relaxed text-muted">
        <h2 className="font-bold text-foreground">{SITE_TAGLINE}</h2>
        <p className="mt-2">
          이 서비스는 타로를 미래를 확정하는 예언이 아닌 자기성찰의 도구로 다룹니다. 같은 카드라도
          MBTI 성향에 따라 받아들이기 좋은 방식이 다르다는 생각에서 출발했어요. 카드의 상징, 고민
          분야, 카드가 놓인 자리, 그리고 나의 성향을 조합해 지금 나에게 필요한 질문과 행동을
          제안합니다.
        </p>
      </section>

      <div className="mt-10">
        <AdSlot slot="home-bottom" minHeight={250} />
      </div>
    </div>
  );
}
