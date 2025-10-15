#!/usr/bin/env node

/**
 * scripts/gemini_screenshots.js
 * - Usa puppeteer para capturar screenshots de rutas clave y guardarlas en artifacts/gemini_screenshots
 * - Ejecutar después de levantar la app (npm run start:native)
 *
 * Uso: node scripts/gemini_screenshots.js [baseUrl]
 * Ejemplo: node scripts/gemini_screenshots.js http://localhost:3002
 */

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const args = process.argv.slice(2);
const baseUrl = args[0] || process.env.GEMINI_BASE_URL || 'http://localhost:3002';
const outDir = path.resolve(process.cwd(), 'artifacts', 'gemini_screenshots');

const routes = [
  '/',
  '/demo',
  '/dashboard',
  '/sdlc-dashboard',
  '/demo/growth'
];

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function run() {
  await ensureDir(outDir);
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  for (const route of routes) {
    const url = `${baseUrl}${route}`;
    try {
      console.log('Visiting', url);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
  // small wait for animations (compatible alternative)
  await new Promise(res => setTimeout(res, 800));
      const safeName = route === '/' ? 'home' : route.replace(/[^a-z0-9_-]/gi, '_').replace(/^_/, '');
      const outPath = path.join(outDir, `${safeName}.png`);
      await page.screenshot({ path: outPath, fullPage: true });
      console.log('Saved', outPath);
    } catch (err) {
      console.error('Failed to capture', url, err.message || err);
    }
  }

  await browser.close();
  console.log('Done.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
