export type LicenseCategory =
  | '의사'
  | '간호사'
  | '약사'
  | '방사선사'
  | '임상병리사'
  | '물리치료사'
  | '작업치료사'
  | '치과위생사'
  | '영양사'
  | '사회복지사'
  | '의무기록사'
  | '응급구조사'
  | '행정/원무'
  | 'IT/전산'
  | '연구직'
  | '기타'

export interface Hospital {
  id: string           // 고유 식별자 (영문, 예: seoul-national)
  name: string         // 병원명 (한국어)
  region: string       // 지역 (서울, 경기, 부산 등)
  websiteUrl?: string  // 병원 공식 홈페이지
  hrPageUrl?: string   // 채용 페이지 직접 URL
  searchKeywords: string[] // 채용 플랫폼 검색 키워드
}

export interface JobPosting {
  id: string           // 공고 고유 ID (source:originalId)
  source: 'saramin' | 'jobkorea' | 'wanted' | 'direct'
  originalId: string   // 출처 사이트 원본 ID
  hospitalId: string   // Hospital.id
  hospitalName: string // 병원명
  title: string        // 채용 제목
  licenseCategory: LicenseCategory
  department?: string
  employmentType?: string // 고용형태 (정규직, 계약직 등)
  deadline?: string    // 마감일 (ISO 8601 또는 "상시채용")
  postedAt?: string    // 게시일 (ISO 8601)
  url: string          // 공고 상세 URL
  scrapedAt: string    // 수집 일시 (ISO 8601)
}

export interface CrawlResult {
  hospitalId: string
  source: JobPosting['source']
  jobs: JobPosting[]
  error?: string
}

export interface SheetsRow {
  병원명: string
  면허구분: string
  채용제목: string
  고용형태: string
  마감일: string
  게시일: string
  출처: string
  링크: string
  수집일시: string
}
