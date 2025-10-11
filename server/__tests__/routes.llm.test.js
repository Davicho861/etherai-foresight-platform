import request from 'supertest';
import { createApp } from '../src/index.js';

process.env.PRAEVISIO_BEARER_TOKEN = 'demo-token';

// Mock getLLM to a deterministic implementation
jest.mock('../src/llm.js', () => ({
  getLLM: () => ({
    call: async (prompt) => `echo:${prompt}`,
    generate: async (prompt) => ({ generations: [[[{ text: `gen:${prompt}` }]]] })
  }),
}), { virtual: false });

describe('LLM routes', () => {
  let app;

  beforeAll(async () => {
    process.env.NATIVE_DEV_MODE = 'true'; // ensure Neo4j path is skipped
    app = await createApp({ disableBackgroundTasks: true, initializeServices: false });
  });

  it('POST /api/llm/predict-tests returns fallback suggested test when no Neo4j', async () => {
    const res = await request(app)
      .post('/api/llm/predict-tests')
      .set('Authorization', 'Bearer demo-token')
      .send({ changedFiles: ['src/foo/bar.js'] });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('suggested');
    expect(Array.isArray(res.body.suggested)).toBe(true);
    // Accept two shapes: array of strings, or array of {file, suggestedTests: []}
    const suggested = res.body.suggested;
    const hasPlaywright = suggested.some(s => (
      (typeof s === 'string' && s.includes('playwright')) ||
      (s && Array.isArray(s.suggestedTests) && s.suggestedTests.some(t => t.includes('playwright')))
    ));
    expect(hasPlaywright).toBeTruthy();
  });

  it('POST /api/llm/propose-plan uses LLM call and returns result', async () => {
    const res = await request(app)
      .post('/api/llm/propose-plan')
      .set('Authorization', 'Bearer demo-token')
      .send({ prompt: 'make a plan' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('result');
    expect(res.body.result).toContain('echo:');
  });

  it('POST /api/llm/generate-component returns component string', async () => {
    const res = await request(app)
      .post('/api/llm/generate-component')
      .set('Authorization', 'Bearer demo-token')
      .send({ name: 'MyComp', description: 'a component' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('component');
    expect(typeof res.body.component).toBe('string');
  });

  it('POST /api/llm/generate-test returns test string', async () => {
    const res = await request(app)
      .post('/api/llm/generate-test')
      .set('Authorization', 'Bearer demo-token')
      .send({ path: '/some/path', description: 'e2e test' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('test');
    expect(typeof res.body.test).toBe('string');
  });
});
