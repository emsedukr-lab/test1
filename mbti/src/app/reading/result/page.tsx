import type { Metadata } from "next";
import { ResultStep } from "@/components/reading/ResultStep";

export const metadata: Metadata = { title: "리딩 결과" };

export default function ResultStepPage() {
  return <ResultStep />;
}
