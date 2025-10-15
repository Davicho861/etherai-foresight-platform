import { useCallback, useEffect, useRef, useState } from 'react';

type UseLiveStateOptions = {
  url?: string;
  intervalMs?: number;
  retryCount?: number;
};

export default function useLiveState(options?: UseLiveStateOptions) {
  const url = options?.url ?? '/api/demo/live-state';
  const intervalMs = options?.intervalMs ?? 15000;
  const retryCount = options?.retryCount ?? 2;

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);

  const fetchLiveState = useCallback(async () => {
    setLoading(true);
    setError(null);
    let attempt = 0;
    while (attempt <= retryCount && mountedRef.current) {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          const body = await res.json().catch(() => ({ message: 'No details' }));
          throw new Error(body.error || body.message || `HTTP ${res.status}`);
        }
        const json = await res.json();
        if (!mountedRef.current) return;
        setData(json);
        setError(null);
        break;
      } catch (err: any) {
        attempt += 1;
        if (attempt > retryCount) {
          console.error('useLiveState fetch error:', err);
          if (!mountedRef.current) return;
          setError(err.message || 'Error fetching live state');
        } else {
          // backoff
          const backoff = Math.min(1000 * attempt, 5000);
           
          await new Promise((r) => setTimeout(r, backoff));
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }
  }, [url, retryCount]);

  useEffect(() => {
    mountedRef.current = true;
    fetchLiveState().catch(() => {});
    const id = setInterval(() => {
      fetchLiveState().catch(() => {});
    }, intervalMs);
    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
  }, [fetchLiveState, intervalMs]);

  return { data, loading, error, refresh: fetchLiveState } as const;
}
