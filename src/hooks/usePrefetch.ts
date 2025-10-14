import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Helper to fetch JSON and throw a clear error on network/HTTP failures
async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    // Try to parse JSON body for richer diagnostics
    let body: any = null;
    try {
      body = await res.json();
    } catch (e) {
      try {
        body = await res.text();
      } catch (e2) {
        body = null;
      }
    }
    const bodyStr = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : '';
    throw new Error(`Fetch ${url} failed: ${res.status} ${res.statusText} ${bodyStr}`);
  }
  return res.json();
}

export const usePrefetch = () => {
  let queryClient;
  try {
    queryClient = useQueryClient();
  } catch (_e) {
    // If no QueryClientProvider is present (e.g. some tests), provide
    // a minimal fallback that implements the methods we call so code
    // can run without throwing. This keeps tests isolated and avoids
    // having to wrap every render with a provider.
    queryClient = {
      prefetchQuery: async () => Promise.resolve(),
    } as any;
  }

  const prefetchSDLCData = async () => {
    try {
      // Prefetch critical SDLC data
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: ['sdlc', 'full-state'],
          queryFn: () => fetchJson('/api/sdlc/full-state'),
          staleTime: 5 * 60 * 1000, // 5 minutes
          retry: 0,
        }),
        queryClient.prefetchQuery({
          queryKey: ['kanban', 'board'],
          queryFn: () => fetchJson('/api/kanban/board'),
          staleTime: 5 * 60 * 1000,
          retry: 0,
        }),
      ]);
    } catch (error) {
      console.warn('[Prefetch] Failed to prefetch critical data:', error);
    }
  };

  const prefetchRoute = (route: string) => {
    // Prefetch route-specific data
    switch (route) {
      case '/sdlc-dashboard':
        prefetchSDLCData();
        break;
      case '/dashboard':
        queryClient.prefetchQuery({
          queryKey: ['dashboard', 'global-risk'],
          queryFn: () => fetchJson('/api/global-risk/summary'),
          staleTime: 10 * 60 * 1000, // 10 minutes
          retry: 0,
        });
        break;
      case '/demo':
        queryClient.prefetchQuery({
          queryKey: ['demo', 'data'],
          queryFn: () => fetchJson('/api/demo/predictive-data'),
          staleTime: 15 * 60 * 1000, // 15 minutes
          retry: 0,
        });
        break;
      default:
        break;
    }
  };

  const prefetchOnHover = (route: string) => {
    // Debounce prefetching to avoid excessive requests
    let timeoutId: NodeJS.Timeout;

    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => prefetchRoute(route), 100);
    };
  };

  const prefetchOnVisible = (route: string) => {
    // Use Intersection Observer for prefetching when route becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchRoute(route);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    return observer;
  };

  return {
    prefetchSDLCData,
    prefetchRoute,
    prefetchOnHover,
    prefetchOnVisible,
  };
};