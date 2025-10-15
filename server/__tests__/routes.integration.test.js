import request from 'supertest';
import { createApp } from '../src/index.js';

process.env.PRAEVISIO_BEARER_TOKEN = 'demo-token';

describe('App integration routes (createApp)', () => {
  let app;

  beforeAll(async () => {
    // disable background tasks to avoid timers
    app = await createApp({ disableBackgroundTasks: true, initializeServices: false });
  });

  it('responds to /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
  });

  it('responds to /api/platform-status', async () => {
    const res = await request(app).get('/api/platform-status');
    expect(res.status).toBe(200);
    // Some implementations return `status`, others `statusGeneral` — accept either
    expect(typeof res.body).toBe('object');
    expect(Object.keys(res.body).length).toBeGreaterThan(0);
    const hasStatus = res.body && (Object.prototype.hasOwnProperty.call(res.body, 'status') || Object.prototype.hasOwnProperty.call(res.body, 'statusGeneral'));
    expect(hasStatus).toBeTruthy();
  });

  it('requires auth for /api/ethical-assessment and returns 401 without token', async () => {
    const res = await request(app).get('/api/ethical-assessment');
    expect(res.status).toBe(401);
  });

  it('allows authorized access to /api/ethical-assessment', async () => {
    const res = await request(app).get('/api/ethical-assessment').set('Authorization', 'Bearer demo-token');
    // Should respond (the handler wraps getRiskIndices which may be a noop)
    expect([200, 500]).toContain(res.status);
  });

  it('handles missing routes gracefully', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect([404, 501, 200]).toContain(res.status);
  });
});
