import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "이용 방법",
  description:
    "MBTI 선택부터 카드 뽑기, 결과 저장까지 리딩이 진행되는 순서를 단계별로 안내합니다.",
  alternates: { canonical: "/guides/how-to-use" },
};

export default function HowToUsePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">이용 방법</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {SITE_NAME}의 리딩은 몇 단계의 짧은 흐름으로 진행됩니다. 처음이라면 아래 순서를
        가볍게 훑어보고 시작해 보세요. 전체 과정은 보통 3분 안팎이면 충분합니다.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">1. MBTI 선택</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          먼저 나의 MBTI 유형을 선택합니다. 유형을 모르거나 밝히고 싶지 않다면 건너뛸 수
          있으며, 이 경우에도 일반 해석으로 리딩을 진행할 수 있습니다. MBTI를 선택하면
          결과 화면에서 내 성향에 맞춘 해석이 함께 제공됩니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">2. 고민 분야와 질문 입력</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          연애, 커리어, 인간관계 등 12개 고민 분야 중 지금 마음에 가장 가까운 것을
          선택합니다. 원한다면 구체적인 질문을 최대 300자까지 적을 수 있습니다. 입력한
          질문은 서버로 전송되지 않고 사용 중인 브라우저에만 저장되므로 편하게 적어도
          괜찮습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">3. 리딩 방식 선택</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          다섯 가지 리딩 방식 중 하나를 고릅니다. 오늘의 흐름을 가볍게 보는 한 장 리딩,
          과거·현재·미래를 짚는 세 장 리딩, 관계를 다각도로 보는 관계 리딩(5장), 두 갈래
          선택을 비교하는 선택 리딩(6장), 일과 진로를 살피는 커리어 리딩(6장)이 있습니다.
          질문의 성격에 맞는 방식을 고르면 해석이 더 또렷해집니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">4. 카드 선택과 공개</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          뒤집힌 78장의 카드 중에서 리딩 방식에 필요한 수만큼 직접 고릅니다. 무작위로
          자동 배정되는 것이 아니라 내 손으로 고르는 방식이라, 카드를 한 장씩 공개하는
          순간의 몰입감이 다릅니다. 선택을 마치면 카드가 차례로 공개됩니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">5. 결과 읽기</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          결과 화면에는 핵심 요약, MBTI 맞춤 해석, 카드별 해석, 카드 조합 분석, 강점과
          주의점, 실행 가능한 행동 조언, 그리고 스스로에게 던져볼 자기성찰 질문이
          순서대로 담깁니다. 한 번에 다 읽기보다, 마음에 걸리는 부분부터 천천히 읽어보는
          것을 권합니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">6. 저장과 공유</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          결과는 브라우저(localStorage)에 저장해 두고 기록 페이지에서 다시 볼 수
          있습니다. 링크로 공유할 때는 내가 입력한 질문은 제외되고 카드와 해석만
          전달되므로, 사적인 고민이 다른 사람에게 노출될 걱정 없이 결과를 나눌 수
          있습니다.
        </p>
      </section>
    </div>
  );
}
