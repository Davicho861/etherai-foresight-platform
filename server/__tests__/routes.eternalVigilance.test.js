import request from 'supertest';
import { createApp } from '../src/index.js';

process.env.PRAEVISIO_BEARER_TOKEN = 'demo-token';

describe('Eternal Vigilance routes', () => {
  let app;

  beforeAll(async () => {
    app = await createApp({ disableBackgroundTasks: true, initializeServices: false });
    // Ensure the vigilance service is importable and deterministic
    const vig = await import('../src/eternalVigilanceService.js');
    // patch getState if necessary
    if (vig && vig.getState) {
      vig.getState = () => ({ indices: { globalRisk: 0, stability: 100 }, flows: { autoPreservation: { active: false, lastRun: null } }, riskIndices: {}, activityFeed: ['test'] });
    }
  });

  it('GET /api/eternal-vigilance/state returns state', async () => {
    const res = await request(app).get('/api/eternal-vigilance/state').set('Authorization', 'Bearer demo-token');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('indices');
    expect(res.body.indices).toHaveProperty('globalRisk');
  });

  it('POST /api/eternal-vigilance/start triggers start', async () => {
    const res = await request(app).post('/api/eternal-vigilance/start').set('Authorization', 'Bearer demo-token');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('POST /api/eternal-vigilance/report returns markdown', async () => {
    const res = await request(app).post('/api/eternal-vigilance/report').set('Authorization', 'Bearer demo-token');
    expect(res.status).toBe(200);
    expect(typeof res.text).toBe('string');
    expect(res.headers['content-type']).toMatch(/text\/markdown/);
  });

  it('POST /api/eternal-vigilance/emit requires message', async () => {
    const res = await request(app).post('/api/eternal-vigilance/emit').set('Authorization', 'Bearer demo-token').send({});
    // Rate limiter may return 429 or route returns 400 for missing message
    expect([400, 429]).toContain(res.status);
  });

  it('POST /api/eternal-vigilance/emit with message succeeds', async () => {
    const res = await request(app).post('/api/eternal-vigilance/emit').set('Authorization', 'Bearer demo-token').send({ message: 'hello' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
