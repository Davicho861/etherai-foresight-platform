import React, { useEffect, useState } from 'react';

const ModuleColombia: React.FC = () => {
  console.log('ModuleColombia render');
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const token = (globalThis?.VITE_PRAEVISIO_TOKEN || process.env.VITE_PRAEVISIO_TOKEN || 'demo-token');
    fetch('/api/module/colombia/overview', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error('fetch_error');
        return res.json();
      })
      .then(json => setData(json))
      .catch(err => setError(err.message || 'error'));
  }, []);

  if (error) return <div className="p-8">Error cargando datos del módulo Colombia: {error}</div>;
  if (!data) return <div className="p-8">Cargando datos del módulo Colombia...</div>;

  return (
    <div className="min-h-screen p-8 bg-etherblue-dark text-white" data-testid="colombia-module">
      <h2 className="text-2xl font-bold mb-4">Módulo de Seguridad LATAM — Colombia</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-etherblue rounded" data-testid="colombia-summary">
          <h3 className="font-semibold">Resumen</h3>
          <pre className="text-sm mt-2 max-h-96 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>
        <div className="p-4 bg-etherblue rounded" data-testid="colombia-map-section">
          <h3 className="font-semibold">Mapa (placeholder)</h3>
          <div className="h-64 bg-etherblue-dark rounded flex items-center justify-center" data-testid="colombia-map-placeholder">Mapa interactivo (integrar Leaflet)</div>
        </div>
      </div>
    </div>
  );
};

export default ModuleColombia;
