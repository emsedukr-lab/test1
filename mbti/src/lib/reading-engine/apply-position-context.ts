import { POSITION_FRAMES } from "@/data/templates/position-frames";
import { RECOVERY_FRAMES, REVERSAL_FRAMES } from "@/data/templates/reversal-frames";
import type { ToneRules } from "@/types/mbti";
import type { SpreadPosition, Topic } from "@/types/reading";
import type { TarotCard } from "@/types/tarot";
import { josa } from "./compose/josa";
import { pickVariant, type TemplateContext } from "./compose/sentence-bank";
import type { UsedSentenceRegistry } from "./compose/registry";
import type { Rng } from "./rng";
import type { SelectedMeaning } from "./select-card-meaning";

export interface PositionedMeaning {
  /** 위치 프레임 문장 (variant 풀에서 시드 선택) */
  frame: string;
  /** primary 의미 완결문 */
  body: string;
  /** mode별 보강 문장 */
  modifier: string;
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
}): PositionedMeaning {
  const { card, meaning, position, topic, reversed, rng, registry, toneRules } = args;

  const ctx: TemplateContext = {
    cardNameKo: card.nameKo,
    positionTitle: position.titleKo,
    topicNameKo: topic.nameKo,
    keyword: meaning.keyword,
    contextNoun: rng.pick(topic.contextNouns),
    roleDescription: position.roleDescription,
  };

  // 역방향: 에너지의 부족/과잉/내면화/막힘 프레임 + 그림자 의미,
  // 이어서 본래 에너지(빛의 의미)를 회복 관점으로 제시한다.
  if (reversed) {
    const frame = pickVariant(REVERSAL_FRAMES, ctx, rng, registry, toneRules);
    const recovery = pickVariant(RECOVERY_FRAMES, ctx, rng, registry, toneRules);
    return {
      frame,
      body: meaning.shadow,
      modifier: `${recovery} ${meaning.light}`,
    };
  }

  const frame = pickVariant(POSITION_FRAMES[position.interpretationMode], ctx, rng, registry, toneRules);

  let modifier: string;
  switch (position.interpretationMode) {
    case "light": {
      const strength = rng.pick(card.strengths);
      modifier = `이 자리에서 기댈 수 있는 것은 ${josa(strength, "이/가")} 아닐까요. 그 힘을 의식적으로 꺼내 쓸수록 흐름이 부드러워질 수 있습니다.`;
      break;
    }
    case "caution": {
      // 그림자 의미는 데이터의 완결문을 그대로 쓴다
      modifier = meaning.shadow;
      break;
    }
    case "action": {
      const action = rng.pick(card.suggestedActions);
      modifier = `우선 이렇게 시도해볼 수 있습니다. ${action}`;
      registry.add(action);
      break;
    }
  }

  return { frame, body: meaning.primary, modifier };
}
