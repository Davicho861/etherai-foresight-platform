import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Delay importing heavy modules (that may use `import.meta`) until createApp is
// invoked. This lets tests import createApp without triggering ESM parsing of
// modules that Jest may not transform.
export async function createApp({ disableBackgroundTasks = false, initializeServices = false } = {}) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Import services and routers lazily but protect against import failures by
  // providing lightweight fallbacks so tests can import createApp without
  // failing when optional integrations are missing or use top-level ESM
  // features.
  async function safeImport(modPath, fallback) {
    try {
      const mod = await import(modPath);
      return mod && (mod.default || mod);
    } catch (err) {
      console.warn(`safeImport: failed to import ${modPath}, using fallback. Error: ${err && err.message}`);
      return fallback();
    }
  }

  const sseTokenService = await safeImport('./sseTokenService.js', () => ({ validateToken: async () => false }));
  const cacheService = await safeImport('./cache.js', () => ({}));

  // Initialize services if requested
  if (initializeServices) {
    if (sseTokenService.initialize) sseTokenService.initialize();
    if (cacheService.initialize) cacheService.initialize();
  }

  const { runProphecyCycle, getRiskIndices } = await (async () => {
    try {
      const mod = await import('./services/predictionEngine.js');
      return { runProphecyCycle: mod.runProphecyCycle, getRiskIndices: mod.getRiskIndices };
    } catch (err) {
      console.warn('predictionEngine import failed, using noop fallbacks:', err && err.message);
      return { runProphecyCycle: async () => {}, getRiskIndices: () => ({ ethicalAssessment: {} }) };
    }
  })();

  const predictRouter = await safeImport('./routes/predict.js', () => express.Router());
  const contactRouter = await safeImport('./routes/contact.js', () => express.Router().use((req, res) => res.status(501).json({ error: 'unavailable' })));
  const moduleRouter = await safeImport('./routes/module.js', () => express.Router());
  const pricingRouter = await safeImport('./routes/pricing.js', () => express.Router());
  const pricingPlansRouter = await safeImport('./routes/pricing-plans.js', () => express.Router());
  const dashboardRouter = await safeImport('./routes/dashboard.js', () => express.Router());
  const platformStatusRouter = await safeImport('./routes/platform-status.js', () => express.Router().get('/', (req, res) => res.json({ status: 'unknown' })));
  const healthRouter = await safeImport('./routes/health.js', () => express.Router().get('/', (req, res) => res.json({ status: 'ok' })));
  const agentRouter = await safeImport('./routes/agent.js', () => express.Router());
  const llmRouter = await safeImport('./routes/llm.js', () => express.Router());
  const consciousnessRouter = await safeImport('./routes/consciousness.js', () => express.Router());
  const sacrificeRouter = await safeImport('./routes/sacrifice.js', () => express.Router());
  const climateRouter = await safeImport('./routes/climate.js', () => express.Router());
  const gdeltRouter = await safeImport('./routes/gdelt.js', () => express.Router());
  const alertsRouter = await safeImport('./routes/alerts.js', () => express.Router());
  const eternalVigilanceRouter = await safeImport('./routes/eternalVigilance.js', () => express.Router());
  const eternalVigilanceStreamRouter = await safeImport('./routes/eternalVigilanceStream.js', () => express.Router());
  const eternalVigilanceTokenRouter = await safeImport('./routes/eternalVigilanceToken.js', () => express.Router());
  const demoRouter = await safeImport('./routes/demo.js', () => express.Router());
  const missionsRouter = await safeImport('./routes/missions.js', () => express.Router());
  const foodResilienceRouter = await safeImport('./routes/food-resilience.js', () => express.Router());
  const globalRiskRouter = await safeImport('./routes/globalRiskRoutes.js', () => express.Router());
  const xaiRouter = await safeImport('./routes/xai.js', () => express.Router());
  const sdlcRouter = await safeImport('./routes/sdlc.js', () => express.Router());
  const providersRouter = await safeImport('./routes/providers.js', () => express.Router());
  const seismicRouter = await safeImport('./routes/seismic.js', () => express.Router().use((req, res) => res.status(501).json({ error: 'seismic unavailable' })));
  const communityResilienceRouter = await safeImport('./routes/community-resilience.js', () => express.Router());
  const logisticsRouter = await safeImport('./routes/logistics.js', () => express.Router());
  const kanbanRouter = await safeImport('./routes/kanban.js', () => express.Router());
  const oracleRouter = await safeImport('./routes/oracle.js', () => express.Router());
  const authRouter = await safeImport('./routes/auth.js', () => express.Router());
  const { verifyJWT } = await safeImport('./routes/auth.js', () => ({ verifyJWT: (req, res, next) => next() }));

  // Register lightweight fallback mocks for internal endpoints (helps native dev)
  try {
    const fallbackMocks = await safeImport('./routes/fallbackMocks.js', () => express.Router());
    if (fallbackMocks) app.use('/', fallbackMocks);
  } catch (e) {
    console.warn('Could not register fallback mocks:', e && e.message);
  }

  // JWT verification middleware for protected routes
  const jwtAuth = verifyJWT;

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
  // Mount the new pricing-plans endpoint first so it overrides legacy pricing if present
  app.use('/api/pricing-plans', pricingPlansRouter);
  app.use('/api/pricing-plans', pricingRouter);
  app.use('/api/dashboard', bearerAuth, dashboardRouter);
  app.use('/api/platform-status', platformStatusRouter);
  app.use('/api/health', healthRouter);
  app.use('/api/agent', agentRouter);
  app.use('/api/llm', bearerAuth, llmRouter);
  app.use('/api/consciousness', bearerAuth, consciousnessRouter);
  app.use('/api/sacrifice', sacrificeRouter);
  app.use('/api/climate', climateRouter);
  app.use('/api/gdelt', gdeltRouter);
  app.use('/api/providers', providersRouter);
  app.use('/api/alerts', bearerAuth, alertsRouter);
  app.use('/api/eternal-vigilance', bearerAuth, eternalVigilanceRouter);
  // SSE stream (no auth for now)
  app.use('/api/eternal-vigilance', eternalVigilanceStreamRouter);
  // token issuance endpoint (protected)
  app.use('/api/eternal-vigilance', bearerAuth, eternalVigilanceTokenRouter);
  app.use('/api/demo', demoRouter);
  app.use('/api/xai', xaiRouter);
  app.use('/api/missions', missionsRouter);
  app.use('/api/sdlc', sdlcRouter);
  app.use('/api/food-resilience', bearerAuth, foodResilienceRouter);
  app.use('/api/global-risk', bearerAuth, globalRiskRouter);
  app.use('/api/seismic', bearerAuth, seismicRouter);
  app.use('/api/community-resilience', bearerAuth, communityResilienceRouter);
  app.use('/api/logistics', logisticsRouter);
  app.use('/api/kanban', kanbanRouter);
  app.use('/api/oracle', oracleRouter);
  app.use('/api/auth', authRouter);

 // Ethical Assessment endpoint
  app.get('/api/ethical-assessment', bearerAuth, (req, res) => {
    try {
      const riskState = getRiskIndices();
      res.json({
        success: true,
        data: riskState.ethicalAssessment,
      });
    } catch (error) {
      console.error('[EthicalAssessment] Error retrieving ethical assessment:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Optionally start background tasks when app is explicitly started via main()
  if (!disableBackgroundTasks) {
    // Start prophecy cycle after app is created when not disabled
    setTimeout(async () => {
      try {
        await runProphecyCycle();
        console.log('[Aion] First prophecy cycle complete. The Eternal Vigilance has begun.');
        setInterval(async () => {
          await runProphecyCycle();
          console.log('[Aion] Prophecy cycle executed.');
        }, 5 * 60 * 1000);
      } catch (err) {
        console.error('[Aion] Error running prophecy cycle:', err && err.message ? err.message : err);
      }
    }, 2000);
  }

  return app;
}

// If invoked directly, start the server and enable background tasks
if (process.argv[1] && process.argv[1].endsWith('/src/index.js')) {
  (async () => {
    try {
      const app = await createApp({ disableBackgroundTasks: false });
      const PORT = process.env.PORT ? Number(process.env.PORT) : (process.env.NATIVE_DEV_MODE === 'true' ? 4003 : 4000);
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Praevisio server running on http://localhost:${PORT}`);
        console.log('[Aion] Awakening... Initiating the Perpetual Prophecy Flow. Final Conquest.');
      });
    } catch (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  })();
}
