import { expect, test } from "@playwright/test";
import { dismissConsent, pickCards } from "./helpers";

test("선택 리딩 — 카드 무게(기울기)와 유형 브리핑이 표시된다", async ({ page }) => {
  await page.goto("/reading/mbti");
  await dismissConsent(page);
  await page.getByRole("button", { name: /^INTJ/ }).click();

  await page.getByRole("button", { name: /선택과 결정/ }).first().click();
  await page.getByRole("button", { name: /다음 — 리딩 방식 선택/ }).click();
  await page.getByRole("button", { name: /선택 리딩/ }).click();
  await page.getByRole("button", { name: /다음 — 카드 뽑기/ }).click();

  await pickCards(page, 6);
  await page.getByRole("button", { name: "카드 공개하기" }).click();
  await page.getByRole("button", { name: "모두 공개" }).click();
  await page.getByRole("button", { name: "해석 보기" }).click();

  // 히어로: 한 줄 대답 + 기울기 게이지
  await expect(page.getByRole("heading", { name: "핵심 메시지" })).toBeVisible();
  await expect(page.getByText(/카드|배열/).first()).toBeVisible();
  await expect(page.getByText("선택 A", { exact: true })).toBeVisible();
  await expect(page.getByText("선택 B", { exact: true })).toBeVisible();

  // 유형 브리핑 + 카드마다 MBTI 시선
  await expect(page.getByText(/INTJ 유형 브리핑/)).toBeVisible();
  await expect(page.getByText("이번 배열에서 특히 볼 카드")).toBeVisible();
  await expect(page.getByText("INTJ의 시선").first()).toBeVisible();
  await expect(page.getByText("INTJ의 시선")).toHaveCount(6);

  // 지금 할 일 한 가지
  await expect(page.getByText("지금 할 일 한 가지")).toBeVisible();
});
