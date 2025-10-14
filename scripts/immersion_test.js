import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const REPORT_DIR = path.resolve(process.cwd(), 'reports');
if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

const BASE_URL = 'http://localhost:3002';

async function captureScreenshot(page, name) {
  const file = path.join(REPORT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`Screenshot guardado: ${file}`);
  return file;
}

async function checkForErrors(page) {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    errors.push(err.message);
  });
  return errors;
}

async function verifyDataPresence(page, selectors) {
  for (const selector of selectors) {
    try {
      await page.waitForSelector(selector, { timeout: 5000 });
      const element = await page.$(selector);
      const text = await page.evaluate(el => el.textContent.trim(), element);
      if (!text || text === '' || text.includes('Loading') || text.includes('No data')) {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return true;
}

async function testDashboard(url, name, plan = null) {
  console.log(`\n=== Probando ${name} ===`);
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setViewport({ width: 1400, height: 900 });

  const errors = checkForErrors(page);
  let success = true;
  let issues = [];
  let screenshotFile;

  try {
    console.log(`Navegando a ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Esperar que la página cargue
    await page.waitForSelector('body', { timeout: 10000 });

    // Si es demo, seleccionar plan Panteón
    if (plan === 'Panteón') {
      console.log('Seleccionando plan Panteón...');
      try {
        const clicked = await page.evaluate(() => {
          const texts = ['Panteón', 'Panteon', 'PANTÉON', 'PANTEON'];
          const candidates = Array.from(document.querySelectorAll('button, a, [role="button"], [data-testid]'));
          for (const t of texts) {
            for (const el of candidates) {
              const text = (el.innerText || el.textContent || '').trim();
              if (text && text.indexOf(t) !== -1) {
                el.click();
                return true;
              }
            }
          }
          return false;
        });
        if (clicked) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          console.log('Plan Panteón seleccionado');
        } else {
          issues.push('No se pudo seleccionar el plan Panteón');
          success = false;
        }
      } catch (err) {
        issues.push(`Error al seleccionar plan: ${err.message}`);
        success = false;
      }
    }

    // Verificar datos reales
    console.log('Verificando presencia de datos reales...');
    let dataSelectors = [];
    if (name === 'sdlc-dashboard') {
      dataSelectors = ['.metric-value', '.chart', '[data-testid*="metric"]'];
    } else if (name === 'dashboard') {
      dataSelectors = ['.widget', '.metric', '.chart', '[data-testid*="data"]'];
    } else if (name === 'demo') {
      dataSelectors = ['.demo-content', '.interactive-element', '[data-testid*="demo"]'];
    }

    const hasData = await verifyDataPresence(page, dataSelectors);
    if (!hasData) {
      issues.push('No se encontraron datos reales en la página');
      success = false;
    } else {
      console.log('Datos reales detectados');
    }

    // Verificar interactividad básica
    console.log('Verificando interactividad...');
    try {
      const buttons = await page.$$('button');
      if (buttons.length > 0) {
        // Intentar click en el primer botón visible
        await buttons[0].click();
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Interactividad verificada');
      } else {
        console.log('No se encontraron botones para verificar interactividad');
      }
    } catch (err) {
      issues.push(`Error en interactividad: ${err.message}`);
      success = false;
    }

    // Capturar screenshot
    try {
      screenshotFile = await captureScreenshot(page, name);
    } catch (err) {
      console.warn('Error al capturar screenshot:', err.message);
      screenshotFile = null;
    }

    // Verificar errores en consola
    await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar posibles errores asíncronos
    if (errors.length > 0) {
      issues.push(`Errores en consola: ${errors.join(', ')}`);
      success = false;
    } else {
      console.log('No se detectaron errores en consola');
    }

    console.log(`${name}: ${success ? 'ÉXITO' : 'FALLÓ'}`);
    if (issues.length > 0) {
      console.log('Problemas encontrados:', issues);
    }

  } catch (err) {
    console.error(`Error en ${name}:`, err.message);
    issues.push(`Error general: ${err.message}`);
    success = false;
    screenshotFile = null;
  } finally {
    await browser.close();
  }

  return { name, success, issues, screenshot: screenshotFile };
}

async function runImmersionTest() {
  console.log('🚀 INICIANDO PRUEBA DE INMERSIÓN TOTAL - FASE III.1');
  console.log('Manifestando soberanía del imperio...\n');

  const tests = [
    { url: `${BASE_URL}/sdlc-dashboard`, name: 'sdlc-dashboard' },
    { url: `${BASE_URL}/dashboard`, name: 'dashboard' },
    { url: `${BASE_URL}/demo`, name: 'demo', plan: 'Panteón' }
  ];

  const results = [];

  for (const test of tests) {
    try {
      const result = await testDashboard(test.url, test.name, test.plan);
      results.push(result);
    } catch (err) {
      console.error(`Error fatal en test ${test.name}:`, err.message);
      results.push({ name: test.name, success: false, issues: [`Error fatal: ${err.message}`], screenshot: null });
    }
  }

  // Generar reporte
  const report = {
    timestamp: new Date().toISOString(),
    phase: 'III.1 - Prueba de Inmersión Total',
    results,
    summary: {
      total: results.length,
      passed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    }
  };

  const reportFile = path.join(REPORT_DIR, 'IMMERSION_TEST_REPORT.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`\n📋 Reporte generado: ${reportFile}`);

  console.log('\n🏛️ RESUMEN DEL IMPERIO:');
  console.log(`Total dashboards probados: ${report.summary.total}`);
  console.log(`Éxitos: ${report.summary.passed}`);
  console.log(`Fallos: ${report.summary.failed}`);

  if (report.summary.failed === 0) {
    console.log('✨ ¡EL IMPERIO ESTÁ COMPLETAMENTE SOBERANO! ✨');
  } else {
    console.log('⚠️  El imperio requiere correcciones para alcanzar soberanía total.');
    results.filter(r => !r.success).forEach(r => {
      console.log(`- ${r.name}: ${r.issues.join(', ')}`);
    });
  }

  return report;
}

runImmersionTest().catch(err => {
  console.error('Error fatal en la prueba de inmersión:', err);
  process.exit(1);
});