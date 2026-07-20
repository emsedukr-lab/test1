"use client";

import Link from "next/link";
import { useState } from "react";
import { ReadingResultView } from "@/components/reading/ReadingResultView";
import { generateReading } from "@/lib/reading-engine";
import { getTopic } from "@/data/topics";
import { SPREADS } from "@/data/spreads";
import type { ReadingRecord, ReadingResult } from "@/types/reading";
import { useHistoryStore } from "@/stores/historyStore";
import { useStoreHydrated } from "@/stores/hydration";

function recordToResult(record: ReadingRecord): ReadingResult | null {
  try {
    return generateReading({
      topicId: record.topicId,
      spreadId: record.spreadId,
      mbti: record.mbti,
      question: record.question || undefined,
      drawnCardIds: record.cardIds,
    });
  } catch {
    return null;
  }
}

export function HistoryList() {
  const hydrated = useStoreHydrated(useHistoryStore);
  const records = useHistoryStore((s) => s.records);
  const removeRecord = useHistoryStore((s) => s.removeRecord);
  const clearAll = useHistoryStore((s) => s.clearAll);
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!hydrated) {
    return <div className="mt-6 h-32 animate-pulse rounded-xl bg-surface" aria-busy="true" />;
  }

  if (records.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-border-subtle bg-surface p-6 text-center text-sm text-muted">
        <p>저장된 리딩이 아직 없습니다.</p>
        <Link href="/reading/mbti" className="mt-2 inline-block text-gold underline">
          첫 리딩 시작하기
        </Link>
      </div>
    );
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ version: 1, records }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tarot-readings.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 space-y-3">
      <div className="flex justify-end gap-2 text-xs">
        <button
          type="button"
          onClick={exportJson}
          className="rounded-lg border border-border-subtle px-3 py-1.5 text-muted hover:text-foreground"
        >
          JSON 내보내기
        </button>
        {confirmClear ? (
          <span className="flex items-center gap-2">
            <span className="text-rose">모두 삭제할까요?</span>
            <button
              type="button"
              onClick={() => {
                clearAll();
                setConfirmClear(false);
              }}
              className="rounded-lg bg-rose px-3 py-1.5 font-bold text-background"
            >
              삭제
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              className="rounded-lg border border-border-subtle px-3 py-1.5"
            >
              취소
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="rounded-lg border border-border-subtle px-3 py-1.5 text-muted hover:text-rose"
          >
            전체 삭제
          </button>
        )}
      </div>

      <ul className="space-y-3">
        {records.map((record) => {
          const topic = getTopic(record.topicId);
          const spread = SPREADS[record.spreadId];
          const open = openId === record.id;
          const date = new Date(record.createdAt);
          return (
            <li key={record.id} className="rounded-xl border border-border-subtle bg-surface">
              <div className="flex items-center justify-between gap-2 p-4">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : record.id)}
                  aria-expanded={open}
                  className="flex-1 text-left"
                >
                  <p className="text-sm font-bold">
                    {record.mbti ? `${record.mbti} · ` : ""}
                    {topic?.nameKo} · {spread?.nameKo}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {date.toLocaleDateString("ko-KR")}{" "}
                    {date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                    {record.question ? ` · "${record.question.slice(0, 30)}${record.question.length > 30 ? "…" : ""}"` : ""}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => removeRecord(record.id)}
                  aria-label="이 기록 삭제"
                  className="rounded-lg border border-border-subtle px-2.5 py-1.5 text-xs text-muted hover:text-rose"
                >
                  삭제
                </button>
              </div>
              {open && (
                <div className="border-t border-border-subtle p-4">
                  {(() => {
                    const result = recordToResult(record);
                    return result ? (
                      <ReadingResultView result={result} showAds={false} />
                    ) : (
                      <p className="text-sm text-muted">이 기록을 다시 해석할 수 없습니다.</p>
                    );
                  })()}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
