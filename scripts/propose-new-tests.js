#!/usr/bin/env node
// Hefesto: analyze git diff (passed as args) and propose new test skeletons via LLM (demo)
import fs from 'fs';
import path from 'path';

const diffs = process.argv.slice(2);
console.log('[Hefesto] Proposing new tests for diffs:', diffs);

for (const d of diffs) {
  const name = path.basename(d).replace(/\W+/g, '-').replace(/^-|-$/g, '');
  const testPath = path.resolve(`playwright/${name}.spec.ts`);
  if (fs.existsSync(testPath)) {
    console.log('[Hefesto] Test already exists:', testPath);
    continue;
  }
  const content = `import { test, expect } from '@playwright/test';\n\n// Auto-generated skeleton by Hefesto for changed file: ${d}\ntest('auto-generated skeleton for ${name}', async ({ page }) => {\n  // TODO: implement test based on change: ${d}\n  await page.goto('/');\n  await expect(page).toBeTruthy();\n});\n`;
  fs.writeFileSync(testPath, content, 'utf-8');
  console.log('[Hefesto] Created test skeleton:', testPath);
}
