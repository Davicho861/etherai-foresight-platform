const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function auditSdlcDesign() {
  console.log('🏛️ Iniciando auditoría soberana del Dashboard SDLC...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('🌐 Navegando a http://localhost:3002/#/sdlc-dashboard...');
    await page.goto('http://localhost:3002/#/sdlc-dashboard', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Esperar a que el dashboard cargue completamente
    await page.waitForSelector('[class*="min-h-screen"]', { timeout: 10000 });

    // Capturar screenshot completo
    const screenshotPath = path.join(__dirname, '..', 'sdlc-google-design.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    console.log(`📸 Screenshot capturado: ${screenshotPath}`);

    // Auditoría de CSS - Obtener colores del body
    const bodyColor = await page.evaluate(() => {
      const body = document.querySelector('body');
      return window.getComputedStyle(body).backgroundColor;
    });

    // Obtener colores de tarjetas Kanban
    const kanbanCardColor = await page.evaluate(() => {
      const kanbanCard = document.querySelector('[class*="kanban-task"], [class*="bg-google-surface"]');
      if (kanbanCard) {
        return window.getComputedStyle(kanbanCard).backgroundColor;
      }
      return 'No encontrado';
    });

    // Obtener colores de texto
    const h1Color = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      if (h1) {
        return window.getComputedStyle(h1).color;
      }
      return 'No encontrado';
    });

    const pColor = await page.evaluate(() => {
      const p = document.querySelector('p');
      if (p) {
        return window.getComputedStyle(p).color;
      }
      return 'No encontrado';
    });

    // Colores esperados de la paleta Google
    const expectedColors = {
      background: 'rgb(32, 33, 36)', // #202124
      surface: 'rgb(48, 49, 52)', // #303134
      primary: 'rgb(137, 180, 250)', // #89b4fa
      'text-primary': 'rgb(232, 234, 237)', // #e8eaed
      'text-secondary': 'rgb(189, 193, 198)' // #bdc1c6
    };

    // Generar reporte de auditoría
    const auditReport = `# SDLC Design Audit Report - Google Material Design
Fecha: ${new Date().toISOString()}

## 🎯 Objetivo de la Auditoría
Verificar que el Dashboard SDLC ha sido refundado con la estética limpia, sobria y profesional de Google Material Design.

## 📊 Resultados de la Auditoría

### Colores Obtenidos del Dashboard
- **Background (body)**: ${bodyColor}
- **Surface (tarjetas)**: ${kanbanCardColor}
- **Texto primario (h1)**: ${h1Color}
- **Texto secundario (p)**: ${pColor}

### Colores Esperados (Paleta Google)
- **Background**: ${expectedColors.background} (#202124)
- **Surface**: ${expectedColors.surface} (#303134)
- **Primary**: ${expectedColors.primary} (#89b4fa)
- **Text Primary**: ${expectedColors['text-primary']} (#e8eaed)
- **Text Secondary**: ${expectedColors['text-secondary']} (#bdc1c6)

### ✅ Verificación de Conformidad
${bodyColor === expectedColors.background ? '✅' : '❌'} Background color matches Google palette
${kanbanCardColor === expectedColors.surface ? '✅' : '❌'} Surface color matches Google palette
${h1Color === expectedColors['text-primary'] ? '✅' : '❌'} Primary text color matches Google palette
${pColor === expectedColors['text-secondary'] ? '✅' : '❌'} Secondary text color matches Google palette

## 📸 Evidencia Visual
Screenshot completo del dashboard: \`sdlc-google-design.png\`

## 🏛️ Conclusión
${[bodyColor, kanbanCardColor, h1Color, pColor].every(color =>
  Object.values(expectedColors).includes(color)
) ? '✅ **ÉXITO**: El Dashboard SDLC ha sido completamente refundado con la estética Google Material Design.' : '❌ **FALLIDO**: Algunos colores no coinciden con la paleta Google esperada.'}

---
*Auditoría ejecutada por Hefesto - Maestro Forjador de Estilos*
`;

    const reportPath = path.join(__dirname, '..', 'SDLC_AUDIT_REPORT.md');
    fs.writeFileSync(reportPath, auditReport);
    console.log(`📋 Reporte de auditoría generado: ${reportPath}`);

  } catch (error) {
    console.error('❌ Error durante la auditoría:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Ejecutar auditoría si se llama directamente
if (require.main === module) {
  auditSdlcDesign()
    .then(() => {
      console.log('🏛️ Auditoría soberana completada exitosamente.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Auditoría fallida:', error);
      process.exit(1);
    });
}

module.exports = { auditSdlcDesign };