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
    {
      id: "light-06",
      endingGroup: "heureum",
      render: (c) =>
        `${josa(c.cardNameKo, "이/가")} ${c.positionTitle} 자리를 밝히고 있습니다. ${c.topicNameKo}의 풍경 안으로 ${josa(c.keyword, "이/가")} 스며드는 흐름입니다.`,
    },
    {
      id: "light-07",
      endingGroup: "geonnenda",
      toneTags: ["logic", "bigPicture"],
      render: (c) =>
        `이 자리가 묻는 것은 ${c.roleDescription}입니다. ${josa(c.cardNameKo, "은/는")} ${josa(c.keyword, "이라는/라는")} 답을 먼저 건넵니다.`,
    },
    {
      id: "light-08",
      endingGroup: "sigi",
      toneTags: ["gentle", "hold"],
      render: (c) =>
        `${c.positionTitle} 쪽에서 ${josa(c.cardNameKo, "이/가")} 얼굴을 내밀었습니다. ${josa(c.keyword, "과/와")} 천천히 가까워져볼 만한 시기입니다.`,
    },
    {
      id: "light-09",
      endingGroup: "boinda",
      render: (c) =>
        `${c.topicNameKo}에서 지금 눈여겨볼 대목은 ${c.cardNameKo}의 등장입니다. ${josa(c.contextNoun, "이/가")} ${c.keyword} 쪽으로 방향을 틀고 있는 것으로 보입니다.`,
    },
    {
      id: "light-10",
      endingGroup: "ganeung",
      toneTags: ["value"],
      render: (c) =>
        `${josa(c.cardNameKo, "은/는")} ${josa(c.keyword, "을/를")} 품고 있는 카드입니다. 그 기운이 지금의 ${c.contextNoun}에 온기를 더해줄 수 있습니다.`,
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
    {
      id: "caution-06",
      endingGroup: "moreunda",
      render: (c) =>
        `${c.positionTitle}에서 ${josa(c.cardNameKo, "이/가")} 속도를 늦추라는 손짓을 보냅니다. 지금의 ${c.contextNoun}에서 ${josa(c.keyword, "은/는")} 어느새 몸집이 커져 있을지도 모릅니다.`,
    },
    {
      id: "caution-07",
      endingGroup: "tteut",
      toneTags: ["direct", "logic"],
      render: (c) =>
        `${josa(c.cardNameKo, "은/는")} 경고라기보다 점검 안내에 가깝습니다. ${c.contextNoun} 어딘가에서 ${josa(c.keyword, "이/가")} 중심을 흔들고 있지는 않은지 짚어보라는 뜻입니다.`,
    },
    {
      id: "caution-08",
      endingGroup: "manhada",
      render: (c) =>
        `${c.positionTitle} 위에 ${josa(c.cardNameKo, "이/가")} 조심스럽게 놓였습니다. ${josa(c.keyword, "을/를")} 향한 마음이 앞서 있지는 않은지 돌아볼 만합니다.`,
    },
    {
      id: "caution-09",
      endingGroup: "heureum",
      toneTags: ["bigPicture", "hold"],
      render: (c) =>
        `한 템포 쉬어가라는 표시가 ${c.positionTitle} 자리에 떴습니다. ${c.topicNameKo}에서 ${josa(c.keyword, "이/가")} 방향을 잃기 전에 숨을 고르는 흐름입니다.`,
    },
    {
      id: "caution-10",
      endingGroup: "piryo",
      render: (c) =>
        `${josa(c.cardNameKo, "은/는")} 밝은 면과 그늘을 함께 지닌 카드입니다. 오늘은 ${c.keyword} 뒤편의 그늘을 먼저 살펴볼 필요가 있습니다.`,
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
    {
      id: "action-06",
      endingGroup: "baraboda",
      toneTags: ["push", "direct"],
      render: (c) =>
        `${josa(c.cardNameKo, "이/가")} ${c.positionTitle} 자리에서 등을 가볍게 밀어줍니다. 오늘 ${josa(c.keyword, "을/를")} 위한 작은 실험 하나를 벌여봐도 좋겠습니다.`,
    },
    {
      id: "action-07",
      endingGroup: "heureum",
      render: (c) =>
        `이 자리의 초점은 ${c.roleDescription}입니다. ${josa(c.contextNoun, "을/를")} ${c.keyword} 쪽으로 한 뼘 옮겨보는 흐름입니다.`,
    },
    {
      id: "action-08",
      endingGroup: "moreunda",
      toneTags: ["stepByStep", "gentle"],
      render: (c) =>
        `${c.positionTitle} 자리에 앉은 ${josa(c.cardNameKo, "은/는")} 거창한 결심을 요구하지 않습니다. ${josa(c.keyword, "으로/로")} 이어지는 가장 작은 계단 하나면 충분할지도 모릅니다.`,
    },
    {
      id: "action-09",
      endingGroup: "shinho",
      toneTags: ["push"],
      render: (c) =>
        `${josa(c.cardNameKo, "이/가")} 가리키는 방향은 ${c.keyword} 쪽입니다. 생각을 행동으로 옮겨볼 차례라는 신호입니다.`,
    },
    {
      id: "action-10",
      endingGroup: "manhada",
      render: (c) =>
        `${c.topicNameKo}의 흐름을 바꾸는 것은 대개 큰 결단보다 작은 손놀림입니다. 이번 주 안에 해볼 수 있는 ${c.keyword}의 첫 조각을 골라볼 만합니다.`,
    },
  ],
};
