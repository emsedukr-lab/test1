/**
 * MBTI 프로필 데이터 검증
 * 사용: npx tsx scripts/check-mbti.ts
 */
import { findForbidden } from "../src/lib/content-rules";
import type { MbtiProfile, MbtiType } from "../src/types/mbti";

const EXPECTED: MbtiType[] = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

async function main() {
  const mod = await import("../src/data/mbti/profiles");
  const profiles = mod.MBTI_PROFILES as Record<MbtiType, MbtiProfile>;
  const errors: string[] = [];

  for (const type of EXPECTED) {
    const p = profiles[type];
    if (!p) {
      errors.push(`${type}: 누락`);
      continue;
    }
    if (p.type !== type) errors.push(`${type}: type 필드 불일치 (${p.type})`);
    const minCounts: [string, readonly string[], number][] = [
      ["stressPatterns", p.stressPatterns, 2],
      ["strengths", p.strengths, 3],
      ["overusePatterns", p.overusePatterns, 2],
      ["actionPreferences", p.actionPreferences, 2],
      ["balancingPerspectives", p.balancingPerspectives, 2],
    ];
    for (const [field, arr, min] of minCounts) {
      if (!Array.isArray(arr) || arr.length < min)
        errors.push(`${type}.${field}: ${arr?.length ?? 0}개 (최소 ${min}개)`);
    }
    const texts = [
      p.title, p.summary, p.perceptionStyle, p.decisionStyle, p.relationshipStyle,
      p.effectiveAdviceStyle, p.focus, p.actionFraming,
      ...p.stressPatterns, ...p.strengths, ...p.overusePatterns,
      ...p.actionPreferences, ...p.balancingPerspectives,
    ];
    for (const t of texts) {
      if (typeof t !== "string" || t.trim() === "") {
        errors.push(`${type}: 빈 문자열 필드 존재`);
        continue;
      }
      for (const bad of findForbidden(t)) errors.push(`${type}: 금지 표현 "${bad}" ("${t.slice(0, 30)}…")`);
    }
    const tone = p.toneRules;
    if (!["direct", "gentle"].includes(tone?.directness)) errors.push(`${type}.toneRules.directness 오류`);
    if (!["logic", "value"].includes(tone?.framing)) errors.push(`${type}.toneRules.framing 오류`);
    if (!["bigPicture", "stepByStep"].includes(tone?.scope)) errors.push(`${type}.toneRules.scope 오류`);
    if (!["push", "hold"].includes(tone?.pace)) errors.push(`${type}.toneRules.pace 오류`);
  }

  const extra = Object.keys(profiles).filter((k) => !EXPECTED.includes(k as MbtiType));
  if (extra.length > 0) errors.push(`알 수 없는 키: ${extra.join(", ")}`);

  console.log(`MBTI 프로필: ${Object.keys(profiles).length}개`);
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
