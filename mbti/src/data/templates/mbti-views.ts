import type { MbtiType } from "@/types/mbti";
import { josa } from "@/lib/reading-engine/compose/josa";
import type { TemplateVariant } from "@/lib/reading-engine/compose/sentence-bank";

/**
 * 'MBTI의 시선' 라벨 블록 본문 — 모든 카드 섹션에 하나씩 붙는다.
 * 라벨이 유형을 표시하므로 문장에서 "{type} 성향이라면" 접두는 쓰지 않는다.
 * modeTags: 카드 위치 모드에 맞는 variant가 우선 매칭된다.
 */
export interface MbtiViewContext {
  type: MbtiType;
  /** profile.strengths에서 rng 선택한 명사구 */
  traitNoun: string;
  /** profile.overusePatterns에서 rng 선택한 명사구 */
  overuseNoun: string;
  /** profile.focus — 해석 초점 명사구 */
  focus: string;
  keyword: string;
  contextNoun: string;
  positionTitle: string;
}

export const MBTI_VIEWS: readonly TemplateVariant<MbtiViewContext>[] = [
  // ── light: 강점·focus 계열 ──
  {
    id: "view-01",
    endingGroup: "doenda",
    modeTags: ["light"],
    render: (c) =>
      `${c.focus}에 무게를 두는 눈에는 ${josa(c.keyword, "이/가")} 기회로 먼저 읽힙니다. ${josa(c.traitNoun, "을/를")} 그대로 쓰면 됩니다.`,
  },
  {
    id: "view-02",
    endingGroup: "jijeom",
    modeTags: ["light"],
    render: (c) =>
      `평소의 ${josa(c.traitNoun, "이/가")} 이 카드와 같은 방향을 보고 있습니다. 믿고 밀어도 좋은 지점입니다.`,
  },
  {
    id: "view-03",
    endingGroup: "boseyo",
    modeTags: ["light"],
    render: (c) =>
      `${josa(c.keyword, "은/는")} 익숙한 언어입니다. 다만 익숙하다고 건너뛰지 말고, 이번에는 소리 내어 확인해 보세요.`,
  },
  {
    id: "view-04",
    endingGroup: "doenda",
    modeTags: ["light"],
    render: (c) =>
      `이 자리의 기운은 ${c.focus}과 맞물려 돌아갑니다. 손에 익은 방식이 곧 무기가 됩니다.`,
  },
  {
    id: "view-05",
    endingGroup: "ganeung",
    modeTags: ["light"],
    render: (c) =>
      `${josa(c.traitNoun, "이/가")} 살아나는 배치입니다. 지금의 ${c.contextNoun}에서 그 힘을 아껴둘 이유가 없습니다.`,
  },

  // ── caution: 과잉 패턴 계열 ──
  {
    id: "view-06",
    endingGroup: "swipda",
    modeTags: ["caution"],
    render: (c) =>
      `${josa(c.overuseNoun, "이/가")} 이 자리에서 함정이 되기 쉽습니다. ${josa(c.keyword, "을/를")} 그 습관과 분리해서 보세요.`,
  },
  {
    id: "view-07",
    endingGroup: "ttaemun",
    modeTags: ["caution"],
    render: (c) =>
      `이 카드가 유난히 크게 들리는 이유 — ${josa(c.overuseNoun, "과/와")} 정면으로 마주 보고 있기 때문입니다.`,
  },
  {
    id: "view-08",
    endingGroup: "boinda",
    modeTags: ["caution"],
    render: (c) =>
      `${c.focus}만 보다가 놓치기 쉬운 각도입니다. 시야를 한 뼘 넓혀야 보입니다.`,
  },
  {
    id: "view-09",
    endingGroup: "jijeom",
    modeTags: ["caution"],
    render: (c) =>
      `${c.positionTitle} 자리의 경고는 남 얘기가 아닙니다. ${josa(c.overuseNoun, "이/가")} 자주 시작되는 지점입니다.`,
  },
  {
    id: "view-10",
    endingGroup: "boseyo",
    modeTags: ["caution"],
    render: (c) =>
      `판단을 내리기 전에 한 박자만 늦춰 보세요. ${josa(c.keyword, "은/는")} 급하게 읽으면 다른 얼굴을 보여줍니다.`,
  },

  // ── action: 실행 계열 ──
  {
    id: "view-11",
    endingGroup: "charye",
    modeTags: ["action"],
    render: (c) =>
      `${josa(c.traitNoun, "을/를")} 도구 삼아 ${josa(c.keyword, "을/를")} 실행으로 옮길 차례입니다.`,
  },
  {
    id: "view-12",
    endingGroup: "doenda",
    modeTags: ["action"],
    render: (c) =>
      `${c.focus}의 관점에서 첫 단추를 정하면 움직임이 쉬워집니다. 생각의 방식 그대로 밀고 가면 됩니다.`,
  },
  {
    id: "view-13",
    endingGroup: "boseyo",
    modeTags: ["action"],
    render: (c) =>
      `미루는 이유가 ${c.overuseNoun} 쪽이라면, 오늘은 그 반대로 한 번 가보세요.`,
  },
  {
    id: "view-14",
    endingGroup: "ganeung",
    modeTags: ["action"],
    render: (c) =>
      `이 행동은 ${josa(c.traitNoun, "과/와")} 잘 붙는 종류입니다. 시작만 하면 관성이 따라옵니다.`,
  },
  {
    id: "view-15",
    endingGroup: "jijeom",
    modeTags: ["action"],
    render: (c) =>
      `${c.positionTitle}의 실행이 무겁게 느껴진다면 크기를 줄이면 됩니다. ${josa(c.keyword, "은/는")} 반쪽짜리 시작도 시작으로 쳐줍니다.`,
  },

  // ── 공용 (모드 무관 폴백) ──
  {
    id: "view-16",
    endingGroup: "ilknida",
    render: (c) =>
      `${c.focus}의 렌즈로 보면 ${josa(c.keyword, "이/가")} 조금 다르게 읽힙니다. 그 차이가 이번 카드의 쓸모입니다.`,
  },
  {
    id: "view-17",
    endingGroup: "boinda",
    render: (c) =>
      `${josa(c.traitNoun, "과/와")} ${josa(c.overuseNoun, "은/는")} 같은 뿌리에서 나옵니다. 이 카드는 그 경계선을 비추고 있습니다.`,
  },
  {
    id: "view-18",
    endingGroup: "ganeung",
    render: (c) =>
      `지금의 ${c.contextNoun}에서 이 카드를 가장 잘 쓰는 방법은 ${c.focus}과 연결해 읽는 것입니다.`,
  },
];
