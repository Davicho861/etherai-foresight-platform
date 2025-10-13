import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CEODashboard from '../components/dashboards/CEODashboard';
import RiskAssessmentDashboard from '../components/dashboards/RiskAssessmentDashboard';
import LogisticsDashboard from '../components/dashboards/LogisticsDashboard';
import SystemStatusDashboard from '../components/dashboards/SystemStatusDashboard';

// Tipos para el dashboard dinámico
type DashboardView = 'predictive' | 'risk-assessment' | 'logistics' | 'system-status';

interface SidebarItem {
  id: DashboardView;
  label: string;
  icon: string;
  description: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'predictive',
    label: 'Análisis Predictivo',
    icon: '🔮',
    description: 'Predicciones de riesgo y evolución'
  },
  {
    id: 'risk-assessment',
    label: 'Evaluación de Riesgos',
    icon: '🌍',
    description: 'Mapa global de hotspots sísmicos'
  },
  {
    id: 'logistics',
    label: 'Optimización Logística',
    icon: '🚛',
    description: 'Cadenas de suministro de café'
  },
  {
    id: 'system-status',
    label: 'Estado del Sistema',
    icon: '⚙️',
    description: 'Dashboard de Meta-Gobernanza'
  }
];

const DashboardPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('predictive');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para datos de diferentes vistas (se poblarán desde liveState)
  const [predictiveData, setPredictiveData] = useState<any>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [logisticsData, setLogisticsData] = useState<any>(null);
  const [systemData, setSystemData] = useState<any>(null);

  // XAI explanation modal
  const [xaiOpen, setXaiOpen] = useState(false);
  const [xaiContent, setXaiContent] = useState<any>(null); // puede ser string o objeto estructurado { explanation, confidence, sources }
  const [xaiLoading, setXaiLoading] = useState(false);

  // Hook-local: centraliza la llamada a /api/demo/live-state
  const fetchLiveState = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/demo/live-state');
      if (!res.ok) {
        const body = await res.json().catch(() => ({ message: 'No details' }));
        throw new Error(body.error || body.message || `HTTP ${res.status}`);
      }
      const live = await res.json();
      // Propagar a sub-estados
      setPredictiveData(live);
      setRiskData(live.global?.seismic || null);
      setLogisticsData(live.foodSecurity || live.foodSecurity || null);
      setSystemData(live.sdlc || null);
    } catch (err: any) {
      console.error('Error fetching live-state:', err);
      setError(err.message || 'Error al cargar live-state');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveState();
    const interval = setInterval(fetchLiveState, 15000); // poll cada 15s como dicta el manifiesto
    return () => clearInterval(interval);
  }, []);

  // Helper: llamar al endpoint XAI para explicaciones
  const requestXaiExplanation = async (metric: string, value: any, context: string) => {
    setXaiLoading(true);
    setXaiContent(null);
    setXaiOpen(true);
    try {
      const res = await fetch('/api/xai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric, value, context })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'XAI request failed');
      setXaiContent(body);
    } catch (err: any) {
      console.error('XAI explain error:', err);
      setXaiContent({ explanation: err.message || 'No se obtuvo explicación', confidence: 0, sources: [] });
    } finally {
      setXaiLoading(false);
    }
  };

  const renderPredictiveAnalysis = () => <CEODashboard predictiveData={predictiveData} requestXaiExplanation={requestXaiExplanation} />;

  const renderRiskAssessment = () => <RiskAssessmentDashboard riskData={riskData} />;
  const renderLogisticsOptimization = () => <LogisticsDashboard logisticsData={logisticsData} />;
  const renderSystemStatus = () => <SystemStatusDashboard systemData={systemData} />;

  const renderCurrentView = () => {
    switch (currentView) {
      case 'predictive':
        return renderPredictiveAnalysis();
      case 'risk-assessment':
        return renderRiskAssessment();
      case 'logistics':
        return renderLogisticsOptimization();
      case 'system-status':
        return renderSystemStatus();
      default:
        return renderPredictiveAnalysis();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl z-10 overflow-y-auto"
      >
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              🏛️ Oráculo Viviente
            </h2>
            <p className="text-slate-400 text-sm mt-1">Dashboard Soberano Unificado</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentView(item.id)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className={`font-semibold ${currentView === item.id ? 'text-cyan-300' : 'text-white'}`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-400">{item.description}</div>
                  </div>
                </div>
                {currentView === item.id && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Estado del sistema en sidebar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-4 bg-slate-700/30 rounded-lg"
          >
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Estado del Sistema</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Backend</span>
                <span className="text-xs text-green-400">● Activo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Frontend</span>
                <span className="text-xs text-green-400">● Activo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Base de Datos</span>
                <span className="text-xs text-green-400">● Activo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main content area */}
      <div className="ml-80 min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-8"
        >
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400">Cargando experiencia soberana...</p>
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
                <span className="font-semibold">Error de carga</span>
              </div>
              <p className="text-sm">{error}</p>
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderCurrentView()}
              </motion.div>
              </AnimatePresence>

              {/* XAI Modal simple */}
              <AnimatePresence>
                {xaiOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center z-50"
                  >
                    <div className="absolute inset-0 bg-black/60" onClick={() => setXaiOpen(false)} />
                    <motion.div className="bg-gray-800 rounded-lg p-6 z-60 max-w-2xl mx-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Explicación (XAI)</h3>
                        <button onClick={() => setXaiOpen(false)} className="text-white">Cerrar</button>
                      </div>
                      {xaiLoading ? (
                        <div>Generando explicación...</div>
                      ) : (
                        <div>
                          {typeof xaiContent === 'string' && (
                            <div className="text-slate-200 whitespace-pre-wrap">{xaiContent}</div>
                          )}
                          {typeof xaiContent === 'object' && xaiContent !== null && (
                            <div className="space-y-3">
                              <div className="text-slate-200 whitespace-pre-wrap">{xaiContent.explanation}</div>
                              {xaiContent.confidence !== undefined && (
                                <div className="text-sm text-slate-400">Confianza: <span className="font-medium text-white">{Math.round((xaiContent.confidence || 0) * 100)}%</span></div>
                              )}
                              {Array.isArray(xaiContent.sources) && xaiContent.sources.length > 0 && (
                                <div className="text-sm text-slate-400">Fuentes: <span className="font-medium text-white">{xaiContent.sources.join(', ')}</span></div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
