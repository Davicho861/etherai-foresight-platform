import { Page } from '@playwright/test';

export async function waitForAppReady(page: Page, options: { timeout?: number } = {}) {
  const timeout = options.timeout ?? 60000;
  // Wait for the explicit app ready signal
  await page.waitForSelector('body[data-app-ready="true"]', { timeout });
}

export async function safeLocatorTextOrTestId(page: Page, testId: string, text: string) {
  const byTestId = page.locator(`[data-testid="${testId}"]`);
  if (await byTestId.count() > 0) return byTestId;
  const byText = page.locator(`text=${text}`);
  if (await byText.count() > 0) return byText;
  // fallback to an empty locator (will fail later with clearer message)
  return page.locator(`[data-testid="${testId}"]`);
}
