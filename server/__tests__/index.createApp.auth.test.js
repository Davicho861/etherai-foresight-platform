 
const request = require('supertest');

describe('createApp bearerAuth and initialization', () => {
  beforeEach(() => {
    jest.resetModules();
    delete process.env.PRAEVISIO_BEARER_TOKEN;
    delete process.env.NATIVE_DEV_MODE;
    process.env.NODE_ENV = 'test';
    // Ensure common routes return a Router to avoid "Router.use() requires a middleware function but got a Object"
    const routes = [
      'predict','contact','pricing','pricing-plans','dashboard','platform-status','health','agent','llm','consciousness','sacrifice','climate','gdelt','alerts','eternalVigilance','eternalVigilanceStream','eternalVigilanceToken','demo','food-resilience','globalRiskRoutes','seismic','community-resilience','module'
    ];
    routes.forEach(r => {
      // Only mock if not already mocked in the test body
      try {
        jest.doMock(`../src/routes/${r}.js`, () => require('express').Router());
      } catch (e) {
        // ignore
      }
    });
  });

  test('returns 401 when no token provided for protected route', async () => {
    // Mock module route with a known endpoint
    jest.doMock('../src/routes/module.js', () => {
      const express = require('express');
      const r = express.Router();
      r.get('/test', (req, res) => res.json({ ok: true }));
      return r;
    });

    // Provide a sseTokenService fallback
  jest.doMock('../src/sseTokenService.js', () => ({ validateToken: async () => false }));

  const { createApp } = require('../src/index.js');
    const app = await createApp({ disableBackgroundTasks: true });

    const res = await request(app).get('/api/module/test');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Unauthorized');
  });

  test('allows request with static bearer token', async () => {
    jest.doMock('../src/routes/module.js', () => {
      const express = require('express');
      const r = express.Router();
      r.get('/test', (req, res) => res.json({ ok: true }));
      return r;
    });

  jest.doMock('../src/sseTokenService.js', () => ({ validateToken: async () => false }));

    process.env.PRAEVISIO_BEARER_TOKEN = 'my-static-token';

  const { createApp } = require('../src/index.js');
    const app = await createApp({ disableBackgroundTasks: true });

    const res = await request(app).get('/api/module/test').set('Authorization', 'Bearer my-static-token');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  test('returns 403 when token not matching and sseTokenService rejects', async () => {
    jest.doMock('../src/routes/module.js', () => {
      const express = require('express');
      const r = express.Router();
      r.get('/test', (req, res) => res.json({ ok: true }));
      return r;
    });

  jest.doMock('../src/sseTokenService.js', () => ({ validateToken: async (t) => false }));

    process.env.PRAEVISIO_BEARER_TOKEN = 'some-other-token';

  const { createApp } = require('../src/index.js');
    const app = await createApp({ disableBackgroundTasks: true });

    const res = await request(app).get('/api/module/test').set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error', 'Forbidden');
  });

  test('initializeServices calls initialize on services', async () => {
    const initSpy = jest.fn();
    const cacheInit = jest.fn();

  jest.doMock('../src/sseTokenService.js', () => ({ initialize: initSpy, validateToken: async () => false }));
  jest.doMock('../src/cache.js', () => ({ initialize: cacheInit }));
  jest.doMock('../src/routes/module.js', () => require('express').Router());
  jest.doMock('../src/services/predictionEngine.js', () => ({ runProphecyCycle: async () => {}, getRiskIndices: () => ({ ethicalAssessment: {} }) }));

  const { createApp } = require('../src/index.js');
    await createApp({ disableBackgroundTasks: true, initializeServices: true });

    expect(initSpy).toHaveBeenCalled();
    expect(cacheInit).toHaveBeenCalled();
  });

  test('schedules background tasks when disableBackgroundTasks is false', async () => {
  jest.doMock('../src/routes/module.js', () => require('express').Router());
  jest.doMock('../src/sseTokenService.js', () => ({ validateToken: async () => false }));
  jest.doMock('../src/services/predictionEngine.js', () => ({ runProphecyCycle: async () => {}, getRiskIndices: () => ({ ethicalAssessment: {} }) }));

    const spy = jest.spyOn(global, 'setTimeout');
  const { createApp } = require('../src/index.js');
    await createApp({ disableBackgroundTasks: false });

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
