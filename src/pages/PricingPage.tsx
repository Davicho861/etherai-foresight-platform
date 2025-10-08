import React, { useEffect, useState } from 'react';

type Plan = {
  id: string;
  name: string;
  price: number | string;
  billingCycle?: string;
  baseCredits?: number;
  description?: string;
  features?: Array<any>;
  popular?: boolean;
};

const PricingPage: React.FC = () => {
  console.log('PricingPage render');
  const [segments, setSegments] = useState<Record<string, { name: string; plans: Plan[] }>>({});
  const [currency, setCurrency] = useState<string>('USD');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const viteEnv = (import.meta.env as { VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
    const runtimeGlobal = (globalThis as { VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
    const resolvedBase = viteEnv || runtimeGlobal || 'http://localhost:4000';
    const base = resolvedBase.endsWith('/') ? resolvedBase.slice(0, -1) : resolvedBase;
    const url = `${base}/api/pricing-plans`;

    fetch(url)
      .then(res => res.json())
      .then(json => {
        setCurrency(json.currency || 'USD');
        setSegments(json.segments || {});
      })
      .catch(err => setError(err.message || 'error'));
  }, []);

  // Simple client-side ERI demo modifier: look for ?region=mx or the navigator.language
  function eriModifier() {
    try {
      const params = new URLSearchParams(window.location.search);
      const region = (params.get('region') || navigator.language || 'en').toLowerCase();
      if (region.includes('es-mx') || region.includes('mx') || region.includes('mex')) return 0.85; // cheaper in MX demo
      if (region.includes('co') || region.includes('es-co') || region.includes('col')) return 0.95; // slightly cheaper in CO
      } catch (e) { console.debug('eriModifier parsing error:', e?.message || e); }
    return 1;
  }

  const modifier = eriModifier();

  if (error) return <div className="p-8">Error cargando planes: {error}</div>;
  if (!Object.keys(segments).length) return <div className="p-8">Cargando planes...</div>;

  return (
    <div className="min-h-screen p-8 bg-etherblue-dark text-white">
      <h1 className="text-3xl font-bold mb-6">Planes y Precios</h1>

      {/* Pricing table container - used by visual tests */}
      <section data-testid="pricing-table">
        {Object.keys(segments).map(segKey => {
          const seg = segments[segKey];
          return (
            <div key={segKey} className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">{seg.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {seg.plans.map(plan => (
                  <div key={plan.id} className={`p-6 rounded border ${plan.popular ? 'border-amber-400 shadow-lg' : 'border-gray-700'}`}>
                    {plan.popular && <div className="text-xs uppercase text-amber-400 mb-2">Más Popular</div>}
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <div className="text-2xl font-bold my-4">{typeof plan.price === 'number' ? `${Math.round((plan.price as number) * modifier)} ${currency}` : plan.price}</div>
                    {plan.baseCredits && <div className="text-sm text-gray-300">Créditos: {plan.baseCredits}</div>}
                    <p className="text-sm mb-4">{plan.description}</p>
                    <ul className="text-sm mb-4 list-disc list-inside">
                      {(plan.features || []).map((f: any, i: number) => <li key={i}>{typeof f === 'string' ? f : f.name}</li>)}
                    </ul>
                    <a href="#contact" className="inline-block bg-amber-500 text-black px-4 py-2 rounded">Solicitar Demo</a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Panteón destacado si existe */}
      {/* The server currently may not expose pantheonOffering; this reserves the space */}
      <aside className="mt-12 p-6 border border-amber-400 rounded bg-etherblue-light">
        <h2 className="text-2xl font-bold">Nivel Panteón</h2>
        <p className="text-sm mt-2">Oferta exclusiva de nivel Panteón: disponible para clientes de máximo impacto.</p>
      </aside>
    </div>
  );
};

export default PricingPage;
