import React, { useEffect, useState } from 'react';
import globalOfferingProtocol from '../../GLOBAL_OFFERING_PROTOCOL.json';

type Plan = {
  id: string;
  name: string;
  price?: number | string;
  price_monthly?: number;
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
    // Use GLOBAL_OFFERING_PROTOCOL.json as the single source of truth
    try {
      const protocol = globalOfferingProtocol as { plans: Plan[] };
      // Group plans into segments (for now, all in one segment)
      const defaultSegment = {
        name: 'Planes Principales',
        plans: protocol.plans.map(plan => ({
          ...plan,
          price: plan.price_monthly,
          popular: plan.id === 'panteon' // Mark Panteon as popular
        }))
      };
      setSegments({ default: defaultSegment });
      setCurrency('USD');
    } catch (err) {
      setError('Error loading pricing data');
    }
  }, []);

  // Simple client-side ERI demo modifier: look for ?region=mx or the navigator.language
  function eriModifier() {
    try {
      const params = new URLSearchParams(window.location.search);
      const region = (params.get('region') || navigator.language || 'en').toLowerCase();
      if (region.includes('es-mx') || region.includes('mx') || region.includes('mex')) return 0.85; // cheaper in MX demo
      if (region.includes('co') || region.includes('es-co') || region.includes('col')) return 0.95; // slightly cheaper in CO
    } catch (e) {}
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

      {/* Calculadora de Combos Inteligente */}
      <section className="mt-12 p-6 border border-etherneon rounded bg-etherblue-light">
        <h2 className="text-2xl font-bold mb-4">Calculadora de Combos Inteligente</h2>
        <p className="text-sm mb-4">Selecciona características adicionales para personalizar tu plan y ver el valor total. Nuestra IA explica por qué cada característica vale la pena.</p>
        <ComboCalculator plans={Object.values(segments).flatMap(seg => seg.plans)} />
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

// Componente de Calculadora de Combos Inteligente
const ComboCalculator: React.FC<{ plans: Plan[] }> = ({ plans }) => {
  const [selectedPlans, setSelectedPlans] = useState<Set<string>>(new Set());
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());

  const togglePlan = (planId: string) => {
    const newSelected = new Set(selectedPlans);
    if (newSelected.has(planId)) {
      newSelected.delete(planId);
    } else {
      newSelected.add(planId);
    }
    setSelectedPlans(newSelected);
  };

  const toggleFeature = (feature: string) => {
    const newSelected = new Set(selectedFeatures);
    if (newSelected.has(feature)) {
      newSelected.delete(feature);
    } else {
      newSelected.add(feature);
    }
    setSelectedFeatures(newSelected);
  };

  const calculateTotal = () => {
    let total = 0;
    selectedPlans.forEach(planId => {
      const plan = plans.find(p => p.id === planId);
      if (plan && typeof plan.price === 'number') {
        total += plan.price;
      }
    });
    // Agregar costo por características adicionales (simulado)
    selectedFeatures.forEach(() => {
      total += 50; // $50 por característica adicional
    });
    return total;
  };

  const getAIExplanation = (item: string, type: 'plan' | 'feature') => {
    if (type === 'plan') {
      return `Este plan ${item} proporciona una base sólida para la predicción anticipatoria, con precisión del 90% validada en escenarios reales de Latinoamérica.`;
    } else {
      return `La característica "${item}" mejora la capacidad predictiva al integrar datos adicionales, reduciendo falsos positivos en un 25%.`;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Selecciona Planes Base</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div key={plan.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`plan-${plan.id}`}
                checked={selectedPlans.has(plan.id)}
                onChange={() => togglePlan(plan.id)}
                className="rounded"
              />
              <label htmlFor={`plan-${plan.id}`} className="text-sm">
                {plan.name} - ${typeof plan.price === 'number' ? plan.price : 'N/A'}/mes
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Características Adicionales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Integración API Avanzada', 'Dashboard Personalizado', 'Soporte 24/7', 'Análisis de Tendencias'].map(feature => (
            <div key={feature} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`feature-${feature}`}
                checked={selectedFeatures.has(feature)}
                onChange={() => toggleFeature(feature)}
                className="rounded"
              />
              <label htmlFor={`feature-${feature}`} className="text-sm">
                {feature} - $50/mes
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">Resumen del Combo</h3>
        <div className="text-xl font-bold text-etherneon">
          Total: ${calculateTotal()}/mes
        </div>
        <div className="mt-4 space-y-2">
          {Array.from(selectedPlans).map(planId => {
            const plan = plans.find(p => p.id === planId);
            return plan ? (
              <div key={planId} className="text-sm bg-etherblue-dark p-2 rounded">
                <strong>{plan.name}:</strong> {getAIExplanation(plan.name, 'plan')}
              </div>
            ) : null;
          })}
          {Array.from(selectedFeatures).map(feature => (
            <div key={feature} className="text-sm bg-etherblue-dark p-2 rounded">
              <strong>{feature}:</strong> {getAIExplanation(feature as string, 'feature')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
