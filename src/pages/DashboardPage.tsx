import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import useLiveState from '../hooks/useLiveState';

type Plan = 'Starter' | 'Growth' | 'Panteon';

const fetchLiveState = async () => {
  const res = await fetch('/api/demo/live-state');
  if (!res.ok) throw new Error('Failed fetching live-state');
  return res.json();
};

const Sidebar: React.FC<{ plan: Plan; setPlan: (p: Plan) => void }> = ({ plan, setPlan }) => {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4 border-r border-gray-800">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Sovereign</h1>
        <div className="text-xs text-gray-400">Dashboard Unificado</div>
      </div>
      <div className="mb-4">
        <div className="text-sm text-gray-300 mb-2">Plan</div>
        <div className="flex flex-col gap-2">
          {(['Starter','Growth','Panteon'] as Plan[]).map((p) => (
            <button key={p} onClick={() => setPlan(p)} className={`text-left px-3 py-2 rounded ${p===plan? 'bg-blue-600': 'hover:bg-gray-800'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
      <nav className="mt-6 text-sm text-gray-300">
        <a href="/dashboard" className="block py-2">Dashboard</a>
        <a href="/sdlc-dashboard" className="block py-2">SDLC</a>
        <a href="/demo" className="block py-2">Demo</a>
      </nav>
    </aside>
  );
};

const Widget: React.FC<{ title: string; value?: string | number; children?: React.ReactNode; enabled?: boolean }> = ({ title, value, children, enabled=true }) => (
  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`bg-gray-800 rounded-lg p-4 border border-gray-700 ${enabled ? '' : 'opacity-40 grayscale'}`}>
    <div className="text-sm text-gray-400">{title}</div>
    <div className="text-2xl font-bold text-white mt-2">{value ?? children}</div>
  </motion.div>
);

const DashboardPage: React.FC = () => {
  const [plan, setPlan] = useState<Plan>('Starter');
  const { data: live, loading, error, refresh } = useLiveState();

  const planConfig = useMemo(() => {
    switch(plan) {
      case 'Starter': return { widgets: ['uptime','kpi'] };
      case 'Growth': return { widgets: ['uptime','kpi','risk','kanban'] };
      case 'Panteon': return { widgets: ['uptime','kpi','risk','kanban','oracles'] };
    }
  }, [plan]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-900 text-white p-6 rounded">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-950 text-white min-h-screen">
      <Sidebar plan={plan} setPlan={setPlan} />
      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Dashboard Unificado</h2>
            <div className="text-sm text-gray-400">Plan activo: {plan}</div>
          </div>
          <div className="text-sm text-gray-400">{loading ? 'Cargando...' : `Última: ${new Date().toLocaleTimeString()}`}</div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Widget title="Uptime" value={live?.uptime ?? '—'} enabled={planConfig.widgets.includes('uptime')} />
          <Widget title="KPI Principal" value={live?.kpi?.main ?? '—'} enabled={planConfig.widgets.includes('kpi')} />
          <Widget title="Índice de Riesgo" value={live?.risk ?? '—'} enabled={planConfig.widgets.includes('risk')} />
        </section>

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Kanban</h3>
            {planConfig.widgets.includes('kanban') ? (
              <pre className="text-xs text-gray-300">{JSON.stringify(live?.kanban ?? { columns: [] }, null, 2)}</pre>
            ) : (
              <div className="text-sm text-gray-400">Disponible en plan Growth</div>
            )}
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Oráculos</h3>
            {planConfig.widgets.includes('oracles') ? (
              <pre className="text-xs text-gray-300">{JSON.stringify(live?.oracles ?? {}, null, 2)}</pre>
            ) : (
              <div className="text-sm text-gray-400">Disponible en plan Panteón</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
