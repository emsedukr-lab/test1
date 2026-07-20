/**
 * 정적 데이터(토픽/스프레드/MBTI/템플릿) 검증 스크립트
 * 사용: npx tsx scripts/validate-static.ts
 */
import { SPREADS } from "../src/data/spreads";
import { TOPICS } from "../src/data/topics";
import { COMBINATION_FRAMES } from "../src/data/templates/combination-frames";
import { CLOSINGS } from "../src/data/templates/closings";
import { MBTI_BRIDGES } from "../src/data/templates/mbti-bridges";
import { OPENINGS } from "../src/data/templates/openings";
import { POSITION_FRAMES } from "../src/data/templates/position-frames";
import { SAFETY_MESSAGES } from "../src/data/templates/safety-messages";
import { findForbidden } from "../src/lib/content-rules";

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
const dummyBridge = {
  type: "INTJ" as const,
  traitNoun: "큰 그림을 읽는 시야",
  overuseNoun: "결론을 서두르는 습관",
  keyword: "새로운 시작",
  contextNoun: "마음",
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
for (const v of MBTI_BRIDGES) checkRendered(`MBTI_BRIDGES.${v.id}`, v.render(dummyBridge));
if (MBTI_BRIDGES.length < 5) errors.push(`MBTI_BRIDGES: variant ${MBTI_BRIDGES.length}개 (최소 5개)`);
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
