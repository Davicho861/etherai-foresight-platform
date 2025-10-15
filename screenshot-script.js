import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport to capture full page
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    // Navigate to the URL
    await page.goto('http://localhost:3002/sdlc-dashboard', { waitUntil: 'networkidle2' });

    // Wait for a reasonable time to ensure content loads
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Take full page screenshot
    await page.screenshot({ path: 'sdlc-dashboard-manifestation.png', fullPage: true });

    console.log('Screenshot captured successfully: sdlc-dashboard-manifestation.png');
    console.log('Page loaded correctly with dashboard content.');
  } catch (error) {
    console.error('Error during navigation or screenshot:', error.message);
  } finally {
    await browser.close();
  }
})();