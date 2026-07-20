import type { Metadata } from "next";
import { Suspense } from "react";
import { SharedReading } from "@/components/reading/SharedReading";

export const metadata: Metadata = {
  title: "공유된 리딩",
  robots: { index: false },
};

export default function SharedReadingPage() {
  return (
    <Suspense fallback={<div className="animate-pulse py-8 text-sm text-muted">불러오는 중…</div>}>
      <SharedReading />
    </Suspense>
  );
}
