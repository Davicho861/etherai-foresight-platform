const request = require('supertest');
const express = require('express');

describe('/api/demo routes', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    delete process.env.FORCE_MOCKS;
  });

  test('GET /full-state returns aggregated structure', async () => {
    await jest.isolateModulesAsync(async () => {
      // Mock GdeltIntegration to return a few events
      jest.doMock('../../src/integrations/GdeltIntegration.js', () => {
        return function() {
          this.getSocialEvents = jest.fn().mockResolvedValue([{ id: 'e1' }, { id: 'e2' }]);
        };
      });

      // Mock prisma.moduleData.findMany to return some historical entries
      jest.doMock('../../src/prisma.js', () => ({
        moduleData: {
          findMany: jest.fn().mockResolvedValue([
            { timestamp: new Date('2025-04-01'), value: 90 },
            { timestamp: new Date('2025-05-01'), value: 92 },
            { timestamp: new Date('2025-06-01'), value: 91 }
          ])
        }
      }));

      // Mock global.fetch for dashboard overview
      global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ kpis: { modelAccuracy: { value: 95 }, criticalSignals: { value: 120 } } }) });

      const demoRouter = require('../../src/routes/demo.js');
      let router = demoRouter;
      if (router && router.default) router = router.default;

      const app = express();
      app.use('/api/demo', router);

      const res = await request(app).get('/api/demo/full-state').set('Host', 'localhost');
      expect(res.statusCode).toBe(200);
      expect(res.body.kpis).toBeDefined();
      expect(Array.isArray(res.body.countries)).toBe(true);
      expect(res.body.countries.length).toBeGreaterThan(0);
      expect(Array.isArray(res.body.chartData)).toBe(true);
    });
  });

  test('GET /mission-replays returns items from fallback when no chroma client', async () => {
    await jest.isolateModulesAsync(async () => {
      // Mock getChromaClient to return null so code reads local file
      jest.doMock('../../src/database.js', () => ({ getChromaClient: jest.fn(() => null) }));

      // Mock fs/promises access and readFile
      jest.doMock('fs/promises', () => ({
        access: jest.fn().mockResolvedValue(true),
        readFile: jest.fn().mockResolvedValue(JSON.stringify({ id: 'x' }) + '\n')
      }));

      const demoRouter = require('../../src/routes/demo.js');
      let router = demoRouter;
      if (router && router.default) router = router.default;

      const app = express();
      app.use('/api/demo', router);

      const res = await request(app).get('/api/demo/mission-replays').set('Host', 'localhost');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.taskReplays)).toBe(true);
      expect(res.body.taskReplays.length).toBeGreaterThanOrEqual(1);
    });
  });
});
