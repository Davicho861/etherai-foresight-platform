import express from 'express';
import { getFoodSecurityIndex } from '../services/worldBankService.js';
import { getSeismicActivity } from '../services/usgsService.js';

const router = express.Router();

/**
 * @route GET /api/global-risk/food-security
 * @description Provides the latest global food security index data.
 * @access Public
 */
router.get('/food-security', async (req, res) => {
  try {
    const data = await getFoodSecurityIndex();
    res.status(200).json({
      success: true,
      source: 'Praevisio-Aion-Simulated-WorldBank',
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    console.error('Error fetching food security index:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not retrieve food security data.',
    });
  }
});

/**
 * @route GET /api/global-risk/seismic-activity
 * @description Provides the latest global seismic activity data from USGS.
 * @access Public
 */
router.get('/seismic-activity', async (req, res) => {
  try {
    const data = await getSeismicActivity();
    res.status(200).json({
      success: true,
      source: 'Praevisio-Aion-USGS-Integration',
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    console.error('Error fetching seismic activity:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not retrieve seismic activity data.',
    });
  }
});

export default router;
