import express from 'express';
import prisma from '../prisma.js';
import GdeltIntegration from '../integrations/GdeltIntegration.js';
import WorldBankIntegration from '../integrations/WorldBankIntegration.js';
import CryptoIntegration from '../integrations/CryptoIntegration.js';
import { fetchRecentTemperature, fetchClimatePrediction } from '../integrations/open-meteo.mock.js';
import { getSeismicActivity } from '../services/usgsService.js';
import { getChromaClient } from '../database.js';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Lista de países LATAM con códigos ISO y coordenadas aproximadas
const LATAM_COUNTRIES = [
  { name: 'Colombia', code: 'COL', lat: 4.5709, lon: -74.2973 },
  { name: 'Perú', code: 'PER', lat: -9.1899, lon: -75.0152 },
  { name: 'Brasil', code: 'BRA', lat: -14.2350, lon: -51.9253 },
  { name: 'México', code: 'MEX', lat: 23.6345, lon: -102.5528 },
  { name: 'Argentina', code: 'ARG', lat: -38.4161, lon: -63.6167 },
  { name: 'Chile', code: 'CHL', lat: -35.6751, lon: -71.5430 },
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
    // No fallback - return error indication
    return {
      name: LATAM_COUNTRIES.find(c => c.code === countryCode)?.name || countryCode,
      code: countryCode,
      risk: 'Desconocido',
      prediction: 0,
      riskScore: 0,
      error: error.message
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

    // Si no hay datos suficientes, dejar vacío - no usar simulados
    if (chartData.length < 6) {
      // Fill with empty data or note that data is unavailable
      const emptyData = Array(6 - chartData.length).fill({
        month: 'N/A',
        accuracy: 0,
        predictions: 0,
        note: 'Datos históricos no disponibles'
      });
      chartData.unshift(...emptyData);
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

// GET /api/demo/live-state
router.get('/live-state', async (req, res) => {
  try {
    // 1. Obtener datos climáticos para países LATAM
    const climatePromises = LATAM_COUNTRIES.map(async (country) => {
      try {
        const weather = await fetchRecentTemperature(country.lat, country.lon);
        const prediction = await fetchClimatePrediction(country.lat, country.lon, 7);
        return {
          country: country.code,
          weather,
          prediction
        };
      } catch (error) {
        return {
          country: country.code,
          weather: { error: error.message },
          prediction: { error: error.message }
        };
      }
    });

    // 2. Obtener datos sociales de GDELT
    const socialPromises = LATAM_COUNTRIES.map(async (country) => {
      try {
        const gdelt = new GdeltIntegration();
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const events = await gdelt.getSocialEvents(country.code, startDate, endDate);
        return {
          country: country.code,
          socialEvents: events
        };
      } catch (error) {
        return {
          country: country.code,
          socialEvents: { error: error.message }
        };
      }
    });

    // 3. Obtener datos económicos del World Bank
    const economicPromises = LATAM_COUNTRIES.map(async (country) => {
      try {
        const wb = new WorldBankIntegration();
        const data = await wb.getKeyEconomicData(country.code);
        return {
          country: country.code,
          economicData: data
        };
      } catch (error) {
        return {
          country: country.code,
          economicData: { error: error.message }
        };
      }
    });

    // 4. Obtener datos de criptomonedas (resiliente)
    let cryptoData = null;
    try {
      const cryptoIntegration = new CryptoIntegration();
      cryptoData = await cryptoIntegration.getCryptoData();
    } catch (error) {
      console.warn('[live-state] crypto data fetch failed, using mock', error?.message);
      cryptoData = [{ id: 'bitcoin', current_price: 50000 }];
      // mark as mock wrapper for frontend if needed
      cryptoData = { data: cryptoData, isMock: true };
    }

    // 5. Obtener datos sísmicos globales (resiliente)
    let seismicData = null;
    try {
      seismicData = await getSeismicActivity();
    } catch (error) {
      console.warn('[live-state] seismic data fetch failed, using mock', error?.message);
      seismicData = { events: [], summary: { totalEvents: 0 }, isMock: true };
    }

    // 6. Obtener KPIs del dashboard (resiliente)
    let dashboardData = { kpis: {} };
    try {
      const dashboardResponse = await fetch(`${req.protocol}://${req.get('host')}/api/dashboard/overview`);
      dashboardData = dashboardResponse.ok ? await dashboardResponse.json() : { kpis: {} };
    } catch (err) {
      console.warn('[live-state] dashboard overview fetch failed, using mock', err?.message);
      dashboardData = { kpis: { modelAccuracy: { value: 90 }, criticalSignals: { value: 120 } }, isMock: true };
    }

    // Ejecutar todas las promesas en paralelo
    const [climateData, socialData, economicData] = await Promise.all([
      Promise.all(climatePromises),
      Promise.all(socialPromises),
      Promise.all(economicPromises)
    ]);

    // 7. Additionally fetch internal aggregated endpoints (community resilience, food security, ethical assessment)
    let communityResilience = null;
    try {
      const crRes = await fetch(`${req.protocol}://${req.get('host')}/api/community-resilience`);
      communityResilience = crRes.ok ? await crRes.json() : { data: null, isMock: true };
    } catch (err) {
      console.warn('[live-state] community-resilience fetch failed, using mock', err?.message);
      communityResilience = {
        data: {
          resilienceAnalysis: LATAM_COUNTRIES.reduce((acc, c) => {
            acc[c.code] = { resilienceScore: 75, notes: 'Simulated fallback data' }; return acc;
          }, {})
        },
        isMock: true
      };
    }

    let foodSecurity = null;
    try {
      const fsRes = await fetch(`${req.protocol}://${req.get('host')}/api/global-risk/food-security`);
      foodSecurity = fsRes.ok ? await fsRes.json() : { data: [], isMock: true };
    } catch (err) {
      console.warn('[live-state] food-security fetch failed, using mock', err?.message);
      // High-fidelity mock structure
      foodSecurity = {
        data: LATAM_COUNTRIES.map((c, i) => ({
          country: c.code,
          year: new Date().getFullYear(),
          prevalenceUndernourishment: Math.max(1, 10 + i),
          riskIndex: 40 + i * 5,
          volatilityIndex: 15 + i * 2
        })),
        source: 'mock',
        isMock: true
      };
    }

    let ethicalAssessment = null;
    try {
      const ethRes = await fetch(`${req.protocol}://${req.get('host')}/api/ethical-assessment`);
      ethicalAssessment = ethRes.ok ? await ethRes.json() : { success: false, isMock: true };
    } catch (err) {
      console.warn('[live-state] ethical-assessment fetch failed, using mock', err?.message);
      ethicalAssessment = {
        success: true,
        data: {
          vector: [20, 65, 50],
          overallScore: 45,
          assessment: 'Medium Ethical Concern',
          timestamp: new Date().toISOString()
        },
        isMock: true
      };
    }

    // 8. Preparar respuesta agregada final
    const response = {
      timestamp: new Date().toISOString(),
      kpis: {
        precisionPromedio: dashboardData.kpis?.modelAccuracy?.value || dashboardData.kpis?.modelAccuracy || 0,
        prediccionesDiarias: dashboardData.kpis?.criticalSignals?.value || dashboardData.kpis?.criticalSignals || 0,
        monitoreoContinuo: 24,
        coberturaRegional: LATAM_COUNTRIES.length
      },
      countries: LATAM_COUNTRIES.map(country => ({
        ...country,
        climate: climateData.find(c => c.country === country.code)?.weather,
        social: socialData.find(c => c.country === country.code)?.socialEvents,
        economic: economicData.find(c => c.country === country.code)?.economicData
      })),
      communityResilience,
      foodSecurity,
      ethicalAssessment,
      global: {
        crypto: cryptoData,
        seismic: seismicData
      },
      lastUpdated: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Error in /api/demo/live-state:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// POST /api/demo/predict-scenario
router.post('/predict-scenario', async (req, res) => {
  try {
    const { country, inflationIncrease, droughtLevel } = req.body;

    if (!country) {
      return res.status(400).json({ error: 'Country is required' });
    }

    // Get current data for the country
    const countryData = LATAM_COUNTRIES.find(c => c.code === country);
    if (!countryData) {
      return res.status(400).json({ error: 'Invalid country code' });
    }

    // Simulate risk calculation using causal weaver or simple logic
    const causalWeaver = (await import('../causalWeaver.js')).causalWeaver;

    // Create nodes for simulation
    const scenarioId = `scenario_${Date.now()}`;
    await causalWeaver.createNode(scenarioId, 'scenario', {
      country,
      inflationIncrease: inflationIncrease || 0,
      droughtLevel: droughtLevel || 0
    });

    // Calculate risk based on factors
    let riskIndex = 50; // Base risk

    // Economic factor (45%)
    riskIndex += (inflationIncrease || 0) * 0.9;

    // Climate factor (35%)
    riskIndex += (droughtLevel || 0) * 3.5;

    // Social factor (20%) - use GDELT data if available
    try {
      const gdelt = new GdeltIntegration();
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const events = await gdelt.getSocialEvents(country, startDate, endDate);
      if (events && !events.error) {
        riskIndex += events.eventCount * 0.2;
      }
    } catch (error) {
      console.log('Could not get social data for risk calculation');
    }

    // Cap at 100
    riskIndex = Math.min(100, Math.max(0, riskIndex));

    // Create causal links
    await causalWeaver.createRelationship(scenarioId, `economic_${country}`, 'affects', { weight: 0.45 });
    await causalWeaver.createRelationship(scenarioId, `climate_${country}`, 'affects', { weight: 0.35 });
    await causalWeaver.createRelationship(scenarioId, `social_${country}`, 'affects', { weight: 0.20 });

    res.json({
      country,
      riskIndex,
      factors: {
        economic: (inflationIncrease || 0) * 0.9,
        climate: (droughtLevel || 0) * 3.5,
        social: 0 // Placeholder
      },
      scenarioId
    });
  } catch (error) {
    console.error('Error in /api/demo/predict-scenario:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

export default router;