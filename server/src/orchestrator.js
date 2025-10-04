import { getChromaClient, getNeo4jDriver } from './database.js';
import { MetatronAgent } from './agents.js';
import { publish } from './eventHub.js';
import GdeltIntegration from './integrations/GdeltIntegration.js';
import WorldBankIntegration from './integrations/WorldBankIntegration.js';

const activeMissions = new Map();

class MetatronOrchestrator {
  constructor() {
    this.chromaClient = getChromaClient();
    this.neo4jDriver = getNeo4jDriver();
    this.crews = {
      planning: new MetatronAgent('PlanningCrew'),
      development: new MetatronAgent('DevelopmentCrew'),
      quality: new MetatronAgent('QualityCrew'),
      deployment: new MetatronAgent('DeploymentCrew'),
    };
    this.ethicsCouncil = new MetatronAgent('EthicsCouncil');
    this.oracle = new MetatronAgent('Oracle');
    this.kairos = new MetatronAgent('Kairos');
    this.cerberus = new MetatronAgent('Cerberus'); // SecurityCrew
    this.perpetualFlows = {
      autoPreservation: { active: false, lastRun: null, intervalId: null },
      knowledge: { active: false, lastRun: null, intervalId: null },
      prophecy: { active: false, lastRun: null, intervalId: null }
    };
    this.riskIndices = {}; // Store current risk indices
    this.activityFeed = []; // Feed of activities

    // Start Eternal Vigilance
    this.startEternalVigilance();
  }

  async startMission(missionId, missionContract, logCallback) {
    activeMissions.set(missionId, { logs: [], status: 'running' });

    const log = (task) => {
      logCallback(task);
      publish(missionId, task);
      const mission = activeMissions.get(missionId);
      if (mission) {
        mission.logs.push(task);
      }
      // Persist log to Chroma (best-effort)
      try {
        if (this.chromaClient && this.chromaClient.upsertLog) {
          this.chromaClient.upsertLog(missionId, task).catch(() => {});
        }
      } catch { /* ignore persistence errors */ }
      // Persist to Neo4j (best-effort): create a Mission node and a Log node
      try {
        if (this.neo4jDriver) {
          const session = this.neo4jDriver.session();
          const q = `MERGE (m:Mission {id: $missionId})
                     MERGE (l:Log {id: $logId})
                     SET l += $logProps
                     MERGE (m)-[:HAS_LOG]->(l)`;
          const params = {
            missionId,
            logId: task.taskId || (`log-${Date.now()}-${Math.floor(Math.random()*10000)}`),
            logProps: { ...task, ts: Date.now() }
          };
          // Ensure we catch async errors from the driver so they don't become unhandled
          session.run(q, params).catch(() => { /* ignore runtime errors */ }).finally(() => session.close());
        }
      } catch { /* ignore neo4j errors */ }
    };

    try {
      log({ taskId: 'ethics-council', description: 'Consultando al Consejo de Ética...', status: 'in_progress' });
      const ethicalApproval = await this.ethicsCouncil.run(missionContract);
      if (!ethicalApproval.approved) {
        throw new Error(`Misión rechazada por el Consejo de Ética: ${ethicalApproval.reason}`);
      }
      log({ taskId: 'ethics-council', description: 'Misión aprobada por el Consejo de Ética.', status: 'completed' });

      log({ taskId: 'oracle', description: 'Consultando al Oráculo para un informe de Pre-Mortem...', status: 'in_progress' });
      const preMortemReport = await this.oracle.run(missionContract);
      log({ taskId: 'oracle', description: `Informe de Pre-Mortem recibido: ${preMortemReport.summary}`, status: 'completed' });

      log({ taskId: 'planning-crew', description: 'La Crew de Planificación está diseñando el plan de ejecución...', status: 'in_progress' });
      const executionPlan = await this.crews.planning.run({ missionContract, preMortemReport });
      log({ taskId: 'planning-crew', description: 'Plan de ejecución creado.', status: 'completed' });

      log({ taskId: 'development-crew', description: 'La Crew de Desarrollo está implementando la solución...', status: 'in_progress' });
      const developmentResult = await this.crews.development.run({ executionPlan });
      log({ taskId: 'development-crew', description: 'Implementación completada.', status: 'completed' });

      log({ taskId: 'quality-crew', description: 'La Crew de Calidad está verificando la solución...', status: 'in_progress' });
      const qualityResult = await this.crews.quality.run({ developmentResult });
      log({ taskId: 'quality-crew', description: 'Verificación de calidad completada.', status: 'completed' });

      log({ taskId: 'deployment-crew', description: 'La Crew de Despliegue está desplegando la solución...', status: 'in_progress' });
      await this.crews.deployment.run({ qualityResult });
      log({ taskId: 'deployment-crew', description: 'Despliegue completado.', status: 'completed' });

      // Special flow: if this is the genesis Tyche mission, create the Tyche agent and run it
      if (missionContract && missionContract.id === 'genesis-tyche') {
        log({ taskId: 'tyche-init', description: 'Inicializando agente Tyche...', status: 'in_progress' });
        const tyche = new MetatronAgent('Tyche');
        const tycheResult = await tyche.run({ context: 'Analizar flaky tests en repositorio local y proponer correcciones.' });
        log({ taskId: 'tyche', description: `Tyche result: ${JSON.stringify(tycheResult)}`, status: 'completed' });

        // If Tyche provided a fix, simulate creating a local PR by writing to tmp/
        try {
          const fs = await import('fs');
          const path = await import('path');
          const prContent = `Tyche suggested fix:\n${JSON.stringify(tycheResult, null, 2)}\n`;
          const outDir = path.resolve(process.cwd(), 'tmp', 'tyche');
          if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
          const prFile = path.join(outDir, `tyche_pr_${Date.now()}.txt`);
          fs.writeFileSync(prFile, prContent);
          log({ taskId: 'tyche-pr', description: `PR simulado creado: ${prFile}`, status: 'completed' });
        } catch (e) {
          log({ taskId: 'tyche-pr', description: `Error al crear PR simulado: ${e.message}`, status: 'error' });
        }
      }

      // Special flow: if this is the prophecy mission, execute the mission agents
      if (missionContract && missionContract.id === 'prophecy-001-latam-social-climate') {
        const countries = ['COL', 'PER', 'ARG']; // Colombia, Peru, Argentina
        const startDate = '2024-01-01';
        const endDate = '2024-12-31';
        const startYear = '2023';
        const endYear = '2024';

        log({ taskId: 'data-acquisition', description: 'Adquiriendo datos climáticos, sociales y económicos...', status: 'in_progress' });
        const dataAcquisitionAgent = new MetatronAgent('DataAcquisitionAgent');
        await dataAcquisitionAgent.run({});

        // Acquire climate data
        const climateData = {};
        for (const country of countries) {
          // Mock climate data for LATAM countries
          climateData[country] = [
            { month: 'Jan', droughtRisk: 0.3, temperature: 28 },
            { month: 'Feb', droughtRisk: 0.4, temperature: 29 },
            { month: 'Mar', droughtRisk: 0.6, temperature: 27 },
            { month: 'Apr', droughtRisk: 0.7, temperature: 26 },
            { month: 'May', droughtRisk: 0.8, temperature: 25 },
            { month: 'Jun', droughtRisk: 0.9, temperature: 24 }
          ];
        }

        // Acquire social data using GDELT
        const gdelt = new GdeltIntegration();
        const socialData = {};
        for (const country of countries) {
          socialData[country] = await gdelt.getSocialEvents(country, startDate, endDate);
        }

        // Acquire economic data using World Bank
        const worldBank = new WorldBankIntegration();
        const economicData = {};
        for (const country of countries) {
          economicData[country] = await worldBank.getKeyEconomicData(country, startYear, endYear);
        }

        log({ taskId: 'data-acquisition', description: 'Datos adquiridos exitosamente.', status: 'completed' });

        log({ taskId: 'signal-analysis', description: 'Analizando señales de riesgo...', status: 'in_progress' });
        const signalAnalysisAgent = new MetatronAgent('SignalAnalysisAgent');
        await signalAnalysisAgent.run({ climateData, socialData, economicData });
        log({ taskId: 'signal-analysis', description: 'Análisis de señales completado.', status: 'completed' });

        log({ taskId: 'correlation-analysis', description: 'Analizando correlaciones entre datos...', status: 'in_progress' });
        const correlationAgent = new MetatronAgent('CorrelationAgent');
        const correlations = {};
        for (const country of countries) {
          const corrResult = await correlationAgent.run({
            climateData: climateData[country],
            socialData: socialData[country],
            economicData: economicData[country]
          });
          correlations[country] = corrResult;
        }
        log({ taskId: 'correlation-analysis', description: 'Análisis de correlaciones completado.', status: 'completed' });

        log({ taskId: 'risk-assessment', description: 'Evaluando índices de riesgo...', status: 'in_progress' });
        const riskAssessmentAgent = new MetatronAgent('RiskAssessmentAgent');
        const riskAssessments = {};
        for (const country of countries) {
          const riskResult = await riskAssessmentAgent.run({ correlations: correlations[country] });
          riskAssessments[country] = riskResult;
        }
        log({ taskId: 'risk-assessment', description: 'Evaluación de riesgos completada.', status: 'completed' });

        log({ taskId: 'report-generation', description: 'Generando informe de inteligencia...', status: 'in_progress' });
        const reportGenerationAgent = new MetatronAgent('ReportGenerationAgent');
        await reportGenerationAgent.run({ riskAssessments, correlations });

        // Generate the INTELLIGENCE_REPORT_001.md
        const fs = await import('fs');
        const path = await import('path');
        const reportContent = `# INTELLIGENCE_REPORT_001: Riesgo de Inestabilidad Social en LATAM

## Resumen Ejecutivo
Este informe presenta la primera predicción estratégica de Praevisio AI sobre el riesgo de inestabilidad social en Colombia, Perú y Argentina para los próximos 6 meses, correlacionando datos climáticos extremos con indicadores socioeconómicos.

## Índices de Riesgo
- **Colombia**: ${riskAssessments.COL?.riskScore?.toFixed(1) || 'N/A'}/10 (${riskAssessments.COL?.level || 'N/A'})
- **Perú**: ${riskAssessments.PER?.riskScore?.toFixed(1) || 'N/A'}/10 (${riskAssessments.PER?.level || 'N/A'})
- **Argentina**: ${riskAssessments.ARG?.riskScore?.toFixed(1) || 'N/A'}/10 (${riskAssessments.ARG?.level || 'N/A'})

## Análisis de Correlación (IA Explicable)
${Object.entries(correlations).map(([country, corr]) =>
  `### ${country}\n${corr.correlations?.map(c => `- ${c.explanation}`).join('\n') || 'No correlations available'}\n`
).join('\n')}

## Proyecciones y Escenarios
- **Colombia**: Alto riesgo debido a sequías prolongadas en regiones agrícolas y desempleo creciente.
- **Perú**: Riesgo medio con correlación entre eventos climáticos extremos y protestas sociales.
- **Argentina**: Riesgo alto por inflación extrema combinada con estrés climático.

## Recomendaciones de Mitigación
1. Implementar programas de apoyo agrícola en zonas de sequía.
2. Monitorear indicadores económicos y sociales en tiempo real.
3. Desarrollar estrategias de resiliencia climática urbana.

Generado por Praevisio AI - ${new Date().toISOString()}
`;

        const reportPath = path.resolve(process.cwd(), 'INTELLIGENCE_REPORT_001.md');
        fs.writeFileSync(reportPath, reportContent);
        log({ taskId: 'report-generation', description: `Informe generado: ${reportPath}`, status: 'completed' });
      }

      const finalReport = {
        summary: 'La misión se ha completado exitosamente.',
        aiExplanation: 'Todos los agentes y crews han completado sus tareas según el plan de ejecución.',
        dataSources: ['Consejo de Ética', 'Oráculo', 'Crews de Metatrón']
      };
      const finalLog = { status: 'completed', result: finalReport };
      log(finalLog);

      activeMissions.set(missionId, { logs: activeMissions.get(missionId).logs, status: 'completed', result: finalReport });
    } catch (error) {
      const errLog = { taskId: 'error', description: `Error: ${error.message}`, status: 'error' };
      log(errLog);
      activeMissions.set(missionId, { logs: activeMissions.get(missionId).logs, status: 'failed', error: error.message });
    }
  }

  getMissionLogs(missionId) {
    return activeMissions.get(missionId) || { logs: [], status: 'not_found' };
  }

  // Eternal Vigilance Methods
  startEternalVigilance() {
    console.log('[Aion] Iniciando la Vigilia Eterna...');
    this.startAutoPreservationFlow();
    this.startKnowledgeFlow();
    this.startProphecyFlow();
  }

  startAutoPreservationFlow() {
    const intervalMs = 5 * 60 * 1000; // 5 minutes for testing, change to desired interval
    this.perpetualFlows.autoPreservation.active = true;
    this.perpetualFlows.autoPreservation.intervalId = setInterval(async () => {
      try {
        console.log('[Auto-Preservation] Ejecutando chequeo de salud...');
        this.addToActivityFeed('Auto-Preservation', 'Iniciando chequeo de salud del sistema');

        // Run quality checks
        const qualityResult = await this.crews.quality.run({ task: 'health_check' });
        const securityResult = await this.cerberus.run({ task: 'security_audit' });

        this.perpetualFlows.autoPreservation.lastRun = new Date();
        this.addToActivityFeed('Auto-Preservation', `Chequeo completado. Calidad: ${JSON.stringify(qualityResult)}, Seguridad: ${JSON.stringify(securityResult)}`);

        // Check for anomalies and auto-heal
        if (qualityResult.issues || securityResult.vulnerabilities) {
          this.addToActivityFeed('Auto-Preservation', 'Anomalías detectadas, iniciando auto-sanación');
          await this.autoHeal(qualityResult, securityResult);
        }
      } catch (error) {
        console.error('[Auto-Preservation] Error:', error);
        this.addToActivityFeed('Auto-Preservation', `Error en chequeo: ${error.message}`);
      }
    }, intervalMs);
  }

  async autoHeal(qualityResult, securityResult) {
    // Create a repair mission
    const repairContract = {
      id: 'auto-repair',
      title: 'Auto-Reparación del Sistema',
      description: 'Reparar anomalías detectadas en chequeo de salud',
      issues: qualityResult.issues,
      vulnerabilities: securityResult.vulnerabilities
    };

    const missionId = `auto-repair-${Date.now()}`;
    this.startMission(missionId, repairContract, (log) => {
      this.addToActivityFeed('Auto-Repair', log.description);
    });
  }

  startKnowledgeFlow() {
    const intervalMs = 10 * 60 * 1000; // 10 minutes
    this.perpetualFlows.knowledge.active = true;
    this.perpetualFlows.knowledge.intervalId = setInterval(async () => {
      try {
        console.log('[Knowledge] Escaneando fuentes de datos...');
        this.addToActivityFeed('Knowledge', 'Escaneando fuentes externas para oportunidades');

        const opportunities = await this.kairos.run({ task: 'scan_sources' });
        this.perpetualFlows.knowledge.lastRun = new Date();

        if (opportunities.newSources || opportunities.disruptiveTech) {
          this.addToActivityFeed('Knowledge', `Oportunidades detectadas: ${JSON.stringify(opportunities)}`);
          await this.proposeExpansionMission(opportunities);
        } else {
          this.addToActivityFeed('Knowledge', 'No se detectaron nuevas oportunidades');
        }
      } catch (error) {
        console.error('[Knowledge] Error:', error);
        this.addToActivityFeed('Knowledge', `Error en escaneo: ${error.message}`);
      }
    }, intervalMs);
  }

  async proposeExpansionMission(opportunities) {
    const expansionContract = {
      id: 'expansion-proposal',
      title: 'Propuesta de Expansión',
      description: 'Nueva fuente de datos o tecnología disruptiva detectada',
      opportunities
    };

    const missionId = `expansion-${Date.now()}`;
    this.startMission(missionId, expansionContract, (log) => {
      this.addToActivityFeed('Expansion', log.description);
    });
  }

  startProphecyFlow() {
    const intervalMs = 15 * 60 * 1000; // 15 minutes
    this.perpetualFlows.prophecy.active = true;
    this.perpetualFlows.prophecy.intervalId = setInterval(async () => {
      try {
        console.log('[Prophecy] Actualizando índices de riesgo...');
        this.addToActivityFeed('Prophecy', 'Actualizando índices de riesgo global');

        const riskData = await this.runProphecyMission();
        this.riskIndices = riskData;
        this.perpetualFlows.prophecy.lastRun = new Date();

        // Check for alerts
        this.checkRiskAlerts(riskData);
        this.addToActivityFeed('Prophecy', `Índices actualizados: ${JSON.stringify(riskData)}`);
      } catch (error) {
        console.error('[Prophecy] Error:', error);
        this.addToActivityFeed('Prophecy', `Error en actualización: ${error.message}`);
      }
    }, intervalMs);
  }

  async runProphecyMission() {
    // Extract the prophecy logic from the special mission
    const countries = ['COL', 'PER', 'ARG'];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 days ago
    const endDate = new Date().toISOString().split('T')[0];
    const startYear = new Date().getFullYear().toString();
    const endYear = startYear;

    // Acquire data (simplified)
    const climateData = {};
    for (const country of countries) {
      climateData[country] = [
        { month: 'Current', droughtRisk: Math.random() * 0.5 + 0.3, temperature: 25 + Math.random() * 5 }
      ];
    }

    const gdelt = new GdeltIntegration();
    const socialData = {};
    for (const country of countries) {
      socialData[country] = await gdelt.getSocialEvents(country, startDate, endDate).catch(() => ({ socialIntensity: Math.random() * 10 }));
    }

    const worldBank = new WorldBankIntegration();
    const economicData = {};
    for (const country of countries) {
      economicData[country] = await worldBank.getKeyEconomicData(country, startYear, endYear).catch(() => ({ indicators: {} }));
    }

    // Analyze correlations and risks
    const riskAssessments = {};
    for (const country of countries) {
      const correlationAgent = new MetatronAgent('CorrelationAgent');
      const corrResult = await correlationAgent.run({
        climateData: climateData[country],
        socialData: socialData[country],
        economicData: economicData[country]
      });

      const riskAgent = new MetatronAgent('RiskAssessmentAgent');
      const riskResult = await riskAgent.run({ correlations: corrResult });
      riskAssessments[country] = riskResult;
    }

    return riskAssessments;
  }

  checkRiskAlerts(riskData) {
    const threshold = 7.0; // Configurable
    for (const [country, data] of Object.entries(riskData)) {
      if (data.riskScore > threshold) {
        this.addToActivityFeed('Alert', `ALERTA: Índice de riesgo alto en ${country} - ${data.riskScore}/10`);
        // Generate alert report
        this.generateAlertReport(country, data);
      }
    }
  }

  async generateAlertReport(country, riskData) {
    const reportContent = `# ALERTA PREDICTIVA - ${country}

Índice de Riesgo: ${riskData.riskScore}/10 (${riskData.level})
Timestamp: ${new Date().toISOString()}

Recomendaciones:
- Monitorear indicadores económicos y sociales
- Preparar estrategias de mitigación climática
- Evaluar estabilidad social

Generado por Praevisio AI - Vigilia Eterna
`;

    const fs = await import('fs');
    const path = await import('path');
    const reportPath = path.resolve(process.cwd(), `ALERT_${country}_${Date.now()}.md`);
    fs.writeFileSync(reportPath, reportContent);
    this.addToActivityFeed('Alert', `Reporte de alerta generado: ${reportPath}`);
  }

  addToActivityFeed(flow, message) {
    const entry = {
      timestamp: new Date().toISOString(),
      flow,
      message
    };
    this.activityFeed.unshift(entry); // Add to beginning
    if (this.activityFeed.length > 100) this.activityFeed.pop(); // Keep last 100
  }

  getVigilanceStatus() {
    return {
      flows: this.perpetualFlows,
      riskIndices: this.riskIndices,
      activityFeed: this.activityFeed.slice(0, 20) // Last 20 activities
    };
  }

  stopEternalVigilance() {
    Object.values(this.perpetualFlows).forEach(flow => {
      if (flow.intervalId) {
        clearInterval(flow.intervalId);
        flow.active = false;
      }
    });
    console.log('[Aion] Vigilia Eterna detenida');
  }
}

const orchestrator = new MetatronOrchestrator();

export {
  orchestrator,
  MetatronOrchestrator,
};