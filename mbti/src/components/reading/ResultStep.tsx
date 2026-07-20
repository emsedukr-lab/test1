"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { StepGuard } from "@/components/wizard/StepGuard";
import { ReadingResultView } from "@/components/reading/ReadingResultView";
import { AdSlot } from "@/components/ads/AdSlot";
import { generateReading } from "@/lib/reading-engine";
import { encodeShare, shareUrl } from "@/lib/share";
import { SITE_NAME } from "@/lib/site";
import { getTopic } from "@/data/topics";
import { SPREADS } from "@/data/spreads";
import type { ReadingRecord, ReadingResult } from "@/types/reading";
import { useHistoryStore } from "@/stores/historyStore";
import { selectDrawnCardIds, selectReversedFlags, useReadingStore } from "@/stores/readingStore";
import { track } from "@/lib/analytics";

export function ResultStep() {
  return (
    <StepGuard step="result">
      <ResultBody />
    </StepGuard>
  );
}

function NewReadingButton() {
  const reset = useReadingStore((s) => s.reset);
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        reset();
        router.push("/reading/mbti");
      }}
      className="text-muted underline hover:text-foreground"
    >
      새 리딩 시작
    </button>
  );
}

function ResultBody() {
  const state = useReadingStore();
  const addRecord = useHistoryStore((s) => s.addRecord);
  const records = useHistoryStore((s) => s.records);
  const [notice, setNotice] = useState<string | null>(null);

  const cardIds = selectDrawnCardIds(state);
  const reversedFlags = selectReversedFlags(state);
  const cardIdsKey = cardIds.join(",");
  const reversedKey = reversedFlags.map((f) => (f ? "1" : "0")).join("");

  const result: ReadingResult | null = useMemo(() => {
    if (!state.topicId || !state.spreadId || cardIdsKey === "") return null;
    try {
      return generateReading({
        topicId: state.topicId,
        spreadId: state.spreadId,
        mbti: state.mbti,
        question: state.question || undefined,
        drawnCardIds: cardIdsKey.split(","),
        reversedFlags: reversedKey.split("").map((c) => c === "1"),
      });
    } catch {
      return null;
    }
  }, [state.topicId, state.spreadId, state.mbti, state.question, cardIdsKey, reversedKey]);

  useEffect(() => {
    if (result && result.safety.action !== "block") {
      track("result_viewed", {
        topic: result.meta.topicId,
        spread: result.meta.spreadId,
        mbti: result.meta.mbti ?? "none",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.meta.seed]);

  if (!result) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface p-5 text-sm">
        결과를 생성할 수 없습니다.{" "}
        <Link href="/reading/mbti" className="text-gold underline">
          처음부터 다시 시작
        </Link>
      </div>
    );
  }

  const saved = state.readingId !== null && records.some((r) => r.id === state.readingId);
  const topic = state.topicId ? getTopic(state.topicId) : null;
  const spread = state.spreadId ? SPREADS[state.spreadId] : null;

  const handleSave = () => {
    if (!state.readingId || !state.topicId || !state.spreadId) return;
    const record: ReadingRecord = {
      id: state.readingId,
      v: 1,
      createdAt: state.startedAt ?? new Date().toISOString(),
      mbti: state.mbti,
      topicId: state.topicId,
      question: state.question,
      spreadId: state.spreadId,
      cardIds,
      reversedFlags,
    };
    addRecord(record);
    track("result_saved", { topic: state.topicId, spread: state.spreadId });
    setNotice("기록에 저장했습니다.");
  };

  const handleShare = async () => {
    if (!state.topicId || !state.spreadId) return;
    track("result_shared", { topic: state.topicId, spread: state.spreadId });
    const payload = encodeShare({
      mbti: state.mbti,
      topicId: state.topicId,
      spreadId: state.spreadId,
      cardIds,
      reversedFlags,
    });
    const url = `${window.location.origin}/r?d=${payload}`;
    const title = `${state.mbti ? `${state.mbti}를 위한 ` : ""}${topic?.nameKo ?? ""} ${spread?.nameKo ?? ""} — ${SITE_NAME}`;
    const outcome = await shareUrl(url, title);
    setNotice(
      outcome === "shared"
        ? "공유했습니다."
        : outcome === "copied"
          ? "링크를 복사했습니다."
          : "공유를 완료하지 못했습니다.",
    );
  };

  return (
    <div>
      <h1 className="text-xl font-bold">
        {state.mbti ? `${state.mbti}를 위한 ` : ""}
        {topic?.nameKo} 리딩
      </h1>
      {state.question && (
        <p className="mt-1 text-sm text-muted">내 질문: {state.question}</p>
      )}

      <div className="mt-6">
        <ReadingResultView result={result} />
      </div>

      {result.safety.action !== "block" && (
        <div className="mt-8 space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saved}
              className="flex-1 rounded-xl border border-border-subtle px-4 py-3 text-sm font-medium disabled:opacity-50"
            >
              {saved ? "저장됨" : "기록에 저장"}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 rounded-xl bg-gold px-4 py-3 text-sm font-bold text-background"
            >
              결과 공유
            </button>
          </div>
          <p aria-live="polite" className="min-h-5 text-center text-xs text-muted">
            {notice ?? "공유 링크에는 질문 내용이 포함되지 않습니다."}
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/history" className="text-muted underline hover:text-foreground">
              기록 보기
            </Link>
            <NewReadingButton />
          </div>
        </div>
      )}

      <div className="mt-8">
        <AdSlot slot="result-bottom" minHeight={250} />
      </div>
    </div>
  );
}
