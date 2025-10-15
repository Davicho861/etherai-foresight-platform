import { useState, useEffect } from 'react';
import { LiveData } from '@/types/index';

const useDemoData = () => {
  const [data, setData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/demo/live-state');
        if (!response.ok) {
          throw new Error(`Error de Conexión Divina: ${response.statusText}`);
        }
        const result: LiveData = await response.json();
        setData(result);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Ocurrió un error desconocido');
        // Opcional: Cargar datos de mock como fallback
        try {
          const staticResp = await fetch('/mock/demo-live-state.json');
          if (staticResp.ok) {
            const staticData = await staticResp.json();
            setData(staticData);
          }
        } catch (mockErr) {
          console.error("Fallback a mock fallido:", mockErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Opcional: refrescar datos periódicamente
    const interval = setInterval(fetchData, 60000); // cada 60 segundos
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
};

export default useDemoData;
