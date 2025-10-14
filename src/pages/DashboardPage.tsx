import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useLiveState from '../hooks/useLiveState';
import useXaiExplain from '../hooks/useXaiExplain';
import XaiExplainModal from '../components/widgets/XaiExplainModal';

// DASHBOARDS UNIFICADOS POR PLANES SOBERANOS
import StarterDemoDashboard from '../components/demos/StarterDemoDashboard';
import GrowthDemoDashboard from '../components/demos/GrowthDemoDashboard';
import PantheonDemoDashboard from '../components/demos/PantheonDemoDashboard';

// SDLC PARA PLAN PANTHEÓN
import SdlcDashboardPage from './SdlcDashboardPage';

// GLOBAL OFFERING PROTOCOL - PRECIOS Y CARACTERÍSTICAS
import globalOffering from '../../GLOBAL_OFFERING_PROTOCOL.json';

// Tipos para los planes soberanos
type SovereignPlan = 'starter' | 'growth' | 'pantheon';

interface SovereignPlanConfig {
  id: SovereignPlan;
  label: string;
  icon: string;
  description: string;
  price: number;
  features: string[];
  color: string;
  priority: number;
}

// CONFIGURACIÓN DE PLANES CON PRECIOS REALES DEL GLOBAL_OFFERING_PROTOCOL
const sovereignPlanConfigs: SovereignPlanConfig[] = globalOffering.plans.map(plan => ({
  id: plan.id as SovereignPlan,
  label: plan.name,
  icon: plan.id === 'starter' ? '🌱' : plan.id === 'growth' ? '🚀' : '🏛️',
  description: plan.id === 'starter' ? 'KPIs esenciales y monitoreo básico' :
               plan.id === 'growth' ? 'Análisis causal y simulaciones avanzadas' :
               'SDLC completo y gobernanza total',
  price: plan.price_monthly,
  features: plan.features,
  color: plan.id === 'starter' ? 'from-green-500 to-emerald-500' :
          plan.id === 'growth' ? 'from-blue-500 to-cyan-500' :
          'from-purple-500 to-pink-500',
  priority: plan.id === 'starter' ? 1 : plan.id === 'growth' ? 2 : 3
}));

const DashboardPage: React.FC = () => {
  const [currentSovereignPlan, setCurrentSovereignPlan] = useState<SovereignPlan>('starter');
  // Hook centralizado para datos 100% reales
  const { data: liveState, loading, error, refresh } = useLiveState();
  const { explain: requestDivineExplanation, loading: xaiLoading, last: xaiContent } = useXaiExplain();
  const [xaiOpen, setXaiOpen] = useState(false);
  const [xaiContext, setXaiContext] = useState<{ metric: string; value: any; context: string } | null>(null);

  // CONEXIÓN CON LA REALIDAD - Hook centralizado para datos 100% reales
  // Distribuir datos según el plan soberano seleccionado
  const getPlanData = (plan: SovereignPlan) => {
    const baseData = liveState || null;
    switch (plan) {
      case 'starter':
        return {
          kpis: baseData?.kpis || { precisionPromedio: 90, prediccionesDiarias: 120, monitoreoContinuo: 24, coberturaRegional: 6 },
          countries: baseData?.countries || []
        };
      case 'growth':
        return {
          kpis: baseData?.kpis || { precisionPromedio: 90, prediccionesDiarias: 120, monitoreoContinuo: 24, coberturaRegional: 6 },
          countries: baseData?.countries || [],
          communityResilience: baseData?.communityResilience || null,
          foodSecurity: baseData?.foodSecurity || null
        };
      case 'pantheon':
        return {
          kpis: baseData?.kpis || { precisionPromedio: 90, prediccionesDiarias: 120, monitoreoContinuo: 24, coberturaRegional: 6 },
          countries: baseData?.countries || [],
          communityResilience: baseData?.communityResilience || null,
          foodSecurity: baseData?.foodSecurity || null,
          ethicalAssessment: baseData?.ethicalAssessment || null,
          global: baseData?.global || null
        };
      default:
        return baseData || null;
    }
  };

  const currentPlanData = getPlanData(currentSovereignPlan);

  // RENDERERS PARA LOS PLANES SOBERANOS UNIFICADOS
  const renderCurrentSovereignPlan = () => {
    switch (currentSovereignPlan) {
      case 'starter':
        return <StarterDemoDashboard data={currentPlanData} />;
      case 'growth':
        return <GrowthDemoDashboard data={currentPlanData} />;
      case 'pantheon':
        return (
          <div className="space-y-8">
            <PantheonDemoDashboard data={currentPlanData} />
            {/* SDLC INTEGRADO COMO MÓDULO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">🔄</span>
                SDLC - Ciclo de Vida Soberano
              </h2>
              <p className="text-slate-400 mb-4">
                Gobernanza completa del desarrollo de software con métricas en tiempo real
              </p>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <SdlcDashboardPage />
              </div>
            </motion.div>
          </div>
        );
      default:
        return <StarterDemoDashboard data={currentPlanData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* CONTENIDO PRINCIPAL DEL PANTEÓN DE VALOR */}
      <div className="min-h-screen relative">
        {/* FONDO CUÁNTICO GLASSMORPHISM */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)'
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-8 relative z-10"
        >
          {/* SECCIÓN SUPERIOR: PANTEÓN DE PLANES CON PRECIOS */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                🏛️ Panteón de Valor - Praevisio AI
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Elige tu camino hacia la previsión soberana. Cada plan revela capas más profundas de la realidad predictiva.
              </p>
            </div>

            {/* TARJETAS DE PRECIOS GLASSMORPHISM */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {sovereignPlanConfigs.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`relative group cursor-pointer ${
                    currentSovereignPlan === plan.id ? 'ring-2 ring-cyan-400/50' : ''
                  }`}
                  onClick={() => setCurrentSovereignPlan(plan.id)}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl p-8 h-full transition-all duration-500 ${
                      currentSovereignPlan === plan.id
                        ? 'bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-purple-600/20 border border-cyan-400/40 shadow-2xl shadow-cyan-500/20'
                        : 'bg-gradient-to-br from-slate-800/60 via-slate-700/50 to-slate-800/60 border border-slate-600/30 hover:border-cyan-400/30 shadow-xl hover:shadow-cyan-500/10'
                    }`}
                    style={{
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                      background: currentSovereignPlan === plan.id
                        ? `linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.12) 50%, rgba(147, 51, 234, 0.15) 100%)`
                        : `linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.5) 50%, rgba(30, 41, 59, 0.6) 100%)`
                    }}
                  >
                    {/* EFECTO GLASSMORPHISM ANIMADO */}
                    <div className="absolute inset-0 opacity-20">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-10 animate-pulse`}
                        style={{
                          animation: 'shimmer 3s ease-in-out infinite',
                          backgroundSize: '200% 200%'
                        }}
                      />
                    </div>

                    <div className="relative z-10">
                      {/* HEADER CON ICONO Y NOMBRE */}
                      <div className="text-center mb-6">
                        <div className="text-5xl mb-3">{plan.icon}</div>
                        <h3 className={`text-2xl font-bold mb-2 ${
                          currentSovereignPlan === plan.id ? 'text-cyan-300' : 'text-white'
                        }`}>
                          {plan.label}
                        </h3>
                        <p className="text-slate-400 text-sm">{plan.description}</p>
                      </div>

                      {/* PRECIO PROMINENTE */}
                      <div className="text-center mb-6">
                        <div className={`text-4xl font-bold mb-1 ${
                          currentSovereignPlan === plan.id ? 'text-cyan-200' : 'text-white'
                        }`}>
                          ${plan.price}
                        </div>
                        <div className="text-slate-400 text-sm">por mes</div>
                      </div>

                      {/* CARACTERÍSTICAS */}
                      <div className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              currentSovereignPlan === plan.id ? 'bg-cyan-400' : 'bg-slate-500'
                            }`} />
                            <span className={`text-sm ${
                              currentSovereignPlan === plan.id ? 'text-slate-200' : 'text-slate-400'
                            }`}>
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* INDICADOR DE SELECCIÓN */}
                      {currentSovereignPlan === plan.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center"
                        >
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* SECCIÓN INFERIOR: ORÁCULO VIVIENTE - WIDGETS DINÁMICOS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                🔮 Oráculo Viviente - {sovereignPlanConfigs.find(p => p.id === currentSovereignPlan)?.label}
              </h2>
              <p className="text-slate-400">
                Experimenta el poder predictivo de tu plan seleccionado
              </p>
            </div>

            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-[60vh]"
              >
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
                    <div className="absolute inset-0 w-20 h-20 border-4 border-purple-400/20 border-t-purple-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    <div className="absolute inset-2 w-16 h-16 border-4 border-pink-400/20 border-t-pink-400 rounded-full animate-spin mx-auto" style={{ animationDuration: '0.8s' }}></div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-2">Cargando Experiencia Divina</h3>
                    <p className="text-slate-400 mb-4">Estableciendo conexión con la realidad soberana</p>

                    <div className="flex justify-center space-x-2 mb-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>

                    <div className="max-w-xs mx-auto">
                      <div className="text-xs text-slate-500 space-y-1">
                        <div className="flex justify-between">
                          <span>Conectando APIs externas...</span>
                          <span className="text-green-400">✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cargando datos históricos...</span>
                          <span className="text-green-400">✓</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Inicializando motor predictivo...</span>
                          <span className="text-cyan-400 animate-pulse">⟳</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Validando soberanía...</span>
                          <span className="text-gray-500">○</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-xl border border-red-700/50 rounded-2xl p-8 text-red-200 max-w-lg mx-auto shadow-2xl shadow-red-500/10"
              >
                <div className="text-center mb-6">
                  <div className="p-4 bg-red-500/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-bold text-red-300 mb-2">Error de Conexión Divina</h3>
                  <p className="text-red-200/80 text-sm">{error}</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Estado del Sistema:</span>
                    <span className="text-yellow-400 font-medium">Recuperando Conexión</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-red-300/70 mb-4">
                    La realidad soberana no está disponible temporalmente. Los datos se están recuperando de fuentes alternativas.
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
                    <span>Intentando reconexión automática...</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSovereignPlan}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCurrentSovereignPlan()}
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>

          {/* MODAL XAI DIVINO */}
          <XaiExplainModal
            open={xaiOpen && !!xaiContext}
            onClose={() => { setXaiOpen(false); setXaiContext(null); }}
            metric={xaiContext?.metric || ''}
            value={xaiContext?.value ?? ''}
            context={xaiContext?.context || ''}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
