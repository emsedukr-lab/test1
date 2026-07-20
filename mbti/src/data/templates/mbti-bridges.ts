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
];
