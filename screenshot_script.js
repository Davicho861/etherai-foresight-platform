import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/demo');
  await page.waitForSelector('body'); // Esperar a que la página cargue
  await page.screenshot({ path: 'artifacts/demo_screenshot.png', fullPage: true });
  await browser.close();
  console.log('Screenshot tomado y guardado en artifacts/dashboard_screenshot.png');
})();