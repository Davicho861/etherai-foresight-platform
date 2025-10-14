import { renderHook, waitFor } from '@testing-library/react';
import useXaiExplain from '../../hooks/useXaiExplain';

// Mock fetch globally
global.fetch = jest.fn();

describe('useXaiExplain', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useXaiExplain());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.last).toBe(null);
  });

  it('should successfully explain a metric', async () => {
    const mockResponse = {
      success: true,
      explanation: 'Test explanation',
      confidence: 0.95,
      sources: ['source1', 'source2'],
      oracle: 'Test Oracle',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useXaiExplain());

    const explainPromise = result.current.explain('risk', 0.8, 'test context');

    expect(result.current.loading).toBe(true);

    const response = await explainPromise;

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.last).toEqual(mockResponse);
    });

    expect(response).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('/api/xai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: 'risk',
        value: 0.8,
        context: 'test context',
      }),
    });
  });

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'XAI request failed';

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: errorMessage }),
    });

    const { result } = renderHook(() => useXaiExplain());

    const explainPromise = result.current.explain('risk', 0.8, 'test context');

    const response = await explainPromise;

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.last).toEqual({
        explanation: errorMessage,
        confidence: 0,
        sources: [],
        oracle: 'Apolo Prime - fallback',
      });
    });

    expect(response).toEqual({
      explanation: errorMessage,
      confidence: 0,
      sources: [],
      oracle: 'Apolo Prime - fallback',
    });
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');

    (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

    const { result } = renderHook(() => useXaiExplain());

    const explainPromise = result.current.explain('risk', 0.8, 'test context');

    const response = await explainPromise;

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Network error');
      expect(result.current.last).toEqual({
        explanation: 'Network error',
        confidence: 0,
        sources: [],
        oracle: 'Apolo Prime - fallback',
      });
    });

    expect(response).toEqual({
      explanation: 'Network error',
      confidence: 0,
      sources: [],
      oracle: 'Apolo Prime - fallback',
    });
  });

  it('should handle malformed JSON response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON')),
    });

    const { result } = renderHook(() => useXaiExplain());

    const explainPromise = result.current.explain('risk', 0.8, 'test context');

    const response = await explainPromise;

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('XAI error');
      expect(result.current.last).toEqual({
        explanation: 'XAI error',
        confidence: 0,
        sources: [],
        oracle: 'Apolo Prime - fallback',
      });
    });

    expect(response).toEqual({
      explanation: 'XAI error',
      confidence: 0,
      sources: [],
      oracle: 'Apolo Prime - fallback',
    });
  });

  it('should reset state on new explain call', async () => {
    const mockResponse = {
      success: true,
      explanation: 'Test explanation',
      confidence: 0.95,
      sources: ['source1'],
      oracle: 'Test Oracle',
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useXaiExplain());

    // First call
    result.current.explain('risk1', 0.8, 'context1');

    // Immediately call again
    const secondPromise = result.current.explain('risk2', 0.9, 'context2');

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.last).toBe(null);

    await secondPromise;

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle different metric types', async () => {
    const mockResponse = {
      success: true,
      explanation: 'Number explanation',
      confidence: 0.9,
      sources: ['source1'],
      oracle: 'Test Oracle',
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useXaiExplain());

    // Test with different value types
    await result.current.explain('temperature', 25, 'weather context');
    await result.current.explain('status', 'active', 'system context');
    await result.current.explain('data', { key: 'value' }, 'object context');

    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('should maintain last response across multiple calls', async () => {
    const firstResponse = {
      success: true,
      explanation: 'First explanation',
      confidence: 0.8,
      sources: ['source1'],
      oracle: 'Oracle1',
    };

    const secondResponse = {
      success: true,
      explanation: 'Second explanation',
      confidence: 0.9,
      sources: ['source2'],
      oracle: 'Oracle2',
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(firstResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(secondResponse),
      });

    const { result } = renderHook(() => useXaiExplain());

    await result.current.explain('risk1', 0.5, 'context1');

    await waitFor(() => {
      expect(result.current.last).toEqual(firstResponse);
    });

    await result.current.explain('risk2', 0.7, 'context2');

    await waitFor(() => {
      expect(result.current.last).toEqual(secondResponse);
    });
  });
});