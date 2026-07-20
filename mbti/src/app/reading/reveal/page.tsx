import type { Metadata } from "next";
import { RevealStep } from "@/components/reading/RevealStep";

export const metadata: Metadata = { title: "카드 공개" };

export default function RevealStepPage() {
  return <RevealStep />;
}
