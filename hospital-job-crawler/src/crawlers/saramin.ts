import axios from 'axios'
import * as cheerio from 'cheerio'
import type { Hospital, JobPosting, CrawlResult } from '../types'
import { classify } from '../classifier'

const BASE_URL = 'https://www.saramin.co.kr'
const SEARCH_URL = `${BASE_URL}/zf_user/search/recruit`

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'ko-KR,ko;q=0.9',
}

async function fetchPage(keyword: string, page = 1): Promise<string> {
  const res = await axios.get(SEARCH_URL, {
    params: {
      searchType: 'search',
      searchword: keyword,
      recruitPageCount: 40,
      start: page,
    },
    headers: HEADERS,
    timeout: 15000,
  })

  return res.data as string
}

function parseJobs(html: string, hospital: Hospital): Omit<JobPosting, 'licenseCategory'>[] {
  const $ = cheerio.load(html)
  const jobs: Omit<JobPosting, 'licenseCategory'>[] = []

  $('.item_recruit').each((_, el) => {
    const $el = $(el)
    const $title = $el.find('.job_tit a')
    const title = $title.text().trim()
    const href = $title.attr('href') ?? ''
    const url = href.startsWith('http') ? href : `${BASE_URL}${href}`

    // 사람인 공고 ID 추출 (URL의 jobId 파라미터)
    const jobIdMatch = href.match(/jobId=(\d+)/) ?? href.match(/\/(\d+)$/)
    const originalId = jobIdMatch ? jobIdMatch[1] : String(Date.now())

    // 회사명이 병원 키워드 포함 여부 확인
    const companyName = $el.find('.corp_name a').text().trim()
    const isTargetHospital = hospital.searchKeywords.some((kw) =>
      companyName.includes(kw) || kw.includes(companyName),
    )
    if (!isTargetHospital && companyName) return

    const deadline = $el.find('.date').text().trim()
    const employmentType = $el.find('.job_condition span').first().text().trim()

    if (!title || !url) return

    jobs.push({
      id: `saramin:${originalId}`,
      source: 'saramin',
      originalId,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      title,
      employmentType: employmentType || undefined,
      deadline: deadline || undefined,
      url,
      scrapedAt: new Date().toISOString(),
    })
  })

  return jobs
}

export async function crawlHospital(hospital: Hospital): Promise<CrawlResult> {
  const allJobs: JobPosting[] = []

  for (const keyword of hospital.searchKeywords.slice(0, 2)) {
    try {
      const html = await fetchPage(keyword)
      const rawJobs = parseJobs(html, hospital)
      const classified = rawJobs.map((job) => classify(job))
      allJobs.push(...classified)
      // 중복 제거 (같은 id)
    } catch (err) {
      console.warn(`[사람인] ${hospital.name} (${keyword}) 수집 오류:`, (err as Error).message)
    }

    // 요청 간격 (1~2초)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
  }

  // 중복 id 제거
  const seen = new Set<string>()
  const unique = allJobs.filter((job) => {
    if (seen.has(job.id)) return false
    seen.add(job.id)
    return true
  })

  return {
    hospitalId: hospital.id,
    source: 'saramin',
    jobs: unique,
  }
}

export async function crawlAll(hospitals: Hospital[]): Promise<CrawlResult[]> {
  const results: CrawlResult[] = []

  for (const hospital of hospitals) {
    const result = await crawlHospital(hospital)
    results.push(result)
    console.log(`[사람인] ${hospital.name}: ${result.jobs.length}건`)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return results
}
