import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const usePrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchSDLCData = async () => {
    try {
      // Prefetch critical SDLC data
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: ['sdlc', 'full-state'],
          queryFn: () => fetch('/api/sdlc/full-state').then(res => res.json()),
          staleTime: 5 * 60 * 1000, // 5 minutes
        }),
        queryClient.prefetchQuery({
          queryKey: ['kanban', 'board'],
          queryFn: () => fetch('/api/kanban/board').then(res => res.json()),
          staleTime: 5 * 60 * 1000,
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
          queryFn: () => fetch('/api/global-risk/summary').then(res => res.json()),
          staleTime: 10 * 60 * 1000, // 10 minutes
        });
        break;
      case '/demo':
        queryClient.prefetchQuery({
          queryKey: ['demo', 'data'],
          queryFn: () => fetch('/api/demo/predictive-data').then(res => res.json()),
          staleTime: 15 * 60 * 1000, // 15 minutes
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