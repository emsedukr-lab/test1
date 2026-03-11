import { google } from 'googleapis'
import type { JobPosting, LicenseCategory } from '../types'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

const ALL_CATEGORIES: LicenseCategory[] = [
  '의사', '간호사', '약사', '방사선사', '임상병리사',
  '물리치료사', '작업치료사', '치과위생사', '영양사',
  '사회복지사', '의무기록사', '응급구조사',
  '행정/원무', 'IT/전산', '연구직', '기타',
]

const HEADERS = ['병원명', '면허구분', '채용제목', '고용형태', '마감일', '게시일', '출처', '링크', '수집일시']

function createAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: SCOPES,
  })
}

function toRow(job: JobPosting): string[] {
  return [
    job.hospitalName, job.licenseCategory, job.title,
    job.employmentType ?? '', job.deadline ?? '',
    job.postedAt ?? '', job.source, job.url, job.scrapedAt,
  ]
}

async function ensureSheets(spreadsheetId: string, sheets: ReturnType<typeof google.sheets>): Promise<void> {
  const meta = await sheets.spreadsheets.get({ spreadsheetId })
  const existing = meta.data.sheets?.map(s => s.properties?.title ?? '') ?? []
  const toCreate = ['전체', ...ALL_CATEGORIES].filter(n => !existing.includes(n))

  if (toCreate.length === 0) return

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests: toCreate.map(title => ({ addSheet: { properties: { title } } })) },
  })

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: 'RAW',
      data: toCreate.map(name => ({ range: `${name}!A1`, values: [HEADERS] })),
    },
  })
}

/**
 * 채용공고를 Google Sheets에 업로드합니다.
 * "전체" 시트 + 면허별 시트에 동시 저장.
 */
export async function uploadToSheets(jobs: JobPosting[]): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
  if (!spreadsheetId) {
    console.error('[Sheets] GOOGLE_SPREADSHEET_ID가 설정되지 않았습니다.')
    return
  }
  if (jobs.length === 0) {
    console.log('[Sheets] 업로드할 신규 공고 없음')
    return
  }

  const auth = createAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  await ensureSheets(spreadsheetId, sheets)

  // 전체 시트
  await sheets.spreadsheets.values.append({
    spreadsheetId, range: '전체!A1',
    valueInputOption: 'RAW', insertDataOption: 'INSERT_ROWS',
    requestBody: { values: jobs.map(toRow) },
  })

  // 면허별 시트
  const grouped = new Map<LicenseCategory, JobPosting[]>()
  for (const job of jobs) {
    const list = grouped.get(job.licenseCategory) ?? []
    grouped.set(job.licenseCategory, [...list, job])
  }
  for (const [category, list] of grouped) {
    await sheets.spreadsheets.values.append({
      spreadsheetId, range: `${category}!A1`,
      valueInputOption: 'RAW', insertDataOption: 'INSERT_ROWS',
      requestBody: { values: list.map(toRow) },
    })
  }

  console.log(`[Sheets] ${jobs.length}개 공고 업로드 완료`)
}
