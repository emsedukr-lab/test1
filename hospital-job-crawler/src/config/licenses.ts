import type { LicenseCategory } from '../types'

export const ALL_CATEGORIES: LicenseCategory[] = [
  '의사', '간호사', '약사', '방사선사', '임상병리사',
  '물리치료사', '작업치료사', '치과위생사', '영양사',
  '사회복지사', '의무기록사', '응급구조사',
  '행정/원무', 'IT/전산', '연구직', '기타',
]

export const SHEET_HEADERS = [
  '병원명', '면허구분', '채용제목', '고용형태', '마감일', '게시일', '출처', '링크', '수집일시',
]
