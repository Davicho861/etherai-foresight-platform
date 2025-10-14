import express from 'express';
import cache from '../cache.js';
const router = express.Router();

// Mock data for alerts - in production, this would come from database
const mockAlerts = [
  {
    id: 1,
    title: 'Riesgo Climático Extremo en Colombia',
    description: 'Aumento significativo en precipitaciones en la región andina, potencial para deslizamientos de tierra.',
    severity: 'HIGH',
    region: 'Colombia',
    type: 'CLIMATE',
    timestamp: '2025-10-05T02:00:00Z',
    status: 'ACTIVE'
  },
  {
    id: 2,
    title: 'Volatilidad Cripto-Económica en Argentina',
    description: 'Fluctuaciones extremas en el mercado de criptomonedas locales, riesgo de pánico financiero.',
    severity: 'MEDIUM',
    region: 'Argentina',
    type: 'ECONOMIC',
    timestamp: '2025-10-04T18:30:00Z',
    status: 'MONITORING'
  }
];

// GET /api/alerts - List all alerts with caching optimization
router.get('/', (req, res) => {
  const { region, severity, type } = req.query;

  // Create cache key based on query parameters
  const cacheKey = `alerts:${region || 'all'}:${severity || 'all'}:${type || 'all'}`;

  // Check cache first
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) {
    return res.json(cachedResult);
  }

  let filteredAlerts = mockAlerts;

  if (region) {
    filteredAlerts = filteredAlerts.filter(alert => alert.region.toLowerCase() === region.toLowerCase());
  }
  if (severity) {
    filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
  }
  if (type) {
    filteredAlerts = filteredAlerts.filter(alert => alert.type === type);
  }

  const result = {
    alerts: filteredAlerts,
    total: filteredAlerts.length,
    filters: { region, severity, type }
  };

  // Cache result for 5 minutes (300,000 ms)
  cache.set(cacheKey, result, 300000);

  res.json(result);
});

// GET /api/alerts/:id - Get specific alert
router.get('/:id', (req, res) => {
  const alert = mockAlerts.find(a => a.id === parseInt(req.params.id));
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  res.json(alert);
});

// POST /api/alerts - Create new alert (requires authentication in production)
router.post('/', (req, res) => {
  const { title, description, severity, region, type } = req.body;

  if (!title || !description || !severity || !region || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newAlert = {
    id: mockAlerts.length + 1,
    title,
    description,
    severity: severity.toUpperCase(),
    region,
    type: type.toUpperCase(),
    timestamp: new Date().toISOString(),
    status: 'ACTIVE'
  };

  mockAlerts.push(newAlert);
  res.status(201).json(newAlert);
});

export default router;