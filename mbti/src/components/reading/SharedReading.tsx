"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ReadingResultView } from "@/components/reading/ReadingResultView";
import { generateReading } from "@/lib/reading-engine";
import { decodeShare } from "@/lib/share";
import { getTopic } from "@/data/topics";

/** 공유 링크로 열린 리딩 — 질문 원문 없이 입력 파라미터만으로 결과를 재생성한다 */
export function SharedReading() {
  const params = useSearchParams();
  const encoded = params.get("d") ?? "";

  const result = useMemo(() => {
    const payload = decodeShare(encoded);
    if (!payload) return null;
    try {
      return generateReading({
        topicId: payload.topicId,
        spreadId: payload.spreadId,
        mbti: payload.mbti,
        drawnCardIds: payload.cardIds,
        reversedFlags: payload.reversedFlags,
      });
    } catch {
      return null;
    }
  }, [encoded]);

  if (!result) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-border-subtle bg-surface p-5 text-sm">
        <p>링크가 손상되었거나 만료된 형식입니다.</p>
        <Link href="/reading/mbti" className="mt-2 inline-block text-gold underline">
          나도 리딩 해보기
        </Link>
      </div>
    );
  }

  const topic = getTopic(result.meta.topicId);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold">
        {result.meta.mbti ? `${result.meta.mbti}를 위한 ` : ""}
        {topic.nameKo} 리딩 (공유됨)
      </h1>
      <div className="mt-6">
        <ReadingResultView result={result} showAds={false} />
      </div>
      <div className="mt-8 text-center">
        <Link
          href="/reading/mbti"
          className="inline-block rounded-xl bg-gold px-6 py-3 text-sm font-bold text-background"
        >
          나도 리딩 해보기
        </Link>
      </div>
    </div>
  );
}
