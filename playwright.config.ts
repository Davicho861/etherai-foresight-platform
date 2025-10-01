import { defineConfig } from '@playwright/test';

// Ensure Playwright can start the full stack for local E2E runs and wait until the dashboard is reachable.
export default defineConfig({
  testDir: './playwright',
  timeout: 120_000,
  retries: 2,
  // Run tests deterministically in CI: single worker to avoid service contention
  workers: 1,
  use: {
    headless: true,
    // Deterministic baseURL: the frontend container exposes port 3002 on localhost
    baseURL: process.env.FRONTEND_URL || 'http://localhost:3002',
    // We prefer not to ignore HTTP(S) errors for strictness once external TLS assets are removed
    ignoreHTTPSErrors: false,
    // Increase navigation timeout for slower CI machines
    actionTimeout: 120_000,
    navigationTimeout: 120_000,
  },
  // Intentionally not using webServer here: we will start dev servers manually in CI/local
  // to keep deterministic control over ports and startup sequence.
});
