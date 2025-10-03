#!/usr/bin/env node

import { OracleOfDelphi } from '../server/src/oracle.js';

async function analyzePrePush() {
  try {
    // Obtener el diff de git comparado con upstream
    const { execSync } = await import('child_process');
    const diff = execSync('git diff @{upstream}..HEAD', { encoding: 'utf8' });

    if (!diff.trim()) {
      console.log('✅ No hay cambios para analizar');
      process.exit(0);
    }

    console.log('🔮 Consultando Oráculo de Delfos para análisis de riesgos...');

    // Crear instancia del Oráculo
    const oracle = new OracleOfDelphi();

    // Preparar datos para el análisis
    const contractData = {
      title: 'Pre-push Risk Analysis',
      description: `Análisis de cambios a push: ${diff.substring(0, 200)}...`,
      diff: diff
    };

    // Ejecutar análisis
    const result = await oracle.generatePreMortem(contractData);

    console.log(`📊 Nivel de riesgo detectado: ${result.riskLevel}`);
    console.log(`🔍 Patrones analizados: ${result.patternsAnalyzed.similarPatterns} similares, ${result.patternsAnalyzed.causalInsights} causales`);

    // Evaluar riesgo
    if (result.riskLevel === 'CRITICAL' || result.riskLevel === 'HIGH') {
      console.error('🚫 RIESGO ALTO DETECTADO - Abortando push');
      console.error('Recomendaciones:');
      result.recommendations.specific.forEach(rec => console.error(`  - ${rec}`));
      process.exit(1);
    }

    console.log('✅ Riesgo aceptable - Push permitido');
    console.log(`Recomendación general: ${result.recommendations.general}`);

  } catch (error) {
    console.error('❌ Error en análisis de pre-push:', error.message);
    // En caso de error, permitir push para no bloquear desarrollo
    console.log('⚠️ Error en análisis - Push permitido por seguridad');
    process.exit(0);
  }
}

analyzePrePush();