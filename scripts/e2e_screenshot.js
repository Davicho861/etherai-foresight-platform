const puppeteer = require('puppeteer');
const fs = require('fs');

async function run(url) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setViewport({ width: 1440, height: 900 });

  const target = url || process.argv[2] || 'http://localhost:3002';
  console.log('[e2e] Opening', target);

  await page.goto(`${target}/login`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(async () => {
    console.log('[e2e] /login not reachable, opening root');
    await page.goto(target, { waitUntil: 'networkidle2', timeout: 30000 });
  });

  // Attempt auto-login by submitting a form if present
  try {
    const loginSelector = 'form[action*="/login"]';
    const hasLogin = await page.$(loginSelector);
    if (hasLogin) {
      console.log('[e2e] Found login form, attempting test credentials');
      await page.evaluate(() => {
        const u = document.querySelector('input[name="username"], input[name="email"], input[type="email"]');
        const p = document.querySelector('input[name="password"], input[type="password"]');
        if (u && (u instanceof HTMLInputElement)) u.value = 'test@local';
        if (p && (p instanceof HTMLInputElement)) p.value = 'test1234';
      });
      await Promise.all([
        page.click('button[type="submit"]'),
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {}),
      ]);
    }
  } catch (err) {
    console.log('[e2e] login attempt failed or not present', err.message || err);
  }

  // Navigate to dashboard
  await page.goto(`${target}/dashboard`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});

  // Wait for live-state widgets to appear or for a known selector
  await page.waitForTimeout(1500);
  try {
    await page.waitForSelector('.text-2xl, .kanban-card, pre, h2', { timeout: 10000 });
  } catch (err) {
    console.log('[e2e] Warning: widgets not found quickly, proceeding to screenshot');
  }

  // Full page screenshot
  const outDir = 'artifacts/screenshots';
  fs.mkdirSync(outDir, { recursive: true });
  const fullPath = `${outDir}/dashboard-full.png`;
  await page.screenshot({ path: fullPath, fullPage: true });
  console.log('[e2e] Screenshot saved:', fullPath);

  // Widget area screenshot (try to capture main content)
  const main = await page.$('main');
  if (main) {
    const rect = await main.boundingBox();
    if (rect) {
      const clipPath = `${outDir}/dashboard-main.png`;
      await page.screenshot({ path: clipPath, clip: { x: rect.x, y: rect.y, width: Math.min(rect.width, 1600), height: Math.min(rect.height, 1600) } });
      console.log('[e2e] Main screenshot saved:', clipPath);
    }
  }

  await browser.close();
}

if (require.main === module) {
  run(process.argv[2]).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
