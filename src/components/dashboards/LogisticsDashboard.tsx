import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  logisticsData: any;
}

const LogisticsDashboard: React.FC<Props> = ({ logisticsData }) => {
  if (!logisticsData) return <div>Cargando datos de optimización logística...</div>;

  const supplyChainData = [
    { etapa: 'Cultivo', riesgo: 25, eficiencia: 85, costo: 120 },
    { etapa: 'Cosecha', riesgo: 35, eficiencia: 78, costo: 95 },
    { etapa: 'Procesamiento', riesgo: 20, eficiencia: 92, costo: 150 },
    { etapa: 'Transporte', riesgo: 45, eficiencia: 70, costo: 200 },
    { etapa: 'Distribución', riesgo: 30, eficiencia: 88, costo: 180 },
    { etapa: 'Venta', riesgo: 15, eficiencia: 95, costo: 250 }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent mb-2">🚛 Optimización de Cadenas de Suministro</h2>
        <p className="text-slate-400">Análisis de riesgo en la cadena de valor del café</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"><div className="text-2xl font-bold text-green-400 mb-2">87%</div><div className="text-sm text-slate-400">Eficiencia General</div></motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"><div className="text-2xl font-bold text-orange-400 mb-2">28%</div><div className="text-sm text-slate-400">Riesgo Promedio</div></motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"><div className="text-2xl font-bold text-blue-400 mb-2">$1,195</div><div className="text-sm text-slate-400">Costo Total</div></motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"><div className="text-2xl font-bold text-purple-400 mb-2">6</div><div className="text-sm text-slate-400">Etapas Optimizadas</div></motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Cadena de Suministro de Café</h3>
        <div className="space-y-4">
          {supplyChainData.map((etapa, index) => (
            <motion.div key={etapa.etapa} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1 }} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">{index + 1}</div>
                <div><h4 className="text-white font-semibold">{etapa.etapa}</h4><p className="text-slate-400 text-sm">Etapa de producción</p></div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center"><div className="text-sm text-slate-400">Riesgo</div><div className={`font-bold ${etapa.riesgo > 40 ? 'text-red-400' : etapa.riesgo > 25 ? 'text-orange-400' : 'text-green-400'}`}>{etapa.riesgo}%</div></div>
                <div className="text-center"><div className="text-sm text-slate-400">Eficiencia</div><div className="text-green-400 font-bold">{etapa.eficiencia}%</div></div>
                <div className="text-center"><div className="text-sm text-slate-400">Costo</div><div className="text-blue-400 font-bold">${etapa.costo}</div></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Riesgos por Etapa</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={supplyChainData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="etapa" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
            <Bar dataKey="riesgo" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default LogisticsDashboard;
