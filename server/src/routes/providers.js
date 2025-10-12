import express from 'express';
import GdeltIntegration from '../integrations/GdeltIntegration.js';
import FMIIntegration from '../integrations/FMIIntegration.js';
import WorldBankIntegration from '../integrations/WorldBankIntegration.js';
import CryptoIntegration from '../integrations/CryptoIntegration.js';

const router = express.Router();

// Compatibility proxy endpoints for older clients/tools that call /api/providers/*

// GET /api/providers/gdelt/events?country=COL&startDate=2025-01-01&endDate=2025-01-07
router.get('/gdelt/events', async (req, res) => {
  try {
    const { country, startDate, endDate } = req.query;
    if (!country || !startDate || !endDate) return res.status(400).json({ error: 'country, startDate and endDate are required' });
    const gdelt = new GdeltIntegration();
    const data = await gdelt.getSocialEvents(country, startDate, endDate);
    res.json(data);
  } catch (err) {
    console.error('/api/providers/gdelt/events error:', err);
    res.status(500).json({ error: err && err.message ? err.message : String(err) });
  }
});

// GET /api/providers/fmi?country=COL&startYear=2020&endYear=2024
router.get('/fmi', async (req, res) => {
  try {
    const { country, startYear = '2020', endYear = '2024' } = req.query;
    if (!country) return res.status(400).json({ error: 'country is required' });
    const fmi = new FMIIntegration();
    const data = await fmi.getDebtData(country.toUpperCase(), startYear, endYear);
    res.json(data);
  } catch (err) {
    console.error('/api/providers/fmi error:', err);
    res.status(500).json({ error: err && err.message ? err.message : String(err) });
  }
});

// GET /api/providers/worldbank/indicators?country=COL&indicators=NY.GDP.PCAP.CD,FP.CPI.TOTL.ZG&startYear=2020&endYear=2024
router.get('/worldbank/indicators', async (req, res) => {
  try {
    const { country, indicators, startYear = '2020', endYear = '2024' } = req.query;
    if (!country) return res.status(400).json({ error: 'country is required' });
    const wb = new WorldBankIntegration();
    if (!indicators) {
      const data = await wb.getKeyEconomicData(country.toUpperCase(), startYear, endYear);
      return res.json(data);
    }
    const list = indicators.split(',').map(i => i.trim()).filter(Boolean);
    const data = await wb.getEconomicIndicators(country.toUpperCase(), list, startYear, endYear);
    res.json(data);
  } catch (err) {
    console.error('/api/providers/worldbank/indicators error:', err);
    res.status(500).json({ error: err && err.message ? err.message : String(err) });
  }
});

// GET /api/providers/crypto
router.get('/crypto', async (req, res) => {
  try {
    const { ids, vs } = req.query;
    const crypto = new CryptoIntegration();
    const idsArr = ids ? ids.split(',').map(s => s.trim()) : undefined;
    const data = await crypto.getCryptoData(idsArr, vs || 'usd');
    res.json(data);
  } catch (err) {
    console.error('/api/providers/crypto error:', err);
    res.status(500).json({ error: err && err.message ? err.message : String(err) });
  }
});

export default router;
