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
  /** UI 제목 — 예: '현재 상황 — 컵 3' */
  headline: string;
  /** 조립된 본문 1~2문단 */
  paragraphs: readonly string[];
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
    /** 디버깅·재현용 */
    seed: number;
  };
  safety: SafetyCheckResult;
  /** safety.action === 'block'이면 아래 필드는 모두 비어 있음 */
  opening: string;
  /** MBTI 연결 문단 (미선택 시 null) */
  mbtiLens: string | null;
  cardSections: readonly CardReadingSection[];
  /** 최대 2개 */
  combinationInsights: readonly CombinationInsight[];
  /** 최대 2개 */
  strengthsHighlight: readonly string[];
  /** 최대 2개 */
  cautionsHighlight: readonly string[];
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
}
