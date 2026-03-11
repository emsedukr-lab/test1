import type { LicenseCategory, JobPosting } from '../types'

const LICENSE_RULES: Array<{ category: LicenseCategory; keywords: string[] }> = [
  { category: '의사', keywords: ['의사', '전문의', '전공의', '인턴', '레지던트', '주치의', '촉탁의', '공중보건의', '의학과'] },
  { category: '간호사', keywords: ['간호사', '수간호사', '전문간호사', 'PA간호사', '간호직', '간호조무사', '간호팀', '간호부'] },
  { category: '약사', keywords: ['약사', '약무직', '약제사', '약학'] },
  { category: '방사선사', keywords: ['방사선사', '방사선기사', '영상의학기사', '방사선팀'] },
  { category: '임상병리사', keywords: ['임상병리사', '임상병리', '진단검사', '검사실'] },
  { category: '물리치료사', keywords: ['물리치료사', '물리치료', '재활치료', '운동치료'] },
  { category: '작업치료사', keywords: ['작업치료사', '작업치료'] },
  { category: '치과위생사', keywords: ['치과위생사', '치과위생', '구강위생'] },
  { category: '영양사', keywords: ['영양사', '임상영양사', '영양팀', '영양부', '영양직'] },
  { category: '사회복지사', keywords: ['사회복지사', '의료사회복지', '사회사업'] },
  { category: '의무기록사', keywords: ['의무기록사', '의무기록', '진료정보관리'] },
  { category: '응급구조사', keywords: ['응급구조사', '응급구조', 'EMT', '1급응급', '2급응급'] },
  { category: '행정/원무', keywords: ['원무', '행정직', '원무직', '사무직', '총무', '기획직', '인사직', '재무직'] },
  { category: 'IT/전산', keywords: ['전산직', 'IT직', '정보팀', '시스템팀', '개발자', '보안팀', '전산원', '전산'] },
  { category: '연구직', keywords: ['연구원', '임상연구원', '연구직', 'R&D'] },
]

/**
 * 채용공고 제목으로 면허/자격 카테고리를 분류합니다.
 */
export function classifyByTitle(title: string): LicenseCategory {
  const normalized = title.replace(/[\s\[\]\(\)\-_]/g, '').toLowerCase()

  for (const rule of LICENSE_RULES) {
    for (const keyword of rule.keywords) {
      const normalizedKeyword = keyword.replace(/\s+/g, '').toLowerCase()
      if (normalized.includes(normalizedKeyword)) {
        return rule.category
      }
    }
  }

  // 2차 시도: 원본 제목으로 재시도
  for (const rule of LICENSE_RULES) {
    for (const keyword of rule.keywords) {
      if (title.includes(keyword)) {
        return rule.category
      }
    }
  }

  return '기타'
}

/**
 * JobPosting에 licenseCategory를 채워서 반환합니다.
 */
export function classify(job: Omit<JobPosting, 'licenseCategory'>): JobPosting {
  return {
    ...job,
    licenseCategory: classifyByTitle(job.title),
  }
}

/**
 * 여러 JobPosting을 카테고리별로 그룹화합니다.
 */
export function groupByLicense(jobs: JobPosting[]): Map<LicenseCategory, JobPosting[]> {
  const groups = new Map<LicenseCategory, JobPosting[]>()
  for (const job of jobs) {
    const existing = groups.get(job.licenseCategory) ?? []
    groups.set(job.licenseCategory, [...existing, job])
  }
  return groups
}
