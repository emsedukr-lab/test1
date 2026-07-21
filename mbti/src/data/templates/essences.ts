import type { InterpretationMode } from "@/types/reading";

/**
 * 카드별 핵심 한 줄(essence) — "{키워드} — 결론구" 명사구.
 * registry에 등록하지 않는다(짧은 명사구가 유사도 dedupe를 오염시키지 않도록).
 * 같은 리딩 내 반복은 '직전 카드와 다른 variant' 로컬 규칙으로 회피.
 */
export interface EssenceVariant {
  id: string;
  render: (keyword: string) => string;
}

export const ESSENCES: Record<InterpretationMode | "reversed", readonly EssenceVariant[]> = {
  light: [
    { id: "es-light-1", render: (k) => `${k} — 지금 기댈 흐름` },
    { id: "es-light-2", render: (k) => `${k} — 살려 쓸 힘` },
    { id: "es-light-3", render: (k) => `${k} — 이미 손에 있는 자원` },
    { id: "es-light-4", render: (k) => `${k} — 믿어도 되는 방향` },
  ],
  caution: [
    { id: "es-caution-1", render: (k) => `${k} — 점검이 필요한 지점` },
    { id: "es-caution-2", render: (k) => `${k} — 커지기 전에 볼 것` },
    { id: "es-caution-3", render: (k) => `${k} — 놓치기 쉬운 사각` },
    { id: "es-caution-4", render: (k) => `${k} — 잠시 멈춰 확인할 것` },
  ],
  action: [
    { id: "es-action-1", render: (k) => `${k} — 다음 한 걸음` },
    { id: "es-action-2", render: (k) => `${k} — 이번 주의 실험` },
    { id: "es-action-3", render: (k) => `${k} — 지금 옮길 무게` },
    { id: "es-action-4", render: (k) => `${k} — 말이 아닌 행동으로` },
  ],
  reversed: [
    { id: "es-rev-1", render: (k) => `${k} — 회복이 먼저` },
    { id: "es-rev-2", render: (k) => `${k} — 아직 눌려 있는 힘` },
    { id: "es-rev-3", render: (k) => `${k} — 방향을 되돌릴 지점` },
  ],
};
