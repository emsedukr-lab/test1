import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "건강한 타로 활용법",
  description:
    "타로에 기대지 않고 타로를 활용하는 법 — 이 서비스가 지키는 선과 이용자에게 권하는 태도를 안내합니다.",
  alternates: { canonical: "/guides/healthy-tarot-use" },
};

export default function HealthyTarotUsePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">건강한 타로 활용법</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {SITE_NAME}는 타로를 미래 예언이 아니라 자기성찰의 도구로 봅니다. 카드는 정해진
        운명을 알려주는 것이 아니라, 스스로도 정리하지 못했던 마음을 꺼내 보게 하는
        질문지에 가깝습니다. 이 관점을 지키면 타로는 꽤 쓸모 있는 도구가 됩니다.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">중요한 결정은 전문가와</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          건강, 법률, 투자처럼 삶에 큰 영향을 미치는 문제는 타로가 다룰 영역이 아닙니다.
          몸이 아프면 의사에게, 법적 분쟁은 변호사에게, 돈 문제는 공인된 전문가에게
          묻는 것이 맞습니다. 타로는 그런 결정을 앞둔 내 마음의 상태를 살피는 데까지만
          쓰고, 결정 자체의 근거로 삼지 않기를 권합니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">같은 질문을 반복해서 뽑지 않기</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          결과가 마음에 들지 않아 같은 질문으로 카드를 다시 뽑고 싶어질 때가 있습니다.
          하지만 원하는 답이 나올 때까지 반복하는 것은 성찰이 아니라 답 고르기에
          가깝습니다. 그 질문에 자꾸 손이 간다면, 사실 마음속에는 이미 답이 있는데
          허락을 구하고 있는 것은 아닌지 돌아보는 편이 도움이 됩니다. 같은 주제라면
          시간을 두고 질문을 바꿔 다시 찾아오세요.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">결과가 마음에 들지 않을 때</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          불편한 카드가 나왔다고 해서 나쁜 일이 예정된 것은 아닙니다. 카드의 의미는
          고정된 판결이 아니라 지금 상황을 비추는 하나의 각도입니다. 오히려 불편함이
          느껴지는 지점이야말로 들여다볼 가치가 있는 곳일 수 있습니다. &ldquo;이 해석의
          어떤 부분이 왜 거슬리는가&rdquo;를 스스로에게 물어보면, 결과 자체보다 훨씬
          중요한 것을 발견하기도 합니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">지금 많이 힘들다면</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          자해나 자살에 대한 생각이 들 만큼 힘든 시기라면, 타로가 아니라 사람의 도움이
          필요한 때입니다. 자살예방 상담전화 <strong>109</strong>(24시간), 청소년이라면
          청소년 상담전화 <strong>1388</strong>에서 언제든 이야기를 들어줍니다. 잠시
          화면을 내려놓고 전화를 걸어 보세요. 이 서비스는 그런 순간의 대안이 될 수 없고,
          되려 하지도 않습니다.
        </p>
      </section>
    </div>
  );
}
