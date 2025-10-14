#!/usr/bin/env node
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(new URL(import.meta.url).pathname, '..');
const outDir = path.resolve(process.cwd(), 'scripts', 'screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const pages = [
  { url: 'http://localhost:3002/#/sdlc-dashboard', file: 'sdlc-dashboard.png' },
  { url: 'http://localhost:3002/#/dashboard', file: 'dashboard.png' },
  { url: 'http://localhost:3002/#/demo', file: 'demo.png' },
];

async function run() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  for (const p of pages) {
    const page = await browser.newPage();
    page.setViewport({ width: 1400, height: 900 });
    console.log(`Navegando a ${p.url} ...`);
    try {
      const resp = await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForTimeout(2000);
      const filePath = path.join(outDir, p.file);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`Guardada captura: ${filePath}`);
    } catch (err) {
      console.error(`Error capturando ${p.url}:`, err.message);
    }
    await page.close();
  }
  await browser.close();
}

run().catch(err => { console.error(err); process.exit(1); });
