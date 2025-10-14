const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const base = process.env.AUDIT_BASE || 'http://localhost:3002/#/dashboard';
  const dashboards = [
    '/dashboard',
    '/dashboard#/dashboard',
    '/dashboard#/dashboard?view=ceo-dashboard',
  ];

  const outDir = 'audits/screenshots';
  fs.mkdirSync(outDir, { recursive: true });

  // Navigate to base and capture
  await page.goto(base, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.screenshot({ path: `${outDir}/dashboard_base.png`, fullPage: true });

  // Try opening the sidebar items programmatically
  const views = ['ceo-dashboard','cfo-dashboard','cto-dashboard','cmo-dashboard','cio-dashboard','coo-dashboard','cso-dashboard'];
  for (const view of views) {
    try {
      // Attempt to click sidebar button by label
      await page.evaluate((v) => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent && b.textContent.toLowerCase().includes(v.split('-')[0]));
        if (btn) btn.click();
      }, view);
      await page.waitForTimeout(1200);
      const file = `${outDir}/${view}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log('Captured', file);
    } catch (err) {
      console.error('Error capturing', view, err.message);
    }
  }

  await browser.close();
})();
