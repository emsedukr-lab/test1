import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "면책 안내",
  description:
    "타로 해석과 MBTI 기반 조언의 성격, 서비스가 대신할 수 없는 영역, 위기 상황 연락처를 안내합니다.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">면책 안내</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {SITE_NAME}를 이용하기 전에 이 서비스가 무엇이고 무엇이 아닌지를 분명히
        해 두고자 합니다.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">이 서비스의 성격</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          서비스가 제공하는 타로 해석과 MBTI 기반 조언은 오락과 자기성찰을 위한
          콘텐츠입니다. 미래를 예측하지 않으며, 의료·심리 진단, 법률 자문, 투자 조언이
          아닙니다. MBTI 역시 과학적으로 확립된 진단 도구가 아니라 자기 이해를 돕는
          하나의 관점으로만 사용됩니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">전문가의 영역</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          건강 이상이 의심될 때는 의료기관을, 법적 문제는 변호사를, 금전과 투자 문제는
          공인된 전문가를 찾으시기 바랍니다. 서비스의 어떤 내용도 전문적인 진단이나
          상담을 대체할 수 없습니다. 리딩 결과를 참고하여 내린 결정의 책임은 이용자
          본인에게 있습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">위기 상황에서는</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          자해나 자살에 대한 생각, 폭력 피해 등 위기 상황에서는 타로가 아니라 전문
          기관의 도움이 필요합니다. 아래 번호에서 언제든 상담을 받을 수 있습니다.
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
          <li>
            자살예방 상담전화 <strong>109</strong> — 24시간, 전국 어디서나
          </li>
          <li>
            청소년 상담전화 <strong>1388</strong> — 청소년 고민·위기 상담
          </li>
          <li>
            여성긴급전화 <strong>1366</strong> — 가정폭력·성폭력 등 긴급 상담
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          지금 많이 힘들다면 화면을 잠시 내려놓고 위 번호로 연락해 보세요. 이야기를
          들어줄 사람이 있습니다.
        </p>
      </section>
    </div>
  );
}
