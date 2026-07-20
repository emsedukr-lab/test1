import type { MbtiProfile, MbtiType } from "@/types/mbti";
import { MBTI_PROFILES } from "./profiles";

/**
 * MBTI 미선택 모드는 별도의 '중립 프로필'을 만들지 않는다 —
 * null을 그대로 반환하고 엔진이 브리지/렌즈 생략으로 처리한다.
 */
export function getProfile(mbti: MbtiType | null): MbtiProfile | null {
  if (mbti === null) return null;
  return MBTI_PROFILES[mbti] ?? null;
}

export { MBTI_PROFILES };
