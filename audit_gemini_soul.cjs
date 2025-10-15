/**
 * PRAEVISIO HEPHAESTUS GEMINI SOUL FORGE - AUDITORÍA PROGRAMÁTICA
 * Script de auditoría con Puppeteer para verificar la implementación de la paleta Gemini
 * y el mecanismo de polling inteligente con cache-busting
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class GeminiSoulAuditor {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      pages: [],
      geminiPaletteCompliance: {},
      pollingMechanism: {},
      screenshots: [],
      errors: []
    };
  }

  async audit() {
    console.log('🔮 Iniciando auditoría del Alma de Gemini...');

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const pages = [
        { name: 'Dashboard', url: 'http://localhost:5173/dashboard' },
        { name: 'SDLC Dashboard', url: 'http://localhost:5173/sdlc-dashboard' },
        { name: 'Demo', url: 'http://localhost:5173/demo' },
        { name: 'Login', url: 'http://localhost:5173/login' },
        { name: 'Pricing', url: 'http://localhost:5173/pricing' }
      ];

      for (const pageConfig of pages) {
        console.log(`📊 Auditando página: ${pageConfig.name}`);
        await this.auditPage(browser, pageConfig);
      }

      this.generateReport();

    } catch (error) {
      console.error('❌ Error en auditoría:', error);
      this.results.errors.push(error.message);
    } finally {
      await browser.close();
    }
  }

  async auditPage(browser, pageConfig) {
    const page = await browser.newPage();

    try {
      // Configurar monitoreo de red para detectar polling
      const networkRequests = [];
      page.on('request', request => {
        if (request.url().includes('/api/') && request.url().includes('_cache=')) {
          networkRequests.push({
            url: request.url(),
            timestamp: Date.now(),
            hasCacheBusting: true
          });
        }
      });

      // Navegar a la página
      await page.goto(pageConfig.url, { waitUntil: 'networkidle0' });

      // Esperar a que se cargue completamente
      await page.waitForTimeout(3000);

      // Capturar screenshot
      const screenshotPath = `audit_screenshots/${pageConfig.name.toLowerCase().replace(' ', '_')}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      this.results.screenshots.push(screenshotPath);

      // Verificar paleta de colores Gemini
      const geminiCompliance = await page.evaluate(() => {
        const computedStyles = getComputedStyle(document.body);
        const rootStyles = getComputedStyle(document.documentElement);

        // Verificar variables CSS de Gemini
        const geminiVars = [
          '--background', '--background-secondary', '--primary', '--primary-hover',
          '--accent-yellow', '--accent-red', '--text-primary', '--text-secondary'
        ];

        const varsPresent = geminiVars.every(varName =>
          rootStyles.getPropertyValue(varName).trim() !== ''
        );

        // Verificar uso de clases Gemini en elementos
        const geminiClasses = [
          'gemini-bg', 'gemini-bg-secondary', 'gemini-text-primary',
          'gemini-primary', 'gemini-card', 'gemini-button-primary'
        ];

        const classesUsed = geminiClasses.some(className =>
          document.querySelector(`.${className}`) !== null
        );

        // Verificar colores específicos de Gemini
        const geminiColors = [
          '#89b4fa', // primary
          '#fbbc04', // accent-yellow
          '#ea4335', // accent-red
          '#0f1419', // background
          '#1a1f2c', // background-secondary
          '#e8eaed', // text-primary
          '#bdc1c6'  // text-secondary
        ];

        const colorsFound = geminiColors.filter(color => {
          const elements = document.querySelectorAll('*');
          return Array.from(elements).some(el => {
            const style = getComputedStyle(el);
            return [style.color, style.backgroundColor, style.borderColor]
              .some(prop => prop.includes(color));
          });
        });

        return {
          varsPresent,
          classesUsed,
          colorsFound: colorsFound.length,
          totalGeminiColors: geminiColors.length,
          compliance: varsPresent && classesUsed && colorsFound.length > 0
        };
      });

      // Verificar mecanismo de polling
      await page.waitForTimeout(20000); // Esperar 20 segundos para ver polling

      const pollingData = {
        cacheBustingRequests: networkRequests.length,
        pollingActive: networkRequests.length > 0,
        averageInterval: networkRequests.length > 1 ?
          networkRequests.slice(1).reduce((acc, req, i) => {
            const interval = req.timestamp - networkRequests[i].timestamp;
            return acc + interval;
          }, 0) / (networkRequests.length - 1) : 0
      };

      this.results.pages.push({
        name: pageConfig.name,
        url: pageConfig.url,
        geminiCompliance,
        pollingData
      });

    } catch (error) {
      console.error(`❌ Error auditando ${pageConfig.name}:`, error);
      this.results.errors.push(`${pageConfig.name}: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  generateReport() {
    const report = `# PRAEVISIO HEPHAESTUS GEMINI SOUL FORGE - MANIFESTACIÓN FINAL

## 📊 RESULTADOS DE LA AUDITORÍA DEL ALMA DE GEMINI

**Fecha de Auditoría:** ${this.results.timestamp}

### 🎨 COMPLIANCE CON LA PALETA GEMINI

| Página | Variables CSS | Clases Gemini | Colores Encontrados | Compliance |
|--------|---------------|---------------|-------------------|------------|
${this.results.pages.map(p =>
  `| ${p.name} | ${p.geminiCompliance.varsPresent ? '✅' : '❌'} | ${p.geminiCompliance.classesUsed ? '✅' : '❌'} | ${p.geminiCompliance.colorsFound}/${p.geminiCompliance.totalGeminiColors} | ${p.geminiCompliance.compliance ? '✅ PERFECTO' : '❌ REQUIERE ATENCIÓN'} |`
).join('\n')}

### 🔄 MECANISMO DE PULSO DE LA REALIDAD (POLLING)

| Página | Cache-Busting Activo | Requests Detectados | Polling Funcionando |
|--------|----------------------|-------------------|-------------------|
${this.results.pages.map(p =>
  `| ${p.name} | ${p.pollingData.cacheBustingRequests > 0 ? '✅' : '❌'} | ${p.pollingData.cacheBustingRequests} | ${p.pollingData.pollingActive ? '✅' : '❌'} |`
).join('\n')}

### 📸 SCREENSHOTS CAPTURADOS
${this.results.screenshots.map(s => `- ${s}`).join('\n')}

### ⚠️ ERRORES ENCONTRADOS
${this.results.errors.length > 0 ?
  this.results.errors.map(e => `- ${e}`).join('\n') :
  '✅ Ningún error detectado en la auditoría'}

## 🏆 VEREDICTO FINAL

${this.results.pages.every(p => p.geminiCompliance.compliance) &&
 this.results.pages.every(p => p.pollingData.pollingActive) ?
'## 🎉 ¡MANIFESTACIÓN PERFECTA! ##\n\nEl Alma de Gemini ha sido forjada con éxito. Toda la plataforma respira la estética soberana de Google Gemini y el Pulso de la Realidad mantiene los datos siempre frescos.' :

'## ⚠️ REQUIERE REFINAMIENTO ##\n\nAlgunos aspectos necesitan atención adicional para alcanzar la perfección divina.'}

### 📈 MÉTRICAS GLOBALES
- **Páginas Auditadas:** ${this.results.pages.length}
- **Compliance Gemini:** ${this.results.pages.filter(p => p.geminiCompliance.compliance).length}/${this.results.pages.length}
- **Polling Activo:** ${this.results.pages.filter(p => p.pollingData.pollingActive).length}/${this.results.pages.length}
- **Screenshots:** ${this.results.screenshots.length}

---
*Auditado por Hefesto, Maestro Forjador de Praevisio AI*
`;

    fs.writeFileSync('GEMINI_SOUL_MANIFEST.md', report);
    console.log('📋 Reporte generado: GEMINI_SOUL_MANIFEST.md');
  }
}

// Ejecutar auditoría
if (require.main === module) {
  const auditor = new GeminiSoulAuditor();
  auditor.audit().then(() => {
    console.log('🏛️ Auditoría del Alma de Gemini completada.');
  }).catch(console.error);
}

module.exports = GeminiSoulAuditor;