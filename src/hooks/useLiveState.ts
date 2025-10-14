import { useEffect, useState, useCallback } from 'react';

export default function useLiveState(pollInterval = 15000) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveState = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/demo/live-state');
      if (!res.ok) {
        const body = await res.json().catch(() => ({ message: 'No details' }));
        throw new Error(body.error || body.message || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error('useLiveState fetch error:', err);
      setError(err.message || 'Error fetching live state');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveState();
    const id = setInterval(fetchLiveState, pollInterval);
    return () => clearInterval(id);
  }, [fetchLiveState, pollInterval]);

  return { data, loading, error, refresh: fetchLiveState };
}
