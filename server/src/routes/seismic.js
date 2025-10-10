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

/**
 * @route GET /api/seismic/risk
 * @description Provides geophysical risk assessment based on seismic activity.
 * @access Protected
 */
router.get('/risk', async (req, res) => {
  try {
    const rawData = await getSeismicData();
    const events = analyzeSeismicActivity(rawData);
    const eventCount = events.length;
    const maxMagnitude = eventCount > 0 ? Math.max(...events.map(e => e.magnitude)) : 0;
    const overallRisk = eventCount > 0 ? (maxMagnitude * eventCount) / 10 : 0; // Simple risk calculation
    const highRiskZones = events.filter(e => e.magnitude >= 5.0).map(e => e.place);

    res.json({
      overallRisk,
      eventCount,
      maxMagnitude,
      highRiskZones
    });
  } catch (error) {
    console.error('Error in seismic risk route:', error);
    res.status(500).json({ error: 'Failed to retrieve seismic risk assessment.' });
  }
});

export default router;
