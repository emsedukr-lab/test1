import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import type { JobPosting } from '../types'

const DB_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DB_DIR, 'jobs.db')

function getDb(): Database.Database {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true })
  const db = new Database(DB_PATH)
  db.exec(`
    CREATE TABLE IF NOT EXISTS seen_jobs (
      id TEXT PRIMARY KEY,
      hospital_id TEXT NOT NULL,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      scraped_at TEXT NOT NULL,
      uploaded_at TEXT
    )
  `)
  return db
}

/** 아직 수집되지 않은 공고만 필터링합니다. */
export function filterNewJobs(jobs: JobPosting[]): JobPosting[] {
  const db = getDb()
  const stmt = db.prepare('SELECT id FROM seen_jobs WHERE id = ?')
  const newJobs = jobs.filter(job => !stmt.get(job.id))
  db.close()
  return newJobs
}

/** 공고를 수집 완료로 표시합니다. */
export function markAsSeen(jobs: JobPosting[]): void {
  const db = getDb()
  const stmt = db.prepare(
    'INSERT OR IGNORE INTO seen_jobs (id, hospital_id, title, url, scraped_at) VALUES (?, ?, ?, ?, ?)'
  )
  const insertMany = db.transaction((list: JobPosting[]) => {
    for (const job of list) stmt.run(job.id, job.hospitalId, job.title, job.url, job.scrapedAt)
  })
  insertMany(jobs)
  db.close()
}

/** 업로드 완료 시간을 기록합니다. */
export function markAsUploaded(jobIds: string[]): void {
  const db = getDb()
  const stmt = db.prepare('UPDATE seen_jobs SET uploaded_at = ? WHERE id = ?')
  const now = new Date().toISOString()
  const update = db.transaction((ids: string[]) => {
    for (const id of ids) stmt.run(now, id)
  })
  update(jobIds)
  db.close()
}

/** 수집 통계를 반환합니다. */
export function getStats(): { total: number; uploaded: number; pending: number } {
  const db = getDb()
  const total = (db.prepare('SELECT COUNT(*) as count FROM seen_jobs').get() as { count: number }).count
  const uploaded = (db.prepare('SELECT COUNT(*) as count FROM seen_jobs WHERE uploaded_at IS NOT NULL').get() as { count: number }).count
  db.close()
  return { total, uploaded, pending: total - uploaded }
}
