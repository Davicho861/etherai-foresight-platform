import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StarterDemoDashboard from './StarterDemoDashboard';
import MissionGallery from '@/components/MissionGallery';
import CommunityResilienceWidget from '@/components/CommunityResilienceWidget';
import FoodSecurityDashboard from '@/components/FoodSecurityDashboard';
import { Button } from '@/components/ui/button';
import { Play, Download, Zap, BarChart3, Users, Wheat, Activity, TrendingUp, Target, Settings } from 'lucide-react';

interface LiveData { kpis: any; countries: any[]; communityResilience?: any; foodSecurity?: any; lastUpdated?: string }

const GrowthDemoDashboard: React.FC<{ data: LiveData }> = ({ data }) => {
  const [simResult, setSimResult] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runQuickSimulation = async () => {
    setIsSimulating(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Quick deterministic simulated result for demo
    const base = 40 + (data.kpis.coberturaRegional || 0) * 2;
    setSimResult(Math.min(99, base));
    setIsSimulating(false);
  };

  return (
    <div className="space-y-8">
      {/* Header Section - Microsoft Style */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-400 text-sm font-medium">Plan Growth Activo</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Laboratorio de Análisis Avanzado</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Simulaciones causales interactivas y análisis predictivo avanzado para decisiones estratégicas en tiempo real.
        </p>
      </div>

      {/* Include Starter Dashboard */}
      <StarterDemoDashboard data={data} />

      {/* Advanced Simulation Panel - Amazon Style */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
              <span>Simulador Causal Interactivo</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                IA Activa
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Parámetros de Simulación</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">Inflación LATAM</span>
                  <span className="text-cyan-400 font-medium">+2.3%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">Sequía Regional</span>
                  <span className="text-yellow-400 font-medium">Moderada</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">Eventos Sociales</span>
                  <span className="text-purple-400 font-medium">Estables</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Resultados en Tiempo Real</h4>
              <div className="space-y-3">
                {simResult !== null ? (
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">Riesgo Calculado</span>
                      <span className={`text-lg font-bold ${simResult > 70 ? 'text-red-400' : simResult > 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {simResult}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-300">
                      Combinación de variables climáticas, económicas y sociales con análisis causal predictivo.
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-600 text-center">
                    <BarChart3 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-gray-400">Ejecuta una simulación para ver resultados</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700/50">
            <Button
              onClick={runQuickSimulation}
              disabled={isSimulating}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              {isSimulating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Ejecutar Simulación</span>
                </>
              )}
            </Button>
            <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700/50 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Exportar Reporte</span>
            </Button>
            <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700/50 flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Configurar Parámetros</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Extended Symphony - Apple Style Grid */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Sinfonía Analítica Extendida</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-green-500/30 transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center space-x-3">
                  <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <span>Resiliencia Comunitaria</span>
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <CommunityResilienceWidget resilienceData={data.communityResilience} />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center space-x-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                    <Wheat className="w-5 h-5 text-yellow-400" />
                  </div>
                  <span>Seguridad Alimentaria</span>
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <FoodSecurityDashboard foodSecurityData={data.foodSecurity} />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                    <Activity className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span>Galería de Misiones</span>
                </CardTitle>
                <div className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
                  Completa
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <MissionGallery />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upgrade CTA - Amazon Style */}
      <Card className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 backdrop-blur-xl border border-purple-500/30">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20 mb-4">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">Próximo Nivel</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Ascender al Panteón</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Acceda a simulaciones ilimitadas, gobernanza SDLC completa, vectores éticos en tiempo real y arquitectura de agentes soberanos.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">$1,999</div>
                <div className="text-sm text-gray-400">por mes</div>
              </div>
              <div className="border-l border-gray-600 pl-4">
                <div className="text-sm text-gray-300 space-y-1">
                  <div>✓ Simulaciones Ilimitadas</div>
                  <div>✓ SDLC Completo</div>
                  <div>✓ Vectores Éticos IA</div>
                  <div>✓ Arquitectura Soberana</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthDemoDashboard;
