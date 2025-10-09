export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fallback deterministic payload for serverless
    const payload = {
      lastUpdated: new Date().toISOString(),
      kpis: {
        criticalSignals: { value: 142, trend: 18, trendIsPositive: false },
        predictiveHorizonDays: { value: 14 },
        modelAccuracy: { value: 92, trend: 3, trendIsPositive: true },
        analystsAssigned: { value: 8 }
      },
      eventLifecycle: [
        { name: 'Señal', progress: 100, status: 'completed' },
        { name: 'Análisis', progress: 85, status: 'in-progress' },
        { name: 'Decisión', progress: 75, status: 'in-progress' },
        { name: 'Acción', progress: 30, status: 'pending' },
        { name: 'Monitoreo', progress: 20, status: 'pending' }
      ],
      analysisModules: [
        { name: 'SEIR Social Analyzer', type: 'Análisis', status: 'active', currentTask: 'Calibrando parámetros de sentimiento social', progress: 65 },
        { name: 'GeoRisk Mapper', type: 'Decisión', status: 'active', currentTask: 'Mapeando zonas de impacto económico', progress: 40 }
      ],
      predictiveInsights: [
        { id: 'risk-1', confidence: 92, title: 'Alerta de Inestabilidad', description: 'Provincia del Norte con 40% mayor riesgo de disturbios sociales.' }
      ]
    };

    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
}