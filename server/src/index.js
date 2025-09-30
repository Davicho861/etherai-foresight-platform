import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import predictRouter from './routes/predict.js';
import contactRouter from './routes/contact.js';
import moduleRouter from './routes/module.js';
import pricingRouter from './routes/pricing.js';
import dashboardRouter from './routes/dashboard.js';
import platformStatusRouter from './routes/platform-status.js';
import agentRouter from './routes/agent.js';

const app = express();
app.use(cors());
app.use(express.json());

// Simple Bearer token auth middleware for protected routes
function bearerAuth(req, res, next) {
  const auth = req.headers['authorization'] || '';
  const token = (process.env.PRAEVISIO_BEARER_TOKEN || 'demo-token');
  if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const received = auth.slice(7).trim();
  if (received !== token) return res.status(403).json({ error: 'Forbidden' });
  next();
}


app.use('/api/predict', predictRouter);
app.use('/api/contact', contactRouter);
app.use('/api/module', bearerAuth, moduleRouter);
app.use('/api/pricing-plans', pricingRouter);
app.use('/api/dashboard', bearerAuth, dashboardRouter);
app.use('/api/platform-status', bearerAuth, platformStatusRouter);
app.use('/api/agent', agentRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Praevisio server running on http://localhost:${PORT}`);
});
