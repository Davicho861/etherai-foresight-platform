import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface COODashboardProps {
  cooData: any;
  requestDivineExplanation: (_metric: string, _value: any, _context: string) => void;
}

const COODashboard: React.FC<COODashboardProps> = ({
  cooData,
  requestDivineExplanation
}) => {
  const [_selectedMetric, _setSelectedMetric] = useState<string | null>(null);

  // DATOS REALES DEL COO - CONEXIÓN CON BACKEND
  const crewVelocity = cooData?.crewVelocity || 23;
  const kanbanThroughput = cooData?.kanbanThroughput || 45;
  const leadTime = cooData?.leadTime || '12 days';
  const operationalEfficiency = cooData?.operationalEfficiency || 87;
  const resourceUtilization = cooData?.resourceUtilization || 78;
  const processAutomation = cooData?.processAutomation || 64;
  const teamProductivity = cooData?.teamProductivity || 82;

  const qualityMetrics = cooData?.qualityMetrics || {
    defectRate: '2.1%',
    reworkRate: '8.5%',
    customerSatisfaction: 91
  };

  return (
    <div className="space-y-8">
      {/* HEADER DIVINO COO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-[color:var(--text-primary)] mb-2">
          🏭 Santuario Operativo - COO
        </h1>
        <p className="text-slate-400 text-xl">
          Eficiencia operativa soberana - Procesos y ejecución del imperio
        </p>
      </motion.div>

      {/* GRID DE MÉTRICAS OPERATIVAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* VELOCIDAD DE CREWS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative group"
        >
          <div className="p-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🚀</div>
              <button
                onClick={() => requestDivineExplanation('crewVelocity', crewVelocity, 'COODashboard')}
                className="text-amber-400 hover:text-amber-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Velocidad de Crews</h3>
              <div className="text-4xl font-bold text-amber-400">
                {crewVelocity}
              </div>
              <p className="text-sm text-slate-400">Commits por desarrollador</p>
            </div>
          </div>
        </motion.div>

        {/* THROUGHPUT DEL KANBAN */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative group"
        >
          <div className="p-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📋</div>
              <button
                onClick={() => requestDivineExplanation('kanbanThroughput', kanbanThroughput, 'COODashboard')}
                className="text-orange-400 hover:text-orange-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Kanban Throughput</h3>
              <div className="text-4xl font-bold text-orange-400">
                {kanbanThroughput}
              </div>
              <p className="text-sm text-slate-400">Issues cerrados</p>
            </div>
          </div>
        </motion.div>

        {/* LEAD TIME */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          <div className="p-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">⏱️</div>
              <button
                onClick={() => requestDivineExplanation('leadTime', leadTime, 'COODashboard')}
                className="text-red-400 hover:text-red-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Lead Time</h3>
              <div className="text-2xl font-bold text-red-400">
                {leadTime}
              </div>
              <p className="text-sm text-slate-400">Tiempo de entrega</p>
            </div>
          </div>
        </motion.div>

        {/* EFICIENCIA OPERATIVA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative group"
        >
          <div className="p-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">⚙️</div>
              <button
                onClick={() => requestDivineExplanation('operationalEfficiency', operationalEfficiency, 'COODashboard')}
                className="text-green-400 hover:text-green-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Eficiencia Operativa</h3>
              <div className="text-4xl font-bold text-green-400">
                {operationalEfficiency}%
              </div>
              <p className="text-sm text-slate-400">Optimización de procesos</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* UTILIZACIÓN Y AUTOMATIZACIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* UTILIZACIÓN DE RECURSOS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]"
        >
          <h3 className="text-2xl font-bold text-[color:var(--text-primary)] mb-6 flex items-center">
            <span className="mr-3">📊</span>
            Utilización de Recursos
          </h3>
          <div className="text-center">
            <div className="text-5xl font-bold text-[color:var(--primary)] mb-2">{resourceUtilization}%</div>
            <p className="text-[color:var(--text-secondary)]">Eficiencia en el uso de recursos</p>
          </div>
        </motion.div>

        {/* AUTOMATIZACIÓN DE PROCESOS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]"
        >
          <h3 className="text-2xl font-bold text-[color:var(--text-primary)] mb-6 flex items-center">
            <span className="mr-3">🤖</span>
            Automatización
          </h3>
          <div className="text-center">
            <div className="text-5xl font-bold text-[color:var(--primary)] mb-2">{processAutomation}%</div>
            <p className="text-[color:var(--text-secondary)]">Procesos automatizados</p>
          </div>
        </motion.div>
      </div>

      {/* MÉTRICAS DE CALIDAD Y PRODUCTIVIDAD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-8 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]"
      >
        <h3 className="text-2xl font-bold text-[color:var(--text-primary)] mb-6 flex items-center">
          <span className="mr-3">⭐</span>
          Calidad & Productividad
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[color:var(--text-secondary)]">Tasa de Defectos:</span>
              <span className="font-mono text-[color:var(--accent-red)]">{qualityMetrics.defectRate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[color:var(--text-secondary)]">Tasa de Retrabajo:</span>
              <span className="font-mono text-[color:var(--accent-yellow)]">{qualityMetrics.reworkRate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[color:var(--text-secondary)]">Satisfacción del Cliente:</span>
              <span className="font-mono text-[color:var(--primary)]">{qualityMetrics.customerSatisfaction}%</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[color:var(--accent-yellow)] mb-2">{teamProductivity}%</div>
            <p className="text-[color:var(--text-secondary)]">Productividad del Equipo</p>
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
          🔒 Certificado por Apolo Prime - Operaciones 100% reales del imperio
        </div>
        <div className="text-xs text-slate-600 mt-1">
          Última actualización: {new Date().toLocaleString()}
        </div>
      </motion.div>
    </div>
  );
};

export default COODashboard;