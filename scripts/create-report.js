#!/usr/bin/env node
import { readFile, writeFile, access } from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, '..', 'UNCONDITIONAL_CREATION_REPORT_TEMPLATE.md');
const outDir = path.join(__dirname, '..');

function timestamp() {
  const d = new Date();
  return d.toISOString().replace(/[:.]/g, '-');
}

async function main() {
  try {
    await access(templatePath);
  } catch (e) {
    console.error('Template not found:', templatePath);
    process.exit(1);
  }
  const tpl = await readFile(templatePath, 'utf8');
  const ts = timestamp();
  const out = tpl.replace('{{TIMESTAMP}}', ts);
  const outPath = path.join(outDir, `UNCONDITIONAL_CREATION_REPORT_${ts}.md`);
  await writeFile(outPath, out, 'utf8');
  console.log('Generated report:', outPath);
}

main();
