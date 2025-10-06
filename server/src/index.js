import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import predictRouter from './routes/predict.js';
import contactRouter from './routes/contact.js';
import moduleRouter from './routes/module.js';
import pricingRouter from './routes/pricing.js';
import dashboardRouter from './routes/dashboard.js';
import platformStatusRouter from './routes/platform-status.js';
import agentRouter from './routes/agent.js';
import llmRouter from './routes/llm.js';
import consciousnessRouter from './routes/consciousness.js';
import sacrificeRouter from './routes/sacrifice.js';
import climateRouter from './routes/climate.js';
import alertsRouter from './routes/alerts.js';
import eternalVigilanceRouter from './routes/eternalVigilance.js';
import eternalVigilanceStreamRouter from './routes/eternalVigilanceStream.js';
import eternalVigilanceTokenRouter from './routes/eternalVigilanceToken.js';
import sseTokenService from './sseTokenService.js';


// Función principal para iniciar el servidor
async function main() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Simple Bearer token auth middleware for protected routes (supports async validation)
  async function bearerAuth(req, res, next) {
    const auth = req.headers['authorization'] || '';
    const expected = (process.env.PRAEVISIO_BEARER_TOKEN || 'demo-token');
    // Accept token from Authorization header, cookie, or query param (for EventSource/backcompat)
    let received = null;
    if (auth && auth.startsWith('Bearer ')) {
      received = auth.slice(7).trim();
    } else if (req.cookies && req.cookies.praevisio_sse_token) {
      received = String(req.cookies.praevisio_sse_token);
    } else if (req.query && req.query.token) {
      received = String(req.query.token);
    }
    if (!received) return res.status(401).json({ error: 'Unauthorized' });
    // Accept either the static expected token or a valid temporary SSE token
    if (received !== expected) {
      const ok = sseTokenService && typeof sseTokenService.validateToken === 'function' && await sseTokenService.validateToken(received);
      if (!ok) return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  }


  app.use('/api/predict', predictRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/module', bearerAuth, moduleRouter);
  app.use('/api/pricing-plans', pricingRouter);
  app.use('/api/dashboard', bearerAuth, dashboardRouter);
  app.use('/api/platform-status', platformStatusRouter);
  app.use('/api/agent', agentRouter);
  app.use('/api/llm', bearerAuth, llmRouter);
  app.use('/api/consciousness', bearerAuth, consciousnessRouter);
  app.use('/api/sacrifice', sacrificeRouter);
  app.use('/api/climate', climateRouter);
  app.use('/api/alerts', bearerAuth, alertsRouter);
  app.use('/api/eternal-vigilance', bearerAuth, eternalVigilanceRouter);
  // SSE stream (no auth for now)
  app.use('/api/eternal-vigilance', eternalVigilanceStreamRouter);
  // token issuance endpoint (protected)
  app.use('/api/eternal-vigilance', bearerAuth, eternalVigilanceTokenRouter);


  const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Praevisio server running on http://localhost:${PORT}`);
  });
}

main().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
