import type { Metadata } from "next";
import { Suspense } from "react";
import { SharedReading } from "@/components/reading/SharedReading";
import { getCardById } from "@/data/cards";
import { getTopic } from "@/data/topics";
import { decodeShare } from "@/lib/share";
import { SITE_NAME } from "@/lib/site";

interface PageProps {
  searchParams: Promise<{ d?: string | string[] }>;
}

/** 공유 링크 미리보기 — 첫 번째 카드 이미지를 OG로 노출 (질문 원문은 페이로드에 없음) */
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { d } = await searchParams;
  const payload = typeof d === "string" ? decodeShare(d) : null;

  if (!payload) {
    return { title: "공유된 리딩", robots: { index: false } };
  }

  const topic = getTopic(payload.topicId);
  const firstCard = getCardById(payload.cardIds[0]);
  const title = `${payload.mbti ? `${payload.mbti}를 위한 ` : ""}${topic.nameKo} 타로 리딩`;

  return {
    title,
    description: `${payload.cardIds.length}장의 카드가 건넨 메시지를 확인해 보세요 — ${SITE_NAME}`,
    robots: { index: false },
    openGraph: {
      title,
      images: firstCard ? [{ url: firstCard.image, width: 480, height: 800 }] : [],
    },
  };
}

export default function SharedReadingPage() {
  return (
    <Suspense fallback={<div className="animate-pulse py-8 text-sm text-muted">불러오는 중…</div>}>
      <SharedReading />
    </Suspense>
  );
}
