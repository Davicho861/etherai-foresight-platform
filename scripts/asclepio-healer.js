#!/usr/bin/env node
// Asclepio: Attempt simple auto-heals for failing Playwright tests (demo proof-of-concept)
import fs from 'fs';
import path from 'path';

const [testPath, errorMessage] = process.argv.slice(2);
if (!testPath) {
  console.error('Usage: asclepio-healer.js <testPath> [errorMessage]');
  process.exit(1);
}

console.log(`[Asclepio] Attempting to heal test: ${testPath}`);
// Demo strategy: replace common fragile selectors like text= with data-testid hints if present in same folder
try {
  const abs = path.resolve(testPath);
  if (!fs.existsSync(abs)) {
    console.error('[Asclepio] test file does not exist, cannot heal');
    process.exit(2);
  }
  let content = fs.readFileSync(abs, 'utf-8');
  // Simple heuristic: replace "text=Planes y Precios" with "getByTestId('pricing-table')" style locator
  if (content.includes('Planes y Precios') && !content.includes("pricing-table")) {
    content = content.replace(/Planes y Precios/g, "'[data-testid=\"pricing-table\"]'");
    fs.writeFileSync(abs, content, 'utf-8');
    console.log('[Asclepio] Applied heuristic patch to test file');
    process.exit(0);
  }
  console.log('[Asclepio] No applicable heuristic patch found');
  process.exit(3);
} catch (err) {
  console.error('[Asclepio] Error during healing:', err?.message || err);
  process.exit(4);
}
