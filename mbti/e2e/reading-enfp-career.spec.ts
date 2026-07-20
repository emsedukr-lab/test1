import { expect, test } from "@playwright/test";
import { runReadingFlow } from "./helpers";

test("ENFP · 커리어 · 세 장 리딩 → 결과 확인 → 저장", async ({ page }) => {
  await runReadingFlow(page, {
    mbti: "ENFP",
    topicName: "이직과 진로",
    spreadName: "세 장 리딩",
    cardCount: 3,
    question: "지금 준비하는 이직을 계속 밀고 가도 될까요?",
  });

  // 결과 구성 요소 확인
  await expect(page.getByRole("heading", { name: /ENFP를 위한/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "핵심 메시지" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "카드별 해석" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "이번 주에 해볼 수 있는 것" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "스스로에게 물어보세요" })).toBeVisible();
  await expect(page.getByText("ENFP 성향으로 본 이번 리딩")).toBeVisible();

  // 카드 섹션 3개
  await expect(page.locator("article")).toHaveCount(3);

  // 저장
  await page.getByRole("button", { name: "기록에 저장" }).click();
  await expect(page.getByText("기록에 저장했습니다.")).toBeVisible();
  await expect(page.getByRole("button", { name: "저장됨" })).toBeDisabled();
});
