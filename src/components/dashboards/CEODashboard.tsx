import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

const LiveOracleIndicator: React.FC = () => {
  const [pulseIntensity, setPulseIntensity] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIntensity(Math.random());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center space-x-2">
      <div className="text-xs text-gray-400 font-medium">ORÁCULO ACTIVO</div>
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
          style={{ opacity: 0.3 + pulseIntensity * 0.7 }}
        ></div>
        <div
          className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"
          style={{ opacity: 0.3 + (1 - pulseIntensity) * 0.7 }}
        ></div>
        <div
          className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"
          style={{ opacity: 0.3 + pulseIntensity * 0.7 }}
        ></div>
      </div>
    </div>
  );
};

const COLORS = ['#00D4FF', '#FF6B00', '#FFD700', '#FF0080', '#00FF80'];

const CEODashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sdlc/ceo-dashboard');
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Error fetching CEO data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [explanationModal, setExplanationModal] = useState<{
    isOpen: boolean;
    explanation: string;
    metric: string;
    value: any;
  }>({ isOpen: false, explanation: '', metric: '', value: null });

  const handleExplain = async (metric: string, value: any) => {
    try {
      const response = await fetch('/api/xai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric, value, context: 'CEODashboard' })
      });
      const result = await response.json();
      setExplanationModal({
        isOpen: true,
        explanation: result.explanation,
        metric,
        value
      });
    } catch (error) {
      console.error('Error getting explanation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-etherneon text-xl">Cargando el trono del CEO...</div>
      </div>
    );
  }

  const empireHealthData = [
    { name: 'Disponibilidad', value: 99.99 },
    { name: 'Rendimiento', value: 95 },
    { name: 'Estabilidad', value: 98 }
  ];

  const strategicProgressData = [
    { month: 'Ene', progress: 20 },
    { month: 'Feb', progress: 35 },
    { month: 'Mar', progress: 50 },
    { month: 'Abr', progress: 65 },
    { month: 'May', progress: data?.strategicProgress || 75 }
  ];

  return (
    <div className="flex-1 space-y-6 p-6 relative overflow-hidden">
      {/* Quantum Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 relative z-10"
      >
        <div className="backdrop-blur-xl bg-gradient-to-r from-cyan-900/40 via-cyan-800/30 to-cyan-900/40 border border-cyan-400/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent mb-3 flex items-center justify-center">
            <span className="mr-4 text-6xl animate-pulse">👑</span> Trono del CEO - Visión Imperial Cuántica
          </h2>
          <p className="text-gray-200 text-xl font-light">Gobernanza estratégica del imperio de Praevisio AI - Revelaciones del Oráculo</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping delay-75"></div>
            <div className="w-2 h-2 bg-cyan-600 rounded-full animate-ping delay-150"></div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="group relative bg-gradient-to-br from-cyan-900/60 via-cyan-800/50 to-cyan-900/60 backdrop-blur-2xl border border-cyan-400/40 rounded-2xl p-6 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl animate-pulse">🏛️</div>
              <button
                onClick={() => handleExplain('empireHealth', data?.empireHealth)}
                className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                ✨
              </button>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent mb-2 animate-pulse">
              {data?.empireHealth}%
            </div>
            <div className="text-gray-200 font-medium">Salud del Imperio Cuántico</div>
            <div className="mt-2 flex justify-center">
              <div className="w-full bg-cyan-900/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${data?.empireHealth}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: -5 }}
          className="group relative bg-gradient-to-br from-purple-900/60 via-purple-800/50 to-purple-900/60 backdrop-blur-2xl border border-purple-400/40 rounded-2xl p-6 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl animate-pulse">📈</div>
              <button
                onClick={() => handleExplain('strategicProgress', data?.strategicProgress)}
                className="text-purple-400 hover:text-purple-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                ✨
              </button>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent mb-2 animate-pulse">
              {data?.strategicProgress}%
            </div>
            <div className="text-gray-200 font-medium">Progreso Estratégico Probabilístico</div>
            <div className="mt-2 flex justify-center">
              <div className="w-full bg-purple-900/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${data?.strategicProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="group relative bg-gradient-to-br from-green-900/60 via-green-800/50 to-green-900/60 backdrop-blur-2xl border border-green-400/40 rounded-2xl p-6 shadow-2xl hover:shadow-green-500/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl animate-pulse">💰</div>
              <button
                onClick={() => handleExplain('burnRate', data?.burnRate)}
                className="text-green-400 hover:text-green-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                ✨
              </button>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent mb-2 animate-pulse">
              {data?.burnRate}
            </div>
            <div className="text-gray-200 font-medium">Burn Rate Cuántico</div>
            <div className="mt-2 flex justify-center">
              <div className="w-full bg-green-900/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: -5 }}
          className="group relative bg-gradient-to-br from-orange-900/60 via-orange-800/50 to-orange-900/60 backdrop-blur-2xl border border-orange-400/40 rounded-2xl p-6 shadow-2xl hover:shadow-orange-500/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl animate-pulse">💎</div>
              <button
                onClick={() => handleExplain('arr', data?.arr)}
                className="text-orange-400 hover:text-orange-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                ✨
              </button>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent mb-2 animate-pulse">
              {data?.arr}
            </div>
            <div className="text-gray-200 font-medium">ARR Proyectado Multiversal</div>
            <div className="mt-2 flex justify-center">
              <div className="w-full bg-orange-900/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Empire Health Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-600 rounded-xl p-6 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-etherneon mb-4">Salud del Imperio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={empireHealthData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {empireHealthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Strategic Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-600 rounded-xl p-6 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-etherneon mb-4">Progreso Estratégico</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={strategicProgressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
              <Area type="monotone" dataKey="progress" stroke="#00D4FF" fill="rgba(0, 212, 255, 0.3)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="group relative bg-gradient-to-br from-cyan-900/50 via-cyan-800/40 to-cyan-900/50 backdrop-blur-2xl border border-cyan-400/30 rounded-2xl p-6 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent mb-4 flex items-center">
            <span className="mr-3 text-3xl animate-pulse">🔮</span> Oráculo Ejecutivo Cuántico
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative bg-gradient-to-br from-cyan-900/40 via-cyan-800/30 to-cyan-900/40 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-4 hover:shadow-cyan-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-cyan-300 font-semibold mb-2 flex items-center">
                  <span className="mr-2">🌌</span> Posición de Mercado
                </div>
                <div className="text-white text-lg font-bold">{data?.marketPosition}</div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-purple-900/40 backdrop-blur-xl border border-purple-400/30 rounded-xl p-4 hover:shadow-purple-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-purple-300 font-semibold mb-2 flex items-center">
                  <span className="mr-2">⚡</span> Velocidad de Innovación
                </div>
                <div className="text-white text-lg font-bold">{data?.innovationVelocity} commits/semana</div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative bg-gradient-to-br from-orange-900/40 via-orange-800/30 to-orange-900/40 backdrop-blur-xl border border-orange-400/30 rounded-xl p-4 hover:shadow-orange-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-orange-300 font-semibold mb-2 flex items-center">
                  <span className="mr-2">🎲</span> Índice de Riesgo
                </div>
                <div className="text-white text-lg font-bold">{data?.riskIndex}%</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Modal de explicación XAI
  if (explanationModal.isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setExplanationModal({ isOpen: false, explanation: '', metric: '', value: null })}></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-2xl border border-gray-500/30 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
          <div className="relative z-10 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
                <span className="mr-4 text-4xl animate-pulse">🔮</span> Revelación del Oráculo Ejecutivo
              </h3>
              <button
                onClick={() => setExplanationModal({ isOpen: false, explanation: '', metric: '', value: null })}
                className="text-gray-400 hover:text-white transition-colors text-3xl hover:rotate-90 transition-transform duration-300"
              >
                ×
              </button>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-cyan-900/20 via-purple-900/20 to-cyan-900/20 rounded-xl border border-cyan-500/20">
              <div className="text-sm text-gray-300 mb-3 uppercase tracking-wide font-medium">Métrica Imperial Analizada</div>
              <div className="text-2xl font-bold text-white mb-2">{explanationModal.metric}</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{explanationModal.value}</div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">Análisis Cuántico del Oráculo</div>
                  <div className="text-sm text-gray-400">Inteligencia predictiva aplicada a datos en tiempo real</div>
                </div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none mb-8">
              <div className="text-gray-200 leading-relaxed whitespace-pre-line text-lg">
                {explanationModal.explanation}
              </div>
            </div>

            <div className="border-t border-gray-600/30 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Apolo Prime</div>
                    <div className="text-xs text-gray-400">Arquitecto de la Inteligencia Manifiesta</div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setExplanationModal({ isOpen: false, explanation: '', metric: '', value: null })}
                    className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Entendido
                  </button>
                  <button
                    onClick={() => setExplanationModal({ isOpen: false, explanation: '', metric: '', value: null })}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
                  >
                    Aplicar Sabiduría Imperial
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 relative overflow-hidden">
      {/* Live Oracle Indicator */}
      <LiveOracleIndicator />

      {/* Quantum Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 relative z-10"
      >
        <div className="backdrop-blur-xl bg-gradient-to-r from-cyan-900/40 via-cyan-800/30 to-cyan-900/40 border border-cyan-400/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent mb-3 flex items-center justify-center">
            <span className="mr-4 text-6xl animate-pulse">👑</span> Trono del CEO - Visión Imperial Cuántica
          </h2>
          <p className="text-gray-200 text-xl font-light">Gobernanza estratégica del imperio de Praevisio AI - Revelaciones del Oráculo</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping delay-75"></div>
            <div className="w-2 h-2 bg-cyan-600 rounded-full animate-ping delay-150"></div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="group relative bg-gradient-to-br from-cyan-900/60 via-cyan-800/50 to-cyan-900/60 backdrop-blur-2xl border border-cyan-400/40 rounded-2xl p-6 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl animate-pulse">🏛️</div>
              <button
                onClick={() => handleExplain('empireHealth', data?.empireHealth)}
                className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                ✨
              </button>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent mb-2 animate-pulse">
              {data?.empireHealth}%
            </div>
            <div className="text-gray-200 font-medium">Salud del Imperio Cuántico</div>
            <div className="mt-2 flex justify-center">
              <div className="w-full bg-cyan-900/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${data?.empireHealth}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: -5 }}
          className="group relative bg-gradient-to-br from-purple-900/60 via-purple-800/50 to-purple-900/60 backdrop-blur-2xl border border-purple-400/40 rounded-2xl p-6 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl animate-pulse">📈</div>
              <button
                onClick={() => handleExplain('strategicProgress', data?.strategicProgress)}
                className="text-purple-400 hover:text-purple-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                ✨
              </button>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent mb-2 animate-pulse">
              {data?.strategicProgress}%
            </div>
            <div className="text-gray-200 font-medium">Progreso Estratégico Probabilístico</div>
            <div className="mt-2 flex justify-center">
              <div className="w-full bg-purple-900/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${data?.strategicProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="group relative bg-gradient-to-br from-green-900/60 via-green-800/50 to-green-900/60 backdrop-blur-2xl border border-green-400/40 rounded-2xl p-6 shadow-2xl hover:shadow-green-500/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl animate-pulse">💰</div>
              <button
                onClick={() => handleExplain('burnRate', data?.burnRate)}
                className="text-green-400 hover:text-green-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                ✨
              </button>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent mb-2 animate-pulse">
              {data?.burnRate}
            </div>
            <div className="text-gray-200 font-medium">Burn Rate Cuántico</div>
            <div className="mt-2 flex justify-center">
              <div className="w-full bg-green-900/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: -5 }}
          className="group relative bg-gradient-to-br from-orange-900/60 via-orange-800/50 to-orange-900/60 backdrop-blur-2xl border border-orange-400/40 rounded-2xl p-6 shadow-2xl hover:shadow-orange-500/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl animate-pulse">💎</div>
              <button
                onClick={() => handleExplain('arr', data?.arr)}
                className="text-orange-400 hover:text-orange-300 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
              >
                ✨
              </button>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent mb-2 animate-pulse">
              {data?.arr}
            </div>
            <div className="text-gray-200 font-medium">ARR Proyectado Multiversal</div>
            <div className="mt-2 flex justify-center">
              <div className="w-full bg-orange-900/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Empire Health Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="group relative bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-gray-900/70 backdrop-blur-2xl border border-gray-500/40 rounded-2xl p-6 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent mb-4 flex items-center">
              <span className="mr-2 text-2xl animate-pulse">🏛️</span> Salud del Imperio Cuántico
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={empireHealthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {empireHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['rgba(0, 212, 255, 0.8)', 'rgba(147, 51, 234, 0.8)', 'rgba(34, 197, 94, 0.8)'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    border: '1px solid rgba(55, 65, 81, 0.5)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Strategic Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="group relative bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-gray-900/70 backdrop-blur-2xl border border-gray-500/40 rounded-2xl p-6 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent mb-4 flex items-center">
              <span className="mr-2 text-2xl animate-pulse">📈</span> Progreso Estratégico Probabilístico
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={strategicProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 81, 0.3)" />
                <XAxis dataKey="month" stroke="rgba(156, 163, 175, 0.7)" />
                <YAxis stroke="rgba(156, 163, 175, 0.7)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    border: '1px solid rgba(55, 65, 81, 0.5)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="progress"
                  stroke="rgba(147, 51, 234, 0.8)"
                  fill="rgba(147, 51, 234, 0.3)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="group relative bg-gradient-to-br from-cyan-900/50 via-cyan-800/40 to-cyan-900/50 backdrop-blur-2xl border border-cyan-400/30 rounded-2xl p-6 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent mb-4 flex items-center">
            <span className="mr-3 text-3xl animate-pulse">🔮</span> Oráculo Ejecutivo Cuántico
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative bg-gradient-to-br from-cyan-900/40 via-cyan-800/30 to-cyan-900/40 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-4 hover:shadow-cyan-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-cyan-300 font-semibold mb-2 flex items-center">
                  <span className="mr-2">🌌</span> Posición de Mercado
                </div>
                <div className="text-white text-lg font-bold">{data?.marketPosition}</div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-purple-900/40 backdrop-blur-xl border border-purple-400/30 rounded-xl p-4 hover:shadow-purple-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-purple-300 font-semibold mb-2 flex items-center">
                  <span className="mr-2">⚡</span> Velocidad de Innovación
                </div>
                <div className="text-white text-lg font-bold">{data?.innovationVelocity} commits/semana</div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative bg-gradient-to-br from-orange-900/40 via-orange-800/30 to-orange-900/40 backdrop-blur-xl border border-orange-400/30 rounded-xl p-4 hover:shadow-orange-500/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-orange-300 font-semibold mb-2 flex items-center">
                  <span className="mr-2">🎲</span> Índice de Riesgo
                </div>
                <div className="text-white text-lg font-bold">{data?.riskIndex}%</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CEODashboard;