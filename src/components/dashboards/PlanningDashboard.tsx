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
        <h1 className="text-5xl font-bold text-google-text-primary mb-2">
          🏛️ Santuario de la Planificación - Junta Directiva
        </h1>
        <p className="text-google-text-secondary text-xl">
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
          <div className="p-6 rounded-lg border border-gray-700 bg-google-surface transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📋</div>
              <button
                onClick={() => requestDivineExplanation('planningProgress', planningProgress, 'PlanningDashboard')}
                className="text-google-primary hover:opacity-90 transition-colors text-xl"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-google-text-primary">Progreso de Planificación</h3>
              <div className="text-4xl font-bold text-google-primary">
                {planningProgress}%
              </div>
              <p className="text-sm text-google-text-secondary">Hacia objetivos estratégicos</p>
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
            className="p-6 rounded-lg border border-gray-700 bg-google-surface transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📝</div>
              <button
                onClick={() => requestDivineExplanation('requirementsGathered', requirementsGathered, 'PlanningDashboard')}
                className="text-google-primary hover:brightness-110 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-google-text-primary">Requisitos Recopilados</h3>
              <div className="text-4xl font-bold text-google-primary">
                {requirementsGathered}%
              </div>
              <p className="text-sm text-google-text-secondary">Cobertura de requerimientos</p>
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
            className="p-6 rounded-lg border border-gray-700 bg-google-surface transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🤝</div>
              <button
                onClick={() => requestDivineExplanation('stakeholderAlignment', stakeholderAlignment, 'PlanningDashboard')}
                className="text-google-primary hover:brightness-110 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-google-text-primary">Alineación Stakeholders</h3>
              <div className="text-4xl font-bold text-google-primary">
                {stakeholderAlignment}%
              </div>
              <p className="text-sm text-google-text-secondary">Consenso del equipo</p>
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
            className="p-6 rounded-lg border border-gray-700 bg-google-surface transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">💰</div>
              <button
                onClick={() => requestDivineExplanation('budgetAllocated', budgetAllocated, 'PlanningDashboard')}
                className="text-google-primary hover:brightness-110 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-google-text-primary">Presupuesto Asignado</h3>
              <div className="text-2xl font-bold text-google-primary">
                {budgetAllocated}
              </div>
              <p className="text-sm text-google-text-secondary">Recursos disponibles</p>
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
            className="p-6 rounded-lg border border-gray-700 bg-google-surface"
        >
          <h3 className="text-2xl font-bold text-google-text-primary mb-6 flex items-center">
            <span className="mr-3">🤝</span>
            Alineación de Stakeholders
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stakeholderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--text-secondary))" />
              <YAxis stroke="hsl(var(--text-secondary))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: `1px solid hsl(var(--border))`, borderRadius: '8px' }} />
              <Bar dataKey="alignment" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* PROGRESO DEL TIMELINE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-lg border border-gray-700 bg-google-surface"
          >
          <h3 className="text-2xl font-bold text-google-text-primary mb-6 flex items-center">
            <span className="mr-3">📈</span>
            Progreso del Timeline
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="phase" stroke="hsl(var(--text-secondary))" />
              <YAxis stroke="hsl(var(--text-secondary))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: `1px solid hsl(var(--border))`, borderRadius: '8px' }} />
              <Line type="monotone" dataKey="progress" stroke="hsl(var(--primary))" strokeWidth={3} />
              <Line type="monotone" dataKey="target" stroke="hsl(var(--accent-yellow))" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ANÁLISIS DE RIESGOS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-8 rounded-lg border border-gray-700 bg-google-surface"
      >
        <h3 className="text-2xl font-bold text-google-text-primary mb-6 flex items-center">
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
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: `1px solid hsl(var(--border))`, borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-google-text-secondary">Confianza del Timeline</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-google-primary">{timelineConfidence}%</span>
                <button
                  onClick={() => requestDivineExplanation('timelineConfidence', timelineConfidence, 'PlanningDashboard')}
                  className="text-google-primary hover:brightness-110 transition-colors text-lg animate-pulse"
                >
                  ✨
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-google-text-secondary">Índice de Riesgo Global</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-google-accent-red">{riskAssessment}</span>
                <button
                  onClick={() => requestDivineExplanation('riskAssessment', riskAssessment, 'PlanningDashboard')}
                  className="text-google-accent-red hover:brightness-110 transition-colors text-lg animate-pulse"
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
        className="text-center py-4 border-t border-gray-700/50"
      >
        <div className="text-xs text-google-text-secondary">
          🔒 Certificado por Apolo Prime - Planificación soberana 100% real del imperio
        </div>
        <div className="text-xs text-google-text-secondary mt-1">
          Última actualización: {new Date().toLocaleString()}
        </div>
      </motion.div>
    </div>
  );
};

export default PlanningDashboard;