import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { ALL_CARDS, getCardBySlug, MAJOR_CARDS } from "@/data/cards";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Suit, TarotCard } from "@/types/tarot";

const SUIT_PAGES: Record<string, { name: string; desc: string }> = {
  major: {
    name: "메이저 아르카나",
    desc: "삶의 큰 흐름과 전환점을 다루는 22장입니다. 배열에 메이저가 많다면 지금의 고민이 인생의 중요한 국면과 닿아 있다는 신호일 수 있습니다.",
  },
  wands: {
    name: "완드",
    desc: "불의 슈트 — 열정, 추진력, 일과 도전을 다룹니다. 시작하는 에너지와 그 에너지를 지켜가는 과정을 보여줍니다.",
  },
  cups: {
    name: "컵",
    desc: "물의 슈트 — 감정, 관계, 공감을 다룹니다. 마음이 열리고 흐르고 넘치는 과정을 보여줍니다.",
  },
  swords: {
    name: "소드",
    desc: "공기의 슈트 — 생각, 판단, 갈등과 진실을 다룹니다. 명료함이 주는 힘과 생각 과잉의 그림자를 함께 보여줍니다.",
  },
  pentacles: {
    name: "펜타클",
    desc: "흙의 슈트 — 물질, 현실, 몸과 꾸준함을 다룹니다. 씨앗이 결실이 되기까지의 현실적인 여정을 보여줍니다.",
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...Object.keys(SUIT_PAGES).map((slug) => ({ slug })),
    ...ALL_CARDS.map((card) => ({ slug: card.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (card) {
    return {
      title: `${card.nameKo} (${card.nameEn}) 카드 의미`,
      description: card.summary,
      alternates: { canonical: `/cards/${slug}` },
      openGraph: { images: [card.image] },
    };
  }
  const suit = SUIT_PAGES[slug];
  if (suit) {
    return {
      title: `${suit.name} 카드 목록과 의미`,
      description: suit.desc,
      alternates: { canonical: `/cards/${slug}` },
    };
  }
  return {};
}

function suitCards(slug: string): readonly TarotCard[] {
  if (slug === "major") return MAJOR_CARDS;
  return ALL_CARDS.filter((c) => c.arcana === "minor" && c.suit === (slug as Suit));
}

export default async function CardOrSuitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const suit = SUIT_PAGES[slug];
  if (suit) {
    const cards = suitCards(slug);
    return (
      <div>
        <nav className="text-xs text-muted" aria-label="브레드크럼">
          <Link href="/cards" className="hover:text-foreground">
            카드 해설
          </Link>{" "}
          / {suit.name}
        </nav>
        <h1 className="mt-2 text-2xl font-bold">{suit.name}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{suit.desc}</p>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {cards.map((card) => (
            <Link key={card.id} href={`/cards/${card.slug}`} className="text-center">
              <Image
                src={card.image}
                alt={card.imageAlt}
                width={120}
                height={200}
                className="w-full rounded-lg border border-border-subtle hover:border-gold/50"
              />
              <span className="mt-1 block text-xs text-muted">{card.nameKo}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const card = getCardBySlug(slug);
  if (!card) notFound();

  const suitName = card.arcana === "major" ? "메이저 아르카나" : SUIT_PAGES[card.suit].name;
  const suitSlug = card.arcana === "major" ? "major" : card.suit;

  const meaningSections = [
    { title: "연애와 관계에서", body: card.relationshipMeaning },
    { title: "일과 커리어에서", body: card.careerMeaning },
    { title: "돈과 생활에서", body: card.moneyMeaning },
    { title: "자기이해와 성장에서", body: card.selfGrowthMeaning },
    { title: "선택과 결정에서", body: card.decisionMeaning },
  ];

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${card.nameKo} (${card.nameEn}) 카드 의미`,
          description: card.summary,
          image: `${SITE_URL}${card.image}`,
          inLanguage: "ko",
          publisher: { "@type": "Organization", name: SITE_NAME },
        }}
      />
      <nav className="text-xs text-muted" aria-label="브레드크럼">
        <Link href="/cards" className="hover:text-foreground">
          카드 해설
        </Link>{" "}
        /{" "}
        <Link href={`/cards/${suitSlug}`} className="hover:text-foreground">
          {suitName}
        </Link>{" "}
        / {card.nameKo}
      </nav>

      <div className="mt-4 flex flex-col gap-6 sm:flex-row">
        <Image
          src={card.image}
          alt={card.imageAlt}
          width={240}
          height={400}
          priority
          className="w-40 shrink-0 self-center rounded-xl border border-gold/30 sm:self-start"
        />
        <div>
          <h1 className="text-2xl font-bold">
            {card.nameKo} <span className="text-base font-medium text-muted">{card.nameEn}</span>
          </h1>
          <p className="mt-1 text-xs text-gold">
            {suitName}
            {card.arcana === "major" ? ` · ${card.number}번` : ""}
          </p>
          <p className="mt-3 leading-relaxed">{card.summary}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {card.keywords.map((k) => (
              <span
                key={k}
                className="rounded-full border border-border-subtle bg-surface px-2.5 py-1 text-xs text-muted"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <h2 className="text-sm font-bold text-gold-strong">빛의 의미</h2>
          <p className="mt-1.5 text-sm leading-relaxed">{card.lightMeaning}</p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <h2 className="text-sm font-bold text-rose">그림자 의미</h2>
          <p className="mt-1.5 text-sm leading-relaxed">{card.shadowMeaning}</p>
        </div>
      </section>

      <div className="mt-8">
        <AdSlot slot="card-detail-mid" minHeight={100} />
      </div>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-bold">분야별 해석</h2>
        {meaningSections.map((section) => (
          <div key={section.title} className="rounded-xl border border-border-subtle bg-surface p-4">
            <h3 className="text-sm font-bold text-blue-cat">{section.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed">{section.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <h2 className="text-sm font-bold text-gold-strong">이 카드의 힘</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {card.strengths.map((s) => (
              <li key={s}>✦ {s}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <h2 className="text-sm font-bold text-rose">주의할 점</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {card.cautions.map((c) => (
              <li key={c}>◦ {c}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-purple-cat">이 카드가 건네는 질문</h2>
        <ul className="mt-2 space-y-2">
          {card.reflectionQuestions.map((q) => (
            <li key={q} className="rounded-xl border border-border-subtle bg-surface p-3 text-sm">
              {q}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-blue-cat">해볼 수 있는 행동</h2>
        <ul className="mt-2 space-y-2">
          {card.suggestedActions.map((a) => (
            <li key={a} className="rounded-xl border border-border-subtle bg-surface p-3 text-sm">
              {a}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 text-center">
        <Link
          href="/reading/mbti"
          className="inline-block rounded-xl bg-gold px-6 py-3 text-sm font-bold text-background"
        >
          이 카드가 나올지 리딩 해보기
        </Link>
      </div>

      <div className="mt-8">
        <AdSlot slot="card-detail-bottom" minHeight={250} />
      </div>
    </article>
  );
}
