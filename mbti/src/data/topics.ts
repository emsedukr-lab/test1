import type { Topic, TopicId } from "@/types/reading";

export const TOPICS = {
  daily: {
    id: "daily",
    nameKo: "오늘의 메시지",
    description: "특별한 고민이 없어도 좋아요. 오늘 하루에 필요한 메시지를 받아보세요.",
    cardMeaningField: "lightMeaning",
    allowedSpreads: ["one-card", "three-card"],
    contextNouns: ["오늘", "하루", "마음"],
    recommendedQuestions: [
      "오늘 하루 어떤 마음가짐이 필요할까요?",
      "요즘 나에게 필요한 메시지는 무엇일까요?",
      "이번 주를 어떻게 보내면 좋을까요?",
    ],
  },
  love: {
    id: "love",
    nameKo: "연애",
    description: "지금 만나고 있는 사람과의 관계, 연애의 흐름을 살펴봅니다.",
    cardMeaningField: "relationshipMeaning",
    allowedSpreads: ["one-card", "three-card", "relationship"],
    contextNouns: ["마음", "관계", "상대"],
    recommendedQuestions: [
      "지금 이 관계에서 내가 놓치고 있는 것은 무엇일까요?",
      "상대와의 관계를 위해 무엇을 점검하면 좋을까요?",
      "이 관계에서 내 마음은 어디를 향하고 있을까요?",
    ],
  },
  crush: {
    id: "crush",
    nameKo: "썸과 관계",
    description: "아직 시작되지 않은 관계, 애매한 사이의 마음을 들여다봅니다.",
    cardMeaningField: "relationshipMeaning",
    allowedSpreads: ["one-card", "three-card", "relationship"],
    contextNouns: ["마음", "상대", "표현"],
    recommendedQuestions: [
      "이 사람에게 내 마음을 어떻게 표현하면 좋을까요?",
      "지금 이 관계에서 확인해야 할 것은 무엇일까요?",
      "관계를 진전시키기 전에 점검할 것이 있을까요?",
    ],
  },
  reunion: {
    id: "reunion",
    nameKo: "재회와 이별",
    description: "끝난 관계, 혹은 끝나가는 관계 앞에서 내 마음을 정리해봅니다.",
    cardMeaningField: "relationshipMeaning",
    allowedSpreads: ["one-card", "three-card", "relationship"],
    contextNouns: ["마음", "관계", "정리"],
    recommendedQuestions: [
      "이 관계를 돌아볼 때 내가 배울 수 있는 것은 무엇일까요?",
      "지금 내 마음이 진짜 원하는 것은 무엇일까요?",
      "다음 걸음을 위해 무엇을 정리하면 좋을까요?",
    ],
  },
  relationship: {
    id: "relationship",
    nameKo: "인간관계",
    description: "가족, 친구, 동료 — 사람 사이의 어려움과 균형을 살펴봅니다.",
    cardMeaningField: "relationshipMeaning",
    allowedSpreads: ["one-card", "three-card", "relationship"],
    contextNouns: ["관계", "사람", "거리"],
    recommendedQuestions: [
      "이 사람과의 관계에서 나는 어떤 역할을 하고 있을까요?",
      "관계의 불편함은 어디에서 오는 걸까요?",
      "이 관계에 필요한 적당한 거리는 어느 정도일까요?",
    ],
  },
  work: {
    id: "work",
    nameKo: "직장과 커리어",
    description: "지금 하고 있는 일, 직장 생활의 흐름과 에너지를 점검합니다.",
    cardMeaningField: "careerMeaning",
    allowedSpreads: ["one-card", "three-card", "career"],
    contextNouns: ["일", "동기", "에너지"],
    recommendedQuestions: [
      "지금 하는 일에서 나를 지치게 하는 것은 무엇일까요?",
      "내 강점을 일에서 더 살리려면 무엇이 필요할까요?",
      "이번 주 업무에서 집중해야 할 것은 무엇일까요?",
    ],
  },
  "career-path": {
    id: "career-path",
    nameKo: "이직과 진로",
    description: "지금 길을 계속 갈지, 방향을 바꿀지 — 진로의 갈림길을 살펴봅니다.",
    cardMeaningField: "careerMeaning",
    allowedSpreads: ["one-card", "three-card", "career", "choice"],
    contextNouns: ["방향", "길", "준비"],
    recommendedQuestions: [
      "진로를 고민할 때 내가 붙잡아야 할 기준은 무엇일까요?",
      "새로운 길을 위해 지금 준비할 수 있는 것은 무엇일까요?",
      "지금 이 갈림길에서 점검해야 할 것은 무엇일까요?",
    ],
  },
  money: {
    id: "money",
    nameKo: "금전과 생활",
    description: "돈의 흐름과 생활의 안정, 소비 습관을 돌아봅니다.",
    cardMeaningField: "moneyMeaning",
    allowedSpreads: ["one-card", "three-card", "choice"],
    contextNouns: ["돈", "생활", "습관"],
    recommendedQuestions: [
      "내 소비 습관에서 돌아볼 부분은 무엇일까요?",
      "생활의 안정을 위해 무엇을 점검하면 좋을까요?",
      "돈에 대한 내 불안은 어디에서 오는 걸까요?",
    ],
  },
  decision: {
    id: "decision",
    nameKo: "선택과 결정",
    description: "갈림길 앞에서 판단 기준을 정리하고 결정을 준비합니다.",
    cardMeaningField: "decisionMeaning",
    allowedSpreads: ["one-card", "three-card", "choice"],
    contextNouns: ["선택", "기준", "결정"],
    recommendedQuestions: [
      "이 선택에서 내가 정말 중요하게 여기는 것은 무엇일까요?",
      "결정을 미루게 만드는 것은 무엇일까요?",
      "두 갈래 길에서 각각 무엇을 감당해야 할까요?",
    ],
  },
  self: {
    id: "self",
    nameKo: "감정과 자기이해",
    description: "요즘의 감정과 내면의 상태를 차분히 들여다봅니다.",
    cardMeaningField: "selfGrowthMeaning",
    allowedSpreads: ["one-card", "three-card"],
    contextNouns: ["감정", "마음", "나"],
    recommendedQuestions: [
      "요즘 내 마음을 무겁게 하는 것은 무엇일까요?",
      "지금 내 감정이 나에게 말하려는 것은 무엇일까요?",
      "나를 돌보기 위해 무엇을 해볼 수 있을까요?",
    ],
  },
  study: {
    id: "study",
    nameKo: "학업과 목표",
    description: "공부와 목표를 향한 흐름, 집중과 동기를 점검합니다.",
    cardMeaningField: "careerMeaning",
    allowedSpreads: ["one-card", "three-card", "career"],
    contextNouns: ["목표", "집중", "과제"],
    recommendedQuestions: [
      "목표를 향해 가는 지금, 무엇을 점검하면 좋을까요?",
      "집중을 방해하는 것은 무엇일까요?",
      "이번 달 목표를 위해 무엇부터 해볼 수 있을까요?",
    ],
  },
  free: {
    id: "free",
    nameKo: "자유 질문",
    description: "어떤 고민이든 좋아요. 내 질문을 직접 적고 카드를 뽑아보세요.",
    cardMeaningField: "lightMeaning",
    allowedSpreads: ["one-card", "three-card", "choice"],
    contextNouns: ["고민", "질문", "마음"],
    recommendedQuestions: [
      "지금 내 머릿속을 가장 크게 차지하는 고민은 무엇인가요?",
      "요즘 반복해서 떠오르는 생각은 무엇인가요?",
      "누구에게도 묻지 못했던 질문이 있나요?",
    ],
  },
} as const satisfies Record<TopicId, Topic>;

export const ALL_TOPICS: readonly Topic[] = Object.values(TOPICS);

export function getTopic(id: TopicId): Topic {
  return TOPICS[id];
}

/** 조합 분석에서 '분야 연관 슈트' 판단용 */
export const TOPIC_SUIT: Partial<Record<TopicId, "wands" | "cups" | "swords" | "pentacles">> = {
  love: "cups",
  crush: "cups",
  reunion: "cups",
  relationship: "cups",
  work: "wands",
  "career-path": "wands",
  study: "wands",
  money: "pentacles",
  decision: "swords",
};
