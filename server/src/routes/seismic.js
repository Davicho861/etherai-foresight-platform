import express from 'express';
import { getSeismicData } from '../services/SeismicIntegration.js';
import { analyzeSeismicActivity, predictGeophysicalRisk } from '../agents/GeophysicalRiskAgent.js';

const router = express.Router();

/**
 * @route GET /api/seismic/activity
 * @description Provides processed real-time seismic activity with risk scores.
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

/**
 * @route GET /api/seismic/risk
 * @description Provides geophysical risk prediction based on recent seismic activity.
 * @access Protected
 */
router.get('/risk', async (req, res) => {
  try {
    const rawData = await getSeismicData();
    const processedData = analyzeSeismicActivity(rawData);
    const riskPrediction = predictGeophysicalRisk(processedData);
    res.json(riskPrediction);
  } catch (error) {
    console.error('Error in seismic risk route:', error);
    res.status(500).json({ error: 'Failed to retrieve seismic risk prediction.' });
  }
});

export default router;
