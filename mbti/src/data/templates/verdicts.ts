import { josa } from "@/lib/reading-engine/compose/josa";
import type { CardPolarity } from "@/lib/reading-engine/card-polarity";
import type { TemplateVariant } from "@/lib/reading-engine/compose/sentence-bank";

/**
 * 한 줄 대답(verdict) 템플릿 — 주어는 항상 '카드'.
 * 카드에 귀속시키는 직접 화법으로 단호하되, 운명 단정(금지 표현)은 쓰지 않는다.
 * 이중 헤지 금지: 문장당 헤지 표현 1회 이하 (hasDoubleHedge 게이트).
 */
export interface VerdictContext {
  topicNameKo: string;
  contextNoun: string;
  /** 주 소재 키워드 (스프레드별 규칙으로 선정) */
  keyword: string;
  /** 보조 키워드 */
  secondKeyword: string;
  cardNameKo: string;
}

export const ONE_CARD_VERDICTS: Record<CardPolarity, readonly TemplateVariant<VerdictContext>[]> = {
  bright: [
    {
      id: "one-bright-01",
      endingGroup: "ttae",
      render: (c) =>
        `카드는 ${c.keyword} 쪽을 가리킵니다. 지금은 그 흐름에 올라타도 좋은 때입니다.`,
    },
    {
      id: "one-bright-02",
      endingGroup: "him",
      render: (c) =>
        `카드의 대답은 분명합니다 — ${c.keyword}. 미루지 말고 오늘 살려볼 힘입니다.`,
    },
    {
      id: "one-bright-03",
      endingGroup: "pyeon",
      render: (c) =>
        `카드는 ${josa(c.keyword, "을/를")} 열어 보였습니다. 지금의 ${c.contextNoun}에서는 붙잡는 편이 이깁니다.`,
    },
  ],
  steady: [
    {
      id: "one-steady-01",
      endingGroup: "tteut",
      render: (c) =>
        `카드는 ${josa(c.keyword, "을/를")} 가리킵니다. 서두르기보다 지금의 자리를 단단히 다지라는 뜻입니다.`,
    },
    {
      id: "one-steady-02",
      endingGroup: "gwaje",
      render: (c) =>
        `오늘의 대답은 ${c.keyword}입니다. 새 판을 벌이기보다 흐름을 지키는 것이 카드가 낸 과제입니다.`,
    },
    {
      id: "one-steady-03",
      endingGroup: "jari",
      render: (c) =>
        `카드는 ${c.keyword}에 머물라고 말합니다. 지금의 ${c.contextNoun}은 속도가 아니라 방향을 다듬을 자리입니다.`,
    },
  ],
  challenging: [
    {
      id: "one-chal-01",
      endingGroup: "gwaje",
      render: (c) =>
        `카드는 ${c.keyword}부터 짚으라고 말합니다. 피하지 않고 마주보는 것이 오늘의 과제입니다.`,
    },
    {
      id: "one-chal-02",
      endingGroup: "meonjeo",
      render: (c) =>
        `카드의 대답은 정면 돌파입니다 — ${c.keyword}. 덮어두면 커지고, 지금 보면 작습니다.`,
    },
    {
      id: "one-chal-03",
      endingGroup: "sijak",
      render: (c) =>
        `카드는 ${josa(c.keyword, "을/를")} 먼저 정리하라고 가리킵니다. 그 매듭이 풀려야 다음이 시작됩니다.`,
    },
  ],
};

export const THREE_CARD_VERDICTS: readonly TemplateVariant<VerdictContext>[] = [
  {
    id: "three-01",
    endingGroup: "geoleum",
    render: (c) =>
      `지금의 흐름은 ${c.keyword}, 카드가 가리키는 다음 걸음은 ${c.secondKeyword}입니다.`,
  },
  {
    id: "three-02",
    endingGroup: "banghyang",
    render: (c) =>
      `카드는 ${c.keyword}에서 ${c.secondKeyword} 쪽으로 방향을 틀라고 말합니다.`,
  },
  {
    id: "three-03",
    endingGroup: "daeup",
    render: (c) =>
      `세 장의 카드가 모은 대답은 하나입니다 — ${c.contextNoun}의 열쇠는 ${c.secondKeyword}입니다.`,
  },
  {
    id: "three-04",
    endingGroup: "ttae",
    render: (c) =>
      `카드는 ${josa(c.keyword, "을/를")} 인정하고, ${josa(c.secondKeyword, "으로/로")} 움직일 때라고 가리킵니다.`,
  },
  {
    id: "three-05",
    endingGroup: "jari",
    render: (c) =>
      `이번 배열의 중심은 ${c.secondKeyword}입니다. ${josa(c.keyword, "은/는")} 그 걸음을 위한 출발 자리입니다.`,
  },
];

export const RELATIONSHIP_VERDICTS: readonly TemplateVariant<VerdictContext>[] = [
  {
    id: "rel-01",
    endingGroup: "daeup",
    render: (c) =>
      `카드는 ${c.keyword} 쪽의 대화를 가리킵니다. 먼저 확인할 것은 ${c.secondKeyword}입니다.`,
  },
  {
    id: "rel-02",
    endingGroup: "meonjeo",
    render: (c) =>
      `이 관계에서 카드가 낸 대답은 ${c.keyword}입니다. 추측 대신 ${josa(c.secondKeyword, "을/를")} 직접 확인하는 것이 먼저입니다.`,
  },
  {
    id: "rel-03",
    endingGroup: "yeolsoe",
    render: (c) =>
      `카드는 말하기를 미루지 말라고 가리킵니다 — 열쇠는 ${c.keyword}의 대화에 있습니다.`,
  },
  {
    id: "rel-04",
    endingGroup: "banghyang",
    render: (c) =>
      `관계의 방향을 정하는 것은 상대가 아니라 ${c.secondKeyword}입니다. 카드는 그 지점을 짚었습니다.`,
  },
  {
    id: "rel-05",
    endingGroup: "ttae",
    render: (c) =>
      `카드는 ${josa(c.keyword, "을/를")} 입 밖으로 꺼낼 때라고 말합니다. ${c.secondKeyword}부터 확인하면 대화가 쉬워집니다.`,
  },
];

export const CAREER_VERDICTS: readonly TemplateVariant<VerdictContext>[] = [
  {
    id: "career-01",
    endingGroup: "geoleum",
    render: (c) => `카드가 가리키는 다음 걸음은 ${c.secondKeyword}입니다.`,
  },
  {
    id: "career-02",
    endingGroup: "daeup",
    render: (c) =>
      `이번 커리어 배열의 대답은 ${c.secondKeyword}입니다. 지금의 동력인 ${josa(c.keyword, "을/를")} 그 걸음에 실어 보세요.`,
  },
  {
    id: "career-03",
    endingGroup: "ttae",
    render: (c) =>
      `카드는 고민을 줄이고 ${josa(c.secondKeyword, "을/를")} 실행할 때라고 말합니다.`,
  },
  {
    id: "career-04",
    endingGroup: "jari",
    render: (c) =>
      `일의 무게중심을 ${josa(c.secondKeyword, "으로/로")} 옮기라는 것이 카드의 대답입니다. ${josa(c.keyword, "이라는/라는")} 동력은 이미 있습니다.`,
  },
  {
    id: "career-05",
    endingGroup: "banghyang",
    render: (c) =>
      `카드는 ${c.keyword}에서 출발해 ${c.secondKeyword} 쪽으로 나아가는 길을 가리킵니다.`,
  },
];

export interface ChoiceVerdictContext extends VerdictContext {
  /** 'A' | 'B' — 기울어진 선택지 라벨 */
  leanLabel: string;
}

export const CHOICE_LEAN_VERDICTS: readonly TemplateVariant<ChoiceVerdictContext>[] = [
  {
    id: "choice-lean-01",
    endingGroup: "silda",
    render: (c) => `카드의 무게는 선택 ${c.leanLabel} 쪽에 실려 있습니다.`,
  },
  {
    id: "choice-lean-02",
    endingGroup: "giulda",
    render: (c) => `두 갈래를 저울에 올리면, 카드는 선택 ${c.leanLabel} 쪽으로 기울어 있습니다.`,
  },
  {
    id: "choice-lean-03",
    endingGroup: "bakda",
    render: (c) =>
      `카드가 밝게 반응한 쪽은 선택 ${c.leanLabel}입니다.`,
  },
  {
    id: "choice-lean-04",
    endingGroup: "sonda",
    render: (c) => `배열은 선택 ${c.leanLabel}의 손을 들어 주었습니다.`,
  },
  {
    id: "choice-lean-05",
    endingGroup: "silda",
    render: (c) =>
      `카드의 대답은 선택 ${c.leanLabel} 쪽입니다. 다만 마지막 기준인 ${c.secondKeyword}과 함께 읽어야 완성됩니다.`,
  },
];

export const CHOICE_EVEN_VERDICTS: readonly TemplateVariant<VerdictContext>[] = [
  {
    id: "choice-even-01",
    endingGroup: "matgida",
    render: (c) =>
      `카드의 무게는 양쪽이 비슷합니다. 이럴 때 결정을 맡길 곳은 판단 기준 자리 — ${c.secondKeyword}입니다.`,
  },
  {
    id: "choice-even-02",
    endingGroup: "giulda",
    render: (c) =>
      `배열은 어느 한쪽으로 기울지 않았습니다. 카드는 대신 ${josa(c.secondKeyword, "이라는/라는")} 기준을 손에 쥐여 주었습니다.`,
  },
  {
    id: "choice-even-03",
    endingGroup: "daeup",
    render: (c) =>
      `두 길의 무게가 팽팽합니다. 이 판의 진짜 대답은 ${c.secondKeyword} — 무엇을 기준으로 고를지가 곧 선택입니다.`,
  },
];
