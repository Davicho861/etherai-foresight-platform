import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import globalOfferingProtocol from '../../GLOBAL_OFFERING_PROTOCOL.json';
import DemoPage from './DemoPage';

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

const PricingPage: React.FC<{ protocolOverride?: any }> = ({ protocolOverride }) => {
   console.log('PricingPage render');
   const [segments, setSegments] = useState<Record<string, { name: string; plans: Plan[] }>>({});
   const [currency, setCurrency] = useState<string>('USD');
   const [error, setError] = useState<string | null>(null);
   const [demoModalOpen, setDemoModalOpen] = useState(false);
   const [selectedPlanForDemo, setSelectedPlanForDemo] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically import GLOBAL_OFFERING_PROTOCOL.json to allow tests to mock it
    let mounted = true;
    (async () => {
      try {
        let protocol: any = null;
        if (protocolOverride !== undefined) {
          if (protocolOverride === null) throw new Error('protocol override null');
          protocol = protocolOverride;
        } else {
          // Prefer synchronous require so jest.mock at top of tests is honored
          try {
             
            protocol = require('../../GLOBAL_OFFERING_PROTOCOL.json');
            protocol = (protocol && protocol.default) ? protocol.default : protocol;
          } catch (reqErr) {
            // Fallback to dynamic import if require isn't available
             
            const protocolModule = await import('../../GLOBAL_OFFERING_PROTOCOL.json');
            protocol = (protocolModule && protocolModule.default) ? protocolModule.default : protocolModule;
          }
        }

        const defaultSegment = {
          name: 'Planes Principales',
          plans: (protocol.plans || []).map((plan: Plan) => ({
            ...plan,
            price: plan.price_monthly,
            popular: plan.id === 'panteon'
          }))
        };
        if (mounted) {
          setSegments({ default: defaultSegment });
          setCurrency('USD');
        }
      } catch (err) {
        if (mounted) setError('Error loading pricing data');
      }
    })();

    return () => { mounted = false; };
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

  const openDemoModal = (planId: string) => {
    setSelectedPlanForDemo(planId);
    setDemoModalOpen(true);
  };

  if (error) return <div className="p-8">Error cargando planes de precios: {error}</div>;
  if (!Object.keys(segments).length) return <div className="p-8">Cargando planes de precios...</div>;

  return (
    <div className="min-h-screen bg-gemini-background text-gemini-text-primary relative overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-gemini-background/50 backdrop-blur-sm"></div>

      <div className="relative z-10 p-8">
        <motion.h1
          className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-gemini-primary to-gemini-accent-yellow bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Panteón de Valor - Praevisio AI
        </motion.h1>

        <motion.p
          className="text-xl text-center mb-16 text-gemini-text-secondary max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Cada plan es un altar sagrado, cada demo una epifanía. Elige tu camino hacia la inteligencia predictiva de élite.
        </motion.p>

        {/* Pricing table container - used by visual tests */}
        <section data-testid="pricing-table" className="mb-20">
          {Object.keys(segments).map((segKey, segIndex) => {
            const seg = segments[segKey];
            return (
              <motion.div
                key={segKey}
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + segIndex * 0.2, duration: 0.6 }}
              >
                <h2 className="text-3xl font-semibold mb-8 text-center">{seg.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                  {seg.plans.map((plan, planIndex) => (
                    <motion.div
                      key={plan.id}
                      className={`relative p-8 rounded-2xl border backdrop-blur-md bg-gemini-background-secondary shadow-2xl ${
                        plan.popular
                          ? 'border-gemini-primary shadow-gemini-primary/20'
                          : 'border-gemini-border hover:border-gemini-primary/50'
                      } transition-all duration-300`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + planIndex * 0.1, duration: 0.5 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {plan.popular && (
                        <motion.div
                          className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gemini-primary text-gemini-background px-4 py-1 rounded-full text-sm font-semibold uppercase"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1 + planIndex * 0.1, type: 'spring', stiffness: 200 }}
                        >
                          Altar Principal
                        </motion.div>
                      )}

                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <div
                          data-testid={`plan-price-${plan.id}`}
                          className="text-4xl font-extrabold text-gemini-primary mb-2"
                        >
                          {typeof plan.price === 'number' ? `${Math.round((plan.price as number) * modifier)} ${currency}` : plan.price}
                        </div>
                        {plan.baseCredits && (
                          <div className="text-sm text-gray-400">Créditos: {plan.baseCredits}</div>
                        )}
                      </div>

                      <p className="text-gemini-text-secondary mb-6 text-center">{plan.description}</p>

                      <ul className="text-sm mb-8 space-y-2">
                        {(plan.features || []).map((f: any, i: number) => (
                          <li key={i} className="flex items-center">
                            <span className="text-gemini-primary mr-2">✦</span>
                            {typeof f === 'string' ? f : f.name}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-col gap-3">
                        <Dialog open={demoModalOpen && selectedPlanForDemo === plan.id} onOpenChange={setDemoModalOpen}>
                          <DialogTrigger asChild>
                            <motion.button
                              className="w-full gemini-button-primary"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openDemoModal(plan.id)}
                            >
                              Ver Demo de este Plan
                            </motion.button>
                          </DialogTrigger>
                          <DialogContent className="max-w-full h-full p-0 bg-transparent border-none">
                            {/* Pass the selected plan to DemoPage so tests that mock DemoPage
                                with a prop-based API receive the correct plan id. */}
                            <DemoPage {...( { plan: selectedPlanForDemo ?? plan.id } as any )} />
                          </DialogContent>
                        </Dialog>

                        <a
                          href="#contact"
                          className="text-center text-sm underline text-gemini-primary hover:text-gemini-text-primary transition-colors"
                        >
                          Solicitar Demo Personalizada
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* Calculadora Soberana */}
        <motion.section
          className="mb-20 p-8 rounded-3xl border border-gemini-primary/30 backdrop-blur-md bg-gradient-to-br from-gemini-background-secondary/20 to-gemini-accent-yellow/20 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gemini-primary to-gemini-accent-yellow bg-clip-text text-transparent">
              Calculadora Soberana
            </h2>
            <p className="text-lg text-gemini-text-secondary">
              Forja tu combo perfecto. Nuestra IA revela el valor oculto de cada elección.
            </p>
          </div>
          <ComboCalculator plans={(Object.values(segments) as Array<{ name: string; plans: Plan[] }>).flatMap(seg => seg.plans)} />
        </motion.section>

        {/* Panteón destacado */}
        <motion.aside
          className="p-8 rounded-3xl border border-gemini-accent-yellow/50 backdrop-blur-md bg-gradient-to-br from-gemini-accent-yellow/20 to-gemini-background-secondary/20 shadow-2xl text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-gemini-accent-yellow">Nivel Panteón</h2>
          <p className="text-lg text-gemini-text-secondary mb-6">
            Oferta exclusiva para visionarios de máximo impacto. Accede a la inteligencia predictiva definitiva.
          </p>
          <motion.button
            className="bg-gradient-to-r from-gemini-accent-yellow to-gemini-accent-yellow-hover text-gemini-background font-semibold py-3 px-8 rounded-lg hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Solicitar Acceso Panteón
          </motion.button>
        </motion.aside>
      </div>
    </div>
  );
};

// Componente de Calculadora Soberana
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Panel de Selección */}
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-6 text-gemini-primary">Altares Base</h3>
          <div className="space-y-4">
            {plans.map(plan => (
              <motion.div
                key={plan.id}
                data-testid={`plan-toggle-${plan.id}`}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPlans.has(plan.id)
                    ? 'border-gemini-primary bg-gemini-primary/10 shadow-lg'
                    : 'border-gemini-border hover:border-gemini-primary/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => togglePlan(plan.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{plan.name}</h4>
                    <p className="text-sm text-gemini-text-muted">${typeof plan.price === 'number' ? plan.price : 'N/A'}/mes</p>
                  </div>
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    selectedPlans.has(plan.id) ? 'bg-gemini-primary border-gemini-primary' : 'border-gemini-border'
                  }`}>
                    {selectedPlans.has(plan.id) && <span className="text-black text-sm">✓</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-6 text-gemini-primary">Reliquias Adicionales</h3>
          <div className="grid grid-cols-1 gap-4">
            {['Integración API Avanzada', 'Dashboard Personalizado', 'Soporte 24/7', 'Análisis de Tendencias'].map(feature => (
              <motion.div
                key={feature}
                data-testid={`feature-toggle-${feature.replace(/\s+/g, '-').toLowerCase()}`}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedFeatures.has(feature)
                    ? 'border-gemini-primary bg-gemini-primary/10 shadow-lg'
                    : 'border-gemini-border hover:border-gemini-primary/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleFeature(feature)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{feature}</h4>
                    <p className="text-sm text-gemini-text-muted">$50/mes</p>
                  </div>
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    selectedFeatures.has(feature) ? 'bg-gemini-primary border-gemini-primary' : 'border-gemini-border'
                  }`}>
                    {selectedFeatures.has(feature) && <span className="text-black text-sm">✓</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Panel de Resultados */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="bg-gradient-to-br from-gemini-background-secondary/30 to-gemini-accent-yellow/30 p-6 rounded-2xl border border-gemini-primary/30">
          <h3 className="text-2xl font-bold mb-4 text-center text-gemini-text-primary">Total Soberano</h3>
          <motion.div
            className="text-5xl font-extrabold text-center text-gemini-primary mb-2"
            data-testid="calculator-total"
            key={calculateTotal()}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            ${calculateTotal()}/mes
          </motion.div>
          <p className="text-center text-gemini-text-muted">Valor calculado instantáneamente</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gemini-primary">Oráculo de Valor</h3>
          {Array.from(selectedPlans).map(planId => {
            const plan = plans.find(p => p.id === planId);
            return plan ? (
              <motion.div
                key={planId}
                className="p-4 bg-gradient-to-r from-gemini-background-secondary/50 to-gemini-accent-yellow/50 rounded-lg border border-gemini-primary/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h4 className="font-semibold text-gemini-primary mb-2">{plan.name}</h4>
                <p className="text-sm text-gemini-text-secondary">{getAIExplanation(plan.name, 'plan')}</p>
              </motion.div>
            ) : null;
          })}
          {Array.from(selectedFeatures).map(feature => (
            <motion.div
              key={feature}
              className="p-4 bg-gradient-to-r from-gemini-success/20 to-gemini-primary/20 rounded-lg border border-gemini-success/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h4 className="font-semibold text-gemini-success mb-2">{feature}</h4>
              <p className="text-sm text-gemini-text-secondary">{getAIExplanation(feature as string, 'feature')}</p>
            </motion.div>
          ))}
          {selectedPlans.size === 0 && selectedFeatures.size === 0 && (
            <div className="text-center text-gemini-text-muted py-8">
              Selecciona altares y reliquias para revelar el oráculo de valor
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PricingPage;
