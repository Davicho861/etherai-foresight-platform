import request from 'supertest';
import { createApp } from '../src/index.js';

process.env.PRAEVISIO_BEARER_TOKEN = 'demo-token';

describe('Pricing routes', () => {
  let app;
  beforeAll(async () => {
    app = await createApp({ disableBackgroundTasks: true, initializeServices: false });
  });

  describe('pricing-plans', () => {
    const realFs = require('fs');
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('returns 404 when file not found', async () => {
      jest.spyOn(realFs, 'existsSync').mockReturnValue(false);
      const res = await request(app).get('/api/pricing-plans');
      expect(res.status).toBe(404);
    });

    it('returns mapped plans when file contains plans array', async () => {
      const sample = { currency: 'EUR', plans: [{ id: 'p1', name: 'Pro', price_monthly: 20, features: ['a'], description: 'd' }] };
      jest.spyOn(realFs, 'existsSync').mockReturnValue(true);
      jest.spyOn(realFs, 'readFileSync').mockReturnValue(JSON.stringify(sample));
      const res = await request(app).get('/api/pricing-plans');
      expect(res.status).toBe(200);
      expect(res.body.currency).toBe('EUR');
      expect(res.body.segments.default.plans[0].id).toBe('p1');
    });
  });

  describe('pricing', () => {
    const realFs = require('fs');
    afterEach(() => jest.restoreAllMocks());

    async function mountPricingRouter() {
      const express = require('express');
      const router = (await import('../src/routes/pricing.js')).default;
      const localApp = express();
      localApp.use(express.json());
      localApp.use(router);
      return localApp;
    }

    it('returns 500 when protocol not available', async () => {
      jest.spyOn(realFs, 'readFileSync').mockImplementation(() => { throw new Error('nope'); });
      const localApp = await mountPricingRouter();
      const res = await request(localApp).get('/');
      expect(res.status).toBe(500);
    });

    it('returns structured segments when protocol present', async () => {
      const proto = { currency: 'USD', globalSettings: { x: 1 }, segments: { default: { name: 'Default', plans: [{ id: 'p1' }] } } };
      jest.spyOn(realFs, 'readFileSync').mockReturnValue(JSON.stringify(proto));
      const localApp = await mountPricingRouter();
      const res = await request(localApp).get('/');
      expect(res.status).toBe(200);
      expect(res.body.currency).toBe('USD');
      expect(res.body.segments.default.name).toBe('Default');
    });
  });
});
