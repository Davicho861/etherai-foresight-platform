import express from 'express';
import { fetchRecentTemperature, fetchClimatePrediction } from '../integrations/open-meteo.mock.js';
import SatelliteIntegration from '../integrations/SatelliteIntegration.js';

const router = express.Router();

// GET /api/climate/current?lat=4.7110&lon=-74.0721
router.get('/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });

    const data = await fetchRecentTemperature(parseFloat(lat), parseFloat(lon));
    res.json(data);
  } catch (err) {
    console.error('Error in /api/climate/current:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/climate/predict?lat=4.7110&lon=-74.0721&days=7
router.get('/predict', async (req, res) => {
  try {
    const { lat, lon, days = 7 } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });

    const data = await fetchClimatePrediction(parseFloat(lat), parseFloat(lon), parseInt(days));
    if (!data) return res.status(500).json({ error: 'Failed to fetch prediction' });

    res.json(data);
  } catch (err) {
    console.error('Error in /api/climate/predict:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/climate/satellite?lat=4.7110&lon=-74.0721&startDate=2025-10-01&endDate=2025-10-07
router.get('/satellite', async (req, res) => {
  try {
    const { lat, lon, startDate, endDate } = req.query;
    if (!lat || !lon || !startDate || !endDate) return res.status(400).json({ error: 'lat, lon, startDate and endDate required' });
    const sat = new SatelliteIntegration();
    const data = await sat.getNDVIData(parseFloat(lat), parseFloat(lon), startDate, endDate);
    res.json(data);
  } catch (err) {
    console.error('Error in /api/climate/satellite:', err);
    res.status(500).json({ error: err && err.message ? err.message : String(err) });
  }
});

export default router;