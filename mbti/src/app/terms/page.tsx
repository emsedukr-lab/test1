import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "이용약관",
  description:
    "서비스의 목적, 제공 방식, 이용자의 책임 등 이용에 관한 기본 약속을 안내합니다.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">이용약관</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        이 약관은 {SITE_NAME}(이하 &ldquo;서비스&rdquo;)를 이용할 때 적용되는 기본
        약속입니다. 서비스를 이용하면 아래 내용에 동의한 것으로 봅니다.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">서비스의 목적</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          서비스는 오락과 자기성찰을 목적으로 하는 타로 콘텐츠를 제공합니다. 리딩 결과와
          MBTI 기반 해석은 미래 예측, 의료·심리 진단, 법률·투자 자문이 아니며, 그러한
          용도로 사용되는 것을 의도하지 않습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">제공 방식</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          서비스는 무료로 제공되며, 운영을 위해 광고가 포함됩니다. 운영자는 서비스의
          내용과 기능을 사전 고지 없이 변경하거나 중단할 수 있습니다. 서비스는
          &ldquo;있는 그대로&rdquo; 제공되며, 특정 목적에의 적합성이나 결과의 정확성을
          보증하지 않습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">이용자의 책임</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          리딩 결과를 참고하여 내린 판단과 행동의 책임은 이용자 본인에게 있습니다. 건강,
          법률, 금전 등 중요한 사안은 해당 분야의 전문가와 상의하시기 바랍니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">콘텐츠의 이용</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          서비스의 해석 문구, 디자인 등 콘텐츠를 운영자의 허락 없이 복제, 배포,
          상업적으로 이용하는 것은 금지됩니다. 개인적인 결과 공유 기능의 사용은 여기에
          해당하지 않습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">이용 연령</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          만 14세 미만의 이용은 권장하지 않습니다. 미성년자는 보호자와 함께 이용하기를
          권합니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">약관의 변경</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          약관이 변경되는 경우 이 페이지를 통해 안내하며, 변경 후에도 서비스를 계속
          이용하면 변경된 약관에 동의한 것으로 봅니다.
        </p>
      </section>
    </div>
  );
}
