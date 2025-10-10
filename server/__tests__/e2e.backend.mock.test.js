import { spawn } from 'child_process';
import axios from 'axios';
import supertest from 'supertest';

const MOCK_PORT = 45222;

function waitForStdout(proc, match, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout waiting for stdout')), timeout);
    const onData = (d) => {
      const s = String(d);
      if (s.includes(match)) {
        clearTimeout(timer);
        proc.stdout.off('data', onData);
        resolve(true);
      }
    };
    proc.stdout.on('data', onData);
  });
}

describe('E2E backend with mock-server (spawn)', () => {
  let mockProc;
  let backendApp;

  beforeAll(async () => {
    // Start mock server
    mockProc = spawn(process.execPath, ['./mocks/mock-server.js'], {
      cwd: __dirname + '/../',
      env: { ...process.env, USGS_MOCK_PORT: String(MOCK_PORT), PORT: String(MOCK_PORT) },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    mockProc.stdout.on('data', (d) => process.stdout.write(`[mock-server] ${d}`));
    mockProc.stderr.on('data', (d) => process.stderr.write(`[mock-server] ${d}`));

    await waitForStdout(mockProc, `Mock server listening on http://localhost:${MOCK_PORT}`);

    // Instead of spawning the backend, import the app factory and use supertest.
    // Set env so createApp reads the correct USGS_API_URL and token.
    process.env.USGS_API_URL = `http://127.0.0.1:${MOCK_PORT}/usgs/significant_day.geojson`;
    process.env.PRAEVISIO_BEARER_TOKEN = 'demo-token';

    // Import createApp and create an app instance with background tasks disabled
    // to avoid timers during tests.
    // eslint-disable-next-line global-require
  const { createApp } = await import('../src/index.js');
  backendApp = await createApp({ disableBackgroundTasks: true });
  }, 30000);

  afterAll(() => {
    if (mockProc && !mockProc.killed) mockProc.kill();
  });

  test('backend /api/seismic/activity returns processed data using mock-server', async () => {
    const request = supertest(backendApp);
    const res = await request.get('/api/seismic/activity').set('Authorization', 'Bearer demo-token').timeout({ response: 5000 });
    expect(res.status).toBe(200);
    const body = res.body;
    expect(body).toBeDefined();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    const evt = body[0];
    expect(evt).toHaveProperty('id');
    expect(evt).toHaveProperty('magnitude');
    expect(evt).toHaveProperty('place');
  }, 20000);
});
