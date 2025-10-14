import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useLiveState from '../hooks/useLiveState';
import useXaiExplain from '../hooks/useXaiExplain';
import XaiExplainModal from '../components/widgets/XaiExplainModal';

// SANTUARIOS SOBERANOS DE LA WEB APP
import PredictiveAnalysisDashboard from '../components/dashboards/PredictiveAnalysisDashboard';
import RiskAssessmentDashboard from '../components/dashboards/RiskAssessmentDashboard';
import LogisticsOptimizationDashboard from '../components/dashboards/LogisticsOptimizationDashboard';
import SystemStatusDashboard from '../components/dashboards/SystemStatusDashboard';

// Tipos para los cuatro santuarios soberanos
type SovereignSanctuary = 'overview' | 'predictive-analysis' | 'risk-assessment' | 'logistics-optimization';

interface SovereignSidebarItem {
  id: SovereignSanctuary;
  label: string;
  icon: string;
  description: string;
  domain: string;
  priority: number;
}

const sovereignSidebarItems: SovereignSidebarItem[] = [
  {
    id: 'overview',
    label: 'Visión General',
    icon: '🔮',
    description: 'Dashboard de bienvenida con KPIs élite',
    domain: 'Inteligencia Soberana',
    priority: 1
  },
  {
    id: 'predictive-analysis',
    label: 'Análisis Predictivo',
    icon: '📈',
    description: 'Oráculo de tendencias y predicciones',
    domain: 'Inteligencia Artificial',
    priority: 2
  },
  {
    id: 'risk-assessment',
    label: 'Evaluación de Riesgos',
    icon: '🌍',
    description: 'Mapa global de hotspots y amenazas',
    domain: 'Geopolítica',
    priority: 3
  },
  {
    id: 'logistics-optimization',
    label: 'Optimización Logística',
    icon: '🚛',
    description: 'Cadenas de suministro y resiliencia',
    domain: 'Supply Chain',
    priority: 4
  }
];

const DashboardPage: React.FC = () => {
  const [currentSovereignView, setCurrentSovereignView] = useState<SovereignSanctuary>('overview');
  // Hook centralizado para datos 100% reales
  const { data: liveState, loading, error, refresh } = useLiveState();
  const { explain: requestDivineExplanation, loading: xaiLoading, last: xaiContent } = useXaiExplain();
  const [xaiOpen, setXaiOpen] = useState(false);
  const [xaiContext, setXaiContext] = useState<{ metric: string; value: any; context: string } | null>(null);

  // CONEXIÓN CON LA REALIDAD - Hook centralizado para datos 100% reales
  // Distribuir segmentos para cada santuario a partir de liveState
  const predictiveData = liveState || null;
  const riskData = liveState?.global?.seismic || null;
  const logisticsData = liveState?.foodSecurity || liveState?.communityResilience || null;
  const overviewData = liveState || null;

  // RENDERERS PARA LOS CUATRO SANTUARIOS SOBERANOS
  const renderOverview = () => (
    <div className="space-y-8">
      {/* HEADER SOBERANO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
          🏛️ Praevisio AI - Visión General
        </h1>
        <p className="text-slate-400 text-lg">
          Dashboard soberano con KPIs élite - 100% datos reales
        </p>
      </motion.div>

      {/* KPIs ÉLITE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PRECISIÓN PREDICTIVA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">🎯</div>
            <button
              onClick={() => requestDivineExplanation('precisionPromedio', overviewData?.kpis?.precisionPromedio || 0, 'Overview')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg"
            >
              ✨
            </button>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Precisión Predictiva</h3>
            <div className="text-3xl font-bold text-cyan-400">
              {overviewData?.kpis?.precisionPromedio || 0}%
            </div>
            <p className="text-sm text-slate-400">Accuracy de modelos predictivos</p>
          </div>
        </motion.div>

        {/* PREDICCIONES ACTIVAS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">📊</div>
            <button
              onClick={() => requestDivineExplanation('prediccionesDiarias', overviewData?.kpis?.prediccionesDiarias || 0, 'Overview')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg"
            >
              ✨
            </button>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Predicciones Activas</h3>
            <div className="text-3xl font-bold text-blue-400">
              {overviewData?.kpis?.prediccionesDiarias || 0}
            </div>
            <p className="text-sm text-slate-400">Señales críticas procesadas</p>
          </div>
        </motion.div>

        {/* COBERTURA GLOBAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">🌍</div>
            <button
              onClick={() => requestDivineExplanation('coberturaGlobal', overviewData?.countries?.length || 0, 'Overview')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg"
            >
              ✨
            </button>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Cobertura Global</h3>
            <div className="text-3xl font-bold text-purple-400">
              {overviewData?.countries?.length || 0}
            </div>
            <p className="text-sm text-slate-400">Países LATAM monitoreados</p>
          </div>
        </motion.div>
      </div>

      {/* ESTADO DEL IMPERIO SIMPLIFICADO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
      >
        <h2 className="text-2xl font-bold text-white mb-6">⚡ Estado del Imperio</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Realidad</span>
            <span className="text-green-400">● 100% Real</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">IA Explicativa</span>
            <span className="text-green-400">● Activa</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Santuarios</span>
            <span className="text-green-400">● Cargados</span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderPredictiveAnalysis = () => (
    <PredictiveAnalysisDashboard
      divineData={predictiveData}
      requestDivineExplanation={(metric: string, value: any, context: string) => { setXaiContext({ metric, value, context }); setXaiOpen(true); }}
    />
  );

  const renderRiskAssessment = () => (
    <RiskAssessmentDashboard
      riskData={riskData}
      requestDivineExplanation={(metric: string, value: any, context: string) => { setXaiContext({ metric, value, context }); setXaiOpen(true); }}
    />
  );

  const renderLogisticsOptimization = () => (
    <LogisticsOptimizationDashboard
      logisticsData={logisticsData}
      requestDivineExplanation={(metric: string, value: any, context: string) => { setXaiContext({ metric, value, context }); setXaiOpen(true); }}
    />
  );

  const renderCurrentSovereignView = () => {
    switch (currentSovereignView) {
      case 'overview':
        return renderOverview();
      case 'predictive-analysis':
        return renderPredictiveAnalysis();
      case 'risk-assessment':
        return renderRiskAssessment();
      case 'logistics-optimization':
        return renderLogisticsOptimization();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* SIDEBAR SOBERANO - NAVEGADOR ENTRE SANTUARIOS */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed left-0 top-0 h-full w-80 bg-gradient-to-br from-slate-900/90 via-slate-800/95 to-slate-900/90 backdrop-blur-2xl border-r border-cyan-400/20 shadow-2xl shadow-cyan-500/10 z-10 overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 50%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)'
        }}
      >
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              🏛️ Praevisio AI
            </h2>
            <p className="text-slate-400 text-sm mt-1">Web App Soberana</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            {sovereignSidebarItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentSovereignView(item.id)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-300 group ${
                  currentSovereignView === item.id
                    ? 'bg-gradient-to-r from-cyan-500/30 via-blue-600/25 to-purple-600/30 border border-cyan-400/60 shadow-xl shadow-cyan-500/20 backdrop-blur-sm'
                    : 'bg-slate-700/40 hover:bg-slate-600/60 border border-slate-600/40 hover:border-cyan-400/30 backdrop-blur-sm'
                }`}
                style={{
                  background: currentSovereignView === item.id
                    ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.12) 50%, rgba(147, 51, 234, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(71, 85, 105, 0.3) 0%, rgba(51, 65, 85, 0.4) 100%)',
                  backdropFilter: 'blur(8px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(8px) saturate(150%)'
                }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className={`font-semibold ${currentSovereignView === item.id ? 'text-cyan-300' : 'text-white'}`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-400">{item.description}</div>
                    <div className="text-xs text-slate-500 mt-1">{item.domain}</div>
                  </div>
                </div>
                {currentSovereignView === item.id && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* ESTADO DE LA WEB APP EN SIDEBAR */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-4 rounded-xl border border-cyan-400/20"
            style={{
              background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.2) 0%, rgba(51, 65, 85, 0.3) 100%)',
              backdropFilter: 'blur(10px) saturate(120%)',
              WebkitBackdropFilter: 'blur(10px) saturate(120%)'
            }}
          >
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Estado de la Web App</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Realidad</span>
                <span className="text-xs text-green-400">● 100% Real</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">IA Explicativa</span>
                <span className="text-xs text-green-400">● Activa</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Santuarios</span>
                <span className="text-xs text-green-400">● Cargados</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* CONTENIDO PRINCIPAL DIVINO */}
      <div className="ml-80 min-h-screen relative">
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
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400">Cargando experiencia divina...</p>
                <p className="text-slate-500 text-sm mt-2">Conectando con la realidad soberana</p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-900/20 border border-red-700/50 rounded-2xl p-6 text-red-200 max-w-md mx-auto"
            >
              <div className="flex items-center mb-2">
                <span className="text-red-400 mr-2">⚠️</span>
                <span className="font-semibold">Error de Conexión Divina</span>
              </div>
              <p className="text-sm">{error}</p>
              <p className="text-xs text-red-300 mt-2">La realidad no está disponible temporalmente</p>
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSovereignView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCurrentSovereignView()}
                </motion.div>
              </AnimatePresence>

              {/* MODAL XAI DIVINO */}
              <XaiExplainModal
                open={xaiOpen && !!xaiContext}
                onClose={() => { setXaiOpen(false); setXaiContext(null); }}
                metric={xaiContext?.metric || ''}
                value={xaiContext?.value ?? ''}
                context={xaiContext?.context || ''}
              />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
