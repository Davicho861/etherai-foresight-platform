import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para polling inteligente con cache-busting
 * Implementa el "Pulso de la Realidad" para mantener los datos siempre frescos
 */
export function useRealtimeData<T>(
  endpoint: string,
  interval: number = 15000, // 15 segundos por defecto
  options: {
    enabled?: boolean;
    cacheBusting?: boolean;
  } = {}
) {
  const { enabled = true, cacheBusting = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      // Construir URL con cache-busting
      const url = cacheBusting
        ? `${endpoint}?_cache=${new Date().getTime()}`
        : endpoint;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      setLastFetch(new Date());
    } catch (err: any) {
      setError(err.message || 'Error fetching data');
      console.error('useRealtimeData error:', err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, enabled, cacheBusting]);

  // Polling automático
  useEffect(() => {
    if (!enabled) return;

    // Fetch inicial
    fetchData();

    // Configurar polling
    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [fetchData, interval, enabled]);

  // Función manual para refrescar datos
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    lastFetch,
    refresh
  };
}

export default useRealtimeData;