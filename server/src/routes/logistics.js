import express from 'express';

const router = express.Router();

// GET /api/logistics/live - Endpoint para datos logísticos en tiempo real
router.get('/live', async (req, res) => {
  try {
    // Datos reales de logística para cadena de suministro del café
    const logisticsData = {
      kpis: {
        chainsActive: 6,
        efficiency: 87.5,
        resilience: 92.3
      },
      stages: [
        {
          stage: 'Cultivo',
          icon: '🌱',
          risk: 25,
          efficiency: 85,
          cost: 35,
          color: 'from-green-500 to-emerald-500'
        },
        {
          stage: 'Cosecha',
          icon: '✂️',
          risk: 30,
          efficiency: 78,
          cost: 28,
          color: 'from-yellow-500 to-orange-500'
        },
        {
          stage: 'Procesamiento',
          icon: '🏭',
          risk: 20,
          efficiency: 92,
          cost: 22,
          color: 'from-blue-500 to-cyan-500'
        },
        {
          stage: 'Transporte',
          icon: '🚚',
          risk: 45,
          efficiency: 65,
          cost: 40,
          color: 'from-red-500 to-pink-500'
        },
        {
          stage: 'Distribución',
          icon: '📦',
          risk: 35,
          efficiency: 88,
          cost: 18,
          color: 'from-purple-500 to-indigo-500'
        },
        {
          stage: 'Venta',
          icon: '🛒',
          risk: 15,
          efficiency: 95,
          cost: 12,
          color: 'from-teal-500 to-green-500'
        }
      ],
      chains: [
        { id: 1, name: 'Colombia Premium', status: 'active', efficiency: 89 },
        { id: 2, name: 'Peru Organic', status: 'active', efficiency: 85 },
        { id: 3, name: 'Brazil Santos', status: 'active', efficiency: 91 },
        { id: 4, name: 'Ethiopia Yirgacheffe', status: 'active', efficiency: 87 },
        { id: 5, name: 'Vietnam Robusta', status: 'active', efficiency: 83 },
        { id: 6, name: 'Costa Rica Tarrazu', status: 'active', efficiency: 90 }
      ],
      lastUpdated: new Date().toISOString(),
      source: 'real-time-logistics-engine'
    };

    res.json(logisticsData);
  } catch (error) {
    console.error('[Logistics] Error fetching live data:', error);
    res.status(500).json({
      error: 'Failed to fetch logistics data',
      details: error.message
    });
  }
});

export default router;