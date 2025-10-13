import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#00D4FF', '#FF6B00', '#FFD700', '#FF0080', '#00FF80'];

const CIODashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sdlc/cio-dashboard');
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Error fetching CIO data:', error);
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
        body: JSON.stringify({ metric, value, context: 'CIODashboard' })
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
        <div className="text-cyan-400 text-xl">Midiendo flujos de datos...</div>
      </div>
    );
  }

  const dataFlowData = [
    { name: 'Salud', value: data?.dataFlowHealth || 95 },
    { name: 'Riesgo', value: 100 - (data?.dataFlowHealth || 95) }
  ];

  const latencyData = [
    { time: '00:00', latency: 45 },
    { time: '04:00', latency: 42 },
    { time: '08:00', latency: 48 },
    { time: '12:00', latency: 52 },
    { time: '16:00', latency: 47 },
    { time: '20:00', latency: 44 }
  ];

  const throughputData = [
    { hour: '9AM', requests: 1200 },
    { hour: '10AM', requests: 1350 },
    { hour: '11AM', requests: 1180 },
    { hour: '12PM', requests: 1420 },
    { hour: '1PM', requests: 1380 },
    { hour: '2PM', requests: 1290 }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold text-cyan-400 mb-2 flex items-center justify-center">
          <span className="mr-3">💾</span> Dominio del CIO - Flujos de Datos
        </h2>
        <p className="text-gray-300 text-lg">Integraciones, latencia y calidad de datos</p>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-cyan-800/80 to-cyan-700/80 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">🔄</div>
            <button
              onClick={() => handleExplain('dataFlowHealth', data?.dataFlowHealth)}
              className="text-cyan-400 hover:text-white transition-colors"
            >
              ✨
            </button>
          </div>
          <div className="text-3xl font-bold text-cyan-400 mb-2">{data?.dataFlowHealth}%</div>
          <div className="text-gray-300">Salud Flujos Datos</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-800/80 to-blue-700/80 backdrop-blur-xl border border-blue-400/30 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">⚡</div>
            <button
              onClick={() => handleExplain('integrationLatency', data?.integrationLatency)}
              className="text-blue-400 hover:text-white transition-colors"
            >
              ✨
            </button>
          </div>
          <div className="text-3xl font-bold text-blue-400 mb-2">{data?.integrationLatency}</div>
          <div className="text-gray-300">Latencia Integraciones</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-green-800/80 to-green-700/80 backdrop-blur-xl border border-green-400/30 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">✅</div>
            <button
              onClick={() => handleExplain('dataQuality', data?.dataQuality)}
              className="text-green-400 hover:text-white transition-colors"
            >
              ✨
            </button>
          </div>
          <div className="text-3xl font-bold text-green-400 mb-2">{data?.dataQuality}%</div>
          <div className="text-gray-300">Calidad de Datos</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-800/80 to-purple-700/80 backdrop-blur-xl border border-purple-400/30 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">🛡️</div>
            <button
              onClick={() => handleExplain('complianceScore', data?.complianceScore)}
              className="text-purple-400 hover:text-white transition-colors"
            >
              ✨
            </button>
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-2">{data?.complianceScore}</div>
          <div className="text-gray-300">Score Cumplimiento</div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Flow Health */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-600 rounded-xl p-6 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-cyan-400 mb-4">Salud de Flujos de Datos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataFlowData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {dataFlowData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#06B6D4' : '#EF4444'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Integration Latency */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-600 rounded-xl p-6 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-cyan-400 mb-4">Latencia de Integraciones</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
              <Area type="monotone" dataKey="latency" stroke="#06B6D4" fill="rgba(6, 182, 212, 0.3)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Throughput and Volume */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-cyan-800/60 to-cyan-900/60 backdrop-blur-xl border border-cyan-400/20 rounded-xl p-6 shadow-2xl"
      >
        <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center">
          <span className="mr-2">📊</span> Throughput y Volumen de Datos
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-cyan-300 mb-4">Throughput por Hora</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={throughputData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                <Bar dataKey="requests" fill="#06B6D4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/30 rounded-lg p-4">
              <div className="text-cyan-400 font-semibold mb-2">Volumen de Datos</div>
              <div className="text-white text-2xl">{data?.dataVolume}</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/30 rounded-lg p-4">
              <div className="text-blue-400 font-semibold mb-2">Throughput Promedio</div>
              <div className="text-white text-2xl">{data?.processingThroughput}</div>
            </div>
            <div className="bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/30 rounded-lg p-4">
              <div className="text-red-400 font-semibold mb-2">Tasa de Error</div>
              <div className="text-white text-2xl">{data?.errorRate}</div>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/30 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-2">Uptime APIs</div>
              <div className="text-white text-2xl">{data?.apiUptime}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CIODashboard;