import request from 'supertest';
import { createApp } from '../src/index.js';

process.env.PRAEVISIO_BEARER_TOKEN = 'demo-token';

describe('Dashboard routes', () => {
  let app;

  beforeAll(async () => {
    // ensure background tasks are disabled
    app = await createApp({ disableBackgroundTasks: true, initializeServices: false });
  });

  it('returns fallback payload when DB is empty', async () => {
    // Mock prisma to return empty
    const prisma = await import('../src/prisma.js');
    if (prisma && prisma.default) {
      prisma.default.moduleData = { findMany: async () => [] };
    }

    const res = await request(app).get('/api/dashboard/overview').set('Authorization', 'Bearer demo-token');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('kpis');
    // Fallback contains specific keys
    expect(res.body.kpis).toHaveProperty('modelAccuracy');
    expect(res.body).toHaveProperty('predictiveInsights');
  });

  it('builds payload from DB records when present', async () => {
    // Prepare sample records
    const sample = [];
    for (let i = 0; i < 10; i++) {
      sample.push({ id: `r${i}`, category: 'test', value: 50 + i, label: `label-${i}`, country: 'COL', timestamp: new Date() });
    }

    const prisma = await import('../src/prisma.js');
    if (prisma && prisma.default) {
      prisma.default.moduleData = { findMany: async (opts) => sample };
    }

    const res = await request(app).get('/api/dashboard/overview').set('Authorization', 'Bearer demo-token');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('analysisModules');
    expect(Array.isArray(res.body.analysisModules)).toBe(true);
    expect(res.body.predictiveInsights.length).toBeGreaterThan(0);
    // ensure criticalSignals reflects sample length
    expect(res.body.kpis.criticalSignals.value).toBeGreaterThanOrEqual(10);
  });
});
