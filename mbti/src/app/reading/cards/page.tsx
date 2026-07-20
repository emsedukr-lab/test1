import type { Metadata } from "next";
import { CardsStep } from "@/components/reading/CardsStep";

export const metadata: Metadata = { title: "카드 선택" };

export default function CardsStepPage() {
  return <CardsStep />;
}
