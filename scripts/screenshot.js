import puppeteer from 'puppeteer';

const url = process.argv[2] || 'http://localhost:3002/sdlc-dashboard';
const out = process.argv[3] || 'sdlc-dashboard-manifestation.png';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 2000 });
    console.log('Navigating to', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Page loaded, taking screenshot...');
    await page.screenshot({ path: out, fullPage: true });
    await browser.close();
    console.log('Screenshot saved to', out);
    process.exit(0);
  } catch (err) {
    console.error('Screenshot failed:', err);
    process.exit(1);
  }
})();
