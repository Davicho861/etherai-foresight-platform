import React, { useEffect, useState } from 'react';

const PricingPage: React.FC = () => {
  console.log('PricingPage render');
  const [plans, setPlans] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Determine API base in a robust way:
    // 1) import.meta.env (Vite), 2) globalThis.VITE_API_BASE_URL (runtime injection),
    // 3) default to localhost:4000
    const viteEnv = (import.meta.env as { VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
    const runtimeGlobal = (globalThis as { VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
    const resolvedBase = viteEnv || runtimeGlobal || 'http://localhost:4000';

    // normalize: remove trailing slash if present
    const base = resolvedBase.endsWith('/') ? resolvedBase.slice(0, -1) : resolvedBase;

    // Always use absolute URL to prevent requests being routed to the frontend dev server
    const url = `${base}/api/pricing-plans`;

    fetch(url)
      .then(res => res.json())
      .then(json => setPlans(json))
      .catch(err => setError(err.message || 'error'));
  }, []);

  if (error) return <div className="p-8">Error cargando planes: {error}</div>;
  if (!plans.length) return <div className="p-8">Cargando planes...</div>;

  return (
    <div className="min-h-screen p-8 bg-etherblue-dark text-white">
      <h2 className="text-3xl font-bold mb-6">Planes y Precios</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className={`p-6 rounded border ${plan.popular ? 'border-amber-400 shadow-lg' : 'border-gray-700'}`}>
            {plan.popular && <div className="text-xs uppercase text-amber-400 mb-2">Más Popular</div>}
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <div className="text-2xl font-bold my-4">{plan.price}</div>
            <p className="text-sm mb-4">{plan.description}</p>
            <ul className="text-sm mb-4 list-disc list-inside">
              {plan.features.map((f: string, i: number) => <li key={i}>{f}</li>)}
            </ul>
            <a href="#contact" className="inline-block bg-amber-500 text-black px-4 py-2 rounded">Solicitar Demo</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
