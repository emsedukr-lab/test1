import type { Spread, SpreadId } from "@/types/reading";

export const SPREADS = {
  "one-card": {
    id: "one-card",
    nameKo: "한 장 리딩",
    cardCount: 1,
    description: "지금 나에게 필요한 하나의 메시지를 확인합니다.",
    positions: [
      {
        index: 0,
        titleKo: "현재 필요한 메시지",
        roleDescription: "지금의 나에게 가장 필요한 관점",
        interpretationMode: "light",
      },
    ],
  },
  "three-card": {
    id: "three-card",
    nameKo: "세 장 리딩",
    cardCount: 3,
    description: "현재 상황과 놓친 부분, 그리고 필요한 행동을 차례로 살펴봅니다.",
    positions: [
      {
        index: 0,
        titleKo: "현재 상황",
        roleDescription: "지금 상황의 중심 흐름",
        interpretationMode: "light",
      },
      {
        index: 1,
        titleKo: "놓치고 있는 부분",
        roleDescription: "아직 살피지 못한 부분",
        interpretationMode: "caution",
      },
      {
        index: 2,
        titleKo: "필요한 행동",
        roleDescription: "지금 시도해볼 수 있는 행동의 방향",
        interpretationMode: "action",
      },
    ],
  },
  relationship: {
    id: "relationship",
    nameKo: "관계 리딩",
    cardCount: 5,
    description: "관계 속의 내 마음과 표현, 놓친 것과 필요한 대화를 살펴봅니다.",
    positions: [
      {
        index: 0,
        titleKo: "내가 원하는 것",
        roleDescription: "관계에서 내가 진짜 바라는 것",
        interpretationMode: "light",
      },
      {
        index: 1,
        titleKo: "현재 표현 방식",
        roleDescription: "내 마음이 지금 겉으로 드러나는 방식",
        interpretationMode: "light",
      },
      {
        index: 2,
        titleKo: "관계에서 놓치고 있는 것",
        roleDescription: "관계 안에서 아직 보지 못한 부분",
        interpretationMode: "caution",
      },
      {
        index: 3,
        titleKo: "확인해야 할 사실",
        roleDescription: "추측이 아니라 확인이 필요한 지점",
        interpretationMode: "caution",
      },
      {
        index: 4,
        titleKo: "필요한 대화",
        roleDescription: "관계를 위해 시도해볼 수 있는 대화",
        interpretationMode: "action",
      },
    ],
  },
  choice: {
    id: "choice",
    nameKo: "선택 리딩",
    cardCount: 6,
    description: "두 갈래 선택의 가능성과 책임, 판단 기준을 비교합니다.",
    positions: [
      {
        index: 0,
        titleKo: "선택의 핵심",
        roleDescription: "이 선택이 정말로 묻고 있는 것",
        interpretationMode: "light",
      },
      {
        index: 1,
        titleKo: "선택 A의 가능성",
        roleDescription: "첫 번째 길이 열어줄 수 있는 것",
        interpretationMode: "light",
      },
      {
        index: 2,
        titleKo: "선택 A가 요구하는 책임",
        roleDescription: "첫 번째 길이 요구하는 감당",
        interpretationMode: "caution",
      },
      {
        index: 3,
        titleKo: "선택 B의 가능성",
        roleDescription: "두 번째 길이 열어줄 수 있는 것",
        interpretationMode: "light",
      },
      {
        index: 4,
        titleKo: "선택 B가 요구하는 책임",
        roleDescription: "두 번째 길이 요구하는 감당",
        interpretationMode: "caution",
      },
      {
        index: 5,
        titleKo: "판단 기준",
        roleDescription: "결정할 때 붙잡을 기준",
        interpretationMode: "action",
      },
    ],
  },
  career: {
    id: "career",
    nameKo: "커리어 리딩",
    cardCount: 6,
    description: "일의 동기와 소진 요인, 강점과 자원, 위험과 다음 행동을 봅니다.",
    positions: [
      {
        index: 0,
        titleKo: "현재 동기",
        roleDescription: "지금 나를 움직이는 동력",
        interpretationMode: "light",
      },
      {
        index: 1,
        titleKo: "소진시키는 요인",
        roleDescription: "에너지를 깎아내리는 요인",
        interpretationMode: "caution",
      },
      {
        index: 2,
        titleKo: "활용하지 못하는 강점",
        roleDescription: "갖고 있지만 쓰지 못하는 힘",
        interpretationMode: "light",
      },
      {
        index: 3,
        titleKo: "현실적인 자원",
        roleDescription: "지금 기댈 수 있는 현실적 자원",
        interpretationMode: "light",
      },
      {
        index: 4,
        titleKo: "주의할 위험",
        roleDescription: "미리 살펴야 할 위험 요소",
        interpretationMode: "caution",
      },
      {
        index: 5,
        titleKo: "다음 행동",
        roleDescription: "이번 주에 시도해볼 수 있는 다음 걸음",
        interpretationMode: "action",
      },
    ],
  },
} as const satisfies Record<SpreadId, Spread>;

export const ALL_SPREADS: readonly Spread[] = Object.values(SPREADS);

export function getSpread(id: SpreadId): Spread {
  return SPREADS[id];
}
