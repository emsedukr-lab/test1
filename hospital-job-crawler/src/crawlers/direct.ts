import { chromium } from 'playwright'
import type { Hospital, JobPosting, CrawlResult } from '../types'
import { classify } from '../classifier'

// 직접 크롤링 지원 병원 ID 목록 (HR 페이지 구조 파악된 병원)
const SUPPORTED_HOSPITAL_IDS = new Set([
  'seoul-national',
  'asan-medical',
  'bundang-snuh',
])

async function crawlSnuh(hospital: Hospital): Promise<Omit<JobPosting, 'licenseCategory'>[]> {
  // 서울대학교병원 채용 페이지
  const browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' })
  const page = await browser.newPage()
  const jobs: Omit<JobPosting, 'licenseCategory'>[] = []

  try {
    await page.goto('https://www.snuh.org/recruit/main.do', { waitUntil: 'networkidle', timeout: 30000 })

    const items = await page.$$eval('table.board_list tbody tr, .recruit-list .item', rows =>
      rows.map(row => {
        const titleEl = row.querySelector('td.subject a, .title a, a.subject')
        const title = titleEl?.textContent?.trim() ?? ''
        const href = titleEl?.getAttribute('href') ?? ''
        const deadline = row.querySelector('td.date, .date')?.textContent?.trim() ?? ''
        return { title, href, deadline }
      })
    )

    for (const item of items) {
      if (!item.title) continue
      const url = item.href.startsWith('http')
        ? item.href
        : `https://www.snuh.org${item.href}`
      const originalId = item.href.replace(/[^a-zA-Z0-9]/g, '') || String(Date.now())

      jobs.push({
        id: `direct:snuh:${originalId}`,
        source: 'direct',
        originalId,
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        title: item.title,
        deadline: item.deadline || undefined,
        url,
        scrapedAt: new Date().toISOString(),
      })
    }
  } catch (err) {
    console.warn(`[직접크롤] 서울대병원 오류:`, (err as Error).message)
  } finally {
    await browser.close()
  }

  return jobs
}

async function crawlAsan(hospital: Hospital): Promise<Omit<JobPosting, 'licenseCategory'>[]> {
  // 서울아산병원 채용 페이지
  const browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' })
  const page = await browser.newPage()
  const jobs: Omit<JobPosting, 'licenseCategory'>[] = []

  try {
    await page.goto('https://www.amc.seoul.kr/asan/job/main.do', { waitUntil: 'networkidle', timeout: 30000 })

    const items = await page.$$eval('ul.list_type li, .job-list .item', els =>
      els.map(el => {
        const titleEl = el.querySelector('.title a, a.tit, a')
        const title = titleEl?.textContent?.trim() ?? ''
        const href = titleEl?.getAttribute('href') ?? ''
        const deadline = el.querySelector('.date, .period')?.textContent?.trim() ?? ''
        return { title, href, deadline }
      })
    )

    for (const item of items) {
      if (!item.title) continue
      const url = item.href.startsWith('http')
        ? item.href
        : `https://www.amc.seoul.kr${item.href}`
      const originalId = item.href.replace(/[^a-zA-Z0-9]/g, '') || String(Date.now())

      jobs.push({
        id: `direct:asan:${originalId}`,
        source: 'direct',
        originalId,
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        title: item.title,
        deadline: item.deadline || undefined,
        url,
        scrapedAt: new Date().toISOString(),
      })
    }
  } catch (err) {
    console.warn(`[직접크롤] 서울아산병원 오류:`, (err as Error).message)
  } finally {
    await browser.close()
  }

  return jobs
}

async function crawlBundangSnuh(hospital: Hospital): Promise<Omit<JobPosting, 'licenseCategory'>[]> {
  // 분당서울대병원 채용 페이지
  const browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' })
  const page = await browser.newPage()
  const jobs: Omit<JobPosting, 'licenseCategory'>[] = []

  try {
    await page.goto('https://www.snubh.org/intro/recruit.do', { waitUntil: 'networkidle', timeout: 30000 })

    const items = await page.$$eval('table tbody tr, .board_list tr', rows =>
      rows.map(row => {
        const titleEl = row.querySelector('td.subject a, .title a, a')
        const title = titleEl?.textContent?.trim() ?? ''
        const href = titleEl?.getAttribute('href') ?? ''
        const deadline = row.querySelector('.date, td:last-child')?.textContent?.trim() ?? ''
        return { title, href, deadline }
      })
    )

    for (const item of items) {
      if (!item.title || item.title.length < 3) continue
      const url = item.href.startsWith('http')
        ? item.href
        : `https://www.snubh.org${item.href}`
      const originalId = item.href.replace(/[^a-zA-Z0-9]/g, '') || String(Date.now())

      jobs.push({
        id: `direct:snubh:${originalId}`,
        source: 'direct',
        originalId,
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        title: item.title,
        deadline: item.deadline || undefined,
        url,
        scrapedAt: new Date().toISOString(),
      })
    }
  } catch (err) {
    console.warn(`[직접크롤] 분당서울대병원 오류:`, (err as Error).message)
  } finally {
    await browser.close()
  }

  return jobs
}

const CRAWLERS: Record<string, (h: Hospital) => Promise<Omit<JobPosting, 'licenseCategory'>[]>> = {
  'seoul-national': crawlSnuh,
  'asan-medical': crawlAsan,
  'bundang-snuh': crawlBundangSnuh,
}

export async function crawlHospital(hospital: Hospital): Promise<CrawlResult> {
  const crawlerFn = CRAWLERS[hospital.id]
  if (!crawlerFn) {
    return { hospitalId: hospital.id, source: 'direct', jobs: [] }
  }

  try {
    const rawJobs = await crawlerFn(hospital)
    const classified = rawJobs.map(j => classify(j))
    return { hospitalId: hospital.id, source: 'direct', jobs: classified }
  } catch (err) {
    return {
      hospitalId: hospital.id,
      source: 'direct',
      jobs: [],
      error: (err as Error).message,
    }
  }
}

export function isSupportedHospital(hospitalId: string): boolean {
  return SUPPORTED_HOSPITAL_IDS.has(hospitalId)
}

export async function crawlAll(hospitals: Hospital[]): Promise<CrawlResult[]> {
  const supported = hospitals.filter(h => isSupportedHospital(h.id))
  const results: CrawlResult[] = []

  for (const hospital of supported) {
    const result = await crawlHospital(hospital)
    results.push(result)
    console.log(`[직접크롤] ${hospital.name}: ${result.jobs.length}건`)
    await new Promise(r => setTimeout(r, 2000))
  }

  return results
}
