import { getChromaClient, getNeo4jDriver } from './database.js';
import MetatronAgent from './agents.js';
console.log('MetatronAgent imported:', typeof MetatronAgent, MetatronAgent);
import { publish } from './eventHub.js';
import * as os from 'os';

// Importar servicio de vigilia eterna para publicar eventos
let eternalVigilanceService = null;
(async () => {
  try {
    eternalVigilanceService = (await import('./eternalVigilanceService.js')).default;
  } catch (e) {
    console.error('Error importing eternal vigilance service:', e);
  }
})();

const activeMissions = new Map();

class LogosKernel {
  constructor() {
  // In native dev mode we avoid initializing external services
  this.chromaClient = (process.env.NATIVE_DEV_MODE === 'true') ? null : getChromaClient();
  this.neo4jDriver = null;
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

    // Inicializar drivers y servicios (skip en entorno de test para evitar side-effects)
    if (process.env.NODE_ENV !== 'test') {
      this.initializeDrivers();
    }
  }

  async initializeDrivers() {
    try {
      if (process.env.NATIVE_DEV_MODE === 'true' || process.env.NODE_ENV === 'test') {
        console.log('LogosKernel: Skipping Neo4j initialization in test/native modes');
      } else {
        this.neo4jDriver = await getNeo4jDriver();
        console.log('LogosKernel: Neo4j driver initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize Neo4j driver in LogosKernel:', error);
    }

    // Inicializar monitoreo de recursos
    if (process.env.NODE_ENV !== 'test') this.startResourceMonitoring();

    // Flujos perpetuos desacoplados a funciones serverless para hibernación inteligente
    console.log('LogosKernel: Perpetual flows decoupled to serverless functions for eternal efficiency');
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

  // Publicar eventos a la vigilia eterna
  publishToVigilance(event) {
    if (eternalVigilanceService) {
      eternalVigilanceService.emitEvent(event);
    }
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
        if (process.env.NATIVE_DEV_MODE === 'true') {
          // In native dev mode we skip best-effort persistence to external DBs
        } else {
          if (this.chromaClient && this.chromaClient.upsertLog) {
            this.chromaClient.upsertLog(missionId, task).catch(() => {});
          }
        }
      } catch { /* ignore persistence errors */ }
      // Persist to Neo4j (best-effort): create a Mission node and a Log node
      try {
        if (process.env.NATIVE_DEV_MODE === 'true') {
          // Skip neo4j persistence in native dev mode
        } else {
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
        let dataResult;
        try {
          dataResult = await dataAcquisitionAgent.run({ countries: ['COL', 'PER', 'ARG'], period: { start: new Date().toISOString().split('T')[0], end: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } });
          log({ taskId: 'data-acquisition', description: 'Datos recopilados exitosamente.', status: 'completed' });
        } catch (error) {
          // Fallback to mock data if acquisition fails
          dataResult = {
            COL: { climate: { temperature: 25, precipitation: 50 }, economic: { inflation: 5, unemployment: 10 }, debt: { country: 'COL', period: { startYear: '2024', endYear: '2025' }, debtData: [{ year: '2024', value: 55 }, { year: '2025', value: 57 }], isMock: true }, social: { eventCount: 3, events: [] } },
            PER: { climate: { temperature: 20, precipitation: 30 }, economic: { inflation: 3, unemployment: 8 }, debt: { country: 'PER', period: { startYear: '2024', endYear: '2025' }, debtData: [{ year: '2024', value: 35 }, { year: '2025', value: 36 }], isMock: true }, social: { eventCount: 2, events: [] } },
            ARG: { climate: { temperature: 18, precipitation: 40 }, economic: { inflation: 15, unemployment: 12 }, debt: { country: 'ARG', period: { startYear: '2024', endYear: '2025' }, debtData: [{ year: '2024', value: 85 }, { year: '2025', value: 87 }], isMock: true }, social: { eventCount: 5, events: [] } }
          };
          log({ taskId: 'data-acquisition', description: 'Error en adquisición de datos, usando datos mock como fallback.', status: 'warning' });
        }

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
        autoPreservation: { active: 'serverless', decoupled: true, endpoint: '/api/auto-preservation' },
        knowledge: { active: 'serverless', decoupled: true, endpoint: '/api/knowledge' },
        prophecy: { active: 'serverless', decoupled: true, endpoint: '/api/prophecy' },
      },
      riskIndices: this.riskIndices,
      activityFeed: this.activityFeed,
      hibernation: {
        status: 'enabled',
        reason: 'Perpetual flows decoupled to serverless functions for eternal efficiency'
      }
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