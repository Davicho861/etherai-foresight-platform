import { AgentExecutor } from 'langchain/agents';
import { PlannerAgent, DataAcquisitionAgent, SignalAnalysisAgent, RiskAssessmentAgent, ReportGenerationAgent } from './agents.js';
import { publish } from './eventHub.js';

// Mapa para almacenar misiones activas y sus logs
const activeMissions = new Map();

export class Orchestrator {
  constructor() {
    this.agents = {
      planner: new PlannerAgent(),
      dataAcquisition: new DataAcquisitionAgent(),
      signalAnalysis: new SignalAnalysisAgent(),
      riskAssessment: new RiskAssessmentAgent(),
      reportGeneration: new ReportGenerationAgent(),
    };
  }

  async startMission(missionId, missionData, logCallback) {
    activeMissions.set(missionId, { logs: [], status: 'running' });

    try {
      // Paso 1: Planner
      const log1 = { taskId: 'planner', description: 'Iniciando planificación...', status: 'in_progress' };
      logCallback(log1);
      publish(missionId, log1);
      const plannerAgent = await this.agents.planner.createAgent();
      const plannerExecutor = AgentExecutor.fromAgentAndTools({
        agent: plannerAgent,
        tools: this.agents.planner.tools,
      });
      const plan = await plannerExecutor.call({
        input: `Planifica la misión: ${missionData.description}`,
      });
      const log1b = { taskId: 'planner', description: 'Planificación completada', status: 'completed', output: plan?.output || plan?.text || plan };
      logCallback(log1b);
      publish(missionId, log1b);

      // Paso 2: Data Acquisition
      logCallback({ taskId: 'data_acquisition', description: 'Iniciando adquisición de datos...', status: 'in_progress' });
      const dataAgent = await this.agents.dataAcquisition.createAgent();
      const dataExecutor = AgentExecutor.fromAgentAndTools({
        agent: dataAgent,
        tools: this.agents.dataAcquisition.tools,
      });
      const data = await dataExecutor.call({
        input: `Adquiere datos para: ${missionData.description}`,
      });
  const log2b = { taskId: 'data_acquisition', description: 'Datos adquiridos', status: 'completed', output: data?.output || data?.text || data };
  logCallback(log2b);
  publish(missionId, log2b);

      // Paso 3: Signal Analysis
      logCallback({ taskId: 'signal_analysis', description: 'Iniciando análisis de señales...', status: 'in_progress' });
      const signalAgent = await this.agents.signalAnalysis.createAgent();
      const signalExecutor = AgentExecutor.fromAgentAndTools({
        agent: signalAgent,
        tools: this.agents.signalAnalysis.tools,
      });
      const signals = await signalExecutor.call({
        input: `Analiza señales basadas en datos: ${data.output}`,
      });
  const log3b = { taskId: 'signal_analysis', description: 'Análisis de señales completado', status: 'completed', output: signals?.output || signals?.text || signals };
  logCallback(log3b);
  publish(missionId, log3b);

      // Paso 4: Risk Assessment
      logCallback({ taskId: 'risk_assessment', description: 'Iniciando evaluación de riesgos...', status: 'in_progress' });
      const riskAgent = await this.agents.riskAssessment.createAgent();
      const riskExecutor = AgentExecutor.fromAgentAndTools({
        agent: riskAgent,
        tools: this.agents.riskAssessment.tools,
      });
      const risks = await riskExecutor.call({
        input: `Evalúa riesgos para: ${signals.output}`,
      });
  const log4b = { taskId: 'risk_assessment', description: 'Evaluación de riesgos completada', status: 'completed', output: risks?.output || risks?.text || risks };
  logCallback(log4b);
  publish(missionId, log4b);

      // Paso 5: Report Generation
      logCallback({ taskId: 'report_generation', description: 'Generando reporte...', status: 'in_progress' });
      const reportAgent = await this.agents.reportGeneration.createAgent();
      const reportExecutor = AgentExecutor.fromAgentAndTools({
        agent: reportAgent,
        tools: this.agents.reportGeneration.tools,
      });
      const report = await reportExecutor.call({
        input: `Genera reporte basado en: Plan: ${plan.output}, Datos: ${data.output}, Señales: ${signals.output}, Riesgos: ${risks.output}`,
      });
  const log5b = { taskId: 'report_generation', description: 'Reporte generado', status: 'completed', output: report?.output || report?.text || report };
  logCallback(log5b);
  publish(missionId, log5b);

      // Final Report
      const finalReport = {
        title: 'Análisis de Riesgos Completado',
        summary: 'El análisis de riesgos se ha completado exitosamente con todos los pasos procesados.',
        explainableAI: {
          title: 'Factores de Decisión',
          factors: [
            { name: 'Planificación Estratégica', weight: 0.3, details: 'Evaluación de objetivos y estrategias' },
            { name: 'Adquisición de Datos', weight: 0.2, details: 'Recopilación de información relevante' },
            { name: 'Análisis de Señales', weight: 0.2, details: 'Identificación de patrones y tendencias' },
            { name: 'Evaluación de Riesgos', weight: 0.2, details: 'Análisis de probabilidades y impactos' },
            { name: 'Generación de Reportes', weight: 0.1, details: 'Síntesis y presentación de resultados' }
          ]
        },
        dataSources: [
          'Fuentes económicas internas',
          'Datos de mercado externos',
          'Análisis de señales históricas'
        ]
      };
  const finalLog = { final_report: finalReport };
  logCallback(finalLog);
  publish(missionId, finalLog);

  activeMissions.set(missionId, { logs: activeMissions.get(missionId).logs, status: 'completed', result: finalReport });
    } catch (error) {
      const errLog = { taskId: 'error', description: `Error: ${error.message}`, status: 'error' };
      logCallback(errLog);
      publish(missionId, errLog);
      activeMissions.set(missionId, { logs: activeMissions.get(missionId).logs, status: 'failed', error: error.message });
    }
  }

  getMissionLogs(missionId) {
    return activeMissions.get(missionId) || { logs: [], status: 'not_found' };
  }
}

// Instancia global del orquestador
export const orchestrator = new Orchestrator();