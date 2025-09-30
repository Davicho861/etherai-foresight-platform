import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Globe, LayoutDashboard, Activity, Brain, Lightbulb, AlertCircle, Settings } from 'lucide-react';
import DashboardPage from '@/pages/DashboardPage';

type PlatformStatus = {
  statusGeneral: string;
  componentes: {
    apiPrincipal: { status: string; latencia_ms: number };
    baseDeDatos: { status: string; conexionesActivas: number };
    motorPredictivoIA: { status: string; modelosCargados: number };
    pipelineDeDatos: { status: string; ultimoIngreso: string };
  };
  analisisActivos: number;
  alertasCriticas: number;
  cargaDelSistema: number;
};

const StatusDot: React.FC<{ status: string }> = ({ status }) => {
  let color = 'bg-gray-400';
  if (status === 'ONLINE' || status === 'ACTIVO') color = 'bg-green-500';
  else if (status === 'DEGRADADO') color = 'bg-yellow-400';
  else if (status === 'OFFLINE' || status === 'INACTIVO') color = 'bg-red-500';
  return <span className={`inline-block w-2 h-2 rounded-full mr-2 ${color}`}></span>;
};

const NavItem: React.FC<{ to?: string; icon: React.ReactNode; label: string; collapsed: boolean; status?: string }> = ({ to = '#', icon, label, collapsed, status }) => (
  <Link to={to} className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700/40">
    <span className="w-5 h-5">{icon}</span>
    {!collapsed && <span className="flex items-center text-sm">{status && <StatusDot status={status} />}{label}</span>}
  </Link>
);

const CommandCenterLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));
  const [platformStatus, setPlatformStatus] = useState<PlatformStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  useEffect(() => {
    console.log('CommandCenterLayout useEffect');
    let timer: NodeJS.Timeout;
    const fetchStatus = async () => {
      try {
        const token = (typeof window !== 'undefined' && window.localStorage.getItem('praevisio_token')) || 'demo-token';
        console.log('token:', token);

        // Determine API base in a robust way:
        // 1) import.meta.env (Vite), 2) globalThis.VITE_API_BASE_URL (runtime injection),
        // 3) default to localhost:4000
        const viteEnv = (import.meta.env as { VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
        const runtimeGlobal = (globalThis as { VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
        const resolvedBase = viteEnv || runtimeGlobal || 'http://localhost:4000';

        // normalize: remove trailing slash if present
        const base = resolvedBase.endsWith('/') ? resolvedBase.slice(0, -1) : resolvedBase;

        // Always use absolute URL to prevent requests being routed to the frontend dev server
        const url = `${base}/api/platform-status`;
        console.log('fetching:', url);

        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        console.log('res.ok:', res.ok, 'status:', res.status);
        if (!res.ok) throw new Error('fetch_error');
        const json = await res.json();
        console.log('json:', json);
        setPlatformStatus(json);
      } catch (err) {
        console.log('fetch error:', err);
        setPlatformStatus(null);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchStatus();
    timer = setInterval(fetchStatus, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <aside className={`flex flex-col ${collapsed ? 'w-16' : 'w-64'} bg-etherblue-dark/80 text-white border-r border-gray-800 transition-all`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded">
              <Globe className="w-5 h-5" />
            </div>
            {!collapsed && <div className="font-bold">Praevisio AI</div>}
          </div>
          <button aria-label="collapse" onClick={() => setCollapsed(s => !s)} className="p-2 rounded hover:bg-white/5">
            {/* simple menu icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>

        {/* Estado General */}
        {!collapsed && (
          <div className="px-4 pb-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">{platformStatus ? platformStatus.statusGeneral : 'Cargando...'}</span>
              {platformStatus && <StatusDot status={platformStatus.statusGeneral === 'OPERACIONAL' ? 'ONLINE' : 'OFFLINE'} />}
            </div>
          </div>
        )}

        <nav className="flex-1 p-2 space-y-1">
          <NavItem to="/dashboard" icon={<LayoutDashboard />} label="Visión General" collapsed={collapsed} status={platformStatus?.componentes?.apiPrincipal?.status} />
          <NavItem to="#" icon={<Activity />} label="Análisis de Señales" collapsed={collapsed} status={platformStatus?.componentes?.pipelineDeDatos?.status} />
          <NavItem to="#" icon={<Brain />} label="Modelos Predictivos" collapsed={collapsed} status={platformStatus?.componentes?.motorPredictivoIA?.status} />
          <NavItem to="#" icon={<Lightbulb />} label="Generador de Escenarios" collapsed={collapsed} />
          <NavItem to="#" icon={<AlertCircle />} label="Reportes y Alertas" collapsed={collapsed} />
          <NavItem to="#" icon={<Settings />} label="Configuración" collapsed={collapsed} />
        </nav>

        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">A</div>
              {!collapsed && <div className="text-sm">Nombre de Analista<br/><span className="text-xs text-gray-300">Estratega de Riesgos</span></div>}
            </div>
            {!collapsed && (
              <button onClick={() => setDark(d => !d)} className="p-2 rounded hover:bg-white/5">
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <DashboardPage platformStatus={platformStatus} loadingStatus={loadingStatus} />
      </main>
    </div>
  );
};

export default CommandCenterLayout;
