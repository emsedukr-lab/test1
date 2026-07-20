import { expect, type Page } from "@playwright/test";

/** 하단 고정 동의 배너가 CTA를 가리지 않도록 먼저 닫는다 */
export async function dismissConsent(page: Page) {
  const deny = page.getByRole("button", { name: "거부", exact: true });
  try {
    await deny.click({ timeout: 3000 });
  } catch {
    // 이미 결정된 세션이면 배너가 없다
  }
}

/** 카드 그리드에서 앞에서부터 n장 클릭 */
export async function pickCards(page: Page, count: number, startIndex = 0) {
  for (let i = 0; i < count; i++) {
    await page.getByTestId(`card-${startIndex + i * 3}`).click();
  }
}

/** MBTI 선택 → 분야 → 스프레드 → 카드 선택 → 공개까지 진행 */
export async function runReadingFlow(
  page: Page,
  options: {
    mbti: string | null;
    topicName: string;
    spreadName: string;
    cardCount: number;
    question?: string;
  },
) {
  await page.goto("/reading/mbti");
  await dismissConsent(page);

  if (options.mbti) {
    await page.getByRole("button", { name: new RegExp(`^${options.mbti}`) }).click();
  } else {
    await page.getByRole("button", { name: "MBTI 없이 시작하기" }).click();
  }

  await expect(page).toHaveURL(/\/reading\/topic/);
  await page.getByRole("button", { name: new RegExp(options.topicName) }).first().click();
  if (options.question) {
    await page.getByRole("textbox").fill(options.question);
  }
  await page.getByRole("button", { name: /다음 — 리딩 방식 선택/ }).click();

  await expect(page).toHaveURL(/\/reading\/spread/);
  await page.getByRole("button", { name: new RegExp(options.spreadName) }).click();
  await page.getByRole("button", { name: /다음 — 카드 뽑기/ }).click();

  await expect(page).toHaveURL(/\/reading\/cards/);
  await pickCards(page, options.cardCount);
  await page.getByRole("button", { name: "카드 공개하기" }).click();

  await expect(page).toHaveURL(/\/reading\/reveal/);
  await page.getByRole("button", { name: "모두 공개" }).click();
  await page.getByRole("button", { name: "해석 보기" }).click();

  await expect(page).toHaveURL(/\/reading\/result/);
}
