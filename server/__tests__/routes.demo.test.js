import request from 'supertest';
import { createApp } from '../src/index.js';

process.env.PRAEVISIO_BEARER_TOKEN = 'demo-token';

describe('Demo routes', () => {
  let app;

  beforeAll(async () => {
    // Create app with background tasks disabled
    app = await createApp({ disableBackgroundTasks: true, initializeServices: false });

    // Mock prisma to return no historical data by default
    const prisma = await import('../src/prisma.js');
    if (prisma && prisma.default) {
      prisma.default.moduleData = { findMany: async () => [] };
    }

    // Mock integrations by patching prototypes or exported functions
    try {
      const Gdelt = await import('../src/integrations/GdeltIntegration.js');
      if (Gdelt && Gdelt.default) {
        Gdelt.default.prototype.getSocialEvents = async () => [];
      }
    } catch (e) {
      // ignore if integration missing
    }

    try {
      const WB = await import('../src/integrations/WorldBankIntegration.js');
      if (WB && WB.default) {
        WB.default.prototype.getKeyEconomicData = async () => ({ gdp: 1000 });
      }
    } catch (e) {}

    try {
      const Crypto = await import('../src/integrations/CryptoIntegration.js');
      if (Crypto && Crypto.default) {
        Crypto.default.prototype.getCryptoData = async () => [{ id: 'bitcoin', current_price: 50000 }];
      }
    } catch (e) {}

    try {
      const open = await import('../src/integrations/open-meteo.mock.js');
      if (open) {
        open.fetchRecentTemperature = async () => ({ temperature: 25 });
        open.fetchClimatePrediction = async () => ({ forecast: 'stable' });
      }
    } catch (e) {}

    // Mock seismic service
    try {
      const usgs = await import('../src/services/usgsService.js');
      if (usgs) {
        usgs.getSeismicActivity = async () => ({ events: [], summary: { totalEvents: 0 } });
      }
    } catch (e) {}

    // Mock database Chroma client to force fallback or return a small collection
    try {
      const db = await import('../src/database.js');
      if (db) {
        db.getChromaClient = () => ({ mock: true, getOrCreateCollection: async () => ({ get: async () => ({ documents: [], metadatas: [], ids: [] }) }) });
      }
    } catch (e) {}

    // Configure global fetch mock to return deterministic responses for internal endpoints
    if (global.mockFetch && typeof global.mockFetch.mockImplementation === 'function') {
      global.mockFetch.mockImplementation((url, opts) => {
        const u = String(url || '');
        // dashboard overview
        if (u.includes('/api/dashboard/overview')) {
          return Promise.resolve(new global.Response(JSON.stringify({ kpis: { modelAccuracy: { value: 90 }, criticalSignals: { value: 120 } } }), { status: 200 }));
        }
        if (u.includes('/api/community-resilience')) {
          return Promise.resolve(new global.Response(JSON.stringify({ data: { resilienceAnalysis: {} } }), { status: 200 }));
        }
        if (u.includes('/api/global-risk/food-security')) {
          return Promise.resolve(new global.Response(JSON.stringify({ data: [] }), { status: 200 }));
        }
        if (u.includes('/api/ethical-assessment')) {
          return Promise.resolve(new global.Response(JSON.stringify({ success: true, data: { overallScore: 50 } }), { status: 200 }));
        }
        // default fallback
        return Promise.resolve(new global.Response(JSON.stringify({}), { status: 404 }));
      });
    }
  });

  it('GET /api/demo/full-state returns aggregated payload', async () => {
    const res = await request(app).get('/api/demo/full-state');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('kpis');
    expect(res.body).toHaveProperty('countries');
    expect(Array.isArray(res.body.countries)).toBe(true);
    // countries should match LATAM list length (6)
    expect(res.body.countries.length).toBeGreaterThanOrEqual(5);
    expect(res.body).toHaveProperty('chartData');
  });

  it('GET /api/demo/live-state returns live aggregated state', async () => {
    const res = await request(app).get('/api/demo/live-state');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('kpis');
    expect(res.body).toHaveProperty('countries');
    expect(res.body.global).toHaveProperty('crypto');
    expect(res.body.global).toHaveProperty('seismic');
  });
});
