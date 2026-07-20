import { expect, test } from "@playwright/test";
import { dismissConsent, pickCards } from "./helpers";

test("역방향 포함 리딩 — 토글 후 플로우 완주", async ({ page }) => {
  await page.goto("/reading/mbti");
  await dismissConsent(page);
  await page.getByRole("button", { name: /^INTJ/ }).click();

  await page.getByRole("button", { name: /선택과 결정/ }).first().click();
  await page.getByRole("button", { name: /다음 — 리딩 방식 선택/ }).click();

  await page.getByRole("button", { name: /세 장 리딩/ }).click();
  // 역방향 토글 켜기
  const toggle = page.getByRole("checkbox");
  await toggle.check();
  await expect(toggle).toBeChecked();
  await page.getByRole("button", { name: /다음 — 카드 뽑기/ }).click();

  await pickCards(page, 3);
  await page.getByRole("button", { name: "카드 공개하기" }).click();
  await page.getByRole("button", { name: "모두 공개" }).click();
  await page.getByRole("button", { name: "해석 보기" }).click();

  // 결과 정상 생성 (역방향 여부는 확률적이므로 렌더만 확인)
  await expect(page.getByRole("heading", { name: "핵심 메시지" })).toBeVisible();
  await expect(page.locator("article")).toHaveCount(3);

  // 저장·재열람에도 역방향 정보가 보존되는지 (오류 없이 열리는지)
  await page.getByRole("button", { name: "기록에 저장" }).click();
  await page.goto("/history");
  await page.getByText(/INTJ · 선택과 결정/).click();
  await expect(page.getByRole("heading", { name: "핵심 메시지" })).toBeVisible();
});
