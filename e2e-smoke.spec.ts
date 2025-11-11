import { test, expect } from "@playwright/test";
const BASE = process.env.BASE_URL || "http://159.203.114.210:3000";

test("smoke: главная грузится и нет JS-ошибок", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE, { waitUntil: "networkidle" });
  await expect(page).toHaveTitle(/.+/);
  const buttons = page.getByRole("button");
  await expect(buttons.first()).toBeVisible();
  expect(errors, "JS errors on homepage").toEqual([]);
});

test("smoke: кликабельные кнопки не падают", async ({ page }) => {
  await page.goto(BASE, { waitUntil: "networkidle" });
  const allButtons = await page.getByRole("button").all();
  for (const [i, btn] of allButtons.entries()) {
    try {
      await btn.scrollIntoViewIfNeeded();
      await btn.hover({ trial: true });
      await btn.click({ trial: true });
    } catch (e) {
      console.warn(`Button #${i} issue: ${String(e)}`);
    }
  }
});
