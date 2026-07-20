import { josa } from "@/lib/reading-engine/compose/josa";
import type { TemplateVariant } from "@/lib/reading-engine/compose/sentence-bank";

/**
 * 역방향 카드 프레임 — 역방향을 '불행'이 아니라
 * 에너지의 부족 / 과잉 / 내면화 / 막힘으로 해석한다 (역방향 정책).
 * 이어지는 문장은 카드의 shadowMeaning 완결문.
 */
export const REVERSAL_FRAMES: readonly TemplateVariant[] = [
  {
    id: "rev-01",
    endingGroup: "boinda",
    render: (c) =>
      `${c.positionTitle} 자리에는 ${josa(c.cardNameKo, "이/가")} 역방향으로 나왔습니다. ${josa(c.keyword, "이라는/라는")} 에너지가 아직 충분히 차오르지 않은 모습으로 보입니다.`,
  },
  {
    id: "rev-02",
    endingGroup: "ganeung",
    render: (c) =>
      `${c.positionTitle} 자리의 ${c.cardNameKo}는 거꾸로 놓였습니다. ${josa(c.keyword, "이/가")} 지나치게 커져 오히려 균형을 흔들고 있을 수 있습니다.`,
  },
  {
    id: "rev-03",
    endingGroup: "ilknida",
    render: (c) =>
      `역방향의 ${c.cardNameKo}는 ${josa(c.keyword, "이/가")} 겉으로 드러나지 못하고 안으로 향해 있다는 뜻으로 읽힙니다.`,
  },
  {
    id: "rev-04",
    endingGroup: "swipda",
    render: (c) =>
      `${c.positionTitle}에 역방향으로 놓인 ${c.cardNameKo}입니다. 지금의 ${c.contextNoun}에서 ${josa(c.keyword, "으로/로")} 가는 길목이 잠시 막혀 있기 쉽습니다.`,
  },
  {
    id: "rev-05",
    endingGroup: "boinda",
    render: (c) =>
      `${josa(c.cardNameKo, "이/가")} 뒤집힌 채 ${c.positionTitle} 자리에 왔습니다. ${josa(c.keyword, "을/를")} 밖으로 꺼내기 전에 안에서 정리할 것이 남아 있어 보입니다.`,
  },
  {
    id: "rev-06",
    endingGroup: "malhanda",
    render: (c) =>
      `${c.positionTitle} 자리의 역방향 ${c.cardNameKo}는 ${josa(c.keyword, "이/가")} 제 속도를 내지 못하고 있다고 말합니다.`,
  },
];

/**
 * 역방향 회복 프레임 — 이어지는 문장은 카드의 lightMeaning 완결문.
 * '본래의 에너지를 되찾는 방향'을 가리킨다.
 */
export const RECOVERY_FRAMES: readonly TemplateVariant[] = [
  {
    id: "recover-01",
    endingGroup: "chungbun",
    render: (c) => `${josa(c.cardNameKo, "이/가")} 본래 품고 있는 힘은 이렇습니다.`,
  },
  {
    id: "recover-02",
    endingGroup: "euntte",
    render: () => `막힌 흐름이 풀리면 이 카드는 이런 모습이 됩니다.`,
  },
  {
    id: "recover-03",
    endingGroup: "baraboda",
    render: (c) => `되찾아야 할 본래의 결은 ${c.keyword} 쪽에 있습니다.`,
  },
  {
    id: "recover-04",
    endingGroup: "ganeung",
    render: () => `방향을 바로 세우면 같은 에너지가 이렇게 흐를 수 있습니다.`,
  },
];
