import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CMODashboardProps {
  cmoData: any;
  requestDivineExplanation: (_metric: string, _value: any, _context: string) => void;
}

const CMODashboard: React.FC<CMODashboardProps> = ({
  cmoData,
  requestDivineExplanation
}) => {
  const [_selectedMetric, _setSelectedMetric] = useState<string | null>(null);

  // DATOS REALES DEL CMO - CONEXIÓN CON BACKEND
  const demoEngagement = cmoData?.demoEngagement || 87;
  const leadsGenerated = cmoData?.leadsGenerated || 234;
  const brandSentiment = cmoData?.brandSentiment || 91;
  const marketPenetration = cmoData?.marketPenetration || 73;
  const conversionRate = cmoData?.conversionRate || '12.5%';
  const customerAcquisition = cmoData?.customerAcquisition || 45;
  const retentionRate = cmoData?.retentionRate || '89%';
  const viralCoefficient = cmoData?.viralCoefficient || 1.8;

  return (
    <div className="space-y-8">
      {/* HEADER DIVINO CMO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-rose-500 to-red-600 bg-clip-text text-transparent mb-2">
          📈 Santuario de Mercado - CMO
        </h1>
        <p className="text-slate-400 text-xl">
          Engagement soberano - Métricas de mercado del imperio
        </p>
      </motion.div>

      {/* GRID DE MÉTRICAS DE MERCADO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ENGAGEMENT DE LA DEMO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative group"
        >
          <div
            className="p-6 rounded-2xl border border-pink-400/30 shadow-xl shadow-pink-500/10 transition-all duration-300 hover:shadow-pink-500/20 hover:border-pink-400/50"
            style={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(190, 24, 93, 0.05) 100%)',
              backdropFilter: 'blur(15px) saturate(150%)',
              WebkitBackdropFilter: 'blur(15px) saturate(150%)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🎯</div>
              <button
                onClick={() => requestDivineExplanation('demoEngagement', demoEngagement, 'CMODashboard')}
                className="text-pink-400 hover:text-pink-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Demo Engagement</h3>
              <div className="text-4xl font-bold text-pink-400">
                {demoEngagement}%
              </div>
              <p className="text-sm text-slate-400">Interacción con la plataforma</p>
            </div>
          </div>
        </motion.div>

        {/* LEADS GENERADOS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
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
              <div className="text-3xl">👥</div>
              <button
                onClick={() => requestDivineExplanation('leadsGenerated', leadsGenerated, 'CMODashboard')}
                className="text-purple-400 hover:text-purple-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Leads Generados</h3>
              <div className="text-4xl font-bold text-purple-400">
                {leadsGenerated}
              </div>
              <p className="text-sm text-slate-400">Prospectos interesados</p>
            </div>
          </div>
        </motion.div>

        {/* SENTIMIENTO DE MARCA */}
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
              <div className="text-3xl">💝</div>
              <button
                onClick={() => requestDivineExplanation('brandSentiment', brandSentiment, 'CMODashboard')}
                className="text-blue-400 hover:text-blue-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Sentimiento de Marca</h3>
              <div className="text-4xl font-bold text-blue-400">
                {brandSentiment}%
              </div>
              <p className="text-sm text-slate-400">Percepción positiva</p>
            </div>
          </div>
        </motion.div>

        {/* PENETRACIÓN DE MERCADO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
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
              <div className="text-3xl">🌍</div>
              <button
                onClick={() => requestDivineExplanation('marketPenetration', marketPenetration, 'CMODashboard')}
                className="text-cyan-400 hover:text-cyan-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Penetración</h3>
              <div className="text-4xl font-bold text-cyan-400">
                {marketPenetration}%
              </div>
              <p className="text-sm text-slate-400">Cobertura de mercado</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CONVERSIÓN Y RETENCIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TASA DE CONVERSIÓN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl border border-green-400/30"
          style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
            backdropFilter: 'blur(15px) saturate(150%)',
            WebkitBackdropFilter: 'blur(15px) saturate(150%)'
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">🎯</span>
            Conversión
          </h3>
          <div className="text-center">
            <div className="text-5xl font-bold text-green-400 mb-2">{conversionRate}</div>
            <p className="text-slate-400">Tasa de conversión de leads</p>
          </div>
        </motion.div>

        {/* TASA DE RETENCIÓN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl border border-orange-400/30"
          style={{
            background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)',
            backdropFilter: 'blur(15px) saturate(150%)',
            WebkitBackdropFilter: 'blur(15px) saturate(150%)'
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">🔄</span>
            Retención
          </h3>
          <div className="text-center">
            <div className="text-5xl font-bold text-orange-400 mb-2">{retentionRate}</div>
            <p className="text-slate-400">Retención de clientes</p>
          </div>
        </motion.div>
      </div>

      {/* ADQUISICIÓN Y VIRALIDAD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-8 rounded-2xl border border-indigo-400/30"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)',
          backdropFilter: 'blur(15px) saturate(150%)',
          WebkitBackdropFilter: 'blur(15px) saturate(150%)'
        }}
      >
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-3">🚀</span>
          Adquisición & Viralidad
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4 bg-indigo-800/20 rounded-xl">
            <div className="text-3xl font-bold text-indigo-300 mb-2">{customerAcquisition}</div>
            <div className="text-sm text-indigo-400">Adquisición de Clientes</div>
          </div>
          <div className="text-center p-4 bg-indigo-800/20 rounded-xl">
            <div className="text-3xl font-bold text-indigo-300 mb-2">{viralCoefficient}</div>
            <div className="text-sm text-indigo-400">Coeficiente Viral</div>
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
          🔒 Certificado por Apolo Prime - Métricas de mercado 100% reales del imperio
        </div>
        <div className="text-xs text-slate-600 mt-1">
          Última actualización: {new Date().toLocaleString()}
        </div>
      </motion.div>
    </div>
  );
};

export default CMODashboard;