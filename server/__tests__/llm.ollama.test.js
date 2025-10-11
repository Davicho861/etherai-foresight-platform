/* eslint-disable global-require */
describe('OllamaLLM _callOllama and wrappers', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = 'test';
    delete process.env.OPENAI_API_KEY;
  });

  test('returns content from results[0].content', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [{ content: 'hello' }] }) });
    const { OllamaLLM } = require('../src/llm.js');
    const llm = new OllamaLLM({ url: 'http://x' });
    const res = await llm.call('hi');
    expect(res).toBe('hello');
  });

  test('returns output field when present', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ output: 'out-text' }) });
    const { OllamaLLM } = require('../src/llm.js');
    const llm = new OllamaLLM({ url: 'http://x' });
    const res = await llm.call('hi');
    expect(res).toBe('out-text');
  });

  test('throws on non-ok response with text', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, text: async () => 'err' });
    const { OllamaLLM } = require('../src/llm.js');
    const llm = new OllamaLLM({ url: 'http://x' });
    await expect(llm.call('hi')).rejects.toThrow(/Ollama API error/);
  });

  test('generate returns generations wrapper', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [{ content: 'gtext' }] }) });
    const { OllamaLLM } = require('../src/llm.js');
    const llm = new OllamaLLM({ url: 'http://x' });
    const out = await llm.generate([{ content: 'a' }, { content: 'b' }]);
    expect(out && out.generations && out.generations[0] && out.generations[0][0].text).toBe('gtext');
  });
});
