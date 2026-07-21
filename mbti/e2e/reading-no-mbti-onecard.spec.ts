import { expect, test } from "@playwright/test";
import { dismissConsent } from "./helpers";

test("MBTI 미선택 · 오늘의 메시지 · 한 장 리딩 — 키보드 조작", async ({ page }) => {
  await page.goto("/reading/mbti");
  await dismissConsent(page);
  await page.getByRole("button", { name: "MBTI 없이 시작하기" }).click();

  await page.getByRole("button", { name: /오늘의 메시지/ }).click();
  await page.getByRole("button", { name: /다음 — 리딩 방식 선택/ }).click();
  await page.getByRole("button", { name: /한 장 리딩/ }).click();
  await page.getByRole("button", { name: /다음 — 카드 뽑기/ }).click();

  // 키보드로 카드 선택: 그리드 포커스 → 화살표 이동 → Enter
  await page.getByTestId("card-0").focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.getByText("1장 중 1장 선택 — 준비 완료!", { exact: true })).toBeVisible();

  // 스크린리더 안내 확인
  await expect(page.getByRole("status").filter({ hasText: "1장 중 1장 선택됨" })).toHaveCount(1);

  await page.getByRole("button", { name: "카드 공개하기" }).click();
  await page.getByRole("button", { name: "모두 공개" }).click();
  await page.getByRole("button", { name: "해석 보기" }).click();

  // MBTI 미선택 — 유형 브리핑·시선 블록 없이 일반 해석
  await expect(page.getByRole("heading", { name: "핵심 메시지" })).toBeVisible();
  await expect(page.getByText(/유형 브리핑/)).toHaveCount(0);
  await expect(page.getByText(/의 시선/)).toHaveCount(0);
  await expect(page.locator("article")).toHaveCount(1);
});
