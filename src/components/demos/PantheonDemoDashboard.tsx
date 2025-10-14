import React, { useState } from 'react';
import StarterDemoDashboard from './StarterDemoDashboard';
import GrowthDemoDashboard from './GrowthDemoDashboard';
import EthicalVectorDisplay from '@/components/EthicalVectorDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Shield, Brain, Zap, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock, Server, Database, Cpu, Eye, Target, Settings, Play } from 'lucide-react';

interface LiveData { kpis: any; countries: any[]; communityResilience?: any; foodSecurity?: any; ethicalAssessment?: any; global?: any }

const PantheonDemoDashboard: React.FC<{ data: LiveData }> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'governance' | 'ethics' | 'quantum'>('governance');

  return (
    <div className="space-y-8">
      {/* Header Section - Apple/Microsoft Hybrid */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-2 rounded-full border border-purple-500/20 mb-4">
          <Crown className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 text-sm font-medium">Panteón Soberano Activo</span>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent mb-2">
          Sala del Trono Digital
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto">
          Gobernanza absoluta del sistema predictivo. Arquitectura de agentes soberanos, vectores éticos cuánticos y ciclo de vida completo del desarrollo.
        </p>
      </div>

      {/* Include Growth Dashboard (which includes Starter) */}
      <GrowthDemoDashboard data={data} />

      {/* Sovereign Governance Tabs - Microsoft Style */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <span>Gobernanza Soberana del Sistema</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                Arquitectura Omega
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-4">
            {[
              { id: 'governance', label: 'SDLC Gobernanza', icon: Shield },
              { id: 'ethics', label: 'Vectores Éticos', icon: Brain },
              { id: 'quantum', label: 'Visualizaciones Cuánticas', icon: Zap }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {activeTab === 'governance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <Server className="w-5 h-5 text-blue-400" />
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">3</div>
                  <div className="text-sm text-gray-400">Modelos Activos</div>
                  <div className="text-xs text-green-400 mt-1">↑ 1 vs mes anterior</div>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-sm text-gray-400">Deploys Último Mes</div>
                  <div className="text-xs text-green-400 mt-1">↑ 3 vs mes anterior</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-4 rounded-lg border border-yellow-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <TrendingUp className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">1</div>
                  <div className="text-sm text-gray-400">Alertas de Sesgo</div>
                  <div className="text-xs text-green-400 mt-1">↓ 2 vs mes anterior</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime Sistema</div>
                  <div className="text-xs text-green-400 mt-1">Estable</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Database className="w-5 h-5 text-cyan-400" />
                    <span>Estado de Componentes</span>
                  </h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Motor Predictivo IA', status: 'ONLINE', latency: '45ms' },
                      { name: 'Pipeline de Datos', status: 'ONLINE', latency: '120ms' },
                      { name: 'Base de Datos Prisma', status: 'ONLINE', latency: '15ms' },
                      { name: 'Cache Redis', status: 'ONLINE', latency: '2ms' }
                    ].map((component, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${component.status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-gray-300">{component.name}</span>
                        </div>
                        <span className="text-sm text-gray-400">{component.latency}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    <span>Actividad Reciente</span>
                  </h4>
                  <div className="space-y-3">
                    {[
                      { action: 'Deploy modelo v2.1.4', time: '2 min ago', status: 'success' },
                      { action: 'Validación ética completada', time: '15 min ago', status: 'success' },
                      { action: 'Backup automático', time: '1 hour ago', status: 'success' },
                      { action: 'Análisis de sesgo', time: '3 hours ago', status: 'warning' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <span className="text-gray-300 text-sm">{activity.action}</span>
                        </div>
                        <span className="text-xs text-gray-400">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ethics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-3">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <span>Vector Ético Cuántico</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EthicalVectorDisplay ethicalAssessment={data.ethicalAssessment} />
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Evaluaciones Éticas Activas</h4>
                  <div className="space-y-3">
                    {[
                      { metric: 'Impacto Social', score: 94, status: 'Excelente' },
                      { metric: 'Sesgo Algorítmico', score: 87, status: 'Bueno' },
                      { metric: 'Transparencia', score: 91, status: 'Excelente' },
                      { metric: 'Privacidad', score: 89, status: 'Bueno' }
                    ].map((evaluation, index) => (
                      <div key={index} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300 font-medium">{evaluation.metric}</span>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            evaluation.status === 'Excelente' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {evaluation.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-slate-600 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              style={{ width: `${evaluation.score}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400">{evaluation.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quantum' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Visualizaciones Cuánticas Avanzadas</h3>
                <p className="text-gray-400">Análisis multi-dimensional en tiempo real con procesamiento cuántico</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="p-4 bg-cyan-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">Análisis 4D</h4>
                    <p className="text-gray-400 text-sm mb-4">Visualización temporal multi-variable</p>
                    <Button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30">
                      Explorar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="p-4 bg-purple-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Target className="w-8 h-8 text-purple-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">Predicciones Probabilísticas</h4>
                    <p className="text-gray-400 text-sm mb-4">Escenarios múltiples con confianza</p>
                    <Button className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30">
                      Explorar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="p-4 bg-green-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-green-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">Optimización Cuántica</h4>
                    <p className="text-gray-400 text-sm mb-4">Algoritmos de máxima eficiencia</p>
                    <Button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30">
                      Explorar
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-purple-800/20 via-pink-800/20 to-cyan-800/20 rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Cpu className="w-6 h-6 text-purple-400" />
                    <h4 className="text-xl font-bold text-white">Procesamiento Cuántico Activo</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">Online</span>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  Sistema de visualizaciones avanzadas procesando datos en tiempo real con algoritmos cuánticos optimizados.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">1.2M</div>
                    <div className="text-sm text-gray-400">Puntos de Datos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">47</div>
                    <div className="text-sm text-gray-400">Dimensiones</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pink-400">0.3s</div>
                    <div className="text-sm text-gray-400">Latencia</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">99.7%</div>
                    <div className="text-sm text-gray-400">Precisión</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supreme Status - Amazon Style */}
      <Card className="bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-cyan-600/30 backdrop-blur-xl border border-purple-500/40">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-2 rounded-full border border-purple-500/20 mb-4">
              <Crown className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">Soberanía Absoluta Alcanzada</span>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent mb-3">
              Dominio Completo del Sistema
            </h3>
            <p className="text-gray-300 mb-6 max-w-3xl mx-auto">
              Has alcanzado el nivel máximo de evolución. La arquitectura Metatrón Omega opera con soberanía total,
              gobernanza ética cuántica y visualizaciones predictivas de máxima precisión.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">∞</div>
                <div className="text-sm text-gray-400">Simulaciones Ilimitadas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-400">100%</div>
                <div className="text-sm text-gray-400">Soberanía Arquitectural</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400">Ω</div>
                <div className="text-sm text-gray-400">Metatrón Omega</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PantheonDemoDashboard;
