import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MissionGallery from '@/components/MissionGallery';
import AnimatedMetric from '@/components/AnimatedMetrics';

interface LiveData {
  kpis: any;
  countries: Array<any>;
  lastUpdated?: string;
}

const StarterDemoDashboard: React.FC<{ data: LiveData }> = ({ data }) => {
  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Starter — KPIs Esenciales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <AnimatedMetric value={data.kpis.precisionPromedio} suffix="%" />
              <div className="text-gray-400">Precisión Promedio</div>
            </div>
            <div className="text-center">
              <AnimatedMetric value={data.kpis.prediccionesDiarias} suffix="K" />
              <div className="text-gray-400">Predicciones Diarias</div>
            </div>
            <div className="text-center">
              <AnimatedMetric value={data.kpis.monitoreoContinuo} suffix="/7" />
              <div className="text-gray-400">Monitoreo</div>
            </div>
            <div className="text-center">
              <AnimatedMetric value={data.kpis.coberturaRegional} suffix=" Países" />
              <div className="text-gray-400">Cobertura</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Mapa de Riesgo (Preview)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">Mapa interactivo reducido disponible en la página principal. Muestra niveles de riesgo por país.</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Galería de Misiones (Limitada)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-3">Acceso a los 2 Task Replays más recientes.</p>
          <MissionGallery limit={2} />
        </CardContent>
      </Card>

      <div className="p-4 bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
        <strong className="text-white">Mejora a Growth</strong>
        <p className="text-gray-300">Desbloquea análisis causal y simulaciones interactivas.</p>
      </div>
    </div>
  );
};

export default StarterDemoDashboard;
