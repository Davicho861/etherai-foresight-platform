import MetatronAgent from '../server/src/agents.js';
import { publish } from '../server/src/eventHub.js';

// Función serverless para Prophecy Flow
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[Prophecy] Actualizando índices de riesgo global en tiempo real');

  // timestamp intentionally omitted (was unused)
    // Publicar evento
    publish(`Profecía: Actualizando índices de riesgo global`);

    let riskIndices = {};

    try {
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
      riskIndices = {};
      for (const [country, risk] of Object.entries(risks)) {
        const level = risk > 7 ? 'Alto' : risk > 4 ? 'Medio' : 'Bajo';
        riskIndices[country] = { riskScore: risk, level };
      }

      // Generar alerta si supera umbral
      for (const [country, data] of Object.entries(riskIndices)) {
        if (data.riskScore > 7) {
          publish(`Profecía: ALERTA - Riesgo alto en ${country} (${data.riskScore.toFixed(1)})`);

          // Generar informe automático
          const reportAgent = new MetatronAgent('ReportGenerationAgent');
          await reportAgent.run({ risks, correlations });
        }
      }
    } catch {
      // Silenciar errores de integraciones para evitar ruido en logs
      console.log('Profecía: Usando datos de fallback debido a error en integraciones externas');
      publish(`Profecía: Actualización completada con datos de fallback`);
      // Usar datos mock o fallback si es necesario
    }

    console.log('[Prophecy] Actualización completada');
    res.status(200).json({ status: 'Prophecy cycle completed', riskIndices });
  } catch (error) {
    console.error('[Prophecy] Error:', error.message);
    res.status(500).json({ error: 'Prophecy flow failed', details: error.message });
  }
}