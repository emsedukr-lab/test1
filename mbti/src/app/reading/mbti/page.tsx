import type { Metadata } from "next";
import { MbtiStep } from "@/components/reading/MbtiStep";

export const metadata: Metadata = { title: "MBTI 선택" };

export default function MbtiStepPage() {
  return <MbtiStep />;
}
