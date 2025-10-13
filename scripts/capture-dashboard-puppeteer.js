#!/usr/bin/env node
// Script para capturar screenshots del dashboard en los tres planes usando puppeteer
// No usar Playwright (por requerimiento del usuario)

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const BASE = process.env.DASHBOARD_BASE || 'http://localhost:3003';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

async function ensureOut() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture(plan, page) {
  console.log('Capturando plan:', plan);
  // click button with text matching plan
  await page.waitForSelector('button');
  // try to find a button with exact text
  const btn = await page.$x(`//button[normalize-space(text())='${plan}']`);
  if (btn && btn.length > 0) {
    await btn[0].click();
    await page.waitForTimeout(800);
  } else {
    console.warn('Botón de plan no encontrado, continuando sin cambiar plan');
  }
  const fileName = path.join(OUT_DIR, `dashboard-${plan.toLowerCase().replace(/[^a-z0-9]+/g,'')}.png`);
  await page.screenshot({ path: fileName, fullPage: true });
  console.log('Guardado:', fileName);
}

async function run() {
  await ensureOut();
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    page.setViewport({ width: 1400, height: 900 });
    const url = `${BASE}/dashboard`;
    console.log('Navegando a', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    // allow some time for live-state to populate
    await page.waitForTimeout(1200);

    await capture('Starter', page);
    await capture('Growth', page);
    await capture('Panteón', page);

    console.log('Capturas completadas.');
  } catch (err) {
    console.error('Error durante la captura:', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
}

run();
