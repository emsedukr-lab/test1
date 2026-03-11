import 'dotenv/config'
import { HOSPITALS } from './config/hospitals'
import { crawlAll as crawlSaramin } from './crawlers/saramin'
import { crawlAll as crawlJobkorea } from './crawlers/jobkorea'
import { crawlAll as crawlDirect } from './crawlers/direct'
import { filterNewJobs, markAsSeen, markAsUploaded, getStats } from './storage/db'
import { uploadToSheets } from './storage/sheets'
import type { JobPosting } from './types'

export async function runCrawl(): Promise<void> {
  console.log(`\n[크롤러] 시작: ${new Date().toLocaleString('ko-KR')}`)
  console.log(`[크롤러] 대상 병원: ${HOSPITALS.length}개`)

  const allJobs: JobPosting[] = []

  // 1. 사람인 크롤링
  console.log('\n[1/3] 사람인 크롤링 시작...')
  try {
    const results = await crawlSaramin(HOSPITALS)
    const jobs = results.flatMap(r => r.jobs)
    allJobs.push(...jobs)
    console.log(`[사람인] 총 ${jobs.length}건 수집`)
  } catch (err) {
    console.error('[사람인] 크롤링 실패:', err)
  }

  // 2. 잡코리아 크롤링
  console.log('\n[2/3] 잡코리아 크롤링 시작...')
  try {
    const results = await crawlJobkorea(HOSPITALS)
    const jobs = results.flatMap(r => r.jobs)
    allJobs.push(...jobs)
    console.log(`[잡코리아] 총 ${jobs.length}건 수집`)
  } catch (err) {
    console.error('[잡코리아] 크롤링 실패:', err)
  }

  // 3. 직접 크롤링 (상위 3개 병원)
  console.log('\n[3/3] 주요 병원 직접 크롤링...')
  try {
    const results = await crawlDirect(HOSPITALS)
    const jobs = results.flatMap(r => r.jobs)
    allJobs.push(...jobs)
    console.log(`[직접크롤] 총 ${jobs.length}건 수집`)
  } catch (err) {
    console.error('[직접크롤] 크롤링 실패:', err)
  }

  console.log(`\n[크롤러] 전체 수집: ${allJobs.length}건`)

  // 중복 제거 (같은 id)
  const seen = new Set<string>()
  const unique = allJobs.filter(j => {
    if (seen.has(j.id)) return false
    seen.add(j.id)
    return true
  })

  // 신규 공고만 필터링
  const newJobs = filterNewJobs(unique)
  console.log(`[크롤러] 신규 공고: ${newJobs.length}건 (중복 제외 ${unique.length - newJobs.length}건)`)

  if (newJobs.length === 0) {
    console.log('[크롤러] 신규 공고 없음. 완료.')
    return
  }

  // DB에 기록
  markAsSeen(newJobs)

  // Google Sheets 업로드
  console.log('\n[Sheets] 업로드 시작...')
  try {
    await uploadToSheets(newJobs)
    markAsUploaded(newJobs.map(j => j.id))
  } catch (err) {
    console.error('[Sheets] 업로드 실패:', err)
  }

  const stats = getStats()
  console.log(`\n[완료] 누적: ${stats.total}건 (업로드됨: ${stats.uploaded}건, 대기: ${stats.pending}건)`)
  console.log(`[완료] ${new Date().toLocaleString('ko-KR')}`)
}
