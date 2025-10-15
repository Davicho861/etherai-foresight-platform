 
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const url = process.env.SDLC_URL || 'http://localhost:3002/#/sdlc-dashboard';
  const outDir = path.resolve(process.cwd(), 'artifacts');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const screenshotPath = path.join(outDir, 'sdlc-google-design.png');
  const reportPath = path.join(outDir, 'SDLC_AUDIT_REPORT.md');

  const expected = {
    bodyBg: 'rgb(32, 33, 36)', // #202124
    cardBg: 'rgb(48, 49, 52)', // #303134
    primary: 'rgb(137, 180, 250)', // #89b4fa
    textPrimary: 'rgb(232, 234, 237)', // #e8eaed
    textSecondary: 'rgb(189, 193, 198)', // #bdc1c6
  };

  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 960 });

  try {
    console.log('Navigating to', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for the dashboard to render a known selector
    await page.waitForSelector('body', { timeout: 10000 });

    console.log('Capturing screenshot...');
    await page.screenshot({ path: screenshotPath, fullPage: true });

    // Evaluate styles
    const results = await page.evaluate(() => {
      const getColor = (el) => {
        if (!el) return null;
        const s = window.getComputedStyle(el);
        return { background: s.backgroundColor, color: s.color };
      };

      const body = document.querySelector('body');
      const firstCard = document.querySelector('.kanban-card, .bg-google-surface, .p-4');
      const h1 = document.querySelector('h1');
      const p = document.querySelector('p');

      return {
        body: getColor(body),
        card: getColor(firstCard),
        h1: getColor(h1),
        p: getColor(p),
      };
    });

    const compare = (actual, expectedRgb) => {
      if (!actual) return { ok: false, actual: null };
      const keys = ['background', 'color'];
      const out = {};
      keys.forEach(k => {
        out[k] = { actual: actual[k] || null, expected: expectedRgb };
        out[k].ok = actual[k] && actual[k].includes(expectedRgb.replace(/rgb\(|\)/g, '').split(',')[0]);
      });
      return out;
    };

    const audit = {
      bodyBg: { actual: results.body ? results.body.background : null, expected: expected.bodyBg, pass: (results.body && results.body.background === expected.bodyBg) },
      cardBg: { actual: results.card ? results.card.background : null, expected: expected.cardBg, pass: (results.card && results.card.background === expected.cardBg) },
      h1Color: { actual: results.h1 ? results.h1.color : null, expected: expected.primary, pass: (results.h1 && results.h1.color === expected.primary) },
      pColor: { actual: results.p ? results.p.color : null, expected: expected.textSecondary, pass: (results.p && results.p.color === expected.textSecondary) },
    };

    const reportLines = [];
    reportLines.push('# SDLC Design Audit Report\n');
    reportLines.push(`URL: ${url}\n`);
    reportLines.push('## Screenshot\n');
    reportLines.push(`![screenshot](./${path.basename(screenshotPath)})\n`);

    reportLines.push('## Results\n');
    Object.entries(audit).forEach(([k, v]) => {
      reportLines.push(`- ${k}: expected ${v.expected}, actual ${v.actual} -> ${v.pass ? 'PASS' : 'FAIL'}`);
    });

    fs.writeFileSync(reportPath, reportLines.join('\n'));

    console.log('Audit complete. Report written to', reportPath);
  } catch (err) {
    console.error('Audit failed:', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
