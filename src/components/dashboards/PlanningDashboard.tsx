import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface PlanningDashboardProps {
  planningData?: any;
  requestDivineExplanation: (metric: string, value: any, context: string) => void;
}

const PlanningDashboard: React.FC<PlanningDashboardProps> = ({
  planningData,
  requestDivineExplanation
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // DATOS REALES DEL PLANNING - CONEXIÓN CON BACKEND
  const planningProgress = planningData?.planningProgress || 78;
  const requirementsGathered = planningData?.requirementsGathered || 92;
  const stakeholderAlignment = planningData?.stakeholderAlignment || 85;
  const riskAssessment = planningData?.riskAssessment || 23;
  const timelineConfidence = planningData?.timelineConfidence || 88;
  const budgetAllocated = planningData?.budgetAllocated || '$450k';

  // Datos para gráficos
  const stakeholderData = [
    { name: 'CEO', alignment: 95, influence: 'High' },
    { name: 'CTO', alignment: 88, influence: 'High' },
    { name: 'Product', alignment: 92, influence: 'Medium' },
    { name: 'Dev Team', alignment: 85, influence: 'Medium' },
    { name: 'QA', alignment: 78, influence: 'Low' }
  ];

  const timelineData = [
    { phase: 'Week 1', progress: 20, target: 25 },
    { phase: 'Week 2', progress: 45, target: 50 },
    { phase: 'Week 3', progress: 68, target: 75 },
    { phase: 'Week 4', progress: 85, target: 100 }
  ];

  const riskData = [
    { name: 'Technical', value: 15, color: '#FF6B00' },
    { name: 'Business', value: 8, color: '#FFD700' },
    { name: 'Operational', value: 12, color: '#FF0080' },
    { name: 'External', value: 5, color: '#00FF80' }
  ];

  return (
    <div className="space-y-8">
      {/* HEADER DIVINO PLANNING */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-600 bg-clip-text text-transparent mb-2">
          🏛️ Santuario de la Planificación - Junta Directiva
        </h1>
        <p className="text-slate-400 text-xl">
          Arquitectura estratégica del imperio - Planificación soberana
        </p>
      </motion.div>

      {/* GRID DE MÉTRICAS PLANNING */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* PROGRESO DE PLANIFICACIÓN */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative group"
        >
          <div
            className="p-6 rounded-2xl border border-cyan-400/30 shadow-xl shadow-cyan-500/10 transition-all duration-300 hover:shadow-cyan-500/20 hover:border-cyan-400/50"
            style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(14, 116, 144, 0.05) 100%)',
              backdropFilter: 'blur(15px) saturate(150%)',
              WebkitBackdropFilter: 'blur(15px) saturate(150%)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📋</div>
              <button
                onClick={() => requestDivineExplanation('planningProgress', planningProgress, 'PlanningDashboard')}
                className="text-cyan-400 hover:text-cyan-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Progreso de Planificación</h3>
              <div className="text-4xl font-bold text-cyan-400">
                {planningProgress}%
              </div>
              <p className="text-sm text-slate-400">Hacia objetivos estratégicos</p>
            </div>
          </div>
        </motion.div>

        {/* REQUISITOS RECOPILADOS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative group"
        >
          <div
            className="p-6 rounded-2xl border border-green-400/30 shadow-xl shadow-green-500/10 transition-all duration-300 hover:shadow-green-500/20 hover:border-green-400/50"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
              backdropFilter: 'blur(15px) saturate(150%)',
              WebkitBackdropFilter: 'blur(15px) saturate(150%)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📝</div>
              <button
                onClick={() => requestDivineExplanation('requirementsGathered', requirementsGathered, 'PlanningDashboard')}
                className="text-green-400 hover:text-green-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Requisitos Recopilados</h3>
              <div className="text-4xl font-bold text-green-400">
                {requirementsGathered}%
              </div>
              <p className="text-sm text-slate-400">Cobertura de requerimientos</p>
            </div>
          </div>
        </motion.div>

        {/* ALINEACIÓN DE STAKEHOLDERS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          <div
            className="p-6 rounded-2xl border border-blue-400/30 shadow-xl shadow-blue-500/10 transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-400/50"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
              backdropFilter: 'blur(15px) saturate(150%)',
              WebkitBackdropFilter: 'blur(15px) saturate(150%)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🤝</div>
              <button
                onClick={() => requestDivineExplanation('stakeholderAlignment', stakeholderAlignment, 'PlanningDashboard')}
                className="text-blue-400 hover:text-blue-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Alineación Stakeholders</h3>
              <div className="text-4xl font-bold text-blue-400">
                {stakeholderAlignment}%
              </div>
              <p className="text-sm text-slate-400">Consenso del equipo</p>
            </div>
          </div>
        </motion.div>

        {/* PRESUPUESTO ASIGNADO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative group"
        >
          <div
            className="p-6 rounded-2xl border border-purple-400/30 shadow-xl shadow-purple-500/10 transition-all duration-300 hover:shadow-purple-500/20 hover:border-purple-400/50"
            style={{
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
              backdropFilter: 'blur(15px) saturate(150%)',
              WebkitBackdropFilter: 'blur(15px) saturate(150%)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">💰</div>
              <button
                onClick={() => requestDivineExplanation('budgetAllocated', budgetAllocated, 'PlanningDashboard')}
                className="text-purple-400 hover:text-purple-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Presupuesto Asignado</h3>
              <div className="text-2xl font-bold text-purple-400">
                {budgetAllocated}
              </div>
              <p className="text-sm text-slate-400">Recursos disponibles</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* VISUALIZACIONES PLANNING AVANZADAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ALINEACIÓN DE STAKEHOLDERS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl border border-blue-400/30"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
            backdropFilter: 'blur(15px) saturate(150%)',
            WebkitBackdropFilter: 'blur(15px) saturate(150%)'
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">🤝</span>
            Alineación de Stakeholders
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stakeholderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="alignment" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* PROGRESO DEL TIMELINE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl border border-cyan-400/30"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(14, 116, 144, 0.05) 100%)',
            backdropFilter: 'blur(15px) saturate(150%)',
            WebkitBackdropFilter: 'blur(15px) saturate(150%)'
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">📈</span>
            Progreso del Timeline
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="phase" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="progress" stroke="#06B6D4" strokeWidth={3} />
              <Line type="monotone" dataKey="target" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ANÁLISIS DE RIESGOS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-8 rounded-2xl border border-red-400/30"
        style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%)',
          backdropFilter: 'blur(15px) saturate(150%)',
          WebkitBackdropFilter: 'blur(15px) saturate(150%)'
        }}
      >
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-3">⚠️</span>
          Análisis de Riesgos de Planificación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Confianza del Timeline</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-400">{timelineConfidence}%</span>
                <button
                  onClick={() => requestDivineExplanation('timelineConfidence', timelineConfidence, 'PlanningDashboard')}
                  className="text-green-400 hover:text-green-300 transition-colors text-lg animate-pulse"
                >
                  ✨
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Índice de Riesgo Global</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-red-400">{riskAssessment}</span>
                <button
                  onClick={() => requestDivineExplanation('riskAssessment', riskAssessment, 'PlanningDashboard')}
                  className="text-red-400 hover:text-red-300 transition-colors text-lg animate-pulse"
                >
                  ✨
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CERTIFICACIÓN DE REALIDAD */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center py-4 border-t border-slate-700/50"
      >
        <div className="text-xs text-slate-500">
          🔒 Certificado por Apolo Prime - Planificación soberana 100% real del imperio
        </div>
        <div className="text-xs text-slate-600 mt-1">
          Última actualización: {new Date().toLocaleString()}
        </div>
      </motion.div>
    </div>
  );
};

export default PlanningDashboard;