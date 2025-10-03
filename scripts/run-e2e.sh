#!/usr/bin/env bash
set -euo pipefail

# Install project deps into the mounted workspace (node_modules is a named volume)
if [ ! -d /app/node_modules ] || [ -z "$(ls -A /app/node_modules 2>/dev/null)" ]; then
  echo "Installing e2e deps in container..."
  npm ci --no-audit --no-fund --prefer-offline
fi

# Ensure playwright packages are available locally (in case lockfile out-of-sync)
npm install --no-audit --no-fund @playwright/test playwright --prefer-offline --no-save || true

# Install browsers and run tests
# Make sure local .bin is on PATH so `npx` and direct calls resolve correctly
export PATH="/app/node_modules/.bin:$PATH"

echo "DEBUG: node: $(which node || true)"
echo "DEBUG: npm: $(which npm || true)"
echo "DEBUG: PATH=$PATH"
echo "DEBUG: ls node_modules/.bin (first 30):"
ls -1 node_modules/.bin | head -n 30 || true

if [ -f ./node_modules/playwright-core/cli.js ]; then
  echo "Using node_modules/playwright-core/cli.js"
  node ./node_modules/playwright-core/cli.js install --with-deps
  node ./node_modules/playwright-core/cli.js test --config=playwright.config.ts --reporter=list
elif [ -x ./node_modules/.bin/playwright ]; then
  echo "Using local playwright binary"
  ./node_modules/.bin/playwright install --with-deps
  ./node_modules/.bin/playwright test --config=playwright.config.ts --reporter=list
else
  echo "Local playwright binary not found, trying npx"
  npx playwright install --with-deps
  npx playwright test --config=playwright.config.ts --reporter=list
fi
