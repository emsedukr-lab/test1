import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description:
    "MBTI 성향에 맞춘 타로 자기성찰 도구 — 무료, 회원가입 없음, 질문은 서버에 저장하지 않습니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">소개</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {SITE_NAME}는 MBTI 성격유형을 렌즈 삼아 타로카드를 읽는 자기성찰 서비스입니다.
        78장의 카드 중 직접 고른 카드에, 내 성향에 맞춘 해석과 실행해 볼 만한 행동 조언을
        더해 돌려드립니다.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">왜 만들었나</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          타로 해석은 대체로 모든 사람에게 같은 문장을 건넵니다. 하지만 같은 조언도
          받아들이는 사람의 성향에 따라 울림이 달라집니다. 계획이 서야 움직이는 사람과
          일단 부딪혀 봐야 아는 사람에게 필요한 말은 다릅니다. {SITE_NAME}는 카드의 의미,
          고민 분야, 카드의 위치에 MBTI 성향을 조합해, 각자에게 조금 더 와닿는 언어로
          해석을 전하려는 시도입니다. 점을 쳐 주는 서비스가 아니라, 내 마음을 정리하는
          거울을 하나 더 놓아 드리는 서비스에 가깝습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">지키는 원칙</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          첫째, 무료로 제공합니다. 둘째, 회원가입을 요구하지 않습니다. 셋째, 리딩 중
          입력한 질문은 서버로 전송하지 않습니다. 질문과 리딩 기록은 사용 중인 브라우저에만
          저장되며, 삭제도 이용자가 직접 할 수 있습니다. 사적인 고민을 다루는 서비스라면
          이 정도의 선은 기본이라고 생각합니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">운영 방식</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          서비스는 광고 수익으로 운영됩니다. 무료와 무가입 원칙을 지키기 위한 선택이며,
          맞춤 광고 쿠키는 이용자가 동의한 경우에만 사용됩니다. 광고와 저장 방식에 대한
          자세한 내용은 개인정보처리방침과 쿠키 정책 페이지에서 확인할 수 있습니다.
        </p>
      </section>
    </div>
  );
}
