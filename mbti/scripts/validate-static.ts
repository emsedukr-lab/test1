/**
 * 정적 데이터(토픽/스프레드/MBTI/템플릿) 검증 스크립트
 * 사용: npx tsx scripts/validate-static.ts
 */
import { ALL_CARD_IDS } from "../src/data/cards/ids";
import { SPREADS } from "../src/data/spreads";
import { TOPICS } from "../src/data/topics";
import { ACTION_INTROS } from "../src/data/templates/action-intros";
import { COMBINATION_FRAMES } from "../src/data/templates/combination-frames";
import { CLOSINGS } from "../src/data/templates/closings";
import { ESSENCES } from "../src/data/templates/essences";
import {
  BRIEFING_APPROACH,
  FOCUS_CARD_REASONS,
  PITFALLS,
} from "../src/data/templates/mbti-briefing";
import { MBTI_VIEWS } from "../src/data/templates/mbti-views";
import { OPENINGS } from "../src/data/templates/openings";
import { POSITION_FRAMES } from "../src/data/templates/position-frames";
import { RECOVERY_FRAMES, REVERSAL_FRAMES } from "../src/data/templates/reversal-frames";
import { SAFETY_MESSAGES } from "../src/data/templates/safety-messages";
import {
  CAREER_VERDICTS,
  CHOICE_EVEN_VERDICTS,
  CHOICE_LEAN_VERDICTS,
  ONE_CARD_VERDICTS,
  RELATIONSHIP_VERDICTS,
  THREE_CARD_VERDICTS,
} from "../src/data/templates/verdicts";
import { CARD_POLARITY } from "../src/lib/reading-engine/card-polarity";
import { findForbidden, hasDoubleHedge } from "../src/lib/content-rules";

const errors: string[] = [];

// 토픽
const topics = Object.values(TOPICS);
if (topics.length !== 12) errors.push(`토픽 ${topics.length}개 (12개여야 함)`);
for (const topic of topics) {
  if (topic.recommendedQuestions.length < 3)
    errors.push(`${topic.id}: 추천 질문 ${topic.recommendedQuestions.length}개 (최소 3개)`);
  if (topic.contextNouns.length < 2) errors.push(`${topic.id}: contextNouns 부족`);
  for (const spreadId of topic.allowedSpreads) {
    if (!SPREADS[spreadId]) errors.push(`${topic.id}: 존재하지 않는 스프레드 ${spreadId}`);
  }
  if (!topic.allowedSpreads.includes("one-card"))
    errors.push(`${topic.id}: one-card는 모든 분야에서 허용되어야 함`);
}

// 스프레드
const spreads = Object.values(SPREADS);
if (spreads.length !== 5) errors.push(`스프레드 ${spreads.length}개 (5개여야 함)`);
for (const spread of spreads) {
  if (spread.positions.length !== spread.cardCount)
    errors.push(`${spread.id}: positions ${spread.positions.length} ≠ cardCount ${spread.cardCount}`);
  spread.positions.forEach((p, i) => {
    if (p.index !== i) errors.push(`${spread.id}: positions[${i}].index = ${p.index}`);
  });
  if (!spread.positions.some((p) => p.interpretationMode === "light"))
    errors.push(`${spread.id}: light 위치가 하나도 없음`);
}

// 템플릿 스모크 렌더 — undefined 삽입, 조사 오류, 금지 표현 검출
const dummyCtx = {
  cardNameKo: "완드 에이스",
  positionTitle: "현재 상황",
  topicNameKo: "연애",
  keyword: "새로운 시작",
  contextNoun: "마음",
  roleDescription: "지금 상황의 중심 흐름",
};
const dummyOpening = {
  topicNameKo: "연애",
  contextNoun: "마음",
  firstKeyword: "새로운 시작",
  lastKeyword: "균형",
  cardCount: 3,
};
const dummyClosing = { cardNameKo: "완드 에이스", keyword: "새로운 시작", contextNoun: "마음" };
const dummyCombo = {
  topicNameKo: "연애",
  contextNoun: "마음",
  suitNameKo: "컵",
  number: 3,
  count: 2,
  total: 5,
};

function checkRendered(source: string, text: string) {
  if (text.includes("undefined") || text.includes("null"))
    errors.push(`${source}: 렌더 결과에 undefined/null 포함 — "${text}"`);
  for (const bad of findForbidden(text)) errors.push(`${source}: 금지 표현 "${bad}"`);
  if (text.trim() === "") errors.push(`${source}: 빈 렌더 결과`);
}

for (const [mode, pool] of Object.entries(POSITION_FRAMES)) {
  if (pool.length < 5) errors.push(`POSITION_FRAMES.${mode}: variant ${pool.length}개 (최소 5개)`);
  const ids = new Set(pool.map((v) => v.id));
  if (ids.size !== pool.length) errors.push(`POSITION_FRAMES.${mode}: id 중복`);
  for (const v of pool) checkRendered(`POSITION_FRAMES.${mode}.${v.id}`, v.render(dummyCtx));
}
// MBTI 시선 (모든 카드 섹션에 붙음)
const dummyView = {
  type: "INTJ" as const,
  traitNoun: "큰 그림을 읽는 시야",
  overuseNoun: "결론을 서두르는 습관",
  focus: "전략과 장기 방향",
  keyword: "새로운 시작",
  contextNoun: "마음",
  positionTitle: "현재 상황",
};
for (const v of MBTI_VIEWS) checkRendered(`MBTI_VIEWS.${v.id}`, v.render(dummyView));
if (MBTI_VIEWS.length < 15) errors.push(`MBTI_VIEWS: ${MBTI_VIEWS.length}개 (최소 15개)`);
for (const mode of ["light", "caution", "action"] as const) {
  const n = MBTI_VIEWS.filter((v) => v.modeTags?.includes(mode)).length;
  if (n < 5) errors.push(`MBTI_VIEWS(${mode}): ${n}개 (모드별 최소 5개)`);
}

// 유형 브리핑 + 행동 인트로
const dummyApproach = {
  type: "INTJ" as const,
  styleSentence: "결정을 내릴 때 근거와 구조를 먼저 살핍니다.",
  topicNameKo: "연애",
  focus: "전략과 장기 방향",
};
for (const v of BRIEFING_APPROACH) checkRendered(`BRIEFING_APPROACH.${v.id}`, v.render(dummyApproach));
const dummyFcr = {
  positionTitle: "현재 상황",
  cardNameKo: "완드 에이스",
  keyword: "새로운 시작",
  focus: "전략과 장기 방향",
};
for (const v of FOCUS_CARD_REASONS) checkRendered(`FOCUS_CARD_REASONS.${v.id}`, v.render(dummyFcr));
for (const v of PITFALLS)
  checkRendered(`PITFALLS.${v.id}`, v.render({ overuseNoun: "결론을 서두르는 습관", topicNameKo: "연애" }));
for (const v of ACTION_INTROS)
  checkRendered(`ACTION_INTROS.${v.id}`, v.render({ type: "INTJ", actionFraming: "가설처럼 세워 검증하듯" }));

// verdict — 금지 표현 + 이중 헤지 게이트
const dummyVerdict = {
  topicNameKo: "연애",
  contextNoun: "마음",
  keyword: "새로운 시작",
  secondKeyword: "균형",
  cardNameKo: "완드 에이스",
};
const verdictPools = [
  ...Object.values(ONE_CARD_VERDICTS).flat(),
  ...THREE_CARD_VERDICTS,
  ...RELATIONSHIP_VERDICTS,
  ...CAREER_VERDICTS,
  ...CHOICE_EVEN_VERDICTS,
];
for (const v of verdictPools) {
  const text = v.render(dummyVerdict);
  checkRendered(`VERDICTS.${v.id}`, text);
  if (hasDoubleHedge(text)) errors.push(`VERDICTS.${v.id}: 이중 헤지 — "${text}"`);
}
for (const v of CHOICE_LEAN_VERDICTS) {
  const text = v.render({ ...dummyVerdict, leanLabel: "A" });
  checkRendered(`VERDICTS.${v.id}`, text);
  if (hasDoubleHedge(text)) errors.push(`VERDICTS.${v.id}: 이중 헤지 — "${text}"`);
}

// essence — 이중 헤지 게이트
for (const [group, pool] of Object.entries(ESSENCES)) {
  for (const v of pool) {
    const text = v.render("새로운 시작");
    checkRendered(`ESSENCES.${group}.${v.id}`, text);
    if (hasDoubleHedge(text)) errors.push(`ESSENCES.${v.id}: 이중 헤지 — "${text}"`);
  }
}

// 카드 극성 맵 — 78장 전체 커버리지
const polarityKeys = new Set(Object.keys(CARD_POLARITY));
for (const id of ALL_CARD_IDS) {
  if (!polarityKeys.has(id)) errors.push(`CARD_POLARITY: ${id} 누락`);
}
if (polarityKeys.size !== ALL_CARD_IDS.length)
  errors.push(`CARD_POLARITY: ${polarityKeys.size}개 (78개여야 함)`);

for (const v of REVERSAL_FRAMES) checkRendered(`REVERSAL_FRAMES.${v.id}`, v.render(dummyCtx));
if (REVERSAL_FRAMES.length < 4) errors.push(`REVERSAL_FRAMES: ${REVERSAL_FRAMES.length}개 (최소 4개)`);
for (const v of RECOVERY_FRAMES) checkRendered(`RECOVERY_FRAMES.${v.id}`, v.render(dummyCtx));
if (RECOVERY_FRAMES.length < 3) errors.push(`RECOVERY_FRAMES: ${RECOVERY_FRAMES.length}개 (최소 3개)`);
for (const v of OPENINGS) checkRendered(`OPENINGS.${v.id}`, v.render(dummyOpening));
for (const v of CLOSINGS) checkRendered(`CLOSINGS.${v.id}`, v.render(dummyClosing));
for (const [kind, pool] of Object.entries(COMBINATION_FRAMES)) {
  if (pool.length < 2) errors.push(`COMBINATION_FRAMES.${kind}: ${pool.length}개 (최소 2개)`);
  for (const [i, render] of pool.entries()) checkRendered(`COMBINATION_FRAMES.${kind}[${i}]`, render(dummyCombo));
}
for (const [category, message] of Object.entries(SAFETY_MESSAGES)) {
  if (message.trim() === "") errors.push(`SAFETY_MESSAGES.${category}: 빈 문자열`);
}

// MBTI 프로필 (check-mbti.ts와 동일 검증을 재사용하기 위해 임포트만 확인)
async function main() {
  try {
    const mod = await import("../src/data/mbti/profiles");
    const count = Object.keys(mod.MBTI_PROFILES).length;
    if (count !== 16) errors.push(`MBTI 프로필 ${count}개 (16개여야 함)`);
  } catch {
    errors.push("MBTI 프로필 파일을 불러올 수 없음 (src/data/mbti/profiles.ts)");
  }

  if (errors.length > 0) {
    console.error(`정적 데이터 오류 ${errors.length}건:`);
    for (const e of errors) console.error("  " + e);
    process.exit(1);
  }
  console.log("정적 데이터 검증 통과 (토픽 12, 스프레드 5, 템플릿 렌더 OK)");
}

main();
