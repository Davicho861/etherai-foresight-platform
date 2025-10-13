import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#00D4FF', '#FF6B00', '#FFD700', '#FF0080', '#00FF80'];

interface PlanningData {
  backlogItems: number;
  priorityScore: number;
  projectedARR: string;
  breakEvenMonths: number;
  riskAnalysis: {
    technical: number;
    market: number;
    operational: number;
  };
  timeline: Array<{
    phase: string;
    milestone: string;
    status: string;
  }>;
}

const PlanningDashboard: React.FC = () => {
  const [data, setData] = useState<PlanningData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sdlc/planning');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching planning data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-etherneon text-xl">Cargando datos de planificación...</div>
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

  const riskData = [
    { name: 'Técnico', value: data.riskAnalysis.technical * 100 },
    { name: 'Mercado', value: data.riskAnalysis.market * 100 },
    { name: 'Operacional', value: data.riskAnalysis.operational * 100 },
    { name: 'Seguridad', value: (1 - (data.riskAnalysis.technical + data.riskAnalysis.market + data.riskAnalysis.operational)) * 100 }
  ];

  const timelineData = data.timeline.map((item, index) => ({
    ...item,
    order: index + 1
  }));

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
          <span className="mr-3">👑</span> Junta Directiva de Aion - Planificación Estratégica
        </h2>
        <p className="text-gray-300">Visión soberana y métricas de planificación para el imperio de Praevisio AI</p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-purple-800/80 to-indigo-800/80 p-6 rounded-xl border border-purple-600/30"
        >
          <div className="text-2xl font-bold text-purple-400">{data.backlogItems}</div>
          <div className="text-sm text-gray-300">Misiones en Backlog</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-blue-800/80 to-cyan-800/80 p-6 rounded-xl border border-blue-600/30"
        >
          <div className="text-2xl font-bold text-blue-400">{data.priorityScore}/10</div>
          <div className="text-sm text-gray-300">Prioridad Estratégica</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-800/80 to-emerald-800/80 p-6 rounded-xl border border-green-600/30"
        >
          <div className="text-2xl font-bold text-green-400">{data.projectedARR}</div>
          <div className="text-sm text-gray-300">ARR Proyectado</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-orange-800/80 to-red-800/80 p-6 rounded-xl border border-orange-600/30"
        >
          <div className="text-2xl font-bold text-orange-400">{data.breakEvenMonths} meses</div>
          <div className="text-sm text-gray-300">Break-even</div>
        </motion.div>
      </div>

      {/* Timeline de Misiones */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">📅 Timeline Estratégico</h3>
        <div className="space-y-4">
          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center space-x-4 p-4 bg-etherblue-800/30 rounded-lg border border-gray-600"
            >
              <div className={`w-4 h-4 rounded-full ${
                item.status === 'completed' ? 'bg-green-400' :
                item.status === 'in-progress' ? 'bg-yellow-400' : 'bg-gray-400'
              }`}></div>
              <div className="flex-1">
                <div className="font-semibold text-white">{item.phase}</div>
                <div className="text-sm text-gray-300">{item.milestone}</div>
              </div>
              <div className={`text-xs px-2 py-1 rounded ${
                item.status === 'completed' ? 'bg-green-600 text-black' :
                item.status === 'in-progress' ? 'bg-yellow-600 text-black' : 'bg-gray-600 text-white'
              }`}>
                {item.status === 'completed' ? 'Completado' :
                 item.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Análisis de Riesgos */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-etherblue-dark/50 to-etherblue-700/50 border border-gray-700 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-etherneon">⚠️ Análisis de Riesgos Estratégicos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Riesgo']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {riskData.map((risk, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-300">{risk.name}</span>
                </div>
                <span className="font-semibold text-white">{risk.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlanningDashboard;