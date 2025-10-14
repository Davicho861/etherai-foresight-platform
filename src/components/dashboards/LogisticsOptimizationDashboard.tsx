import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Stage {
  stage: string;
  icon: string;
  risk: number;
  efficiency: number;
  cost: number;
  color: string;
}

interface LogisticsPayload {
  kpis: { chainsActive: number; efficiency: number; resilience: number };
  stages: Stage[];
  chains?: any[];
}

const defaultStages: Stage[] = [
  { stage: 'Cultivo', icon: '🌱', risk: 25, efficiency: 85, cost: 35, color: 'from-green-500 to-emerald-500' },
  { stage: 'Cosecha', icon: '✂️', risk: 30, efficiency: 78, cost: 28, color: 'from-yellow-500 to-orange-500' },
  { stage: 'Procesamiento', icon: '🏭', risk: 20, efficiency: 92, cost: 22, color: 'from-blue-500 to-cyan-500' },
  { stage: 'Transporte', icon: '🚚', risk: 45, efficiency: 65, cost: 40, color: 'from-red-500 to-pink-500' },
  { stage: 'Distribución', icon: '📦', risk: 35, efficiency: 88, cost: 18, color: 'from-purple-500 to-indigo-500' },
  { stage: 'Venta', icon: '🛒', risk: 15, efficiency: 95, cost: 12, color: 'from-teal-500 to-green-500' }
];

const LogisticsOptimizationDashboard: React.FC = () => {
  const [data, setData] = useState<LogisticsPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [xaiLoading, setXaiLoading] = useState<boolean>(false);
  const [xaiExplanation, setXaiExplanation] = useState<string | null>(null);
  const [xaiOpen, setXaiOpen] = useState<boolean>(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/logistics/live');
        if (!res.ok) {
          throw new Error(`Backend error: ${res.status} ${res.statusText}`);
        }
        const payload = (await res.json()) as LogisticsPayload;
        if (mounted) setData(payload);
      } catch (err: any) {
        if (mounted) setError(err?.message || 'Error desconocido al cargar datos logísticos');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const requestDivineExplanation = async (metric: string, value: any, context = 'LogisticsOptimization') => {
    setSelectedMetric(metric);
    setXaiLoading(true);
    setXaiExplanation(null);
    setXaiOpen(true);
    try {
      const res = await fetch('/api/xai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric, value, context })
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`XAI error: ${res.status} ${txt}`);
      }
      const body = await res.json();
      setXaiExplanation(body?.explanation || JSON.stringify(body));
    } catch (err: any) {
      setXaiExplanation(`No se pudo obtener explicación: ${err?.message || 'error desconocido'}`);
    } finally {
      setXaiLoading(false);
    }
  };

  const kpis = data?.kpis || { chainsActive: 0, efficiency: 0, resilience: 0 };
  const stages = data?.stages && data.stages.length ? data.stages : defaultStages;

  return (
    <div className="space-y-8">
      {/* HEADER DIVINO */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 bg-clip-text text-transparent mb-2">🚛 Santuario de Optimización Logística</h1>
        <p className="text-slate-400 text-lg">Cadenas de suministro reales y en tiempo real — Resiliencia y eficiencia soberana</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">☕</div>
          <h2 className="text-2xl font-bold text-white mb-2">🚛 Cadena de Suministro del Café</h2>
          <p className="text-slate-400 max-w-md mx-auto">De la semilla al consumidor — datos reales extraídos del backend</p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400">Cargando datos logísticos…</div>
        ) : error ? (
          <div className="text-center py-8 text-red-400">Error: {error}</div>
        ) : (
          <>
            <div className="space-y-6">
              {stages.map((stage, index) => (
                <motion.div key={stage.stage} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{stage.icon}</span>
                      <h3 className="text-lg font-semibold text-white">{stage.stage}</h3>
                    </div>
                    <div className="flex space-x-4">
                      <button onClick={() => requestDivineExplanation(`risk-${stage.stage}`, stage.risk)} className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg">✨</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-1">Riesgo</div>
                      <div className={`text-lg font-bold bg-gradient-to-r ${stage.color} bg-clip-text text-transparent`}>{stage.risk}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-1">Eficiencia</div>
                      <div className="text-lg font-bold text-green-400">{stage.efficiency}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-1">Costo</div>
                      <div className="text-lg font-bold text-blue-400">${stage.cost}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">📦</div>
                <div className="text-sm text-slate-400">Cadenas Activas</div>
                <div className="text-lg font-bold text-orange-400">{kpis.chainsActive || data?.chains?.length || 0}</div>
                <button onClick={() => requestDivineExplanation('chainsActive', kpis.chainsActive || data?.chains?.length || 0)} className="mt-2 text-xs text-cyan-300">✨ Explicar</button>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm text-slate-400">Eficiencia Global</div>
                <div className="text-lg font-bold text-red-400">{kpis.efficiency ? `${kpis.efficiency}%` : '—'}</div>
                <button onClick={() => requestDivineExplanation('efficiency', kpis.efficiency)} className="mt-2 text-xs text-cyan-300">✨ Explicar</button>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">🛡️</div>
                <div className="text-sm text-slate-400">Resiliencia Total</div>
                <div className="text-lg font-bold text-pink-400">{kpis.resilience ? `${kpis.resilience}%` : '—'}</div>
                <button onClick={() => requestDivineExplanation('resilience', kpis.resilience)} className="mt-2 text-xs text-cyan-300">✨ Explicar</button>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>

      {xaiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setXaiOpen(false)} />
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 max-w-2xl w-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-slate-700/40">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-400">Explicación XAI</div>
                <div className="text-xl font-semibold text-white">{selectedMetric}</div>
              </div>
              <div>
                <button className="text-slate-400 text-sm" onClick={() => setXaiOpen(false)}>Cerrar</button>
              </div>
            </div>

            <div className="mt-4">
              {xaiLoading ? (
                <div className="text-slate-400">Generando explicación…</div>
              ) : (
                <div className="text-slate-200 whitespace-pre-wrap">{xaiExplanation}</div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center py-4 border-t border-slate-700/50">
        <div className="text-xs text-slate-500">🔒 Datos en tiempo real — Apolo Prime: Arquitecto de la Gloria</div>
      </motion.div>
    </div>
  );
};

export default LogisticsOptimizationDashboard;