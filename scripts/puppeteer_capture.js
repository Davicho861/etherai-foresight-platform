import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const REPORT_DIR = path.resolve(process.cwd(), 'reports');
if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

async function capture() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const urls = [
    { url: 'http://localhost:3002/sdlc', name: 'sdlc' },
    { url: 'http://localhost:3002/dashboard', name: 'dashboard' },
    { url: 'http://localhost:3002/demo', name: 'demo' }
  ];

  const results = [];

  for (const u of urls) {
    try {
      await page.goto(u.url, { waitUntil: 'networkidle2', timeout: 30000 });
      // wait for a generic element that usually exists (body or app-root)
      await page.waitForSelector('body', { timeout: 5000 });

      // If demo page, try to click plan 'Panteón' or 'Panteon' if available
      if (u.name === 'demo') {
        try {
          const clicked = await page.evaluate(() => {
            const texts = ['Panteón', 'Panteon', 'PANTÉON', 'PANTEON'];
            const candidates = Array.from(document.querySelectorAll('button, a, [role="button"], [data-testid]'));
            for (const t of texts) {
              for (const el of candidates) {
                try {
                  const text = (el.innerText || el.textContent || '').trim();
                  if (text && text.indexOf(t) !== -1) {
                    el.click();
                    return true;
                  }
                } catch (e) {
                  // ignore
                }
              }
            }
            return false;
          });
          if (clicked) await page.waitForTimeout(1000);
        } catch (err) {
          console.warn('Demo click attempt failed:', err && err.message);
        }
      }

      const file = path.join(REPORT_DIR, `${u.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      results.push({ url: u.url, file });
      console.log('Captured', u.url, '->', file);
    } catch (err) {
      console.error('Failed capture for', u.url, err && err.message);
    }
  }

  await browser.close();

  // Generate simple markdown report
  const md = ['# EMPIRE_MANIFESTATION_REPORT', '', `Generated: ${new Date().toISOString()}`, ''];
  for (const r of results) {
    md.push(`## ${r.url}`);
    md.push(`![${r.url}](${path.relative(process.cwd(), r.file)})`);
    md.push('');
  }
  const mdFile = path.join(REPORT_DIR, 'EMPIRE_MANIFESTATION_REPORT.md');
  fs.writeFileSync(mdFile, md.join('\n'));
  console.log('Report generated at', mdFile);
}

capture().catch(err => { console.error(err); process.exit(1); });
