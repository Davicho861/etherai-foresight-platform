import React, { useEffect, useState } from 'react';

const ModuleColombia: React.FC = () => {
  console.log('ModuleColombia render');
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const token = (globalThis?.VITE_PRAEVISIO_TOKEN || (import.meta.env as any)?.VITE_PRAEVISIO_TOKEN || 'demo-token');

    // Determine API base in a robust way:
    // 1) import.meta.env (Vite), 2) globalThis.VITE_API_BASE_URL (runtime injection),
    // 3) default to localhost:4000
    const viteEnv = (import.meta.env as { VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
    const runtimeGlobal = (globalThis as { VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
    const resolvedBase = viteEnv || runtimeGlobal || 'http://localhost:4000';

    // normalize: remove trailing slash if present
    const base = resolvedBase.endsWith('/') ? resolvedBase.slice(0, -1) : resolvedBase;

    // Always use absolute URL to prevent requests being routed to the frontend dev server
    const url = `${base}/api/module/colombia/overview`;

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error('fetch_error');
        return res.json();
      })
      .then(json => setData(json))
      .catch(err => setError(err.message || 'error'));
  }, []);

  if (error) return <div className="p-8">Error cargando datos del módulo: {error}</div>;
  if (!data) return <div className="p-8">Cargando datos del módulo para Colombia...</div>;

  return (
    <div className="min-h-screen p-8 bg-etherblue-dark text-white">
      <h2 className="text-2xl font-bold mb-4">Módulo de Seguridad LATAM — Colombia</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-etherblue rounded">
          <h3 className="font-semibold">Resumen</h3>
          <pre className="text-sm mt-2 max-h-96 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>
        <div className="p-4 bg-etherblue rounded">
          <h3 className="font-semibold">Mapa (placeholder)</h3>
          <div className="h-64 bg-etherblue-dark rounded flex items-center justify-center">Mapa interactivo (integrar Leaflet)</div>
        </div>
      </div>
    </div>
  );
};

export default ModuleColombia;
