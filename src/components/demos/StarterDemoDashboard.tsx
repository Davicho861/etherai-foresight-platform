import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedMetric from '@/components/AnimatedMetrics';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { motion } from 'framer-motion';
import useDemoData from '@/hooks/useDemoData';
import { Loader2 } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const StarterDemoDashboard: React.FC = () => {
  const { data: demoData, loading, error } = useDemoData();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-900 items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin mr-3" />
        Cargando KPIs Globales...
      </div>
    );
  }

  if (error || !demoData) {
    return (
      <div className="flex min-h-screen bg-gray-900 items-center justify-center text-red-400">
        Error de Conexión Divina: {error || 'No se pudieron manifestar los datos.'}
      </div>
    );
  }

  const getCountryColor = (isMonitored: boolean) => {
    return isMonitored ? 'rgba(59, 130, 246, 0.7)' : '#374151';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* FONDO CUÁNTICO GLASSMORPHISM */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)'
        }}
      />

      <div className="relative z-10 p-8">
        <div className="w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              🌱 Dashboard Starter: La Chispa Inicial
            </h1>
            <p className="text-lg text-slate-300 mt-2 max-w-2xl mx-auto">
              La primera revelación de la omnisciencia predictiva. KPIs globales forjados con datos reales en tiempo real.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-slate-800/60 via-slate-700/50 to-slate-800/60 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)'
              }}
              onClick={() => {
                // XAI EXPLICACIÓN PROFUNDA
                const context = 'DashboardStarter';
                const metric = 'precisionPromedio';
                const value = demoData.kpis.precisionPromedio;
                // Aquí se integraría la llamada a XAI
                console.log(`XAI Request: ${metric}=${value} in ${context}`);
              }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="text-cyan-400 text-sm font-medium">🎯 Precisión del Oráculo</div>
                  <button className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                    <span className="text-xs">✨</span>
                  </button>
                </div>
                <AnimatedMetric value={demoData.kpis.precisionPromedio} suffix="%" className="text-4xl font-bold text-white" />
                <div className="text-xs text-slate-400 mt-2">Confianza predictiva</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-slate-800/60 via-slate-700/50 to-slate-800/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)'
              }}
              onClick={() => {
                // XAI EXPLICACIÓN PROFUNDA
                const context = 'DashboardStarter';
                const metric = 'prediccionesDiarias';
                const value = demoData.kpis.prediccionesDiarias;
                console.log(`XAI Request: ${metric}=${value} in ${context}`);
              }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="text-blue-400 text-sm font-medium">📊 Predicciones Diarias</div>
                  <button className="ml-2 text-blue-400 hover:text-blue-300 transition-colors">
                    <span className="text-xs">✨</span>
                  </button>
                </div>
                <AnimatedMetric value={demoData.kpis.prediccionesDiarias} suffix="K" className="text-4xl font-bold text-white" />
                <div className="text-xs text-slate-400 mt-2">Eventos procesados</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-slate-800/60 via-slate-700/50 to-slate-800/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)'
              }}
              onClick={() => {
                // XAI EXPLICACIÓN PROFUNDA
                const context = 'DashboardStarter';
                const metric = 'coberturaRegional';
                const value = demoData.kpis.coberturaRegional;
                console.log(`XAI Request: ${metric}=${value} in ${context}`);
              }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="text-purple-400 text-sm font-medium">🌍 Cobertura Regional</div>
                  <button className="ml-2 text-purple-400 hover:text-purple-300 transition-colors">
                    <span className="text-xs">✨</span>
                  </button>
                </div>
                <AnimatedMetric value={demoData.kpis.coberturaRegional} suffix=" Países" className="text-4xl font-bold text-white" />
                <div className="text-xs text-slate-400 mt-2">Monitoreo global</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-slate-800/60 via-slate-700/50 to-slate-800/60 backdrop-blur-xl border border-pink-500/30 rounded-2xl p-6 shadow-xl hover:shadow-pink-500/20 transition-all duration-300 cursor-pointer"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)'
              }}
              onClick={() => {
                // XAI EXPLICACIÓN PROFUNDA
                const context = 'DashboardStarter';
                const metric = 'monitoreoContinuo';
                const value = demoData.kpis.monitoreoContinuo;
                console.log(`XAI Request: ${metric}=${value} in ${context}`);
              }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="text-pink-400 text-sm font-medium">⚡ Monitoreo Continuo</div>
                  <button className="ml-2 text-pink-400 hover:text-pink-300 transition-colors">
                    <span className="text-xs">✨</span>
                  </button>
                </div>
                <AnimatedMetric value={demoData.kpis.monitoreoContinuo} suffix="/7" className="text-4xl font-bold text-white" />
                <div className="text-xs text-slate-400 mt-2">Disponibilidad semanal</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-slate-800/60 via-slate-700/50 to-slate-800/60 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6 shadow-2xl"
                 style={{
                   backdropFilter: 'blur(20px) saturate(180%)',
                   WebkitBackdropFilter: 'blur(20px) saturate(180%)'
                 }}>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">🗺️ Mapa de Riesgos Global</h3>
                <p className="text-slate-400 text-sm">Cobertura predictiva en tiempo real sobre datos reales</p>
              </div>
              <div className="h-96 w-full rounded-xl overflow-hidden border border-slate-600/30">
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    scale: 330,
                    center: [-60, -15]
                  }}
                  className="w-full h-full"
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const isMonitored = demoData.countries.some(c => c.code === geo.properties.ISO_A3);
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={getCountryColor(isMonitored)}
                            stroke="#334155"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: 'none' },
                              hover: { outline: 'none', fill: '#60A5FA', filter: 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.6))' },
                              pressed: { outline: 'none' },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ComposableMap>
              </div>
              <div className="flex justify-center items-center mt-6 space-x-6 text-sm">
                <div className="flex items-center bg-slate-700/50 px-3 py-2 rounded-full">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getCountryColor(true) }}></div>
                  <span className="text-slate-300">País Monitoreado</span>
                </div>
                <div className="flex items-center bg-slate-700/50 px-3 py-2 rounded-full">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getCountryColor(false) }}></div>
                  <span className="text-slate-300">No Monitoreado</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StarterDemoDashboard;
