import express from 'express';
import { getFoodSecurityIndex } from '../services/worldBankService.js';
import { getSeismicActivity } from '../services/usgsService.js';
import { getClimateExtremesIndex } from '../services/climateService.js';
import { getCommunityResilienceIndex } from '../services/communityResilienceService.js';
import CryptoService from '../services/cryptoService.js';

const router = express.Router();
const cryptoService = new CryptoService();

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
      source: data && data.source ? data.source : 'Praevisio-Aion-WorldBank',
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    console.error('Error fetching food security index:', error);
    res.status(502).json({
      success: false,
      message: 'Bad Gateway: upstream data source failed',
      error: error && error.message ? error.message : String(error)
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

/**
 * @route GET /api/global-risk/climate-extremes
 * @description Provides the latest global climate extremes data from NASA POWER.
 * @access Public
 */
router.get('/climate-extremes', async (req, res) => {
  try {
    const data = await getClimateExtremesIndex();
    res.status(200).json({
      success: true,
      source: 'Praevisio-Aion-NASA-POWER-Integration',
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    console.error('Error fetching climate extremes:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not retrieve climate extremes data.',
    });
  }
});

/**
  * @route GET /api/global-risk/community-resilience
  * @description Provides the latest community resilience analysis for LATAM countries.
  * @access Public
  */
router.get('/community-resilience', async (req, res) => {
  try {
    const { countries = ['COL', 'PER', 'ARG'], days = 30 } = req.query;
    const countriesArray = Array.isArray(countries) ? countries : countries.split(',').map(c => c.trim().toUpperCase());
    const data = await getCommunityResilienceIndex(countriesArray, parseInt(days));
    res.status(200).json({
      success: true,
      source: 'Praevisio-Aion-CommunityResilienceAgent',
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    console.error('Error fetching community resilience:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not retrieve community resilience data.',
    });
  }
});

/**
  * @route GET /api/global-risk/crypto-volatility
  * @description Provides the latest cryptocurrency volatility risk index.
  * @access Public
  */
router.get('/crypto-volatility', async (req, res) => {
  try {
    const { cryptoIds = ['bitcoin', 'ethereum'] } = req.query;
    const cryptoIdsArray = Array.isArray(cryptoIds) ? cryptoIds : cryptoIds.split(',').map(c => c.trim().toLowerCase());
    const data = await cryptoService.getCryptoMarketAnalysis(cryptoIdsArray);
    res.status(200).json({
      success: true,
      source: 'Praevisio-Aion-CryptoService',
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error) {
    console.error('Error fetching crypto volatility:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not retrieve crypto volatility data.',
    });
  }
});

export default router;
