import { getChromaClient, getNeo4jDriver } from './database.js';
import { MetatronAgent } from './agents.js';
import { publish } from './eventHub.js';

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
}

const orchestrator = new MetatronOrchestrator();

export {
  orchestrator,
  MetatronOrchestrator,
};