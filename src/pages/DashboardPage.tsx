import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProgressRing from '../components/dashboard/ProgressRing';
import DashboardWidget from '../components/generated/DashboardWidget';
import PhaseProgress from '../components/dashboard/PhaseProgress';
import ModuleCard from '../components/dashboard/ModuleCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  phases?: { name: string; progress: number; status: string }[];
  agents?: { id: string; name: string; status: string; lastRun: string }[];
};

const DashboardPage: React.FC = () => {
  const [platformStatus, setPlatformStatus] = useState<PlatformStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const viteEnv = (import.meta.env as { VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
    const runtimeGlobal = (globalThis as { VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
    const resolvedBase = viteEnv || runtimeGlobal || 'http://localhost:4000';
    const base = resolvedBase.endsWith('/') ? resolvedBase.slice(0, -1) : resolvedBase;

    Promise.all([
      fetch(`${base}/api/platform-status`).then(r => r.ok ? r.json().catch(()=>null) : null).catch(()=>null),
      fetch(`${base}/api/dashboard/overview`).then(r => r.ok ? r.json().catch(()=>null) : null).catch(()=>null)
    ]).then(([platform, overview]) => {
      // Merge data gracefully, providing sensible defaults for a richer UI even in offline mode
      const defaultStatus: PlatformStatus = {
        statusGeneral: 'OPERACIONAL',
        componentes: {
          apiPrincipal: { status: 'UP', latencia_ms: 120 },
          baseDeDatos: { status: 'UP', conexionesActivas: 12 },
          motorPredictivoIA: { status: 'UP', modelosCargados: 3 },
          pipelineDeDatos: { status: 'UP', ultimoIngreso: new Date().toISOString() }
        },
        analisisActivos: 42,
        alertasCriticas: 1,
        cargaDelSistema: 37,
        phases: [
          { name: 'Ingesta', progress: 100, status: 'completed' },
          { name: 'Preprocesamiento', progress: 80, status: 'in_progress' },
          { name: 'Inferencia', progress: 40, status: 'in_progress' },
          { name: 'Revisión', progress: 10, status: 'pending' }
        ],
        agents: [
          { id: 'a1', name: 'Detector de Anomalías', status: 'ready', lastRun: '5m' },
          { id: 'a2', name: 'Clasificador de Riesgo', status: 'running', lastRun: '2m' },
          { id: 'a3', name: 'Pipeline Agregador', status: 'idle', lastRun: '1h' }
        ]
      };

      const merged: PlatformStatus = { ...defaultStatus, ...(platform || {}), ...(overview || {}) } as PlatformStatus;
      setPlatformStatus(merged);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando dashboard...</div>;
  if (!platformStatus) return <div className="min-h-screen flex items-center justify-center">No hay datos</div>;

  const { analisisActivos, alertasCriticas, cargaDelSistema, componentes, statusGeneral, phases, agents } = platformStatus;

  // Sample data for chart - in real app, this would come from API
  const chartData = [
    { name: 'Análisis Activos', value: analisisActivos, color: '#3B82F6' },
    { name: 'Alertas Críticas', value: alertasCriticas, color: '#EF4444' },
    { name: 'Carga Sistema', value: cargaDelSistema, color: '#10B981' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-etherblue-dark to-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Centro de Mando Praevisio AI</h1>
          <div className="text-lg font-bold flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm ${statusGeneral === 'OPERACIONAL' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {statusGeneral}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-2 bg-etherblue-dark/60 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center space-x-6">
              <div>
                <ProgressRing progress={cargaDelSistema}>
                  <div className="text-sm text-gray-300">Carga del Sistema</div>
                  <div className="text-xl font-bold">{cargaDelSistema}%</div>
                </ProgressRing>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-etherblue-dark/50 rounded p-4">
                    <div className="text-sm text-gray-300">Análisis Activos</div>
                    <div data-testid="kpi-analisis" className="text-2xl font-bold">{analisisActivos}</div>
                  </div>
                  <div className="bg-etherblue-dark/50 rounded p-4">
                    <div className="text-sm text-gray-300">Alertas Críticas</div>
                    <div data-testid="kpi-alertas" className="text-2xl font-bold">{alertasCriticas}</div>
                  </div>
                  <div className="bg-etherblue-dark/50 rounded p-4">
                    <div className="text-sm text-gray-300">Base de Datos</div>
                    <div className="text-2xl font-bold">{componentes.baseDeDatos.status} ({componentes.baseDeDatos.conexionesActivas} conexiones)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DashboardWidget
            title="Métricas Adicionales"
            value={analisisActivos + alertasCriticas}
            description="Suma de análisis activos y alertas críticas"
          />

          <div className="bg-etherblue-dark/60 border border-gray-700 rounded-lg p-6">
            <h3 className="text-sm text-gray-300">Estado de Componentes</h3>
            <ul className="space-y-2">
              <li>API Principal: <span className="font-bold">{componentes.apiPrincipal.status}</span> <span className="text-xs text-gray-400">{componentes.apiPrincipal.latencia_ms} ms</span></li>
              <li>Motor IA: <span className="font-bold">{componentes.motorPredictivoIA.status}</span> <span className="text-xs text-gray-400">{componentes.motorPredictivoIA.modelosCargados} modelos</span></li>
              <li>Pipeline Datos: <span className="font-bold">{componentes.pipelineDeDatos.status}</span> <span className="text-xs text-gray-400">{componentes.pipelineDeDatos.ultimoIngreso}</span></li>
            </ul>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="bg-etherblue-dark/60 border border-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Métricas en Tiempo Real</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F9FAFB' }}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Phase progress and modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-etherblue-dark/60 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Ciclo de Vida del Evento</h3>
            <PhaseProgress phases={phases || []} />
          </div>
          <div className="bg-etherblue-dark/60 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Agentes y Módulos</h3>
            <div className="space-y-3">
              {agents && agents.map(a => (
                <ModuleCard key={a.id} name={a.name} type="Agente" status={a.status} currentTask={a.lastRun} progress={100} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
