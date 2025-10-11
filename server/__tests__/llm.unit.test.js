const { OllamaLLM } = require('../src/llm.js');

describe('OllamaLLM _callOllama and wrappers', () => {
  afterEach(() => {
    jest.resetModules();
    if (global.fetch && global.fetch._isMock) delete global.fetch;
    delete process.env.OLLAMA_URL;
  });

  test('returns text when API responds with results array', async () => {
    const resp = { results: [{ content: 'Hello world' }] };
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => resp });
    global.fetch._isMock = true;
    const llm = new OllamaLLM({ url: 'http://fake' });
    const out = await llm.call('hi');
    expect(out).toBe('Hello world');
  });

  test('throws when API responds non-ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, text: async () => 'err' });
    global.fetch._isMock = true;
    const llm = new OllamaLLM({ url: 'http://fake' });
    await expect(llm.call('hi')).rejects.toThrow(/Ollama API error/);
  });

  test('generate returns generations array', async () => {
    const resp = { output: 'Out' };
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => resp });
    global.fetch._isMock = true;
    const llm = new OllamaLLM({ url: 'http://fake' });
    const gen = await llm.generate(['a','b']);
    expect(gen.generations[0][0].text).toBe('Out');
  });
});
