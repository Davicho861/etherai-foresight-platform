import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import { motion } from 'framer-motion';

const COODashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sdlc/coo-dashboard');
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Error fetching COO data:', error);
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
        body: JSON.stringify({ metric, value, context: 'COODashboard' })
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
        <div className="text-amber-400 text-xl">Midiendo eficiencia operativa...</div>
      </div>
    );
  }

  const velocityData = [
    { sprint: 'Sprint 1', velocity: 85 },
    { sprint: 'Sprint 2', velocity: 92 },
    { sprint: 'Sprint 3', velocity: 78 },
    { sprint: 'Sprint 4', velocity: data?.crewVelocity || 95 }
  ];

  const kanbanData = [
    { day: 'Lun', throughput: 12 },
    { day: 'Mar', throughput: 15 },
    { day: 'Mie', throughput: 18 },
    { day: 'Jue', throughput: 14 },
    { day: 'Vie', throughput: data?.kanbanThroughput || 20 }
  ];

  const efficiencyData = [
    { metric: 'Velocidad', value: data?.crewVelocity || 0, target: 100 },
    { metric: 'Eficiencia', value: data?.operationalEfficiency || 0, target: 100 },
    { metric: 'Calidad', value: data?.qualityMetrics?.customerSatisfaction || 0, target: 100 }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold text-amber-400 mb-2 flex items-center justify-center">
          <span className="mr-3">⚙️</span> Dominio del COO - Excelencia Operativa
        </h2>
        <p className="text-gray-300 text-lg">Eficiencia, velocidad y calidad organizacional</p>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-amber-800/80 to-amber-700/80 backdrop-blur-xl border border-amber-400/30 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">🚀</div>
            <button
              onClick={() => handleExplain('crewVelocity', data?.crewVelocity)}
              className="text-amber-400 hover:text-white transition-colors"
            >
              ✨
            </button>
          </div>
          <div className="text-3xl font-bold text-amber-400 mb-2">{data?.crewVelocity}</div>
          <div className="text-gray-300">Velocidad de Crew</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-800/80 to-blue-700/80 backdrop-blur-xl border border-blue-400/30 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">📊</div>
            <button
              onClick={() => handleExplain('kanbanThroughput', data?.kanbanThroughput)}
              className="text-blue-400 hover:text-white transition-colors"
            >
              ✨
            </button>
          </div>
          <div className="text-3xl font-bold text-blue-400 mb-2">{data?.kanbanThroughput}</div>
          <div className="text-gray-300">Throughput Kanban</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-green-800/80 to-green-700/80 backdrop-blur-xl border border-green-400/30 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">⏱️</div>
            <button
              onClick={() => handleExplain('leadTime', data?.leadTime)}
              className="text-green-400 hover:text-white transition-colors"
            >
              ✨
            </button>
          </div>
          <div className="text-3xl font-bold text-green-400 mb-2">{data?.leadTime}</div>
          <div className="text-gray-300">Lead Time</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-800/80 to-purple-700/80 backdrop-blur-xl border border-purple-400/30 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl">⚡</div>
            <button
              onClick={() => handleExplain('operationalEfficiency', data?.operationalEfficiency)}
              className="text-purple-400 hover:text-white transition-colors"
            >
              ✨
            </button>
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-2">{data?.operationalEfficiency}%</div>
          <div className="text-gray-300">Eficiencia Operativa</div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crew Velocity Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-600 rounded-xl p-6 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-amber-400 mb-4">Tendencia de Velocidad de Crew</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="sprint" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
              <Area type="monotone" dataKey="velocity" stroke="#F59E0B" fill="rgba(245, 158, 11, 0.3)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Kanban Throughput */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-600 rounded-xl p-6 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-amber-400 mb-4">Throughput del Kanban</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kanbanData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
              <Bar dataKey="throughput" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Operational Metrics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-amber-800/60 to-amber-900/60 backdrop-blur-xl border border-amber-400/20 rounded-xl p-6 shadow-2xl"
      >
        <h3 className="text-2xl font-bold text-amber-400 mb-4 flex items-center">
          <span className="mr-2">📈</span> Métricas Operativas Clave
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-300">Eficiencia vs Objetivo</h4>
            {efficiencyData.map((item, index) => (
              <div key={index} className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-amber-400 font-medium">{item.metric}</span>
                  <span className="text-white">{item.value}% / {item.target}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-amber-400 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (item.value / item.target) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-300">Métricas de Calidad</h4>
            <div className="bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/30 rounded-lg p-4">
              <div className="text-red-400 font-semibold mb-2">Tasa de Defectos</div>
              <div className="text-white text-xl">{data?.qualityMetrics?.defectRate}</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/30 rounded-lg p-4">
              <div className="text-orange-400 font-semibold mb-2">Tasa de Re-trabajo</div>
              <div className="text-white text-xl">{data?.qualityMetrics?.reworkRate}</div>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/30 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-2">Satisfacción Cliente</div>
              <div className="text-white text-xl">{data?.qualityMetrics?.customerSatisfaction}%</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-amber-300">Recursos y Automatización</h4>
            <div className="bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/30 rounded-lg p-4">
              <div className="text-blue-400 font-semibold mb-2">Utilización Recursos</div>
              <div className="text-white text-xl">{data?.resourceUtilization}%</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/30 rounded-lg p-4">
              <div className="text-purple-400 font-semibold mb-2">Automatización Procesos</div>
              <div className="text-white text-xl">{data?.processAutomation}%</div>
            </div>
            <div className="bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/30 rounded-lg p-4">
              <div className="text-cyan-400 font-semibold mb-2">Productividad Equipo</div>
              <div className="text-white text-xl">{data?.teamProductivity}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default COODashboard;