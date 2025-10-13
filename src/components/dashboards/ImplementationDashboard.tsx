import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

interface ImplementationData {
  commitsLast24h: number;
  activeBranches: number;
  linesAdded: number;
  contributors: number;
  velocity: number;
  burndownRate: number;
  codeQuality: {
    coverage: number;
    complexity: number;
    duplications: number;
  };
  teamMetrics: {
    activeDevs: number;
    avgCommitsPerDev: number;
    reviewTime: string;
  };
}

const ImplementationDashboard: React.FC = () => {
  const [data, setData] = useState<ImplementationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sdlc/implementation');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching implementation data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-etherneon text-xl">Cargando datos de implementación...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400 text-xl">Error al cargar datos</div>
      </div>
    );
  }

  const velocityData = [
    { sprint: 'Sprint 1', velocity: 85 },
    { sprint: 'Sprint 2', velocity: 92 },
    { sprint: 'Sprint 3', velocity: 78 },
    { sprint: 'Sprint 4', velocity: data.velocity * 10 },
    { sprint: 'Sprint 5', velocity: 95 }
  ];

  const commitsData = [
    { time: '00:00', commits: 2 },
    { time: '06:00', commits: 1 },
    { time: '12:00', commits: 5 },
    { time: '18:00', commits: 4 },
    { time: '24:00', commits: data.commitsLast24h }
  ];

  const qualityData = [
    { metric: 'Cobertura', value: data.codeQuality.coverage, target: 85 },
    { metric: 'Complejidad', value: data.codeQuality.complexity, target: 2.5 },
    { metric: 'Duplicaciones', value: data.codeQuality.duplications, target: 1.0 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-etherblue-dark/60 to-etherblue-800/60 border border-gray-700 rounded-xl p-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-2 text-etherneon flex items-center">
          <span className="mr-3">🔥</span> La Forja de Hefesto - Desarrollo e Implementación
        </h2>
        <p className="text-gray-300">El yunque divino donde se forja el código que sustentará el imperio de Praevisio AI</p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-orange-800/80 to-red-800/80 p-6 rounded-xl border border-orange-600/30"
        >
          <div className="text-2xl font-bold text-orange-400">{data.commitsLast24h}</div>
          <div className="text-sm text-gray-300">Commits (24h)</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-blue-800/80 to-cyan-800/80 p-6 rounded-xl border border-blue-600/30"
        >
          <div className="text-2xl font-bold text-blue-400">{data.activeBranches}</div>
          <div className="text-sm text-gray-300">Ramas Activas</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-800/80 to-emerald-800/80 p-6 rounded-xl border border-green-600/30"
        >
          <div className="text-2xl font-bold text-green-400">+{data.linesAdded}</div>
          <div className="text-sm text-gray-300">Líneas Añadidas</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-purple-800/80 to-indigo-800/80 p-6 rounded-xl border border-purple-600/30"
        >
          <div className="text-2xl font-bold text-purple-400">{data.contributors}</div>
          <div className="text-sm text-gray-300">Contribuidores</div>
        </motion.div>
      </div>

      {/* Actividad de Desarrollo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-etherneon">📈 Velocidad de Desarrollo</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="sprint" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
              <Line type="monotone" dataKey="velocity" stroke="#00D4FF" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-etherneon">🔥 Actividad de Commits (24h)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={commitsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
              <Area type="monotone" dataKey="commits" stroke="#FF6B00" fill="#FF6B00" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Calidad de Código */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">⚡ Calidad de Código</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {qualityData.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-etherneon">{item.value}</div>
              <div className="text-sm text-gray-300">{item.metric}</div>
              <div className="text-xs text-gray-400">Objetivo: {item.target}</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-etherneon h-2 rounded-full"
                  style={{ width: `${Math.min((item.value / item.target) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Métricas de Equipo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">👥 Métricas del Equipo de Desarrollo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-etherblue-800/30 rounded-lg">
            <div className="text-3xl font-bold text-green-400">{data.teamMetrics.activeDevs}</div>
            <div className="text-sm text-gray-300">Desarrolladores Activos</div>
          </div>
          <div className="text-center p-4 bg-etherblue-800/30 rounded-lg">
            <div className="text-3xl font-bold text-blue-400">{data.teamMetrics.avgCommitsPerDev}</div>
            <div className="text-sm text-gray-300">Commits Promedio por Dev</div>
          </div>
          <div className="text-center p-4 bg-etherblue-800/30 rounded-lg">
            <div className="text-3xl font-bold text-purple-400">{data.teamMetrics.reviewTime}</div>
            <div className="text-sm text-gray-300">Tiempo de Review</div>
          </div>
        </div>
      </motion.div>

      {/* Estado del Motor de Agentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">🤖 Estado del Motor de Agentes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Capa de Percepción', status: 'Activa', color: 'text-green-400' },
            { name: 'Capa de Análisis', status: 'Activa', color: 'text-green-400' },
            { name: 'Capa de Decisión', status: 'Optimizando', color: 'text-yellow-400' },
            { name: 'Capa de Acción', status: 'Activa', color: 'text-green-400' }
          ].map((layer, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-etherblue-800/30 rounded-lg">
              <span className="text-gray-300 text-sm">{layer.name}</span>
              <span className={`font-medium ${layer.color}`}>{layer.status}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImplementationDashboard;