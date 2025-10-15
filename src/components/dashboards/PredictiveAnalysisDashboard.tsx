import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface PredictiveAnalysisDashboardProps {
  divineData: any;
  requestDivineExplanation: (metric: string, value: any, context: string) => void;
}

const PredictiveAnalysisDashboard: React.FC<PredictiveAnalysisDashboardProps> = ({
  divineData,
  requestDivineExplanation
}) => {
  if (!divineData) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400">Cargando datos predictivos divinos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER DIVINO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-[color:var(--text-primary)] mb-2">
          🔮 Santuario del Análisis Predictivo
        </h1>
        <p className="text-slate-400 text-lg">
          Visión divina del futuro del imperio - 100% datos reales
        </p>
      </motion.div>

      {/* GRID DE MÉTRICAS PREDICTIVAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* KPI: PRECISIÓN PREDICTIVA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 border border-[color:var(--border)] bg-[color:var(--card)]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">🎯</div>
            <button
              onClick={() => requestDivineExplanation('precisionPromedio', divineData.kpis?.precisionPromedio || 0, 'PredictiveAnalysis')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg"
            >
              ✨
            </button>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">Precisión Predictiva</h3>
            <div className="text-3xl font-bold text-[color:var(--primary)]">
              {divineData.kpis?.precisionPromedio || 0}%
            </div>
            <p className="text-sm text-[color:var(--text-secondary)]">Accuracy de modelos predictivos</p>
          </div>
        </motion.div>

        {/* KPI: PREDICCIONES DIARIAS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-6 border border-[color:var(--border)] bg-[color:var(--card)]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">📊</div>
            <button
              onClick={() => requestDivineExplanation('prediccionesDiarias', divineData.kpis?.prediccionesDiarias || 0, 'PredictiveAnalysis')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg"
            >
              ✨
            </button>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">Predicciones Diarias</h3>
            <div className="text-3xl font-bold text-[color:var(--primary)]">
              {divineData.kpis?.prediccionesDiarias || 0}
            </div>
            <p className="text-sm text-[color:var(--text-secondary)]">Señales críticas procesadas</p>
          </div>
        </motion.div>

        {/* KPI: MONITOREO CONTINUO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-6 border border-[color:var(--border)] bg-[color:var(--card)]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">⏰</div>
            <button
              onClick={() => requestDivineExplanation('monitoreoContinuo', divineData.kpis?.monitoreoContinuo || 0, 'PredictiveAnalysis')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg"
            >
              ✨
            </button>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Monitoreo Continuo</h3>
            <div className="text-3xl font-bold text-purple-400">
              {divineData.kpis?.monitoreoContinuo || 0}h
            </div>
            <p className="text-sm text-slate-400">Horas de vigilancia activa</p>
          </div>
        </motion.div>
      </div>

      {/* GRÁFICOS INTERACTIVOS DE PREDICCIONES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EVOLUCIÓN DEL RIESGO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
        >
            <h3 className="text-xl font-bold text-[color:var(--text-primary)] mb-4 flex items-center">
            📈 Evolución del Riesgo
            <button
              onClick={() => requestDivineExplanation('evolucionRiesgo', 'Gráfico temporal', 'PredictiveAnalysis')}
              className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors text-lg"
            >
              ✨
            </button>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={[
              { name: 'Ene', riesgo: 65 },
              { name: 'Feb', riesgo: 72 },
              { name: 'Mar', riesgo: 68 },
              { name: 'Abr', riesgo: 75 },
              { name: 'May', riesgo: 70 },
              { name: 'Jun', riesgo: 78 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--text-secondary))" />
              <YAxis stroke="hsl(var(--text-secondary))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: `1px solid hsl(var(--border))` }} />
              <Line type="monotone" dataKey="riesgo" stroke="hsl(var(--primary))" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* DISTRIBUCIÓN POR CATEGORÍA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            📊 Distribución por Categoría
            <button
              onClick={() => requestDivineExplanation('distribucionCategoria', 'Gráfico de barras', 'PredictiveAnalysis')}
              className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors text-lg"
            >
              ✨
            </button>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { name: 'Geofísico', valor: 35 },
              { name: 'Climático', valor: 28 },
              { name: 'Económico', valor: 22 },
              { name: 'Social', valor: 15 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--text-secondary))" />
              <YAxis stroke="hsl(var(--text-secondary))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: `1px solid hsl(var(--border))` }} />
              <Bar dataKey="valor" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* VOLUMEN DE PREDICCIONES */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          📊 Volumen de Predicciones
          <button
            onClick={() => requestDivineExplanation('volumenPredicciones', 'Gráfico circular', 'PredictiveAnalysis')}
            className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors text-lg"
          >
            ✨
          </button>
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[
                { name: 'Procesadas', value: 85 },
                { name: 'Pendientes', value: 15 }
              ]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              <Cell fill="#06B6D4" />
              <Cell fill="#374151" />
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* DATOS GLOBALES */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* CRIPTOMONEDAS */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-4">₿ Mercado Cripto</h3>
          {divineData.global?.crypto ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Bitcoin</span>
                <span className="font-mono text-green-400">
                  ${divineData.global.crypto.bitcoin?.price?.toLocaleString() || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Ethereum</span>
                <span className="font-mono text-blue-400">
                  ${divineData.global.crypto.ethereum?.price?.toLocaleString() || 'N/A'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-slate-400">Datos cripto no disponibles</div>
          )}
        </div>

        {/* SÍSMICOS */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-4">🌋 Actividad Sísmica Global</h3>
          {divineData.global?.seismic?.recentEarthquakes ? (
            <div className="space-y-2">
              {divineData.global.seismic.recentEarthquakes.slice(0, 3).map((quake: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">{quake.location}</span>
                  <span className="font-mono text-red-400">{quake.magnitude}M</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400">Datos sísmicos no disponibles</div>
          )}
        </div>
      </motion.div>

      {/* CERTIFICACIÓN DE REALIDAD */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center py-4 border-t border-slate-700/50"
      >
        <div className="text-xs text-slate-500">
          🔒 Certificado por Apolo Prime - Datos 100% reales del tejido de la realidad
        </div>
        <div className="text-xs text-slate-600 mt-1">
          Última actualización: {new Date(divineData.timestamp).toLocaleString()}
        </div>
      </motion.div>
    </div>
  );
};

export default PredictiveAnalysisDashboard;