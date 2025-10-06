import express from 'express';
import vigilance from '../eternalVigilanceService.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// GET /api/eternal-vigilance/state
router.get('/state', (req, res) => {
  res.json(vigilance.getState());
});

// POST /api/eternal-vigilance/start
router.post('/start', (req, res) => {
  vigilance.start();
  res.json({ ok: true });
});

// rate limiter for emits
const emitLimiter = rateLimit({ windowMs: 60 * 1000, max: 60, message: { error: 'Too many emits, slow down' } });
// POST /api/eternal-vigilance/report
router.post('/report', (req, res) => {
  const md = vigilance.generateReport();
  res.setHeader('Content-Type', 'text/markdown');
  res.send(md);
});

// POST /api/eternal-vigilance/emit  - body { message }
router.post('/emit', emitLimiter, (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'message required' });
  vigilance.emitEvent(message);
  res.json({ ok: true });
});

export default router;
