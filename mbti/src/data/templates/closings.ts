import { josa } from "@/lib/reading-engine/compose/josa";
import type { TemplateVariant } from "@/lib/reading-engine/compose/sentence-bank";

/** 마무리 한 문장 컨텍스트 */
export interface ClosingContext {
  /** 대표 카드 이름 (첫 카드) */
  cardNameKo: string;
  /** 대표 키워드 */
  keyword: string;
  contextNoun: string;
}

export const CLOSINGS: readonly TemplateVariant<ClosingContext>[] = [
  {
    id: "closing-01",
    endingGroup: "chungbun",
    render: (c) =>
      `오늘 뽑은 ${c.cardNameKo} 카드의 ${c.keyword}, 그 한 가지만 기억해도 충분합니다.`,
  },
  {
    id: "closing-02",
    endingGroup: "euntte",
    render: (c) =>
      `카드는 방향을 비출 뿐, ${josa(c.contextNoun, "을/를")} 움직이는 것은 언제나 자신의 걸음입니다.`,
  },
  {
    id: "closing-03",
    endingGroup: "baraboda",
    render: (c) =>
      `${josa(c.keyword, "이라는/라는")} 단어를 이번 주의 작은 나침반으로 삼아보세요.`,
  },
  {
    id: "closing-04",
    endingGroup: "chungbun",
    render: (c) =>
      `${c.cardNameKo} 카드가 건넨 메시지 중 마음에 남는 한 줄이면, 오늘 리딩은 제 역할을 다한 셈입니다.`,
  },
  {
    id: "closing-05",
    endingGroup: "eungwon",
    render: (c) =>
      `정답은 카드가 아니라 ${c.contextNoun} 안에 이미 있습니다. ${josa(c.keyword, "이/가")} 그 사실을 떠올리게 해줄 뿐입니다.`,
  },
  {
    id: "closing-06",
    endingGroup: "baraboda",
    render: (c) =>
      `며칠 뒤, ${josa(c.keyword, "이/가")} 오늘과 어떻게 달라 보이는지 다시 들여다봐도 좋겠습니다.`,
  },
];
