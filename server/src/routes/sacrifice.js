import express from 'express';
import Oracle from '../oracle.js';

const router = express.Router();

// GET /api/sacrifice/run -> simula la reintroducción de react-simple-maps@1.0.0
router.get('/run', async (req, res) => {
  try {
    const oracle = new Oracle();
    const prediction = await oracle.predictFailure('npm install react-simple-maps@1.0.0', '{}');
    return res.json({ blocked: prediction.probability > 0.5, prediction });
  } catch (e) {
    console.error('sacrifice route error', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
