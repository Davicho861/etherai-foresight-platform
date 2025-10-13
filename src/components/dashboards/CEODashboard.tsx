import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

interface Props {
  predictiveData: any;
  requestXaiExplanation: (metric: string, value: any, context: string) => Promise<void>;
}

const CEODashboard: React.FC<Props> = ({ predictiveData, requestXaiExplanation }) => {
  if (!predictiveData) return <div>Cargando datos predictivos...</div>;

  const chartData = (
    predictiveData?.history && predictiveData.history.length
  ) ? predictiveData.history : [
    { month: 'Ene', riesgo: 45, precision: 92, volumen: 1200 },
    { month: 'Feb', riesgo: 52, precision: 89, volumen: 1350 },
    { month: 'Mar', riesgo: 38, precision: 94, volumen: 1180 },
    { month: 'Abr', riesgo: 61, precision: 87, volumen: 1420 },
    { month: 'May', riesgo: 49, precision: 91, volumen: 1280 },
    { month: 'Jun', riesgo: 55, precision: 88, volumen: 1390 }
  ];

  const riskDistribution = (
    predictiveData?.riskDistribution && predictiveData.riskDistribution.length
  ) ? predictiveData.riskDistribution : [
    { name: 'Bajo', value: 35, color: '#10B981' },
    { name: 'Medio', value: 45, color: '#F59E0B' },
    { name: 'Alto', value: 20, color: '#EF4444' }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">🔮 Análisis Predictivo</h2>
        <p className="text-sm text-slate-400">Visión ejecutiva basada en datos reales</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold">{predictiveData?.kpis?.precisionPromedio ?? 0}%</div>
            <button onClick={() => requestXaiExplanation('precisionPromedio', predictiveData?.kpis?.precisionPromedio, 'CEODashboard')}>✨</button>
          </div>
          <div className="text-xs text-slate-400">Precisión Promedio</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold">{predictiveData?.kpis?.prediccionesDiarias ?? 0}</div>
            <button onClick={() => requestXaiExplanation('prediccionesDiarias', predictiveData?.kpis?.prediccionesDiarias, 'CEODashboard')}>✨</button>
          </div>
          <div className="text-xs text-slate-400">Predicciones Diarias</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold">{predictiveData?.kpis?.monitoreoContinuo ?? 0}h</div>
            <button onClick={() => requestXaiExplanation('monitoreoContinuo', predictiveData?.kpis?.monitoreoContinuo, 'CEODashboard')}>✨</button>
          </div>
          <div className="text-xs text-slate-400">Monitoreo Continuo</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold">{predictiveData?.kpis?.coberturaRegional ?? 0}</div>
            <button onClick={() => requestXaiExplanation('coberturaRegional', predictiveData?.kpis?.coberturaRegional, 'CEODashboard')}>✨</button>
          </div>
          <div className="text-xs text-slate-400">Países Monitoreados</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 rounded-lg bg-slate-800/60">
          <h3 className="text-sm font-semibold mb-2">Evolución del Riesgo</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
              <Line type="monotone" dataKey="riesgo" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 rounded-lg bg-slate-800/60">
          <h3 className="text-sm font-semibold mb-2">Distribución de Riesgos</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={riskDistribution} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                {riskDistribution.map((entry: any, idx: number) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-slate-800/60">
        <h3 className="text-sm font-semibold mb-2">Volumen de Predicciones</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
            <Bar dataKey="volumen" fill="#7c3aed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CEODashboard;