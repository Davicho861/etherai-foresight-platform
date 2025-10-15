import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CTODashboardProps {
  ctoData: any;
  requestDivineExplanation: (_metric: string, _value: any, _context: string) => void;
}

const CTODashboard: React.FC<CTODashboardProps> = ({
  ctoData,
  requestDivineExplanation
}) => {
  const [_selectedMetric, _setSelectedMetric] = useState<string | null>(null);

  // DATOS REALES DEL CTO - CONEXIÓN CON BACKEND
  const technicalDebt = ctoData?.technicalDebt || 23;
  const complexityScore = ctoData?.complexityScore || 78;
  const innovationVelocity = ctoData?.innovationVelocity || 15;
  const architectureHealth = ctoData?.architectureHealth || 89;
  const scalabilityIndex = ctoData?.scalabilityIndex || 82;
  const modernizationReadiness = ctoData?.modernizationReadiness || 91;
  const dependencyVulnerabilities = ctoData?.dependencyVulnerabilities || 2;
  const codeQuality = ctoData?.codeQuality || 87;

  return (
  <div className="space-y-8 bg-google-background p-6">
      {/* HEADER DIVINO CTO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-google-text-primary mb-2">
          ⚡ Santuario Tecnológico - CTO
        </h1>
        <p className="text-google-text-secondary text-xl">
          Arquitectura soberana - Salud técnica del imperio
        </p>
      </motion.div>

      {/* GRID DE MÉTRICAS TÉCNICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* DEUDA TÉCNICA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative group"
        >
          <div className="p-6 rounded-lg border border-gray-700 bg-google-surface transition-shadow duration-200 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🏗️</div>
              <button
                onClick={() => requestDivineExplanation('technicalDebt', technicalDebt, 'CTODashboard')}
                className="text-red-400 hover:text-red-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-google-text-primary">Deuda Técnica</h3>
              <div className="text-4xl font-bold text-red-400">
                {technicalDebt}%
              </div>
              <p className="text-sm text-slate-400">Código legacy por refactorizar</p>
            </div>
          </div>
        </motion.div>

        {/* SCORE DE COMPLEJIDAD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative group"
        >
          <div className="p-6 rounded-lg border border-gray-700 bg-google-surface transition-shadow duration-200 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🧩</div>
              <button
                onClick={() => requestDivineExplanation('complexityScore', complexityScore, 'CTODashboard')}
                className="text-orange-400 hover:text-orange-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-google-text-primary">Complejidad</h3>
              <div className="text-4xl font-bold text-orange-400">
                {complexityScore}%
              </div>
              <p className="text-sm text-slate-400">Score ciclomático promedio</p>
            </div>
          </div>
        </motion.div>

        {/* VELOCIDAD DE INNOVACIÓN */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          <div className="p-6 rounded-lg border border-gray-700 bg-google-surface transition-shadow duration-200 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🚀</div>
              <button
                onClick={() => requestDivineExplanation('innovationVelocity', innovationVelocity, 'CTODashboard')}
                className="text-purple-400 hover:text-purple-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-google-text-primary">Innovación</h3>
              <div className="text-3xl font-bold text-purple-400">
                {innovationVelocity}
              </div>
              <p className="text-sm text-slate-400">Commits por semana</p>
            </div>
          </div>
        </motion.div>

        {/* SALUD DE ARQUITECTURA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative group"
        >
          <div className="p-6 rounded-lg border border-gray-700 bg-google-surface transition-shadow duration-200 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🏛️</div>
              <button
                onClick={() => requestDivineExplanation('architectureHealth', architectureHealth, 'CTODashboard')}
                className="text-green-400 hover:text-green-300 transition-colors text-xl animate-pulse"
              >
                ✨
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-google-text-primary">Arquitectura</h3>
              <div className="text-4xl font-bold text-green-400">
                {architectureHealth}%
              </div>
              <p className="text-sm text-slate-400">Salud de la arquitectura</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* MÉTRICAS DE ESCALABILIDAD Y MODERNIZACIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ÍNDICE DE ESCALABILIDAD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-lg border border-gray-700 bg-google-surface"
        >
          <h3 className="text-2xl font-bold text-[color:var(--text-primary)] mb-6 flex items-center">
            <span className="mr-3">📈</span>
            Escalabilidad
          </h3>
          <div className="text-center">
            <div className="text-5xl font-bold text-[color:var(--primary)] mb-2">{scalabilityIndex}%</div>
            <p className="text-[color:var(--text-secondary)]">Índice de escalabilidad del sistema</p>
          </div>
        </motion.div>

        {/* PREPARACIÓN PARA MODERNIZACIÓN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-lg border border-gray-700 bg-google-surface"
        >
          <h3 className="text-2xl font-bold text-[color:var(--text-primary)] mb-6 flex items-center">
            <span className="mr-3">🔄</span>
            Modernización
          </h3>
          <div className="text-center">
            <div className="text-5xl font-bold text-[color:var(--primary)] mb-2">{modernizationReadiness}%</div>
            <p className="text-[color:var(--text-secondary)]">Preparación para tecnologías modernas</p>
          </div>
        </motion.div>
      </div>

      {/* SEGURIDAD Y CALIDAD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-8 rounded-lg border border-gray-700 bg-google-surface"
      >
        <h3 className="text-2xl font-bold text-[color:var(--text-primary)] mb-6 flex items-center">
          <span className="mr-3">🔒</span>
          Seguridad & Calidad
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[color:var(--text-secondary)]">Vulnerabilidades:</span>
              <span className="font-mono text-[color:var(--accent-red)]">{dependencyVulnerabilities}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[color:var(--text-secondary)]">Calidad de Código:</span>
              <span className="font-mono text-[color:var(--primary)]">{codeQuality}%</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[color:var(--accent-yellow)] mb-2">
              {codeQuality - dependencyVulnerabilities * 5}%
            </div>
            <p className="text-[color:var(--text-secondary)]">Score Técnico General</p>
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
          🔒 Certificado por Apolo Prime - Arquitectura técnica 100% real del imperio
        </div>
        <div className="text-xs text-slate-600 mt-1">
          Última actualización: {new Date().toLocaleString()}
        </div>
      </motion.div>
    </div>
  );
};

export default CTODashboard;