import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = path.resolve(process.cwd(), 'EMPIRE_RESURRECTION_ARTIFACTS');
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

const HOST = process.env.FRONTEND_HOST || 'http://localhost:3002';
const PLAN = process.env.PLAN || process.argv[2] || 'starter';

function nowTag() {
  const d = new Date();
  return d.toISOString().replace(/[:.]/g, '-');
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-features=ServiceWorker'], defaultViewport: { width: 1400, height: 900 } });
  const page = await browser.newPage();
  // keep viewport stable
  try { await page.setViewport({ width: 1400, height: 900 }); } catch (e) {}

  const url = `${HOST}/demo?plan=${PLAN}`;
  console.log('Opening', url);
  try {
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push({ type: msg.type(), text: msg.text() }));

    // Intercept requests and retry certain asset loads to mitigate transient dev-server aborts
    try {
      await page.setRequestInterception(true);
      page.on('request', async req => {
        const url = req.url();
        // only retry JS deps that are known to abort during HMR (recharts, react-simple-maps, etc)
        const shouldRetry = /node_modules\/\.vite\/deps\/(recharts|react-simple-maps|react-simple-maps)\.js/.test(url);
        if (!shouldRetry) return req.continue();

        // simple retry: attempt to fetch via node and respond with buffer to the page
        const tryFetch = async (attempt = 1) => {
          try {
            const res = await fetch(url);
            const buffer = await res.arrayBuffer();
            return { ok: true, body: Buffer.from(buffer), headers: { 'content-type': res.headers.get('content-type') || 'application/javascript' } };
          } catch (e) {
            if (attempt < 3) return tryFetch(attempt + 1);
            return { ok: false };
          }
        };

        const fetched = await tryFetch();
        if (fetched.ok) {
          return req.respond({ status: 200, body: fetched.body, headers: fetched.headers });
        }
        return req.continue();
      });
    } catch (e) {
      // if interception not supported, ignore — still ok
    }

    let lastErr = null;
    // helper to evaluate with retries in case the page reloads and the execution context is destroyed
    const evaluateWithRetry = async (fn, ...args) => {
      for (let t = 1; t <= 4; t++) {
        try {
          return await page.evaluate(fn, ...args);
        } catch (e) {
          lastErr = e;
          // small backoff
          await new Promise(r => setTimeout(r, 500 * t));
        }
      }
      throw lastErr;
    };

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
        if (!resp || !resp.ok()) console.warn(`GET ${url} returned status ${resp ? resp.status() : 'no response'}`);

        // Wait for root element to be present (accounts for HMR reloads)
        try {
          await page.waitForSelector('#root, [data-testid="root"]', { timeout: 30000 });
        } catch (e) {
          // ignore and continue to allow screenshot of whatever is present
        }
        // short delay to let JS finish mounting
        if (typeof page.waitForTimeout === 'function') await page.waitForTimeout(1500);
        else await page.evaluate(() => new Promise(r => setTimeout(r, 1500)));

        const tag = nowTag();
        const shotPath = path.join(ARTIFACT_DIR, `demo-${PLAN}-${tag}.png`);
        await page.screenshot({ path: shotPath, fullPage: true });

        // extract some simple indicators with retries to avoid Execution context errors
        const textSample = await evaluateWithRetry(() => {
          const el = document.querySelector('.kpi, .widget, [data-testid="dashboard-widgets"], .widget-container');
          return el ? el.innerText.slice(0, 800) : document.body.innerText.slice(0, 800);
        });

        const svgText = await evaluateWithRetry(() => Array.from(document.querySelectorAll('svg text')).map(t => t.textContent).filter(Boolean).join('\n').slice(0,800));

        const out = { plan: PLAN, url, shotPath, textSample: textSample.slice(0,400), svgText, consoleMessages };
        console.log('RESULT', JSON.stringify(out, null, 2));
        await browser.close();
        process.exit(0);
      } catch (err) {
        lastErr = err;
        console.warn(`Attempt ${attempt} failed for ${PLAN}:`, err && err.message ? err.message : err);
        // small backoff
        await new Promise(r => setTimeout(r, 1200 * attempt));
      }
    }

    console.error('Failed to capture', PLAN, lastErr && lastErr.message ? lastErr.message : lastErr);
    await browser.close();
    process.exit(2);
  } catch (err) {
    console.error('Unexpected failure in capture flow', err && err.message ? err.message : err);
    try { await browser.close(); } catch(e) {}
    process.exit(3);
  }
})();
