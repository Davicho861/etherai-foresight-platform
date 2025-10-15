// Tests for server/src/database.js

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  // ensure no persisted fallback between tests
  global.__praevisio_chroma_fallback = {};
});

describe('database module - getChromaClient native fallback', () => {
  test('returns in-memory client when NATIVE_DEV_MODE=true and upsert/query work', async () => {
    process.env.NATIVE_DEV_MODE = 'true';
    process.env.NODE_ENV = 'test';

    const { getChromaClient } = require('../src/database.js');
    const client = getChromaClient();
    expect(client).toBeDefined();
    expect(client.url).toBe('native-disabled');

    await client.upsertLog('m1', { description: 'hello world' });
    const hits = await client.querySimilar('hello world', 5);
    expect(Array.isArray(hits)).toBe(true);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].missionId).toBe('m1');
  });
});

describe('database module - getChromaClient non-native with fetch', () => {
  test('uses remote Chroma when reachable and returns query results', async () => {
    // reset env to non-native
    process.env.NATIVE_DEV_MODE = 'false';
    process.env.NODE_ENV = 'test';

    // Mock global fetch to simulate Chroma heartbeat and search endpoints
    global.fetch = jest.fn()
      // First call: isAlive heartbeat
      .mockResolvedValueOnce({ ok: true })
      // Second call: ensureCollection POST -> respond ok
      .mockResolvedValueOnce({ ok: true })
      // Third call: upsert points POST -> ok
      .mockResolvedValueOnce({ ok: true })
      // Fourth call: search POST -> return body
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: ['x'] }) });

    const { getChromaClient } = require('../src/database.js');
    const client = getChromaClient();
    expect(client).toBeDefined();
    // upsertLog should try network but due to mocked responses it will go through
    await client.upsertLog('m2', { description: 'remote test' });
    const res = await client.querySimilar('remote test', 3);
    // our mocked search returns the object from json()
    expect(res).toBeDefined();
  });
});

describe('database module - getNeo4jDriver', () => {
  test('returns null in test env', async () => {
    process.env.NODE_ENV = 'test';
    process.env.NATIVE_DEV_MODE = 'false';
    const { getNeo4jDriver } = require('../src/database.js');
    const d = await getNeo4jDriver();
    expect(d).toBeNull();
  });

  test('returns driver when neo4j-driver connects successfully', async () => {
    // Simulate non-test env and provide a mock neo4j-driver
    process.env.NODE_ENV = 'development';
    process.env.NATIVE_DEV_MODE = 'false';

    // Mock neo4j-driver module BEFORE importing database.js
    jest.doMock('neo4j-driver', () => {
      return {
        auth: { basic: () => ({}) },
        driver: (url, auth, opts) => ({
          session: () => ({
            run: jest.fn().mockResolvedValue({}),
            close: jest.fn().mockResolvedValue(undefined),
          }),
          close: jest.fn().mockResolvedValue(undefined),
        }),
      };
    });

    const { getNeo4jDriver } = require('../src/database.js');
    const driver = await getNeo4jDriver();
    expect(driver).not.toBeNull();
    // cleanup mock
    jest.dontMock('neo4j-driver');
  });
});
