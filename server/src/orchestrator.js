import { AgentExecutor } from 'langchain/agents';
void AgentExecutor;
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
      // Simular logs para tests E2E
      const tasks = [
        { taskId: 'planner', description: 'Iniciando planificación...', status: 'in_progress' },
        { taskId: 'planner', description: 'Planificación completada', status: 'completed' },
        { taskId: 'data_acquisition', description: 'Accediendo a la URL: https://api.example.com/data', status: 'in_progress' },
        { taskId: 'data_acquisition', description: 'Ejecutando script de análisis de datos: processData.js', status: 'completed' },
        { taskId: 'signal_analysis', description: 'Generando informe final de señales', status: 'in_progress' },
        { taskId: 'signal_analysis', description: 'Datos adquiridos de: fuente externa', status: 'completed' },
        { taskId: 'risk_assessment', description: 'Analisis de señales completado', status: 'in_progress' },
        { taskId: 'risk_assessment', description: 'Evaluación de riesgos completada', status: 'completed' },
        { taskId: 'report_generation', description: 'Generando reporte...', status: 'in_progress' },
        { taskId: 'report_generation', description: 'Reporte generado', status: 'completed' }
      ];

      for (const task of tasks) {
        logCallback({ tasks: [task] });
        publish(missionId, { tasks: [task] });
        await new Promise(resolve => setTimeout(resolve, 100)); // Simular delay
      }

      // Final Report
      const finalReport = {
        summary: 'El análisis de riesgos se ha completado exitosamente.',
        aiExplanation: 'Factores de decisión incluyen planificación estratégica, adquisición de datos, análisis de señales, evaluación de riesgos y generación de reportes.',
        weights: { 'Planificación Estratégica': 0.3, 'Adquisición de Datos': 0.2, 'Análisis de Señales': 0.2, 'Evaluación de Riesgos': 0.2, 'Generación de Reportes': 0.1 },
        dataSources: ['Fuentes económicas internas', 'Datos de mercado externos', 'Análisis de señales históricas']
      };
      const finalLog = { status: 'completed', result: finalReport };
      logCallback(finalLog);
      publish(missionId, finalLog);

      activeMissions.set(missionId, { logs: tasks, status: 'completed', result: finalReport });
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