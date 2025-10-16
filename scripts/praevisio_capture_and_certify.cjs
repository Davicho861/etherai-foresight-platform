#!/usr/bin/env node
// Simple Puppeteer script to visit the sovereign landing and take a screenshot.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TARGET = process.env.TARGET_URL || 'http://localhost:3002';
const OUT_DIR = process.env.OUT_DIR || path.resolve(__dirname, '..', 'reports', 'praevisio');
const OUT_FILE = path.join(OUT_DIR, 'new_order_screenshot.png');

(async () => {
  await fs.promises.mkdir(OUT_DIR, { recursive: true });
  // Allow overriding the chromium executable path (useful inside containers)
  const execPath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;
  const launchOpts = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  if (execPath) {
    launchOpts.executablePath = execPath;
  }
  const browser = await puppeteer.launch(launchOpts);
  try {
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 800 });
    console.log(`Navigating to ${TARGET}`);
    await page.goto(TARGET, { waitUntil: 'networkidle2', timeout: 60000 });

    // Try to click the App button if present
    try {
      const appSelector = 'a[href*="/dashboard"], button[data-test="app-button"], a[data-test="app-link"]';
      const el = await page.$(appSelector);
      if (el) {
        console.log('Found App button, clicking it');
        await el.click();
        await page.waitForTimeout(1500);
      }
    } catch (err) {
      console.log('App button not found or click failed:', err.message);
    }

    await page.screenshot({ path: OUT_FILE, fullPage: true });
    console.log('Screenshot saved to', OUT_FILE);
  } catch (err) {
    console.error('Error during capture:', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
