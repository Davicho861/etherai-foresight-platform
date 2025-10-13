import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

const CFODashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sdlc/cfo-dashboard');
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Error fetching CFO data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExplain = async (metric: string, value: any) => {
    try {
      const response = await fetch('/api/xai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric, value, context: 'CFODashboard' })
      });
      const result = await response.json();
      alert(result.explanation);
    } catch (error) {
      console.error('Error getting explanation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-green-400 text-xl">Calculando las finanzas divinas...</div>
      </div>
    );
  }

  const burnRateData = [
    { month: 'Ene', burn: 120 },
    { month: 'Feb', burn: 115 },
    { month: 'Mar', burn: 110 },
    { month: 'Abr', burn: 105 },
    { month: 'May', burn: 100 }
  ];

  const profitabilityData = [
    { quarter: 'Q1', revenue: 250, costs: 180, profit: 70 },
    { quarter: 'Q2', revenue: 320, costs: 220, profit: 100 },
    { quarter: 'Q3', revenue: 380, costs: 250, profit: 130 },
    { quarter: 'Q4', revenue: 450, costs: 280, profit: 170 }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold text-green-400 mb-2 flex items-center justify-center">
          <span className="mr-3">💰</span> Tesoro del CFO - Arquitectura Financiera
        </h2>
        <p className="text-gray-300 text-lg">Eficiencia de costos y proyección de rentabilidad</p>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-green-800/80 to-green-700/80 backdrop-blur-xl border border-green-400/30 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">⚡</div>
            <button
              onClick={() => handleExplain('costZeroEfficiency', data?.costZeroEfficiency)}
              className="text-green-400 hover:text-white transition-colors"
            >
              ✨
            </button>
          </div>
          <div className="text-3xl font-bold text-green-400 mb-2">{data?.costZeroEfficiency}%</div>
          <div className="text-gray-300">Eficiencia Costo Cero</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-800/80 to-blue-700/80 backdrop-blur-xl border border-blue-400/30 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">📈</div>
            <button
              onClick={() => handleExplain('profitabilityProjection', data?.profitabilityProjection)}
              className="text-blue-400 hover:text-white transition-colors"
            >
              ✨
            </button>
          </div>
          <div className="text-3xl font-bold text-blue-400 mb-2">{data?.profitabilityProjection}</div>
          <div className="text-gray-300">Proyección Rentabilidad</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-800/80 to-purple-700/80 backdrop-blur-xl border border-purple-400/30 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">🎯</div>
            <button
              onClick={() => handleExplain('resourceEfficiency', data?.resourceEfficiency)}
              className="text-purple-400 hover:text-white transition-colors"
            >
              ✨
            </button>
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-2">{data?.resourceEfficiency}%</div>
          <div className="text-gray-300">Eficiencia Recursos</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-orange-800/80 to-orange-700/80 backdrop-blur-xl border border-orange-400/30 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">⏰</div>
            <button
              onClick={() => handleExplain('fundingRunway', data?.fundingRunway)}
              className="text-orange-400 hover:text-white transition-colors"
            >
              ✨
            </button>
          </div>
          <div className="text-3xl font-bold text-orange-400 mb-2">{data?.fundingRunway}</div>
          <div className="text-gray-300">Runway Financiero</div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Burn Rate Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-600 rounded-xl p-6 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-green-400 mb-4">Tendencia Burn Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={burnRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
              <Line type="monotone" dataKey="burn" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Profitability Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-600 rounded-xl p-6 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-green-400 mb-4">Análisis de Rentabilidad</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="quarter" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
              <Bar dataKey="revenue" fill="#10B981" />
              <Bar dataKey="costs" fill="#EF4444" />
              <Bar dataKey="profit" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Unit Economics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-green-800/60 to-green-900/60 backdrop-blur-xl border border-green-400/20 rounded-xl p-6 shadow-2xl"
      >
        <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
          <span className="mr-2">📊</span> Economía Unitaria
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/30 rounded-lg p-4">
            <div className="text-green-400 font-semibold mb-2">CAC</div>
            <div className="text-white text-xl">{data?.unitEconomics?.cac}</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/30 rounded-lg p-4">
            <div className="text-blue-400 font-semibold mb-2">LTV</div>
            <div className="text-white text-xl">{data?.unitEconomics?.ltv}</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/30 rounded-lg p-4">
            <div className="text-purple-400 font-semibold mb-2">Payback Period</div>
            <div className="text-white text-xl">{data?.unitEconomics?.paybackPeriod}</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/30 rounded-lg p-4">
            <div className="text-orange-400 font-semibold mb-2">Burn Multiple</div>
            <div className="text-white text-xl">{data?.burnMultiple}x</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CFODashboard;