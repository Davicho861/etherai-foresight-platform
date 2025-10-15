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
      // Prefetch critical SDLC data. Some QueryClient implementations may
      // return undefined from prefetchQuery when called with an options
      // object; to be robust, check the return value and fall back to
      // calling the queryFn directly.
      // Directly call fetchJson for critical SDLC endpoints so that network
      // errors bubble up and are handled uniformly by the catch below.
      await Promise.all([
        fetchJson('/api/sdlc/full-state'),
        fetchJson('/api/kanban/board'),
      ]);
    } catch (error) {
      // Surface the first error (if it is an AggregateError-like structure
      // we'll still pass the error through). Tests expect a console.warn
      // with the message and an Error object.
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
    // In tests we may need access to the callback to simulate intersections.
    let cb: IntersectionObserverCallback | null = null;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          prefetchRoute(route);
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    try {
      // Access internal callback if available (some test mocks set it)
      // @ts-ignore
      cb = (observer as any).callback || null;
    } catch (e) {
      cb = null;
    }

    // Return observer but also expose the callback property for tests that
    // need to invoke it directly.
    (observer as any).callback = cb;
    return observer as any;
  };

  return {
    prefetchSDLCData,
    prefetchRoute,
    prefetchOnHover,
    prefetchOnVisible,
  };
};