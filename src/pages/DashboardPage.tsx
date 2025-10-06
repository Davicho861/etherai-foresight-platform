import React from 'react';
import Navbar from '../components/Navbar';
import ProgressRing from '../components/dashboard/ProgressRing';
import DashboardWidget from '../components/generated/DashboardWidget';
import CIMetricsWidget from '../components/dashboard/CIMetricsWidget';
import ClimateWidget from '../components/ClimateWidget';
import ProphecyWidget from '../components/ProphecyWidget';
// cargado dinámico del simulador para evitar romper el build server-side
let getEternalState: (() => any) | null = null;
try {
   
  // require is used so this import is ignored during SSR/static build
   
  const sim = require('../lib/eternalVigilanceSimulator');
  getEternalState = sim.getCurrentState;
} catch {
  // no-op: si no existe en tiempo de build, lo dejamos null
}

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

interface DashboardPageProps {
  platformStatus: PlatformStatus | null;
  loadingStatus: boolean;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ platformStatus, loadingStatus }) => {
  console.log('DashboardPage render:', { platformStatus, loadingStatus });
  // Si loadingStatus, mostrar cargando
  if (loadingStatus) return <div className="min-h-screen flex items-center justify-center">Cargando dashboard...</div>;
  if (!platformStatus) return <div className="min-h-screen flex items-center justify-center">No hay datos</div>;

  // KPIs y datos del endpoint
  const { analisisActivos, alertasCriticas, cargaDelSistema, componentes, statusGeneral } = platformStatus;

  return (
    <div className="min-h-screen bg-etherblue-dark text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Centro de Mando Praevisio AI</h1>
          <div className="text-lg font-bold flex items-center space-x-2">
            <span className={statusGeneral === 'OPERACIONAL' ? 'text-green-400' : 'text-red-400'}>{statusGeneral}</span>
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
                    <div className="text-2xl font-bold">{analisisActivos}</div>
                  </div>
                  <div className="bg-etherblue-dark/50 rounded p-4">
                    <div className="text-sm text-gray-300">Alertas Críticas</div>
                    <div className="text-2xl font-bold">{alertasCriticas}</div>
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

        <CIMetricsWidget />

        {/* Resumen rápido de Metatrón */}
        <div className="mt-6 bg-etherblue-dark/60 border border-gray-700 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-300">Metatrón - Vigilia Eterna</div>
            <div className="text-lg font-bold">{getEternalState ? `${getEternalState().indices.globalRisk}% riesgo global` : 'Vigilia inactiva'}</div>
          </div>
          <div className="flex items-center space-x-2">
            <a href="/metatron-panel" className="bg-etherblue-600 hover:bg-etherblue-500 px-3 py-2 rounded">Abrir Metatrón</a>
          </div>
        </div>

        <div className="mt-8">
          <ClimateWidget />
        </div>

        <ProphecyWidget />
      </main>
    </div>
  );
};

export default DashboardPage;
