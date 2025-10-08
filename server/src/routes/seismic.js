import express from 'express';
import { getSeismicData } from '../services/SeismicIntegration.js';
import { analyzeSeismicActivity } from '../agents/GeophysicalRiskAgent.js';

const router = express.Router();

/**
 * @route GET /api/seismic/activity
 * @description Provides a stream of processed real-time seismic activity.
 * @access Protected
 */
router.get('/activity', async (req, res) => {
  try {
    const rawData = await getSeismicData();
    const processedData = analyzeSeismicActivity(rawData);
    res.json(processedData);
  } catch (error) {
    console.error('Error in seismic activity route:', error);
    res.status(500).json({ error: 'Failed to retrieve seismic activity.' });
  }
});

export default router;
