export type Arcana = "major" | "minor";
export type Suit = "wands" | "cups" | "swords" | "pentacles";

export type PipRank =
  | "ace"
  | "two"
  | "three"
  | "four"
  | "five"
  | "six"
  | "seven"
  | "eight"
  | "nine"
  | "ten";
export type CourtRank = "page" | "knight" | "queen" | "king";
export type MinorRank = PipRank | CourtRank;

interface TarotCardBase {
  /** 'major-00' ~ 'major-21', 'wands-01' ~ 'pentacles-14' (0패딩, 정렬 안정) */
  id: string;
  /** URL용: 'the-fool', 'ace-of-wands' */
  slug: string;
  nameKo: string;
  nameEn: string;
  /** 3개 이상, 명사(구)만 — 템플릿 삽입 소재 */
  keywords: readonly string[];
  /** 한 문장 요약, 20~90자 */
  summary: string;
  /** 이하 의미 필드는 1~2문장 완결문(합니다체) */
  lightMeaning: string;
  shadowMeaning: string;
  relationshipMeaning: string;
  /** '직장' 단어 금지 — 학업 분야에서 재사용하므로 '일과 과제' 등 범용 표현 */
  careerMeaning: string;
  moneyMeaning: string;
  selfGrowthMeaning: string;
  decisionMeaning: string;
  /** 2개 이상, '~하는 힘' 명사형 종결 */
  strengths: readonly string[];
  /** 2개 이상, '~하기 쉬움' 명사형 종결 */
  cautions: readonly string[];
  /** 3개 이상, '~까요?/~나요?/~가요?' 의문형 종결 */
  reflectionQuestions: readonly string[];
  /** 3개 이상, '~해 보세요' 권유형 종결 */
  suggestedActions: readonly string[];
  /** 카드 이미지 경로: '/cards/<id>.jpg' — 추후 다른 덱으로 교체 가능 */
  image: string;
  imageAlt: string;
}

export interface MajorCard extends TarotCardBase {
  arcana: "major";
  suit: null;
  rank: null;
  /** 0~21 (라이더-웨이트 체계: 8=힘, 11=정의) */
  number: number;
}

export interface MinorCard extends TarotCardBase {
  arcana: "minor";
  suit: Suit;
  rank: MinorRank;
  /** ace=1 … ten=10, page=11, knight=12, queen=13, king=14 */
  number: number;
}

export type TarotCard = MajorCard | MinorCard;

/** 고민 분야 매핑에 쓸 수 있는 의미 필드 유니온 */
export type CardMeaningField =
  | "lightMeaning"
  | "relationshipMeaning"
  | "careerMeaning"
  | "moneyMeaning"
  | "selfGrowthMeaning"
  | "decisionMeaning";

export const SUITS: readonly Suit[] = ["wands", "cups", "swords", "pentacles"];

export const MINOR_RANK_NUMBER: Record<MinorRank, number> = {
  ace: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  page: 11,
  knight: 12,
  queen: 13,
  king: 14,
};
