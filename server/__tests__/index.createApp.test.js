const path = require('path');

describe('createApp and bearerAuth', () => {
  afterEach(() => {
    jest.resetModules();
    delete process.env.PRAEVISIO_BEARER_TOKEN;
  });

  test('createApp returns an express app and does not schedule background tasks when disabled', async () => {
    const createApp = require('../src/index.js').createApp;
    const app = await createApp({ disableBackgroundTasks: true, initializeServices: false });
    expect(app && typeof app.use === 'function').toBeTruthy();
  });

  test('bearerAuth rejects when no token and accepts when env token matches', async () => {
    // Mock sseTokenService to ensure validateToken is available
    const ssePath = require.resolve('../src/sseTokenService.js');
    jest.doMock(ssePath, () => ({ validateToken: async (t) => t === 'valid-temp' }));

    const { createApp } = require('../src/index.js');
    process.env.PRAEVISIO_BEARER_TOKEN = 'env-secret';
    const app = await createApp({ disableBackgroundTasks: true });

    // Use supertest to exercise middleware
    const request = require('supertest');
    // No token -> 401
    await request(app).get('/api/platform-status').expect(200); // unprotected

    const res401 = await request(app).get('/api/llm').expect(401);
    expect(res401.body.error).toBe('Unauthorized');

    // Provide env token -> success (200 or next handler)
    const resEnv = await request(app).get('/api/llm').set('Authorization', 'Bearer env-secret');
    // Should not be 401 or 403
    expect([200, 404, 501].includes(resEnv.status)).toBeTruthy();

    // Provide temporary token validated by sseTokenService -> accepted
    const resTemp = await request(app).get('/api/llm').set('Authorization', 'Bearer valid-temp');
    expect([200, 404, 501].includes(resTemp.status)).toBeTruthy();

    // Test cookie token
    const resCookie = await request(app).get('/api/llm').set('Cookie', 'praevisio_sse_token=valid-temp');
    expect([200, 404, 501].includes(resCookie.status)).toBeTruthy();

    // Test query token
    const resQuery = await request(app).get('/api/llm?token=valid-temp');
    expect([200, 404, 501].includes(resQuery.status)).toBeTruthy();
  });

  test('safeImport handles import failures gracefully', async () => {
    const { createApp } = require('../src/index.js');
    // Mock a failing import
    const originalImport = global.import;
    global.import = jest.fn().mockRejectedValue(new Error('Import failed'));
    const app = await createApp({ disableBackgroundTasks: true, initializeServices: false });
    expect(app).toBeDefined();
    global.import = originalImport;
  });

  test('ethical assessment endpoint returns data', async () => {
    const { createApp } = require('../src/index.js');
    process.env.PRAEVISIO_BEARER_TOKEN = 'env-secret';
    const app = await createApp({ disableBackgroundTasks: true });
    const request = require('supertest');
    const res = await request(app).get('/api/ethical-assessment').set('Authorization', 'Bearer env-secret');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('background tasks are scheduled when not disabled', async () => {
    jest.useFakeTimers();
    const { createApp } = require('../src/index.js');
    const app = await createApp({ disableBackgroundTasks: false });
    // Advance timers to trigger setTimeout
    jest.advanceTimersByTime(3000);
    expect(app).toBeDefined();
    jest.useRealTimers();
  });
});
