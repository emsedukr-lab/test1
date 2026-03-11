import axios from 'axios'
import * as cheerio from 'cheerio'
import type { Hospital, JobPosting, CrawlResult } from '../types'
import { classify } from '../classifier'

const BASE_URL = 'https://www.jobkorea.co.kr'
const SEARCH_URL = `${BASE_URL}/Search/`

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'ko-KR,ko;q=0.9',
  Referer: 'https://www.jobkorea.co.kr/',
}

async function fetchPage(keyword: string, page = 1): Promise<string> {
  const res = await axios.get(SEARCH_URL, {
    params: {
      stext: keyword,
      tabType: 'recruit',
      Page_No: page,
    },
    headers: HEADERS,
    timeout: 15000,
  })
  return res.data as string
}

function parseJobs(html: string, hospital: Hospital): Omit<JobPosting, 'licenseCategory'>[] {
  const $ = cheerio.load(html)
  const jobs: Omit<JobPosting, 'licenseCategory'>[] = []

  // 잡코리아 채용공고 목록 파싱
  $('.list-default .post-list-default').each((_, el) => {
    const $el = $(el)
    const $title = $el.find('.post-list-info .title')
    const title = $title.text().trim()
    const href = $el.find('.post-list-info a.title').attr('href') ?? ''
    const url = href.startsWith('http') ? href : `${BASE_URL}${href}`

    const companyName = $el.find('.corp-name a').text().trim()
    const isTarget = hospital.searchKeywords.some((kw) => companyName.includes(kw) || kw.includes(companyName))
    if (!isTarget && companyName) return

    const originalIdMatch = href.match(/[?&]GNo=(\d+)/) ?? href.match(/\/(\d+)/)
    const originalId = originalIdMatch ? originalIdMatch[1] : String(Date.now())

    const deadline = $el.find('.date-info').text().trim()
    const employmentType = $el.find('.chip-information-group .chip').first().text().trim()

    if (!title || !url) return

    jobs.push({
      id: `jobkorea:${originalId}`,
      source: 'jobkorea',
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
      const classified = rawJobs.map((j) => classify(j))
      allJobs.push(...classified)
    } catch (err) {
      console.warn(`[잡코리아] ${hospital.name} (${keyword}) 수집 오류:`, (err as Error).message)
    }

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800))
  }

  const seen = new Set<string>()
  const unique = allJobs.filter((j) => {
    if (seen.has(j.id)) return false
    seen.add(j.id)
    return true
  })

  return {
    hospitalId: hospital.id,
    source: 'jobkorea',
    jobs: unique,
  }
}

export async function crawlAll(hospitals: Hospital[]): Promise<CrawlResult[]> {
  const results: CrawlResult[] = []
  for (const hospital of hospitals) {
    const result = await crawlHospital(hospital)
    results.push(result)
    console.log(`[잡코리아] ${hospital.name}: ${result.jobs.length}건`)
    await new Promise((r) => setTimeout(r, 600))
  }
  return results
}
