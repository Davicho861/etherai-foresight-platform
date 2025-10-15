import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = path.resolve(process.cwd(), 'EMPIRE_RESURRECTION_ARTIFACTS');
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

const HOST = process.env.FRONTEND_HOST || 'http://localhost:3002';
const PLANS = ['starter', 'growth', 'panteon'];

function nowTag() {
  const d = new Date();
  return d.toISOString().replace(/[:.]/g, '-');
}

async function waitForData(page) {
  // Espera que aparezca al menos un widget con datos.
  const SELECTORS = ['[data-testid="dashboard-widgets"]', '.widget', '.kpi', '.widget-container', '[data-testid="kpi"]', 'svg text'];
  for (const sel of SELECTORS) {
    try {
      await page.waitForSelector(sel, { timeout: 12000 });
      // Si existe, espera un poco más para que los datos carguen
      if (typeof page.waitForTimeout === 'function') {
        await page.waitForTimeout(1200);
      } else {
        await page.evaluate(() => new Promise(r => setTimeout(r, 1200)));
      }
      return true;
    } catch (e) {
      // probar siguiente selector
    }
  }
  // fallback: espera al menos 6s
  if (typeof page.waitForTimeout === 'function') {
    await page.waitForTimeout(6000);
  } else {
    await page.evaluate(() => new Promise(r => setTimeout(r, 6000)));
  }
  return false;
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setViewport({ width: 1400, height: 900 });

  const results = [];

  for (const plan of PLANS) {
    const url = `${HOST}/demo?plan=${plan}`;
    console.log('Opening', url);
    try {
      // Setup listeners for console and network
      const consoleMessages = [];
      const networkResponses = [];
      page.on('console', msg => consoleMessages.push({ type: msg.type(), text: msg.text() }));
      page.on('response', res => networkResponses.push({ url: res.url(), status: res.status() }));

      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      if (!resp || !resp.ok()) {
        console.warn(`Warning: GET ${url} returned status ${resp ? resp.status() : 'no response'}`);
      }

      // Try to detect data with a retry if initial wait fails
      let hasData = await waitForData(page);
      if (!hasData) {
        // small retry after extra wait
        if (typeof page.waitForTimeout === 'function') await page.waitForTimeout(3000); else await page.evaluate(() => new Promise(r => setTimeout(r, 3000)));
        hasData = await waitForData(page);
      }

      // Try to extract textual content from SVG <text> nodes and from canvas (dataURL)
      let svgText = '';
      try {
        svgText = await page.evaluate(() => {
          const texts = Array.from(document.querySelectorAll('svg text')).map(t => t.textContent).filter(Boolean);
          return texts.join('\n').slice(0, 800);
        });
      } catch (e) {
        svgText = '';
      }
      let canvasData = '';
      try {
        canvasData = await page.evaluate(() => {
          const c = document.querySelector('canvas');
          if (!c) return '';
          try { return c.toDataURL().slice(0, 200); } catch (e) { return ''; }
        });
      } catch (e) {
        canvasData = '';
      }

      const tag = nowTag();
      const shotPath = path.join(ARTIFACT_DIR, `demo-${plan}-${tag}.png`);
      await page.screenshot({ path: shotPath, fullPage: true });

      // Try to extract a simple text-based check of a KPI or widget
      let sampleText = '';
      try {
        sampleText = await page.evaluate(() => {
          const el = document.querySelector('.kpi, .widget, [data-testid="dashboard-widgets"], .widget-container');
          return el ? el.innerText.slice(0, 400) : '';
        });
      } catch (e) {
        sampleText = '';
      }

      results.push({ plan, url, hasData, shotPath, sampleText: sampleText.trim(), svgText: svgText.trim(), canvasData: canvasData.slice(0,200), consoleMessages, networkResponses });
      console.log(`Captured ${shotPath} (hasData=${hasData})`);
    } catch (err) {
      console.error(`Failed to capture ${plan}:`, err && err.message ? err.message : err);
      results.push({ plan, url, error: err && err.message ? err.message : String(err) });
    }
  }

  await browser.close();

  const manifestPath = path.join(ARTIFACT_DIR, `manifest-${nowTag()}.json`);
  fs.writeFileSync(manifestPath, JSON.stringify({ createdAt: new Date().toISOString(), results }, null, 2));
  console.log('Done. Manifest:', manifestPath);
  console.table(results.map(r => ({ plan: r.plan, ok: !!r.hasData, shot: r.shotPath || '', error: r.error || '' })));
  process.exit(0);
})();
