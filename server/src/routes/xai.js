import express from 'express';

const router = express.Router();

// POST /api/xai/explain - lightweight XAI explanation endpoint
router.post('/explain', async (req, res) => {
  try {
    const { metric, value, context } = req.body || {};
    if (!metric || value === undefined || !context) {
      return res.status(400).json({ error: 'Missing required parameters: metric, value, context' });
    }

    let explanation = '';
    const sources = ['internal-metadata'];
    let confidence = 0.7;

    // Heuristics similar to sdlc.js XAI block
    try {
      switch (context) {
        case 'CEODashboard':
          if (metric === 'empireHealth') {
            explanation = `La salud del imperio en ${value}% refleja el estado general de todas las operaciones críticas. Este indicador combina uptime del sistema, carga operativa y estabilidad general, proporcionando una visión holística del rendimiento organizacional.`;
            confidence = 0.9;
            sources.push('ceo-metrics-v1');
          } else if (metric === 'strategicProgress') {
            explanation = `El progreso estratégico de ${value}% muestra cuánto hemos avanzado hacia nuestros objetivos principales.`;
            confidence = 0.85;
            sources.push('milestones-history');
          } else if (metric === 'burnRate') {
            explanation = `El burn rate de ${value} indica la velocidad a la que consumimos recursos financieros.`;
            confidence = 0.8;
            sources.push('finance-aggregates');
          } else if (metric === 'arr') {
            explanation = `Los ingresos recurrentes anuales de ${value} representan la base financiera del proyecto.`;
            confidence = 0.82;
            sources.push('revenue-projections');
          }
          break;
        case 'LogisticsOptimization':
          if (metric === 'efficiency') {
            explanation = `La eficiencia logística de ${value}% combina disponibilidad de rutas, tiempos de entrega y utilización de inventario. Valores altos indican que la red está balanceada y soporta demanda con mínima pérdida.`;
            confidence = 0.85;
            sources.push('supply-chain-metrics');
          } else if (metric === 'resilience') {
            explanation = `La resiliencia de ${value}% mide la capacidad de la red para absorber interrupciones y mantener niveles mínimos de servicio.`;
            confidence = 0.8;
            sources.push('resilience-index');
          }
          break;
        default:
          explanation = `La métrica ${metric} con valor ${value} en el contexto ${context} necesita análisis. Provee más contexto si deseas una explicación más precisa.`;
          confidence = 0.6;
          sources.push('generic-oracle');
      }
    } catch (err) {
      explanation = `No se pudo generar una explicación detallada para ${metric} en ${context}.`;
      confidence = 0.4;
    }

    res.json({ success: true, explanation, metric, value, context, confidence, sources, oracle: 'Apolo Prime - Arquitecto de la Inteligencia Manifiesta', generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[XAI] error:', error && error.message ? error.message : error);
    res.status(500).json({ error: 'Failed to generate explanation', details: error && error.message ? error.message : String(error) });
  }
});

export default router;
