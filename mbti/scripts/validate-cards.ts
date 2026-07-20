/**
 * 78장 카드 데이터 검증 스크립트
 * 사용: npm run validate:cards [-- --allow-partial]
 * --allow-partial: 카드 수 검사만 스킵 (배치 작성 중간 검증용)
 */
import { ALL_CARDS } from "../src/data/cards";
import {
  ENDING_RULES,
  findForbidden,
  MEANING_LENGTH,
  REQUIRED_MIN,
  SUMMARY_LENGTH,
} from "../src/lib/content-rules";
import { MINOR_RANK_NUMBER, SUITS } from "../src/types/tarot";

const allowPartial = process.argv.includes("--allow-partial");
const errors: string[] = [];

function err(cardId: string, field: string, message: string) {
  errors.push(`[cards] ${cardId}.${field}: ${message}`);
}

// 1. 카운트
if (!allowPartial) {
  if (ALL_CARDS.length !== 78) errors.push(`[cards] 총 ${ALL_CARDS.length}장 (78장이어야 함)`);
  const majors = ALL_CARDS.filter((c) => c.arcana === "major");
  if (majors.length !== 22) errors.push(`[cards] 메이저 ${majors.length}장 (22장이어야 함)`);
  for (const suit of SUITS) {
    const n = ALL_CARDS.filter((c) => c.arcana === "minor" && c.suit === suit).length;
    if (n !== 14) errors.push(`[cards] ${suit} ${n}장 (14장이어야 함)`);
  }
  const majorNumbers = new Set(majors.map((c) => c.number));
  for (let i = 0; i <= 21; i++) {
    if (!majorNumbers.has(i)) errors.push(`[cards] 메이저 번호 ${i} 누락`);
  }
}

// 2. id/slug 고유성
const ids = new Set<string>();
const slugs = new Set<string>();
for (const card of ALL_CARDS) {
  if (ids.has(card.id)) err(card.id, "id", "중복 id");
  if (slugs.has(card.slug)) err(card.id, "slug", `중복 slug "${card.slug}"`);
  ids.add(card.id);
  slugs.add(card.slug);
}

const MEANING_FIELDS = [
  "lightMeaning",
  "shadowMeaning",
  "relationshipMeaning",
  "careerMeaning",
  "moneyMeaning",
  "selfGrowthMeaning",
  "decisionMeaning",
] as const;

const STRING_FIELDS = [
  "id",
  "slug",
  "nameKo",
  "nameEn",
  "summary",
  ...MEANING_FIELDS,
  "image",
  "imageAlt",
] as const;

const ARRAY_FIELDS = [
  "keywords",
  "strengths",
  "cautions",
  "reflectionQuestions",
  "suggestedActions",
] as const;

for (const card of ALL_CARDS) {
  // 3. 빈 문자열 금지
  for (const field of STRING_FIELDS) {
    const value = card[field];
    if (typeof value !== "string" || value.trim() === "") err(card.id, field, "빈 문자열");
  }
  for (const field of ARRAY_FIELDS) {
    for (const [i, item] of card[field].entries()) {
      if (typeof item !== "string" || item.trim() === "")
        err(card.id, `${field}[${i}]`, "빈 문자열");
    }
  }

  // 4. 최소 개수
  for (const [field, min] of Object.entries(REQUIRED_MIN)) {
    const arr = card[field as keyof typeof REQUIRED_MIN];
    if (arr.length < min) err(card.id, field, `${arr.length}개 (최소 ${min}개)`);
  }

  // 5. 금지 표현
  const allTexts: [string, string][] = [
    ["summary", card.summary],
    ...MEANING_FIELDS.map((f): [string, string] => [f, card[f]]),
    ...ARRAY_FIELDS.flatMap((f) =>
      card[f].map((item, i): [string, string] => [`${f}[${i}]`, item]),
    ),
  ];
  for (const [field, text] of allTexts) {
    for (const bad of findForbidden(text)) {
      err(card.id, field, `금지 표현 "${bad}"`);
    }
  }

  // 6. 어미 규칙
  for (const [i, q] of card.reflectionQuestions.entries()) {
    if (!ENDING_RULES.reflectionQuestions.test(q.trim()))
      err(card.id, `reflectionQuestions[${i}]`, `의문형 종결 아님: "${q}"`);
  }
  for (const [i, a] of card.suggestedActions.entries()) {
    if (!ENDING_RULES.suggestedActions.test(a.trim()))
      err(card.id, `suggestedActions[${i}]`, `'~해 보세요' 종결 아님: "${a}"`);
  }

  // 7. 길이
  if (card.summary.length < SUMMARY_LENGTH.min || card.summary.length > SUMMARY_LENGTH.max)
    err(card.id, "summary", `${card.summary.length}자 (${SUMMARY_LENGTH.min}~${SUMMARY_LENGTH.max}자)`);
  for (const field of MEANING_FIELDS) {
    const len = card[field].length;
    if (len < MEANING_LENGTH.min || len > MEANING_LENGTH.max)
      err(card.id, field, `${len}자 (${MEANING_LENGTH.min}~${MEANING_LENGTH.max}자)`);
  }

  // 8. 구조 일치
  if (card.arcana === "major") {
    if (card.number < 0 || card.number > 21) err(card.id, "number", `범위 밖: ${card.number}`);
    if (!card.id.startsWith("major-")) err(card.id, "id", "major- 접두사 아님");
  } else {
    const expected = MINOR_RANK_NUMBER[card.rank];
    if (card.number !== expected)
      err(card.id, "number", `rank "${card.rank}"는 number ${expected}이어야 함 (현재 ${card.number})`);
    if (!card.id.startsWith(`${card.suit}-`)) err(card.id, "id", `${card.suit}- 접두사 아님`);
  }
  if (card.image !== `/cards/${card.id}.jpg`)
    err(card.id, "image", `'/cards/${card.id}.jpg'이어야 함 (현재 "${card.image}")`);
}

// 리포트
const majorCount = ALL_CARDS.filter((c) => c.arcana === "major").length;
console.log(`카드 수: 총 ${ALL_CARDS.length} | 메이저 ${majorCount}`);
for (const suit of SUITS) {
  const n = ALL_CARDS.filter((c) => c.arcana === "minor" && c.suit === suit).length;
  console.log(`  ${suit}: ${n}`);
}

if (errors.length > 0) {
  console.error(`\n오류 ${errors.length}건:`);
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}
console.log("\n카드 데이터 검증 통과");
