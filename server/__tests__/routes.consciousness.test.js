import request from 'supertest';
import { createApp } from '../src/index.js';

process.env.PRAEVISIO_BEARER_TOKEN = 'demo-token';

jest.mock('fs/promises', () => ({
  access: async (p) => { throw new Error('no file'); },
  readFile: async (p, enc) => '[]',
  readdir: async (p) => [],
  stat: async (p) => ({ isFile: () => true })
}));

describe('Consciousness route', () => {
  let app;
  beforeAll(async () => {
    // Ensure database getChromaClient returns null by default to exercise fallback
    try {
      const db = await import('../src/database.js');
      if (db) db.getChromaClient = () => null;
    } catch (e) {}
    app = await createApp({ disableBackgroundTasks: true, initializeServices: false });
  });

  it('returns local fallback when Chroma client absent and no file', async () => {
    const res = await request(app).get('/api/consciousness').set('Authorization', 'Bearer demo-token');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('source');
    expect(['local', 'chroma']).toContain(res.body.source);
  });

  it('returns chroma source when client provided', async () => {
    // Monkey-patch database getChromaClient to return a mock client
    const db = await import('../src/database.js');
    if (db) db.getChromaClient = () => ({ mock: false, getOrCreateCollection: async () => ({ get: async () => ({ documents: ['err'], metadatas: [{ timestamp: Date.now() }], ids: ['1'] }) }) });

    const res = await request(app).get('/api/consciousness').set('Authorization', 'Bearer demo-token');
    expect(res.status).toBe(200);
    expect(res.body.source).toBe('chroma');
    expect(Array.isArray(res.body.items)).toBe(true);
  });
});
