# hospital-job-crawler

대한민국 상급종합병원 45개의 채용공고를 자동으로 수집하고, 면허 및 자격 기준으로 분류한 뒤 Google Sheets로 업로드하는 TypeScript 기반 크롤러 프로젝트입니다.

## 주요 기능

- 대한민국 상급종합병원 45개 채용공고 자동 수집
- 채용공고별 면허 및 자격 분류
- Google Sheets 자동 업로드
- 정기 실행을 위한 크론 스케줄링 지원

## 설치

```bash
npm install
npx playwright install chromium
```

## 설정

`.env.example`을 `.env`로 복사한 뒤 Google Sheets 서비스 계정 정보를 입력합니다.

```bash
cp .env.example .env
```

필수 환경 변수:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SPREADSHEET_ID`
- `CRAWL_INTERVAL_CRON`
- `HEADLESS`

## Google Sheets 서비스 계정 발급 방법

1. GCP 프로젝트 생성
   - Google Cloud Console에서 새 프로젝트를 만들고 Google Sheets API 및 Google Drive API를 활성화합니다.
2. 서비스 계정 생성
   - IAM 및 관리자 메뉴에서 서비스 계정을 생성하고 JSON 키를 발급받아 이메일과 개인 키 값을 `.env`에 입력합니다.
3. 스프레드시트 공유
   - 업로드 대상 Google Sheets 문서를 생성한 뒤 서비스 계정 이메일을 편집자로 공유합니다.

## 실행

한 번만 수집하려면 아래 명령을 사용합니다.

```bash
npm run crawl
```

매일 새벽 3시에 자동 실행하려면 아래 명령을 사용합니다.

```bash
npm start
```

기본 크론 설정은 `.env`의 `CRAWL_INTERVAL_CRON="0 3 * * *"`입니다.

## 수집 항목

- 병원명
- 면허구분
- 채용제목
- 고용형태
- 마감일
- 출처
- 링크
