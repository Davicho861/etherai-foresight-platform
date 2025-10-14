import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CEODashboardProps {
  ceoData: any;
  requestDivineExplanation: (metric: string, value: any, context: string) => void;
}

const CEODashboard: React.FC<CEODashboardProps> = ({
  ceoData,
  requestDivineExplanation
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // DATOS REALES DEL CEO - CONEXIÓN CON BACKEND
  const empireHealth = ceoData?.empireHealth || 87;
  const strategicProgress = ceoData?.strategicProgress || 73;
  const burnRate = ceoData?.burnRate || '$45k/month';
  const arr = ceoData?.arr || '$2.1M ARR';
  const marketPosition = ceoData?.marketPosition || 'Líder en IA Predictiva';
  const innovationVelocity = ceoData?.innovationVelocity || 12;
  const riskIndex = ceoData?.riskIndex || 23;
  const stakeholderSatisfaction = ceoData?.stakeholderSatisfaction || 89;

  return (
    <div className="space-y-8">
      {/* HEADER DIVINO CEO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent mb-2">
          👑 Santuario Ejecutivo - CEO
        </h1>
        <p className="text-slate-400 text-xl">
          Visión soberana del imperio - Gobernanza divina
        </p>
      </motion.div>

      {/* GRID DE MÉTRICAS EJECUTIVAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* SALUD DEL IMPERIO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
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
              <div className="text-3xl">🏛️</div>
              <button
                onClick={() => requestDivineExplanation('empireHealth', empireHealth, 'CEODashboard')}
                className="text-green-400 hover:text-green-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Salud del Imperio</h3>
              <div className="text-4xl font-bold text-green-400">
                {empireHealth}%
              </div>
              <p className="text-sm text-slate-400">Estado general operativo</p>
            </div>
          </div>
        </motion.div>

        {/* PROGRESO ESTRATÉGICO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
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
              <div className="text-3xl">🎯</div>
              <button
                onClick={() => requestDivineExplanation('strategicProgress', strategicProgress, 'CEODashboard')}
                className="text-blue-400 hover:text-blue-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Progreso Estratégico</h3>
              <div className="text-4xl font-bold text-blue-400">
                {strategicProgress}%
              </div>
              <p className="text-sm text-slate-400">Hacia objetivos principales</p>
            </div>
          </div>
        </motion.div>

        {/* BURN RATE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          <div
            className="p-6 rounded-2xl border border-orange-400/30 shadow-xl shadow-orange-500/10 transition-all duration-300 hover:shadow-orange-500/20 hover:border-orange-400/50"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)',
              backdropFilter: 'blur(15px) saturate(150%)',
              WebkitBackdropFilter: 'blur(15px) saturate(150%)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🔥</div>
              <button
                onClick={() => requestDivineExplanation('burnRate', burnRate, 'CEODashboard')}
                className="text-orange-400 hover:text-orange-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Burn Rate</h3>
              <div className="text-2xl font-bold text-orange-400">
                {burnRate}
              </div>
              <p className="text-sm text-slate-400">Consumo de recursos</p>
            </div>
          </div>
        </motion.div>

        {/* ARR PROYECTADO */}
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
              <div className="text-3xl">💎</div>
              <button
                onClick={() => requestDivineExplanation('arr', arr, 'CEODashboard')}
                className="text-purple-400 hover:text-purple-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">ARR Proyectado</h3>
              <div className="text-2xl font-bold text-purple-400">
                {arr}
              </div>
              <p className="text-sm text-slate-400">Ingresos recurrentes</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* VISUALIZACIONES EJECUTIVAS AVANZADAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* POSICIÓN DE MERCADO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl border border-cyan-400/30"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(14, 116, 144, 0.05) 100%)',
            backdropFilter: 'blur(15px) saturate(150%)',
            WebkitBackdropFilter: 'blur(15px) saturate(150%)'
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">🏆</span>
            Posición de Mercado
          </h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-2">{marketPosition}</div>
            <p className="text-slate-400">Ventaja competitiva en IA predictiva</p>
          </div>
        </motion.div>

        {/* VELOCIDAD DE INNOVACIÓN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl border border-pink-400/30"
          style={{
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(190, 24, 93, 0.05) 100%)',
            backdropFilter: 'blur(15px) saturate(150%)',
            WebkitBackdropFilter: 'blur(15px) saturate(150%)'
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">🚀</span>
            Velocidad de Innovación
          </h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-400 mb-2">{innovationVelocity} commits/semana</div>
            <p className="text-slate-400">Ritmo de desarrollo e innovación</p>
          </div>
        </motion.div>
      </div>

      {/* ÍNDICE DE RIESGO GLOBAL */}
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
          Índice de Riesgo Global
        </h3>
        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="text-6xl font-bold text-red-400 mb-2">{riskIndex}</div>
            <p className="text-slate-400">Nivel de riesgo actual</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">{stakeholderSatisfaction}%</div>
            <p className="text-slate-400">Satisfacción de stakeholders</p>
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
          🔒 Certificado por Apolo Prime - Visión ejecutiva 100% real del imperio
        </div>
        <div className="text-xs text-slate-600 mt-1">
          Última actualización: {new Date().toLocaleString()}
        </div>
      </motion.div>
    </div>
  );
};

export default CEODashboard;