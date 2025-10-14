#!/usr/bin/env node
// CommonJS script para capturar screenshots del dashboard en los tres planes usando puppeteer
// No usar Playwright (por requerimiento del usuario)

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const BASE = process.env.DASHBOARD_BASE || 'http://localhost:3003';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
const CONSOLE_LOG = process.env.DASHBOARD_CONSOLE_LOG || '/tmp/dashboard_console.log';
const REQUESTS_LOG = process.env.DASHBOARD_REQUESTS_LOG || '/tmp/dashboard_requests.log';

async function ensureOut() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture(plan, page) {
  console.log('Capturando plan:', plan);
  await page.waitForSelector('button');
  // buscar botón por texto (normalizado) y hacer click desde el contexto de página
  const clicked = await page.evaluate(async (planText) => {
    const norm = (s) => (s || '').replace(/\s+/g,' ').trim();
    const buttons = Array.from(document.querySelectorAll('button'));
    for (const b of buttons) {
      if (norm(b.textContent) === norm(planText)) {
        b.click();
        return true;
      }
    }
    return false;
  }, plan);
  if (clicked) {
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
  // lanzar con headless por defecto (puede ser sobreescrito con PUPPETEER_HEADLESS env)
  const headless = process.env.PUPPETEER_HEADLESS !== 'false';
  const browser = await puppeteer.launch({
    headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--ignore-certificate-errors',
      '--enable-logging'
    ]
  });
  try {
    const page = await browser.newPage();
    page.setViewport({ width: 1400, height: 900 });
  const url = `${BASE}/dashboard?testMode=1`;
    console.log('Navegando a', url);

    // Prepare logs files (append mode)
    try { fs.writeFileSync(CONSOLE_LOG, `--- NEW RUN ${new Date().toISOString()} ---\n`, { flag: 'a' }); } catch(e){}
    try { fs.writeFileSync(REQUESTS_LOG, `--- NEW RUN ${new Date().toISOString()} ---\n`, { flag: 'a' }); } catch(e){}

    // Volcar console messages del navegador
    page.on('console', msg => {
      try {
        const text = `[console:${msg.type()}] ${msg.text()}\n`;
        fs.writeFileSync(CONSOLE_LOG, text, { flag: 'a' });
        console.log('PAGE_CONSOLE>', text.trim());
      } catch (e) { console.error('Error escribiendo console log', e); }
    });

    // Interceptar peticiones y respuestas
    await page.setRequestInterception(true);
    page.on('request', req => {
      try {
        let body = '';
        try {
          const pd = req.postData && typeof req.postData === 'function' ? req.postData() : req.postData || '';
          if (pd) body = ` body=${String(pd).slice(0,1000)}`;
        } catch (e) { body = '' }
        const line = `[REQ] ${req.method()} ${req.url()}${body}\n`;
        fs.writeFileSync(REQUESTS_LOG, line, { flag: 'a' });
      } catch (e) { console.error('Error escribiendo request log', e); }
      req.continue().catch(()=>{});
    });
    page.on('response', async res => {
      try {
        const status = res.status();
        const urlr = res.url();
        let text = '';
        try { text = await res.text(); } catch (e) { text = '<no-text-or-stream>'; }
        const snippet = text ? text.slice(0,1000).replace(/\n/g,' ') : '';
        const line = `[RES] ${status} ${urlr} snippet=${snippet}\n`;
        fs.writeFileSync(REQUESTS_LOG, line, { flag: 'a' });
        if (status === 0) {
          // possible network error
          fs.writeFileSync(REQUESTS_LOG, `[RES-ERR] status0 ${urlr}\n`, { flag: 'a' });
        }
      } catch (e) { console.error('Error escribiendo response log', e); }
    });
    page.on('requestfailed', req => {
      try {
        const failure = req.failure() && req.failure().errorText ? req.failure().errorText : 'unknown';
        const line = `[REQ-FAILED] ${req.method()} ${req.url()} reason=${failure}\n`;
        fs.writeFileSync(REQUESTS_LOG, line, { flag: 'a' });
      } catch (e) { }
    });

    // set a common desktop user agent to avoid some headless blocks
    try { await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'); } catch(e){}

    // Inyectar token si se proporciona
    const token = process.env.DASHBOARD_AUTH_TOKEN || null;
    if (token) {
      await page.evaluateOnNewDocument((t) => {
        try { localStorage.setItem('auth_token', t); } catch(e) {}
      }, token);
      console.log('Token inyectado en localStorage (en evaluateOnNewDocument).');
    } else {
      console.log('No se proporcionó token de auth (DASHBOARD_AUTH_TOKEN).');
    }

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    // small sleep helper
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    // Esperar a que el header del dashboard esté presente (más robusto que buscar botones genéricos)
    try {
      await page.waitForSelector('h2', { timeout: 30000 });
      const h2Text = await page.$eval('h2', el => el.textContent && el.textContent.trim());
      console.log('Header h2 encontrado:', h2Text);
    } catch (err) {
      console.warn('No se encontró header h2 dentro del timeout, intentando continuar de todos modos');
    }
    await sleep(1200);

        // adaptative button lookup: try exact text, uppercase, and trimmed versions
        try {
          await capture('Starter', page);
        } catch (err) {
          console.error('Error capturando Starter, volcando HTML para diagnóstico');
          const rendered = await page.content();
          const outPath = '/tmp/dashboard_render.html';
          require('fs').writeFileSync(outPath, rendered, 'utf8');
          console.log('HTML renderizado guardado en', outPath);
          // listar botones y textos
          const buttons = await page.$$eval('button', els => els.map(e => e.textContent && e.textContent.trim()));
          console.log('Botones encontrados:', buttons);
          try { fs.writeFileSync(CONSOLE_LOG, `--- HTML DUMP SAVED TO ${outPath} ---\n`, { flag: 'a' }); } catch(e){}
          try { fs.writeFileSync(CONSOLE_LOG, `Buttons: ${JSON.stringify(buttons)}\n`, { flag: 'a' }); } catch(e){}
          throw err;
        }
      await sleep(1000);
      await capture('Growth', page);
      await sleep(1000);
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
