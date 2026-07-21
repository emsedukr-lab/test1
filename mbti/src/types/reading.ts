import type { CardMeaningField } from "./tarot";
import type { MbtiType } from "./mbti";

// ---------- 고민 분야 ----------
export type TopicId =
  | "daily" // 오늘의 메시지
  | "love" // 연애
  | "crush" // 썸과 관계
  | "reunion" // 재회와 이별
  | "relationship" // 인간관계
  | "work" // 직장과 커리어
  | "career-path" // 이직과 진로
  | "money" // 금전과 생활
  | "decision" // 선택과 결정
  | "self" // 감정과 자기이해
  | "study" // 학업과 목표
  | "free"; // 자유 질문

export interface Topic {
  id: TopicId;
  nameKo: string;
  /** 선택 화면 안내문 */
  description: string;
  cardMeaningField: CardMeaningField;
  allowedSpreads: readonly SpreadId[];
  /** 문장 조합 시 분야 어휘 주입 + 성찰질문/행동 rerank 매칭용 명사 */
  contextNouns: readonly string[];
  /** 분야 선택 시 표시할 추천 질문 (3개 이상) */
  recommendedQuestions: readonly string[];
}

// ---------- 스프레드 ----------
export type SpreadId = "one-card" | "three-card" | "relationship" | "choice" | "career";

/** 카드 해석 관점: 긍정(빛) / 주의(그림자) / 행동 */
export type InterpretationMode = "light" | "caution" | "action";

export interface SpreadPosition {
  index: number;
  titleKo: string;
  /** 이 자리가 묻는 것 — 프레임 문장 소재 */
  roleDescription: string;
  interpretationMode: InterpretationMode;
}

export interface Spread {
  id: SpreadId;
  nameKo: string;
  cardCount: 1 | 3 | 5 | 6;
  positions: readonly SpreadPosition[];
  description: string;
}

// ---------- 입력 ----------
export const QUESTION_MAX_LENGTH = 300;

export interface ReadingInput {
  topicId: TopicId;
  spreadId: SpreadId;
  /** null = MBTI 미선택 모드 */
  mbti: MbtiType | null;
  /** 자유 질문 (최대 300자) — 시드·공유 페이로드에서 제외 */
  question?: string;
  /** UI 셔플 결과, 스프레드 위치 순서대로 */
  drawnCardIds: readonly string[];
  /** 위치별 역방향 여부 — 생략 시 전부 정방향 */
  reversedFlags?: readonly boolean[];
}

// ---------- 안전 필터 ----------
export type SafetyCategory = "self-harm" | "violence" | "medical" | "legal" | "investment";

export interface SafetyCheckResult {
  flagged: boolean;
  category: SafetyCategory | null;
  /** block: 리딩 생성 중단, 안내문만 / warn: 안내문 상단 표기 + 리딩 진행 */
  action: "none" | "warn" | "block";
  message: string | null;
}

// ---------- 결과 ----------
export interface CardReadingSection {
  cardId: string;
  cardNameKo: string;
  positionTitle: string;
  mode: InterpretationMode;
  /** 역방향 여부 */
  reversed: boolean;
  /** UI 제목 — 예: '현재 상황 — 컵 3' */
  headline: string;
  /** 대표 키워드 (칩 렌더용) */
  keyword: string;
  /** 핵심 한 줄 — 명사구 결론. 예: '속도 조절 — 점검이 필요한 지점' */
  essence: string;
  /** 위치 프레임 1문장 */
  intro: string;
  /** 의미 본문 (정방향 최대 2문장, 역방향 최대 3문장) */
  main: string;
  /** 'MBTI의 시선' 라벨 블록 본문 (MBTI 미선택 시 null) */
  mbtiView: string | null;
}

/** 선택 리딩의 기울기 — 카드 극성 점수 기반 (운명 판정이 아니라 카드 성격의 합산) */
export interface ChoiceLean {
  lean: "A" | "B" | "even";
  scoreA: number;
  scoreB: number;
  /** 기울기의 근거 1~2문장 (동점이면 판단 기준 안내) */
  reason: string;
}

/** 한 줄 대답 — 주어는 항상 '카드' */
export interface ReadingVerdict {
  text: string;
  /** 히어로 칩용 — 카드 순서대로의 대표 키워드 */
  keywords: readonly string[];
  /** '지금 할 일 1가지' — actions[0] (없으면 null) */
  firstStep: string | null;
  /** choice 스프레드에서만 존재 */
  choiceLean?: ChoiceLean;
}

/** 유형 브리핑 — MBTI 맞춤 해석의 중심 블록 */
export interface MbtiBriefing {
  type: MbtiType;
  /** 별칭 — profile.title */
  title: string;
  /** 이 유형이 이 주제를 대하는 방식 */
  approach: string;
  /** 이번 배열에서 특히 주목할 카드 (결정적 매칭 산식으로 선정) */
  focusCard: {
    cardId: string;
    cardNameKo: string;
    positionTitle: string;
    reason: string;
  };
  /** 유형별 함정 1개 */
  pitfall: string;
}

export type CombinationKind =
  | "major-dominant"
  | "major-absent"
  | "suit-dominant"
  | "topic-suit-missing"
  | "repeated-number"
  | "court-heavy"
  | "ace-cluster"
  | "expansion-flow"
  | "convergence-flow";

export interface CombinationInsight {
  kind: CombinationKind;
  /** 조립 완료된 1~2문장 */
  body: string;
  /** 상위 2개 채택용 */
  weight: number;
}

export interface ReadingResult {
  meta: {
    topicId: TopicId;
    spreadId: SpreadId;
    mbti: MbtiType | null;
    cardIds: readonly string[];
    reversedFlags: readonly boolean[];
    /** 디버깅·재현용 */
    seed: number;
  };
  safety: SafetyCheckResult;
  /** safety.action === 'block'이면 null·빈 값 */
  verdict: ReadingVerdict | null;
  opening: string;
  /** 유형 브리핑 (MBTI 미선택 시 null) */
  mbtiBriefing: MbtiBriefing | null;
  cardSections: readonly CardReadingSection[];
  /** 최대 2개 */
  combinationInsights: readonly CombinationInsight[];
  /** 최대 2개 */
  strengthsHighlight: readonly string[];
  /** 최대 2개 */
  cautionsHighlight: readonly string[];
  /** 행동 리스트 인트로 — 유형의 행동 방식 프레이밍 (MBTI 미선택 시 null) */
  actionsIntro: string | null;
  /** 최대 3개 */
  actions: readonly string[];
  /** 정확히 3개 */
  reflectionQuestions: readonly string[];
  /** 마무리 한 문장 */
  closing: string;
}

// ---------- 기록 ----------
export interface ReadingRecord {
  /** readingId 재사용 — 중복 저장 방지 키 */
  id: string;
  v: 1;
  /** ISO 8601 */
  createdAt: string;
  mbti: MbtiType | null;
  topicId: TopicId;
  /** 로컬에만 저장 — 공유 페이로드에는 절대 미포함 */
  question: string;
  spreadId: SpreadId;
  cardIds: readonly string[];
  /** 역방향 여부 (구버전 기록에는 없을 수 있음 — 생략 시 전부 정방향) */
  reversedFlags?: readonly boolean[];
}
