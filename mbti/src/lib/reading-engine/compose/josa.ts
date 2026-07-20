/**
 * 한국어 조사 자동 처리 — 받침 유무에 따라 알맞은 조사를 붙인다.
 */

export type JosaPair = "이/가" | "은/는" | "을/를" | "과/와" | "으로/로" | "이라는/라는";

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;

/** 숫자로 끝나는 단어의 한국어 발음 기준 받침 여부 — 0(영)O 1(일)O 2(이)X 3(삼)O … */
const DIGIT_BATCHIM: Record<string, boolean> = {
  "0": true,
  "1": true,
  "2": false,
  "3": true,
  "4": false,
  "5": false,
  "6": true,
  "7": true,
  "8": true,
  "9": false,
};

/** 마지막 글자의 받침(종성) 존재 여부. 숫자는 발음 기준, 그 외 비한글은 받침 없음 폴백 */
function hasBatchim(word: string): boolean {
  if (word.length === 0) return false;
  const last = word[word.length - 1];
  if (last in DIGIT_BATCHIM) return DIGIT_BATCHIM[last];
  const code = word.charCodeAt(word.length - 1);
  if (code < HANGUL_START || code > HANGUL_END) return false;
  return (code - HANGUL_START) % 28 !== 0;
}

/** 종성이 ㄹ인지 (으로/로 판단용). 1(일)·7(칠)·8(팔)은 ㄹ 받침 */
function hasRieulBatchim(word: string): boolean {
  if (word.length === 0) return false;
  const last = word[word.length - 1];
  if (last in DIGIT_BATCHIM) return last === "1" || last === "7" || last === "8";
  const code = word.charCodeAt(word.length - 1);
  if (code < HANGUL_START || code > HANGUL_END) return false;
  return (code - HANGUL_START) % 28 === 8;
}

/** word에 알맞은 조사를 붙여 반환 — 예: josa('완드 에이스', '은/는') → '완드 에이스는' */
export function josa(word: string, pair: JosaPair): string {
  const batchim = hasBatchim(word);
  switch (pair) {
    case "이/가":
      return word + (batchim ? "이" : "가");
    case "은/는":
      return word + (batchim ? "은" : "는");
    case "을/를":
      return word + (batchim ? "을" : "를");
    case "과/와":
      return word + (batchim ? "과" : "와");
    case "으로/로":
      return word + (batchim && !hasRieulBatchim(word) ? "으로" : "로");
    case "이라는/라는":
      return word + (batchim ? "이라는" : "라는");
  }
}
