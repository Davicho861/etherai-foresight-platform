import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Lazy load los dashboards de élite para una carga inicial ultrarrápida
const StarterDemoDashboard = React.lazy(() => import('@/components/demos/StarterDemoDashboard'));
const GrowthDemoDashboard = React.lazy(() => import('@/components/demos/GrowthDemoDashboard'));
const PantheonDemoDashboard = React.lazy(() => import('@/components/demos/PantheonDemoDashboard'));

// Componente a mostrar cuando ningún plan ha sido seleccionado en la URL
const PlanNotSelected = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center p-8 rounded-lg shadow-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700"
    >
      <h1 className="text-4xl font-bold text-ether-gold mb-4">Portal de Demostración de Élite</h1>
      <p className="text-lg text-gray-300 mb-6">
        La manifestación requiere una intención clara. Seleccione un plan para acceder a su santuario de poder.
      </p>
      <div className="flex justify-center gap-4">
        <motion.a
          whileHover={{ scale: 1.05 }}
          href="/demo?plan=starter"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-md font-semibold transition-all shadow-lg hover:shadow-blue-500/50"
        >
          Starter
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.05 }}
          href="/demo?plan=growth"
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-md font-semibold transition-all shadow-lg hover:shadow-purple-500/50"
        >
          Growth
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.05 }}
          href="/demo?plan=pantheon"
          className="px-6 py-2 bg-amber-600 hover:bg-amber-500 rounded-md font-semibold transition-all shadow-lg hover:shadow-amber-500/50"
        >
          Pantheon
        </motion.a>
      </div>
    </motion.div>
  </div>
);

// Fallback visual mientras se carga el dashboard solicitado
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
    <Loader2 className="h-12 w-12 animate-spin text-ether-gold" />
    <p className="ml-4 text-xl font-light tracking-wider">Forjando la Experiencia Divina...</p>
  </div>
);

/**
 * DemoPage ahora actúa como un controlador de enrutamiento sagrado.
 * Lee el parámetro `plan` de la URL y manifiesta el Dashboard de Élite correspondiente.
 * Si no se especifica ningún plan, presenta un portal para que el usuario elija su destino.
 */
const DemoPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get('plan')?.toLowerCase();

  const renderDashboard = () => {
    switch (plan) {
      case 'starter':
        return <StarterDemoDashboard />;
      case 'growth':
        return <GrowthDemoDashboard />;
      case 'pantheon':
        return <PantheonDemoDashboard />;
      default:
        return <PlanNotSelected />;
    }
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      {renderDashboard()}
    </Suspense>
  );
};

export default DemoPage;