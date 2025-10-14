import React from 'react';
import StarterDemoDashboard from './StarterDemoDashboard';
import GrowthDemoDashboard from './GrowthDemoDashboard';
import EthicalVectorDisplay from '@/components/EthicalVectorDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LiveData { kpis: any; countries: any[]; communityResilience?: any; foodSecurity?: any; ethicalAssessment?: any }

const PantheonDemoDashboard: React.FC<{ data: LiveData }> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Reuse Growth (which includes Starter) */}
      <GrowthDemoDashboard data={data} />

      <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Panteón — SDLC / Meta-Gobernanza</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">Panel de gobernanza del sistema: seguimiento de despliegues, modelos y métricas de ciclo de vida.</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-700 rounded">
              <div className="text-sm text-gray-300">Modelos Activos</div>
              <div className="text-white font-semibold">3</div>
            </div>
            <div className="p-3 bg-gray-700 rounded">
              <div className="text-sm text-gray-300">Deploys Último Mes</div>
              <div className="text-white font-semibold">12</div>
            </div>
            <div className="p-3 bg-gray-700 rounded">
              <div className="text-sm text-gray-300">Alertas de Sesgo</div>
              <div className="text-white font-semibold">1</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Vector Ético en Tiempo Real</CardTitle>
        </CardHeader>
        <CardContent>
          <EthicalVectorDisplay ethicalAssessment={data.ethicalAssessment} />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-800 to-pink-800 text-white">
        <CardContent>
          <h3 className="text-xl font-bold">Visualizaciones Cuánticas</h3>
          <p className="text-gray-200">Explora visualizaciones avanzadas y análisis multi-dimensional en tiempo real.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PantheonDemoDashboard;
