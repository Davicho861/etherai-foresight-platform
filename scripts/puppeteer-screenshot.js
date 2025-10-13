import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const base = process.env.BASE_URL || 'http://localhost:3002';
  try {
    // Navigate to login page
    await page.goto(`${base}/#/login`, { waitUntil: 'networkidle2' });

    // Wait for form to load
    await page.waitForSelector('input', { timeout: 5000 });

    // Fill login form - use more generic selectors
    const inputs = await page.$$('input');
    if (inputs.length >= 2) {
      await inputs[0].type('admin'); // username
      await inputs[1].type('admin'); // password
    }

    // Submit login
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
    }

    // Wait for navigation to dashboard
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(()=>{});

    // Ensure we're on dashboard
    await page.goto(`${base}/#/dashboard`, { waitUntil: 'networkidle2' });

    // Take screenshot
    await page.screenshot({ path: 'sovereign-dashboard-screenshot.png', fullPage: true });
    console.log('Screenshot saved to sovereign-dashboard-screenshot.png');
  } catch (err) {
    console.error('Puppeteer error', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
