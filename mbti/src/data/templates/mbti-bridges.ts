import type { MbtiType } from "@/types/mbti";
import { josa } from "@/lib/reading-engine/compose/josa";
import type { TemplateVariant } from "@/lib/reading-engine/compose/sentence-bank";

/** MBTI 브리지 문장 전용 컨텍스트 — 리딩 전체에서 1~3개만 삽입된다 */
export interface BridgeContext {
  type: MbtiType;
  /** profile.strengths에서 rng 선택한 명사구 */
  traitNoun: string;
  /** profile.overusePatterns에서 rng 선택한 명사구 */
  overuseNoun: string;
  /** 카드 대표 키워드 */
  keyword: string;
  contextNoun: string;
}

export const MBTI_BRIDGES: readonly TemplateVariant<BridgeContext>[] = [
  {
    id: "bridge-01",
    endingGroup: "ganeung",
    render: (c) =>
      `평소 ${josa(c.traitNoun, "을/를")} 지닌 ${c.type} 성향이라면, 이 카드의 ${josa(c.keyword, "은/는")} 그 힘을 살릴 수 있는 자리일 수 있습니다.`,
  },
  {
    id: "bridge-02",
    endingGroup: "swipda",
    render: (c) =>
      `${c.type} 성향이 강하다면 ${josa(c.overuseNoun, "으로/로")} 기울기 쉬운 대목이기도 합니다. 카드의 ${josa(c.keyword, "을/를")} 균형추로 삼아볼 만합니다.`,
  },
  {
    id: "bridge-03",
    endingGroup: "boinda",
    toneTags: ["logic", "direct"],
    render: (c) =>
      `${josa(c.traitNoun, "이/가")} 돋보이는 ${c.type}에게 이 카드는 ${josa(c.keyword, "을/를")} 구체적인 계획으로 옮겨보라는 제안으로 보입니다.`,
  },
  {
    id: "bridge-04",
    endingGroup: "malhanda",
    toneTags: ["value", "gentle"],
    render: (c) =>
      `${c.type}의 ${josa(c.traitNoun, "은/는")} 이런 ${c.contextNoun}에서 빛나기 쉽습니다. 다만 카드는 ${josa(c.overuseNoun, "은/는")} 잠시 내려놓아도 된다고 말합니다.`,
  },
  {
    id: "bridge-05",
    endingGroup: "ilknida",
    toneTags: ["bigPicture"],
    render: (c) =>
      `${c.type} 성향에게 ${josa(c.keyword, "은/는")} 익숙한 ${josa(c.traitNoun, "과/와")} 낯선 것 사이의 다리로 읽힙니다.`,
  },
  {
    id: "bridge-06",
    endingGroup: "ganeung",
    toneTags: ["stepByStep"],
    render: (c) =>
      `${josa(c.traitNoun, "을/를")} 가진 ${c.type}이라면 ${josa(c.keyword, "을/를")} 작은 단계로 쪼개는 것부터 시작해볼 수 있습니다.`,
  },
  {
    id: "bridge-07",
    endingGroup: "heureum",
    render: (c) =>
      `${josa(c.keyword, "은/는")} ${c.type}에게 낯선 언어가 아닙니다. 평소의 ${josa(c.traitNoun, "이/가")} 그대로 통할 수 있는 흐름입니다.`,
  },
  {
    id: "bridge-08",
    endingGroup: "moreunda",
    toneTags: ["gentle", "hold"],
    render: (c) =>
      `${c.type} 성향은 이런 ${c.contextNoun} 앞에서 ${josa(c.overuseNoun, "을/를")} 먼저 꺼내들기 쉽습니다. 이번에는 익숙한 그 방식을 한 박자 늦춰보는 것도 방법일지 모릅니다.`,
  },
  {
    id: "bridge-09",
    endingGroup: "boinda",
    render: (c) =>
      `카드가 짚는 ${josa(c.keyword, "과/와")} ${c.type}의 ${josa(c.traitNoun, "이/가")} 같은 방향을 향하고 있습니다. 둘을 겹쳐 읽으면 그림이 더 넓어 보입니다.`,
  },
  {
    id: "bridge-10",
    endingGroup: "sigi",
    toneTags: ["stepByStep", "push"],
    render: (c) =>
      `${josa(c.traitNoun, "은/는")} ${c.type} 성향이 이미 손에 쥔 도구입니다. 그 도구를 ${c.keyword} 쪽으로 실제로 꺼내볼 시기입니다.`,
  },
  {
    id: "bridge-11",
    endingGroup: "ttaemun",
    toneTags: ["logic"],
    render: (c) =>
      `이 카드가 ${c.type}에게 특히 크게 들리는 이유가 있습니다. ${josa(c.overuseNoun, "과/와")} ${josa(c.keyword, "이/가")} 서로 반대편에서 마주 보고 있기 때문입니다.`,
  },
  {
    id: "bridge-12",
    endingGroup: "gwaenchanta",
    render: (c) =>
      `${josa(c.traitNoun, "이라는/라는")} 밑천이 있으니, ${c.contextNoun} 앞에서 ${josa(c.keyword, "을/를")} 겁내지 않아도 괜찮습니다.`,
  },
];
