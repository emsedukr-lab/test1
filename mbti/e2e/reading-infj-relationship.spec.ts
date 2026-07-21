import { expect, test } from "@playwright/test";
import { dismissConsent, pickCard, pickCards } from "./helpers";

test("INFJ · 관계 리딩 5장 · 새로고침 복구 · 공유 링크에 질문 미포함", async ({
  page,
  context,
}) => {
  const question = "이 관계에서 확인해야 할 것은 무엇일까요?";

  await page.goto("/reading/mbti");
  await dismissConsent(page);
  await page.getByRole("button", { name: /^INFJ/ }).click();

  // 질문 입력 (300자 제한 확인 포함)
  await page.getByRole("button", { name: /^연애/ }).first().click();
  const textarea = page.getByRole("textbox");
  await textarea.fill("가".repeat(400));
  await expect(textarea).toHaveValue("가".repeat(300)); // maxLength로 잘림
  await textarea.fill(question);
  await page.getByRole("button", { name: /다음 — 리딩 방식 선택/ }).click();

  await page.getByRole("button", { name: /관계 리딩/ }).click();
  await page.getByRole("button", { name: /다음 — 카드 뽑기/ }).click();

  // 카드 2장 선택 후 새로고침 → 선택 상태 복구 확인
  await pickCards(page, 2);
  await expect(page.getByText("5장 중 2장 선택", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page).toHaveURL(/\/reading\/cards/);
  await expect(page.getByText("5장 중 2장 선택", { exact: true })).toBeVisible();

  // 나머지 3장 선택 (이미 선택된 인덱스 0,3 회피를 위해 시작점 이동)
  await pickCard(page, 20);
  await pickCard(page, 21);
  await pickCard(page, 22);
  await page.getByRole("button", { name: "카드 공개하기" }).click();

  await page.getByRole("button", { name: "모두 공개" }).click();
  await page.getByRole("button", { name: "해석 보기" }).click();

  // 결과에 질문 원문 표시
  await expect(page.getByText(`내 질문: ${question}`)).toBeVisible();

  // 공유 URL에 질문 미포함
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: "결과 공유" }).click();
  await expect(page.getByText(/링크를 복사했습니다|공유했습니다/)).toBeVisible();
  const sharedUrl: string = await page.evaluate(() => navigator.clipboard.readText());
  expect(sharedUrl).toContain("/r?d=");
  const payload = decodeURIComponent(sharedUrl.split("d=")[1]);
  const decoded = Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(
    "utf8",
  );
  expect(decoded).not.toContain(question);
  expect(decoded).toContain("INFJ");

  // 공유 페이지에서 결과 렌더 + 질문 미표시
  await page.goto(sharedUrl);
  await expect(page.getByRole("heading", { name: /INFJ를 위한.*공유됨/ })).toBeVisible();
  await expect(page.getByText("내 질문:")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "카드별 해석" })).toBeVisible();
});
