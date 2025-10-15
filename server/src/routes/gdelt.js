import express from 'express';
import GdeltIntegration from '../integrations/GdeltIntegration.js';

const router = express.Router();

// GET /api/gdelt/events?country=COL&startDate=2023-01-01&endDate=2023-12-31
router.get('/events', async (req, res) => {
  try {
    const { country, startDate, endDate } = req.query;
    if (!country || !startDate || !endDate) {
      return res.status(400).json({ error: 'country, startDate, and endDate are required' });
    }

    const gdelt = new GdeltIntegration();
    const data = await gdelt.getSocialEvents(country, startDate, endDate);
    res.json(data);
  } catch (err) {
    console.error('Error in /api/gdelt/events:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;