import puppeteer from 'puppeteer';
import { setTimeout } from 'timers/promises';

async function captureDashboardScreenshots() {
  console.log('🏛️ Iniciando captura de screenshots del Oráculo Viviente...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    // Navegar al dashboard
    console.log('📍 Navegando a http://localhost:3002/dashboard...');
    await page.goto('http://localhost:3002/dashboard', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Esperar a que cargue React - buscar elementos del DOM
    await setTimeout(5000); // Dar tiempo para que React cargue

    // Verificar si estamos en la página correcta
    const title = await page.title();
    console.log('📄 Título de la página:', title);

    // Intentar encontrar elementos del dashboard
    const sidebarExists = await page.$('.fixed.left-0.top-0.h-full.w-80');
    if (sidebarExists) {
      console.log('✅ Sidebar encontrado');
    } else {
      console.log('⚠️ Sidebar no encontrado, intentando con selectores alternativos...');
    }

    // Capturar vista por defecto (Análisis Predictivo) - sin importar si encuentra el sidebar
    console.log('📸 Capturando vista: Análisis Predictivo...');
    await page.screenshot({
      path: 'ORACLE_ANALYSIS_PREDICTIVE.png',
      fullPage: true
    });

    // Intentar hacer clic en botones usando diferentes estrategias
    console.log('🔄 Intentando cambiar a vista: Evaluación de Riesgos...');

    // Estrategia 1: Buscar por texto
    try {
      const riskButton = await page.$x("//button[contains(text(), 'Evaluación de Riesgos')]");
      if (riskButton.length > 0) {
        await riskButton[0].click();
        await setTimeout(3000);
        console.log('✅ Click en Evaluación de Riesgos exitoso');
      } else {
        console.log('⚠️ Botón "Evaluación de Riesgos" no encontrado');
      }
    } catch (e) {
      console.log('⚠️ Error al hacer click en Evaluación de Riesgos:', e.message);
    }

    console.log('📸 Capturando vista: Evaluación de Riesgos...');
    await page.screenshot({
      path: 'ORACLE_RISK_ASSESSMENT.png',
      fullPage: true
    });

    // Hacer clic en "Optimización Logística"
    console.log('🔄 Intentando cambiar a vista: Optimización Logística...');
    try {
      const logisticsButton = await page.$x("//button[contains(text(), 'Optimización Logística')]");
      if (logisticsButton.length > 0) {
        await logisticsButton[0].click();
        await setTimeout(3000);
        console.log('✅ Click en Optimización Logística exitoso');
      } else {
        console.log('⚠️ Botón "Optimización Logística" no encontrado');
      }
    } catch (e) {
      console.log('⚠️ Error al hacer click en Optimización Logística:', e.message);
    }

    console.log('📸 Capturando vista: Optimización Logística...');
    await page.screenshot({
      path: 'ORACLE_LOGISTICS_OPTIMIZATION.png',
      fullPage: true
    });

    // Hacer clic en "Estado del Sistema"
    console.log('🔄 Intentando cambiar a vista: Estado del Sistema...');
    try {
      const systemButton = await page.$x("//button[contains(text(), 'Estado del Sistema')]");
      if (systemButton.length > 0) {
        await systemButton[0].click();
        await setTimeout(3000);
        console.log('✅ Click en Estado del Sistema exitoso');
      } else {
        console.log('⚠️ Botón "Estado del Sistema" no encontrado');
      }
    } catch (e) {
      console.log('⚠️ Error al hacer click en Estado del Sistema:', e.message);
    }

    console.log('📸 Capturando vista: Estado del Sistema...');
    await page.screenshot({
      path: 'ORACLE_SYSTEM_STATUS.png',
      fullPage: true
    });

    console.log('🎉 Captura completada exitosamente!');
    console.log('📁 Screenshots guardados:');
    console.log('   - ORACLE_ANALYSIS_PREDICTIVE.png');
    console.log('   - ORACLE_RISK_ASSESSMENT.png');
    console.log('   - ORACLE_LOGISTICS_OPTIMIZATION.png');
    console.log('   - ORACLE_SYSTEM_STATUS.png');

  } catch (error) {
    console.error('❌ Error durante la captura:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  captureDashboardScreenshots()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { captureDashboardScreenshots };
