import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePrefetch } from '../../hooks/usePrefetch';

// Mock fetch globally
global.fetch = jest.fn();

describe('usePrefetch', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  );

  describe('prefetchSDLCData', () => {
    it('should prefetch SDLC and Kanban data successfully', async () => {
      const mockSDLCData = { status: 'active' };
      const mockKanbanData = { boards: [] };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSDLCData),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockKanbanData),
        });

      const { result } = renderHook(() => usePrefetch(), { wrapper });

      await result.current.prefetchSDLCData();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/sdlc/full-state');
        expect(global.fetch).toHaveBeenCalledWith('/api/kanban/board');
      });
    });

    it('should handle fetch errors gracefully', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => usePrefetch(), { wrapper });

      await result.current.prefetchSDLCData();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[Prefetch] Failed to prefetch critical data:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('should handle fetch errors gracefully', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => usePrefetch(), { wrapper });

      await result.current.prefetchSDLCData();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[Prefetch] Failed to prefetch critical data:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('prefetchRoute', () => {
    it('should prefetch SDLC data for /sdlc-dashboard route', async () => {
      const mockSDLCData = { status: 'active' };
      const mockKanbanData = { boards: [] };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSDLCData),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockKanbanData),
        });

      const { result } = renderHook(() => usePrefetch(), { wrapper });

      result.current.prefetchRoute('/sdlc-dashboard');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/sdlc/full-state');
        expect(global.fetch).toHaveBeenCalledWith('/api/kanban/board');
      });
    });

    it('should prefetch dashboard data for /dashboard route', async () => {
      const mockDashboardData = { risk: 0.5 };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDashboardData),
      });

      const { result } = renderHook(() => usePrefetch(), { wrapper });

      result.current.prefetchRoute('/dashboard');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/global-risk/summary');
      });
    });

    it('should prefetch demo data for /demo route', async () => {
      const mockDemoData = { predictions: [] };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDemoData),
      });

      const { result } = renderHook(() => usePrefetch(), { wrapper });

      result.current.prefetchRoute('/demo');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/demo/predictive-data');
      });
    });

    it('should do nothing for unknown routes', () => {
      const { result } = renderHook(() => usePrefetch(), { wrapper });

      result.current.prefetchRoute('/unknown');

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('prefetchOnHover', () => {
    it('should debounce prefetch calls', async () => {
      jest.useFakeTimers();
      const mockData = { risk: 0.5 };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { result } = renderHook(() => usePrefetch(), { wrapper });

      const prefetchFn = result.current.prefetchOnHover('/dashboard');

      // Call multiple times quickly
      prefetchFn();
      prefetchFn();
      prefetchFn();

      // Fast-forward time
      jest.advanceTimersByTime(100);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith('/api/global-risk/summary');
      });

      jest.useRealTimers();
    });
  });

  describe('prefetchOnVisible', () => {
    it('should return an IntersectionObserver instance', () => {
      const { result } = renderHook(() => usePrefetch(), { wrapper });

      const observer = result.current.prefetchOnVisible('/dashboard');

      expect(observer).toBeInstanceOf(IntersectionObserver);
    });

    it('should prefetch when element becomes visible', async () => {
      const mockData = { risk: 0.5 };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { result } = renderHook(() => usePrefetch(), { wrapper });

      const observer = result.current.prefetchOnVisible('/dashboard');

      // Simulate intersection
      const mockEntry = { isIntersecting: true };
      observer.observe(document.createElement('div'));

      // Trigger the callback
      const callback = (observer as any).callback || (() => {});
      callback([mockEntry]);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/global-risk/summary');
      });
    });
  });

  describe('fallback behavior', () => {
    it('should work without QueryClientProvider', () => {
      const { result } = renderHook(() => usePrefetch());

      expect(result.current.prefetchSDLCData).toBeDefined();
      expect(result.current.prefetchRoute).toBeDefined();
    });
  });
});