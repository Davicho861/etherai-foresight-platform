import { getLLM } from '../../src/llm.js';

// Mock fetch globally
global.fetch = jest.fn();

describe('LLM Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLLM', () => {
    it('should return ChatOpenAI when OPENAI_API_KEY is set', () => {
      const originalKey = process.env.OPENAI_API_KEY;
      process.env.OPENAI_API_KEY = 'test-key';

      const llm = getLLM();

      expect(llm).toBeInstanceOf(require('@langchain/openai').ChatOpenAI);
      expect(llm.openAIApiKey).toBe('test-key');
      expect(llm.modelName).toBe('gpt-4o-mini'); // default

      process.env.OPENAI_API_KEY = originalKey;
    });

    it('should return OllamaLLM when no OPENAI_API_KEY', () => {
      const originalKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const llm = getLLM();

      expect(llm).toBeInstanceOf(require('../../src/llm.js').OllamaLLM);
      expect(llm.model).toBe('llama3'); // default

      process.env.OPENAI_API_KEY = originalKey;
    });

    it('should use custom OpenAI model when specified', () => {
      const originalKey = process.env.OPENAI_API_KEY;
      const originalModel = process.env.OPENAI_MODEL;
      process.env.OPENAI_API_KEY = 'test-key';
      process.env.OPENAI_MODEL = 'gpt-4';

      const llm = getLLM();

      expect(llm.modelName).toBe('gpt-4');

      process.env.OPENAI_API_KEY = originalKey;
      process.env.OPENAI_MODEL = originalModel;
    });
  });

  describe('OllamaLLM', () => {
    let ollamaLLM;

    beforeEach(() => {
      ollamaLLM = new (require('../../src/llm.js').OllamaLLM)();
    });

    it('should call Ollama API and return response', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ output: 'Test response' })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await ollamaLLM.call('Test prompt');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('ollama-mock:11434'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('Test prompt')
        })
      );
      expect(result).toBe('Test response');
    });

    it('should handle API errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        text: jest.fn().mockResolvedValue('Server error')
      };
      fetch.mockResolvedValue(mockResponse);

      await expect(ollamaLLM.call('Test prompt')).rejects.toThrow('Ollama API error 500: Server error');
    });

    it('should parse different response formats', async () => {
      const testCases = [
        { response: { results: [{ content: 'Content response' }] }, expected: 'Content response' },
        { response: { output: 'Output response' }, expected: 'Output response' },
        { response: 'String response', expected: 'String response' },
        { response: { other: 'data' }, expected: '{"other":"data"}' }
      ];

      for (const { response, expected } of testCases) {
        fetch.mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue(response)
        });

        const result = await ollamaLLM.call('Test');
        expect(result).toBe(expected);
      }
    });

    it('should handle generate method with different message formats', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ output: 'Generated text' })
      });

      // Test string input
      const result1 = await ollamaLLM.generate('Simple string');
      expect(result1.generations[0][0].text).toBe('Generated text');

      // Test array of objects with content
      const result2 = await ollamaLLM.generate([{ content: 'Message 1' }, { content: 'Message 2' }]);
      expect(result2.generations[0][0].text).toBe('Generated text');

      // Test array of objects with text
      const result3 = await ollamaLLM.generate([{ text: 'Text 1' }, { text: 'Text 2' }]);
      expect(result3.generations[0][0].text).toBe('Generated text');
    });

    it('should use environment variables for configuration', () => {
      const originalModel = process.env.OLLAMA_MODEL;
      const originalUrl = process.env.OLLAMA_URL;
      const originalTemp = process.env.OLLAMA_TEMPERATURE;
      const originalTokens = process.env.OLLAMA_MAX_TOKENS;

      process.env.OLLAMA_MODEL = 'custom-model';
      process.env.OLLAMA_URL = 'http://custom-url:1234/api/generate';
      process.env.OLLAMA_TEMPERATURE = '0.5';
      process.env.OLLAMA_MAX_TOKENS = '2048';

      const customLLM = new (require('../../src/llm.js').OllamaLLM)();

      expect(customLLM.model).toBe('custom-model');
      expect(customLLM.url).toBe('http://custom-url:1234/api/generate');

      // Test that env vars are used in API call
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ output: 'Response' })
      });

      customLLM.call('Test');

      const callBody = JSON.parse(fetch.mock.calls[0][1].body);
      expect(callBody.temperature).toBe(0.5);
      expect(callBody.max_tokens).toBe(2048);

      process.env.OLLAMA_MODEL = originalModel;
      process.env.OLLAMA_URL = originalUrl;
      process.env.OLLAMA_TEMPERATURE = originalTemp;
      process.env.OLLAMA_MAX_TOKENS = originalTokens;
    });
  });
});