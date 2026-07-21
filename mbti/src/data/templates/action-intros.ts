import type { MbtiType } from "@/types/mbti";
import type { TemplateVariant } from "@/lib/reading-engine/compose/sentence-bank";

/** 행동 조언 리스트 인트로 — 유형의 행동 제안 방식(actionFraming)으로 포장 */
export interface ActionIntroContext {
  type: MbtiType;
  /** profile.actionFraming — 부사구. 예: '가설처럼 세워 검증하듯' */
  actionFraming: string;
}

export const ACTION_INTROS: readonly TemplateVariant<ActionIntroContext>[] = [
  {
    id: "ai-01",
    endingGroup: "boseyo",
    render: (c) => `${c.type}라면 아래 행동을 ${c.actionFraming} 다뤄보세요.`,
  },
  {
    id: "ai-02",
    endingGroup: "bangbeop",
    render: (c) => `${c.actionFraming} 접근하는 것 — ${c.type}에게 가장 잘 붙는 방식입니다.`,
  },
  {
    id: "ai-03",
    endingGroup: "chungbun",
    render: (c) =>
      `전부 할 필요 없습니다. ${c.type}답게 ${c.actionFraming}, 하나만 골라도 충분합니다.`,
  },
  {
    id: "ai-04",
    endingGroup: "doenda",
    render: (c) => `${c.actionFraming} 시작하면 됩니다. 그게 ${c.type}의 속도입니다.`,
  },
];
