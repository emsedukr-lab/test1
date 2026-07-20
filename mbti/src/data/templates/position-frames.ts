import type { InterpretationMode } from "@/types/reading";
import { josa } from "@/lib/reading-engine/compose/josa";
import type { TemplateVariant } from "@/lib/reading-engine/compose/sentence-bank";

/**
 * 카드 섹션 첫 문장 — 위치와 카드를 소개하고, 이어질 의미 완결문의 맥락을 예고한다.
 * 슬롯에는 명사(구)만 들어간다.
 */
export const POSITION_FRAMES: Record<InterpretationMode, readonly TemplateVariant[]> = {
  light: [
    {
      id: "light-01",
      endingGroup: "nawatda",
      render: (c) =>
        `${c.positionTitle} 자리에는 ${josa(c.cardNameKo, "이/가")} 나왔습니다. ${josa(c.keyword, "이라는/라는")} 흐름이 지금의 ${c.contextNoun}에 닿아 있는 모습입니다.`,
    },
    {
      id: "light-02",
      endingGroup: "boinda",
      render: (c) =>
        `${c.positionTitle}을 비추는 카드는 ${c.cardNameKo}입니다. ${c.roleDescription}에 ${josa(c.keyword, "이/가")} 자리하고 있는 것으로 보입니다.`,
    },
    {
      id: "light-03",
      endingGroup: "malhanda",
      toneTags: ["direct", "logic"],
      render: (c) =>
        `${c.positionTitle} 자리의 ${c.cardNameKo}는 ${josa(c.keyword, "을/를")} 말하고 있습니다.`,
    },
    {
      id: "light-04",
      endingGroup: "ganeung",
      toneTags: ["gentle", "value"],
      render: (c) =>
        `${c.positionTitle} 자리에서 ${josa(c.cardNameKo, "이/가")} 모습을 드러냈습니다. ${c.topicNameKo}의 한가운데에 ${josa(c.keyword, "이/가")} 흐르고 있을 수 있습니다.`,
    },
    {
      id: "light-05",
      endingGroup: "ilknida",
      toneTags: ["bigPicture"],
      render: (c) =>
        `${c.positionTitle}에 놓인 ${c.cardNameKo}는 ${c.roleDescription}을 ${josa(c.keyword, "으로/로")} 읽어보라는 카드입니다.`,
    },
  ],
  caution: [
    {
      id: "caution-01",
      endingGroup: "boinda",
      render: (c) =>
        `${c.positionTitle} 자리에는 ${josa(c.cardNameKo, "이/가")} 나왔습니다. ${josa(c.keyword, "과/와")} 관련해 아직 살피지 못한 부분이 있어 보입니다.`,
    },
    {
      id: "caution-02",
      endingGroup: "swipda",
      render: (c) =>
        `${c.positionTitle}을 비추는 카드는 ${c.cardNameKo}입니다. ${c.contextNoun}에서 ${josa(c.keyword, "이/가")} 슬며시 힘을 키우기 쉬운 자리입니다.`,
    },
    {
      id: "caution-03",
      endingGroup: "malhanda",
      toneTags: ["direct", "logic"],
      render: (c) =>
        `${c.positionTitle} 자리의 ${c.cardNameKo}는 ${josa(c.keyword, "을/를")} 한 번 점검해보라고 말합니다.`,
    },
    {
      id: "caution-04",
      endingGroup: "ganeung",
      toneTags: ["gentle", "value"],
      render: (c) =>
        `${c.positionTitle} 자리에서 ${josa(c.cardNameKo, "이/가")} 조용히 신호를 보내고 있습니다. ${c.roleDescription}이 ${josa(c.keyword, "과/와")} 얽혀 있을 가능성이 있습니다.`,
    },
    {
      id: "caution-05",
      endingGroup: "ilknida",
      toneTags: ["stepByStep"],
      render: (c) =>
        `${c.positionTitle}에 놓인 ${c.cardNameKo}는 ${c.contextNoun}의 사각지대에 ${josa(c.keyword, "이/가")} 있다는 뜻으로 읽힙니다.`,
    },
  ],
  action: [
    {
      id: "action-01",
      endingGroup: "nawatda",
      render: (c) =>
        `${c.positionTitle} 자리에는 ${josa(c.cardNameKo, "이/가")} 나왔습니다. ${josa(c.keyword, "을/를")} 향해 몸을 움직여볼 때라는 신호일 수 있습니다.`,
    },
    {
      id: "action-02",
      endingGroup: "boinda",
      render: (c) =>
        `${c.positionTitle}을 비추는 카드는 ${c.cardNameKo}입니다. ${c.roleDescription}은 ${c.keyword} 쪽에 있는 것으로 보입니다.`,
    },
    {
      id: "action-03",
      endingGroup: "malhanda",
      toneTags: ["direct", "push"],
      render: (c) =>
        `${c.positionTitle} 자리의 ${c.cardNameKo}는 ${josa(c.keyword, "을/를")} 첫걸음으로 삼아보라고 말합니다.`,
    },
    {
      id: "action-04",
      endingGroup: "ganeung",
      toneTags: ["gentle", "hold"],
      render: (c) =>
        `${c.positionTitle} 자리에서 ${josa(c.cardNameKo, "이/가")} 나왔습니다. 부담이 없는 크기로 ${josa(c.keyword, "을/를")} 시도해볼 수 있는 때입니다.`,
    },
    {
      id: "action-05",
      endingGroup: "ilknida",
      toneTags: ["stepByStep"],
      render: (c) =>
        `${c.positionTitle}에 놓인 ${c.cardNameKo}는 지금의 ${c.contextNoun}에서 ${josa(c.keyword, "이/가")} 다음 걸음이 된다는 뜻으로 읽힙니다.`,
    },
  ],
};
