import type { Metadata } from "next";
import { WizardProgress } from "@/components/wizard/WizardProgress";

export const metadata: Metadata = {
  title: "타로 리딩",
  robots: { index: false },
};

export default function ReadingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl">
      <WizardProgress />
      {children}
    </div>
  );
}
