import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:3002/dashboard', { waitUntil: 'networkidle2', timeout: 30000 });
    const title = await page.title();
    console.log('Página cargada:', title);

    // Verificar que no haya error de conexión
    const errorDiv = await page.$('[data-testid="error-connection"]');
    if (errorDiv) {
      console.log('ERROR: Error de conexión encontrado');
    } else {
      console.log('SUCCESS: No hay error de conexión');
    }

    // Verificar KPIs
    const kpis = await page.$$('[data-testid*="kpi"]');
    console.log('KPIs encontrados:', kpis.length);

    // Verificar widgets
    const widgets = await page.$$('[data-testid*="widget"]');
    console.log('Widgets encontrados:', widgets.length);

    // Tomar screenshot
    await page.screenshot({ path: 'sovereign-dashboard-screenshot.png', fullPage: true });
    console.log('Screenshot guardado: sovereign-dashboard-screenshot.png');

  } catch (error) {
    console.error('Error en Puppeteer:', error.message);
  } finally {
    await browser.close();
  }
})();