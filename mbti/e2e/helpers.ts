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

/**
 * 부채꼴에서 카드 n장 선택.
 * 카드가 서로 겹쳐 중심점이 가려지므로 프로그램적 click으로 정확한 카드를 지정한다
 * (사람은 hover 팝업/탭한 지점의 최상단 카드로 선택 — 뒷면이라 어느 카드든 무방).
 */
export async function pickCard(page: Page, deckIndex: number) {
  await page.getByTestId(`card-${deckIndex}`).evaluate((el) => (el as HTMLButtonElement).click());
}

export async function pickCards(page: Page, count: number, startIndex = 0) {
  for (let i = 0; i < count; i++) {
    await pickCard(page, startIndex + i * 3);
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
