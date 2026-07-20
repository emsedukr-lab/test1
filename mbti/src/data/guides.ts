export interface GuideMeta {
  slug: string;
  title: string;
  desc: string;
}

export const GUIDE_LIST: readonly GuideMeta[] = [
  {
    slug: "how-to-use",
    title: "이용 방법",
    desc: "MBTI 선택부터 결과 저장까지, 리딩 진행 순서를 안내합니다.",
  },
  {
    slug: "mbti-tarot",
    title: "MBTI와 타로",
    desc: "왜 같은 카드가 성향에 따라 다르게 읽히는지, 이 서비스의 해석 원칙을 설명합니다.",
  },
  {
    slug: "relationship",
    title: "관계 리딩 가이드",
    desc: "연애·인간관계 질문을 더 잘 던지는 방법과 관계 스프레드 읽는 법.",
  },
  {
    slug: "career",
    title: "커리어 리딩 가이드",
    desc: "일과 진로 고민에서 타로를 실용적으로 쓰는 방법.",
  },
  {
    slug: "healthy-tarot-use",
    title: "건강한 타로 활용법",
    desc: "타로에 기대지 않고 타로를 활용하는 법 — 이 서비스가 지키는 선.",
  },
];
