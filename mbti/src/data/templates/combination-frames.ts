import type { CombinationKind } from "@/types/reading";
import { josa } from "@/lib/reading-engine/compose/josa";

/** 조합 분석 문장 컨텍스트 */
export interface CombinationContext {
  topicNameKo: string;
  contextNoun: string;
  /** suit-dominant / topic-suit-missing에서 사용 */
  suitNameKo?: string;
  /** repeated-number에서 사용 */
  number?: number;
  count?: number;
  total?: number;
}

type CombinationRenderer = (ctx: CombinationContext) => string;

/**
 * kind별 문장 풀 — pickVariant 대신 rng.pick으로 선택한다 (조합 분석은 리딩당 최대 2문장).
 */
export const COMBINATION_FRAMES: Record<CombinationKind, readonly CombinationRenderer[]> = {
  "major-dominant": [
    (c) =>
      `이번 리딩에는 메이저 카드의 비중이 높습니다. 지금의 ${josa(c.contextNoun, "이/가")} 일상의 사소한 문제가 아니라 삶의 큰 흐름과 닿아 있을 가능성이 있습니다.`,
    (c) =>
      `메이저 카드가 여러 장 모였습니다. ${c.topicNameKo}에 대한 이번 질문이 스스로에게 꽤 중요한 국면이라는 신호로 읽힙니다.`,
  ],
  "major-absent": [
    (c) =>
      `이번 배열에는 메이저 카드가 없습니다. 지금의 ${josa(c.contextNoun, "은/는")} 거창한 운명보다 일상의 선택과 습관에서 풀릴 수 있는 문제로 보입니다.`,
    () =>
      `메이저 카드 없이 마이너 카드로만 채워졌습니다. 큰 전환보다 매일의 작은 조정이 열쇠가 되는 흐름입니다.`,
  ],
  "suit-dominant": [
    (c) =>
      `${c.suitNameKo} 슈트가 배열의 중심을 차지했습니다. 지금의 ${josa(c.contextNoun, "이/가")} 이 슈트의 영역에 한쪽으로 쏠려 있다는 뜻일 수 있습니다.`,
    (c) =>
      `${josa(c.suitNameKo ?? "", "이/가")} 유난히 많이 나왔습니다. 한 가지 에너지에 집중된 만큼, 다른 영역의 감각을 의식적으로 챙겨볼 만합니다.`,
  ],
  "topic-suit-missing": [
    (c) =>
      `${c.topicNameKo} 질문인데 ${josa(c.suitNameKo ?? "", "이/가")} 한 장도 나오지 않았습니다. 문제의 열쇠가 예상 밖의 영역에 있을 가능성을 열어둘 만합니다.`,
    (c) =>
      `${c.topicNameKo}에서 흔히 기대되는 ${c.suitNameKo} 에너지가 배열에 없습니다. 지금 필요한 것이 감정이나 열의보다 다른 종류의 힘일 수 있습니다.`,
  ],
  "repeated-number": [
    (c) =>
      `같은 숫자 ${c.number} 카드가 ${c.count}장 반복됐습니다. 이 숫자의 국면이 삶의 여러 영역에서 동시에 진행되고 있다는 신호로 읽힙니다.`,
    (c) =>
      `숫자 ${c.number} 카드가 여러 번 등장했습니다. 비슷한 과제가 형태만 바꿔 되풀이되고 있는 것은 아닌지 돌아볼 만합니다.`,
  ],
  "court-heavy": [
    (c) =>
      `궁정 카드가 ${c.count}장 나왔습니다. 지금의 ${josa(c.contextNoun, "은/는")} 상황 자체보다 사람이 변수인 국면일 수 있습니다.`,
    () =>
      `인물 카드가 여러 장 모였습니다. 주변 사람들의 입장과 역할을 정리해보는 것이 실마리가 될 수 있습니다.`,
  ],
  "ace-cluster": [
    () =>
      `에이스가 두 장 이상 나왔습니다. 여러 영역에서 동시에 새로운 시작의 기운이 움트고 있는 흐름입니다.`,
    (c) =>
      `시작을 뜻하는 에이스가 겹쳤습니다. 지금의 ${c.contextNoun}에 새 페이지가 열리는 시점일 가능성이 있습니다.`,
  ],
  "expansion-flow": [
    () =>
      `카드의 숫자가 커지는 방향으로 흐릅니다. 상황이 점차 무르익어 확장되는 흐름으로 읽힙니다.`,
    (c) =>
      `배열의 흐름이 확장 쪽을 향하고 있습니다. ${josa(c.contextNoun, "이/가")} 커지는 만큼 감당할 그릇도 함께 준비해볼 만합니다.`,
  ],
  "convergence-flow": [
    () =>
      `카드의 숫자가 작아지는 방향으로 흐릅니다. 벌려놓은 것을 정리하고 본질로 수렴하는 시기일 수 있습니다.`,
    (c) =>
      `배열의 흐름이 수렴 쪽을 향하고 있습니다. 지금은 ${josa(c.contextNoun, "을/를")} 더 벌리기보다 추리는 편이 자연스러워 보입니다.`,
  ],
};
