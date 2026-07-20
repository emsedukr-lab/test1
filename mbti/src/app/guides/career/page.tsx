import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "커리어 리딩 가이드",
  description:
    "커리어 리딩 6장 스프레드 읽는 법과 이직 고민, 행동 조언을 일주일 계획으로 옮기는 팁을 안내합니다.",
  alternates: { canonical: "/guides/career" },
};

export default function CareerGuidePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">커리어 리딩 가이드</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        일과 진로 고민은 감정과 현실 조건이 뒤엉키기 쉬운 주제입니다. 커리어 리딩은 그
        엉킨 실타래를 여섯 갈래로 나눠, 지금 내 일의 지형을 한눈에 펼쳐 보도록
        설계되었습니다.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">커리어 리딩 6장, 자리별 읽는 법</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          첫째 자리는 <strong>현재 동기</strong> — 지금 나를 일하게 하는 힘이 무엇인지
          비춥니다. 둘째 자리는 <strong>소진시키는 요인</strong> — 에너지가 새는 지점으로,
          동기와 소진을 나란히 놓고 보면 지금 일의 수지타산이 보입니다. 셋째 자리는{" "}
          <strong>활용하지 못하는 강점</strong> — 갖고 있지만 지금 자리에서 쓰이지 않는
          역량입니다. 이직이나 직무 전환을 고민할 때 특히 눈여겨볼 자리입니다. 넷째
          자리는 <strong>현실적인 자원</strong> — 경력, 관계, 시간, 여유 자금처럼 실제로
          기댈 수 있는 것들을 가리킵니다. 다섯째 자리는 <strong>주의할 위험</strong> —
          지금 방향으로 갈 때 걸려 넘어지기 쉬운 지점이고, 여섯째 자리는{" "}
          <strong>다음 행동</strong> — 거창한 결단이 아니라 이번 주에 해볼 수 있는 한
          걸음을 제안합니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">이직 고민에는 선택 리딩도</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          &ldquo;남을까, 옮길까&rdquo;처럼 갈림길이 뚜렷한 고민이라면 커리어 리딩보다
          선택 리딩(6장)이 더 맞을 수 있습니다. 선택 리딩은 두 갈래 각각의 흐름과 대가를
          나란히 비교하도록 구성되어 있어, 막연히 한쪽으로 기울던 마음이 실제로 무엇을
          근거로 기울었는지 점검하는 데 도움이 됩니다. 두 방식을 상황에 따라 골라 쓰면
          됩니다.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gold-strong">행동 조언을 일주일 계획으로</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          리딩의 가치는 결과 화면을 닫은 뒤에 결정됩니다. 결과의 행동 조언 중 하나를
          골라, 이번 주 달력에 들어갈 수 있는 크기로 줄여 보세요. &ldquo;강점을
          살리라&rdquo;는 조언이라면 &ldquo;수요일 저녁, 이력서에 최근 성과 세 줄
          추가하기&rdquo;처럼 요일과 분량이 있는 문장으로 바꾸는 식입니다. 일주일 뒤 기록
          페이지에서 리딩을 다시 열어 실제로 무엇이 달라졌는지 확인하면, 타로가 막연한
          위안이 아니라 실질적인 점검 도구가 됩니다.
        </p>
      </section>
    </div>
  );
}
