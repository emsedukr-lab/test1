import 'dotenv/config'
import cron from 'node-cron'
import { runCrawl } from './runner'

const args = process.argv.slice(2)
const isOnce = args.includes('--once')

const CRON_SCHEDULE = process.env.CRAWL_INTERVAL_CRON ?? '0 3 * * *'

if (isOnce) {
  // 1회 실행 모드
  console.log('[모드] 1회 실행')
  runCrawl()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('[오류]', err)
      process.exit(1)
    })
} else {
  // 스케줄러 모드
  console.log(`[모드] 스케줄러 시작 (${CRON_SCHEDULE})`)
  console.log('[안내] 매일 새벽 3시에 자동으로 크롤링합니다.')
  console.log('[안내] 종료하려면 Ctrl+C를 누르세요.\n')

  // 시작 시 즉시 1회 실행
  runCrawl().catch(console.error)

  // cron 스케줄 등록
  cron.schedule(CRON_SCHEDULE, () => {
    console.log('\n[cron] 스케줄 실행 시작')
    runCrawl().catch(console.error)
  }, {
    timezone: 'Asia/Seoul',
  })
}
