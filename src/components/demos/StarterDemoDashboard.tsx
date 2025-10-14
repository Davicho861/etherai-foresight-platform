import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MissionGallery from '@/components/MissionGallery';
import AnimatedMetric from '@/components/AnimatedMetrics';
import { TrendingUp, Activity, Globe, Target } from 'lucide-react';

interface LiveData {
  kpis: any;
  countries: Array<any>;
  lastUpdated?: string;
}

const StarterDemoDashboard: React.FC<{ data: LiveData }> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Header Section - Apple Style */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">Plan Starter Activo</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Centro de Comando Básico</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Monitoreo esencial con métricas clave y alertas fundamentales para toma de decisiones informadas.
        </p>
      </div>

      {/* KPIs Grid - Microsoft Style Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 hover:border-green-500/30 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">
                <AnimatedMetric value={data.kpis.precisionPromedio} suffix="%" />
              </div>
              <div className="text-sm text-gray-400 font-medium">Precisión Promedio</div>
              <div className="text-xs text-green-400">↑ 2.1% vs mes anterior</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">
                <AnimatedMetric value={data.kpis.prediccionesDiarias} suffix="K" />
              </div>
              <div className="text-sm text-gray-400 font-medium">Predicciones Diarias</div>
              <div className="text-xs text-blue-400">↑ 8.5% vs mes anterior</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">
                <AnimatedMetric value={data.kpis.monitoreoContinuo} suffix="/7" />
              </div>
              <div className="text-sm text-gray-400 font-medium">Monitoreo Continuo</div>
              <div className="text-xs text-purple-400">24/7 activo</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                <Globe className="w-6 h-6 text-cyan-400" />
              </div>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">
                <AnimatedMetric value={data.kpis.coberturaRegional} suffix="" />
              </div>
              <div className="text-sm text-gray-400 font-medium">Países LATAM</div>
              <div className="text-xs text-cyan-400">Cobertura completa</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Preview - Amazon Style */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Globe className="w-5 h-5 text-orange-400" />
              </div>
              <span>Mapa de Riesgo Global</span>
            </CardTitle>
            <div className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
              Vista Previa
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900/50 rounded-xl p-8 text-center border-2 border-dashed border-slate-600">
            <Globe className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Mapa Interactivo LATAM</h3>
            <p className="text-gray-400 mb-4">
              Visualización completa disponible en la página principal con niveles de riesgo por país en tiempo real.
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-400">Alto Riesgo</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-400">Medio Riesgo</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400">Bajo Riesgo</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mission Gallery - Apple Style */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Activity className="w-5 h-5 text-indigo-400" />
              </div>
              <span>Galería de Misiones</span>
            </CardTitle>
            <div className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
              Limitado a 2
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <p className="text-indigo-300 text-sm">
              Acceso limitado a los 2 análisis de misión más recientes. Actualice a Growth para acceso completo.
            </p>
          </div>
          <MissionGallery limit={2} />
        </CardContent>
      </Card>

      {/* Upgrade CTA - Amazon Style */}
      <Card className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/30">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 mb-4">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Actualización Recomendada</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Evolucione a Growth</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Desbloquee análisis causal avanzado, simulaciones interactivas y acceso completo a todas las misiones históricas.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">$249</div>
                <div className="text-sm text-gray-400">por mes</div>
              </div>
              <div className="border-l border-gray-600 pl-4">
                <div className="text-sm text-gray-300 space-y-1">
                  <div>✓ Simulaciones Interactivas</div>
                  <div>✓ Análisis Causal Completo</div>
                  <div>✓ Galería de Misiones Ilimitada</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StarterDemoDashboard;
