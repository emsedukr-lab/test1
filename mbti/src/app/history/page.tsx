import type { Metadata } from "next";
import { HistoryList } from "@/components/history/HistoryList";

export const metadata: Metadata = {
  title: "리딩 기록",
  robots: { index: false },
};

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold">리딩 기록</h1>
      <p className="mt-1 text-sm text-muted">
        기록은 이 브라우저에만 저장되며, 언제든 삭제하거나 내보낼 수 있습니다.
      </p>
      <HistoryList />
    </div>
  );
}
