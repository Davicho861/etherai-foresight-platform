import express from 'express';
import prisma from '../prisma.js';
import GdeltIntegration from '../integrations/GdeltIntegration.js';
import { getChromaClient } from '../database.js';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Lista de países LATAM con códigos ISO
const LATAM_COUNTRIES = [
  { name: 'Colombia', code: 'COL' },
  { name: 'Perú', code: 'PER' },
  { name: 'Brasil', code: 'BRA' },
  { name: 'México', code: 'MEX' },
  { name: 'Argentina', code: 'ARG' },
  { name: 'Chile', code: 'CHL' },
];

// Función para calcular riesgo basado en datos reales
async function calculateRiskForCountry(countryCode) {
  try {
    // Obtener eventos sociales de GDELT para el último mes
    const gdelt = new GdeltIntegration();
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const events = await gdelt.getSocialEvents(countryCode, startDate, endDate);

    // Calcular score de riesgo basado en eventos
    const riskScore = Math.min(100, events.length * 5); // Simplificado

    let risk = 'Bajo';
    if (riskScore >= 70) risk = 'Alto';
    else if (riskScore >= 30) risk = 'Medio';

    // Precisión simulada basada en datos históricos
    const accuracy = Math.max(80, 95 - riskScore * 0.1);

    return {
      name: LATAM_COUNTRIES.find(c => c.code === countryCode)?.name || countryCode,
      code: countryCode,
      risk,
      prediction: Math.round(accuracy),
      riskScore
    };
  } catch (error) {
    console.error(`Error calculating risk for ${countryCode}:`, error);
    // Fallback
    return {
      name: LATAM_COUNTRIES.find(c => c.code === countryCode)?.name || countryCode,
      code: countryCode,
      risk: 'Medio',
      prediction: 85,
      riskScore: 50
    };
  }
}

// GET /api/demo/full-state
router.get('/full-state', async (req, res) => {
  try {
    // 1. Obtener KPIs del dashboard
    const dashboardResponse = await fetch(`${req.protocol}://${req.get('host')}/api/dashboard/overview`);
    const dashboardData = dashboardResponse.ok ? await dashboardResponse.json() : {
      kpis: {
        modelAccuracy: { value: 92 },
        criticalSignals: { value: 150 }
      }
    };

    // 2. Calcular índices de riesgo para países LATAM
    const countriesPromises = LATAM_COUNTRIES.map(country => calculateRiskForCountry(country.code));
    const countries = await Promise.all(countriesPromises);

    // 3. Obtener datos históricos para gráficos
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const historicalData = await prisma.moduleData.findMany({
      where: {
        timestamp: {
          gte: sixMonthsAgo
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    // Agrupar por mes
    const monthlyData = {};
    historicalData.forEach(item => {
      const month = item.timestamp.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { accuracy: [], predictions: 0 };
      }
      monthlyData[month].accuracy.push(item.value);
      monthlyData[month].predictions += 1;
    });

    const chartData = Object.keys(monthlyData)
      .sort()
      .slice(-6) // Últimos 6 meses
      .map(month => {
        const data = monthlyData[month];
        const avgAccuracy = data.accuracy.length > 0
          ? data.accuracy.reduce((a, b) => a + b, 0) / data.accuracy.length
          : 85;
        return {
          month: new Date(month + '-01').toLocaleDateString('es-ES', { month: 'short' }),
          accuracy: Math.round(avgAccuracy),
          predictions: data.predictions
        };
      });

    // Si no hay datos suficientes, usar datos simulados
    if (chartData.length < 6) {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
      const simulatedData = months.map((month, i) => ({
        month,
        accuracy: 85 + i * 2,
        predictions: 120 + i * 15
      }));
      chartData.push(...simulatedData.slice(chartData.length));
      chartData.splice(0, chartData.length - 6);
    }

    // 4. Preparar respuesta
    const response = {
      kpis: {
        precisionPromedio: dashboardData.kpis?.modelAccuracy?.value || 92,
        prediccionesDiarias: dashboardData.kpis?.criticalSignals?.value || 150,
        monitoreoContinuo: 24,
        coberturaRegional: countries.length
      },
      countries,
      chartData,
      lastUpdated: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Error in /api/demo/full-state:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/demo/mission-replays
router.get('/mission-replays', async (req, res) => {
  try {
    // Obtener datos de la Conciencia Colectiva (failure patterns o logs)
    const client = getChromaClient();
    let items = [];

    if (client && typeof client.getOrCreateCollection === 'function' && !client.mock) {
      const collection = await client.getOrCreateCollection({ name: 'failure_patterns' });
      const all = await collection.get();
      const docs = (all || {}).documents || [];
      const metadatas = (all || {}).metadatas || [];
      const ids = (all || {}).ids || [];
      items = ids.map((id, i) => ({
        id,
        error: docs[i],
        metadata: metadatas[i],
        timestamp: metadatas[i]?.timestamp
      }));
    } else {
      // Fallback: read local JSONL
      const p = path.join(process.cwd(), 'server', 'data', 'failure_patterns.jsonl');
      const exists = await fs.access(p).then(() => true).catch(() => false);
      if (exists) {
        const txt = await fs.readFile(p, 'utf8');
        const lines = txt.split('\n').filter(Boolean);
        items = lines.map(l => {
          try {
            return JSON.parse(l);
          } catch {
            return { raw: l };
          }
        });
      }
    }

    // Convertir a formato de task replays
    const taskReplays = items.slice(0, 10).map((item, index) => ({
      id: item.id || `replay_${index}`,
      title: `Análisis de Patrón ${index + 1}`,
      description: `Log de misión: ${item.metadata?.missionId || 'Desconocida'}`,
      fullText: item.error || item.raw || 'Log de ejecución de misión predictiva...'
    }));

    // Si no hay suficientes, agregar simulados
    const simulatedReplays = [
      {
        id: 'sim_1',
        title: 'Análisis de Mercado Colombia',
        description: 'Predicción de tendencias económicas',
        fullText: 'Iniciando análisis predictivo del mercado colombiano. Evaluando indicadores económicos clave: PIB, inflación y tasas de interés. Integrando datos de fuentes múltiples para generar pronósticos precisos con 90% de accuracy.'
      },
      {
        id: 'sim_2',
        title: 'Evaluación de Riesgos Perú',
        description: 'Análisis de estabilidad financiera',
        fullText: 'Ejecutando evaluación de riesgos financieros en proyectos peruanos. Analizando volatilidad del mercado, exposición crediticia y factores geopolíticos. Generando recomendaciones basadas en modelos predictivos avanzados.'
      }
    ];

    while (taskReplays.length < 4) {
      taskReplays.push(simulatedReplays[taskReplays.length % simulatedReplays.length]);
    }

    res.json({ taskReplays });
  } catch (error) {
    console.error('Error in /api/demo/mission-replays:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;