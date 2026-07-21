import { ESSENCES } from "@/data/templates/essences";
import { POSITION_FRAMES } from "@/data/templates/position-frames";
import { RECOVERY_FRAMES, REVERSAL_FRAMES } from "@/data/templates/reversal-frames";
import type { ToneRules } from "@/types/mbti";
import type { SpreadPosition, Topic } from "@/types/reading";
import type { TarotCard } from "@/types/tarot";
import { pickVariant, type TemplateContext } from "./compose/sentence-bank";
import type { UsedSentenceRegistry } from "./compose/registry";
import type { Rng } from "./rng";
import type { SelectedMeaning } from "./select-card-meaning";

export interface PositionedMeaning {
  /** 위치 프레임 1문장 */
  intro: string;
  /** 의미 본문 — 정방향 최대 2문장, 역방향 최대 3문장(그림자+회복) */
  main: string;
  /** 핵심 한 줄 명사구 */
  essence: string;
  /** 직전 카드와 essence variant 중복 회피용 */
  essenceId: string;
}

/** 구두점 기준 첫 문장만 (결정적) */
function firstSentence(text: string): string {
  return text.split(/(?<=[.?!])\s+/)[0];
}

function sentenceCount(text: string): number {
  return text.split(/(?<=[.?!])\s+/).filter((s) => s.trim() !== "").length;
}

export function applyPositionContext(args: {
  card: TarotCard;
  meaning: SelectedMeaning;
  position: SpreadPosition;
  topic: Topic;
  reversed: boolean;
  rng: Rng;
  registry: UsedSentenceRegistry;
  toneRules?: ToneRules | null;
  /** 직전 카드의 essence variant id (반복 회피) */
  prevEssenceId?: string | null;
}): PositionedMeaning {
  const { card, meaning, position, topic, reversed, rng, registry, toneRules, prevEssenceId } =
    args;

  const ctx: TemplateContext = {
    cardNameKo: card.nameKo,
    positionTitle: position.titleKo,
    topicNameKo: topic.nameKo,
    keyword: meaning.keyword,
    contextNoun: rng.pick(topic.contextNouns),
    roleDescription: position.roleDescription,
  };

  // essence — registry 비등록, 직전 카드와 같은 variant 회피
  const essencePool = reversed ? ESSENCES.reversed : ESSENCES[position.interpretationMode];
  let essenceIdx = rng.int(essencePool.length);
  if (essencePool[essenceIdx].id === prevEssenceId) {
    essenceIdx = (essenceIdx + 1) % essencePool.length;
  }
  const essenceVariant = essencePool[essenceIdx];
  const essence = essenceVariant.render(meaning.keyword);

  if (reversed) {
    // 역방향: 프레임(부족/과잉/내면화/막힘) → 그림자 의미 → 회복 방향(본래의 빛)
    const frame = pickVariant(REVERSAL_FRAMES, ctx, rng, registry, toneRules);
    const intro = firstSentence(frame);
    let main = meaning.shadow;
    if (sentenceCount(meaning.shadow) <= 1) {
      const recovery = firstSentence(pickVariant(RECOVERY_FRAMES, ctx, rng, registry, toneRules));
      main = `${meaning.shadow} ${recovery} ${firstSentence(meaning.light)}`;
    }
    return { intro, main, essence, essenceId: essenceVariant.id };
  }

  const frame = pickVariant(
    POSITION_FRAMES[position.interpretationMode],
    ctx,
    rng,
    registry,
    toneRules,
  );

  return {
    intro: firstSentence(frame),
    main: meaning.primary,
    essence,
    essenceId: essenceVariant.id,
  };
}
