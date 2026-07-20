/**
 * 카드 데이터 파일 단위 검증 (배치 작성 중 자가 점검용)
 * 사용: npx tsx scripts/check-file.ts <파일경로> <export이름> <기대카드수>
 * 예: npx tsx scripts/check-file.ts src/data/cards/wands.ts WANDS_CARDS 14
 */
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  ENDING_RULES,
  findForbidden,
  MEANING_LENGTH,
  REQUIRED_MIN,
  SUMMARY_LENGTH,
} from "../src/lib/content-rules";
import type { TarotCard } from "../src/types/tarot";

const MEANING_FIELDS = [
  "lightMeaning",
  "shadowMeaning",
  "relationshipMeaning",
  "careerMeaning",
  "moneyMeaning",
  "selfGrowthMeaning",
  "decisionMeaning",
] as const;

async function main() {
  const [file, exportName, expectedCountRaw] = process.argv.slice(2);
  if (!file || !exportName) {
    console.error("사용법: npx tsx scripts/check-file.ts <파일> <export이름> [기대수]");
    process.exit(2);
  }
  const mod = await import(pathToFileURL(path.resolve(file)).href);
  const cards = mod[exportName] as readonly TarotCard[] | undefined;
  if (!Array.isArray(cards)) {
    console.error(`export "${exportName}"이 배열이 아닙니다`);
    process.exit(1);
  }
  const errors: string[] = [];
  const err = (id: string, field: string, msg: string) => errors.push(`${id}.${field}: ${msg}`);

  if (expectedCountRaw && cards.length !== Number(expectedCountRaw))
    errors.push(`카드 수 ${cards.length} (기대 ${expectedCountRaw})`);

  const ids = new Set<string>();
  for (const card of cards) {
    if (ids.has(card.id)) err(card.id, "id", "중복");
    ids.add(card.id);

    for (const [field, min] of Object.entries(REQUIRED_MIN)) {
      const arr = card[field as keyof typeof REQUIRED_MIN] as readonly string[];
      if (!Array.isArray(arr) || arr.length < min)
        err(card.id, field, `${arr?.length ?? 0}개 (최소 ${min}개)`);
    }

    const texts: [string, string][] = [
      ["summary", card.summary],
      ...MEANING_FIELDS.map((f): [string, string] => [f, card[f]]),
      ...card.keywords.map((k: string, i: number): [string, string] => [`keywords[${i}]`, k]),
      ...card.strengths.map((s: string, i: number): [string, string] => [`strengths[${i}]`, s]),
      ...card.cautions.map((c: string, i: number): [string, string] => [`cautions[${i}]`, c]),
      ...card.reflectionQuestions.map((q: string, i: number): [string, string] => [
        `reflectionQuestions[${i}]`,
        q,
      ]),
      ...card.suggestedActions.map((a: string, i: number): [string, string] => [
        `suggestedActions[${i}]`,
        a,
      ]),
      ["imageAlt", card.imageAlt],
    ];
    for (const [field, text] of texts) {
      if (typeof text !== "string" || text.trim() === "") {
        err(card.id, field, "빈 문자열");
        continue;
      }
      for (const bad of findForbidden(text)) err(card.id, field, `금지 표현 "${bad}"`);
    }

    for (const [i, q] of card.reflectionQuestions.entries())
      if (!ENDING_RULES.reflectionQuestions.test(q.trim()))
        err(card.id, `reflectionQuestions[${i}]`, `의문형 종결 아님: "${q}"`);
    for (const [i, a] of card.suggestedActions.entries())
      if (!ENDING_RULES.suggestedActions.test(a.trim()))
        err(card.id, `suggestedActions[${i}]`, `'~해 보세요' 종결 아님: "${a}"`);

    if (card.summary.length < SUMMARY_LENGTH.min || card.summary.length > SUMMARY_LENGTH.max)
      err(card.id, "summary", `${card.summary.length}자 (${SUMMARY_LENGTH.min}~${SUMMARY_LENGTH.max}자)`);
    for (const field of MEANING_FIELDS) {
      const len = card[field].length;
      if (len < MEANING_LENGTH.min || len > MEANING_LENGTH.max)
        err(card.id, field, `${len}자 (${MEANING_LENGTH.min}~${MEANING_LENGTH.max}자)`);
    }
    if (card.image !== `/cards/${card.id}.jpg`)
      err(card.id, "image", `'/cards/${card.id}.jpg'이어야 함`);
  }

  console.log(`${exportName}: ${cards.length}장`);
  if (errors.length > 0) {
    console.error(`오류 ${errors.length}건:`);
    for (const e of errors) console.error("  " + e);
    process.exit(1);
  }
  console.log("통과");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
