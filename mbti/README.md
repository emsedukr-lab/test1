# MBTI 타로

> MBTI 성격유형을 선택하고 78장 타로카드를 직접 뽑으면, 규칙 기반 해석 엔진이 성향에 맞춘 해석과 실행 가능한 행동 조언을 제공하는 무료 웹서비스입니다.

서비스명은 임시입니다. 확정 시 [`src/lib/site.ts`](src/lib/site.ts) 한 파일만 수정하면 전체에 반영됩니다.

## 주요 특징

- **78장 전체 카드 + MBTI 16유형 프로필** — 메이저·마이너 아르카나 전 카드와 16개 성격유형별 해석 프로필을 제공합니다.
- **시드 기반 결정론 해석 엔진** — 같은 입력이면 항상 같은 결과가 나옵니다. 생성형 AI API를 사용하지 않아 비용·지연·비결정성이 없습니다.
- **질문·기록 서버 미저장** — 사용자의 질문과 리딩 기록은 서버로 전송되지 않고 localStorage/sessionStorage에만 보관됩니다.
- **공유 링크에서 질문 원문 구조적 제외** — 공유 URL에는 질문 원문이 포함될 수 없도록 설계되어 있습니다.
- **접근성** — 카드 선택을 포함한 전 과정을 키보드만으로 조작할 수 있고, 스크린리더를 지원합니다.
- **퍼블릭 도메인 카드 이미지** — 라이더-웨이트 1909년판(Wikimedia Commons) 이미지를 사용합니다.

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router), React 19 |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| 상태 관리 | Zustand 5 |
| 단위 테스트 | Vitest + Testing Library |
| E2E 테스트 | Playwright |

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

프로덕션 빌드:

```bash
npm run build && npm run start
```

`build` 실행 시 `prebuild` 훅으로 `validate:data`가 자동 실행되어, 카드·정적 데이터가 콘텐츠 규칙을 위반하면 빌드가 실패합니다.

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 (`prebuild`로 데이터 검증 선행) |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run typecheck` | TypeScript 타입 검사 (`tsc --noEmit`) |
| `npm run test` | Vitest 단위 테스트 실행 (`test:watch`로 감시 모드) |
| `npm run e2e` | Playwright E2E 테스트 실행 |
| `npm run validate:cards` | 78장 카드 데이터 규칙 검증 |
| `npm run validate:data` | 카드 + 정적 콘텐츠 전체 검증 |
| `npm run format` | Prettier 포맷팅 (`format:check`로 검사만) |

## 프로젝트 구조

```
src/
  data/            카드 78장, MBTI 16유형 프로필, 해석 템플릿, 스프레드·토픽·가이드
  lib/
    reading-engine/  시드 기반 결정론 해석 엔진
    site.ts          서비스명 등 브랜딩 상수 (이름 변경 시 이 파일만 수정)
    share.ts         공유 링크 생성 (질문 원문 제외)
    storage.ts       localStorage/sessionStorage 래퍼
  app/             Next.js App Router 라우트 (reading, cards, mbti, guides, r(공유) 등)
  stores/          Zustand 스토어
  components/      UI 컴포넌트
scripts/           데이터 검증 스크립트, 카드 이미지 다운로드 스크립트
e2e/               Playwright E2E 테스트
docs/              콘텐츠 스타일 가이드 등 문서
```

## 콘텐츠 규칙

카드 해석 문구는 [`docs/content-style-guide.md`](docs/content-style-guide.md)를 반드시 따릅니다. 핵심 원칙:

- 독자를 단정하지 않고 가능성으로 말합니다. "반드시", "확실합니다", "헤어집니다" 같은 미래 확정·공포 조장 표현은 금지됩니다.
- 부정적 카드(죽음, 타워 등)도 공포가 아닌 변화·직면·회복의 관점으로 씁니다.
- 이 규칙들은 `npm run validate:data`가 검사하며, `prebuild`로 강제되므로 위반 시 빌드가 실패합니다.

## 환경 변수

[`.env.example`](.env.example)을 참고해 `.env.local`을 작성합니다.

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 사이트 기본 URL (SEO metadataBase, sitemap). 미설정 시 `http://localhost:3000` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense 클라이언트 ID. 미설정 시 광고 미로드, 예약 높이만 유지 |

## 면책

이 서비스는 오락과 자기성찰을 위한 것으로, 의료·법률·투자 등 전문적 판단을 대체하지 않습니다.
