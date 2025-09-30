import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  timeout: 30_000,
  use: {
    headless: false,
    baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
    ignoreHTTPSErrors: true,
  },
  // In CI we start the frontend via docker-compose, so we don't use Playwright webServer here.
});
