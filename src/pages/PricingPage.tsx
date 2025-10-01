import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

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

  // Get all unique features across plans
  const allFeatures = Array.from(new Set(plans.flatMap(plan => plan.features)));

  return (
    <div className="min-h-screen bg-[#0F1419] text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Planes y Precios</h1>
          <p className="text-xl text-gray-300">Elija el plan perfecto para su organización</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-gray-900 rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-6 py-4 text-left font-semibold">Características</th>
                {plans.map(plan => (
                  <th key={plan.id} className={`px-6 py-4 text-center font-semibold ${plan.popular ? 'bg-amber-600 text-black' : 'bg-gray-700'}`}>
                    {plan.name}
                    {plan.popular && <div className="text-xs font-normal mt-1">Más Popular</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-700">
                <td className="px-6 py-4 font-medium">Precio</td>
                {plans.map(plan => (
                  <td key={plan.id} className={`px-6 py-4 text-center font-bold text-xl ${plan.popular ? 'bg-amber-600 text-black' : 'bg-gray-800'}`}>
                    {plan.price}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-700">
                <td className="px-6 py-4 font-medium">Descripción</td>
                {plans.map(plan => (
                  <td key={plan.id} className={`px-6 py-4 text-center text-sm ${plan.popular ? 'bg-amber-600 text-black' : 'bg-gray-800'}`}>
                    {plan.description}
                  </td>
                ))}
              </tr>
              {allFeatures.map((feature, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="px-6 py-4">{feature}</td>
                  {plans.map(plan => (
                    <td key={plan.id} className={`px-6 py-4 text-center ${plan.popular ? 'bg-amber-600 text-black' : 'bg-gray-800'}`}>
                      {plan.features.includes(feature) ? (
                        <Check className="w-5 h-5 mx-auto text-green-500" />
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-gray-700">
                <td className="px-6 py-4"></td>
                {plans.map(plan => (
                  <td key={plan.id} className={`px-6 py-4 text-center ${plan.popular ? 'bg-amber-600 text-black' : 'bg-gray-800'}`}>
                    <Button
                      className={`w-full ${plan.popular ? 'bg-black text-amber-400 hover:bg-gray-800' : 'bg-blue-600 hover:bg-blue-700'}`}
                      onClick={() => window.location.href = '#contact'}
                    >
                      Solicitar Demo
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-300 mb-4">¿Necesita una solución personalizada?</p>
          <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
            Contactar Ventas
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
