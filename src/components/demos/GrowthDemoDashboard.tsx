import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StarterDemoDashboard from './StarterDemoDashboard';
import MissionGallery from '@/components/MissionGallery';
import CommunityResilienceWidget from '@/components/CommunityResilienceWidget';
import FoodSecurityDashboard from '@/components/FoodSecurityDashboard';
import { Button } from '@/components/ui/button';

interface LiveData { kpis: any; countries: any[]; communityResilience?: any; foodSecurity?: any; lastUpdated?: string }

const GrowthDemoDashboard: React.FC<{ data: LiveData }> = ({ data }) => {
  const [simResult, setSimResult] = useState<number | null>(null);

  const runQuickSimulation = () => {
    // Quick deterministic simulated result for demo
    const base = 40 + (data.kpis.coberturaRegional || 0) * 2;
    setSimResult(Math.min(99, base));
  };

  return (
    <div className="space-y-6">
      <StarterDemoDashboard data={data} />

      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Growth — Panel de Simulación</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">Ejecuta una simulación interactiva y obtén una explicación resumida.</p>
          <div className="mt-4 flex gap-3">
            <Button onClick={runQuickSimulation} className="bg-green-600">Ejecutar Simulación</Button>
            <Button variant="outline">Exportar Resultados</Button>
          </div>
          {simResult !== null && (
            <div className="mt-4 p-3 bg-gray-700 rounded">
              <div className="text-white font-semibold">Resultado Simulado: Riesgo {simResult}%</div>
              <div className="text-gray-300">Explicación: combinación de variables climáticas y económicas internas.</div>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Sinfonía Extendida</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Resiliencia Comunitaria</CardTitle>
            </CardHeader>
            <CardContent>
              <CommunityResilienceWidget resilienceData={data.communityResilience} />
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Seguridad Alimentaria</CardTitle>
            </CardHeader>
            <CardContent>
              <FoodSecurityDashboard foodSecurityData={data.foodSecurity} />
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Galería Completa</CardTitle>
            </CardHeader>
            <CardContent>
              <MissionGallery />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-4 bg-amber-900/10 rounded-lg border-l-4 border-amber-400">
        <strong className="text-white">Upgrade a Panteón</strong>
        <p className="text-gray-300">Accede a simulaciones ilimitadas, SDLC y vectores éticos en tiempo real.</p>
      </div>
    </div>
  );
};

export default GrowthDemoDashboard;
