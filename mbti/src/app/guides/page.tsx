import type { Metadata } from "next";
import Link from "next/link";
import { GUIDE_LIST } from "@/data/guides";

export const metadata: Metadata = {
  title: "타로 가이드",
  description: "타로 리딩 이용 방법, MBTI 타로 활용법, 관계·커리어 리딩 가이드를 모았습니다.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">타로 가이드</h1>
      <div className="mt-6 space-y-3">
        {GUIDE_LIST.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="block rounded-xl border border-border-subtle bg-surface p-4 hover:border-gold/50"
          >
            <h2 className="text-base font-bold text-gold-strong">{guide.title}</h2>
            <p className="mt-1 text-sm text-muted">{guide.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
