import type { ToneRules } from "@/types/mbti";
import type { Rng } from "../rng";
import { UsedSentenceRegistry } from "./registry";

/** 템플릿에 삽입되는 것은 명사(구)뿐 — 완결문은 데이터에서 온다 */
export interface TemplateContext {
  cardNameKo: string;
  positionTitle: string;
  topicNameKo: string;
  /** 카드 대표 키워드 (rng 선택) */
  keyword: string;
  /** topic.contextNouns에서 rng 선택 */
  contextNoun: string;
  roleDescription: string;
}

export type ToneTag = "direct" | "gentle" | "logic" | "value" | "bigPicture" | "stepByStep" | "push" | "hold";

export interface TemplateVariant<C = TemplateContext> {
  id: string;
  /** 종결어미 그룹 — 직전 문장과 같은 그룹 회피용 */
  endingGroup: string;
  toneTags?: readonly ToneTag[];
  render: (ctx: C) => string;
}

function toneTagsOf(tone: ToneRules): Set<ToneTag> {
  return new Set<ToneTag>([tone.directness, tone.framing, tone.scope, tone.pace]);
}

/**
 * variant 선택 규칙 (결정적):
 * 1. 이 리딩에서 아직 안 쓴 variant 우선 (전부 썼으면 해제)
 * 2. toneFilter가 있으면 toneTags 교집합이 있는 variant 우선 (없으면 전체)
 * 3. 직전 endingGroup과 같은 그룹 제외 (전부 제외되면 해제)
 * 4. rng 순서로 순회하며 렌더 결과가 registry 중복이 아닌 첫 variant 채택
 */
export function pickVariant<C>(
  pool: readonly TemplateVariant<C>[],
  ctx: C,
  rng: Rng,
  registry: UsedSentenceRegistry,
  toneFilter?: ToneRules | null,
): string {
  if (pool.length === 0) throw new Error("빈 템플릿 풀");

  let candidates = [...pool];

  const unused = candidates.filter((v) => !registry.isVariantUsed(v.id));
  if (unused.length > 0) candidates = unused;

  if (toneFilter) {
    const tags = toneTagsOf(toneFilter);
    const matched = candidates.filter((v) => v.toneTags?.some((t) => tags.has(t)));
    if (matched.length > 0) candidates = matched;
  }

  const notSameEnding = candidates.filter((v) => v.endingGroup !== registry.lastEndingGroup);
  if (notSameEnding.length > 0) candidates = notSameEnding;

  const ordered = rng.pickN(candidates, candidates.length);
  let chosen = ordered[0];
  let rendered = chosen.render(ctx);
  for (const variant of ordered) {
    const text = variant.render(ctx);
    if (!registry.isDuplicate(text)) {
      chosen = variant;
      rendered = text;
      break;
    }
  }

  registry.add(rendered);
  registry.noteEndingGroup(chosen.endingGroup);
  registry.noteVariantUsed(chosen.id);
  return rendered;
}
