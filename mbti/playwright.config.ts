import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  webServer: {
    command: "npm run build && npm run start",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: {
      // 광고 슬롯 렌더 경로 검증용 — 동의 전에는 스크립트가 로드되지 않는다
      NEXT_PUBLIC_ADSENSE_CLIENT: "ca-pub-0000000000000000",
    },
  },
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
