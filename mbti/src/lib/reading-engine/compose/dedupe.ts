/**
 * 문장 중복 제거 — 완전 일치 + 어절(단어) 자카드 유사도 기반.
 * 순서를 보존하므로 결정적이다.
 */

export function normalizeSentence(s: string): string {
  return s
    .normalize("NFC")
    .replace(/[.,!?~·…'"'"()\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function words(s: string): Set<string> {
  return new Set(normalizeSentence(s).split(" ").filter(Boolean));
}

/** 어절 집합 자카드 유사도 — 한 단어만 바뀐 문장을 잡아낸다 */
export function sentenceSimilarity(a: string, b: string): number {
  const wa = words(a);
  const wb = words(b);
  if (wa.size === 0 || wb.size === 0) return 0;
  let inter = 0;
  for (const w of wa) if (wb.has(w)) inter++;
  return inter / (wa.size + wb.size - inter);
}

/** 앞선 항목과 유사한 뒤 항목을 제거 (순서 보존) */
export function dedupeSentences(items: readonly string[], threshold = 0.6): string[] {
  const kept: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    const norm = normalizeSentence(item);
    if (seen.has(norm)) continue;
    if (kept.some((k) => sentenceSimilarity(k, item) >= threshold)) continue;
    seen.add(norm);
    kept.push(item);
  }
  return kept;
}
