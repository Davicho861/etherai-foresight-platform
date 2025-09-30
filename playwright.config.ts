import { defineConfig } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM __dirname shim
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure Playwright can start the full stack for local E2E runs and wait until the dashboard is reachable.
export default defineConfig({
  testDir: './playwright',
  timeout: 120_000,
  use: {
    headless: true,
    baseURL: process.env.FRONTEND_URL || 'http://localhost:3002',
    // We prefer not to ignore HTTP(S) errors for strictness once external TLS assets are removed
    ignoreHTTPSErrors: false,
    // Increase navigation timeout for slower CI machines
    actionTimeout: 60_000,
    navigationTimeout: 60_000,
  },
  // Intentionally not using webServer here: we will start dev servers manually in CI/local
  // to keep deterministic control over ports and startup sequence.
});
