import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  systemData: any;
}

const SystemStatusDashboard: React.FC<Props> = ({ systemData }) => {
  if (!systemData) return <div>Cargando estado del sistema...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-google-text-primary mb-2">⚙️ Dashboard de Meta-Gobernanza (SDLC)</h2>
        <p className="text-google-text-secondary">Autoconciencia y estado completo del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-google-surface border border-gray-700 rounded-lg p-6"><div className="text-2xl font-bold text-google-primary mb-2">99.9%</div><div className="text-sm text-google-text-secondary">Uptime Sistema</div></motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="bg-google-surface border border-gray-700 rounded-lg p-6"><div className="text-2xl font-bold text-google-primary mb-2">24/7</div><div className="text-sm text-google-text-secondary">Monitoreo Continuo</div></motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="bg-google-surface border border-gray-700 rounded-lg p-6"><div className="text-2xl font-bold text-google-primary mb-2">Ω</div><div className="text-sm text-google-text-secondary">Omnisciencia</div></motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="bg-google-surface border border-gray-700 rounded-lg p-6"><div className="text-2xl font-bold text-google-primary mb-2">0ms</div><div className="text-sm text-google-text-secondary">Latencia Cuántica</div></motion.div>
      </div>

      {systemData.kanban && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Kanban del Proyecto</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {systemData.kanban.columns?.map((column: any, index: number) => (
              <motion.div key={column.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + index * 0.1 }} className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center"><div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-2"></div>{column.name}</h4>
                <div className="space-y-2">{column.tasks?.map((task: string, taskIndex: number) => (<div key={taskIndex} className="flex items-center text-sm text-slate-300"><div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>{task}</div>))}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Salud Técnica</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center"><span className="text-slate-400">Arquitectura</span><span className="text-green-400 font-mono">95%</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400">Calidad de Código</span><span className="text-blue-400 font-mono">88%</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400">Cobertura de Tests</span><span className="text-purple-400 font-mono">84%</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400">Deuda Técnica</span><span className="text-orange-400 font-mono">12%</span></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Estado de Despliegue</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center"><span className="text-slate-400">Frecuencia de Deploy</span><span className="text-green-400 font-mono">2.3/día</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400">Tiempo de Deploy</span><span className="text-blue-400 font-mono">8.5 min</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400">Disponibilidad</span><span className="text-purple-400 font-mono">99.95%</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400">MTTR</span><span className="text-orange-400 font-mono">15 min</span></div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 backdrop-blur-sm border border-indigo-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center"><span className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mr-2 animate-pulse"></span>Consciencia del Sistema</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-indigo-800/30 rounded-lg"><div className="text-2xl font-bold text-indigo-300">✓</div><div className="text-xs text-indigo-400">Modelos Activos</div></div>
          <div className="text-center p-4 bg-purple-800/30 rounded-lg"><div className="text-2xl font-bold text-purple-300">✓</div><div className="text-xs text-purple-400">Gobernanza Ética</div></div>
          <div className="text-center p-4 bg-pink-800/30 rounded-lg"><div className="text-2xl font-bold text-pink-300">✓</div><div className="text-xs text-pink-400">Vigilancia Perpetua</div></div>
          <div className="text-center p-4 bg-cyan-800/30 rounded-lg"><div className="text-2xl font-bold text-cyan-300">✓</div><div className="text-xs text-cyan-400">Autoconciencia</div></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SystemStatusDashboard;
