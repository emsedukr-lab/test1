import type { MbtiProfile, MbtiType } from "@/types/mbti";

/**
 * MBTI 16개 유형 프로필 데이터.
 *
 * 작성 원칙:
 * - MBTI는 사람을 단정하는 도구가 아니므로 '이런 성향이 강하다면' 프레임을 유지한다.
 * - strengths / overusePatterns 는 명사구 — 문장 중간에 삽입된다.
 *   예: "평소 {strengths}을 지닌 INTJ 성향이라면 …"
 * - overusePatterns 는 비난이 아니라 강점의 과잉으로 서술한다.
 * - balancingPerspectives 는 완결문(합니다체).
 * - toneRules 유도: directness = T·E → direct, 그 외 gentle / framing = T → logic, F → value
 *   / scope = N → bigPicture, S → stepByStep / pace = J → push, P → hold
 */
export const MBTI_PROFILES = {
  INTJ: {
    type: "INTJ",
    group: "analyst",
    title: "조용한 전략가",
    summary: "멀리 내다보며 자신만의 전략을 세우는 데서 힘을 얻는 성향입니다.",
    perceptionStyle:
      "눈앞의 사건보다 그 이면의 패턴과 장기적인 흐름에 먼저 주목합니다. 흩어진 정보를 모아 하나의 큰 그림으로 정리하려는 경향이 있습니다.",
    decisionStyle:
      "감정보다 논리적 타당성과 장기 전략을 기준으로 판단하는 편입니다. 결정을 내리기 전에 여러 시나리오를 머릿속으로 검토합니다.",
    relationshipStyle:
      "넓은 관계보다 깊이 있는 소수의 관계를 선호합니다. 마음을 여는 데 시간이 걸리지만 신뢰가 쌓이면 꾸준히 곁을 지키는 편입니다.",
    stressPatterns: [
      "통제할 수 없는 변수가 늘어날 때 예민해지는 모습",
      "비효율적인 상황이 반복될 때 마음의 문을 닫는 경향",
    ],
    strengths: [
      "큰 그림을 읽는 시야",
      "장기 전략을 세우는 힘",
      "감정에 휩쓸리지 않는 차분한 판단력",
    ],
    overusePatterns: [
      "혼자 결론을 내리고 공유를 미루는 습관",
      "상대의 감정을 분석 대상으로만 대하는 경향",
    ],
    effectiveAdviceStyle:
      "결론의 근거와 장기적인 방향을 함께 제시할 때 잘 받아들입니다. 감정에 호소하기보다 가설을 세우고 계획으로 옮기도록 돕는 방식이 효과적입니다.",
    actionPreferences: ["계획", "기록", "작은 실험"],
    balancingPerspectives: [
      "계획이 완벽하지 않아도 일단 공유하면 더 나은 답이 나올 수 있습니다.",
      "상대의 감정은 분석할 문제가 아니라 함께 머물러 줄 경험일 수 있습니다.",
    ],
    toneRules: {
      directness: "gentle",
      framing: "logic",
      scope: "bigPicture",
      pace: "push",
    },
  },
  INTP: {
    type: "INTP",
    group: "analyst",
    title: "사색하는 분석가",
    summary: "현상의 원리를 끝까지 파고들며 생각의 깊이를 즐기는 성향입니다.",
    perceptionStyle:
      "겉으로 드러난 사실보다 그 밑에 깔린 원리와 구조를 궁금해합니다. 하나의 주제를 여러 각도에서 오래 곱씹는 편입니다.",
    decisionStyle:
      "논리적으로 앞뒤가 맞는지가 가장 중요한 판단 기준입니다. 결론을 내리기 전에 가능한 반례를 스스로 검토하는 경향이 있습니다.",
    relationshipStyle:
      "감정 표현은 절제하는 편이지만 지적인 대화가 통하는 사람에게는 마음을 엽니다. 혼자만의 시간이 관계를 유지하는 데에도 중요한 역할을 합니다.",
    stressPatterns: [
      "감정적인 압박을 받을 때 자리를 피하고 싶어지는 모습",
      "생각할 시간 없이 즉답을 요구받을 때 방어적으로 변하는 경향",
    ],
    strengths: [
      "본질을 꿰뚫는 분석력",
      "여러 각도에서 검토하는 사고의 유연함",
      "독창적인 문제 해결 아이디어",
    ],
    overusePatterns: [
      "분석을 계속하느라 결정을 미루는 습관",
      "이론에 머물러 실행이 늦어지는 경향",
    ],
    effectiveAdviceStyle:
      "논리적 근거를 제시하되 스스로 결론에 도달할 여지를 남겨줄 때 잘 받아들입니다. 분석을 언제 멈출지 종료 기준을 함께 정해보도록 돕는 방식이 효과적입니다.",
    actionPreferences: ["기록", "작은 실험", "목록"],
    balancingPerspectives: [
      "완벽한 분석보다 적당한 시점의 실행이 더 많은 정보를 줄 때가 있습니다.",
      "감정도 판단에 필요한 데이터 중 하나로 볼 수 있습니다.",
    ],
    toneRules: {
      directness: "gentle",
      framing: "logic",
      scope: "bigPicture",
      pace: "hold",
    },
  },
  ENTJ: {
    type: "ENTJ",
    group: "analyst",
    title: "대담한 지휘관",
    summary: "목표를 향해 사람과 자원을 움직이는 추진력이 돋보이는 성향입니다.",
    perceptionStyle:
      "상황을 목표 달성의 관점에서 빠르게 구조화합니다. 기회와 성장 가능성을 남들보다 먼저 포착하는 편입니다.",
    decisionStyle:
      "효율과 성과를 기준으로 빠르고 명확하게 결정하는 편입니다. 일단 결정한 뒤에는 실행 속도를 중시합니다.",
    relationshipStyle:
      "함께 성장하고 도전하는 관계에서 활력을 얻습니다. 직설적인 소통을 선호해 때로 강하게 들릴 수 있지만 의도는 문제 해결에 있습니다.",
    stressPatterns: [
      "일이 뜻대로 통제되지 않을 때 조급해지는 모습",
      "성과가 보이지 않는 정체 상태를 견디기 어려워하는 경향",
    ],
    strengths: [
      "목표를 향한 강한 추진력",
      "사람과 자원을 조직하는 리더십",
      "기회를 포착하는 전략적 감각",
    ],
    overusePatterns: [
      "속도를 우선해 주변의 감정을 지나치는 습관",
      "성취를 위해 휴식과 회복을 뒤로 미루는 경향",
    ],
    effectiveAdviceStyle:
      "결론부터 명확하게 제시하고 근거를 뒤에 붙이는 방식을 선호합니다. 확장에 앞서 위험과 지속 가능성을 점검해보도록 돕는 조언이 효과적입니다.",
    actionPreferences: ["계획", "목록", "기록"],
    balancingPerspectives: [
      "속도를 잠시 늦추면 함께 가는 사람들의 목소리가 들리기 시작합니다.",
      "지속 가능한 성취를 위해서는 회복의 시간도 전략의 일부입니다.",
    ],
    toneRules: {
      directness: "direct",
      framing: "logic",
      scope: "bigPicture",
      pace: "push",
    },
  },
  ENTP: {
    type: "ENTP",
    group: "analyst",
    title: "재기발랄한 토론가",
    summary: "새로운 가능성과 대안을 탐색하며 아이디어를 주고받는 데서 에너지를 얻는 성향입니다.",
    perceptionStyle:
      "하나의 상황에서도 여러 가능성과 대안을 동시에 떠올립니다. 당연해 보이는 전제에 질문을 던지는 것을 즐기는 편입니다.",
    decisionStyle:
      "논리적으로 흥미로운 선택지들을 저울질하며 판단합니다. 다만 새로운 대안이 계속 떠올라 최종 결정이 늦어지기도 합니다.",
    relationshipStyle:
      "지적인 자극을 주고받는 대화에서 관계의 즐거움을 느낍니다. 토론을 좋아하지만 상대가 공격으로 받아들이지 않도록 조율이 필요할 때가 있습니다.",
    stressPatterns: [
      "반복적이고 세부적인 일이 쌓일 때 급격히 지치는 모습",
      "선택지가 막혀 있다고 느낄 때 답답해하는 경향",
    ],
    strengths: [
      "대안을 빠르게 떠올리는 발상력",
      "고정관념에 질문을 던지는 유연함",
      "낯선 문제에도 뛰어드는 지적 호기심",
    ],
    overusePatterns: [
      "새 아이디어를 좇느라 마무리를 미루는 습관",
      "토론 자체에 몰입해 상대의 감정을 놓치는 경향",
    ],
    effectiveAdviceStyle:
      "여러 관점을 함께 펼쳐놓고 논리로 좁혀가는 방식을 선호합니다. 떠오른 가설 가운데 하나를 골라 직접 검증해보도록 이끄는 조언이 효과적입니다.",
    actionPreferences: ["작은 실험", "대화", "기록"],
    balancingPerspectives: [
      "모든 가능성을 열어두는 것보다 하나를 끝내는 경험이 더 큰 자유를 줄 수 있습니다.",
      "상대에게는 토론의 승패보다 마음이 전해졌는지가 더 오래 남습니다.",
    ],
    toneRules: {
      directness: "direct",
      framing: "logic",
      scope: "bigPicture",
      pace: "hold",
    },
  },
  INFJ: {
    type: "INFJ",
    group: "diplomat",
    title: "통찰하는 조언자",
    summary: "사람과 상황의 이면에 담긴 의미를 깊이 읽어내는 성향입니다.",
    perceptionStyle:
      "말로 표현되지 않은 감정과 관계의 맥락을 민감하게 알아차립니다. 사건 하나에서도 의미와 상징을 찾으려는 경향이 있습니다.",
    decisionStyle:
      "자신의 가치와 주변 사람들에게 미칠 영향을 함께 고려해 판단합니다. 겉으로는 조용해도 내면에서는 오래 숙고한 뒤에 움직이는 편입니다.",
    relationshipStyle:
      "깊고 진실한 소수의 관계를 소중히 여깁니다. 상대의 마음을 먼저 헤아리다 자신의 필요를 뒤로 미루는 경우가 있습니다.",
    stressPatterns: [
      "갈등 상황이 길어질 때 혼자 속으로 삭이는 모습",
      "자신의 가치가 존중받지 못한다고 느낄 때 깊이 상처받는 경향",
    ],
    strengths: [
      "상대의 마음을 읽는 깊은 공감력",
      "표면 아래의 흐름을 알아차리는 통찰",
      "의미 있는 방향으로 꾸준히 나아가는 신념",
    ],
    overusePatterns: [
      "확인되지 않은 추측을 사실처럼 굳히는 습관",
      "타인을 돌보느라 자신을 소진하는 경향",
    ],
    effectiveAdviceStyle:
      "감정과 의미에 먼저 공감한 뒤 방향을 제시할 때 잘 받아들입니다. 마음속 추측을 상대에게 직접 묻는 질문으로 바꿔보도록 돕는 방식이 효과적입니다.",
    actionPreferences: ["대화", "기록", "질문"],
    balancingPerspectives: [
      "머릿속 해석이 아무리 정교해도 직접 물어보면 다른 답이 나올 수 있습니다.",
      "자신의 필요를 말하는 것도 관계를 깊게 만드는 방법입니다.",
    ],
    toneRules: {
      directness: "gentle",
      framing: "value",
      scope: "bigPicture",
      pace: "push",
    },
  },
  INFP: {
    type: "INFP",
    group: "diplomat",
    title: "이상을 품은 중재자",
    summary: "자신만의 가치와 이상을 나침반 삼아 조용히 나아가는 성향입니다.",
    perceptionStyle:
      "경험을 자신의 내적 가치에 비추어 받아들입니다. 현실 너머의 가능성과 이야기를 상상하는 데서 영감을 얻는 편입니다.",
    decisionStyle:
      "그 선택이 자신의 가치와 얼마나 일치하는지가 핵심 기준입니다. 마음의 확신이 설 때까지 결정을 미루는 경향이 있습니다.",
    relationshipStyle:
      "겉으로는 온화하지만 마음 깊은 곳의 이야기는 신뢰하는 사람에게만 꺼냅니다. 갈등보다 조화를 택하다 속마음이 쌓이기도 합니다.",
    stressPatterns: [
      "자신의 가치가 침해당했다고 느낄 때 크게 흔들리는 모습",
      "비판을 자기 존재에 대한 부정으로 받아들이는 경향",
    ],
    strengths: [
      "자신만의 가치를 지키는 진정성",
      "타인의 아픔에 공명하는 감수성",
      "가능성을 그려내는 풍부한 상상력",
    ],
    overusePatterns: [
      "이상과 현실의 간격 앞에서 시작을 미루는 습관",
      "갈등을 피하려 속마음을 감추는 경향",
    ],
    effectiveAdviceStyle:
      "가치와 감정을 존중받는다고 느낄 때 마음을 엽니다. 완벽한 확신이 서기 전에 부담이 작은 시도를 해보도록 격려하는 방식이 효과적입니다.",
    actionPreferences: ["기록", "작은 실험", "글쓰기"],
    balancingPerspectives: [
      "완벽한 확신은 시작한 뒤에 따라오는 경우가 많습니다.",
      "속마음을 꺼내는 작은 용기가 관계를 오히려 단단하게 만들 수 있습니다.",
    ],
    toneRules: {
      directness: "gentle",
      framing: "value",
      scope: "bigPicture",
      pace: "hold",
    },
  },
  ENFJ: {
    type: "ENFJ",
    group: "diplomat",
    title: "따뜻한 성장 조력자",
    summary: "주변 사람의 성장을 도우며 관계 속에서 의미를 찾는 성향입니다.",
    perceptionStyle:
      "사람들의 감정과 잠재력을 빠르게 알아차립니다. 관계 전체의 분위기와 흐름을 읽는 데 능한 편입니다.",
    decisionStyle:
      "그 결정이 사람들에게 어떤 영향을 줄지를 중심에 두고 판단합니다. 함께 성장하는 방향을 선택하려는 경향이 있습니다.",
    relationshipStyle:
      "먼저 다가가 마음을 쓰고 이끄는 역할을 자주 맡습니다. 다만 상대의 문제를 자신의 책임처럼 짊어질 때가 있습니다.",
    stressPatterns: [
      "도움이 거절당했다고 느낄 때 서운함이 깊어지는 모습",
      "모두를 만족시키려다 정작 자신이 지치는 경향",
    ],
    strengths: [
      "사람의 잠재력을 알아보는 눈",
      "마음을 모으는 따뜻한 소통력",
      "관계의 성장을 이끄는 헌신",
    ],
    overusePatterns: [
      "타인의 문제까지 자신의 책임으로 끌어안는 습관",
      "상대의 반응과 인정에 자신의 가치를 거는 경향",
    ],
    effectiveAdviceStyle:
      "관계와 성장의 언어로 이야기할 때 잘 받아들입니다. 상대의 몫과 자신의 몫을 구분해보도록 돕는 조언이 효과적입니다.",
    actionPreferences: ["대화", "기록", "계획"],
    balancingPerspectives: [
      "상대의 변화는 상대의 몫으로 남겨둘 때 관계가 더 건강해질 수 있습니다.",
      "돌봄의 방향을 가끔은 자신에게 돌려도 괜찮습니다.",
    ],
    toneRules: {
      directness: "gentle",
      framing: "value",
      scope: "bigPicture",
      pace: "push",
    },
  },
  ENFP: {
    type: "ENFP",
    group: "diplomat",
    title: "열정적인 영감가",
    summary: "새로운 가능성과 사람에게서 영감을 얻으며 변화를 즐기는 성향입니다.",
    perceptionStyle:
      "어디서든 새로운 가능성과 연결고리를 발견합니다. 사람과 아이디어 모두에서 의미를 찾으려는 경향이 있습니다.",
    decisionStyle:
      "가슴이 뛰는지, 자신의 가치와 맞닿아 있는지를 기준으로 판단합니다. 선택지가 많을수록 오히려 결정이 어려워지기도 합니다.",
    relationshipStyle:
      "진심 어린 관심과 에너지로 관계에 활력을 불어넣습니다. 깊은 대화를 좋아하지만 관계가 틀에 갇히면 답답함을 느낄 수 있습니다.",
    stressPatterns: [
      "반복되는 일상에 갇혔다고 느낄 때 무기력해지는 모습",
      "거절이나 무관심을 자신에 대한 평가로 받아들이는 경향",
    ],
    strengths: [
      "가능성을 발견하는 반짝이는 감각",
      "사람에게 활력을 주는 열정",
      "변화에 빠르게 적응하는 유연성",
    ],
    overusePatterns: [
      "여러 가능성 사이를 오가며 결정을 미루는 습관",
      "시작의 설렘에 비해 마무리 동력이 약해지는 경향",
    ],
    effectiveAdviceStyle:
      "가능성과 의미를 인정받을 때 마음을 엽니다. 선택지를 두세 개로 좁힌 뒤 그중 하나를 실행해보도록 돕는 방식이 효과적입니다.",
    actionPreferences: ["목록", "대화", "작은 실험"],
    balancingPerspectives: [
      "선택지를 줄이는 것은 가능성을 잃는 일이 아니라 실현에 가까워지는 일입니다.",
      "끝맺음의 성취감도 시작의 설렘 못지않은 에너지가 될 수 있습니다.",
    ],
    toneRules: {
      directness: "gentle",
      framing: "value",
      scope: "bigPicture",
      pace: "hold",
    },
  },
  ISTJ: {
    type: "ISTJ",
    group: "sentinel",
    title: "믿음직한 실무가",
    summary: "검증된 경험과 사실을 바탕으로 맡은 일을 끝까지 해내는 성향입니다.",
    perceptionStyle:
      "구체적인 사실과 과거의 경험을 판단의 재료로 삼습니다. 검증되지 않은 이야기보다 실제로 확인된 정보를 신뢰하는 편입니다.",
    decisionStyle:
      "규칙과 절차, 이전에 효과가 있었던 방법을 기준으로 신중하게 결정합니다. 한번 맡은 일은 책임지고 마무리하려는 경향이 있습니다.",
    relationshipStyle:
      "말보다 행동으로 신뢰를 쌓아가는 편입니다. 표현은 담백하지만 약속을 지키는 것으로 마음을 전합니다.",
    stressPatterns: [
      "계획이 갑자기 바뀔 때 불편함이 커지는 모습",
      "기준 없이 즉흥적으로 움직여야 할 때 피로가 쌓이는 경향",
    ],
    strengths: [
      "맡은 일을 끝까지 해내는 책임감",
      "사실에 기반한 꼼꼼한 판단력",
      "흔들림 없이 꾸준한 실행력",
    ],
    overusePatterns: [
      "익숙한 방식을 고수하며 새로운 방법을 미루는 습관",
      "원칙을 지키느라 유연한 예외를 허용하지 못하는 경향",
    ],
    effectiveAdviceStyle:
      "근거가 분명하고 절차가 구체적일 때 잘 받아들입니다. 큰 목표를 체크리스트와 단계로 쪼개어 제시하는 방식이 효과적입니다.",
    actionPreferences: ["목록", "기록", "계획"],
    balancingPerspectives: [
      "새로운 방식도 몇 번 검증하고 나면 믿을 수 있는 경험이 됩니다.",
      "예외를 허용하는 유연함이 오히려 원칙을 오래 지키는 힘이 될 수 있습니다.",
    ],
    toneRules: {
      directness: "gentle",
      framing: "logic",
      scope: "stepByStep",
      pace: "push",
    },
  },
  ISFJ: {
    type: "ISFJ",
    group: "sentinel",
    title: "헌신적인 수호자",
    summary: "가까운 사람들을 세심하게 챙기며 안정적인 일상을 지켜가는 성향입니다.",
    perceptionStyle:
      "주변 사람의 상태와 일상의 작은 변화를 세심하게 알아차립니다. 과거의 경험과 익숙한 방식에서 안정감을 느끼는 편입니다.",
    decisionStyle:
      "가까운 사람들의 안녕과 관계의 안정을 중요한 기준으로 삼습니다. 급격한 변화보다 검증된 길을 택하는 경향이 있습니다.",
    relationshipStyle:
      "드러나지 않게 챙기고 배려하는 방식으로 애정을 표현합니다. 다만 자신의 필요는 뒤로 미루고 참는 경우가 많습니다.",
    stressPatterns: [
      "자신의 노력이 당연하게 여겨진다고 느낄 때 서운함이 쌓이는 모습",
      "갑작스러운 변화 앞에서 불안이 커지는 경향",
    ],
    strengths: [
      "세심하게 살피는 배려심",
      "묵묵히 곁을 지키는 성실함",
      "일상을 안정적으로 꾸리는 꼼꼼함",
    ],
    overusePatterns: [
      "자신의 필요를 뒤로 미루고 참는 습관",
      "부탁을 거절하지 못해 부담을 떠안는 경향",
    ],
    effectiveAdviceStyle:
      "따뜻하게 공감받은 뒤 구체적인 방법을 들을 때 잘 받아들입니다. 자신에게 필요한 것이 무엇인지 스스로 확인해보도록 돕는 조언이 효과적입니다.",
    actionPreferences: ["기록", "대화", "휴식"],
    balancingPerspectives: [
      "자신을 돌보는 일은 이기심이 아니라 곁을 오래 지키기 위한 준비입니다.",
      "필요한 것을 말해주는 편이 상대에게도 더 고마운 일일 수 있습니다.",
    ],
    toneRules: {
      directness: "gentle",
      framing: "value",
      scope: "stepByStep",
      pace: "push",
    },
  },
  ESTJ: {
    type: "ESTJ",
    group: "sentinel",
    title: "실용적인 조직가",
    summary: "체계와 효율로 일과 사람을 정돈하며 목표를 완수하는 성향입니다.",
    perceptionStyle:
      "현재 상황을 사실 중심으로 빠르게 파악합니다. 무엇이 비효율적인지, 어디를 정리해야 하는지가 먼저 눈에 들어오는 편입니다.",
    decisionStyle:
      "목표 달성과 효율을 기준으로 명확하고 빠르게 결정합니다. 정해진 것은 미루지 않고 곧바로 실행에 옮기는 경향이 있습니다.",
    relationshipStyle:
      "역할과 책임이 분명한 관계에서 편안함을 느낍니다. 표현이 직설적이라 단호하게 들릴 수 있지만 책임감 있는 행동으로 신뢰를 쌓습니다.",
    stressPatterns: [
      "일이 기준 없이 흘러갈 때 답답함이 커지는 모습",
      "애를 써도 통제되지 않는 상황에서 조급해지는 경향",
    ],
    strengths: [
      "일을 체계적으로 조직하는 능력",
      "목표를 완수하는 강한 책임감",
      "현실적인 문제를 처리하는 실행력",
    ],
    overusePatterns: [
      "자신의 기준을 주변에도 같은 강도로 적용하는 습관",
      "통제 밖의 일까지 관리하려다 소모되는 경향",
    ],
    effectiveAdviceStyle:
      "결론과 실행 단계를 명확히 제시할 때 잘 받아들입니다. 통제할 수 있는 일과 없는 일을 구분해보도록 돕는 조언이 효과적입니다.",
    actionPreferences: ["계획", "목록", "기록"],
    balancingPerspectives: [
      "모든 것을 직접 관리하지 않아도 일은 생각보다 잘 굴러갈 수 있습니다.",
      "사람마다 속도가 다르다는 것을 인정하면 협력이 더 쉬워집니다.",
    ],
    toneRules: {
      directness: "direct",
      framing: "logic",
      scope: "stepByStep",
      pace: "push",
    },
  },
  ESFJ: {
    type: "ESFJ",
    group: "sentinel",
    title: "다정한 조율가",
    summary: "주변의 조화를 살피고 사람들을 연결하며 힘을 얻는 성향입니다.",
    perceptionStyle:
      "모임의 분위기와 사람들 사이의 기류를 빠르게 감지합니다. 누군가 불편해 보이면 그냥 지나치기 어려운 편입니다.",
    decisionStyle:
      "관계의 조화와 주변 사람들의 기대를 중요한 기준으로 삼습니다. 모두에게 좋은 방향을 찾으려 애쓰는 경향이 있습니다.",
    relationshipStyle:
      "먼저 챙기고 연결하며 관계의 중심 역할을 자주 맡습니다. 다만 애쓴 만큼 돌아오지 않는다고 느끼면 서운함이 쌓일 수 있습니다.",
    stressPatterns: [
      "갈등이나 냉랭한 분위기 속에서 마음이 크게 불편해지는 모습",
      "자신의 노력이 외면받는다고 느낄 때 위축되는 경향",
    ],
    strengths: [
      "사람을 잇는 다정한 사교성",
      "분위기를 살피는 섬세한 감각",
      "맡은 역할을 다하는 성실한 헌신",
    ],
    overusePatterns: [
      "모두의 기대를 맞추려다 자신을 소모하는 습관",
      "서운함을 표현하지 못하고 마음에 쌓아두는 경향",
    ],
    effectiveAdviceStyle:
      "마음을 알아준다는 느낌과 함께 구체적인 방법을 제시할 때 잘 받아들입니다. 관계의 상호성을 점검하고 자신의 요구도 표현해보도록 돕는 방식이 효과적입니다.",
    actionPreferences: ["대화", "기록", "계획"],
    balancingPerspectives: [
      "모두를 만족시키지 못해도 관계의 가치는 줄어들지 않습니다.",
      "원하는 것을 말하는 일은 관계를 해치는 것이 아니라 균형을 맞추는 일입니다.",
    ],
    toneRules: {
      directness: "gentle",
      framing: "value",
      scope: "stepByStep",
      pace: "push",
    },
  },
  ISTP: {
    type: "ISTP",
    group: "explorer",
    title: "침착한 장인",
    summary: "문제의 구조를 파악하고 직접 손을 움직여 해결하는 데 능한 성향입니다.",
    perceptionStyle:
      "사물과 상황이 어떻게 작동하는지 그 구조와 원인에 주목합니다. 말로 길게 설명을 듣기보다 직접 만지고 확인하며 파악하는 편입니다.",
    decisionStyle:
      "실용성과 효율을 기준으로 군더더기 없이 판단합니다. 필요할 때 움직이고 불필요한 개입은 하지 않는 경향이 있습니다.",
    relationshipStyle:
      "감정 표현은 적지만 필요한 순간 행동으로 돕는 방식을 택합니다. 서로의 공간을 존중하는 관계에서 편안함을 느낍니다.",
    stressPatterns: [
      "감정 표현을 강요받을 때 거리를 두고 싶어지는 모습",
      "자율성이 침해당한다고 느낄 때 갑자기 차가워지는 경향",
    ],
    strengths: [
      "문제의 원인을 짚어내는 관찰력",
      "위기 상황에서도 흔들리지 않는 침착함",
      "몸으로 익히는 실전 감각",
    ],
    overusePatterns: [
      "혼자 해결하려다 도움 요청을 미루는 습관",
      "감정 이야기를 실용적이지 않다고 건너뛰는 경향",
    ],
    effectiveAdviceStyle:
      "원인과 해결책이 간결하게 정리된 조언을 선호합니다. 길게 고민하기보다 작은 실험으로 직접 확인해보도록 이끄는 방식이 효과적입니다.",
    actionPreferences: ["작은 실험", "몸을 움직", "관찰"],
    balancingPerspectives: [
      "감정을 나누는 대화도 문제 해결의 유용한 도구가 될 수 있습니다.",
      "도움을 요청하는 것은 능력 부족이 아니라 효율적인 선택일 수 있습니다.",
    ],
    toneRules: {
      directness: "gentle",
      framing: "logic",
      scope: "stepByStep",
      pace: "hold",
    },
  },
  ISFP: {
    type: "ISFP",
    group: "explorer",
    title: "조용한 감성가",
    summary: "지금 이 순간의 감정과 아름다움을 자신만의 방식으로 음미하는 성향입니다.",
    perceptionStyle:
      "지금 여기의 감각과 감정을 섬세하게 경험합니다. 아름다움과 분위기의 미묘한 차이를 알아차리는 편입니다.",
    decisionStyle:
      "자신의 감정과 가치에 어긋나지 않는지가 중요한 기준입니다. 큰 소리를 내기보다 조용히 자기 방식대로 선택하는 경향이 있습니다.",
    relationshipStyle:
      "말보다 함께하는 시간과 작은 행동으로 마음을 표현합니다. 갈등이 생기면 맞서기보다 조용히 물러나는 경우가 많습니다.",
    stressPatterns: [
      "비교당하거나 평가받는 상황에서 위축되는 모습",
      "억눌린 감정이 쌓이다 한꺼번에 터져 나오는 경향",
    ],
    strengths: [
      "순간을 음미하는 섬세한 감성",
      "조용히 배려하는 따뜻함",
      "자기다움을 지키는 부드러운 단단함",
    ],
    overusePatterns: [
      "불편함을 말하지 않고 혼자 삭이는 습관",
      "갈등을 피하려 자리를 뜨는 경향",
    ],
    effectiveAdviceStyle:
      "감정을 존중받으며 압박 없이 들을 때 마음을 엽니다. 부담이 작은 표현부터 시도해보도록 돕는 방식이 효과적입니다.",
    actionPreferences: ["몸을 움직", "기록", "산책"],
    balancingPerspectives: [
      "작게라도 표현하면 상대는 생각보다 잘 받아들일 수 있습니다.",
      "불편함을 말하는 것은 관계를 깨는 일이 아니라 지키는 일일 수 있습니다.",
    ],
    toneRules: {
      directness: "gentle",
      framing: "value",
      scope: "stepByStep",
      pace: "hold",
    },
  },
  ESTP: {
    type: "ESTP",
    group: "explorer",
    title: "활동적인 해결사",
    summary: "지금 눈앞의 상황에 빠르게 반응하며 기회를 붙잡는 성향입니다.",
    perceptionStyle:
      "지금 벌어지는 상황과 눈앞의 기회를 빠르게 포착합니다. 이론보다 현장에서 몸으로 부딪히며 파악하는 편입니다.",
    decisionStyle:
      "현실적인 손익과 즉각적인 효과를 기준으로 빠르게 판단합니다. 생각이 길어지기 전에 몸이 먼저 움직이는 경향이 있습니다.",
    relationshipStyle:
      "유쾌하고 시원시원한 에너지로 사람들과 쉽게 어울립니다. 무거운 감정 대화보다 함께 활동하며 가까워지는 방식을 선호합니다.",
    stressPatterns: [
      "행동이 제한되고 기다려야만 할 때 답답함이 커지는 모습",
      "장기 계획만 요구받을 때 흥미를 잃는 경향",
    ],
    strengths: [
      "상황에 즉각 반응하는 순발력",
      "위기에서도 움츠러들지 않는 배짱",
      "현실 감각이 뛰어난 문제 해결력",
    ],
    overusePatterns: [
      "결과를 살피기 전에 몸이 먼저 나가는 습관",
      "지루함을 피하려 위험을 가볍게 여기는 경향",
    ],
    effectiveAdviceStyle:
      "현실적인 예시와 바로 시도할 수 있는 행동을 제시할 때 잘 받아들입니다. 움직이기 전에 결과를 한 번 그려보도록 돕는 조언이 효과적입니다.",
    actionPreferences: ["몸을 움직", "작은 실험", "대화"],
    balancingPerspectives: [
      "행동 전에 잠깐 결과를 그려보는 습관이 순발력을 더 값지게 만듭니다.",
      "신중한 사람의 느린 걸음이 때로는 더 빠른 길을 알려줄 수 있습니다.",
    ],
    toneRules: {
      directness: "direct",
      framing: "logic",
      scope: "stepByStep",
      pace: "hold",
    },
  },
  ESFP: {
    type: "ESFP",
    group: "explorer",
    title: "유쾌한 분위기 메이커",
    summary: "지금 이 순간의 즐거움을 사람들과 나누며 빛나는 성향입니다.",
    perceptionStyle:
      "지금 이 순간의 분위기와 사람들의 감정을 생생하게 느낍니다. 오늘의 즐거움과 눈앞의 경험에 마음이 먼저 가는 편입니다.",
    decisionStyle:
      "지금 기분이 좋은지, 함께하는 사람들이 즐거운지가 중요한 기준입니다. 무거운 고민보다 마음이 끌리는 쪽을 택하는 경향이 있습니다.",
    relationshipStyle:
      "밝은 에너지로 사람들을 즐겁게 하며 관계의 활력소가 됩니다. 다만 갈등이나 무거운 주제는 뒤로 미루고 싶어할 수 있습니다.",
    stressPatterns: [
      "혼자 남겨졌다고 느낄 때 급격히 가라앉는 모습",
      "지루하고 통제된 환경에서 활력을 잃는 경향",
    ],
    strengths: [
      "분위기를 밝히는 긍정 에너지",
      "사람의 감정에 빠르게 반응하는 공감 감각",
      "현재를 즐기는 생기 있는 적응력",
    ],
    overusePatterns: [
      "즐거움을 좇느라 중요한 결정을 미루는 습관",
      "무거운 감정을 웃음으로 덮어두는 경향",
    ],
    effectiveAdviceStyle:
      "밝고 공감 어린 분위기에서 이야기할 때 마음을 엽니다. 지금의 욕구와 길게 보았을 때의 바람을 나란히 놓고 비교해보도록 돕는 방식이 효과적입니다.",
    actionPreferences: ["대화", "몸을 움직", "기록"],
    balancingPerspectives: [
      "오늘의 즐거움과 내일의 바람은 함께 챙길 때 더 오래갑니다.",
      "무거운 감정도 꺼내놓으면 관계를 더 깊게 만드는 재료가 됩니다.",
    ],
    toneRules: {
      directness: "gentle",
      framing: "value",
      scope: "stepByStep",
      pace: "hold",
    },
  },
} as const satisfies Record<MbtiType, MbtiProfile>;
