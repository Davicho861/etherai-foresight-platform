import express from 'express';

const router = express.Router();

// Simple fallback data for global-risk endpoints
router.get('/api/global-risk/:topic', (req, res) => {
  const { topic } = req.params;
  const sample = {
    topic,
    timestamp: new Date().toISOString(),
    value: Math.round(Math.random() * 100),
    unit: '%'
  };
  res.json({ status: 'OK', data: sample });
});

// Simple seismic activity mock
router.get('/api/seismic/activity', (req, res) => {
  res.json({
    status: 'OK',
    events: [
      { id: 'eq1', magnitude: 4.2, location: 'Region A', time: new Date().toISOString() },
      { id: 'eq2', magnitude: 3.8, location: 'Region B', time: new Date().toISOString() }
    ]
  });
});

// Demo control route
router.get('/api/demo/plan', (req, res) => {
  res.json({ status: 'OK', plan: 'Panteon', active: true });
});

export default router;
