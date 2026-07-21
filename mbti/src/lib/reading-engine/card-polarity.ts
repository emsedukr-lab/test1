/**
 * 카드 극성 맵 — verdict(한 줄 대답)와 선택 리딩의 기울기 계산에 쓰인다.
 *
 * 극성은 '카드 성격'의 분류이지 결과 예언이 아니다. 분류 기준:
 * - bright: 확장·개방·회복의 에너지가 카드의 중심 서사
 * - steady: 과정·유지·구조·중립 관찰이 중심 (궁정 카드 14장 전부 — 인물의 태도이지 결과가 아님)
 * - challenging: 상실·직면·제약·경고가 중심 서사 (각 슈트의 5 포함)
 * 수비학 보조 규칙: 5는 전 슈트 challenging / 궁정(11~14)은 전부 steady.
 * 예외는 개별 주석으로 사유를 남긴다.
 */

export type CardPolarity = "bright" | "steady" | "challenging";

export const CARD_POLARITY: Readonly<Record<string, CardPolarity>> = {
  // ── 메이저 아르카나 ──
  "major-00": "bright", // 바보 — 새로운 시작
  "major-01": "bright", // 마법사 — 의지의 실현
  "major-02": "steady", // 여사제 — 내면 관찰
  "major-03": "bright", // 여황제 — 풍요
  "major-04": "steady", // 황제 — 구조·질서
  "major-05": "steady", // 교황 — 전통·조언
  "major-06": "bright", // 연인 — 가치의 결합
  "major-07": "bright", // 전차 — 추진
  "major-08": "bright", // 힘 — 부드러운 용기
  "major-09": "steady", // 은둔자 — 성찰
  "major-10": "steady", // 운명의 수레바퀴 — 흐름의 전환(중립)
  "major-11": "steady", // 정의 — 공정한 판단
  "major-12": "challenging", // 매달린 사람 — 정지·관점 전환의 대가
  "major-13": "challenging", // 죽음 — 끝맺음의 직면
  "major-14": "steady", // 절제 — 균형
  "major-15": "challenging", // 악마 — 속박의 자각
  "major-16": "challenging", // 타워 — 붕괴의 직면
  "major-17": "bright", // 별 — 희망·회복
  "major-18": "challenging", // 달 — 불확실·불안
  "major-19": "bright", // 태양 — 명료한 기쁨
  "major-20": "bright", // 심판 — 부름과 재기
  "major-21": "bright", // 세계 — 완성

  // ── 완드 (불) ──
  "wands-01": "bright", // 에이스 — 열정의 씨앗
  "wands-02": "steady", // 2 — 계획·전망
  "wands-03": "steady", // 3 — 확장의 기다림
  "wands-04": "bright", // 4 — 안정·축하
  "wands-05": "challenging", // 5 — 경쟁·마찰
  "wands-06": "bright", // 6 — 인정·성취
  "wands-07": "challenging", // 7 — 방어·버티기
  "wands-08": "bright", // 8 — 빠른 진행
  "wands-09": "challenging", // 9 — 지친 견지
  "wands-10": "challenging", // 10 — 과중한 부담
  "wands-11": "steady",
  "wands-12": "steady",
  "wands-13": "steady",
  "wands-14": "steady",

  // ── 컵 (물) ──
  "cups-01": "bright", // 에이스 — 마음이 열림
  "cups-02": "bright", // 2 — 상호 교감
  "cups-03": "bright", // 3 — 함께하는 기쁨
  "cups-04": "challenging", // 4 — 권태·무관심
  "cups-05": "challenging", // 5 — 상실·후회
  "cups-06": "steady", // 6 — 추억·호의
  "cups-07": "challenging", // 7 — 환상·선택지 과다
  "cups-08": "challenging", // 8 — 떠남·전환의 대가
  "cups-09": "bright", // 9 — 만족
  "cups-10": "bright", // 10 — 정서적 충만
  "cups-11": "steady",
  "cups-12": "steady",
  "cups-13": "steady",
  "cups-14": "steady",

  // ── 소드 (공기) ──
  "swords-01": "steady", // 에이스 — 명료한 통찰(양날)
  "swords-02": "challenging", // 2 — 교착·회피
  "swords-03": "challenging", // 3 — 상처의 직면
  "swords-04": "steady", // 4 — 휴식·회복
  "swords-05": "challenging", // 5 — 공허한 승리
  "swords-06": "steady", // 6 — 회복의 여정
  "swords-07": "challenging", // 7 — 전략·기만의 경계
  "swords-08": "challenging", // 8 — 자기 제약
  "swords-09": "challenging", // 9 — 불안 과잉
  "swords-10": "challenging", // 10 — 바닥·끝맺음
  "swords-11": "steady",
  "swords-12": "steady",
  "swords-13": "steady",
  "swords-14": "steady",

  // ── 펜타클 (흙) ──
  "pentacles-01": "bright", // 에이스 — 실질적 기회
  "pentacles-02": "steady", // 2 — 균형 잡기
  "pentacles-03": "bright", // 3 — 협업·인정
  "pentacles-04": "challenging", // 4 — 움켜쥔 집착 (4지만 예외)
  "pentacles-05": "challenging", // 5 — 결핍·소외
  "pentacles-06": "bright", // 6 — 나눔의 균형
  "pentacles-07": "steady", // 7 — 평가·인내
  "pentacles-08": "steady", // 8 — 꾸준한 연마
  "pentacles-09": "bright", // 9 — 자립과 풍요
  "pentacles-10": "bright", // 10 — 축적·안정
  "pentacles-11": "steady",
  "pentacles-12": "steady",
  "pentacles-13": "steady",
  "pentacles-14": "steady",
};

/**
 * 극성 점수 — bright +1, steady 0, challenging -1.
 * 역방향은 밝은 에너지의 막힘이므로 bright→0으로 감쇠, challenging은 그림자가 남아 -1 유지.
 */
export function polarityScoreOf(cardId: string, reversed: boolean): -1 | 0 | 1 {
  const polarity = CARD_POLARITY[cardId];
  if (polarity === "bright") return reversed ? 0 : 1;
  if (polarity === "challenging") return -1;
  return 0;
}
