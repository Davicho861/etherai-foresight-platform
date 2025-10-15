#!/usr/bin/env node
/* Captura screenshots dirigidas para certificar la estética Google aplicada */
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const OUT = path.resolve(process.cwd(), 'reports', 'google_manifest');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const URLS = [
  { url: 'http://localhost:3002/#/dashboard?plan=starter', name: 'dashboard-starter' },
  { url: 'http://localhost:3002/#/dashboard?plan=growth', name: 'dashboard-growth' },
  { url: 'http://localhost:3002/#/dashboard?plan=panteon', name: 'dashboard-panteon' },
  { url: 'http://localhost:3002/#/sdlc-dashboard', name: 'sdlc-dashboard' },
  { url: 'http://localhost:3002/#/demo', name: 'demo' }
];

async function captureAll() {
  console.log('🚀 Iniciando captura de certificación Google Theme...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  for (const u of URLS) {
    try {
      console.log('→ Navegando a', u.url);
      await page.goto(u.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('body', { timeout: 5000 });
  // page.waitForTimeout may not be available in some puppeteer versions; use a portable sleep
  await new Promise((res) => setTimeout(res, 1500));
      const file = path.join(OUT, `${u.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log('   ✔ Capturado:', file);
    } catch (err) {
      console.error('   ✖ Error capturando', u.url, err && err.message);
    }
  }

  await browser.close();
  // Generate index
  const md = ['# GOOGLE THEME CERTIFICATION', '', `Generated: ${new Date().toISOString()}`, ''];
  for (const u of URLS) {
    const f = path.join(OUT, `${u.name}.png`);
    md.push(`## ${u.url}`);
    md.push(`![${u.name}](${path.relative(process.cwd(), f)})`);
    md.push('');
  }
  fs.writeFileSync(path.join(OUT, 'README.md'), md.join('\n'));
  console.log('📁 Report generated at', path.join(OUT, 'README.md'));
}

captureAll().catch(err => { console.error(err); process.exit(1); });
