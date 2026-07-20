import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MAJOR_CARDS } from "@/data/cards";

export const metadata: Metadata = {
  title: "타로 카드 해설 — 78장 전체 목록",
  description:
    "메이저 아르카나 22장과 완드·컵·소드·펜타클 슈트 56장, 타로 카드 78장 전체의 의미를 한글로 정리했습니다.",
  alternates: { canonical: "/cards" },
};

const SUIT_LINKS = [
  { slug: "major", name: "메이저 아르카나", desc: "삶의 큰 흐름을 다루는 22장", count: 22 },
  { slug: "wands", name: "완드", desc: "열정과 추진력의 불 슈트 14장", count: 14 },
  { slug: "cups", name: "컵", desc: "감정과 관계의 물 슈트 14장", count: 14 },
  { slug: "swords", name: "소드", desc: "생각과 판단의 공기 슈트 14장", count: 14 },
  { slug: "pentacles", name: "펜타클", desc: "물질과 현실의 흙 슈트 14장", count: 14 },
];

export default function CardsIndexPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">타로 카드 해설</h1>
      <p className="mt-2 text-sm text-muted">
        78장 전체 카드의 기본 의미와 분야별 해석, 자기성찰 질문을 정리했습니다.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {SUIT_LINKS.map((suit) => (
          <Link
            key={suit.slug}
            href={`/cards/${suit.slug}`}
            className="rounded-xl border border-border-subtle bg-surface p-4 hover:border-gold/50"
          >
            <h2 className="text-base font-bold text-gold-strong">{suit.name}</h2>
            <p className="mt-1 text-xs text-muted">{suit.desc}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold">메이저 아르카나 미리보기</h2>
      <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {MAJOR_CARDS.slice(0, 6).map((card) => (
          <Link key={card.id} href={`/cards/${card.slug}`} className="text-center">
            <Image
              src={card.image}
              alt={card.imageAlt}
              width={120}
              height={200}
              className="w-full rounded-lg border border-border-subtle"
            />
            <span className="mt-1 block text-xs text-muted">{card.nameKo}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
