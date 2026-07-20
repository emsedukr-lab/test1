import type { Metadata } from "next";
import { SpreadStep } from "@/components/reading/SpreadStep";

export const metadata: Metadata = { title: "리딩 방식 선택" };

export default function SpreadStepPage() {
  return <SpreadStep />;
}
