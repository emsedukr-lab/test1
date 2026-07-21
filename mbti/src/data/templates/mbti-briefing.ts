import type { MbtiType } from "@/types/mbti";
import { josa } from "@/lib/reading-engine/compose/josa";
import type { TemplateVariant } from "@/lib/reading-engine/compose/sentence-bank";

/** 유형 브리핑 ① — 이 유형이 이 주제를 대하는 방식 */
export interface BriefingApproachContext {
  type: MbtiType;
  /** 토픽군에 맞는 성향 완결문 (perception/decision/relationship style) */
  styleSentence: string;
  topicNameKo: string;
  focus: string;
}

export const BRIEFING_APPROACH: readonly TemplateVariant<BriefingApproachContext>[] = [
  {
    id: "appr-01",
    endingGroup: "matda",
    render: (c) =>
      `${c.styleSentence} 이번 ${c.topicNameKo} 리딩에서는 ${c.focus}에 무게를 두고 읽는 편이 잘 맞습니다.`,
  },
  {
    id: "appr-02",
    endingGroup: "doenda",
    render: (c) =>
      `${c.styleSentence} 그래서 이번 배열은 ${c.focus}의 렌즈로 읽을 때 가장 선명해집니다.`,
  },
  {
    id: "appr-03",
    endingGroup: "boseyo",
    render: (c) =>
      `${c.styleSentence} ${c.topicNameKo}에서도 마찬가지 — ${josa(c.focus, "을/를")} 중심에 놓고 카드를 읽어 보세요.`,
  },
];

/** 유형 브리핑 ② — 이번 배열에서 특히 주목할 카드의 사유 */
export interface FocusCardReasonContext {
  positionTitle: string;
  cardNameKo: string;
  keyword: string;
  focus: string;
}

export const FOCUS_CARD_REASONS: readonly TemplateVariant<FocusCardReasonContext>[] = [
  {
    id: "fcr-01",
    endingGroup: "kadeu",
    render: (c) =>
      `${c.positionTitle} 자리의 ${c.cardNameKo} — ${c.focus}과 맞닿은 ${josa(c.keyword, "이/가")} 있어 특히 눈여겨볼 카드입니다.`,
  },
  {
    id: "fcr-02",
    endingGroup: "jari",
    render: (c) =>
      `이번 배열에서 발걸음을 멈출 곳은 ${c.positionTitle}의 ${c.cardNameKo}입니다. ${josa(c.keyword, "이/가")} 당신의 언어와 같은 결이기 때문입니다.`,
  },
  {
    id: "fcr-03",
    endingGroup: "boseyo",
    render: (c) =>
      `${c.cardNameKo}(${c.positionTitle})부터 읽어 보세요. ${c.focus}에 가장 곧게 닿아 있는 카드입니다.`,
  },
];

/** 유형 브리핑 ③ — 유형별 함정 */
export interface PitfallContext {
  overuseNoun: string;
  topicNameKo: string;
}

export const PITFALLS: readonly TemplateVariant<PitfallContext>[] = [
  {
    id: "pit-01",
    endingGroup: "swipda",
    render: (c) => `다만 ${josa(c.overuseNoun, "이/가")} 이번 배열에서는 함정이 되기 쉽습니다.`,
  },
  {
    id: "pit-02",
    endingGroup: "jom",
    render: (c) =>
      `조심할 것은 하나 — ${c.overuseNoun}. ${c.topicNameKo} 앞에서 유독 자주 튀어나오는 습관입니다.`,
  },
  {
    id: "pit-03",
    endingGroup: "boseyo",
    render: (c) =>
      `${josa(c.overuseNoun, "이/가")} 고개를 들면 그때가 쉼표를 찍을 순간입니다. 그것만 지켜 보세요.`,
  },
];
