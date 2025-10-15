import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import useRealtimeData from '../hooks/useRealtimeData';

type Plan = 'Starter' | 'Growth' | 'Panteon';

const Sidebar: React.FC<{ plan: Plan; setPlan: (p: Plan) => void }> = ({ plan, setPlan }) => {
  return (
    <aside className="w-64 bg-gemini-background text-gemini-text-primary h-screen p-4 border-r border-gemini-border">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gemini-primary">Praevisio AI</h1>
        <div className="text-xs text-gemini-text-secondary">Dashboard Soberano</div>
      </div>
      <div className="mb-4">
        <div className="text-sm text-gemini-text-secondary mb-2">Plan Activo</div>
        <div className="flex flex-col gap-2">
          {(['Starter','Growth','Panteon'] as Plan[]).map((p) => (
            <button key={p} onClick={() => setPlan(p)} className={`text-left px-3 py-2 rounded transition-all duration-200 ${p===plan? 'bg-gemini-primary text-gemini-background': 'hover:bg-gemini-background-secondary text-gemini-text-primary'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
      <nav className="mt-6 text-sm text-gemini-text-secondary">
        <a href="/dashboard" className="block py-2 hover:text-gemini-primary transition-colors">Dashboard</a>
        <a href="/sdlc-dashboard" className="block py-2 hover:text-gemini-primary transition-colors">SDLC</a>
        <a href="/demo" className="block py-2 hover:text-gemini-primary transition-colors">Demo</a>
      </nav>
    </aside>
  );
};

const Widget: React.FC<{ title: string; value?: string | number; children?: React.ReactNode; enabled?: boolean }> = ({ title, value, children, enabled=true }) => (
  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`gemini-card ${enabled ? '' : 'opacity-40 grayscale'}`}>
    <div className="text-sm text-gemini-text-secondary">{title}</div>
    <div className="text-2xl font-bold text-gemini-text-primary mt-2">{value ?? children}</div>
  </motion.div>
);

const DashboardPage: React.FC = () => {
  const [plan, setPlan] = useState<Plan>('Starter');
  const { data: live, loading, error, refresh } = useRealtimeData('/api/demo/live-state');

  const planConfig = useMemo(() => {
    switch(plan) {
      case 'Starter': return { widgets: ['uptime','kpi'] };
      case 'Growth': return { widgets: ['uptime','kpi','risk','kanban'] };
      case 'Panteon': return { widgets: ['uptime','kpi','risk','kanban','oracles'] };
    }
  }, [plan]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gemini-background">
        <div className="bg-red-900/20 border border-red-700/50 text-gemini-text-primary p-6 rounded-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex bg-gemini-background text-gemini-text-primary min-h-screen">
      <Sidebar plan={plan} setPlan={setPlan} />
      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gemini-primary">Dashboard Soberano</h2>
            <div className="text-sm text-gemini-text-secondary">Plan activo: {plan}</div>
          </div>
          <div className="text-sm text-gemini-text-secondary">{loading ? 'Actualizando datos...' : `Última actualización: ${new Date().toLocaleTimeString()}`}</div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Widget title="Uptime" value={(live as any)?.uptime ?? '—'} enabled={planConfig.widgets.includes('uptime')} />
          <Widget title="KPI Principal" value={(live as any)?.kpi?.main ?? '—'} enabled={planConfig.widgets.includes('kpi')} />
          <Widget title="Índice de Riesgo" value={(live as any)?.risk ?? '—'} enabled={planConfig.widgets.includes('risk')} />
        </section>

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="gemini-card">
            <h3 className="text-lg font-semibold mb-4 text-gemini-primary">Kanban Interactivo</h3>
            {planConfig.widgets.includes('kanban') ? (
              <pre className="text-xs text-gemini-text-secondary">{JSON.stringify((live as any)?.kanban ?? { columns: [] }, null, 2)}</pre>
            ) : (
              <div className="text-sm text-gemini-text-muted">Disponible en plan Growth</div>
            )}
          </div>

          <div className="gemini-card">
            <h3 className="text-lg font-semibold mb-4 text-gemini-primary">Oráculos de Inteligencia</h3>
            {planConfig.widgets.includes('oracles') ? (
              <pre className="text-xs text-gemini-text-secondary">{JSON.stringify((live as any)?.oracles ?? {}, null, 2)}</pre>
            ) : (
              <div className="text-sm text-gemini-text-muted">Disponible en plan Panteón</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
