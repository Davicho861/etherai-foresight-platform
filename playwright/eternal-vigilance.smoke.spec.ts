import { test, expect } from '@playwright/test';
import { waitForAppReady } from './test-utils';

// Smoke test: token -> SSE -> emit -> report
test('eternal vigilance end-to-end smoke', async ({ page, request }) => {
  const backend = process.env.BACKEND_URL || 'http://localhost:4000';

  // Request a short-lived SSE token (server will set cookie)
  const tokenResp = await request.post(`${backend}/api/eternal-vigilance/token`, { headers: { 'Authorization': 'Bearer demo-token' } });
  expect(tokenResp.ok()).toBeTruthy();
  const tokenJson = await tokenResp.json();
  expect(tokenJson.token).toBeTruthy();
  // set cookie in the browser context so EventSource on the page will send it to the backend
  await page.context().addCookies([{
    name: 'praevisio_sse_token',
    value: tokenJson.token,
    domain: 'localhost',
    path: '/',
    httpOnly: false,
    secure: false,
  }]);

  // Ensure the page's EventSource uses the backend host directly (bypass dev server proxy)
  await page.addInitScript((backendUrl: string) => {
    // @ts-ignore
    const OriginalEventSource = window.EventSource;
    // @ts-ignore
    window.EventSource = function (url: string | URL, config?: any) {
      try {
        let u = typeof url === 'string' ? url : String(url);
        if (u.startsWith('/api/')) {
          u = backendUrl + u;
        }
        // @ts-ignore
        return new OriginalEventSource(u, config);
      } catch (e) {
        console.error(e);
        // fallback
        // @ts-ignore
        return new OriginalEventSource(url as any, config);
      }
    } as any;
  }, backend);

  // Go to the page and wait for the app to be ready (SSE or main UI)
  await page.goto('/metatron-panel');
  await page.waitForSelector('body[data-app-ready="true"]', { timeout: 60000 });

  // Emit a test event
  const emitResp = await request.post(`${backend}/api/eternal-vigilance/emit`, {
    headers: { 'Authorization': 'Bearer demo-token' },
    data: {
      message: `E2E test event ${Date.now()}`,
    },
  });
  expect(emitResp.ok()).toBeTruthy();

  // Wait for the feed to show the emitted event
  await page.waitForSelector(`text=E2E test event`, { timeout: 5000 });

  // Request report from server and assert it contains the event
  const reportResp = await request.post(`${backend}/api/eternal-vigilance/report`);
  expect(reportResp.ok()).toBeTruthy();
  const reportText = await reportResp.text();
  expect(reportText).toContain('E2E test event');
});
