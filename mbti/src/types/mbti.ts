export type EI = "E" | "I";
export type SN = "S" | "N";
export type TF = "T" | "F";
export type JP = "J" | "P";

/** 템플릿 리터럴로 16개 유형이 자동 유도됨 — 오타 방지 */
export type MbtiType = `${EI}${SN}${TF}${JP}`;

export type MbtiGroup = "analyst" | "diplomat" | "sentinel" | "explorer";

/** 4개 지표에서 유도되는 문장 톤 스위치 — 템플릿 variant 태그 필터로 사용 */
export interface ToneRules {
  /** T+E: 결론 먼저 / F 또는 I: 완충 표현 먼저 */
  directness: "direct" | "gentle";
  /** T: 근거·구조 중심 / F: 의미·감정 중심 */
  framing: "logic" | "value";
  /** N: 방향 제시 / S: 구체 단계 제시 */
  scope: "bigPicture" | "stepByStep";
  /** J: 결정·마감 독려 / P: 탐색 여지 존중 */
  pace: "push" | "hold";
}

export interface MbtiProfile {
  type: MbtiType;
  group: MbtiGroup;
  /** 짧은 별칭 — 예: '조용한 전략가' */
  title: string;
  /** 한 문장 성향 요약 */
  summary: string;
  /** 완결문 1~2문장 */
  perceptionStyle: string;
  decisionStyle: string;
  relationshipStyle: string;
  /** 2개 이상 */
  stressPatterns: readonly string[];
  /** 3개 이상, 명사형 종결 */
  strengths: readonly string[];
  /** 2개 이상 — 강점이 과잉될 때의 패턴 */
  overusePatterns: readonly string[];
  /** 이 유형에게 잘 맞는 조언 방식 설명 (완결문) */
  effectiveAdviceStyle: string;
  /** 행동조언 rerank용 매칭 키워드: '기록', '대화', '계획' 등 */
  actionPreferences: readonly string[];
  /** 2개 이상, 보완 관점 완결문 */
  balancingPerspectives: readonly string[];
  toneRules: ToneRules;
}

export const MBTI_TYPES: readonly MbtiType[] = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

export const MBTI_GROUP_NAMES: Record<MbtiGroup, string> = {
  analyst: "분석형",
  diplomat: "외교형",
  sentinel: "관리자형",
  explorer: "탐험가형",
};

export const MBTI_GROUPS: Record<MbtiGroup, readonly MbtiType[]> = {
  analyst: ["INTJ", "INTP", "ENTJ", "ENTP"],
  diplomat: ["INFJ", "INFP", "ENFJ", "ENFP"],
  sentinel: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
  explorer: ["ISTP", "ISFP", "ESTP", "ESFP"],
};

export function isMbtiType(value: string): value is MbtiType {
  return /^[EI][SN][TF][JP]$/.test(value);
}
