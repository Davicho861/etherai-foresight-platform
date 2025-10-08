import { Page } from '@playwright/test';

export async function waitForAppReady(page: Page, options: { timeout?: number } = {}) {
  const timeout = options.timeout ?? 20000;
  // Wait for either the eventSourceReady flag or a main visible root container
  try {
    await page.waitForFunction(() => (window as any).eventSourceReady === true, { timeout: timeout / 2 });
    return;
  } catch {
    // fallback: wait for a main container or header that indicates UI is rendered
  }

  const candidates = [
    '[data-testid="dashboard-container"]',
    'h1:has-text("Centro de Mando Praevisio AI")',
    '[data-testid="pricing-table"]',
    'body',
  ];

  for (const sel of candidates) {
    try {
      await page.waitForSelector(sel, { timeout });
      return;
    } catch {
      // try next
    }
  }

  // last resort: ensure the page finished navigation
  await page.waitForLoadState('networkidle', { timeout });
}

export async function safeLocatorTextOrTestId(page: Page, testId: string, text: string) {
  const byTestId = page.locator(`[data-testid="${testId}"]`);
  if (await byTestId.count() > 0) return byTestId;
  const byText = page.locator(`text=${text}`);
  if (await byText.count() > 0) return byText;
  // fallback to an empty locator (will fail later with clearer message)
  return page.locator(`[data-testid="${testId}"]`);
}
