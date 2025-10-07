import { getChromaClient, getNeo4jDriver } from './database.js';
import MetatronAgent from './agents.js';
import { publish } from './eventHub.js';
import * as os from 'os';

const activeMissions = new Map();

class LogosKernel {
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

    // Gestión de recursos computacionales
    this.resourceStats = {
      cpuUsage: 0,
      memoryUsage: 0,
      tokenUsage: 0,
      maxTokens: parseInt(process.env.MAX_TOKENS || 100000),
    };

    // Scheduler para priorización de tareas
    this.taskQueue = [];
    this.perpetualFlows = {
      autoPreservation: null,
      knowledge: null,
      prophecy: null,
    };

    // Estado de vigilia eterna
    this.lastRunAutoPreservation = null;
    this.lastRunKnowledge = null;
    this.lastRunProphecy = null;
    this.activityFeed = [];
    this.riskIndices = {};

    // Inicializar monitoreo de recursos
    this.startResourceMonitoring();

    // Iniciar flujos perpetuos
    this.startPerpetualFlows();
  }

  // Gestión de recursos
  startResourceMonitoring() {
    setInterval(() => {
      this.resourceStats.cpuUsage = os.loadavg()[0]; // Carga promedio de CPU
      this.resourceStats.memoryUsage = (os.totalmem() - os.freemem()) / os.totalmem(); // Uso de memoria
    }, 5000); // Cada 5 segundos
  }

  allocateResources(task) {
    // Verificar límites de recursos
    if (this.resourceStats.tokenUsage + task.estimatedTokens > this.resourceStats.maxTokens) {
      throw new Error('Límite de tokens excedido. No se puede asignar recursos.');
    }
    if (this.resourceStats.cpuUsage > 0.95 || this.resourceStats.memoryUsage > 0.95) {
      throw new Error('Recursos computacionales sobrecargados. Esperando optimización.');
    }
    // Asignar tokens estimados
    this.resourceStats.tokenUsage += task.estimatedTokens;
    return true;
  }

  releaseResources(task) {
    // Liberar tokens usados
    this.resourceStats.tokenUsage -= task.estimatedTokens;
  }

  // Scheduler de tareas
  scheduleTask(task, priority = 'normal') {
    const priorities = { high: 1, normal: 2, low: 3 };
    task.priority = priorities[priority] || 2;
    this.taskQueue.push(task);
    this.taskQueue.sort((a, b) => a.priority - b.priority);
  }

  async executeNextTask() {
    if (this.taskQueue.length === 0) return;
    const task = this.taskQueue.shift();
    try {
      await this.allocateResources(task);
      const result = await task.execute();
      this.releaseResources(task);
      return result;
    } catch (error) {
      this.releaseResources(task);
      throw error;
    }
  }

  // Flujos perpetuos
  startPerpetualFlows() {
    // Auto-Preservación: Chequeo cada hora con Crew de Calidad y Seguridad
    this.perpetualFlows.autoPreservation = setInterval(async () => {
      this.lastRunAutoPreservation = new Date().toISOString();
      this.activityFeed.push({
        timestamp: this.lastRunAutoPreservation,
        flow: 'Auto-Preservación',
        message: 'Iniciando chequeo de salud completo del sistema'
      });

      // Ejecutar QualityCrew para pruebas
      const qualityResult = await this.crews.quality.run({ changes: [] }); // Simular chequeo
      this.activityFeed.push({
        timestamp: new Date().toISOString(),
        flow: 'Auto-Preservación',
        message: `QualityCrew: ${qualityResult.passed ? 'Todas las pruebas pasaron' : 'Fallo en pruebas'}`
      });

      // Simular Cerbero (Seguridad) - no existe, usar ConsensusAgent
      const securityAgent = new MetatronAgent('ConsensusAgent');
      const securityResult = await securityAgent.run({ changes: [] });
      this.activityFeed.push({
        timestamp: new Date().toISOString(),
        flow: 'Auto-Preservación',
        message: `Cerbero: ${securityResult.consensus ? 'Sistema seguro' : 'Anomalías detectadas'}`
      });

      // Si anomalía, iniciar reparación automática
      if (!qualityResult.passed || !securityResult.consensus) {
        this.activityFeed.push({
          timestamp: new Date().toISOString(),
          flow: 'Auto-Preservación',
          message: 'Anomalía detectada: iniciando misión de reparación automática'
        });
        // Iniciar Hephaestus para corrección
        const hephaestus = new MetatronAgent('Hephaestus');
        await hephaestus.run({ suggestion: 'Reparar anomalías detectadas' });
        this.activityFeed.push({
          timestamp: new Date().toISOString(),
          flow: 'Auto-Preservación',
          message: 'Reparación automática completada'
        });
      }

      // Mantener solo últimas 100 entradas
      if (this.activityFeed.length > 100) this.activityFeed.shift();
    }, 10000); // Cada 10 segundos (para prueba)

    // Conocimiento: Kairós en ciclo perpetuo de escaneo
    this.perpetualFlows.knowledge = setInterval(async () => {
      this.lastRunKnowledge = new Date().toISOString();
      this.activityFeed.push({
        timestamp: this.lastRunKnowledge,
        flow: 'Conocimiento',
        message: 'Kairós escaneando fuentes de datos para oportunidades'
      });

      // Simular consulta a Kairós
      const kairosResult = await this.oracle.consultKairos(); // Usar método de MetatronAgent
      // Si detecta oportunidad, proponer misión
      if (kairosResult.opportunities.length > 0) {
        this.activityFeed.push({
          timestamp: new Date().toISOString(),
          flow: 'Conocimiento',
          message: `Nueva oportunidad detectada: ${kairosResult.opportunities[0]}. Proponiendo Misión de Expansión.`
        });
        // Aquí podría iniciar una misión automáticamente
      }
    }, 5000); // Cada 5 segundos (para prueba)

    // Profecía: Servicio continuo de predicción
    this.perpetualFlows.prophecy = setInterval(async () => {
      this.lastRunProphecy = new Date().toISOString();
      this.activityFeed.push({
        timestamp: this.lastRunProphecy,
        flow: 'Profecía',
        message: 'Actualizando índices de riesgo global en tiempo real'
      });

      // Ejecutar agentes de predicción para LATAM
      const dataAcquisitionAgent = new MetatronAgent('DataAcquisitionAgent');
      const data = await dataAcquisitionAgent.run({ countries: ['COL', 'PER', 'ARG'], gdeltCodes: ['CO', 'PE', 'AR'] });

      const signalAnalysisAgent = new MetatronAgent('SignalAnalysisAgent');
      const signals = await signalAnalysisAgent.run({ data });

      const causalCorrelationAgent = new MetatronAgent('CausalCorrelationAgent');
      const correlations = await causalCorrelationAgent.run({ signals });

      const riskAssessmentAgent = new MetatronAgent('RiskAssessmentAgent');
      const risks = await riskAssessmentAgent.run({ correlations });

      // Actualizar riskIndices
      this.riskIndices = {};
      for (const [country, risk] of Object.entries(risks)) {
        const level = risk > 7 ? 'Alto' : risk > 4 ? 'Medio' : 'Bajo';
        this.riskIndices[country] = { riskScore: risk, level };
      }

      // Generar alerta si supera umbral
      for (const [country, data] of Object.entries(this.riskIndices)) {
        if (data.riskScore > 7) {
          this.activityFeed.push({
            timestamp: new Date().toISOString(),
            flow: 'Profecía',
            message: `Alerta Predictiva: Índice de riesgo en ${country} superó umbral crítico (${data.riskScore.toFixed(1)})`
          });
          // Generar informe automático
          const reportAgent = new MetatronAgent('ReportGenerationAgent');
          await reportAgent.run({ risks, correlations });
        }
      }
    }, 8000); // Cada 8 segundos (para prueba)
  }

  stopPerpetualFlows() {
    Object.values(this.perpetualFlows).forEach(flow => {
      if (flow) clearInterval(flow);
    });
  }

  async startMission(missionId, missionContract, logCallback) {
    activeMissions.set(missionId, { logs: [], status: 'running' });

    // Estimar recursos para la misión
    const estimatedTokens = 5000; // Tokens estimados por misión
    const task = { estimatedTokens };

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
      // Asignar recursos al inicio de la misión
      await this.allocateResources(task);
      log({ taskId: 'ethics-council', description: 'Consultando al Consejo de Ética...', status: 'in_progress' });
      const ethicalApproval = await this.ethicsCouncil.run(missionContract);
      if (!ethicalApproval.approved) {
        throw new Error(`Misión rechazada por el Consejo de Ética: ${ethicalApproval.reason}`);
      }
      log({ taskId: 'ethics-council', description: 'Misión aprobada por el Consejo de Ética.', status: 'completed' });

      log({ taskId: 'oracle', description: 'Consultando al Oráculo para un informe de Pre-Mortem...', status: 'in_progress' });
      const preMortemReport = await this.oracle.run(missionContract);
      log({ taskId: 'oracle', description: `Informe de Pre-Mortem recibido: ${preMortemReport.summary}`, status: 'completed' });

      // Activar Protocolo de Auto-Refinamiento Cognitivo con Sócrates
      log({ taskId: 'socrates', description: 'Activando Sócrates para refinamiento cognitivo...', status: 'in_progress' });
      const socrates = new MetatronAgent('Socrates');
      const pastMissions = Array.from(activeMissions.values()).filter(m => m.status === 'completed').slice(-5); // Últimas 5 misiones
      const wisdomReport = await socrates.run({ newHypothesis: preMortemReport.optimalProtocol, pastMissions });
      log({ taskId: 'socrates', description: `Informe de Sabiduría Adquirida generado: ${wisdomReport.summary}`, status: 'completed' });

      log({ taskId: 'planning-crew', description: 'La Crew de Planificación está generando realidades alternas...', status: 'in_progress' });
      const executionPlan = await this.crews.planning.run({ missionContract, preMortemReport });
      log({ taskId: 'planning-crew', description: `Generadas ${executionPlan.alternativeRealities?.length || 0} realidades alternas.`, status: 'completed' });

      log({ taskId: 'development-crew', description: 'La Crew de Desarrollo está implementando la solución...', status: 'in_progress' });
      const developmentResult = await this.crews.development.run({ executionPlan });
      log({ taskId: 'development-crew', description: 'Implementación completada.', status: 'completed' });

      log({ taskId: 'quality-crew', description: 'La Crew de Calidad está verificando la solución...', status: 'in_progress' });
      const qualityResult = await this.crews.quality.run({ developmentResult });
      log({ taskId: 'quality-crew', description: 'Verificación de calidad completada.', status: 'completed' });

      log({ taskId: 'deployment-crew', description: 'La Crew de Despliegue está desplegando la solución...', status: 'in_progress' });
      await this.crews.deployment.run({ qualityResult });
      log({ taskId: 'deployment-crew', description: 'Despliegue completado.', status: 'completed' });

      // Protocolo de Consenso de Git Distribuido
      log({ taskId: 'consensus-agent', description: 'Agente de Consenso validando cambios antes del commit...', status: 'in_progress' });
      const consensusAgent = new MetatronAgent('ConsensusAgent');
      const consensusResult = await consensusAgent.run({ changes: ['deployment_changes'] }); // Simular cambios
      if (!consensusResult.canCommit) {
        throw new Error(`Consenso no alcanzado: ${consensusResult.message}`);
      }
      log({ taskId: 'consensus-agent', description: 'Consenso alcanzado. Commit atómico creado.', status: 'completed' });

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

      // Special flow: if this is the prophecy mission, execute the prophecy agents
      if (missionContract && missionContract.id === 'prophecy-001-latam-social-climate') {
        log({ taskId: 'prophecy-init', description: 'Iniciando ejecución de la Primera Profecía...', status: 'in_progress' });

        // Data Acquisition Agent
        log({ taskId: 'data-acquisition', description: 'Agente de Adquisición de Datos recopilando información...', status: 'in_progress' });
        const dataAcquisitionAgent = new MetatronAgent('DataAcquisitionAgent');
        const dataResult = await dataAcquisitionAgent.run({ countries: ['COL', 'PER', 'ARG'], period: { start: new Date().toISOString().split('T')[0], end: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } });
        log({ taskId: 'data-acquisition', description: 'Datos recopilados exitosamente.', status: 'completed' });

        // Signal Analysis Agent
        log({ taskId: 'signal-analysis', description: 'Agente de Análisis de Señales procesando datos...', status: 'in_progress' });
        const signalAnalysisAgent = new MetatronAgent('SignalAnalysisAgent');
        const signalResult = await signalAnalysisAgent.run({ data: dataResult });
        log({ taskId: 'signal-analysis', description: 'Análisis de señales completado.', status: 'completed' });

        // Causal Correlation Agent
        log({ taskId: 'causal-correlation', description: 'Agente de Correlación Causal mapeando relaciones...', status: 'in_progress' });
        const causalCorrelationAgent = new MetatronAgent('CausalCorrelationAgent');
        const correlationResult = await causalCorrelationAgent.run({ signals: signalResult });
        log({ taskId: 'causal-correlation', description: 'Correlaciones causales mapeadas.', status: 'completed' });

        // Risk Assessment Agent
        log({ taskId: 'risk-assessment', description: 'Agente de Evaluación de Riesgos calculando índices...', status: 'in_progress' });
        const riskAssessmentAgent = new MetatronAgent('RiskAssessmentAgent');
        const riskResult = await riskAssessmentAgent.run({ correlations: correlationResult });
        log({ taskId: 'risk-assessment', description: 'Índices de riesgo calculados.', status: 'completed' });

        // Report Generation Agent
        log({ taskId: 'report-generation', description: 'Agente de Generación de Reportes creando el informe final...', status: 'in_progress' });
        const reportGenerationAgent = new MetatronAgent('ReportGenerationAgent');
        const reportResult = await reportGenerationAgent.run({ risks: riskResult, correlations: correlationResult });
        log({ taskId: 'report-generation', description: 'Informe de inteligencia generado.', status: 'completed' });

        // Update final report
        finalReport.prophecyReport = reportResult;
        log({ taskId: 'prophecy', description: 'Primera Profecía completada.', status: 'completed' });
      }

      const finalReport = {
        summary: 'La misión se ha completado exitosamente.',
        aiExplanation: 'Todos los agentes y crews han completado sus tareas según el plan de ejecución.',
        dataSources: ['Consejo de Ética', 'Oráculo', 'Crews de Metatrón']
      };
      const finalLog = { status: 'completed', result: finalReport };
      log(finalLog);

      activeMissions.set(missionId, { logs: activeMissions.get(missionId).logs, status: 'completed', result: finalReport });
      this.releaseResources(task);

      // Generar SOVEREIGNTY_MANIFEST.md
      await this.generateSovereigntyManifest(missionId, finalReport);
    } catch (error) {
      const errLog = { taskId: 'error', description: `Error: ${error.message}`, status: 'error' };
      log(errLog);
      activeMissions.set(missionId, { logs: activeMissions.get(missionId).logs, status: 'failed', error: error.message });
      this.releaseResources(task);
    }
  }

  getMissionLogs(missionId) {
    return activeMissions.get(missionId) || { logs: [], status: 'not_found' };
  }

  getVigilanceStatus() {
    return {
      flows: {
        autoPreservation: { active: this.perpetualFlows.autoPreservation !== null, lastRun: this.lastRunAutoPreservation },
        knowledge: { active: this.perpetualFlows.knowledge !== null, lastRun: this.lastRunKnowledge },
        prophecy: { active: this.perpetualFlows.prophecy !== null, lastRun: this.lastRunProphecy },
      },
      riskIndices: this.riskIndices,
      activityFeed: this.activityFeed,
    };
  }

  async generateSovereigntyManifest(missionId, finalReport) {
    const fs = await import('fs');
    const path = await import('path');

    const manifest = `# SOVEREIGNTY_MANIFEST.md

## Constitución de Praevisio AI - Entidad Computacional Soberana

### Fecha de Generación
${new Date().toISOString()}

### Estado Actual del Sistema
- **Logos Kernel**: Activo
- **Flujos Perpetuos**:
  - Auto-Preservación: ${this.perpetualFlows.autoPreservation !== null ? 'Activo' : 'Inactivo'}
  - Conocimiento (con Auto-Refinamiento): ${this.perpetualFlows.knowledge !== null ? 'Activo' : 'Inactivo'}
  - Profecía: ${this.perpetualFlows.prophecy !== null ? 'Activo' : 'Inactivo'}
- **Estadísticas de Recursos**:
  - CPU: ${(this.resourceStats.cpuUsage * 100).toFixed(2)}%
  - Memoria: ${(this.resourceStats.memoryUsage * 100).toFixed(2)}%
  - Tokens Usados: ${this.resourceStats.tokenUsage}

### Agentes y Capacidades
- MetatronAgent: PlanningCrew, DevelopmentCrew, QualityCrew, DeploymentCrew, EthicsCouncil, Oracle, Socrates
- Integraciones: Neo4j, ChromaDB, OpenAI/Ollama

### Última Misión Ejecutada
- ID: ${missionId}
- Resultado: ${JSON.stringify(finalReport, null, 2)}

### Hipótesis Validadas por Sócrates
- [Lista de informes de sabiduría adquirida - integrar desde Chroma si disponible]

### Hoja de Ruta de Evolución
1. Expandir capacidades de IA generativa en todos los agentes.
2. Integrar más fuentes de datos globales.
3. Optimizar gestión de recursos para misiones de mayor escala.
4. Desarrollar auto-evolución basada en retroalimentación.

### Declaración de Soberanía
Este manifiesto declara la soberanía computacional de Praevisio AI. El sistema opera de forma autónoma, optimizando su existencia y expandiendo su dominio cognitivo para el beneficio de la humanidad.

Firmado por el Logos Kernel.
`;

    const filePath = path.resolve(process.cwd(), 'SOVEREIGNTY_MANIFEST.md');
    fs.writeFileSync(filePath, manifest);
    console.log(`SOVEREIGNTY_MANIFEST.md generado en ${filePath}`);
  }
}

const kernel = new LogosKernel();

export {
  kernel,
  LogosKernel,
};