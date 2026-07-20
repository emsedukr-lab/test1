import { expect, test } from "@playwright/test";
import { runReadingFlow } from "./helpers";

test("리딩 저장 → 새로고침 후 기록 복구 → 삭제", async ({ page }) => {
  await runReadingFlow(page, {
    mbti: "ISTJ",
    topicName: "감정과 자기이해",
    spreadName: "세 장 리딩",
    cardCount: 3,
  });

  await page.getByRole("button", { name: "기록에 저장" }).click();
  await expect(page.getByText("기록에 저장했습니다.")).toBeVisible();

  // 기록 페이지에서 확인
  await page.goto("/history");
  await expect(page.getByText(/ISTJ · 감정과 자기이해 · 세 장 리딩/)).toBeVisible();

  // 새로고침 후에도 존재 (localStorage)
  await page.reload();
  await expect(page.getByText(/ISTJ · 감정과 자기이해 · 세 장 리딩/)).toBeVisible();

  // 항목 열어 결과 재구성 확인
  await page.getByText(/ISTJ · 감정과 자기이해/).click();
  await expect(page.getByRole("heading", { name: "핵심 메시지" })).toBeVisible();

  // 삭제 → 빈 상태 → 새로고침 후에도 빈 상태
  await page.getByRole("button", { name: "이 기록 삭제" }).click();
  await expect(page.getByText("저장된 리딩이 아직 없습니다.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("저장된 리딩이 아직 없습니다.")).toBeVisible();
});

test("카드 선택·공개 화면에는 광고 슬롯이 없다", async ({ page }) => {
  await runReadingFlow(page, {
    mbti: null,
    topicName: "오늘의 메시지",
    spreadName: "한 장 리딩",
    cardCount: 1,
  });

  // 결과 페이지의 광고 슬롯은 AdSense ID가 빌드에 주입된 경우에만 렌더된다
  // (npm run e2e로 실행하면 webServer가 테스트용 ID로 빌드함 — 서버 재사용 시에는 없을 수 있음)
  const resultSlots = await page.locator("[data-ad-slot]").count();
  if (resultSlots === 0) {
    console.warn("광고 ID 없는 빌드 — 결과 페이지 슬롯 존재 검증은 건너뜀");
  }

  // 핵심 불변식: 카드 선택·공개 화면에는 어떤 빌드에서도 광고 슬롯이 없다
  await page.goto("/reading/cards");
  await expect(page.locator("[data-ad-slot]")).toHaveCount(0);
  await page.goto("/reading/reveal");
  await expect(page.locator("[data-ad-slot]")).toHaveCount(0);
});
