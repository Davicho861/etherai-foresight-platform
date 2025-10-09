import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

// GET /api/dashboard/overview
router.get('/overview', async (req, res) => {
  try {
    // Query recent ModuleData (fallback to example payload if none)
    const recent = await prisma.moduleData.findMany({
      orderBy: { timestamp: 'desc' },
      take: 200,
    });

    if (!recent || recent.length === 0) {
      // fallback deterministic payload
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
      return res.json(payload);
    }

    // Build KPIs from recent data
    const criticalSignalsCount = recent.length;

    // compute simple module summaries by category
    const modulesByCategory = recent.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    const analysisModules = Object.keys(modulesByCategory).map((cat) => {
      const items = modulesByCategory[cat];
      const avgValue = items.reduce((s, i) => s + i.value, 0) / items.length;
      return {
        name: `${cat} Module`,
        type: 'Análisis',
        status: 'active',
        currentTask: `Procesando ${items.length} registros`,
        progress: Math.min(95, Math.round(avgValue)),
      };
    });

    // predictive insights: take top labels by value
    const sortedByValue = [...recent].sort((a, b) => b.value - a.value).slice(0, 5);
    const predictiveInsights = sortedByValue.map((r) => ({ id: r.id, confidence: Math.min(99, Math.round(r.value)), title: r.label || `${r.category} insight`, description: `Dato: ${r.value} en ${r.country}` }));

    // event lifecycle: map some heuristics
    const eventLifecycle = [
      { name: 'Señal', progress: 100, status: 'completed' },
      { name: 'Análisis', progress: Math.min(100, 50 + Math.round(criticalSignalsCount / 2)), status: 'in-progress' },
      { name: 'Decisión', progress: Math.min(100, 30 + Math.round(criticalSignalsCount / 3)), status: 'in-progress' },
      { name: 'Acción', progress: Math.min(100, Math.round(criticalSignalsCount / 5)), status: 'pending' },
      { name: 'Monitoreo', progress: Math.min(100, Math.round(criticalSignalsCount / 6)), status: 'pending' }
    ];

    const payload = {
      lastUpdated: new Date().toISOString(),
      kpis: {
        criticalSignals: { value: criticalSignalsCount, trend: 0, trendIsPositive: false },
        predictiveHorizonDays: { value: 14 },
        modelAccuracy: { value: 90, trend: 0, trendIsPositive: true },
        analystsAssigned: { value: 5 }
      },
      eventLifecycle,
      analysisModules,
      predictiveInsights,
    };

    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

// GET /api/dashboard/credits
router.get('/credits', async (req, res) => {
  try {
    // Mock credits response for testing
    const credits = 1500; // Mock value
    res.json({ credits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

export default router;
