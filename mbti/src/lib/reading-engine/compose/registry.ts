import { normalizeSentence, sentenceSimilarity } from "./dedupe";

/**
 * 리딩 전체에서 같은/유사 문장의 재등장을 막는 레지스트리.
 * 종결어미 그룹의 연속 반복과 템플릿 variant 재사용도 추적한다.
 */
export class UsedSentenceRegistry {
  private readonly used: string[] = [];
  private readonly usedNorm = new Set<string>();
  private readonly usedVariantIds = new Set<string>();
  lastEndingGroup: string | null = null;

  add(sentence: string): void {
    this.used.push(sentence);
    this.usedNorm.add(normalizeSentence(sentence));
  }

  isDuplicate(sentence: string, threshold = 0.75): boolean {
    if (this.usedNorm.has(normalizeSentence(sentence))) return true;
    return this.used.some((u) => sentenceSimilarity(u, sentence) >= threshold);
  }

  noteEndingGroup(group: string): void {
    this.lastEndingGroup = group;
  }

  noteVariantUsed(id: string): void {
    this.usedVariantIds.add(id);
  }

  isVariantUsed(id: string): boolean {
    return this.usedVariantIds.has(id);
  }
}
