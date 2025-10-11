const request = require('supertest');
const express = require('express');

describe('/api/consciousness route', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  test('returns local fallback when chroma client unavailable', async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock('../../src/database.js', () => ({ getChromaClient: jest.fn(() => null) }));
      jest.doMock('fs/promises', () => ({
        access: jest.fn().mockResolvedValue(true),
        readFile: jest.fn().mockResolvedValue(JSON.stringify({ id: 'a' }) + '\n')
      }));

      const routerMod = require('../../src/routes/consciousness.js');
      let router = routerMod;
      if (router && router.default) router = router.default;

      const app = express();
      app.use('/api/consciousness', router);

      const res = await request(app).get('/api/consciousness').set('Host', 'localhost');
      expect(res.statusCode).toBe(200);
      expect(res.body.source).toBe('local');
      expect(Array.isArray(res.body.items)).toBe(true);
    });
  });

  test('returns chroma source when client provides collection', async () => {
    await jest.isolateModulesAsync(async () => {
      const fakeCollection = { get: jest.fn().mockResolvedValue({ ids: ['id1'], documents: ['err'], metadatas: [{ timestamp: Date.now() }] }) };
      jest.doMock('../../src/database.js', () => ({ getChromaClient: jest.fn(() => ({ getOrCreateCollection: jest.fn().mockResolvedValue(fakeCollection) })) }));

      const routerMod = require('../../src/routes/consciousness.js');
      let router = routerMod;
      if (router && router.default) router = router.default;

      const app = express();
      app.use('/api/consciousness', router);

      const res = await request(app).get('/api/consciousness').set('Host', 'localhost');
      expect(res.statusCode).toBe(200);
      expect(res.body.source).toBe('chroma');
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items[0].id).toBe('id1');
    });
  });
});
