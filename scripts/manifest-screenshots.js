import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function takeScreenshot(url, filename, waitTime = 5000) {
  let browser;
  try {
    console.log(`📸 Capturando screenshot de ${url}...`);
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, waitTime));

    // Crear directorio si no existe
    const screenshotsDir = path.join(__dirname, '..', 'EMPIRE_RESURRECTION_ARTIFACTS');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const filepath = path.join(screenshotsDir, filename);
    await page.screenshot({ path: filepath, fullPage: true });

    console.log(`✅ Screenshot guardado: ${filepath}`);
    return filepath;
  } catch (error) {
    console.error(`❌ Error capturando ${url}:`, error.message);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function certifyEmpire() {
  console.log('🏛️ Iniciando certificación del Imperio Praevisio AI...');

  const urls = [
    { url: 'http://localhost:3002/', filename: 'landing-page.png', waitTime: 3000 },
    { url: 'http://localhost:3002/#/login', filename: 'login-page.png', waitTime: 2000 },
    { url: 'http://localhost:3002/#/dashboard?plan=starter', filename: 'dashboard-starter.png', waitTime: 8000 },
    { url: 'http://localhost:3002/#/dashboard?plan=growth', filename: 'dashboard-growth.png', waitTime: 8000 },
    { url: 'http://localhost:3002/#/dashboard?plan=panteon', filename: 'dashboard-panteon.png', waitTime: 8000 },
    { url: 'http://localhost:3002/#/demo', filename: 'demo-dashboard.png', waitTime: 10000 },
    { url: 'http://localhost:3002/#/sdlc-dashboard', filename: 'sdlc-dashboard.png', waitTime: 8000 },
    { url: 'http://localhost:3002/#/pricing', filename: 'pricing-plans.png', waitTime: 3000 }
  ];

  const results = [];

  for (const { url, filename, waitTime } of urls) {
    const filepath = await takeScreenshot(url, filename, waitTime);
    results.push({ url, filename, success: !!filepath, filepath });
  }

  console.log('🏛️ Certificación completada. Resultados:');
  results.forEach(result => {
    console.log(`${result.success ? '✅' : '❌'} ${result.url} -> ${result.filename}`);
  });

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;

  console.log(`\n📊 Resumen: ${successCount}/${totalCount} dashboards certificados exitosamente`);

  if (successCount === totalCount) {
    console.log('🎉 ¡El Imperio Praevisio AI ha sido completamente manifestado y certificado!');
  } else {
    console.log('⚠️ Algunos dashboards requieren atención adicional.');
  }

  return results;
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  certifyEmpire().catch(console.error);
}

export { certifyEmpire, takeScreenshot };
