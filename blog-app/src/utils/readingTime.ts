// 평균 읽기 속도: 분당 200단어 (한국어 기준)
export function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return Math.max(1, minutes)
}
