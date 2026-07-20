import type { Metadata } from "next";
import { TopicStep } from "@/components/reading/TopicStep";

export const metadata: Metadata = { title: "고민 분야 선택" };

export default function TopicStepPage() {
  return <TopicStep />;
}
