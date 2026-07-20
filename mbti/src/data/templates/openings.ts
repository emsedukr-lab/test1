import { josa } from "@/lib/reading-engine/compose/josa";
import type { TemplateVariant } from "@/lib/reading-engine/compose/sentence-bank";

/** 리딩 오프닝(핵심 요약 첫 문장) 컨텍스트 */
export interface OpeningContext {
  topicNameKo: string;
  contextNoun: string;
  /** 첫 번째 카드 키워드 */
  firstKeyword: string;
  /** 마지막 카드 키워드 (1장 리딩이면 첫 카드와 동일) */
  lastKeyword: string;
  cardCount: number;
}

export const OPENINGS: readonly TemplateVariant<OpeningContext>[] = [
  {
    id: "opening-01",
    endingGroup: "boinda",
    render: (c) =>
      `이번 리딩의 중심에는 ${josa(c.firstKeyword, "이/가")} 놓여 있습니다. ${c.topicNameKo}에 대한 지금의 마음을 비추는 흐름으로 보입니다.`,
  },
  {
    id: "opening-02",
    endingGroup: "ganeung",
    render: (c) =>
      `카드들은 ${c.firstKeyword}에서 ${c.lastKeyword} 쪽으로 흐르고 있습니다. 지금의 ${josa(c.contextNoun, "이/가")} 그 사이 어딘가를 지나고 있을 수 있습니다.`,
  },
  {
    id: "opening-03",
    endingGroup: "malhanda",
    render: (c) =>
      `${c.cardCount}장의 카드가 ${c.topicNameKo}에 대해 말을 건넵니다. 첫 실마리는 ${c.firstKeyword}입니다.`,
  },
  {
    id: "opening-04",
    endingGroup: "ilknida",
    render: (c) =>
      `이번 배열은 ${josa(c.firstKeyword, "과/와")} ${c.lastKeyword} 사이의 이야기로 읽힙니다. ${c.topicNameKo}라는 질문에 카드가 내놓은 첫 대답입니다.`,
  },
  {
    id: "opening-05",
    endingGroup: "boinda",
    render: (c) =>
      `지금의 ${c.contextNoun} 위로 ${josa(c.firstKeyword, "이라는/라는")} 단어가 떠올랐습니다. 오늘 리딩은 여기서 출발하는 것이 좋아 보입니다.`,
  },
];
