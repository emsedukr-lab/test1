import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관계 리딩 가이드",
  description:
    "연애·인간관계 질문을 더 잘 던지는 방법과 관계 리딩 5장 스프레드를 읽는 법을 안내합니다.",
  alternates: { canonical: "/guides/relationship" },
};

export default function RelationshipGuidePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">관계 리딩 가이드</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        관계 고민은 타로를 찾는 가장 흔한 이유이면서, 질문을 잘못 세우기 가장 쉬운
        주제이기도 합니다. 좋은 질문을 만드는 법과 관계 리딩 5장을 읽는 법을
        정리했습니다.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">좋은 관계 질문 만들기</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          &ldquo;그 사람은 나를 좋아할까?&rdquo;처럼 상대방의 마음을 맞히려는 질문은
          카드로 확인할 방법이 없고, 답을 얻어도 할 수 있는 일이 없습니다. 대신
          &ldquo;이 관계에서 나는 무엇을 원하고 있나&rdquo;, &ldquo;지금 내가 시도해 볼
          수 있는 것은 무엇인가&rdquo;처럼 나를 주어로 세운 질문이 훨씬 쓸모 있는 답을
          돌려줍니다. 상대의 마음은 결국 대화로 확인할 몫이고, 타로는 그 대화를 준비하는
          데 도움을 줄 수 있습니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">관계 리딩 5장, 자리별 읽는 법</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          관계 리딩은 다섯 자리로 구성됩니다. 첫째 자리는 <strong>내가 원하는 것</strong>
          — 이 관계에서 내가 진짜 바라는 바를 비춥니다. 둘째 자리는{" "}
          <strong>현재 표현 방식</strong> — 그 바람이 지금 상대에게 어떻게 전달되고
          있는지를 봅니다. 원하는 것과 표현되는 것 사이의 간극이 관계 문제의 단서인
          경우가 많습니다. 셋째 자리는 <strong>관계에서 놓치고 있는 것</strong> — 익숙함
          때문에 보지 못하는 사각지대입니다. 넷째 자리는 <strong>확인해야 할 사실</strong>
          — 추측 대신 실제로 확인이 필요한 지점을 가리킵니다. 다섯째 자리는{" "}
          <strong>필요한 대화</strong> — 이 리딩을 행동으로 옮기는 출구로, 어떤 이야기를
          꺼내볼 만한지를 제안합니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">재회·이별 질문에서 주의할 점</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          재회나 이별을 앞둔 마음은 확실한 답을 원하기 마련이지만, 카드는 관계의 미래를
          확정하지 않습니다. &ldquo;다시 만나게 될까요?&rdquo;에 대한 카드의 답을 결론으로
          받아들이기보다, &ldquo;나는 왜 다시 만나고 싶은가&rdquo;, &ldquo;그때와 지금,
          달라진 것은 무엇인가&rdquo;를 비추는 거울로 쓰는 편이 안전합니다. 같은 질문을
          원하는 답이 나올 때까지 반복해서 뽑는 것은 피하는 것이 좋습니다. 마음이 많이
          힘든 시기라면 타로보다 신뢰할 수 있는 사람이나 전문 상담의 도움이 먼저입니다.
        </p>
      </section>
    </div>
  );
}
