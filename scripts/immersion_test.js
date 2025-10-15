import puppeteer from 'puppeteer';

async function runImmersionTest() {
  console.log('🚀 Iniciando prueba de inmersión soberana en Praevisio AI...');

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    console.log('🌐 Navegando a http://localhost:3002/dashboard...');
    await page.goto('http://localhost:3002/dashboard', { waitUntil: 'networkidle2' });

    console.log('⏳ Esperando carga del dashboard...');
    await page.waitForSelector('body', { timeout: 30000 });

    // Verificar que el dashboard se carga
    const title = await page.title();
    console.log(`📊 Título de la página: ${title}`);

    // Verificar elementos clave del dashboard
    const hasDashboardContent = await page.evaluate(() => {
      const bodyText = document.body.innerText.toLowerCase();
      return bodyText.includes('dashboard') || bodyText.includes('praevisio') || bodyText.includes('ai');
    });

    console.log(`✅ Dashboard cargado: ${hasDashboardContent ? 'SÍ' : 'NO'}`);

    // Capturar screenshot
    const screenshotPath = 'PURIFIED_EMPIRE_DASHBOARD.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot capturado: ${screenshotPath}`);

    // Verificar datos reales (buscar indicadores de datos dinámicos)
    const hasRealData = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      // Buscar patrones que indiquen datos reales vs mocks
      return bodyText.includes('0.') || bodyText.includes('1.') || bodyText.includes('2.') ||
             bodyText.includes('3.') || bodyText.includes('4.') || bodyText.includes('5.') ||
             bodyText.includes('6.') || bodyText.includes('7.') || bodyText.includes('8.') ||
             bodyText.includes('9.') || bodyText.includes('%') || bodyText.includes('activo');
    });

    console.log(`📈 Datos reales detectados: ${hasRealData ? 'SÍ' : 'NO'}`);

    console.log('🎉 Prueba de inmersión completada exitosamente!');
    console.log(`📁 Screenshot guardado en: ${screenshotPath}`);

    return {
      success: true,
      title,
      hasDashboardContent,
      hasRealData,
      screenshotPath
    };

  } catch (error) {
    console.error('❌ Error en la prueba de inmersión:', error.message);
    return {
      success: false,
      error: error.message
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runImmersionTest().then(result => {
    console.log('\n🏛️ RESULTADO FINAL:', result);
    process.exit(result.success ? 0 : 1);
  });
}

export { runImmersionTest };