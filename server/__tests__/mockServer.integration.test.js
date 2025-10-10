import { spawn } from 'child_process';
import axios from 'axios';
import net from 'net';

const MOCK_PORT = 45111; // use a non-default port to avoid collisions

function waitForPort(port, host = '127.0.0.1', timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    (function tryConnect() {
      const sock = new net.Socket();
      sock.setTimeout(500);
      sock.on('connect', () => {
        sock.destroy();
        resolve(true);
      }).on('error', () => {
        sock.destroy();
        if (Date.now() - start > timeout) return reject(new Error('timeout'));
        setTimeout(tryConnect, 100);
      }).on('timeout', () => {
        sock.destroy();
        if (Date.now() - start > timeout) return reject(new Error('timeout'));
        setTimeout(tryConnect, 100);
      }).connect(port, host);
    })();
  });
}

describe('mock-server integration', () => {
  let proc;

  beforeAll(async () => {
    // Start the mock server with a custom port
    proc = spawn(process.execPath, ['./mocks/mock-server.js'], {
      cwd: __dirname + '/../',
      env: { ...process.env, USGS_MOCK_PORT: String(MOCK_PORT), PORT: String(MOCK_PORT) },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    // Pipe logs to console for easier debugging when tests fail
    proc.stdout.on('data', (d) => process.stdout.write(`[mock-server] ${d}`));
    proc.stderr.on('data', (d) => process.stderr.write(`[mock-server] ${d}`));

    // Wait until port is listening
    await waitForPort(MOCK_PORT, '127.0.0.1', 5000);
  }, 15000);

  afterAll(() => {
    if (proc && !proc.killed) {
      proc.kill();
    }
  });

  test('usgs mock returns FeatureCollection with features array', async () => {
  const url = `http://127.0.0.1:${MOCK_PORT}/usgs/significant_day.geojson`;
  const res = await axios.get(url, { timeout: 3000 });
  const json = res.data;
    expect(json).toHaveProperty('type', 'FeatureCollection');
    expect(Array.isArray(json.features)).toBe(true);
    expect(json.features.length).toBeGreaterThan(0);
    expect(json.features[0]).toHaveProperty('properties');
  }, 10000);
});
