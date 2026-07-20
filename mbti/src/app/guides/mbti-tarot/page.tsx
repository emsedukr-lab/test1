import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "MBTI와 타로",
  description:
    "왜 같은 카드가 성향에 따라 다르게 읽히는지, 이 서비스가 지키는 해석 원칙을 설명합니다.",
  alternates: { canonical: "/guides/mbti-tarot" },
};

export default function MbtiTarotPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">MBTI와 타로</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {SITE_NAME}는 타로카드의 전통적인 의미 위에 MBTI 성향이라는 렌즈를 하나 더
        얹습니다. 같은 카드라도 사람마다 받아들이기 좋은 방식이 다르다는 관찰에서 출발한
        해석 방식입니다.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">같은 카드, 다른 울림</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          어떤 사람은 큰 그림과 방향을 먼저 잡아야 마음이 움직이고, 어떤 사람은 지금 이
          순간의 감각과 경험에서 답을 찾습니다. 카드가 건네는 메시지가 같아도, 그것이
          삶에 스며드는 통로는 사람마다 다릅니다. 그래서 해석도 성향에 맞춰 조율될 때 더
          쓸모 있는 언어가 됩니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">MBTI는 진단이 아니라 렌즈</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          이 서비스에서 MBTI는 사람을 단정하는 진단 도구가 아닙니다. 열여섯 가지 유형이
          한 사람을 다 담을 수는 없습니다. 다만 정보를 인식하는 방식, 결정을 내리는
          방식에는 저마다의 경향이 있고, MBTI는 그 경향에 맞춰 해석의 &lsquo;결&rsquo;을
          고르는 렌즈로 쓰입니다. 렌즈를 바꾸면 같은 풍경도 다른 부분에 초점이 맺힙니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">해석이 만들어지는 방식</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          결과 해석은 네 가지 재료를 규칙 기반으로 조합해 만들어집니다. 카드 자체의 의미,
          선택한 고민 분야, 스프레드에서 카드가 놓인 위치, 그리고 MBTI 성향 정보 —
          인식과 의사결정 방식, 자주 발휘되는 강점, 스트레스 상황에서 나타나기 쉬운 과잉
          패턴 — 입니다. 무작위 문장을 섞는 것이 아니라, 이 재료들이 맞물리는 지점에서
          해석이 완성됩니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">예시: 완드 에이스</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          새로운 열정과 시작의 에너지를 뜻하는 완드 에이스를 예로 들어 보겠습니다. 계획과
          구조를 중시하는 INTJ에게는 &ldquo;이 불씨를 가설로 세우고 검증 계획을 만들어
          보라&rdquo;는 방향의 제안이 어울립니다. 반면 현재의 경험을 중시하는 ESFP에게는
          &ldquo;지금 타오르는 이 욕구가 순간의 것인지, 오래 가져갈 것인지 구분해
          보라&rdquo;는 제안이 더 와닿을 수 있습니다. 카드는 하나지만, 각자에게 필요한
          질문은 다른 셈입니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">해석을 대하는 자세</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          MBTI 맞춤 해석 역시 정답이 아니라 하나의 관점입니다. 읽다가 &ldquo;이건 나와
          다른데&rdquo; 싶은 부분이 있다면 그 어긋남 자체가 자기 이해의 단서가 될 수
          있습니다. 해석을 그대로 따르기보다, 내 상황에 비추어 취할 것과 흘려보낼 것을
          스스로 고르는 것이 이 서비스를 가장 잘 쓰는 방법입니다.
        </p>
      </section>
    </div>
  );
}
