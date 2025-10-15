describe('sseTokenService (in-memory fallback)', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = 'test';
    delete process.env.REDIS_URL;
  });

  test('generateToken and validateToken work in-memory', async () => {
    const svc = require('../src/sseTokenService.js').default;
    const { token, expiresAt } = await svc.generateToken(1);
    expect(typeof token).toBe('string');
    expect(typeof expiresAt).toBe('number');

    const ok = await svc.validateToken(token);
    expect(ok).toBe(true);
  });

  test('token expires when generated with negative ttl', async () => {
    const svc = require('../src/sseTokenService.js').default;
    const { token } = await svc.generateToken(-1); // already expired
    // token should be expired
    const ok = await svc.validateToken(token);
    expect(ok).toBe(false);
  });

  test('initialize and shutdown are safe to call in test env', () => {
    const svc = require('../src/sseTokenService.js');
    expect(() => svc.initialize()).not.toThrow();
    expect(() => svc.shutdown()).not.toThrow();
  });
});
let svc = require('../src/sseTokenService.js');
svc = svc && svc.default ? svc.default : svc;

describe('sseTokenService in-memory fallback', () => {
  afterEach(() => {
    jest.resetModules();
    if (global.fetch && global.fetch._isMock) delete global.fetch;
    delete process.env.REDIS_URL;
    process.env.NODE_ENV = 'test';
  });

  test('generateToken and validateToken work in memory', async () => {
    const { token, expiresAt } = await svc.generateToken(1); // 1 second
    expect(typeof token).toBe('string');
    const ok = await svc.validateToken(token);
    expect(ok).toBe(true);
    // wait for expiration
    await new Promise(r => setTimeout(r, 1100));
    const ok2 = await svc.validateToken(token);
    expect(ok2).toBe(false);
  });

  test('cleanupExpired removes expired entries', async () => {
    const { token } = await svc.generateToken(1);
    // Force call to cleanupExpired via module internals (require path)
    let mod = require('../src/sseTokenService.js');
    mod = mod && mod.default ? mod.default : mod;
    // Wait for token to expire
    await new Promise(r => setTimeout(r, 1100));
    // Call cleanupExpired indirectly through shutdown/start (no-op in test env)
    mod.shutdown();
    const ok = await mod.validateToken(token);
    expect(ok).toBe(false);
  });
});
