import { OracleOfDelphi } from './oracle.js';
import { CerberoStaticHead, CerberoDynamicHead, CerberoDependencyHead } from './agents.js';
import { getLLM } from './agents.js';

export class GuardianOrchestrator {
  constructor() {
    this.oracle = new OracleOfDelphi();
    this.llm = getLLM();
    this.guardians = {
      ares: new CerberoStaticHead(),
      athena: null, // Implementar calidad
      hephaestus: null, // Implementar desarrollo
      apollo: null // Implementar despliegue
    };
  }

  // Método principal para ejecución monolítica en CI
  async executeGuardians(gitDiff) {
    try {
      console.log('🛡️ Iniciando GuardianOrchestrator - Análisis de diff de git');

      // 1. Analizar diff con Oracle para pre-mortem
      const riskAnalysis = await this.analyzeDiffRisks(gitDiff);

      // 2. Ejecutar guardianes en secuencia
      const results = {
        riskAnalysis,
        guardians: {}
      };

      // Ares - Seguridad
      results.guardians.ares = await this.ares(gitDiff, riskAnalysis);

      // Atenea - Calidad
      results.guardians.athena = await this.athena(gitDiff, riskAnalysis);

      // Hefesto - Desarrollo
      results.guardians.hephaestus = await this.hephaestus(gitDiff, riskAnalysis);

      // Apolo - Despliegue
      results.guardians.apollo = await this.apollo(gitDiff, riskAnalysis);

      // 3. Determinar si el diff pasa todos los guardianes
      const overallApproval = this.determineOverallApproval(results);

      return {
        ...results,
        overallApproval,
        timestamp: new Date().toISOString(),
        message: overallApproval.approved ?
          '✅ Todos los guardianes aprobaron el diff' :
          '❌ Diff rechazado por uno o más guardianes'
      };

    } catch (error) {
      console.error('Error en GuardianOrchestrator:', error);
      return {
        error: error.message,
        overallApproval: { approved: false, reason: 'Error interno del sistema' }
      };
    }
  }

  // Análisis de riesgos del diff usando Oracle
  async analyzeDiffRisks(gitDiff) {
    // Convertir diff a formato de contrato para Oracle
    const contractData = {
      title: 'Git Diff Analysis',
      description: `Análisis de cambios en código: ${gitDiff.substring(0, 500)}...`,
      diff: gitDiff
    };

    return await this.oracle.generatePreMortem(contractData);
  }

  // Ares - Guardián de Seguridad
  async ares(gitDiff, riskAnalysis) {
    console.log('⚔️ Ares analizando seguridad...');

    try {
      // Usar CerberoStaticHead para análisis estático
      const staticAnalysis = await this.performStaticSecurityAnalysis(gitDiff);

      // Análisis adicional basado en riesgos del Oracle
      const riskBasedChecks = this.performRiskBasedSecurityChecks(gitDiff, riskAnalysis);

      const approved = staticAnalysis.approved && riskBasedChecks.approved;

      return {
        approved,
        analysis: staticAnalysis,
        riskChecks: riskBasedChecks,
        recommendations: approved ? [] : ['Revisar vulnerabilidades detectadas', 'Implementar medidas de mitigación']
      };
    } catch (error) {
      return {
        approved: false,
        error: error.message,
        analysis: null,
        riskChecks: null
      };
    }
  }

  // Atenea - Guardiana de Calidad
  async athena(gitDiff, riskAnalysis) {
    console.log('🦉 Atenea evaluando calidad...');

    try {
      const qualityChecks = await this.performQualityAnalysis(gitDiff);

      const approved = qualityChecks.score >= 0.8; // Umbral de calidad

      return {
        approved,
        qualityChecks,
        score: qualityChecks.score,
        recommendations: approved ? [] : ['Mejorar cobertura de pruebas', 'Corregir issues de linting']
      };
    } catch (error) {
      return {
        approved: false,
        error: error.message,
        qualityChecks: null
      };
    }
  }

  // Hefesto - Guardián de Desarrollo
  async hephaestus(gitDiff, riskAnalysis) {
    console.log('🔨 Hefesto forjando código...');

    try {
      const developmentChecks = await this.performDevelopmentAnalysis(gitDiff);

      const approved = developmentChecks.bestPractices && developmentChecks.architecture;

      return {
        approved,
        developmentChecks,
        recommendations: approved ? [] : ['Revisar mejores prácticas', 'Mejorar arquitectura del código']
      };
    } catch (error) {
      return {
        approved: false,
        error: error.message,
        developmentChecks: null
      };
    }
  }

  // Apolo - Guardián de Despliegue
  async apollo(gitDiff, riskAnalysis) {
    console.log('☀️ Apolo verificando despliegue...');

    try {
      const deploymentChecks = await this.performDeploymentAnalysis(gitDiff);

      const approved = deploymentChecks.ready && deploymentChecks.safe;

      return {
        approved,
        deploymentChecks,
        recommendations: approved ? [] : ['Preparar rollback plan', 'Verificar configuración de producción']
      };
    } catch (error) {
      return {
        approved: false,
        error: error.message,
        deploymentChecks: null
      };
    }
  }

  // Métodos auxiliares para análisis (implementaciones básicas)
  async performStaticSecurityAnalysis(gitDiff) {
    // Análisis básico de patrones de seguridad en el diff
    const vulnerabilities = [];

    // Buscar patrones comunes de vulnerabilidades
    if (gitDiff.includes('password') && gitDiff.includes('hardcoded')) {
      vulnerabilities.push('Posible contraseña hardcodeada');
    }

    if (gitDiff.includes('eval(') || gitDiff.includes('Function(')) {
      vulnerabilities.push('Uso de eval() o Function() - riesgo de inyección');
    }

    if (gitDiff.includes('innerHTML') && !gitDiff.includes('sanitize')) {
      vulnerabilities.push('Asignación directa a innerHTML sin sanitización');
    }

    return {
      approved: vulnerabilities.length === 0,
      vulnerabilities,
      severity: vulnerabilities.length > 2 ? 'HIGH' : vulnerabilities.length > 0 ? 'MEDIUM' : 'LOW'
    };
  }

  performRiskBasedSecurityChecks(gitDiff, riskAnalysis) {
    const checks = [];

    if (riskAnalysis.riskLevel === 'CRITICAL') {
      checks.push('Riesgo crítico detectado - revisión manual requerida');
    }

    return {
      approved: riskAnalysis.riskLevel !== 'CRITICAL',
      checks
    };
  }

  async performQualityAnalysis(gitDiff) {
    // Análisis básico de calidad
    let score = 1.0;

    // Penalizar por falta de tests
    if (!gitDiff.includes('test') && !gitDiff.includes('spec')) {
      score -= 0.2;
    }

    // Penalizar por código comentado
    const commentedLines = (gitDiff.match(/^\s*\/\//gm) || []).length;
    const totalLines = gitDiff.split('\n').length;
    if (commentedLines / totalLines > 0.3) {
      score -= 0.1;
    }

    // Verificar uso de async/await vs callbacks
    if (gitDiff.includes('callback') && !gitDiff.includes('async')) {
      score -= 0.1;
    }

    return {
      score: Math.max(0, score),
      hasTests: gitDiff.includes('test') || gitDiff.includes('spec'),
      commentRatio: commentedLines / totalLines,
      modernPatterns: !gitDiff.includes('callback') || gitDiff.includes('async')
    };
  }

  async performDevelopmentAnalysis(gitDiff) {
    const checks = {
      bestPractices: true,
      architecture: true,
      issues: []
    };

    // Verificar separación de responsabilidades
    if (gitDiff.includes('function') && gitDiff.length > 1000) {
      checks.issues.push('Función muy larga - considerar refactorizar');
      checks.bestPractices = false;
    }

    // Verificar imports organizados
    const importLines = gitDiff.match(/^import.*$/gm) || [];
    if (importLines.length > 10 && !this.areImportsOrganized(importLines)) {
      checks.issues.push('Imports desorganizados');
      checks.bestPractices = false;
    }

    // Verificar arquitectura (ejemplo básico)
    if (gitDiff.includes('console.log') && !gitDiff.includes('// TODO')) {
      checks.issues.push('Uso de console.log en producción');
      checks.architecture = false;
    }

    return checks;
  }

  async performDeploymentAnalysis(gitDiff) {
    const checks = {
      ready: true,
      safe: true,
      issues: []
    };

    // Verificar cambios en configuración
    if (gitDiff.includes('.env') || gitDiff.includes('config')) {
      checks.issues.push('Cambios en configuración - verificar impacto');
      checks.safe = false;
    }

    // Verificar cambios en base de datos
    if (gitDiff.includes('migration') || gitDiff.includes('schema')) {
      checks.issues.push('Cambios en esquema de BD - preparar rollback');
      checks.safe = false;
    }

    // Verificar si hay breaking changes
    if (gitDiff.includes('BREAKING') || gitDiff.includes('breaking')) {
      checks.issues.push('Posibles breaking changes detectados');
      checks.ready = false;
    }

    return checks;
  }

  areImportsOrganized(importLines) {
    // Lógica básica para verificar organización de imports
    const groups = { external: [], internal: [], relative: [] };

    importLines.forEach(line => {
      if (line.includes('from \'@') || line.includes('from "@')) {
        groups.external.push(line);
      } else if (line.includes('from \'./') || line.includes('from "./')) {
        groups.relative.push(line);
      } else {
        groups.internal.push(line);
      }
    });

    // Verificar orden: external, internal, relative
    const ordered = [...groups.external, ...groups.internal, ...groups.relative];
    return JSON.stringify(importLines) === JSON.stringify(ordered);
  }

  determineOverallApproval(results) {
    const guardianResults = Object.values(results.guardians);
    const allApproved = guardianResults.every(g => g.approved);

    if (allApproved) {
      return { approved: true };
    } else {
      const failedGuardians = guardianResults
        .filter(g => !g.approved)
        .map(g => Object.keys(results.guardians).find(key => results.guardians[key] === g));

      return {
        approved: false,
        reason: `Guardianes fallidos: ${failedGuardians.join(', ')}`,
        failedGuardians
      };
    }
  }
}

// Instancia global
export const guardianOrchestrator = new GuardianOrchestrator();